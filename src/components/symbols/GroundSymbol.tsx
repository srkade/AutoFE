import React from "react";

const ChassisGroundSymbol: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={60}
    height={60}
    stroke="black"
    strokeWidth={10}
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
    {...props}
  >
    {/* Vertical line */}
    <line x1="50" y1="10" x2="50" y2="45" />

    {/* Horizontal line (the bar connecting to legs) */}
    <line x1="30" y1="45" x2="70" y2="45" />

    {/* Three downward slanted legs */}
    <line x1="30" y1="45" x2="20" y2="70" />
    <line x1="50" y1="45" x2="40" y2="70" />
    <line x1="70" y1="45" x2="60" y2="70" />
  </svg>
);

export default ChassisGroundSymbol;
