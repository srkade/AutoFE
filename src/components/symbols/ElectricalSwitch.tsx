import React from "react";

interface SwitchProps {
  x?: number; // top-left X offset
  y?: number; // top-left Y offset
  sizeMultiplier?: number; // scale the symbol
  stroke?: string;
  strokeWidth?: number;
  armLengthFactor?: number; // factor to shorten the diagonal arm (0 < factor <= 1)
}

const ElectricalSwitch: React.FC<SwitchProps> = ({
  x = 0,
  y = 0,
  sizeMultiplier = 1,
  stroke = "black",
  strokeWidth = 2,
  armLengthFactor = 0.5, // default shortens the arm by half
}) => {
  // Pivot point (where the arm starts)
  const pivotX = 30 * sizeMultiplier + x;
  const pivotY = 40 * sizeMultiplier + y;

  // Terminals
  const terminalBottomY = 80 * sizeMultiplier + y;
  const terminalTopY = 20 * sizeMultiplier + y;

  // Original diagonal end point
  const originalArmEndX = 50 * sizeMultiplier + x;
  const originalArmEndY = 75 * sizeMultiplier + y;

  // Adjusted diagonal end point using armLengthFactor
  const armEndX = pivotX + (originalArmEndX - pivotX) * armLengthFactor;
  const armEndY = pivotY + (originalArmEndY - pivotY) * armLengthFactor;

  return (
    <g>
      {/* Bottom terminal line */}
      <line
        x1={30 * sizeMultiplier + x}
        y1={terminalBottomY}
        x2={30 * sizeMultiplier + x}
        y2={60 * sizeMultiplier + y}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top terminal line */}
      <line
        x1={30 * sizeMultiplier + x}
        y1={terminalTopY}
        x2={30 * sizeMultiplier + x}
        y2={40 * sizeMultiplier + y}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Switch arm (diagonal) */}
      <line
        x1={pivotX}
        y1={pivotY}
        x2={armEndX}
        y2={armEndY}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </g>
  );
};

export default ElectricalSwitch;
