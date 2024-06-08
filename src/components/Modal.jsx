import React from 'react'

export default function Modal({ show, onReset, score, win }) {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">{win ? 'You Win!' : 'Game Over'}</h2>
        <p className="mb-4">Score: {score}</p>
        <button onClick={onReset} className="px-4 py-2 bg-sky-500 text-white rounded-lg">Play Again</button>
      </div>
    </div>
  );
}
