/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Parser } from 'expr-eval'

export default function Calculator() {
  const [exp, setExp] = useState('')
  const [history, setHistory] = useState([])
  const [isError, setIsError] = useState(false)
  const [lastAns, setLastAns] = useState('')
  const [memory, setMemory] = useState(null)

  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault()
    window.addEventListener('contextmenu', handleContextMenu)
    return () => window.removeEventListener('contextmenu', handleContextMenu)
  }, [])

  const handleInput = (key) => {
    if (key === 'Enter' || key === '=') {
      try {
        const parser = new Parser()
        const result = parser.evaluate(exp.replace(/ans/g, lastAns))
        setHistory((prev) => [...prev, `${exp} = ${result}`])
        setExp(result.toString())
        setLastAns(result.toString())
        setIsError(false)
      } catch {
        setExp('Error')
        setIsError(true)
        setTimeout(() => setIsError(false), 1200)
      }
    } else if (key === 'AC') {
      setExp('')
      setHistory([])
      setLastAns('')
    } else if (key === 'CE' || key === 'Escape') {
      setExp('')
    } else if (key === 'Backspace') {
      setExp((prev) => prev.slice(0, -1))
    } else if (key === 'ans') {
      setExp((prev) => prev + 'ans')
    } else if (key === 'MS') {
      setMemory(exp)
    } else if (key === 'MR') {
      if (memory !== null) setExp((prev) => prev + memory)
    } else if (key === 'MC') {
      setMemory(null)
    } else if (/^[0-9+\-*/().^%]$/.test(key) || key === 'pi') {
      const insert = key === 'pi' ? 'pi' : key
      setExp((prev) => prev + insert)
    } else if (['sqrt', 'sin', 'cos', 'tan', 'log', 'abs', 'exp'].includes(key)) {
      setExp((prev) => prev + `${key}(`)
    }
  }

  const handleButtonClick = (e) => handleInput(e.target.name)

  useEffect(() => {
    const handleKeyDown = (e) => {
      const allowedKeys = /^[0-9+\-*/().^%]$|^Enter$|^Backspace$|^Escape$/
      if (allowedKeys.test(e.key)) {
        e.preventDefault()
        handleInput(e.key)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [exp])

  const basicKeys = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+']
  const advancedKeys = ['(', ')', '^', '%', 'sqrt', 'sin', 'cos', 'tan', 'log', 'abs', 'exp', 'pi']
  const memoryKeys = ['MS', 'MR', 'MC']

  return (
    <div className="bg-zinc-950 min-h-screen flex items-center justify-center flex-col p-4">
      <h1 className="text-2xl font-bold text-white mb-4 cursor-default">Pro Calculator</h1>

      <div className="w-full max-w-md bg-zinc-900 p-6 rounded-xl shadow-md">
        {/* Display */}
        <input
          disabled
          value={exp}
          className={`w-full p-3 mb-4 rounded text-lg text-white bg-zinc-800 border ${isError ? 'border-red-500' : 'border-gray-500'}`}
          placeholder="0"
        />

        {/* History */}
        {history.length > 0 && (
          <div className="bg-zinc-800 text-sm text-gray-300 p-2 rounded mb-4 max-h-28 overflow-auto">
            {history
              .slice(-5)
              .reverse()
              .map((item, idx) => (
                <div key={idx} className="whitespace-nowrap truncate">
                  {item}
                </div>
              ))}
          </div>
        )}

        {/* Control buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            onClick={handleButtonClick}
            name="CE"
            className="bg-red-500 text-white p-2 rounded"
          >
            CE
          </button>
          <button
            onClick={handleButtonClick}
            name="AC"
            className="bg-red-700 text-white p-2 rounded"
          >
            AC
          </button>
          <button
            onClick={handleButtonClick}
            name="ans"
            className="bg-teal-600 text-white p-2 rounded"
          >
            ANS
          </button>
        </div>

        {/* Memory buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {memoryKeys.map((btn, idx) => (
            <button
              key={idx}
              onClick={handleButtonClick}
              name={btn}
              className="bg-yellow-500 text-black p-2 rounded"
            >
              {btn}
            </button>
          ))}
        </div>
        {/* Advanced buttons */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {advancedKeys.map((btn, idx) => (
            <button
              key={idx}
              onClick={handleButtonClick}
              name={btn}
              className="bg-purple-600 text-white p-2 rounded text-sm"
            >
              {btn}
            </button>
          ))}
        </div>
        {/* Basic buttons */}
        <div className="grid grid-cols-4 gap-2">
          {basicKeys.map((btn, idx) => (
            <button
              key={idx}
              onClick={handleButtonClick}
              name={btn}
              className={`${
                ['+', '-', '*', '/', '=', '^', '%'].includes(btn) ? 'bg-red-500' : 'bg-blue-500'
              } text-white p-2 rounded`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
