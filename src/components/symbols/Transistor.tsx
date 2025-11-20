import React from "react";

interface TransistorProps {
  x?: number;
  y?: number;
  sizeMultiplier?: number;
  stroke?: string;
  strokeWidth?: number;
}

const Transistor: React.FC<TransistorProps> = ({
  x = 0,
  y = 0,
  sizeMultiplier = 1,
  stroke = "black",
  strokeWidth = 5,
}) => {
  // Emitter line coordinates
  const ex1 = -10;
  const ey1 = 30;
  const ex2 = 25;
  const ey2 = 45;

  // Bigger Arrow size
  const arrowLength = 18; // along the line
  const arrowWidth = 14; // perpendicular width

  // Direction vector
  const dx = ex2 - ex1;
  const dy = ey2 - ey1;
  const lineLength = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / lineLength;
  const uy = dy / lineLength;

  // Perpendicular vector for width
  const px = -uy;
  const py = ux;

  // Arrow base points
  const baseX = ex2 - ux * arrowLength;
  const baseY = ey2 - uy * arrowLength;
  const leftX = baseX + px * (arrowWidth / 2);
  const leftY = baseY + py * (arrowWidth / 2);
  const rightX = baseX - px * (arrowWidth / 2);
  const rightY = baseY - py * (arrowWidth / 2);

  return (
    <g transform={`translate(${x}, ${y}) scale(${sizeMultiplier})`}>
      {/* Base Line */}
      <line x1={-40} y1={0} x2={-10} y2={0} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />

      {/* Central Bar */}
      <line x1={-10} y1={-40} x2={-10} y2={40} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />

      {/* Collector Line */}
      <line x1={-10} y1={-30} x2={25} y2={-45} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />

      {/* Emitter Line */}
      <line x1={ex1} y1={ey1} x2={ex2} y2={ey2} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />

      {/* Bigger NPN Arrow at emitter */}
      <polygon points={`${ex2},${ey2} ${leftX},${leftY} ${rightX},${rightY}`} fill={stroke} />
    </g>
  );
};

export default Transistor;
