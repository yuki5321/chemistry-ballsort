import React, { useState, useCallback, useEffect } from 'react';
import { RotateCcw, Trophy, Clock, Lightbulb, Play, Pause } from 'lucide-react';
import GameContainer from './GameContainer';
import ElementBall from './ElementBall';
import { Element, GameState, CompoundFormula } from '../types/game';
import { ELEMENTS, COMPOUNDS, generateLevel } from '../utils/gameLogic';
import { checkAllFormulasCompleted } from '../utils/formulaValidator';

const ChemistryBallSort: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => generateLevel(1));
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [draggedElement, setDraggedElement] = useState<{
    element: Element;
    sourceContainer: number;
    sourceBallIndex: number;
  } | null>(null);
  const [completedFormulas, setCompletedFormulas] = useState<CompoundFormula[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const checkForCompletedFormulas = useCallback((containers: Element[][]) => {
    const targetFormulas = COMPOUNDS.filter(c => c.level <= level);
    const newCompletedFormulas = checkAllFormulasCompleted(containers, targetFormulas);

    if (newCompletedFormulas.length > completedFormulas.length) {
      setCompletedFormulas(newCompletedFormulas);
      setScore(prev => prev + (newCompletedFormulas.length - completedFormulas.length) * 100);
      
      if (newCompletedFormulas.length >= targetFormulas.length) {
        setShowCelebration(true);
        setIsRunning(false);
        setTimeout(() => {
          setLevel(prev => prev + 1);
          setGameState(generateLevel(level + 1));
          setCompletedFormulas([]);
          setShowCelebration(false);
        }, 3000);
      }
    }
  }, [completedFormulas.length, level]);

  const handleDragStart = useCallback((containerIndex: number, ballIndex: number) => {
    if (!isRunning) return;

    // Only allow dragging the top element (last in array)
    const container = gameState.containers[containerIndex];
    if (ballIndex !== container.length - 1) {
      return;
    }

    const element = gameState.containers[containerIndex][ballIndex];
    setDraggedElement({
      element,
      sourceContainer: containerIndex,
      sourceBallIndex: ballIndex
    });
  }, [gameState.containers, isRunning]);

  const handleDrop = useCallback((targetContainerIndex: number) => {
    if (!draggedElement || !isRunning) return;

    // Check if target container is completed
    const isTargetCompleted = completedFormulas.some(cf => cf.containerIndex === targetContainerIndex);
    if (isTargetCompleted) {
      setDraggedElement(null);
      return;
    }

    // Check if target container has space
    if (gameState.containers[targetContainerIndex].length >= gameState.maxContainerCapacity) {
      setDraggedElement(null);
      return;
    }

    const newContainers = [...gameState.containers];
    
    // Remove element from source container
    newContainers[draggedElement.sourceContainer].splice(draggedElement.sourceBallIndex, 1);
    
    // Add element to target container
    newContainers[targetContainerIndex].push(draggedElement.element);

    setGameState(prev => ({ ...prev, containers: newContainers }));
    setDraggedElement(null);

    // Check for completed formulas
    checkForCompletedFormulas(newContainers);
  }, [draggedElement, gameState.containers, isRunning, completedFormulas, checkForCompletedFormulas]);

  const handleDragEnd = useCallback(() => {
    setDraggedElement(null);
  }, []);

  const resetGame = () => {
    setGameState(generateLevel(level));
    setDraggedElement(null);
    setCompletedFormulas([]);
    setTimeElapsed(0);
    setIsRunning(false);
  };

  const startPauseGame = () => {
    setIsRunning(!isRunning);
  };

  const getHint = () => {
    if (completedFormulas.length < COMPOUNDS.filter(c => c.level <= level).length && isRunning) {
      const nextCompound = COMPOUNDS.filter(c => c.level <= level)[completedFormulas.length];
      alert(`Next formula to complete: ${nextCompound.formula} (${nextCompound.name})`);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Chemistry Ball Sort
          </h1>
          <p className="text-blue-200 text-lg">
            Sort elements to create chemical compounds!
          </p>
        </div>

        {/* Game Stats */}
        <div className="flex justify-center items-center gap-6 mb-8 text-white">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold">Level {level}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
            <span className="text-blue-400 font-semibold">試験管容量: {gameState.maxContainerCapacity}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
            <span className="text-green-400 font-semibold">Score: {score}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="font-mono">{formatTime(timeElapsed)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={startPauseGame}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetGame}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
          <button
            onClick={getHint}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Lightbulb className="w-5 h-5" />
            Hint
          </button>
        </div>

        {/* Target Formulas */}
        <div className="mb-8">
          <h3 className="text-white text-xl font-semibold mb-4 text-center">Target Formulas</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {COMPOUNDS.filter(c => c.level <= level).map((compound, index) => (
              <div
                key={compound.formula}
                className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                  completedFormulas.some(cf => cf.formula === compound.formula)
                    ? 'bg-green-500 border-green-400 text-white'
                    : 'bg-white/10 border-white/30 text-white'
                }`}
              >
                <div className="font-mono font-bold">{compound.formula}</div>
                <div className="text-sm opacity-80">{compound.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Game Area */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {gameState.containers.map((container, containerIndex) => (
            <GameContainer
              key={containerIndex}
              elements={container}
              onDragStart={(ballIndex) => handleDragStart(containerIndex, ballIndex)}
              onDrop={() => handleDrop(containerIndex)}
              onDragEnd={handleDragEnd}
              draggedElement={draggedElement}
              containerIndex={containerIndex}
              isCompleted={completedFormulas.some(cf => cf.containerIndex === containerIndex)}
              maxCapacity={gameState.maxContainerCapacity}
            />
          ))}
        </div>

        {/* Celebration */}
        {showCelebration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 text-center animate-bounce">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Level Complete!</h2>
              <p className="text-gray-600">Moving to Level {level + 1}...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChemistryBallSort;