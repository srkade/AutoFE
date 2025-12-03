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
    e: WheelEvent | React.WheelEvent<SVGSVGElement>,
    svg: SVGSVGElement,
    viewBox: { x: number; y: number; w: number; h: number },
    setViewBox: React.Dispatch<React.SetStateAction<{ x: number; y: number; w: number; h: number }>>
) => {
    const scaleFactor = 1.1;
    
    // Get the position of the mouse relative to the SVG
    const rect = svg.getBoundingClientRect();
    const mouseX = (e as any).clientX - rect.left;
    const mouseY = (e as any).clientY - rect.top;
    
    let { x, y, w, h } = viewBox;
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(w) || !Number.isFinite(h)) {
        return; // Skip if viewBox has NaN/Infinity
    }

    // Calculate zoom direction
    const zoomIn = (e as any).deltaY < 0;
    const svgWidth = svg.width.baseVal.value;
    const svgHeight = svg.height.baseVal.value;
    
    if (!Number.isFinite(svgWidth) || !Number.isFinite(svgHeight)) {
        return; // Skip if SVG dimensions are invalid
    }
    
    const svgX = (mouseX / svgWidth) * w + x;
    const svgY = (mouseY / svgHeight) * h + y;

    let newW = zoomIn ? w / scaleFactor : w * scaleFactor;
    let newH = zoomIn ? h / scaleFactor : h * scaleFactor;

    // Keep mouse position centered after zoom
    const newX = svgX - (mouseX / svgWidth) * newW;
    const newY = svgY - (mouseY / svgHeight) * newH;

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
