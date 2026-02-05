"use client";

import { useCallback, useMemo, useState } from "react";
import type { WheelSegment } from "@/lib/types";

interface SpinningWheelProps {
  segments: WheelSegment[];
  onSpinEnd: (segment: WheelSegment) => void;
}

export function SpinningWheel({ segments, onSpinEnd }: SpinningWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const segmentAngle = useMemo(
    () => 360 / Math.max(segments.length, 1),
    [segments.length],
  );

  const size = 520; // matches viewBox width/height
  const centerX = size / 2; // 260
  const centerY = size / 2; // 260
  const radius = size * 0.42; // ~218 (close to your 220)

  const createSegmentPath = (index: number) => {
    const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);

    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const largeArcFlag = segmentAngle > 180 ? 1 : 0;

    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  const getTextPosition = (index: number) => {
    const midAngleDeg = (index + 0.5) * segmentAngle - 90; // -90 => start at top
    const midAngleRad = midAngleDeg * (Math.PI / 180);

    const textRadius = radius * 0.62;

    // Radial rotation: align text along the radius (center -> outward)
    // Keep text readable: flip 180° on the left half of the wheel
    let rotation = midAngleDeg;
    if (rotation > 90 && rotation < 270) rotation += 180;

    return {
      x: centerX + textRadius * Math.cos(midAngleRad),
      y: centerY + textRadius * Math.sin(midAngleRad),
      rotation,
    };
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "#22C55E";
      case "medium":
        return "#F59E0B";
      case "hard":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const spin = useCallback(() => {
    if (isSpinning || segments.length === 0) return;

    setIsSpinning(true);

    const fullRotations = 3 + Math.floor(Math.random() * 4); // 3-6
    const randomSegmentIndex = Math.floor(Math.random() * segments.length);

    // Center of selected segment should land at top pointer
    const targetSegmentRotation =
      randomSegmentIndex * segmentAngle + segmentAngle / 2;

    // Use functional update to avoid stale rotation bugs on rapid clicks
    setRotation(
      (prev) => prev + fullRotations * 360 + (360 - targetSegmentRotation),
    );

    window.setTimeout(() => {
      setIsSpinning(false);
      onSpinEnd(segments[randomSegmentIndex]);
    }, 4000);
  }, [isSpinning, onSpinEnd, segmentAngle, segments]);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative">
        {/* Arrow pointer at top */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
            <polygon
              points="20,35 8,10 32,10"
              fill="#1F2937"
              stroke="#111827"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Wheel */}
        <svg
          viewBox="0 0 520 520"
          className="h-[600px] w-[600px] drop-shadow-2xl select-none"
          role="img"
          aria-label="Spinning wheel"
        >
          <g
            style={{
              transform: `rotate(${rotation}deg)`,
              transformBox: "fill-box",
              transformOrigin: "center",
              transition: isSpinning
                ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                : "none",
            }}
          >
            {segments.map((segment, index) => {
              const midAngleRad =
                ((index + 0.5) * segmentAngle - 90) * (Math.PI / 180);

              // --- radial layout control ---
              const badgeRadius = radius * 0.4; // circle position
              const textRadius = radius * 0.68; // text position
              const radialGap = 12; // gap in pixels

              const badgeX = centerX + badgeRadius * Math.cos(midAngleRad);
              const badgeY = centerY + badgeRadius * Math.sin(midAngleRad);

              const textX =
                centerX + (textRadius + radialGap) * Math.cos(midAngleRad);
              const textY =
                centerY + (textRadius + radialGap) * Math.sin(midAngleRad);

              // radial rotation logic (keep upright)
              let rotationDeg = (index + 0.5) * segmentAngle - 90;
              if (rotationDeg > 90 && rotationDeg < 270) rotationDeg += 180;

              return (
                <g key={segment.id}>
                  <path
                    d={createSegmentPath(index)}
                    fill={segment.color}
                    stroke="#fff"
                    strokeWidth="3"
                  />

                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#1F2937"
                    fontSize="14"
                    fontWeight="700"
                    transform={`rotate(${rotationDeg}, ${textX}, ${textY})`}
                    className="pointer-events-none"
                  >
                    {segment.title.length > 12
                      ? `${segment.title.slice(0, 10)}...`
                      : segment.title}
                  </text>

                  <circle
                    cx={badgeX}
                    cy={badgeY}
                    r="6"
                    fill={getDifficultyColor(segment.difficulty)}
                  />
                </g>
              );
            })}

            {/* Center */}
            <circle
              cx={centerX}
              cy={centerY}
              r="25"
              fill="#1F2937"
              stroke="#111827"
              strokeWidth="3"
            />
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="20"
              fontWeight="700"
            >
              GO
            </text>
          </g>
        </svg>
      </div>

      <button
        onClick={spin}
        disabled={isSpinning || segments.length === 0}
        className="px-12 py-6 text-3xl font-bold text-white bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full shadow-lg hover:from-emerald-400 hover:to-emerald-500 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 min-w-[280px] touch-manipulation -mt-12 ml-4"
      >
        {isSpinning ? "Spinning..." : "Spin the Wheel!"}
      </button>

      <div className="flex gap-6 text-lg">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-green-500" />
          <span className="text-foreground/70">Easy</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-amber-500" />
          <span className="text-foreground/70">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-red-500" />
          <span className="text-foreground/70">Hard</span>
        </div>
      </div>
    </div>
  );
}
