import React from "react";

interface LampSymbols extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
  strokeWidth?: number;
  cx?: number;
  cy?: number;
}

const LampSymbol: React.FC<LampSymbols> = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  cx = 0,
  cy = 0,
  ...props
}) => {
  const radius = size / 2;
  const center = 12; // since our viewBox is 0 0 24 24
  const circleRadius = 10;

  // Coordinates for diagonal lines that touch the circle's edge
  const offset = Math.sqrt((circleRadius ** 2) / 2); // about 7.07 for radius=10

  return (
    <g transform={`translate(${cx - radius}, ${cy - radius})`} {...props}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Circle */}
        <circle cx={center} cy={center} r={circleRadius} />

        {/* Diagonal cross lines that touch circle boundary */}
        <line
          x1={center - offset}
          y1={center - offset}
          x2={center + offset}
          y2={center + offset}
        />
        <line
          x1={center + offset}
          y1={center - offset}
          x2={center - offset}
          y2={center + offset}
        />
      </svg>
    </g>
  );
};

export default LampSymbol;
