import { Element, CompoundFormula, GameState } from '../types/game';

export const ELEMENTS: Element[] = [
  { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, color: '#FF6B6B' },
  { symbol: 'He', name: 'Helium', atomicNumber: 2, color: '#4ECDC4' },
  { symbol: 'Li', name: 'Lithium', atomicNumber: 3, color: '#45B7D1' },
  { symbol: 'Be', name: 'Beryllium', atomicNumber: 4, color: '#96CEB4' },
  { symbol: 'B', name: 'Boron', atomicNumber: 5, color: '#FECA57' },
  { symbol: 'C', name: 'Carbon', atomicNumber: 6, color: '#3D3D3D' },
  { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, color: '#5F4FBF' },
  { symbol: 'O', name: 'Oxygen', atomicNumber: 8, color: '#FF3838' },
  { symbol: 'F', name: 'Fluorine', atomicNumber: 9, color: '#FF9FF3' },
  { symbol: 'Ne', name: 'Neon', atomicNumber: 10, color: '#FFB8B8' },
  { symbol: 'Na', name: 'Sodium', atomicNumber: 11, color: '#FFD93D' },
  { symbol: 'Mg', name: 'Magnesium', atomicNumber: 12, color: '#A8E6CF' },
  { symbol: 'Al', name: 'Aluminum', atomicNumber: 13, color: '#C7C7C7' },
  { symbol: 'Si', name: 'Silicon', atomicNumber: 14, color: '#8B4513' },
  { symbol: 'P', name: 'Phosphorus', atomicNumber: 15, color: '#FFA500' },
  { symbol: 'S', name: 'Sulfur', atomicNumber: 16, color: '#FFFF00' },
  { symbol: 'Cl', name: 'Chlorine', atomicNumber: 17, color: '#90EE90' },
  { symbol: 'Ar', name: 'Argon', atomicNumber: 18, color: '#E6E6FA' },
  { symbol: 'K', name: 'Potassium', atomicNumber: 19, color: '#DDA0DD' },
  { symbol: 'Ca', name: 'Calcium', atomicNumber: 20, color: '#FFF8DC' }
];

export const COMPOUNDS: CompoundFormula[] = [
  {
    formula: 'H₂O',
    name: 'Water',
    elements: [{ symbol: 'H', count: 2 }, { symbol: 'O', count: 1 }],
    level: 1
  },
  {
    formula: 'CO₂',
    name: 'Carbon Dioxide',
    elements: [{ symbol: 'C', count: 1 }, { symbol: 'O', count: 2 }],
    level: 1
  },
  {
    formula: 'NaCl',
    name: 'Sodium Chloride',
    elements: [{ symbol: 'Na', count: 1 }, { symbol: 'Cl', count: 1 }],
    level: 1
  },
  {
    formula: 'NH₃',
    name: 'Ammonia',
    elements: [{ symbol: 'N', count: 1 }, { symbol: 'H', count: 3 }],
    level: 2
  },
  {
    formula: 'CH₄',
    name: 'Methane',
    elements: [{ symbol: 'C', count: 1 }, { symbol: 'H', count: 4 }],
    level: 2
  },
  {
    formula: 'HCl',
    name: 'Hydrogen Chloride',
    elements: [{ symbol: 'H', count: 1 }, { symbol: 'Cl', count: 1 }],
    level: 2
  },
  {
    formula: 'CaCO₃',
    name: 'Calcium Carbonate',
    elements: [{ symbol: 'Ca', count: 1 }, { symbol: 'C', count: 1 }, { symbol: 'O', count: 3 }],
    level: 3
  },
  {
    formula: 'NaOH',
    name: 'Sodium Hydroxide',
    elements: [{ symbol: 'Na', count: 1 }, { symbol: 'O', count: 1 }, { symbol: 'H', count: 1 }],
    level: 3
  }
];

export const generateLevel = (level: number): GameState => {
  const targetFormulas = COMPOUNDS.filter(compound => compound.level <= level);
  const containers: Element[][] = [];
  const allElementsNeeded: Element[] = [];
  
  // Set container capacity based on level (minimum 4, increases with level)
  const maxContainerCapacity = Math.max(4, Math.min(6, 3 + level));

  // Collect all elements needed for the target formulas
  targetFormulas.forEach(formula => {
    formula.elements.forEach(elementInfo => {
      const element = ELEMENTS.find(e => e.symbol === elementInfo.symbol);
      if (element) {
        for (let i = 0; i < elementInfo.count; i++) {
          allElementsNeeded.push(element);
        }
      }
    });
  });

  // Shuffle the elements
  const shuffledElements = [...allElementsNeeded].sort(() => Math.random() - 0.5);

  // Distribute elements into containers
  const numContainers = Math.max(4, Math.min(6, targetFormulas.length + 2));
  for (let i = 0; i < numContainers; i++) {
    containers.push([]);
  }

  shuffledElements.forEach((element, index) => {
    const containerIndex = index % numContainers;
    containers[containerIndex].push(element);
  });

  return {
    containers,
    targetFormulas,
    level,
    maxContainerCapacity
  };
};