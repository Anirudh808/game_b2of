"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { SpinningWheel } from "@/components/game/spinning-wheel"
import { ParentButton, ParentModal } from "@/components/game/parent-modal"
import { getWheelSegments } from "@/lib/puzzles"
import type { WheelSegment } from "@/lib/types"

export default function HomePage() {
  const router = useRouter()
  const [showParentModal, setShowParentModal] = useState(false)
  const segments = getWheelSegments()

  const handleSpinEnd = (segment: WheelSegment) => {
    // Small delay before navigation for better UX
    setTimeout(() => {
      router.push(`/puzzle/${segment.id}`)
    }, 800)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 via-sky-50 to-white flex flex-col items-center justify-center p-6">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-2 text-balance">
          Robot Puzzle Adventure
        </h1>
        <p className="text-xl md:text-2xl text-slate-600">
          Spin to pick your challenge!
        </p>
      </div>

      {/* Robot mascot */}
      <div className="text-8xl mb-6 animate-bounce">
        <span role="img" aria-label="Robot">
          🤖
        </span>
      </div>

      {/* Spinning Wheel */}
      <SpinningWheel segments={segments} onSpinEnd={handleSpinEnd} />

      {/* Parent/Staff Button */}
      <ParentButton onOpen={() => setShowParentModal(true)} />

      {/* Parent Modal */}
      <ParentModal
        isOpen={showParentModal}
        onClose={() => setShowParentModal(false)}
      />
    </main>
  )
}
