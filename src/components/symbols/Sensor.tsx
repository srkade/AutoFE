import React from "react";

interface DiagonalBoxProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  stroke?: string;
  strokeWidth?: number;
  sizeMultiplier?: number;
}

const Sensor: React.FC<DiagonalBoxProps> = ({
  x = 30,
  y = 30,
  width = 10,
  height = 16,
  stroke = "black",
  strokeWidth = 1,
  sizeMultiplier = 1,
}) => {
  const safeVal = (val: number, fallback: number = 0): number =>
    Number.isFinite(val) ? val : fallback;

  const finalWidth = safeVal(width * sizeMultiplier, 10);
  const finalHeight = safeVal(height * sizeMultiplier, 16);
  const finalX = safeVal(x * sizeMultiplier, 30);
  const finalY = safeVal(y * sizeMultiplier, 30);
  const extensionAmount = 4;

  return (
    <g>
      <rect
        x={finalX}
        y={finalY}
        width={finalWidth}
        height={finalHeight}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        rx="0"
        ry="0"
      />
      <line
        x1={finalX + finalWidth + extensionAmount}
        y1={finalY - extensionAmount}
        x2={finalX - extensionAmount}
        y2={finalY + finalHeight + extensionAmount}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </g>
  );
};

export default Sensor;
