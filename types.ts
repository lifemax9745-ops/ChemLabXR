export enum View {
  DASHBOARD = 'DASHBOARD',
  MOLECULES = 'MOLECULES',
  LAB = 'LAB',
  THEORY = 'THEORY'
}

export enum AtomType {
  H = 'H',
  C = 'C',
  O = 'O',
  N = 'N',
  Cl = 'Cl',
  Na = 'Na'
}

export interface AtomData {
  id: string;
  type: AtomType;
  position: [number, number, number];
}

export interface BondData {
  from: string;
  to: string;
  type: 'single' | 'double' | 'triple';
}

export interface Molecule {
  id: string;
  name: string;
  formula: string;
  description: string;
  atoms: AtomData[];
  bonds: BondData[];
  category: 'Organic' | 'Inorganic' | 'Acids' | 'Bases';
}

export interface LabTool {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: 'container' | 'heat' | 'instrument' | 'chemical';
  contents?: string; // Chemical formula if filled
  volume?: number; // ml
  temperature?: number; // Celsius
}

export interface Chemical {
  id: string;
  name: string;
  formula: string;
  color: string;
  state: 'solid' | 'liquid' | 'gas';
  ph: number;
}

export interface UserState {
  xp: number;
  level: number;
  addXP: (amount: number) => void;
}
