import React from "react";

const ResistorSymbol: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 200"
        width={60}
        height={120}
        stroke="black"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        {...props}
    >
        {/* Top terminal */}
        <line x1="50" y1="10" x2="50" y2="30" />

        {/* Resistor body (rectangle) */}
        <rect x="30" y="30" width="40" height="120" rx="4" ry="4" />

        {/* Bottom terminal */}
        <line x1="50" y1="150" x2="50" y2="170" />
    </svg>
);

export default ResistorSymbol;
