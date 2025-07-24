import { Element, CompoundFormula, GameState } from '../types/game';

export const ELEMENTS: Element[] = [
  { symbol: 'H', name: '水素', atomicNumber: 1, color: '#FF6B6B' },
  { symbol: 'He', name: 'ヘリウム', atomicNumber: 2, color: '#4ECDC4' },
  { symbol: 'Li', name: 'リチウム', atomicNumber: 3, color: '#45B7D1' },
  { symbol: 'Be', name: 'ベリリウム', atomicNumber: 4, color: '#96CEB4' },
  { symbol: 'B', name: 'ホウ素', atomicNumber: 5, color: '#FECA57' },
  { symbol: 'C', name: '炭素', atomicNumber: 6, color: '#3D3D3D' },
  { symbol: 'N', name: '窒素', atomicNumber: 7, color: '#5F4FBF' },
  { symbol: 'O', name: '酸素', atomicNumber: 8, color: '#FF3838' },
  { symbol: 'F', name: 'フッ素', atomicNumber: 9, color: '#FF9FF3' },
  { symbol: 'Ne', name: 'ネオン', atomicNumber: 10, color: '#FFB8B8' },
  { symbol: 'Na', name: 'ナトリウム', atomicNumber: 11, color: '#FFD93D' },
  { symbol: 'Mg', name: 'マグネシウム', atomicNumber: 12, color: '#A8E6CF' },
  { symbol: 'Al', name: 'アルミニウム', atomicNumber: 13, color: '#C7C7C7' },
  { symbol: 'Si', name: 'ケイ素', atomicNumber: 14, color: '#8B4513' },
  { symbol: 'P', name: 'リン', atomicNumber: 15, color: '#FFA500' },
  { symbol: 'S', name: '硫黄', atomicNumber: 16, color: '#FFFF00' },
  { symbol: 'Cl', name: '塩素', atomicNumber: 17, color: '#90EE90' },
  { symbol: 'Ar', name: 'アルゴン', atomicNumber: 18, color: '#E6E6FA' },
  { symbol: 'K', name: 'カリウム', atomicNumber: 19, color: '#DDA0DD' },
  { symbol: 'Ca', name: 'カルシウム', atomicNumber: 20, color: '#FFF8DC' },
  { symbol: 'Fe', name: '鉄', atomicNumber: 26, color: '#B87333' },
  { symbol: 'Cu', name: '銅', atomicNumber: 29, color: '#B87D2C' },
  { symbol: 'Ba', name: 'バリウム', atomicNumber: 56, color: '#00C851' }
];

export const COMPOUNDS: CompoundFormula[] = [
  // Level 1 - Basic compounds (3 formulas)
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

  // Level 2 - Simple molecules (6 formulas total)
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

  // Level 3 - More complex compounds (8 formulas total)
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
  },

  // Level 4 - Intermediate compounds (10 formulas total)
  {
    formula: 'MgO',
    name: 'Magnesium Oxide',
    elements: [{ symbol: 'Mg', count: 1 }, { symbol: 'O', count: 1 }],
    level: 4
  },
  {
    formula: 'Al₂O₃',
    name: 'Aluminum Oxide',
    elements: [{ symbol: 'Al', count: 2 }, { symbol: 'O', count: 3 }],
    level: 4
  },

  // Level 5 - Advanced compounds (12 formulas total)
  {
    formula: 'H₂SO₄',
    name: 'Sulfuric Acid',
    elements: [{ symbol: 'H', count: 2 }, { symbol: 'S', count: 1 }, { symbol: 'O', count: 4 }],
    level: 5
  },
  {
    formula: 'KNO₃',
    name: 'Potassium Nitrate',
    elements: [{ symbol: 'K', count: 1 }, { symbol: 'N', count: 1 }, { symbol: 'O', count: 3 }],
    level: 5
  },

  // Level 6 - Complex organic and inorganic (14 formulas total)
  {
    formula: 'C₂H₆',
    name: 'Ethane',
    elements: [{ symbol: 'C', count: 2 }, { symbol: 'H', count: 6 }],
    level: 6
  },
  {
    formula: 'Ca(OH)₂',
    name: 'Calcium Hydroxide',
    elements: [{ symbol: 'Ca', count: 1 }, { symbol: 'O', count: 2 }, { symbol: 'H', count: 2 }],
    level: 6
  },

  // Level 7 - Very complex compounds (16 formulas total)
  {
    formula: 'Fe₂O₃',
    name: 'Iron(III) Oxide',
    elements: [{ symbol: 'Fe', count: 2 }, { symbol: 'O', count: 3 }],
    level: 7
  },
  {
    formula: 'CuSO₄',
    name: 'Copper Sulfate',
    elements: [{ symbol: 'Cu', count: 1 }, { symbol: 'S', count: 1 }, { symbol: 'O', count: 4 }],
    level: 7
  },

  // Level 8 - Expert level (18 formulas total)
  {
    formula: 'C₆H₁₂O₆',
    name: 'Glucose',
    elements: [{ symbol: 'C', count: 6 }, { symbol: 'H', count: 12 }, { symbol: 'O', count: 6 }],
    level: 8
  },
  {
    formula: 'Mg(NO₃)₂',
    name: 'Magnesium Nitrate',
    elements: [{ symbol: 'Mg', count: 1 }, { symbol: 'N', count: 2 }, { symbol: 'O', count: 6 }],
    level: 8
  },

  // Level 9 - Master level (20 formulas total)
  {
    formula: 'C₂H₅OH',
    name: 'Ethanol',
    elements: [{ symbol: 'C', count: 2 }, { symbol: 'H', count: 6 }, { symbol: 'O', count: 1 }],
    level: 9
  },
  {
    formula: 'Ba(ClO₃)₂',
    name: 'Barium Chlorate',
    elements: [{ symbol: 'Ba', count: 1 }, { symbol: 'Cl', count: 2 }, { symbol: 'O', count: 6 }],
    level: 9
  },

  // Level 10 - Grandmaster level (22 formulas total)
  {
    formula: 'C₃H₈',
    name: 'Propane',
    elements: [{ symbol: 'C', count: 3 }, { symbol: 'H', count: 8 }],
    level: 10
  },
  {
    formula: 'Al₂(SO₄)₃',
    name: 'Aluminum Sulfate',
    elements: [{ symbol: 'Al', count: 2 }, { symbol: 'S', count: 3 }, { symbol: 'O', count: 12 }],
    level: 10
  }
];

export const generateLevel = (level: number): GameState => {
  const targetFormulas = COMPOUNDS.filter(compound => compound.level <= level);
  const containers: Element[][] = [];
  const allElementsNeeded: Element[] = [];
  
  // Calculate the maximum elements in any single formula
  const maxFormulaSize = Math.max(...targetFormulas.map(formula => 
    formula.elements.reduce((sum, el) => sum + el.count, 0)
  ));
  
  // Set container capacity to be just enough for the largest compound
  const maxContainerCapacity = Math.max(3, maxFormulaSize);

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

  // Calculate optimal number of containers: exactly what's needed for formulas + 2 extra for sorting
  const numContainers = targetFormulas.length + 2;
  
  // Initialize containers
  for (let i = 0; i < numContainers; i++) {
    containers.push([]);
  }

  // Create container targets - assign each formula to a specific container
  const containerTargets: (CompoundFormula | null)[] = new Array(numContainers).fill(null);
  targetFormulas.forEach((formula, index) => {
    containerTargets[index] = formula;
  });

  // Shuffle the elements and distribute them randomly
  const shuffledElements = [...allElementsNeeded].sort(() => Math.random() - 0.5);
  shuffledElements.forEach((element, index) => {
    const containerIndex = index % numContainers;
    containers[containerIndex].push(element);
  });

  // Calculate move limit based on level complexity - reduced for higher difficulty
  const totalElements = allElementsNeeded.length;
  const baseMoves = Math.ceil(totalElements * 1.1); // Reduced base moves from 1.5 to 1.1
  const levelMultiplier = 1 + (level - 1) * 0.1; // Reduced level multiplier
  const maxMoves = Math.max(Math.ceil(baseMoves * levelMultiplier), 5); // Minimum 5 moves

  return {
    containers,
    targetFormulas,
    level,
    maxContainerCapacity,
    containerTargets,
    movesLeft: maxMoves,
    maxMoves
  };
};