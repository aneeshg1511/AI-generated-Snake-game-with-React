import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Point, GameStatus } from '../types';
import { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from '../constants';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  onGameOver: () => void;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange, onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 1, y: 0 });
    setScore(0);
    onScoreChange(0);
    setStatus(GameStatus.PLAYING);
    setFood(generateFood([{ x: 10, y: 10 }]));
  };

  const gameOver = () => {
    setStatus(GameStatus.GAME_OVER);
    onGameOver();
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
  };

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        gameOver();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check collision with food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      const speed = Math.max(MIN_SPEED, INITIAL_SPEED - Math.floor(score / 50) * SPEED_INCREMENT);
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [status, moveSnake, score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (Static Noise Style)
    ctx.strokeStyle = '#101010';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * scale, 0);
      ctx.lineTo(i * scale, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * scale);
      ctx.lineTo(canvas.width, i * scale);
      ctx.stroke();
    }

    // Draw Snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00ffff' : '#00ffff';
      ctx.shadowBlur = 0; // Jagged, no soft glow
      
      const padding = 1;
      // Occasionally "glitch" a segment offset
      const glitchX = Math.random() > 0.98 ? (Math.random() - 0.5) * 4 : 0;
      const glitchY = Math.random() > 0.98 ? (Math.random() - 0.5) * 4 : 0;

      ctx.fillRect(
        segment.x * scale + padding + glitchX,
        segment.y * scale + padding + glitchY,
        scale - padding * 2,
        scale - padding * 2
      );

      if (isHead) {
        // Red eye for the head
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(
          segment.x * scale + scale / 4,
          segment.y * scale + scale / 4,
          scale / 2,
          scale / 2
        );
      }
    });

    // Draw Food
    ctx.fillStyle = '#ff00ff';
    const foodPadding = 2;
    // Food "pulses" jaggedly
    const pulse = Math.sin(Date.now() / 100) * 2;
    ctx.fillRect(
      food.x * scale + foodPadding - pulse / 2,
      food.y * scale + foodPadding - pulse / 2,
      scale - foodPadding * 2 + pulse,
      scale - foodPadding * 2 + pulse
    );

    // Reset shadow
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="relative group bg-zinc-950 border-4 border-cyan-glitch shadow-[8px_8px_0px_#ff00ff] tear-effect">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="block image-render-pixel"
      />

      {status !== GameStatus.PLAYING && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg/95 backdrop-blur-none transition-all duration-300">
          <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-[0.2em] glitch-text">
            {status === GameStatus.GAME_OVER ? 'RUNTIME_ERROR' : 'CORE_INIT'}
          </h2>
          {status === GameStatus.GAME_OVER && (
            <p className="text-magenta-glitch mb-8 font-pixel uppercase tracking-widest animate-pulse">
              RESULT_BYTES: {score.toString(16).toUpperCase()}
            </p>
          )}
          <button
            onClick={resetGame}
            className="px-8 py-2 bg-cyan-glitch hover:bg-magenta-glitch text-bg font-black transition-all transform hover:skew-x-12 active:skew-x-0 uppercase tracking-widest border-2 border-white"
          >
            {status === GameStatus.GAME_OVER ? 'RESTORE_SESSION' : 'EXECUTE_CORE'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
