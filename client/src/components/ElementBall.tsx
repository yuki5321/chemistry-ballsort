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
        w-20 h-20 rounded-full flex items-center justify-center cursor-pointer
        transition-all duration-300 hover:scale-110 transform element-glow
        shadow-2xl hover:shadow-3xl relative
        ${isDragging ? 'opacity-50 scale-95' : ''}
        ${stackIndex > 0 ? 'mb-2' : ''}
        ${!isTopElement ? 'cursor-not-allowed opacity-60' : 'hover:brightness-110'}
      `}
      style={{
        background: `linear-gradient(135deg, ${element.color} 0%, ${element.color}DD 100%)`,
        border: `4px solid rgba(255, 255, 255, 0.3)`,
        boxShadow: `0 8px 25px rgba(0, 0, 0, 0.3), inset 0 2px 10px rgba(255, 255, 255, 0.2)`,
        cursor: isDragging ? 'grabbing' : isTopElement ? 'grab' : 'not-allowed'
      }}
    >
      {/* Shine effect */}
      <div 
        className="absolute inset-2 rounded-full opacity-30"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, transparent 50%)'
        }}
      />
      
      <div className="relative z-10 text-center">
        <div className="text-white font-black text-lg leading-none drop-shadow-lg">
          {element.symbol}
        </div>
        <div className="text-white/90 text-xs font-medium opacity-90 leading-tight mt-1">
          {element.atomicNumber}
        </div>
      </div>

      {/* Glow ring for draggable elements */}
      {isTopElement && (
        <div 
          className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, transparent, ${element.color}66, transparent)`,
            filter: 'blur(2px)'
          }}
        />
      )}
    </div>
  );
};

export default ElementBall;