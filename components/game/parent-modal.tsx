"use client"

import { useRef, useState } from "react"
import { X } from "lucide-react"

interface ParentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ParentModal({ isOpen, onClose }: ParentModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-background rounded-3xl p-8 max-w-2xl mx-4 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-3xl font-bold text-foreground">
            Parent / Staff Information
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-8 h-8 text-foreground/60" />
          </button>
        </div>

        <div className="space-y-4 text-lg text-foreground/80">
          <p>
            <strong>Welcome!</strong> This is a fun programming puzzle game
            designed for kids ages 6-10.
          </p>

          <div className="bg-muted rounded-2xl p-4">
            <h3 className="font-bold text-foreground mb-2">How It Works:</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Kids spin the wheel to get a random puzzle</li>
              <li>They drag command blocks to create a program</li>
              <li>Press RUN to watch the robot follow their commands</li>
              <li>Success triggers a fun celebration!</li>
            </ol>
          </div>

          <div className="bg-muted rounded-2xl p-4">
            <h3 className="font-bold text-foreground mb-2">Commands:</h3>
            <ul className="space-y-1">
              <li>
                <strong>Move:</strong> Robot moves forward one space
              </li>
              <li>
                <strong>Turn Left/Right:</strong> Robot rotates 90 degrees
              </li>
              <li>
                <strong>Pick Star:</strong> Collects a star if standing on one
              </li>
              <li>
                <strong>Repeat:</strong> Repeats the previous command 2 or 3
                times
              </li>
            </ul>
          </div>

          <div className="bg-muted rounded-2xl p-4">
            <h3 className="font-bold text-foreground mb-2">Tips for Helping:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Let kids experiment - mistakes are part of learning!</li>
              <li>Use the hint if they get stuck</li>
              <li>Easy puzzles take just 3-6 moves</li>
              <li>The Reset button restarts the robot position</li>
              <li>Clear removes all commands to start fresh</li>
            </ul>
          </div>

          <p className="text-sm text-foreground/60 mt-4">
            This app works offline once loaded. No account or internet required.
          </p>
        </div>
      </div>
    </div>
  )
}

interface ParentButtonProps {
  onOpen: () => void
}

export function ParentButton({ onOpen }: ParentButtonProps) {
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [isPressing, setIsPressing] = useState(false)

  const handlePressStart = () => {
    setIsPressing(true)
    pressTimerRef.current = setTimeout(() => {
      onOpen()
      setIsPressing(false)
    }, 2000) // 2 second hold
  }

  const handlePressEnd = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current)
      pressTimerRef.current = null
    }
    setIsPressing(false)
  }

  return (
    <button
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      className={`fixed bottom-4 right-4 px-4 py-2 text-sm text-foreground/40 hover:text-foreground/60 transition-all rounded-lg ${
        isPressing ? "bg-muted scale-95" : ""
      }`}
    >
      {isPressing ? "Hold..." : "Parent/Staff"}
    </button>
  )
}
