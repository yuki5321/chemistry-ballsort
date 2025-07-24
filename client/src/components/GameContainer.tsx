import React from 'react';
import ElementBall from './ElementBall';
import { Element } from '../types/game';

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
}

const GameContainer: React.FC<GameContainerProps> = ({
  elements,
  onDragStart,
  onDrop,
  onDragEnd,
  draggedElement,
  containerIndex,
  isCompleted,
  maxCapacity
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
      className={`relative w-24 h-80 bg-gradient-to-b from-transparent to-white/10 rounded-b-full border-4 border-white/30 backdrop-blur-sm transition-all duration-500 ${
        isCompleted 
          ? 'border-green-400 shadow-lg shadow-green-400/50 bg-gradient-to-b from-green-400/20 to-green-400/10' 
          : elements.length >= maxCapacity
            ? 'border-red-400/50 bg-gradient-to-b from-red-400/20 to-red-400/10'
          : draggedElement && draggedElement.sourceContainer !== containerIndex && !isCompleted
            ? 'hover:border-yellow-400 border-yellow-300/50'
            : 'hover:border-white/50'
      }`}
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