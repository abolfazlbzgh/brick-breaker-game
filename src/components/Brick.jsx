import React from 'react'

export default function Brick({ position, color }) {
  return (
    <div
      className={`absolute ${color} rounded-lg`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '50px',
        height: '20px',
      }}
    ></div>
  );
}
