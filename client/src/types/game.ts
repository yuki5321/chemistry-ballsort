export interface Element {
  symbol: string;
  name: string;
  atomicNumber: number;
  color: string;
}

export interface CompoundFormula {
  formula: string;
  name: string;
  elements: { symbol: string; count: number }[];
  level: number;
  containerIndex?: number;
}

export interface GameState {
  containers: Element[][];
  targetFormulas: CompoundFormula[];
  level: number;
  maxContainerCapacity: number;
}