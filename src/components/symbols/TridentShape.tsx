import React from "react";

export type TridentShapeProps = {
  color?: string;
  size?: number;
  cx?: number; // X position in parent SVG
  cy?: number; // Y position in parent SVG
};

const TridentShape: React.FC<TridentShapeProps> = ({
  color = "#000000",
  size = 24,
  cx = 0,
  cy = 0,
}) => {
  const scale = size / 24;
  const stemHeightFrom = 20; // length above and below cx, cy
  const prongWidthFrom = 4;
  const prongSpacingFrom = 10;


  const stemHeightTo = 20; // length above and below cx, cy
  const prongWidthTo = 4;
  const prongSpacingTo = 10;
  return (
    <>
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
      {/* Middle prong */}
      <rect x={-prongWidthFrom / 2} y={-10} width={prongWidthFrom} height={stemHeightFrom+30} fill={"black"} />
      {/* Left prong */}
      <rect x={-prongSpacingFrom - prongWidthFrom  / 2} y={0} width={prongWidthFrom} height={stemHeightFrom / 2} fill={"black"} />
      {/* Right prong */}
      <rect x={prongSpacingFrom - prongWidthFrom / 2} y={0} width={prongWidthFrom} height={stemHeightFrom / 2} fill={"black"} />
      {/* Horizontal crossbar */}
      <rect x={-prongSpacingFrom} y={stemHeightFrom / 2} width={prongSpacingFrom * 2} height={prongWidthFrom} fill={"black"} />
    </g>

</>


  );
};

export default TridentShape;

