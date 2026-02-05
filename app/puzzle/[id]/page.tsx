"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { GameGrid } from "@/components/game/game-grid";
import { BlockTray } from "@/components/game/block-tray";
import { ProgramList } from "@/components/game/program-list";
import { RunControls } from "@/components/game/run-controls";
import { SuccessModal } from "@/components/game/success-modal";
import { MessageToast } from "@/components/game/message-toast";
import { ParentButton, ParentModal } from "@/components/game/parent-modal";
import { getPuzzleById } from "@/lib/puzzles";
import { executeProgram, checkSuccess, getInitialState } from "@/lib/engine";
import type { Command, ProgramBlock, RobotState } from "@/lib/types";

const STEP_DELAY = 200; // ms between each step

export default function PuzzlePage() {
  const params = useParams();
  const router = useRouter();
  const puzzleId = params.id as string;

  const puzzle = useMemo(() => getPuzzleById(puzzleId), [puzzleId]);

  const [program, setProgram] = useState<ProgramBlock[]>([]);
  const [robotState, setRobotState] = useState<RobotState | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | undefined>(undefined);
  const [message, setMessage] = useState<{
    text: string;
    type: "info" | "error" | "success";
  } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showParentModal, setShowParentModal] = useState(false);

  // Initialize robot state when puzzle loads
  useEffect(() => {
    if (puzzle) {
      setRobotState(getInitialState(puzzle));
    }
  }, [puzzle]);

  // Clear message after delay
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Add command to program
  const handleAddCommand = useCallback((command: Command) => {
    setProgram((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, command },
    ]);
  }, []);

  // Remove command from program
  const handleRemoveCommand = useCallback((id: string) => {
    setProgram((prev) => prev.filter((block) => block.id !== id));
  }, []);

  // Move command up
  const handleMoveUp = useCallback((id: string) => {
    setProgram((prev) => {
      const index = prev.findIndex((block) => block.id === id);
      if (index <= 0) return prev;
      const newProgram = [...prev];
      [newProgram[index - 1], newProgram[index]] = [
        newProgram[index],
        newProgram[index - 1],
      ];
      return newProgram;
    });
  }, []);

  // Move command down
  const handleMoveDown = useCallback((id: string) => {
    setProgram((prev) => {
      const index = prev.findIndex((block) => block.id === id);
      if (index < 0 || index >= prev.length - 1) return prev;
      const newProgram = [...prev];
      [newProgram[index], newProgram[index + 1]] = [
        newProgram[index + 1],
        newProgram[index],
      ];
      return newProgram;
    });
  }, []);

  // Reset robot to start position
  const handleReset = useCallback(() => {
    if (puzzle) {
      setRobotState(getInitialState(puzzle));
      setCurrentStep(undefined);
      setMessage(null);
      setShowSuccess(false);
    }
  }, [puzzle]);

  // Clear program
  const handleClear = useCallback(() => {
    setProgram([]);
    handleReset();
  }, [handleReset]);

  // Run program
  const handleRun = useCallback(() => {
    if (!puzzle || program.length === 0) return;

    setIsRunning(true);
    setShowSuccess(false);
    setRobotState(getInitialState(puzzle));

    const commands = program.map((block) => block.command);
    const steps = executeProgram(commands, puzzle);

    let stepIndex = 0;

    const runStep = () => {
      if (stepIndex >= steps.length) {
        setIsRunning(false);
        setCurrentStep(undefined);

        // Check for success
        const finalState = steps[steps.length - 1].robotState;
        if (checkSuccess(finalState, puzzle)) {
          setTimeout(() => setShowSuccess(true), 300);
        }
        return;
      }

      const step = steps[stepIndex];
      setRobotState(step.robotState);
      setCurrentStep(stepIndex);

      if (step.message) {
        setMessage({ text: step.message, type: step.messageType || "info" });
      }

      // Stop on error
      if (step.messageType === "error") {
        setIsRunning(false);
        setCurrentStep(undefined);
        return;
      }

      stepIndex++;
      setTimeout(runStep, STEP_DELAY);
    };

    runStep();
  }, [puzzle, program]);

  // Spin again handler
  const handleSpinAgain = useCallback(() => {
    router.push("/");
  }, [router]);

  // 404 if puzzle not found
  if (!puzzle) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-white">
        <div className="text-center">
          <div className="text-6xl mb-4">🤔</div>
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            Puzzle not found
          </h1>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 transition-colors"
          >
            Go Home
          </button>
        </div>
      </main>
    );
  }

  if (!robotState) {
    return null; // Loading state
  }

  const totalStars = puzzle.collectibles.filter(
    (c) => c.type === "star",
  ).length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 via-sky-50 to-white p-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-white/50 rounded-xl transition-all touch-manipulation"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg font-medium">Back</span>
        </button>

        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            {puzzle.title}
          </h1>
          <span
            className={`
              inline-block px-3 py-1 rounded-full text-sm font-bold text-white
              ${puzzle.difficulty === "easy" ? "bg-emerald-500" : ""}
              ${puzzle.difficulty === "medium" ? "bg-amber-500" : ""}
              ${puzzle.difficulty === "hard" ? "bg-red-500" : ""}
            `}
          >
            {puzzle.difficulty.charAt(0).toUpperCase() +
              puzzle.difficulty.slice(1)}
          </span>
        </div>

        <button
          onClick={() => setShowHint((prev) => !prev)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl transition-all touch-manipulation
            ${showHint ? "bg-amber-100 text-amber-700" : "text-slate-600 hover:text-slate-800 hover:bg-white/50"}
          `}
        >
          <Lightbulb className="w-6 h-6" />
          <span className="text-lg font-medium">Hint</span>
        </button>
      </header>

      {/* Hint */}
      {showHint && (
        <div className="mb-4 p-4 bg-amber-100 rounded-2xl text-center">
          <p className="text-lg text-amber-800 font-medium">
            {puzzle.shortKidHint}
          </p>
        </div>
      )}

      {/* Main game area */}
      <div className="flex flex-col lg:flex-row gap-4 max-w-7xl mx-auto">
        {/* Left: Grid and Controls */}
        <div className="flex-1 flex flex-col gap-4">
          <GameGrid puzzle={puzzle} robotState={robotState} />
          <RunControls
            onRun={handleRun}
            onReset={handleReset}
            onClear={handleClear}
            isRunning={isRunning}
            canRun={program.length > 0}
          />
        </div>

        {/* Right: Commands and Program */}
        <div className="flex flex-col gap-4 lg:w-80">
          <BlockTray
            allowedCommands={puzzle.allowedCommands}
            onAddCommand={handleAddCommand}
            disabled={isRunning}
          />
          <div className="flex-1 min-h-[300px]">
            <ProgramList
              blocks={program}
              onRemove={handleRemoveCommand}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              disabled={isRunning}
              currentStep={currentStep}
            />
          </div>
        </div>
      </div>

      {/* Message Toast */}
      <MessageToast message={message?.text || null} type={message?.type} />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        puzzleTitle={puzzle.title}
        starsCollected={robotState.collectedStars.length}
        totalStars={totalStars}
        onSpinAgain={handleSpinAgain}
      />

      {/* Parent/Staff Button */}
      <ParentButton onOpen={() => setShowParentModal(true)} />

      {/* Parent Modal */}
      <ParentModal
        isOpen={showParentModal}
        onClose={() => setShowParentModal(false)}
      />
    </main>
  );
}
