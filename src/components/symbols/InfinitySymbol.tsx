import React from "react";

const InfinitySymbol = ({
  cx,
  cy,
  width = 20,
  height = 10,
  color = "black",
  strokeWidth = 1.5,
  rotation = 0,
}: {
  cx: number;
  cy: number;
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  rotation?: number;
}) => {
  // Base path is 20 units wide (-10 to 10) and 16 units high (-8 to 8)
  const scaleX = width / 20;
  const scaleY = height / 16;

  // Use the smaller scale for stroke width to prevent it from getting too thick
  const effectiveScale = Math.min(scaleX, scaleY) || 1;

  return (
    <g transform={`translate(${cx}, ${cy}) rotate(${rotation}) scale(${scaleX}, ${scaleY})`}>
      <path
        d="M 0,0 C -5,-8 -10,-8 -10,0 C -10,8 -5,8 0,0 C 5,-8 10,-8 10,0 C 10,8 5,8 0,0 Z"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth / effectiveScale}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
};

export default InfinitySymbol;
