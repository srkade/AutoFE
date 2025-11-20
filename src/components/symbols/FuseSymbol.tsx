import React from "react";

export type FuseSymbolProps = {
    color?: string;
    size?: number; // Base size for scaling (e.g., width of the rectangle)
    cx?: number;   // X position in parent SVG
    cy?: number;   // Y position in parent SVG
    terminalLength1?: number; // How far the connection lines extend
    terminalLength2?: number; // How far the connection lines extend
    horizontalLength?: number; // Length of horizontal line at bottom
    dotRadius?: number;  
    stroke?:string;     // Radius of the dot at intersection
};

const FuseSymbol: React.FC<FuseSymbolProps> = ({
    color = "black",
    size = 20,
    cx = 0,
    cy = 0,
    terminalLength1 = 20,
    terminalLength2 = 10,
    horizontalLength = 20,
    dotRadius = 2,
}) => {
    const referenceSize = 20;
    const scale = size / referenceSize;
    const halfRefSize = referenceSize / 2;

    // Coordinates for the bottom terminal intersection point
    const bottomX = 0;
    const bottomY = halfRefSize + terminalLength2 / scale;

    return (
        <g transform={`translate(${cx}, ${cy}) scale(${scale})`} stroke={color} strokeWidth={2 / scale} fill={color}>
            {/* Rectangular body */}
            <rect
                x={-halfRefSize}
                y={-halfRefSize-7}
                width={referenceSize}
                height={referenceSize+8}
                fill="lightblue"
            />

            {/* Top vertical terminal line */}
            <line
                x1={0}
                y1={-(halfRefSize + terminalLength1 / scale)}
                x2={0}
                y2={-halfRefSize+1}
            />

            {/* Bottom vertical terminal line */}
            <line
                x1={0}
                y1={halfRefSize-6}
                x2={0}
                y2={halfRefSize + terminalLength2 / scale}
            />

            {/* Bottom horizontal line */}
            <line
                x1={-horizontalLength / 2 / scale}
                y1={bottomY}
                x2={horizontalLength / 2 / scale}
                y2={bottomY}
            />

            {/* Dot at intersection */}
            <circle
                cx={0}
                cy={bottomY}
                r={dotRadius / scale}
                fill={color}
            />
        </g>
    );
};

export default FuseSymbol;
