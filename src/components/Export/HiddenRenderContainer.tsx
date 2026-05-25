import React, { useRef, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Schematic from '../Schematic/Schematic';
import { SchematicData } from '../Schematic/SchematicTypes';

interface HiddenRenderContainerProps {
  schematicData: SchematicData | null;
  activeTab: string;
  dtcCode?: string;
  onRenderComplete: (svgElement: SVGSVGElement | null) => void;
  renderKey: string;
}

export default function HiddenRenderContainer({
  schematicData,
  activeTab,
  dtcCode,
  onRenderComplete,
  renderKey
}: HiddenRenderContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<any>(null);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (!schematicData || !containerRef.current) return;

    // Clean up previous root if exists
    if (rootRef.current) {
      rootRef.current.unmount();
      rootRef.current = null;
    }

    // Create a new React root for this container
    const root = createRoot(containerRef.current);
    rootRef.current = root;

    // Render the Schematic component
    root.render(
      <div style={{ width: '2000px', height: '1500px', background: 'white' }}>
        <Schematic
          key={renderKey}
          data={schematicData}
          activeTab={activeTab}
          dtcCode={dtcCode}
          scale={1}
        />
      </div>
    );

    // Wait for the schematic to fully render
    let attempts = 0;
    const maxAttempts = 30; // 3 seconds max wait

    const checkRenderComplete = () => {
      const svg = containerRef.current?.querySelector('svg');
      if (svg) {
        // Check if SVG has content
        const hasContent = svg.children.length > 0;
        
        if (hasContent) {
          // Wait a bit more to ensure all calculations are done
          setTimeout(() => {
            setIsRendered(true);
            onRenderComplete(svg as SVGSVGElement);
          }, 500);
        } else {
          if (attempts < maxAttempts) {
            attempts++;
            setTimeout(checkRenderComplete, 100);
          } else {
            // Timeout - return what we have
            setIsRendered(true);
            onRenderComplete(svg as SVGSVGElement);
          }
        }
      } else {
        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkRenderComplete, 100);
        } else {
          // Timeout - return null
          setIsRendered(true);
          onRenderComplete(null);
        }
      }
    };

    // Start checking after a short delay to allow React to render
    setTimeout(checkRenderComplete, 200);

    // Cleanup on unmount
    return () => {
      if (rootRef.current) {
        rootRef.current.unmount();
        rootRef.current = null;
      }
    };
  }, [schematicData, renderKey, activeTab, dtcCode, onRenderComplete]);

  if (!schematicData) return null;

  return (
    <div
      ref={containerRef}
      id={`hidden-render-${renderKey}`}
      style={{
        position: 'fixed',
        left: '-9999px',
        top: '-9999px',
        width: '2000px',
        height: '1500px',
        visibility: 'hidden',
        pointerEvents: 'none',
        zIndex: -9999
      }}
    />
  );
}
