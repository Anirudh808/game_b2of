"use client";

import * as React from "react";
import type { Command } from "@/lib/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type CommandDoc = {
  title: string;
  short: string;
  pseudocode: string[];
  notes?: string[];
};

const COMMAND_DOCS: Record<Command, CommandDoc> = {
  MOVE: {
    title: "MOVE",
    short: "Go 1 step forward",
    pseudocode: [
      "next = position + directionVector(dir)",
      "if next is outside grid OR has obstacle:",
      "  show 'Bump! Can't go there!'",
      "  stay here",
      "else:",
      "  position = next",
    ],
    notes: ["Moves only 1 tile.", "Stops the program if it bumps (error)."],
  },

  TURN_LEFT: {
    title: "TURN_LEFT",
    short: "Turn left (no movement)",
    pseudocode: ["dir = turnLeft(dir)"],
    notes: ["Only changes direction."],
  },

  TURN_RIGHT: {
    title: "TURN_RIGHT",
    short: "Turn right (no movement)",
    pseudocode: ["dir = turnRight(dir)"],
    notes: ["Only changes direction."],
  },

  PICK_STAR: {
    title: "PICK_STAR",
    short: "Pick a star if you’re standing on it",
    pseudocode: [
      "if there is a star at (x, y) AND not already collected:",
      "  collectedStars.add((x, y))",
      "  show 'Got a star!'",
      "else:",
      "  show 'No star here!'",
    ],
    notes: ["Stars can be collected only once."],
  },

  REPEAT_2: {
    title: "REPEAT_2",
    short: "Repeat the last action 2 times",
    pseudocode: [
      "prev = last non-repeat command you added",
      "if prev exists:",
      "  add prev 1 more time",
      "else:",
      "  do nothing",
    ],
    notes: ["It repeats the previous action, not a whole block."],
  },

  REPEAT_3: {
    title: "REPEAT_3",
    short: "Repeat the last action 3 times",
    pseudocode: [
      "prev = last non-repeat command you added",
      "if prev exists:",
      "  add prev 2 more times",
      "else:",
      "  do nothing",
    ],
    notes: ["It repeats the previous action, not a whole block."],
  },
};

export function CommandInfoHover({
  command,
  className,
}: {
  command: Command;
  className?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="How commands work"
          className={cn(
            "inline-flex h-5 w-5 items-center justify-center rounded-full",
            "border bg-white text-zinc-700 shadow-sm hover:bg-zinc-50",
            className
          )}
        >
          <span className="text-xs">i</span>
        </button>
      </PopoverTrigger>
      {/* 
        Responsive width: 
        - Default (mobile): w-[90vw] or fixed but small
        - sm+: w-[340px]
      */}
      <PopoverContent className="w-[300px] sm:w-[340px] p-0" side="left" align="start">
        <div className="px-4 pt-4">
          <div className="text-sm font-semibold text-zinc-900">
            How Commands Work
          </div>
          <div className="mt-1 text-xs text-zinc-600">
            Click a command to add it. Here’s the “mini code” for each one.
          </div>
        </div>

        {/* Content */}
        <CommandDocView cmd={command} />

        <div className="border-t border-zinc-100 px-4 py-3 text-[11px] text-zinc-500">
          Tip: Tap on a command name to preview its logic.
        </div>
      </PopoverContent>
    </Popover>
  );
}

function CommandDocView({ cmd }: { cmd: Command }) {
  const doc = COMMAND_DOCS[cmd];

  return (
    <div className="px-4 pb-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-900">{doc.title}</div>
          <div className="mt-0.5 text-xs text-zinc-600">{doc.short}</div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
        <pre className="whitespace-pre-wrap text-xs leading-5 text-zinc-900">
          {doc.pseudocode.map((line, i) => (
            <div key={i} className="font-mono">
              {line}
            </div>
          ))}
        </pre>
      </div>

      {!!doc.notes?.length && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-zinc-700">
          {doc.notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
