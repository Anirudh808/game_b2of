import type {
  Command,
  Direction,
  ExecutionStep,
  Puzzle,
  RobotState,
} from "./types"

// Direction vectors
const DIRECTION_VECTORS: Record<Direction, { dx: number; dy: number }> = {
  N: { dx: 0, dy: -1 },
  E: { dx: 1, dy: 0 },
  S: { dx: 0, dy: 1 },
  W: { dx: -1, dy: 0 },
}

// Turn mappings
const TURN_LEFT: Record<Direction, Direction> = {
  N: "W",
  W: "S",
  S: "E",
  E: "N",
}

const TURN_RIGHT: Record<Direction, Direction> = {
  N: "E",
  E: "S",
  S: "W",
  W: "N",
}

// Check if a position is blocked
function isBlocked(x: number, y: number, puzzle: Puzzle): boolean {
  // Out of bounds
  if (x < 0 || y < 0 || x >= puzzle.gridSize.cols || y >= puzzle.gridSize.rows) {
    return true
  }
  // Obstacle
  return puzzle.obstacles.some((obs) => obs.x === x && obs.y === y)
}

// Check if there's a star at position
function hasStarAt(
  x: number,
  y: number,
  puzzle: Puzzle,
  collectedStars: { x: number; y: number }[]
): boolean {
  const isCollectible = puzzle.collectibles.some(
    (c) => c.x === x && c.y === y && c.type === "star"
  )
  const alreadyCollected = collectedStars.some((s) => s.x === x && s.y === y)
  return isCollectible && !alreadyCollected
}

// Execute a single command
function executeCommand(
  command: Command,
  state: RobotState,
  puzzle: Puzzle,
  previousCommand: Command | null
): ExecutionStep {
  const newState = { ...state, collectedStars: [...state.collectedStars] }

  switch (command) {
    case "MOVE": {
      const { dx, dy } = DIRECTION_VECTORS[state.dir]
      const newX = state.x + dx
      const newY = state.y + dy

      if (isBlocked(newX, newY, puzzle)) {
        return {
          robotState: newState,
          message: "Bump! Can't go there!",
          messageType: "error",
        }
      }

      newState.x = newX
      newState.y = newY
      return { robotState: newState }
    }

    case "TURN_LEFT": {
      newState.dir = TURN_LEFT[state.dir]
      return { robotState: newState }
    }

    case "TURN_RIGHT": {
      newState.dir = TURN_RIGHT[state.dir]
      return { robotState: newState }
    }

    case "PICK_STAR": {
      if (hasStarAt(state.x, state.y, puzzle, state.collectedStars)) {
        newState.collectedStars.push({ x: state.x, y: state.y })
        return {
          robotState: newState,
          message: "Got a star!",
          messageType: "success",
        }
      }
      return {
        robotState: newState,
        message: "No star here!",
        messageType: "info",
      }
    }

    case "REPEAT_2":
    case "REPEAT_3": {
      // These are handled at a higher level
      return { robotState: newState }
    }

    default:
      return { robotState: newState }
  }
}

// Expand program with repeats
export function expandProgram(commands: Command[]): Command[] {
  const expanded: Command[] = []

  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i]

    if (cmd === "REPEAT_2" || cmd === "REPEAT_3") {
      const repeatCount = cmd === "REPEAT_2" ? 2 : 3
      // Find the previous non-repeat command
      let prevCmd: Command | null = null
      for (let j = expanded.length - 1; j >= 0; j--) {
        if (expanded[j] !== "REPEAT_2" && expanded[j] !== "REPEAT_3") {
          prevCmd = expanded[j]
          break
        }
      }
      if (prevCmd) {
        // Add extra repetitions (the command was already added once)
        for (let k = 0; k < repeatCount - 1; k++) {
          expanded.push(prevCmd)
        }
      }
    } else {
      expanded.push(cmd)
    }
  }

  return expanded
}

// Execute entire program step by step
export function executeProgram(
  commands: Command[],
  puzzle: Puzzle
): ExecutionStep[] {
  const expandedCommands = expandProgram(commands)
  const steps: ExecutionStep[] = []

  let currentState: RobotState = {
    x: puzzle.start.x,
    y: puzzle.start.y,
    dir: puzzle.start.dir,
    collectedStars: [],
  }

  // Initial state
  steps.push({ robotState: { ...currentState } })

  let previousCommand: Command | null = null

  for (const command of expandedCommands) {
    const step = executeCommand(command, currentState, puzzle, previousCommand)
    currentState = step.robotState
    steps.push(step)
    previousCommand = command

    // Stop if we hit a wall
    if (step.messageType === "error") {
      break
    }
  }

  return steps
}

// Check if puzzle is solved
export function checkSuccess(finalState: RobotState, puzzle: Puzzle): boolean {
  const { successCondition } = puzzle

  // Check goal reached
  if (successCondition.reachGoal) {
    if (finalState.x !== puzzle.goal.x || finalState.y !== puzzle.goal.y) {
      return false
    }
  }

  // Check all stars collected
  if (successCondition.collectAllStars) {
    const totalStars = puzzle.collectibles.filter((c) => c.type === "star").length
    if (finalState.collectedStars.length !== totalStars) {
      return false
    }
  }

  return true
}

// Get initial robot state
export function getInitialState(puzzle: Puzzle): RobotState {
  return {
    x: puzzle.start.x,
    y: puzzle.start.y,
    dir: puzzle.start.dir,
    collectedStars: [],
  }
}
