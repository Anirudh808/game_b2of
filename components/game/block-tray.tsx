"use client"

import type { Command } from "@/lib/types"

interface BlockTrayProps {
  allowedCommands: Command[]
  onAddCommand: (command: Command) => void
  disabled?: boolean
}

const COMMAND_CONFIG: Record<
  Command,
  { label: string; icon: string; color: string }
> = {
  MOVE: {
    label: "Move",
    icon: "➡️",
    color: "bg-blue-500 hover:bg-blue-400 active:bg-blue-600",
  },
  TURN_LEFT: {
    label: "Left",
    icon: "↩️",
    color: "bg-amber-500 hover:bg-amber-400 active:bg-amber-600",
  },
  TURN_RIGHT: {
    label: "Right",
    icon: "↪️",
    color: "bg-orange-500 hover:bg-orange-400 active:bg-orange-600",
  },
  PICK_STAR: {
    label: "Pick",
    icon: "⭐",
    color: "bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600",
  },
  REPEAT_2: {
    label: "x2",
    icon: "🔁",
    color: "bg-purple-500 hover:bg-purple-400 active:bg-purple-600",
  },
  REPEAT_3: {
    label: "x3",
    icon: "🔁",
    color: "bg-pink-500 hover:bg-pink-400 active:bg-pink-600",
  },
}

export function BlockTray({
  allowedCommands,
  onAddCommand,
  disabled,
}: BlockTrayProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg">
      <h3 className="text-lg font-bold text-slate-700 mb-3 text-center">
        Commands
      </h3>
      <div className="flex flex-wrap gap-2 justify-center">
        {allowedCommands.map((command) => {
          const config = COMMAND_CONFIG[command]
          return (
            <button
              key={command}
              onClick={() => onAddCommand(command)}
              disabled={disabled}
              className={`
                ${config.color}
                px-4 py-3 rounded-xl
                text-white font-bold text-lg
                shadow-md transition-all
                active:scale-95 touch-manipulation
                disabled:opacity-50 disabled:cursor-not-allowed
                min-w-[80px] min-h-[60px]
                flex flex-col items-center justify-center gap-1
              `}
            >
              <span className="text-2xl">{config.icon}</span>
              <span className="text-sm">{config.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { COMMAND_CONFIG }
