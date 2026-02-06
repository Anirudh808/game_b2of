"use client"

import * as React from "react"
import { ChevronUp, ChevronDown, X } from "lucide-react"
import type { ProgramBlock, Command } from "@/lib/types"
import { COMMAND_CONFIG } from "./block-tray"

interface ProgramListProps {
  blocks: ProgramBlock[]
  onRemove: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  onAddCommand?: (command: Command, index?: number) => void
  onReorderCommand?: (fromIndex: number, toIndex: number) => void
  disabled?: boolean
  currentStep?: number
}

// Helper to determine drop position relative to an element
const getDropPosition = (e: React.DragEvent, element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const midY = rect.top + rect.height / 2;
  return e.clientY < midY ? "before" : "after";
};

export function ProgramList({
  blocks,
  onRemove,
  onMoveUp,
  onMoveDown,
  onAddCommand,
  onReorderCommand,
  disabled,
  currentStep,
}: ProgramListProps) {
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);
  const [dropPosition, setDropPosition] = React.useState<"before" | "after" | null>(null);

  // Main container drag over (for appending)
  const handleContainerDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    // Only highlight if not dragging over a specific item
    if (dragOverIndex === null) {
        // e.currentTarget.classList.add("bg-emerald-50"); 
    }
  };

  const handleContainerDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverIndex(null);
    setDropPosition(null);
    if (disabled || !onAddCommand) return;
    
    // Check if we dropped on the container (empty space) -> Append
    try {
      const data = e.dataTransfer.getData("text/plain");
      if (!data) return;
      
      const parsed = JSON.parse(data);
      
      if (parsed.type === "NEW" && parsed.command) {
        onAddCommand(parsed.command); // Append
      } else if (parsed.type === "REORDER" && typeof parsed.index === "number" && onReorderCommand) {
        onReorderCommand(parsed.index, blocks.length); // Move to end
      }
    } catch (err) {
      console.error("Drop error:", err);
    }
  };

  const handleItemDragStart = (e: React.DragEvent, index: number) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", JSON.stringify({ type: "REORDER", index }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleItemDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent container from handling
    if (disabled) return;
    
    const position = getDropPosition(e, e.currentTarget as HTMLElement);
    setDragOverIndex(index);
    setDropPosition(position);
  };

  const handleItemDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Capture state before reset
    const pos = dropPosition;
    
    setDragOverIndex(null);
    setDropPosition(null);
    
    if (disabled) return;

    try {
      const data = e.dataTransfer.getData("text/plain");
      if (!data) return;
      console.log("Item dropped. Data:", data, "Target:", targetIndex, "Pos:", pos);
      const parsed = JSON.parse(data);
      
      // Calculate final insertion index
      // If position is 'after', we want to insert at targetIndex + 1
      const insertionIndex = pos === "after" ? targetIndex + 1 : targetIndex;
      console.log("Calculated insertion index:", insertionIndex);

      if (parsed.type === "NEW" && parsed.command && onAddCommand) {
        onAddCommand(parsed.command, insertionIndex);
      } else if (parsed.type === "REORDER" && typeof parsed.index === "number" && onReorderCommand) {
        console.log("Calls Reorder:", parsed.index, "->", insertionIndex);
        onReorderCommand(parsed.index, insertionIndex);
      }
    } catch (err) {
      console.error("Item Drop error:", err);
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl p-4 shadow-lg h-full flex flex-col transition-colors duration-200"
      onDragOver={handleContainerDragOver}
      onDrop={handleContainerDrop}
    >
      <h3 className="text-lg font-bold text-slate-700 mb-3 text-center">
        My Program
      </h3>

      {blocks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-center p-4 border-2 border-dashed border-slate-200 rounded-xl">
          <p>Drag commands here!</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2 min-h-0 pb-4">
          {blocks.map((block, index) => {
            const config = COMMAND_CONFIG[block.command]
            const isCurrentStep = currentStep !== undefined && index === currentStep - 1
            
            const isDragOverThis = dragOverIndex === index;
            const isBefore = isDragOverThis && dropPosition === "before";
            const isAfter = isDragOverThis && dropPosition === "after";

            return (
              <div
                key={block.id}
                draggable={!disabled}
                onDragStart={(e) => handleItemDragStart(e, index)}
                onDragOver={(e) => handleItemDragOver(e, index)}
                onDrop={(e) => handleItemDrop(e, index)}
                className={`
                  relative flex items-center gap-2 p-2 rounded-xl border-2 transition-all cursor-grab active:cursor-grabbing
                  ${isCurrentStep ? "ring-4 ring-emerald-400 bg-emerald-50 border-transparent" : "bg-slate-50 border-transparent"}
                  ${isDragOverThis ? "z-10" : ""}
                `}
              >
                {/* Visual Insert Indicators */}
                {isBefore && (
                  <div className="absolute -top-2 left-0 right-0 h-1 bg-emerald-500 rounded-full shadow-sm pointer-events-none" />
                )}
                {isAfter && (
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-emerald-500 rounded-full shadow-sm pointer-events-none" />
                )}

                {/* Step number */}
                <span className="w-6 h-6 flex items-center justify-center bg-slate-300 text-slate-700 rounded-full text-sm font-bold select-none">
                  {index + 1}
                </span>

                {/* Command block */}
                <div
                  className={`
                    flex-1 flex items-center gap-2 px-3 py-2 rounded-lg select-none
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
