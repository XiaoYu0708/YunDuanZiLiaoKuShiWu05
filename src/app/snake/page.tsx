
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const GRID_SIZE = 20;
const SNAKE_START = [{ x: 8, y: 8 }];
const FOOD_START = { x: 12, y: 12 };
const GAME_SPEED = 100;

const SnakeGame = () => {
  const { auth } = useAuth();
  const router = useRouter();
  const [snake, setSnake] = useState(SNAKE_START);
  const [food, setFood] = useState(FOOD_START);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!auth?.currentUser) {
      router.push("/");
    }
  }, [auth, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const gameLoop = () => {
      if (gameOver) return;

      const newSnake = moveSnake();
      if (checkCollision(newSnake[0])) {
        setGameOver(true);
        return;
      }

      if (isFoodEaten(newSnake[0])) {
        setSnake(extendSnake(newSnake));
        setFood(generateFood());
      } else {
        setSnake(newSnake.slice(0, -1));
      }

      draw();
    };

    const intervalId = setInterval(gameLoop, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [snake, food, direction, gameOver]);

  const moveSnake = () => {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    return [head, ...snake];
  };

  const checkCollision = (head: { x: number, y: number }) => {
    if (head.x * GRID_SIZE >= canvasRef.current!.width || head.x < 0 || head.y * GRID_SIZE >= canvasRef.current!.height || head.y < 0) {
      return true;
    }

    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }
    return false;
  };

  const isFoodEaten = (head: { x: number, y: number }) => {
    return head.x === food.x && head.y === food.y;
  };

  const extendSnake = (currentSnake: { x: number; y: number; }[]) => {
    const newSegment = { ...currentSnake[currentSnake.length - 1] };
    return [...currentSnake, newSegment];
  };

  const generateFood = () => {
    let newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    }
    return newFood;
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas!.getContext('2d');

    ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

    snake.forEach((segment, index) => {
      ctx!.fillStyle = index === 0 ? 'hsl(var(--primary))' : 'darkgreen';
      ctx!.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    });

    ctx!.fillStyle = 'hsl(var(--secondary))';
    ctx!.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * GRID_SIZE}
        height={GRID_SIZE * GRID_SIZE}
        className="border border-gray-500"
      />
      {gameOver && (
        <div className="text-red-500 text-2xl mt-4">
          Game Over!
        </div>
      )}
      <Button onClick={() => router.push("/")}>
        Back to Login
      </Button>
    </div>
  );
};

export default SnakeGame;
