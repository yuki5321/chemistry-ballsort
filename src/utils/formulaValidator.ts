import { Element, CompoundFormula } from '../types/game';

export const validateFormula = (containerElements: Element[], targetFormula: CompoundFormula): boolean => {
  // Count elements in the container
  const elementCounts: { [symbol: string]: number } = {};
  
  containerElements.forEach(element => {
    elementCounts[element.symbol] = (elementCounts[element.symbol] || 0) + 1;
  });

  // Check if the container has exactly the right elements for the formula
  const requiredCounts: { [symbol: string]: number } = {};
  targetFormula.elements.forEach(elementInfo => {
    requiredCounts[elementInfo.symbol] = elementInfo.count;
  });

  // Compare required vs actual counts
  const requiredSymbols = Object.keys(requiredCounts);
  const actualSymbols = Object.keys(elementCounts);

  // Must have same number of different elements
  if (requiredSymbols.length !== actualSymbols.length) {
    return false;
  }

  // Each element must match exactly
  for (const symbol of requiredSymbols) {
    if (elementCounts[symbol] !== requiredCounts[symbol]) {
      return false;
    }
  }

  // No extra elements allowed
  for (const symbol of actualSymbols) {
    if (!requiredCounts[symbol]) {
      return false;
    }
  }

  return true;
};

export const checkAllFormulasCompleted = (containers: Element[][], targetFormulas: CompoundFormula[]): CompoundFormula[] => {
  const completedFormulas: CompoundFormula[] = [];
  
  // For each container, check if it contains exactly one complete formula
  containers.forEach((container, containerIndex) => {
    for (const formula of targetFormulas) {
      if (validateFormula(container, formula)) {
        // Check if this formula hasn't been completed yet
        if (!completedFormulas.some(cf => cf.formula === formula.formula)) {
          completedFormulas.push({
            ...formula,
            containerIndex
          });
        }
        break; // Only one formula per container
      }
    }
  });

  return completedFormulas;
};