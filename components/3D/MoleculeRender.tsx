import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Molecule, AtomData, BondData, AtomType } from '../../types';
import { ATOM_COLORS, ATOM_RADII } from '../../constants';

interface MoleculeRenderProps {
  molecule: Molecule;
  showLabels?: boolean;
}

const AtomMesh: React.FC<{ atom: AtomData; showLabel: boolean }> = ({ atom, showLabel }) => {
  return (
    <group position={new THREE.Vector3(...atom.position)}>
      <Sphere args={[ATOM_RADII[atom.type], 32, 32]}>
        <meshStandardMaterial 
          color={ATOM_COLORS[atom.type]} 
          roughness={0.2} 
          metalness={0.3}
        />
      </Sphere>
      {/* Glow Effect */}
      <Sphere args={[ATOM_RADII[atom.type] * 1.2, 16, 16]} visible={false}>
         <meshBasicMaterial color={ATOM_COLORS[atom.type]} transparent opacity={0.1} />
      </Sphere>
      {showLabel && (
        <Text
          position={[0, ATOM_RADII[atom.type] + 0.3, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {atom.type}
        </Text>
      )}
    </group>
  );
};

const BondMesh: React.FC<{ start: [number, number, number]; end: [number, number, number]; type: string }> = ({ start, end, type }) => {
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const direction = new THREE.Vector3().subVectors(endVec, startVec);
  const length = direction.length();
  const orientation = new THREE.Matrix4();
  
  // Align cylinder to direction
  const axis = new THREE.Vector3(0, 1, 0);
  orientation.lookAt(startVec, endVec, axis);
  const offsetRotation = new THREE.Quaternion();
  offsetRotation.setFromUnitVectors(axis, direction.normalize());

  const position = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
  
  // Bond thickness based on type
  const radius = type === 'double' ? 0.15 : (type === 'triple' ? 0.2 : 0.08);

  return (
    <group position={position} quaternion={offsetRotation}>
      <Cylinder args={[radius, radius, length, 12]}>
        <meshStandardMaterial color="#888888" roughness={0.4} metalness={0.6} />
      </Cylinder>
    </group>
  );
};

export const MoleculeRender: React.FC<MoleculeRenderProps> = ({ molecule, showLabels = true }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005; // Auto rotate slow
    }
  });

  const atomsMap = useMemo(() => {
    return molecule.atoms.reduce((acc, atom) => {
      acc[atom.id] = atom;
      return acc;
    }, {} as Record<string, AtomData>);
  }, [molecule]);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef}>
        {molecule.atoms.map((atom) => (
          <AtomMesh key={atom.id} atom={atom} showLabel={showLabels} />
        ))}
        {molecule.bonds.map((bond, idx) => {
          const start = atomsMap[bond.from]?.position;
          const end = atomsMap[bond.to]?.position;
          if (start && end) {
            return <BondMesh key={idx} start={start} end={end} type={bond.type} />;
          }
          return null;
        })}
      </group>
    </Float>
  );
};
