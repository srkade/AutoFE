import React from "react";

export type MotorSymbolProps = {
    color?: string;
    fill?: string;
    size?: number;
    cx?: number;
    cy?: number;
};

const MotorSymbol: React.FC<MotorSymbolProps> = ({
    color = "black",
    fill = "white",
    size = 40,
    cx = 0,
    cy = 0,
}) => {
    const referenceSize = 40;
    const scale = size / referenceSize;
    const radius = referenceSize / 2;

    return (
        <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
            <circle
                cx={0}
                cy={0}
                r={radius}
                fill={fill}
                stroke={color}
                strokeWidth={2 / scale}
            />
            <text
                x={0}
                y={0} // vertical center
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={radius}
                fontWeight="bold"
                fill={color}
                fontFamily="Arial, sans-serif"
            >
                M
            </text>
        </g>
    );
};

export default MotorSymbol;
