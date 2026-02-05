"use client"

import type { Puzzle, RobotState } from "@/lib/types"

interface GameGridProps {
  puzzle: Puzzle
  robotState: RobotState
}

export function GameGrid({ puzzle, robotState }: GameGridProps) {
  const { gridSize, goal, obstacles, collectibles } = puzzle
  const cellSize = Math.min(60, Math.floor(400 / Math.max(gridSize.rows, gridSize.cols)))

  // Get robot rotation based on direction
  const getRotation = () => {
    switch (robotState.dir) {
      case "N":
        return 0
      case "E":
        return 90
      case "S":
        return 180
      case "W":
        return 270
    }
  }

  // Check if position has an obstacle
  const getObstacle = (x: number, y: number) => {
    return obstacles.find((obs) => obs.x === x && obs.y === y)
  }

  // Check if position has a collectible (not yet collected)
  const getCollectible = (x: number, y: number) => {
    const isCollected = robotState.collectedStars.some(
      (s) => s.x === x && s.y === y
    )
    if (isCollected) return null
    return collectibles.find((c) => c.x === x && c.y === y)
  }

  // Check if position is the goal
  const isGoal = (x: number, y: number) => {
    return goal.x === x && goal.y === y
  }

  // Check if robot is at position
  const isRobotHere = (x: number, y: number) => {
    return robotState.x === x && robotState.y === y
  }

  // Render obstacle icon
  const renderObstacle = (type: string) => {
    switch (type) {
      case "rock":
        return <span className="text-2xl">🪨</span>
      case "water":
        return <span className="text-2xl">💧</span>
      case "wall":
        return (
          <div className="w-full h-full bg-slate-600 rounded-sm border-2 border-slate-700" />
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg">
      <div
        className="grid gap-1 mx-auto"
        style={{
          gridTemplateColumns: `repeat(${gridSize.cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${gridSize.rows}, ${cellSize}px)`,
        }}
      >
        {Array.from({ length: gridSize.rows }).map((_, y) =>
          Array.from({ length: gridSize.cols }).map((_, x) => {
            const obstacle = getObstacle(x, y)
            const collectible = getCollectible(x, y)
            const isGoalCell = isGoal(x, y)
            const hasRobot = isRobotHere(x, y)

            return (
              <div
                key={`${x}-${y}`}
                className={`
                  relative flex items-center justify-center
                  border-2 rounded-lg transition-all duration-300
                  ${
                    isGoalCell
                      ? "bg-emerald-100 border-emerald-400"
                      : "bg-slate-50 border-slate-200"
                  }
                `}
                style={{ width: cellSize, height: cellSize }}
              >
                {/* Goal flag */}
                {isGoalCell && !hasRobot && (
                  <span className="text-2xl absolute">🚩</span>
                )}

                {/* Obstacle */}
                {obstacle && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {renderObstacle(obstacle.type)}
                  </div>
                )}

                {/* Collectible (star) */}
                {collectible && (
                  <span className="text-2xl absolute animate-pulse">⭐</span>
                )}

                {/* Robot */}
                {hasRobot && (
                  <div
                    className="absolute text-3xl transition-transform duration-400"
                    style={{
                      transform: `rotate(${getRotation()}deg)`,
                    }}
                  >
                    🤖
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
