"use client"

import { Play, RotateCcw, Trash2 } from "lucide-react"

interface RunControlsProps {
  onRun: () => void
  onReset: () => void
  onClear: () => void
  isRunning: boolean
  canRun: boolean
}

export function RunControls({
  onRun,
  onReset,
  onClear,
  isRunning,
  canRun,
}: RunControlsProps) {
  return (
    <div className="flex gap-4 justify-center flex-wrap">
      {/* Run Button */}
      <button
        onClick={onRun}
        disabled={isRunning || !canRun}
        className={`
          flex items-center gap-3 px-8 py-4
          bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600
          text-white font-bold text-2xl
          rounded-2xl shadow-lg
          transition-all active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
          touch-manipulation min-w-[160px]
        `}
      >
        <Play className="w-8 h-8" fill="white" />
        {isRunning ? "Running..." : "RUN"}
      </button>

      {/* Reset Button */}
      <button
        onClick={onReset}
        disabled={isRunning}
        className={`
          flex items-center gap-2 px-6 py-4
          bg-slate-500 hover:bg-slate-400 active:bg-slate-600
          text-white font-bold text-xl
          rounded-2xl shadow-lg
          transition-all active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
          touch-manipulation
        `}
      >
        <RotateCcw className="w-6 h-6" />
        Reset
      </button>

      {/* Clear Button */}
      <button
        onClick={onClear}
        disabled={isRunning}
        className={`
          flex items-center gap-2 px-6 py-4
          bg-red-500 hover:bg-red-400 active:bg-red-600
          text-white font-bold text-xl
          rounded-2xl shadow-lg
          transition-all active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
          touch-manipulation
        `}
      >
        <Trash2 className="w-6 h-6" />
        Clear
      </button>
    </div>
  )
}
