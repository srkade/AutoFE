import React from "react";

interface BatteryProps {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    color?: string;
    strokeWidth?: number;
    innerPlateLength?: number;
    outerPlateLengthRatio?: number;
    leadLength?: number;
    outerGapRatio?: number;
    centralLineRatio?: number;
}

const Battery: React.FC<BatteryProps> = ({
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    color = "#000000",
    strokeWidth = 2,
    innerPlateLength = 15,
    outerPlateLengthRatio = 1.3,
    leadLength = 15,
    outerGapRatio = 0.5,
    centralLineRatio = 2.0,
}) => {
    const centerX = width / 2;
    const scalableHeight = height - (leadLength * 2);
    const centralGap = scalableHeight * 0.35;  
    const outerGap = scalableHeight * 0.15;    
    const centerY = height / 2;
    const innerLength = innerPlateLength;
    const outerLength = innerPlateLength * outerPlateLengthRatio;

    const xStartInner = centerX - innerLength / 2;
    const xEndInner = centerX + innerLength / 2;
    const xStartOuter = centerX - outerLength / 2;
    const xEndOuter = centerX + outerLength / 2;

    const p2Y = centerY - centralGap / 2;
    const p3Y = centerY + centralGap / 2;
    const p1Y = p2Y - outerGap;
    const p4Y = p3Y + outerGap;

    const lead1StartY = p1Y - leadLength;
    const lead2EndY = p4Y + leadLength;

    return (
        <svg
            x={x}
            y={y}
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            aria-label="Battery Symbol"
        >
            {/* Outer plate (positive) */}
            <line x1={xStartOuter} y1={p1Y} x2={xEndOuter} y2={p1Y} stroke={color} strokeWidth={strokeWidth} />

            {/* Inner plates */}
            <line x1={xStartInner} y1={p2Y} x2={xEndInner} y2={p2Y} stroke={color} strokeWidth={strokeWidth} />
            <line x1={xStartInner} y1={p3Y} x2={xEndInner} y2={p3Y} stroke={color} strokeWidth={strokeWidth} />

            {/* Outer plate (negative) */}
            <line x1={xStartOuter} y1={p4Y} x2={xEndOuter} y2={p4Y} stroke={color} strokeWidth={strokeWidth} />

            {/* Middle line */}
            <line x1={centerX} y1={p2Y} x2={centerX} y2={p3Y} stroke={color} strokeWidth={strokeWidth} />

            {/* Connection leads */}
            <line x1={centerX} y1={lead1StartY} x2={centerX} y2={p1Y} stroke={color} strokeWidth={strokeWidth} />
            <line x1={centerX} y1={p4Y} x2={centerX} y2={lead2EndY} stroke={color} strokeWidth={strokeWidth} />
        </svg>
    );
};

export default Battery;
