import React from 'react'

export default function Ball({ position }) {
    return (
        <div
          className="absolute bg-orange-500 w-4 h-4 rounded-full"
          style={{ left: `${position.x}px`, top: `${position.y}px` }}
        ></div>
      );
}
