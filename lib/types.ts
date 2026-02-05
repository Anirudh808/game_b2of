// Direction the robot can face
export type Direction = "N" | "E" | "S" | "W"

// Available commands
export type Command =
  | "MOVE"
  | "TURN_LEFT"
  | "TURN_RIGHT"
  | "PICK_STAR"
  | "REPEAT_2"
  | "REPEAT_3"

// Position on the grid
export interface Position {
  x: number
  y: number
}

// Robot state
export interface RobotState {
  x: number
  y: number
  dir: Direction
  collectedStars: Position[]
}

// Obstacle types
export type ObstacleType = "rock" | "water" | "wall"

// Obstacle definition
export interface Obstacle {
  x: number
  y: number
  type: ObstacleType
}

// Collectible (star)
export interface Collectible {
  x: number
  y: number
  type: "star"
}

// Puzzle difficulty
export type Difficulty = "easy" | "medium" | "hard"

// Success condition
export interface SuccessCondition {
  reachGoal: boolean
  collectAllStars?: boolean
}

// Puzzle definition
export interface Puzzle {
  id: string
  title: string
  difficulty: Difficulty
  shortKidHint: string
  gridSize: {
    rows: number
    cols: number
  }
  start: {
    x: number
    y: number
    dir: Direction
  }
  goal: Position
  obstacles: Obstacle[]
  collectibles: Collectible[]
  allowedCommands: Command[]
  successCondition: SuccessCondition
}

// Program block (a command in the kid's program)
export interface ProgramBlock {
  id: string
  command: Command
}

// Execution result
export interface ExecutionStep {
  robotState: RobotState
  message?: string
  messageType?: "info" | "error" | "success"
}

// Wheel segment
export interface WheelSegment {
  id: string
  title: string
  difficulty: Difficulty
  color: string
}
