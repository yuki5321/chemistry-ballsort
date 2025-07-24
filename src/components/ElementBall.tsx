import React from 'react';
import { Element } from '../types/game';

interface ElementBallProps {
  element: Element;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
  stackIndex: number;
  isTopElement: boolean;
}

const ElementBall: React.FC<ElementBallProps> = ({ 
  element, 
  onDragStart,
  onDragEnd,
  isDragging,
  stackIndex,
  isTopElement
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    if (!isTopElement) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = 'move';
    onDragStart();
  };

  const handleDragEnd = () => {
    onDragEnd();
  };

  return (
    <div
      draggable={isTopElement}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        w-16 h-16 rounded-full flex items-center justify-center cursor-pointer
        transition-all duration-300 hover:scale-110 transform
        shadow-lg hover:shadow-xl
        ${isDragging ? 'opacity-50 scale-95' : ''}
        ${stackIndex > 0 ? 'mb-1' : ''}
        ${!isTopElement ? 'cursor-not-allowed opacity-60' : ''}
      `}
      style={{
        backgroundColor: element.color,
        border: `3px solid ${element.color}`,
        filter: 'brightness(1.1)',
        cursor: isDragging ? 'grabbing' : isTopElement ? 'grab' : 'not-allowed'
      }}
    >
      <div className="text-center">
        <div className="text-white font-bold text-sm leading-none">
          {element.symbol}
        </div>
        <div className="text-white text-xs opacity-80 leading-none">
          {element.atomicNumber}
        </div>
      </div>
    </div>
  );
};

export default ElementBall;