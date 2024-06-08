import React, { useState, useEffect, useRef, useCallback } from 'react';
import Paddle from './Paddle';
import Ball from './Ball';
import Brick from './Brick';
import Modal from './Modal';


export default function Game() {
  const [bricks, setBricks] = useState([]);
  const [ballPosition, setBallPosition] = useState({ x: window.innerWidth / 2+Math.floor(Math.random() * 100), y: window.innerHeight / 2 +Math.floor(Math.random() * 100) });
  const [ballDirection, setBallDirection] = useState({ x: 2, y: -2 });
  const [paddlePosition, setPaddlePosition] = useState(250);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false); 
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    return localStorage.getItem('bestScore') ? parseInt(localStorage.getItem('bestScore')) : 0;
  });
  const [ballSpeed, setBallSpeed] = useState(2);
  const gameRef = useRef(null);
  const animationFrameRef = useRef();
  const paddingTop = 64;

  const colors = [
    'bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
    'bg-orange-500', 'bg-sky-500'
  ];

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const brickWidth = 50;
    const brickMargin = 10;
    const gap = 2 * (brickWidth + brickMargin); // 2 bricks worth of gap on each side
    const rows = 5;
    const cols = Math.floor((screenWidth - gap) / (brickWidth + brickMargin));
    const newBricks = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const colorClass = colors[Math.floor(Math.random() * colors.length)];
        newBricks.push({
          x: col * (brickWidth + brickMargin) + gap / 2,
          y: row * (brickWidth + brickMargin / 2) + paddingTop + 8, // 8px margin from the top
          width: brickWidth,
          height: 20,
          id: `${row}-${col}`,
          color: colorClass
        });
      }
    }
    setBricks(newBricks);
  }, []);

  const updateBallPosition = useCallback(() => {
    setBallPosition((prevPosition) => {
      const newPos = {
        x: prevPosition.x + ballDirection.x * ballSpeed,
        y: prevPosition.y + ballDirection.y * ballSpeed
      };

      // Collision detection with walls
      if (newPos.x <= 0) {
        setBallDirection((prevDirection) => ({ ...prevDirection, x: ballSpeed }));
      }
      if (newPos.x >= gameRef.current.clientWidth - 4) {
        setBallDirection((prevDirection) => ({ ...prevDirection, x: -ballSpeed }));
      }
      if (newPos.y <= paddingTop) { // 100px margin from the top
        setBallDirection((prevDirection) => ({ ...prevDirection, y: ballSpeed }));
      }

      // Check if the ball reaches the bottom of the screen
      if (newPos.y >= gameRef.current.clientHeight - 4) {
        setGameOver(true);
        cancelAnimationFrame(animationFrameRef.current);
        return prevPosition; // Do not update the ball position
      }

      // Collision detection with paddle
      const paddleHeight = 20;
      const paddleWidth = 100;
      const paddleY = gameRef.current.clientHeight - paddleHeight;
      if (newPos.y >= paddleY - paddleHeight && newPos.x >= paddlePosition && newPos.x <= paddlePosition + paddleWidth) {
        setBallDirection((prevDirection) => ({ ...prevDirection, y: -ballSpeed }));
      }

      // Collision detection with bricks
      setBricks((prevBricks) =>
        prevBricks.filter((brick) => {
          if (
            newPos.x >= brick.x &&
            newPos.x <= brick.x + brick.width &&
            newPos.y >= brick.y &&
            newPos.y <= brick.y + brick.height
          ) {
            setBallDirection((prevDirection) => ({ ...prevDirection, y: -prevDirection.y }));
            setScore((prevScore) => prevScore + 1);
            return false;
          }
          return true;
        })
      );

      return newPos;
    });

    animationFrameRef.current = requestAnimationFrame(updateBallPosition);
  }, [ballDirection, paddlePosition, ballSpeed]);

  useEffect(() => {
    if (!gameOver && !win) {
      animationFrameRef.current = requestAnimationFrame(updateBallPosition);
    }
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [updateBallPosition, gameOver, win]);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('bestScore', score);
    }
  }, [score, bestScore]);

  useEffect(() => {
    if (bricks.length === 0 && !gameOver && score) {
      setWin(true);
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, [bricks, gameOver]);


  const increaseSpeed = () => {
    setBallSpeed((prevSpeed) => prevSpeed + 1);
  };

  const decreaseSpeed = () => {
    setBallSpeed((prevSpeed) => Math.max(1, prevSpeed - 1)); // Ensure speed doesn't go below 1
  };

  return (
    <div ref={gameRef} className="relative  w-full h-full overflow-hidden bg-gray-800">
      <div className="absolute top-0 h-16 left-0 right-0 shadow-lg flex items-center justify-between p-4 text-white bg-gray-900">
        <div>Score: {score}</div>
        <div>Best: {bestScore}</div>
        <div className="flex gap-2 items-center">
          <button className="px-2 h-9 w-9 py-1 shadow-lg bg-sky-500 rounded-l-full rounded-r-lg" onClick={decreaseSpeed}>-</button>
          <h3>Speed: {ballSpeed}</h3>
          <button className="px-2 h-9 w-9 py-1 shadow-lg bg-sky-500 rounded-r-full rounded-l-lg" onClick={increaseSpeed}>+</button>
        </div>
      </div>
      <div className="mt-4"> {/* Additional margin for the bricks */}
        {bricks.map((brick) => (
          <Brick key={brick.id} position={{ x: brick.x, y: brick.y }} color={brick.color} />
        ))}
      </div>
      <Paddle setPaddlePosition={setPaddlePosition} paddlePosition={paddlePosition} />
      <Ball position={ballPosition} />
      <Modal show={gameOver || win} onReset={() => window.location.reload()} score={score} win={win} />
    </div>
  );
}
