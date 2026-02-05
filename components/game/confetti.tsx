"use client"

import { useEffect, useState } from "react"

interface ConfettiPiece {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  scale: number
  velocityX: number
  velocityY: number
}

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#F7DC6F", "#98D8C8"]

export function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    // Create initial confetti pieces
    const initialPieces: ConfettiPiece[] = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      rotation: Math.random() * 360,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      scale: 0.5 + Math.random() * 0.5,
      velocityX: (Math.random() - 0.5) * 2,
      velocityY: 2 + Math.random() * 3,
    }))

    setPieces(initialPieces)

    // Animate confetti
    let animationId: number
    let lastTime = performance.now()

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 16 // Normalize to ~60fps
      lastTime = currentTime

      setPieces((prev) =>
        prev
          .map((piece) => ({
            ...piece,
            y: piece.y + piece.velocityY * deltaTime,
            x: piece.x + piece.velocityX * deltaTime,
            rotation: piece.rotation + 5 * deltaTime,
          }))
          .filter((piece) => piece.y < 120) // Remove pieces that have fallen off screen
      )

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-4 h-4 rounded-sm"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
          }}
        />
      ))}
    </div>
  )
}
