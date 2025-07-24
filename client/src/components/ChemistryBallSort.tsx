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
  const [showFormulas, setShowFormulas] = useState(true);

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
    const newCompletedFormulas = checkAllFormulasCompleted(containers, targetFormulas, gameState.containerTargets);

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
  }, [completedFormulas.length, level, gameState.containerTargets]);

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

    // Check if moves are exhausted
    if (gameState.movesLeft <= 0) {
      setDraggedElement(null);
      return;
    }

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

    // Decrease moves
    const newMovesLeft = gameState.movesLeft - 1;
    setGameState(prev => ({ 
      ...prev, 
      containers: newContainers,
      movesLeft: newMovesLeft
    }));
    setDraggedElement(null);

    // Check for completed formulas
    checkForCompletedFormulas(newContainers);

    // Check for game over
    if (newMovesLeft <= 0 && completedFormulas.length < gameState.targetFormulas.length) {
      setIsRunning(false);
      alert(`ゲームオーバー！手数が足りませんでした。リセットしてもう一度挑戦してください。`);
    }
  }, [draggedElement, gameState.containers, gameState.movesLeft, gameState.targetFormulas.length, isRunning, completedFormulas, checkForCompletedFormulas]);

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

  const handleReset = () => {
    setGameState(generateLevel(level));
    setScore(0);
    setTimeElapsed(0);
    setIsRunning(false);
    setCompletedFormulas([]);
    setShowCelebration(false);
  };

  const handleTogglePause = () => {
    setIsRunning(!isRunning);
  };

  const getTargetFormulas = () => {
    return COMPOUNDS.filter(c => c.level <= level);
  };

  const getMovesColor = () => {
    const percentage = (gameState.movesLeft / gameState.maxMoves) * 100;
    if (percentage > 50) return 'text-emerald-400';
    if (percentage > 25) return 'text-amber-400';
    return 'text-rose-400';
  };

  // Floating particles component
  const FloatingParticles = () => (
    <div className="particles">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${8 + Math.random() * 4}s`
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      <FloatingParticles />
      
      <div className="relative z-10 min-h-screen backdrop-blur-sm bg-black/10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header with glass morphism */}
          <div className="text-center mb-12">
            <div className="glass rounded-3xl p-8 mb-8 mx-auto max-w-4xl">
              <h1 className="text-6xl font-black text-white mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  化学ボールソート
                </span>
              </h1>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
                <div className="glass rounded-2xl p-4 interactive">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    <span className="text-sm font-medium opacity-80">レベル</span>
                  </div>
                  <div className="text-3xl font-bold text-yellow-400">{level}</div>
                </div>
                
                <div className="glass rounded-2xl p-4 interactive">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl">⭐</span>
                    <span className="text-sm font-medium opacity-80">スコア</span>
                  </div>
                  <div className="text-3xl font-bold text-cyan-400">{score.toLocaleString()}</div>
                </div>
                
                <div className="glass rounded-2xl p-4 interactive">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-6 h-6 text-blue-400" />
                    <span className="text-sm font-medium opacity-80">時間</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-400">{formatTime(timeElapsed)}</div>
                </div>
                
                <div className="glass rounded-2xl p-4 interactive">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl">🔄</span>
                    <span className="text-sm font-medium opacity-80">残り手数</span>
                  </div>
                  <div className={`text-3xl font-bold ${getMovesColor()}`}>
                    {gameState.movesLeft}
                  </div>
                </div>
              </div>
            </div>

            {/* Control buttons with enhanced design */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={handleTogglePause}
                className="btn-animated glass rounded-2xl px-8 py-4 text-white font-bold text-lg flex items-center gap-3 hover:bg-white/20 transition-all duration-300"
              >
                {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                {isRunning ? '一時停止' : '開始'}
              </button>
              
              <button
                onClick={handleReset}
                className="btn-animated glass rounded-2xl px-8 py-4 text-white font-bold text-lg flex items-center gap-3 hover:bg-white/20 transition-all duration-300"
              >
                <RotateCcw className="w-6 h-6" />
                リセット
              </button>
            </div>
          </div>

          {/* Target formulas with enhanced design */}
          <div className="mb-12">
            <div className="glass rounded-3xl p-8 mx-auto max-w-5xl">
              <div className="flex items-center justify-center gap-6 mb-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Lightbulb className="w-8 h-8 text-yellow-400" />
                  目標化合物
                </h2>
                <button
                  onClick={() => setShowFormulas(!showFormulas)}
                  className="glass rounded-xl px-4 py-2 text-white text-sm font-medium hover:bg-white/20 transition-all duration-300"
                >
                  {showFormulas ? '非表示' : '表示'}
                </button>
              </div>
              
              {showFormulas && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getTargetFormulas().map((compound, index) => {
                    const isCompleted = completedFormulas.some(cf => cf.formula === compound.formula);
                    return (
                      <div
                        key={compound.formula}
                        className={`relative rounded-2xl p-6 font-bold transition-all duration-500 interactive ${
                          isCompleted
                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white pulse-glow'
                            : 'glass text-white hover:bg-white/20'
                        }`}
                      >
                        {isCompleted && (
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            ✓
                          </div>
                        )}
                        <div className="text-center">
                          <div className="text-2xl mb-2">{compound.formula}</div>
                          <div className="text-sm opacity-80">{compound.name}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {!showFormulas && (
                <div className="text-center text-white/60">
                  化学式を非表示にしています。より難しい挑戦をお楽しみください！
                </div>
              )}
            </div>
          </div>

          {/* Game containers with enhanced spacing */}
          <div className="flex justify-center items-end gap-8 mb-8 flex-wrap">
            {gameState.containers.map((container, index) => (
              <GameContainer
                key={index}
                elements={container}
                onDragStart={(ballIndex) => handleDragStart(index, ballIndex)}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
                draggedElement={draggedElement}
                containerIndex={index}
                isCompleted={completedFormulas.some(cf => cf.containerIndex === index)}
                maxCapacity={gameState.maxContainerCapacity}
                targetFormula={gameState.containerTargets[index] || null}
              />
            ))}
          </div>

          {/* Enhanced celebration overlay */}
          {showCelebration && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="glass rounded-3xl p-12 text-center max-w-lg mx-4 celebration">
                <div className="text-8xl mb-6">🎉</div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                    レベルクリア！
                  </span>
                </h2>
                <p className="text-white/80 text-xl mb-6">
                  すべての化合物を完成させました！
                </p>
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  次のレベルに進みます...
                </div>
                <div className="mt-6 flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChemistryBallSort;