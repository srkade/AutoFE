import React from "react";

interface AntennaProps {
  width?: number;       // SVG width
  height?: number;      // SVG height
  color?: string;       // Color of mast and triangle
  strokeWidth?: number; // Line thickness
  triangleWidth?: number; // Width of triangle base
  triangleHeight?: number; // Height of triangle
}

const Antenna: React.FC<AntennaProps> = ({
  width = 100,
  height = 100,
  color = "#000",
  strokeWidth = 4,
  triangleWidth = 30,
  triangleHeight = 20,
}) => {
  // Center of the mast
  const centerX = width / 2;
  const mastTopY = triangleHeight; // top of mast just under triangle
  const mastBottomY = height - 10; // bottom of mast

  // Triangle points
  const triangleLeftX = centerX - triangleWidth / 2;
  const triangleRightX = centerX + triangleWidth / 2;
  const triangleTipY = 0;
  const triangleBaseY = triangleHeight;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      {/* Mast */}
      <line
        x1={centerX}
        y1={mastTopY}
        x2={centerX}
        y2={mastBottomY}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Inverted triangle */}
      <polygon
        points={`${triangleLeftX},${triangleBaseY} ${triangleRightX},${triangleBaseY} ${centerX},${triangleTipY}`}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Antenna;
