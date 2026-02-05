"use client"

import { useRouter } from "next/navigation"
import { Confetti } from "./confetti"

interface SuccessModalProps {
  isOpen: boolean
  puzzleTitle: string
  starsCollected: number
  totalStars: number
  onSpinAgain: () => void
}

export function SuccessModal({
  isOpen,
  puzzleTitle,
  starsCollected,
  totalStars,
  onSpinAgain,
}: SuccessModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  return (
    <>
      <Confetti />
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-3xl p-8 max-w-lg mx-4 shadow-2xl text-center animate-bounce-in">
          {/* Trophy */}
          <div className="text-8xl mb-4">🏆</div>

          {/* Title */}
          <h2 className="text-4xl font-bold text-emerald-600 mb-2">
            You Did It!
          </h2>

          {/* Subtitle */}
          <p className="text-xl text-slate-600 mb-4">
            Amazing job completing <strong>{puzzleTitle}</strong>!
          </p>

          {/* Stars */}
          {totalStars > 0 && (
            <div className="flex justify-center gap-2 mb-6">
              {Array.from({ length: totalStars }).map((_, i) => (
                <span
                  key={i}
                  className={`text-4xl ${i < starsCollected ? "" : "opacity-30"}`}
                >
                  ⭐
                </span>
              ))}
            </div>
          )}

          {/* Celebration message */}
          <p className="text-lg text-slate-500 mb-8">
            You are a coding superstar!
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-4">
            <button
              onClick={onSpinAgain}
              className="w-full px-8 py-5 text-2xl font-bold text-white bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-2xl shadow-lg hover:from-emerald-400 hover:to-emerald-500 active:scale-95 transition-all touch-manipulation"
            >
              Spin Again!
            </button>

            <button
              onClick={() => router.push("/")}
              className="w-full px-6 py-3 text-lg font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 active:scale-95 transition-all touch-manipulation"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
