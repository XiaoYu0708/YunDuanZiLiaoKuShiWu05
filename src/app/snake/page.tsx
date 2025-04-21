"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings } from "lucide-react";
import { doc, getFirestore, updateDoc, getDoc, setDoc } from "firebase/firestore";

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
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    if (!auth?.currentUser) {
      router.push("/");
    }
  }, [auth, router]);

  useEffect(() => {
    const fetchHighScore = async () => {
      if (auth?.currentUser) {
        const db = getFirestore();
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          setHighScore(docSnap.data().highScore || 0);
        } else {
          // If the document doesn't exist, create it
          await setDoc(userDocRef, {
            highScore: 0,
          });
          setHighScore(0);
        }
      }
    };

    fetchHighScore();
  }, [auth?.currentUser]);

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
        setScore(prevScore => prevScore + 1);
      } else {
        setSnake(newSnake.slice(0, -1));
      }

      draw();
    };

    const intervalId = setInterval(gameLoop, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [snake, food, direction, gameOver]);

  useEffect(() => {
    const updateHighScore = async () => {
      if (gameOver && auth?.currentUser) {
        if (score > highScore) {
          const db = getFirestore();
          const userDocRef = doc(db, "users", auth.currentUser.uid);
          await updateDoc(userDocRef, {
            highScore: score,
          });
          setHighScore(score);
        }
      }
    };

    updateHighScore();
  }, [gameOver, score, highScore, auth?.currentUser]);


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

  const handleLogout = async () => {
    if (auth) {
      try {
        await signOut(auth);
        router.push("/");
      } catch (error: any) {
        console.error("Logout failed:", error);
      }
    }
  };

  const resetGame = () => {
    setSnake(SNAKE_START);
    setFood(FOOD_START);
    setDirection({ x: 1, y: 0 });
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="absolute top-4 left-4 text-lg font-bold">
        {auth?.currentUser?.displayName || "User"}
      </div>
       <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={auth?.currentUser?.photoURL || `https://picsum.photos/48/48?auto=format&amp;fit=crop&amp;q=60&amp;w=48&amp;h=48`} alt={auth?.currentUser?.displayName || "User"} />
                <AvatarFallback>{auth?.currentUser?.displayName?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Open user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="text-lg font-semibold mb-2">
        Score: {score}
      </div>
      <div className="text-lg font-semibold mb-2">
        High Score: {highScore}
      </div>
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * GRID_SIZE}
        height={GRID_SIZE * GRID_SIZE}
        className="border border-gray-500"
      />
      {gameOver && (
        <div className="text-red-500 text-2xl mt-4">
          Game Over!
          <Button onClick={resetGame} className="mt-2">
            Play Again
          </Button>
        </div>
      )}
      <Button onClick={() => router.push("/")}>
        Back to Login
      </Button>
    </div>
  );
};

export default SnakeGame;

