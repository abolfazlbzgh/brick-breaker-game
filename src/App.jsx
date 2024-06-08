import { useState } from 'react'
import './App.css'
import Game from './components/Game';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="w-screen h-screen bg-gray-900 flex justify-center items-center">
    <Game />
  </div>
  )
}

export default App
