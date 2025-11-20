// src/components/Schematic/utils/SchematicView.ts
import { MutableRefObject } from "react";

export const resetView = (
    svgWrapperRef: MutableRefObject<HTMLDivElement | null>,
    fitViewBox: { x: number; y: number; w: number; h: number },
    setViewBox: (box: { x: number; y: number; w: number; h: number }) => void
) => {
    if (!svgWrapperRef.current) return;

    const svgWidth = svgWrapperRef.current.clientWidth;
    const svgHeight = svgWrapperRef.current.clientHeight;

    const { w: schematicW, h: schematicH, x: fitX, y: fitY } = fitViewBox;

    const margin = 0.05;
    const scaleX = svgWidth / schematicW;
    const scaleY = svgHeight / schematicH;
    let scaleFactor = Math.min(scaleX, scaleY) * (1 - margin);

    let newW: number, newH: number, centerX: number, centerY: number;

    if (schematicW < svgWidth && schematicH < svgHeight) {
        scaleFactor = Math.min(scaleFactor, 1);
        newW = schematicW * scaleFactor + 500;
        newH = schematicH * scaleFactor + 500;
        centerX = fitX - (newW - schematicW) / 2;
        centerY = fitY - (newH - schematicH) / 2;
    } else {
        const expandFactor = 1.3;
        newW = schematicW * expandFactor;
        newH = schematicH * scaleFactor * 2;
        centerX = fitX;
        centerY = fitY + 100;
    }

    setViewBox({ x: centerX, y: centerY, w: newW, h: newH });
};

export const handleWheel = (
    e: React.WheelEvent<SVGSVGElement>,
    viewBox: { x: number; y: number; w: number; h: number },
    setViewBox: React.Dispatch<React.SetStateAction<{ x: number; y: number; w: number; h: number }>>

) => {
    e.preventDefault();
    const scaleFactor = 1.1;
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;
    let { x, y, w, h } = viewBox;

    // Calculate zoom direction
    const zoomIn = e.deltaY < 0;
    // Mouse coordinates in SVG space
    const svg = e.currentTarget;
    const bounds = svg.getBoundingClientRect();
    const svgX = (mouseX / svg.width.baseVal.value) * w + x;
    const svgY = (mouseY / svg.height.baseVal.value) * h + y;

    let newW = zoomIn ? w / scaleFactor : w * scaleFactor;
    let newH = zoomIn ? h / scaleFactor : h * scaleFactor;

    // Keep mouse position centered after zoom
    const newX = svgX - (mouseX / svg.width.baseVal.value) * newW;
    const newY = svgY - (mouseY / svg.height.baseVal.value) * newH;

    setViewBox({
        x: newX,
        y: newY,
        w: newW,
        h: newH,
    });
};

export const zoom = (
    inOrOut: "in" | "out",
    viewBox: { x: number; y: number; w: number; h: number },
    setViewBox: React.Dispatch<React.SetStateAction<{ x: number; y: number; w: number; h: number }>>


) => {
    const scaleFactor = 1.1;
    const { x, y, w, h } = viewBox;
    let newW = w,
        newH = h;
    if (inOrOut === "in") {
        newW = w / scaleFactor;
        newH = h / scaleFactor;
    } else {
        newW = w * scaleFactor;
        newH = h * scaleFactor;
    }
    setViewBox({ x, y, w: newW, h: newH });
};

export  const enterFullscreen = (
        svgWrapperRef: MutableRefObject<HTMLDivElement | null>,
) => {
        if (svgWrapperRef.current) {
            svgWrapperRef.current.requestFullscreen();
        }
    };

export  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };
