import { Molecule, AtomType, Chemical, LabTool } from './types';

// Atom visual properties
export const ATOM_COLORS: Record<AtomType, string> = {
  [AtomType.H]: '#FFFFFF',
  [AtomType.C]: '#333333',
  [AtomType.O]: '#FF0000',
  [AtomType.N]: '#0000FF',
  [AtomType.Cl]: '#00FF00',
  [AtomType.Na]: '#800080'
};

export const ATOM_RADII: Record<AtomType, number> = {
  [AtomType.H]: 0.3,
  [AtomType.C]: 0.5,
  [AtomType.O]: 0.48,
  [AtomType.N]: 0.49,
  [AtomType.Cl]: 0.6,
  [AtomType.Na]: 0.7
};

// Mock Molecules
export const MOLECULES: Molecule[] = [
  {
    id: 'water',
    name: 'Water',
    formula: 'H₂O',
    description: 'The universal solvent. Essential for life.',
    category: 'Inorganic',
    atoms: [
      { id: 'o1', type: AtomType.O, position: [0, 0, 0] },
      { id: 'h1', type: AtomType.H, position: [0.8, 0.6, 0] },
      { id: 'h2', type: AtomType.H, position: [-0.8, 0.6, 0] }
    ],
    bonds: [
      { from: 'o1', to: 'h1', type: 'single' },
      { from: 'o1', to: 'h2', type: 'single' }
    ]
  },
  {
    id: 'methane',
    name: 'Methane',
    formula: 'CH₄',
    description: 'A primary component of natural gas.',
    category: 'Organic',
    atoms: [
      { id: 'c1', type: AtomType.C, position: [0, 0, 0] },
      { id: 'h1', type: AtomType.H, position: [0.8, 0.8, 0.8] },
      { id: 'h2', type: AtomType.H, position: [-0.8, -0.8, 0.8] },
      { id: 'h3', type: AtomType.H, position: [0.8, -0.8, -0.8] },
      { id: 'h4', type: AtomType.H, position: [-0.8, 0.8, -0.8] }
    ],
    bonds: [
      { from: 'c1', to: 'h1', type: 'single' },
      { from: 'c1', to: 'h2', type: 'single' },
      { from: 'c1', to: 'h3', type: 'single' },
      { from: 'c1', to: 'h4', type: 'single' }
    ]
  },
  {
    id: 'co2',
    name: 'Carbon Dioxide',
    formula: 'CO₂',
    description: 'A colorless gas with a density about 53% higher than that of dry air.',
    category: 'Inorganic',
    atoms: [
      { id: 'c1', type: AtomType.C, position: [0, 0, 0] },
      { id: 'o1', type: AtomType.O, position: [1.2, 0, 0] },
      { id: 'o2', type: AtomType.O, position: [-1.2, 0, 0] }
    ],
    bonds: [
      { from: 'c1', to: 'o1', type: 'double' },
      { from: 'c1', to: 'o2', type: 'double' }
    ]
  }
];

export const CHEMICALS: Chemical[] = [
  { id: 'hcl', name: 'Hydrochloric Acid', formula: 'HCl', color: '#FFFFE0', state: 'liquid', ph: 1 },
  { id: 'naoh', name: 'Sodium Hydroxide', formula: 'NaOH', color: '#FFFFFF', state: 'liquid', ph: 14 },
  { id: 'h2o', name: 'Water', formula: 'H2O', color: '#E0FFFF', state: 'liquid', ph: 7 },
  { id: 'cuso4', name: 'Copper Sulfate', formula: 'CuSO4', color: '#0000FF', state: 'liquid', ph: 4 }
];

export const LAB_TOOLS: LabTool[] = [
  { id: 'beaker', name: 'Beaker (250ml)', icon: 'Beaker', description: 'Standard glass container', type: 'container', volume: 250 },
  { id: 'flask', name: 'Erlenmeyer Flask', icon: 'FlaskConical', description: 'For mixing and heating', type: 'container', volume: 250 },
  { id: 'burner', name: 'Bunsen Burner', icon: 'Flame', description: 'Heat source', type: 'heat' },
  { id: 'ph_meter', name: 'pH Meter', icon: 'Gauge', description: 'Measure acidity', type: 'instrument' }
];
