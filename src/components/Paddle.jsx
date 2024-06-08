import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';

export default function Paddle({paddlePosition, setPaddlePosition }) {

  const screenWidth = window.innerWidth;
  const paddleWidth = 96; // Adjusted for your CSS settings (e.g., w-24 in Tailwind, which equals 24 * 4px = 96px)

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const newPaddlePosition = touch.clientX - paddleWidth / 2;
    setPaddlePosition(Math.max(0, Math.min(screenWidth - paddleWidth, newPaddlePosition)));
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const newPaddlePosition = e.clientX - paddleWidth / 2;
      setPaddlePosition(Math.max(0, Math.min(screenWidth - paddleWidth, newPaddlePosition)));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [setPaddlePosition, paddleWidth, screenWidth]);

  return (
    <div
      className="absolute bottom-0 cursor-pointer bg-sky-500 rounded-md w-24 h-6"
      style={{ left: `${paddlePosition}px` }}
    ></div>
  );

}
