"use client"

import { ChevronUp, ChevronDown, X } from "lucide-react"
import type { ProgramBlock } from "@/lib/types"
import { COMMAND_CONFIG } from "./block-tray"

interface ProgramListProps {
  blocks: ProgramBlock[]
  onRemove: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  disabled?: boolean
  currentStep?: number
}

export function ProgramList({
  blocks,
  onRemove,
  onMoveUp,
  onMoveDown,
  disabled,
  currentStep,
}: ProgramListProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-700 mb-3 text-center">
        My Program
      </h3>

      {blocks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-center p-4">
          <p>Tap commands to add them here!</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
          {blocks.map((block, index) => {
            const config = COMMAND_CONFIG[block.command]
            const isCurrentStep = currentStep !== undefined && index === currentStep - 1
            
            return (
              <div
                key={block.id}
                className={`
                  flex items-center gap-2 p-2 rounded-xl
                  ${isCurrentStep ? "ring-4 ring-emerald-400 bg-emerald-50" : "bg-slate-100"}
                  transition-all
                `}
              >
                {/* Step number */}
                <span className="w-6 h-6 flex items-center justify-center bg-slate-300 text-slate-700 rounded-full text-sm font-bold">
                  {index + 1}
                </span>

                {/* Command block */}
                <div
                  className={`
                    flex-1 flex items-center gap-2 px-3 py-2 rounded-lg
                    ${config.color.split(" ")[0]} text-white
                  `}
                >
                  <span className="text-xl">{config.icon}</span>
                  <span className="font-bold">{config.label}</span>
                </div>

                {/* Controls */}
                {!disabled && (
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => onMoveUp(block.id)}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 touch-manipulation"
                      aria-label="Move up"
                    >
                      <ChevronUp className="w-5 h-5 text-slate-600" />
                    </button>
                    <button
                      onClick={() => onMoveDown(block.id)}
                      disabled={index === blocks.length - 1}
                      className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 touch-manipulation"
                      aria-label="Move down"
                    >
                      <ChevronDown className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                )}

                {/* Remove button */}
                {!disabled && (
                  <button
                    onClick={() => onRemove(block.id)}
                    className="p-2 rounded-full hover:bg-red-100 touch-manipulation"
                    aria-label="Remove command"
                  >
                    <X className="w-5 h-5 text-red-500" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Block count */}
      <div className="mt-2 text-center text-sm text-slate-500">
        {blocks.length} step{blocks.length !== 1 ? "s" : ""}
      </div>
    </div>
  )
}
