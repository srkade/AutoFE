import React from "react";

export type FemaleConnectorShapeProps = {
  color?: string;
  size?: number;
  cx?: number;
  cy?: number;
};

const FemaleConnectorShape: React.FC<FemaleConnectorShapeProps> = ({
  color = "#000000",
  size = 24,
  cx = 0,
  cy = 0,
}) => {
  const scale = size / 24;

  return (
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
      <path 
        d="M -12 -20 L -12 15 L 12 15 L 12 -20 L 8 -20 L 8 -15 L -8 -15 L -8 -20 Z" 
        fill="#e5e7eb" 
        stroke="black" 
        strokeWidth="2" 
        strokeLinejoin="round"
      />
      <rect 
        x="-6" 
        y="15" 
        width="12" 
        height="15" 
        fill="#e5e7eb" 
        stroke="black" 
        strokeWidth="2" 
        strokeLinejoin="round"
      />
    </g>
  );
};

export default FemaleConnectorShape;
