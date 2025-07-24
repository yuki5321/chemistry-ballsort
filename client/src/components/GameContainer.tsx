import React from 'react';
import ElementBall from './ElementBall';
import { Element, CompoundFormula } from '../types/game';
import { ELEMENTS } from '../utils/gameLogic';

interface GameContainerProps {
  elements: Element[];
  onDragStart: (ballIndex: number) => void;
  onDrop: () => void;
  onDragEnd: () => void;
  draggedElement: {
    element: Element;
    sourceContainer: number;
    sourceBallIndex: number;
  } | null;
  containerIndex: number;
  isCompleted: boolean;
  maxCapacity: number;
  targetFormula?: CompoundFormula | null;
}

const GameContainer: React.FC<GameContainerProps> = ({
  elements,
  onDragStart,
  onDrop,
  onDragEnd,
  draggedElement,
  containerIndex,
  isCompleted,
  maxCapacity,
  targetFormula
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Don't allow drop if container is completed
    if (isCompleted) {
      return;
    }
    // Don't allow drop if container is at capacity
    if (elements.length >= maxCapacity) {
      return;
    }
    onDrop();
  };

  return (
    <div
      className={`relative w-32 h-[450px] test-tube rounded-b-full border-4 backdrop-blur-sm transition-all duration-500 mx-2 ${
        isCompleted 
          ? 'border-emerald-400 shadow-2xl shadow-emerald-400/50 bg-gradient-to-b from-emerald-400/30 to-emerald-400/10 pulse-glow' 
          : elements.length >= maxCapacity
            ? 'border-rose-400/70 bg-gradient-to-b from-rose-400/30 to-rose-400/10 shadow-xl shadow-rose-400/30'
          : draggedElement && draggedElement.sourceContainer !== containerIndex && !isCompleted
            ? 'hover:border-amber-400 border-amber-300/60 bg-gradient-to-b from-amber-400/20 to-amber-400/10'
            : 'border-white/40 bg-gradient-to-b from-white/15 to-white/5 hover:border-white/60'
      }`}
      style={{
        background: isCompleted 
          ? 'linear-gradient(to bottom, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))'
          : elements.length >= maxCapacity
            ? 'linear-gradient(to bottom, rgba(244, 63, 94, 0.2), rgba(225, 29, 72, 0.1))'
            : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
        boxShadow: isCompleted 
          ? '0 20px 40px rgba(16, 185, 129, 0.3), inset 0 2px 10px rgba(255, 255, 255, 0.1)'
          : '0 10px 30px rgba(0, 0, 0, 0.2), inset 0 2px 10px rgba(255, 255, 255, 0.1)'
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Container neck */}
      <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-t-lg border-4 border-b-0 ${
        isCompleted 
          ? 'bg-green-400/30 border-green-400' 
          : elements.length >= maxCapacity
            ? 'bg-red-400/30 border-red-400'
          : 'bg-white/20 border-white/30'
      }`}></div>
      
      {/* Elements stack from bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col-reverse items-center pb-2">
        {elements.map((element, index) => (
          <ElementBall
            key={`${element.symbol}-${index}`}
            element={element}
            onDragStart={() => onDragStart(index)}
            onDragEnd={onDragEnd}
            isDragging={draggedElement?.sourceContainer === containerIndex && draggedElement?.sourceBallIndex === index}
            stackIndex={index}
            isTopElement={index === elements.length - 1}
          />
        ))}
      </div>

      {/* Completion glow effect */}
      {isCompleted && (
        <>
          <div className="absolute inset-0 rounded-b-full bg-green-400/30 animate-pulse"></div>
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-green-400 text-xs font-bold whitespace-nowrap">
            ✓ Complete!
          </div>
        </>
      )}
      
      {/* Target formula indicator */}
      {targetFormula && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-yellow-300 text-xs font-bold whitespace-nowrap">
            {targetFormula.formula}
          </div>
          <div className="text-yellow-200/80 text-xs whitespace-nowrap">
            {targetFormula.name}
          </div>
          {/* Show required elements in Japanese */}
          <div className="text-white/60 text-xs mt-1">
            {targetFormula.elements.map(elem => {
              const element = ELEMENTS.find(e => e.symbol === elem.symbol);
              return element ? `${element.name}×${elem.count}` : `${elem.symbol}×${elem.count}`;
            }).join(' ')}
          </div>
        </div>
      )}

      {/* Capacity indicator */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-xs font-mono">
        {elements.length}/{maxCapacity}
      </div>
      
      {/* Full container warning */}
      {elements.length >= maxCapacity && !isCompleted && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-red-400 text-xs font-bold whitespace-nowrap">
          試験管満杯!
        </div>
      )}
    </div>
  );
};

export default GameContainer;