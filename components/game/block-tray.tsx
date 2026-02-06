"use client";

import type { Command } from "@/lib/types";
import { CommandInfoHover } from "./CommandInfoHover";

interface BlockTrayProps {
  allowedCommands: Command[];
  onAddCommand: (command: Command) => void;
  disabled?: boolean;
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
};

export function BlockTray({
  allowedCommands,
  onAddCommand,
  disabled,
}: BlockTrayProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-700">Commands</h3>
        <div className="text-xs text-slate-500">Hover (i) to learn</div>
      </div>

      {/* Grid keeps everything aligned and consistent */}
      <div className="grid grid-cols-3 gap-3">
        {allowedCommands.map((command) => {
          const config = COMMAND_CONFIG[command];

          return (
            <div key={command} className="relative">
              {/* Button tile */}
              <button
                onClick={() => onAddCommand(command)}
                disabled={disabled}
                draggable={!disabled}
                onDragStart={(e) => {
                  if (disabled) {
                    e.preventDefault();
                    return;
                  }
                  e.dataTransfer.setData("text/plain", JSON.stringify({ type: "NEW", command }));
                  e.dataTransfer.effectAllowed = "copy";
                  console.log("Drag start (NEW):", command);
                }}
                className={[
                  config.color,
                  "w-full rounded-xl px-3 py-3",
                  "text-white font-bold",
                  "shadow-md transition-all active:scale-95 touch-manipulation",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "cursor-grab active:cursor-grabbing",
                  "min-h-[72px]",
                  "flex flex-col items-center justify-center gap-1",
                ].join(" ")}
              >
                <span className="text-2xl leading-none select-none">{config.icon}</span>
                <span className="text-sm leading-none select-none">{config.label}</span>
              </button>

              {/* Info icon pinned to top-right of this tile */}
              <div className="absolute right-1 top-1">
                <CommandInfoHover command={command} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { COMMAND_CONFIG };
