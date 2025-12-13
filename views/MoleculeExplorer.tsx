import React, { useState, Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Stars } from '@react-three/drei';
import { MOLECULES } from '../constants';
import { MoleculeRender } from '../components/3D/MoleculeRender';
import { Molecule } from '../types';
import { Info, Maximize2, Folder, CameraOff, Loader2, Camera, X } from 'lucide-react';
import { useAI } from '../components/AIContext';

export const MoleculeExplorer: React.FC = () => {
  const [selectedMolecule, setSelectedMolecule] = useState<Molecule>(MOLECULES[0]);
  const [arMode, setArMode] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<'idle' | 'loading' | 'active' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { askAI } = useAI();

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (!arMode) {
      stopCamera();
      setCameraStatus('idle');
    }
  }, [arMode]);

  const startCamera = async () => {
    setCameraStatus('loading');
    setErrorMessage('');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraStatus('error');
      setErrorMessage("Camera API not supported in this browser. Ensure you are using HTTPS.");
      return;
    }

    try {
      const constraints = {
        audio: false,
        video: {
          facingMode: 'environment'
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
            .then(() => setCameraStatus('active'))
            .catch(e => {
              console.error("Video play failed", e);
              setCameraStatus('error');
              setErrorMessage("Failed to start video stream.");
            });
        };
      }
    } catch (err: any) {
      console.error("Camera permission error", err);
      // Fallback: try without specific constraints if environment failed
      if (err.name === 'OverconstrainedError') {
         try {
            const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            streamRef.current = fallbackStream;
            if (videoRef.current) {
                videoRef.current.srcObject = fallbackStream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play()
                    .then(() => setCameraStatus('active'))
                    .catch(() => setCameraStatus('error'));
                };
            }
            return;
         } catch (e) {
             // Fallback failed
         }
      }

      setCameraStatus('error');
      setErrorMessage(err.name === 'NotAllowedError' 
        ? "Camera permission denied. Please check site settings." 
        : "Could not access camera: " + err.message);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleArToggle = () => {
    if (arMode) {
      setArMode(false);
    } else {
      setArMode(true);
      // Immediately try to start camera on toggle for better UX, 
      // as this is a user-initiated event.
      startCamera();
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      {/* List Panel */}
      <div className="w-full md:w-80 flex flex-col gap-4">
        <div className="glass-panel p-4 rounded-xl">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Folder className="text-neon-blue" /> Library
          </h3>
          <div className="space-y-2">
            {MOLECULES.map(mol => (
              <button
                key={mol.id}
                onClick={() => setSelectedMolecule(mol)}
                className={`w-full text-left p-3 rounded-lg transition-all border ${
                  selectedMolecule.id === mol.id
                  ? 'bg-neon-blue/10 border-neon-blue text-white shadow-[0_0_10px_rgba(0,243,255,0.2)]'
                  : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                }`}
              >
                <div className="font-bold">{mol.name}</div>
                <div className="text-xs text-gray-500 font-mono">{mol.formula}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex-1 flex flex-col">
          <h3 className="text-lg font-bold mb-2">{selectedMolecule.name}</h3>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">{selectedMolecule.description}</p>
          <div className="mt-auto grid grid-cols-2 gap-2">
            <div className="bg-black/40 p-2 rounded text-center">
               <div className="text-xs text-gray-500">Weight</div>
               <div className="font-mono text-neon-purple">18.01 g/mol</div>
            </div>
            <div className="bg-black/40 p-2 rounded text-center">
               <div className="text-xs text-gray-500">Shape</div>
               <div className="font-mono text-neon-blue">Bent</div>
            </div>
          </div>
          <button 
            onClick={() => askAI(selectedMolecule.name, `Tell me a fun fact about ${selectedMolecule.name} structure`)}
            className="mt-4 w-full py-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Info size={16} /> AI Insight
          </button>
        </div>
      </div>

      {/* 3D Canvas / AR View */}
      <div className="flex-1 relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/60">
        
        {/* Toggle Button */}
        <div className="absolute top-4 right-4 z-50">
           <button 
             onClick={handleArToggle}
             className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
               arMode 
               ? 'bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/40' 
               : 'bg-neon-purple text-white shadow-[0_0_15px_#bc13fe] hover:bg-neon-purple/80'
             }`}
           >
             {arMode ? <X size={16} /> : <Maximize2 size={16} />} 
             {arMode ? 'Close AR' : 'View in AR'}
           </button>
        </div>

        {/* Video Background */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className={`absolute inset-0 w-full h-full object-cover z-0 pointer-events-none transition-opacity duration-300 ${
            arMode && cameraStatus === 'active' ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* AR UI States */}
        {arMode && (
          <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
            {cameraStatus === 'loading' && (
              <div className="bg-black/80 p-4 rounded-xl flex items-center gap-3 backdrop-blur pointer-events-auto">
                <Loader2 className="animate-spin text-neon-blue" />
                <span>Initializing Camera...</span>
              </div>
            )}
            {cameraStatus === 'error' && (
              <div className="bg-black/90 border border-red-500 p-6 rounded-xl max-w-md text-center pointer-events-auto">
                <CameraOff className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-white mb-2">Camera Error</h4>
                <p className="text-gray-400 mb-4 text-sm">{errorMessage}</p>
                <button 
                  onClick={startCamera} 
                  className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded text-sm"
                >
                  Retry
                </button>
              </div>
            )}
            {cameraStatus === 'idle' && (
              <div className="bg-black/80 p-6 rounded-xl text-center pointer-events-auto">
                <button 
                  onClick={startCamera}
                  className="bg-neon-blue text-black font-bold px-6 py-3 rounded-lg hover:bg-cyan-400 flex items-center gap-2"
                >
                  <Camera size={20} /> Enable Camera
                </button>
              </div>
            )}
          </div>
        )}

        {/* 3D Scene */}
        <div className="absolute inset-0 z-10">
          <Canvas 
            camera={{ position: [0, 0, 5], fov: 50 }} 
            gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
            onCreated={({ gl, scene }) => {
              gl.setClearColor(0x000000, 0);
              scene.background = null;
            }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} color="#00f3ff" />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#bc13fe" />
              
              {!arMode && (
                <>
                  <Environment preset="city" background={false} />
                  <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                </>
              )}

              <MoleculeRender molecule={selectedMolecule} />
              
              <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} color="#00f3ff" />
              <OrbitControls enablePan={false} minDistance={2} maxDistance={10} />
            </Suspense>
          </Canvas>
        </div>
        
        {!arMode && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 glass-panel px-4 py-1 rounded-full z-20 pointer-events-none whitespace-nowrap">
             Interactive Mode: Left Click to Rotate • Scroll to Zoom
          </div>
        )}
      </div>
    </div>
  );
};