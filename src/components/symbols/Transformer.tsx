import React from "react";

interface TransformerProps {
  x?: number; // top-left X offset
  y?: number; // top-left Y offset
  sizeMultiplier?: number; // scale the symbol
  stroke?: string;
  strokeWidth?: number;
  fill?: string; // fill color for cylinders
}

const Transformer: React.FC<TransformerProps> = ({
  x = 0,
  y = 0,
  sizeMultiplier = 1,
  stroke = "black",
  strokeWidth = 2,
  fill = "black",
}) => {
  // Cylinder positions and sizes
  const leftX = 50 * sizeMultiplier + x;
  const rightX = 120 * sizeMultiplier + x;
  const cylinderY = 50 * sizeMultiplier + y;
  const cylinderWidth = 30 * sizeMultiplier;
  const cylinderHeight = 100 * sizeMultiplier;
  const cylinderRX = 15 * sizeMultiplier;

  // Core line
  const coreX = 95 * sizeMultiplier + x;
  const coreY1 = 50 * sizeMultiplier + y;
  const coreY2 = 150 * sizeMultiplier + y;

  // Top broad lines
  const topLineY1 = 50 * sizeMultiplier + y;
  const topLineY2 = 35 * sizeMultiplier + y;

  // Bottom connections
  const leftBottomX = 65 * sizeMultiplier + x;
  const rightBottomX = 135 * sizeMultiplier + x;
  const bottomY1 = 150 * sizeMultiplier + y;
  const bottomY2 = 170 * sizeMultiplier + y;

  // Baseline
  const baselineX1 = 60 * sizeMultiplier + x;
  const baselineX2 = 170 * sizeMultiplier + x;
  const baselineY = 170 * sizeMultiplier + y;

  return (
    <g>
      {/* Transformer coils */}
      <rect
        x={leftX}
        y={cylinderY}
        width={cylinderWidth}
        height={cylinderHeight}
        rx={cylinderRX}
        ry={cylinderRX}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill={fill}
      />
      <rect
        x={rightX}
        y={cylinderY}
        width={cylinderWidth}
        height={cylinderHeight}
        rx={cylinderRX}
        ry={cylinderRX}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill={fill}
      />

      {/* Thin vertical core line */}
      <line
        x1={coreX}
        y1={coreY1}
        x2={coreX}
        y2={coreY2}
        stroke={stroke}
        strokeWidth={1}
      />

      {/* Lines connecting cylinders to baseline */}
      <line
        x1={leftBottomX}
        y1={bottomY1}
        x2={leftBottomX}
        y2={bottomY2}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <line
        x1={rightBottomX}
        y1={bottomY1}
        x2={rightBottomX}
        y2={bottomY2}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />

      {/* Broad lines at top of cylinders */}
      <line
        x1={leftBottomX}
        y1={topLineY1}
        x2={leftBottomX}
        y2={topLineY2}
        stroke={stroke}
        strokeWidth={6}
      />
      <line
        x1={rightBottomX}
        y1={topLineY1}
        x2={rightBottomX}
        y2={topLineY2}
        stroke={stroke}
        strokeWidth={6}
      />

      {/* Baseline */}
      <line
        x1={baselineX1}
        y1={baselineY}
        x2={baselineX2}
        y2={baselineY}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </g>
  );
};

export default Transformer;
