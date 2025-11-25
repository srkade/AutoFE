// ...existing code...
import React, {
  useState,
  useEffect,
  useRef,
  JSX,
  useLayoutEffect,
} from "react";
import TridentShape from "../symbols/TridentShape";
import FuseSymbol from "../symbols/FuseSymbol";
import Sensor from "../symbols/Sensor";
import ElectricalSwitch from "../symbols/ElectricalSwitch";
import Transistor from "../symbols/Transistor";
import Transformer from "../symbols/Transformer";
import MotorSymbol from "../symbols/MotorSymbol";
import LampSymbol from "../symbols/Lamp";
import GroundSymbol from "../symbols/GroundSymbol";
import ResistorSymbol from "../symbols/ResistorSymbol";
import Battery from "../symbols/Battery";
import {
  ComponentType,
  ConnectionType,
  ConnectorType,
  ConnectionPoint,
  SchematicData,
  WireDetailsType,
  WirePopupType,
  PopupConnectorType,
} from "./SchematicTypes";
import {
  spaceForWires,
  connectionPointKey,
  getConnectionOffset,
  getIntersection,
  getConnectionsForComponent,
  getConnectionsForConnector,
  getComponentConnectorTupleFromConnectionPoint,
  calculateCavityCountForConnector,
} from "./SchematicUtils";
import PopupComponentDetails from "../popup/PopupComponentDetails";
import PopupWireDetails from "../popup/PopupWireDetails";
import PopupConnectorDetails from "../popup/PopupConnectorDetails";
import {
  resetView,
  handleWheel,
  zoom,
  enterFullscreen,
  exitFullscreen,
} from "./SchematicViews";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize,
  Minimize,
  Download,
} from "lucide-react";
import { DTC_MAP } from "./tests/DTCs";
import { schematicExportManager } from "./SchematicExport";

// ...existing code...
const colors = {
  OG: "orange",
};

export default function Schematic({
  data,
  scale = 1,
  activeTab,
}: {
  data: SchematicData;
  scale?: number;
  activeTab?: string;
}) {
  const svgWrapperRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Dragging state
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [dragOrigin, setDragOrigin] = useState<{ x: number; y: number } | null>(
    null
  );

  //states for managing the component selection
  const [selectedComponentIds, setSelectedComponentIds] = useState<string[]>(
    []
  );
  const [popupComponent, setPopupComponent] = useState<ComponentType | null>(
    null
  );
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [selectedDTC, setSelectedDTC] = useState<any>(null);

  //states to manage the wire selection
  const [selectedWires, setSelectedWires] = useState<string[]>([]);
  const [popupWire, setPopupWire] = useState<WirePopupType | null>(null);
  const [popupWirePosition, setPopupWirePosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  //state to manange the connector selection
  const [selectedConnector, setSelectedConnector] =
    useState<ConnectorType | null>(null);
  const [popupConnector, setPopupConnector] =
    useState<PopupConnectorType | null>(null);

  const handleConnectorClick = (
    e: React.MouseEvent<SVGRectElement, MouseEvent>,
    connector: ConnectorType,
    comp: ComponentType
  ) => {
    e.stopPropagation();
    setSelectedComponentIds([]); // deselect any selected component
    setSelectedWires([]);
    setSelectedConnector(connector);
    const cavityCount = calculateCavityCountForConnector(connector, data);
    setPopupComponent(null);
    setPopupWire(null);
    setPopupConnector({
      componentCode: comp.label || comp.id,
      connectorCode: connector.label || connector.id,
      harnessName: comp.harness_name,
      partNumber: comp.connector_part_number,
      gender: connector.gender,
      color: connector.color,
      connectorType: comp.connector_type,
      cavityCount,
    });
    setPopupWire(null);
  };
  useEffect(() => {
    if (!popupConnector || !popupConnector.connectorCode) return;

    const connectorCode = popupConnector.connectorCode.toUpperCase();
    // console.log("Clicked connector:", connectorCode);

    const dtcData = Object.values(DTC_MAP).find((dtc: any) =>
      dtc.connections.some(
        (conn: any) =>
          conn.from.connectorId.toUpperCase() === connectorCode ||
          conn.to.connectorId.toUpperCase() === connectorCode
      )
    );

    if (dtcData) {
      //console.log(" Matched DTC:", dtcData.code);
      setSelectedDTC(dtcData);
    } else {
      //console.warn(" No DTC details found for this connector:", connectorCode);
      setSelectedDTC(null);
    }
  }, [popupConnector]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // If click is outside both the SVG and popup
      if (
        !svgWrapperRef.current?.contains(e.target as Node) &&
        !popupRef.current?.contains(e.target as Node)
      ) {
        setSelectedComponentIds([]);
        setPopupComponent(null);
        setSelectedConnector(null);
        setPopupConnector(null);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!svgWrapperRef.current?.contains(e.target as Node)) {
        setSelectedComponentIds([]);
        setPopupComponent(null);
        setSelectedConnector(null);
        setPopupConnector(null);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleClosePopup = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent outside-click effect
    setPopupConnector(null); // close popup
    setSelectedConnector(null); // clear highlight
  };

  // Mouse event handlers for pan/drag
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragOrigin({ x: viewBox.x, y: viewBox.y });
  };

  const handleMouseUp = () => {
    setDragging(false);
    setDragStart(null);
    setDragOrigin(null);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragging || !dragStart || !dragOrigin) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setViewBox({
      x: dragOrigin.x - dx * (viewBox.w / 300),
      y: dragOrigin.y - dy * (viewBox.h / 100),
      w: viewBox.w,
      h: viewBox.h,
    });
  };
  const popupRef = useRef<HTMLDivElement | null>(null);

  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 800, h: 600 });
  const [fitViewBox, setFitViewBox] = useState(viewBox);
  // Track if popup was manually closed
  const [popupClosedManually, setPopupClosedManually] = useState(false);

  //change deafault view box on data change
  useEffect(() => {
    if (fitViewBox) {
      resetView(svgWrapperRef, fitViewBox, setViewBox);
    }
  }, [fitViewBox]);

  const [componentNameWidths, setComponentNameWidths] = useState<{
    [id: string]: number;
  }>({});
  const [connectorNameWidths, setConnectorNameWidths] = useState<{
    [id: string]: number;
  }>({});

  const componentNameRefs = useRef<{ [id: string]: SVGTextElement | null }>({});
  const connectorNameRefs = useRef<{ [id: string]: SVGTextElement | null }>({});
  const clickTimeout = useRef<number | null>(null);

  const [connectorConnectionCount, setConnectorConnectionCount] = useState<{
    [id: string]: number;
  }>({});

  var connectionPoints: { [id: string]: { x: number; y: number } } = {};

  const componentSize = { width: 100, height: 60 };
  const connectorHeight = 20;
  //pin padding changeed
  const padding = 20;
  const connectorNamePadding = 25;
  const connectorSpacing = 30; //change to add spacing between greenbox

  var maxX = 0;
  var maxY =
    padding +
    componentSize.height +
    spaceForWires(data) +
    componentSize.height +
    padding;

  useLayoutEffect(() => {
    let newWidths: { [id: string]: number } = {};
    let connWidths: { [id: string]: number } = {};
    let tempMaxX = 0;

    data.components.forEach((comp) => {
      const ref = componentNameRefs.current[comp.id];
      if (ref) {
        newWidths[comp.id] = ref.getBBox().width;
      } else {
        newWidths[comp.id] = 100; // fallback width
      }
      tempMaxX += newWidths[comp.id];

      comp.connectors.forEach((conn) => {
        const ref = connectorNameRefs.current[conn.id];
        if (ref) {
          connWidths[conn.id] = ref.getBBox().width;
        } else {
          connWidths[conn.id] = 50; // fallback width
        }
      });
    });
    setComponentNameWidths(newWidths);
    setConnectorNameWidths(connWidths);
    // Connections count
    const connCount: { [id: string]: number } = {};
    data.connections.forEach((conn) => {
      connCount[conn.from.connectorId] =
        (connCount[conn.from.connectorId] || 0) + 1;
      connCount[conn.to.connectorId] =
        (connCount[conn.to.connectorId] || 0) + 1;
    });
    setConnectorConnectionCount(connCount);
    // Set viewBox and fitViewBox AFTER layout measured
    const newBox = {
      x: 0,
      y: 0,
      w: tempMaxX,
      h: maxY,
    };
    setFitViewBox(newBox);
  }, [data]);

  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      // Check if click happened outside the SVG wrapper
      const svgWrapper = svgWrapperRef.current;
      if (svgWrapper && !svgWrapper.contains(event.target as Node)) {
        setSelectedComponentIds([]);
        setSelectedWires([]);
        setSelectedConnector(null);
        setPopupComponent(null);
        setPopupConnector(null);
        setPopupWire(null);
        setPopupClosedManually(false);
      }
    };

    document.addEventListener("click", handleGlobalClick);
    // Cleanup on unmount
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  function checkAndReturnIntersection(
    i: number,
    x1: number,
    x2: number,
    y1: number,
    y2: number
  ): JSX.Element | undefined {
    let intersection = null;
    for (let j = 0; j < data.connections.length; j++) {
      if (i === j) continue;
      const w2 = data.connections[j];
      const f2 = w2.from;
      const f2Tuple = getComponentConnectorTupleFromConnectionPoint(f2, data);
      const f2Component = f2Tuple[0];
      const f2Connector = f2Tuple[1];
      const t2 = w2.to;
      const t2Tuple = getComponentConnectorTupleFromConnectionPoint(t2, data);
      const t2Component = t2Tuple[0];
      const t2Connector = t2Tuple[1];

      if (!f2Component || !f2Connector || !t2Component || !t2Connector)
        continue;
      const x3 =
        getXForConnector(f2Connector, f2Component) +
        getWidthForConnector(f2Connector, f2Component) / 2;
      const y3 = getYForConnector(f2Connector, f2Component) + 20 / 2;
      const x4 =
        getXForConnector(t2Connector, t2Component) +
        getWidthForConnector(t2Connector, t2Component) / 2;
      const y4 = getYForConnector(t2Connector, t2Component) + 20 / 2;
      // Check intersection
      const inter = getIntersection(x1, y1, x2, y2, x3, y3, x4, y4);
      if (inter && i > j) {
        intersection = inter;
        break;
      }
    }
    if (intersection) {
      const diameter = 10;
      const radius = diameter / 2;
      // Direction of the wire
      const dx_hump = x2 - x1;
      const dy_hump = y2 - y1;
      const length_hump = Math.sqrt(dx_hump * dx_hump + dy_hump * dy_hump);
      // Unit vector along the wire
      const ux = dx_hump / length_hump;
      const uy = dy_hump / length_hump;
      // Points before and after intersection
      const beforeX = intersection.x - ux * radius;
      const beforeY = intersection.y - uy * radius;
      const afterX = intersection.x + ux * radius;
      const afterY = intersection.y + uy * radius;
      // Perpendicular unit vector
      const perpUx = -uy;
      const perpUy = ux;
      // Arc control point for semicircle (perpendicular to wire)
      const arcCtrlX = intersection.x + perpUx * radius;
      const arcCtrlY = intersection.y + perpUy * radius;

      return (
        <g>
          <path
            d={`M ${x1} ${y1} L ${beforeX} ${beforeY} Q ${arcCtrlX} ${arcCtrlY} ${afterX} ${afterY} L ${x2} ${y2}`}
            stroke={"red"}
            strokeWidth="2"
            fill="none"
          />
        </g>
      );
    }
  }
  function getWidthForComponent(component: ComponentType): number {
    const defaultWidth = componentNameWidths[component.id] + padding;

    // --- Calculate total extra width for all fuses on this component ---
    let totalFuseWidth = 0;

    const componentConnections = getConnectionsForComponent(component, data);

    componentConnections.forEach((wire) => {
      if (wire.wireDetails?.fuse) {
        const fuse = wire.wireDetails.fuse;
        const codeWidth = (fuse.code?.length || 1) * 8;
        const fuseSymbolWidth = 16;
        const spacing = 8;

        totalFuseWidth += codeWidth + fuseSymbolWidth + spacing;
      }
    });

    let width = defaultWidth + totalFuseWidth;

    // --- Handle rectangle with multiple connectors ---
    if (component.shape === "rectangle") {
      const connectionCount = componentConnections.length;
      if (connectionCount > 1) {
        let connectorWidth = connectorSpacing;
        component.connectors.forEach((conn) => {
          connectorWidth += getWidthForConnector(conn, component) + connectorSpacing;
        });
        width = Math.max(width, connectorWidth, width); // take the largest of fuse width, connectors, default
      }
    }

    return width;
  }

  function getXForComponent(component: ComponentType): number {
    let index = data.components.findIndex((c) => c.id === component.id);
    if (index < 1) {
      return padding;
    } else {
      let x = padding;
      for (let i = 1; i < index; i++) {
        let component = data.components[i];
        x += getWidthForComponent(component) + padding;
      }
      return x;
    }
  }

  function getYForComponent(component: ComponentType): number {
    let isMasterComponent = data.masterComponents.includes(component.id);
    const y = isMasterComponent
      ? padding
      : padding +
      componentSize.height +
      spaceForWires(data) +
      componentSize.height +
      padding;
    return y;
  }

  function getXForComponentTitle(component: ComponentType): number {
    return (
      getXForComponent(component) +
      componentNameWidths[component.id] / 2 +
      padding / 2
    );
  }

  function getXForConnector(
    connector: ConnectorType,
    component: ComponentType
  ): number {
    let x = getXForComponent(component);
    if (component.shape === "rectangle") {
      let connectorCount = component.connectors.length;
      let index = component.connectors.findIndex((c) => c.id === connector.id);
      var connWidth = 0;
      if (connectorCount > 1) {
        connWidth += connectorSpacing;
        for (var i = 0; i < index; i++) {
          let conn = component.connectors[i];
          connWidth += getWidthForConnector(conn, component);
          connWidth += connectorSpacing;
        }
        return x + connWidth;
      }
    }
    return (
      x +
      getWidthForComponent(component) / 2 -
      getWidthForConnector(component.connectors[0], component) / 2
    );
  }

  function getYForConnector(
    connector: ConnectorType,
    component: ComponentType
  ): number {
    let isMasterComponent = data.masterComponents.includes(component.id);
    return isMasterComponent
      ? getYForComponent(component) + componentSize.height
      : getYForComponent(component) - 20;
  }
  function getWidthForConnector(conn: ConnectorType, comp: ComponentType): number {
    let connections = getConnectionsForConnector(conn, data);
    let originalWidth: number;

    if (comp.shape === "rectangle") {
      let interConnectionSpacing = 60;
      let connectionsBasedWidth =
        (connections.length + 1) * interConnectionSpacing;
      originalWidth = Math.max(
        connectionsBasedWidth,
        connectorNameWidths[conn.id] + connectorNamePadding,
        100
      );
    } else {
      originalWidth = connectorNameWidths[conn.id] + connectorNamePadding;
    }

    // Add fuse extra width safely
    // if (conn.fuse) {
    //   return originalWidth + 40; // try 40 instead of 400
    // }

    return originalWidth;
  }

  function getXForWireToSplice(
    component: ComponentType,
    wireIndex: number,
    totalWires: number
  ) {
    // always attach in center horizontally
    const centerX =
      getXForComponent(component) + getWidthForComponent(component) / 2;
    // optionally spread vertically slightly
    const spacing = 10; // space between multiple wires
    const offsetY = (wireIndex - (totalWires - 1) / 2) * spacing;
    return { x: centerX, offsetY };
  }
  const buttonStyle = {
    padding: "3px 7px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    background: "white",
    cursor: "pointer",
  };

  // export function start

  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      setExportError(null);

      const svgElement = svgWrapperRef.current?.querySelector(
        "svg"
      ) as SVGSVGElement;
      if (!svgElement) {
        throw new Error("SVG element not found");
      }

      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `schematic-export-${timestamp}.pdf`;

      await schematicExportManager.generatePDF(
        svgElement,
        data,
        connectorConnectionCount,
        {
          filename,
          resolution: 300,
          zoom: 1.5,
        }
      );

      console.log("PDF export completed successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setExportError(errorMessage);
      console.error("PDF export failed:", errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportImage = async () => {
    try {
      setIsExporting(true);
      setExportError(null);

      const svgElement = svgWrapperRef.current?.querySelector(
        "svg"
      ) as SVGSVGElement;
      if (!svgElement) {
        throw new Error("SVG element not found");
      }

      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `schematic-export-${timestamp}.png`;

      await schematicExportManager.exportAsImage(svgElement, {
        filename,
        resolution: 300,
      },
        data
      );

      console.log("Image export completed successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setExportError(errorMessage);
      console.error("Image export failed:", errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  // export function end
  return (
    <div
      ref={svgWrapperRef}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: isFullscreen ? "100vh" : "100%",
        background: "#fafafa",
        overflow: "hidden",
        minHeight: isFullscreen ? undefined : "100%", // ensure min height stays fixed
        maxHeight: isFullscreen ? undefined : "100%", // prevent growing heights
      }}
    >
      <div
        style={{
          flex: 1, // Dynamically takes all available vertical space
          overflow: "hidden",
          display: "flex",
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <div
            style={{
              position: "absolute",
              top: 4,
              left: 4,
              padding: 8,
              zIndex: 10,
              //background: "white",
              display: "flex",
              gap: 8,
              borderRadius: 8,
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => resetView(svgWrapperRef, fitViewBox, setViewBox)}
              style={buttonStyle}
            >
              <RotateCcw size={18} />
            </button>
            <button
              onClick={() => zoom("in", viewBox, setViewBox)}
              style={buttonStyle}
            >
              <ZoomIn size={18} />
            </button>
            <button
              onClick={() => zoom("out", viewBox, setViewBox)}
              style={buttonStyle}
            >
              <ZoomOut size={18} />
            </button>
            <button
              onClick={() =>
                isFullscreen ? exitFullscreen() : enterFullscreen(svgWrapperRef)
              }
              style={buttonStyle}
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>

            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                padding: "0 12px",
                borderLeft: "1px solid #ccc",
              }}
            >


              {/* Dropdown Menu for Additional Export Options */}
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                }}
              >
                <button
                  onClick={() => {
                    const menu = document.getElementById("export-menu");
                    if (menu) {
                      menu.style.display =
                        menu.style.display === "none" ? "block" : "none";
                    }
                  }}
                  title="More export options"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    backgroundColor: "#fff",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f0f0f0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#fff";
                  }}
                >
                  ▼
                </button>

                <div
                  id="export-menu"
                  style={{
                    position: "absolute",
                    top: "45px",
                    right: 0,
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    zIndex: 1000,
                    display: "none",
                    minWidth: "180px",
                  }}
                >
                  <button
                    onClick={() => {
                      handleExportPDF();
                      const menu = document.getElementById("export-menu");
                      if (menu) menu.style.display = "none";
                    }}
                    disabled={isExporting}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      textAlign: "left",
                      border: "none",
                      backgroundColor: "transparent",
                      cursor: isExporting ? "not-allowed" : "pointer",
                      fontSize: "14px",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isExporting)
                        e.currentTarget.style.backgroundColor = "#f0f0f0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    📄 Export as PDF
                  </button>
                  <hr
                    style={{
                      margin: "4px 0",
                      border: "none",
                      borderTop: "1px solid #eee",
                    }}
                  />
                  <button
                    onClick={() => {
                      handleExportImage();
                      const menu = document.getElementById("export-menu");
                      if (menu) menu.style.display = "none";
                    }}
                    disabled={isExporting}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      textAlign: "left",
                      border: "none",
                      backgroundColor: "transparent",
                      cursor: isExporting ? "not-allowed" : "pointer",
                      fontSize: "14px",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isExporting)
                        e.currentTarget.style.backgroundColor = "#f0f0f0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    🖼️ Export as PNG
                  </button>
                  <hr
                    style={{
                      margin: "4px 0",
                      border: "none",
                      borderTop: "1px solid #eee",
                    }}
                  />
                </div>
              </div>

              {/* Error Message Display */}
              {exportError && (
                <div
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#f8d7da",
                    color: "#721c24",
                    borderRadius: "4px",
                    fontSize: "12px",
                    maxWidth: "300px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={exportError}
                >
                  ⚠️ {exportError}
                </div>
              )}

              {/* Loading Indicator */}
              {isExporting && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0 12px",
                    color: "#666",
                    fontSize: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      border: "2px solid #f3f3f3",
                      borderTop: "2px solid #007bff",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  Exporting...
                </div>
              )}
            </div>
          </div>
          <div id="export" style={{ width: "100%", height: "100%" }}>

            <svg
              onClick={(e) => {
                // Only deselect if click is on the SVG itself, not on components
                if ((e.target as SVGElement).tagName === "svg") {
                  setSelectedComponentIds([]);
                  setSelectedWires([]);
                  setSelectedConnector(null);
                  setPopupComponent(null);
                  setPopupConnector(null);
                  setPopupWire(null);
                  setPopupClosedManually(false);
                }
              }}
              onWheel={(e) => handleWheel(e, viewBox, setViewBox)}
              style={{
                border: "1px solid #ccc",
                width: "100%",
                height: "100%",
                cursor: dragging ? "grabbing" : "grab",
                display: "block",
                backgroundColor: "#e5e5e5",
                userSelect: dragging ? "none" : "auto", // Disable text selection while dragging
                WebkitUserSelect: dragging ? "none" : "auto", // For Safari
                MozUserSelect: dragging ? "none" : "auto", // For Firefox
                msUserSelect: dragging ? ("none" as any) : ("auto" as any),
                position: "relative",
                overflow: "auto",
              }}
              viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onTouchStart={(e) => {
                e.preventDefault();
                const t = e.touches[0];
                handleMouseDown({
                  clientX: t.clientX,
                  clientY: t.clientY,
                } as unknown as React.MouseEvent<SVGSVGElement>);
              }}
              onTouchMove={(e) => {
                e.preventDefault();
                const t = e.touches[0];
                handleMouseMove({
                  clientX: t.clientX,
                  clientY: t.clientY,
                } as unknown as React.MouseEvent<SVGSVGElement>);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleMouseUp();
              }}
            >
              {data.components.map((comp, componentIndex) => (
                <g key={comp.id}>
                  {(comp.componentType?.toLowerCase() === "splice" ||
                    comp.label?.toLowerCase() === "splice")
                    ? (
                      <g>
                        <circle
                          cx={
                            getXForComponent(comp) + getWidthForComponent(comp) / 2
                          }
                          cy={getYForComponent(comp) - connectorHeight / 2 - 2}
                          r={componentSize.height / 8} // adjust radius as needed
                          fill="white"
                          stroke="black"
                          strokeWidth={1}
                        />
                        <circle
                          cx={
                            getXForComponent(comp) + getWidthForComponent(comp) / 2
                          }
                          cy={getYForComponent(comp) - connectorHeight / 2 - 2}
                          r={componentSize.height / 10}
                          fill="black"
                        />
                      </g>
                    ) : (
                      comp.shape === "rectangle" && (
                        <g
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedWires([]);
                            setSelectedConnector(null);

                            // Select this component
                            setSelectedComponentIds([comp.id]);
                            setPopupWire(null);
                            setPopupConnector(null);

                            // Show popup only if it wasn't manually closed
                            if (!popupClosedManually) {
                              setPopupComponent(comp);
                              setPopupPosition({
                                x:
                                  getXForComponent(comp) +
                                  getWidthForComponent(comp) +
                                  900,
                                y:
                                  getYForComponent(comp) +
                                  componentSize.height +
                                  100,
                              });
                            }
                          }}
                        >
                          <rect
                            x={getXForComponent(comp)}
                            y={getYForComponent(comp)}
                            width={getWidthForComponent(comp)}
                            height={componentSize.height}
                            fill="lightblue"
                            stroke="black"
                            strokeDasharray={
                              componentIndex !== 0 ? "6,4" : undefined
                            }
                            onClick={() => {
                              console.log("Rectangle clicked!", comp.id);
                            }}
                            style={{ cursor: "pointer" }}
                          />
                          {selectedComponentIds.includes(comp.id) && (
                            <rect
                              x={getXForComponent(comp)}
                              y={
                                getYForComponent(comp) <
                                  fitViewBox.y + fitViewBox.h / 2
                                  ? getYForComponent(comp) - 60
                                  : getYForComponent(comp) + 60
                              }
                              width={getWidthForComponent(comp)}
                              height={componentSize.height}
                              fill="#3390FF"
                              opacity={0.3}
                              pointerEvents="none" // so the click still passes through to the base rect
                            />
                          )}

                          {comp.category?.toLowerCase() === "sensor" && (
                            <Sensor
                              x={getXForComponent(comp) + 20} // left of rectangle
                              y={getYForComponent(comp) + 15} // top of rectangle
                              width={getWidthForComponent(comp) / 20} // match rectangle width
                              height={componentSize.height / 2} // match rectangle height
                              stroke="black"
                              strokeWidth={1}
                            />
                          )}

                          {comp.category?.toLowerCase() === "switch" && (
                            <ElectricalSwitch
                              x={getXForComponent(comp)}
                              y={getYForComponent(comp)}
                              sizeMultiplier={0.5}
                              stroke="black"
                              strokeWidth={1}
                            />
                          )}

                          {comp.category?.toLowerCase() === "transistor" && (
                            <Transistor
                              x={
                                getXForComponent(comp) +
                                getWidthForComponent(comp) / 12
                              } // horizontal centering
                              y={getYForComponent(comp) + componentSize.height / 2} // vertical centering
                              sizeMultiplier={0.3} // make smaller so it fits neatly inside
                              stroke="black"
                              strokeWidth={5}
                            />
                          )}
                          {comp.category?.toLowerCase() === "transformer" && (
                            <Transformer
                              x={
                                getXForComponent(comp) +
                                getWidthForComponent(comp) / 16
                              } // horizontal centering
                              y={getYForComponent(comp) + componentSize.height / 6} // vertical centering
                              sizeMultiplier={0.2} // scale it down to fit
                              stroke="black"
                              strokeWidth={1}
                              fill="black"
                            />
                          )}
                          {comp.category?.toLowerCase() === "motor" && (
                            <MotorSymbol
                              cx={
                                getXForComponent(comp) +
                                getWidthForComponent(comp) / 5
                              } // center of rectangle
                              cy={getYForComponent(comp) + componentSize.height / 2} // center of rectangle
                              size={
                                Math.min(
                                  getWidthForComponent(comp),
                                  componentSize.height
                                ) * 0.5
                              } // scale to fit rectangle
                              color="black"
                              fill="#B0E0E6"
                            />
                          )}
                          {comp.category?.toLowerCase() === "lamp" && (
                            <LampSymbol
                              cx={
                                getXForComponent(comp) +
                                getWidthForComponent(comp) / 5
                              }
                              cy={getYForComponent(comp) + componentSize.height / 2}
                              size={
                                Math.min(
                                  getWidthForComponent(comp),
                                  componentSize.height
                                ) * 0.5
                              }
                              color="black"
                            />
                          )}
                          {comp.category?.toLowerCase() === "ground" && (
                            <GroundSymbol
                              x={getXForComponent(comp)} // adjust horizontal position
                              y={getYForComponent(comp) + 15} // adjust vertical position
                              width={getWidthForComponent(comp) / 2} // adjust width scaling
                              height={componentSize.height / 2} // adjust height scaling
                              stroke="black"
                              strokeWidth={3}
                            />
                          )}
                          {comp.category?.toLowerCase() === "resistor" && (
                            <ResistorSymbol
                              x={getXForComponent(comp) - 50}
                              y={getYForComponent(comp) + 13}
                              width={getWidthForComponent(comp)}
                              height={40}
                            />
                          )}
                          {comp.category?.toLowerCase() === "battery" && (
                            <Battery
                              x={getXForComponent(comp) + 10}
                              y={getYForComponent(comp) + 10}
                              width={30}
                              height={40}
                              leadLength={5}
                              centralLineRatio={3}
                            />
                          )}
                        </g>
                      )
                    )}
                  <text
                    vectorEffect="non-scaling-stroke"
                    ref={(el) => {
                      componentNameRefs.current[comp.id] = el;
                    }}
                    x={getXForComponentTitle(comp)}
                    // y={getYForComponent(comp) + componentSize.height / 2}
                    y={
                      getYForComponent(comp) +
                      (getYForComponent(comp) + componentSize.height / 2 <
                        fitViewBox.y + fitViewBox.h / 2
                        ? -componentSize.height / 2 // above component
                        : componentSize.height +
                        (comp.componentType?.toLowerCase() === "splice" ? -30 : 30))
                    }
                    textAnchor="middle"
                    fontSize="20"
                    fill="black"
                  >
                    {comp.label + ` (${comp.id})`}
                  </text>
                  {comp.connectors.map((conn) => (
                    <g key={conn.id}>
                      {/* open conditional rendering when the component is not splice */}
                      {comp.componentType?.toLowerCase() !== "splice" && (
                        <rect
                          x={getXForConnector(conn, comp)}
                          y={getYForConnector(conn, comp)}
                          width={getWidthForConnector(conn, comp)}
                          height={connectorHeight}
                          fill={
                            selectedConnector?.id === conn.id
                              ? "#3390FF"
                              : "lightgreen"
                          } // highlight selected
                          stroke="black"
                          strokeDasharray={
                            componentIndex !== 0 ? "6,4" : undefined
                          }
                          onClick={(e) => handleConnectorClick(e, conn, comp)}
                          style={{ cursor: "pointer" }}
                        />
                      )}

                      <text
                        ref={(el) => {
                          connectorNameRefs.current[conn.id] = el;
                        }}
                        x={
                          getXForConnector(conn, comp) -
                          (comp.componentType?.toLowerCase() === "splice" ? -10 : 1) // reduce gap if splice
                        }
                        y={getYForConnector(conn, comp) + 13}
                        textAnchor="end" //change to move text at the left
                        dominantBaseline="middle" //change to take text left at middle
                        fontSize="10"
                        fill="black"
                        fontWeight="bold"
                      >
                        {conn.label}
                      </text>
                    </g>
                  ))}
                </g>
              ))}

              {data.connections.map((wire, i) => {
                const fromConn = wire.from;
                const toConn = wire.to;

                const fromData = getComponentConnectorTupleFromConnectionPoint(
                  fromConn,
                  data
                );
                const fromComponent = fromData[0];
                var from = fromData[1];

                const toData = getComponentConnectorTupleFromConnectionPoint(
                  toConn,
                  data
                );
                const toComponent = toData[0];
                var to = toData[1];
                if (fromComponent?.componentType?.toLowerCase() === "splice" && !from) {
                  const centerX =
                    getXForComponent(fromComponent) + getWidthForComponent(fromComponent) / 2;

                  const centerY =
                    getYForComponent(fromComponent) - connectorHeight / 2 - 2;

                  from = {
                    id: `splice-from-${fromComponent.id}-${i}`,
                    label: "",
                    x: centerX,
                    y: centerY
                  } as any;
                }

                if (toComponent?.componentType?.toLowerCase() === "splice" && !to) {
                  const centerX =
                    getXForComponent(toComponent) + getWidthForComponent(toComponent) / 2;

                  const centerY =
                    getYForComponent(toComponent) - connectorHeight / 2 - 2;

                  to = {
                    id: `splice-to-${toComponent.id}-${i}`,
                    label: "",
                    x: centerX,
                    y: centerY
                  } as any;
                }

                if (!from || !to) return null;

                let isFromMasterComponent = data.masterComponents.includes(
                  fromComponent!.id
                );
                let isToMasterComponent = data.masterComponents.includes(
                  toComponent!.id
                );

                let fromKey =
                  fromComponent?.componentType?.toLowerCase() === "splice"
                    ? `splice-${fromComponent.id}-${i}`
                    : connectionPointKey(wire.from);

                var fromStoredConnectionPoint = connectionPoints[fromKey];


                var fromX = fromStoredConnectionPoint?.x;
                if (fromX == undefined) {

                  // FIX FOR SPLICE: always center wire on the splice dot
                  if (fromComponent?.componentType?.toLowerCase() === "splice") {
                    fromX =
                      getXForComponent(fromComponent) +
                      getWidthForComponent(fromComponent) / 2;
                  } else {
                    const fromConnectorX = getXForConnector(from, fromComponent!);
                    const fromConnectorWidth = getWidthForConnector(from, fromComponent!);
                    const fromConnectorCount = connectorConnectionCount[from.id] || 1;

                    const connIndex = getConnectionsForConnector(from, data)
                      .findIndex((c) => c === wire);

                    const fromConnectorOffset =
                      fromConnectorCount === 1
                        ? fromConnectorWidth / 2
                        : (fromConnectorWidth / (fromConnectorCount + 1)) *
                        (connIndex + 1);

                    fromX =
                      fromComponent?.shape === "circle"
                        ? fromConnectorX + fromConnectorWidth / 2
                        : fromConnectorX + fromConnectorOffset;
                  }
                }

                var fromY = fromStoredConnectionPoint?.y;
                if (fromY == undefined) {
                  fromY = isFromMasterComponent
                    ? getYForConnector(from, fromComponent!) + 20
                    : getYForConnector(from, fromComponent!);
                }

                fromKey =
                  fromComponent?.componentType?.toLowerCase() === "splice"
                    ? `splice-${fromComponent.id}-${i}`
                    : connectionPointKey(wire.from);

                connectionPoints[fromKey] = { x: fromX, y: fromY };


                var toKey =
                  toComponent?.componentType?.toLowerCase() === "splice"
                    ? `splice-${toComponent.id}-${i}`
                    : connectionPointKey(wire.to);

                var toStoredConnectionPoint = connectionPoints[toKey];

                var toX = toStoredConnectionPoint?.x;
                if (toX == undefined) {

                  //  FIX FOR SPLICE (multiple connections): always center
                  if (toComponent?.componentType?.toLowerCase() === "splice") {
                    toX =
                      getXForComponent(toComponent) +
                      getWidthForComponent(toComponent) / 2;
                  } else {
                    const toConnectorX = getXForConnector(to, toComponent!);
                    const toConnectorWidth = getWidthForConnector(to, toComponent!);
                    const toConnectorCount = connectorConnectionCount[to.id] || 1;

                    const connIndexTo = getConnectionsForConnector(to, data)
                      .findIndex((c) => c === wire);

                    const toConnectorOffset =
                      toConnectorCount === 1
                        ? toConnectorWidth / 2
                        : (toConnectorWidth / (toConnectorCount + 1)) *
                        (connIndexTo + 1);

                    toX =
                      toComponent?.shape === "circle"
                        ? toConnectorX + toConnectorWidth / 2
                        : toConnectorX + toConnectorOffset;
                  }
                }

                var toY = toStoredConnectionPoint?.y;
                if (toY == undefined) {
                  toY = isToMasterComponent
                    ? getYForConnector(to, toComponent!) + 20
                    : getYForConnector(to, toComponent!);
                }

                toKey =
                  toComponent?.componentType?.toLowerCase() === "splice"
                    ? `splice-${toComponent.id}-${i}`
                    : connectionPointKey(wire.to);

                connectionPoints[toKey] = { x: toX, y: toY };


                let intermediateY;
                if (isFromMasterComponent && isToMasterComponent) {
                  // Force wire to go below both master components
                  intermediateY = Math.max(fromY, toY) + 40;
                } else {
                  // Default behavior
                  const offset = getConnectionOffset(
                    i,
                    data.connections.length,
                    fromY,
                    toY,
                    20
                  );
                  let min = Math.min(fromY, toY);
                  intermediateY = min + offset;
                }

                // Calculate the positions where the tridents should be
                const fromTridentY = fromY < toY ? intermediateY : fromY - 10; // lift if needed
                const toTridentY = fromY < toY ? toY : intermediateY + 10;

                let isFromTop = isFromMasterComponent;
                let isToTop = isToMasterComponent;

                let fromLabelY = isFromTop ? fromY - 5 : fromY + 15;
                let toLabelY = isToTop ? toY - 5 : toY + 15;
                const fuseX =
                  getXForConnector(from, fromComponent!) +
                  getWidthForConnector(from, fromComponent!) / 2;
                const fuseY = getYForConnector(from, fromComponent!) - 10; // small offset above connector
                const allowedCavities = [42, 46, 43, 47, 44, 48, 36, 40, 35, 39, 34, 38, 26, 30];
                const fromCavity = Number(wire.from.cavity); // get cavity of "from" connector

                let wireElement;
                wireElement = (
                  <g>
                    {fromComponent?.componentType?.toLowerCase() !== "splice" && (
                      <>
                        {isFromTop ? (
                          <>
                            {/* top component → trident points UP */}
                            <TridentShape
                              cx={fromX}
                              cy={fromY - 15}
                              color={wire.color}
                              size={10}
                            />
                            {fromComponent?.category?.toLowerCase() === "supply" &&
                              fromComponent?.label?.toLowerCase().includes("load center") &&
                              wire.wireDetails?.fuse &&
                              allowedCavities.includes(fromCavity) && (  //  only show for allowed cavities
                                <g transform={`translate(${fromX}, ${fromY - 45})`}>

                                  {/* LEFT NORMAL TEXT (not flipped) */}
                                  {wire.wireDetails.fuse.code && (
                                    <text
                                      x={-10}
                                      y={4}
                                      textAnchor="end"
                                      fontSize="10"
                                      fill="black"
                                      fontWeight="bold"
                                      alignmentBaseline="middle"
                                    >
                                      {wire.wireDetails.fuse.code}
                                    </text>
                                  )}

                                  {/* FLIPPED SYMBOL ONLY */}
                                  <g transform="scale(1, -1)">
                                    <FuseSymbol cx={0} cy={0} size={12} color="black" />
                                  </g>

                                  {/* RIGHT NORMAL TEXT (not flipped) */}
                                  {wire.wireDetails.fuse.ampere && (
                                    <text
                                      x={10}
                                      y={4}
                                      textAnchor="start"
                                      fontSize="10"
                                      fill="black"
                                      fontWeight="bold"
                                      alignmentBaseline="middle"
                                    >
                                      {wire.wireDetails.fuse.ampere}
                                    </text>
                                  )}
                                </g>
                              )}

                          </>
                        ) : (
                          <>
                            {/* bottom component → trident points DOWN */}
                            <g
                              transform={`translate(${fromX}, ${fromY + 15
                                }) scale(1, -1)`}
                            >
                              <TridentShape
                                cx={0}
                                cy={0}
                                color={wire.color}
                                size={10}
                              />
                            </g>

                            {/* Fuse Code + Symbol + Amp (Bottom Side, normal orientation) */}
                            {fromComponent?.category?.toLowerCase() === "supply" &&
                              fromComponent?.label?.toLowerCase().includes("load center") &&
                              wire.wireDetails?.fuse &&
                              allowedCavities.includes(fromCavity) && (
                                <g transform={`translate(${fromX}, ${fromY + 28})`}>

                                  {/* CODE (left) */}
                                  {wire.wireDetails.fuse.code && (
                                    <text
                                      x={-22}
                                      y={4}
                                      textAnchor="end"
                                      fontSize="10"
                                      fill="black"
                                      fontWeight="bold"
                                      alignmentBaseline="middle"
                                    >
                                      {wire.wireDetails.fuse.code}
                                    </text>
                                  )}

                                  {/* Fuse Icon (center) */}
                                  <FuseSymbol cx={0} cy={0} size={12} color="black" />

                                  {/* AMP (right) */}
                                  {wire.wireDetails.fuse.ampere && (
                                    <text
                                      x={22}
                                      y={4}
                                      textAnchor="start"
                                      fontSize="10"
                                      fill="black"
                                      fontWeight="bold"
                                      alignmentBaseline="middle"
                                    >
                                      {wire.wireDetails.fuse.ampere}
                                    </text>
                                  )}
                                </g>
                              )}
                          </>
                        )}
                      </>
                    )}
                    <g
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent deselecting everything else
                        setSelectedComponentIds([]);
                        setSelectedConnector(null);
                        // Select only this wire
                        setSelectedWires([i.toString()]);
                        setPopupComponent(null);
                        setPopupConnector(null);
                        setPopupWire(null);
                        // Set popupWire with all details
                        setPopupWire({
                          wire,
                          fromComponent: fromComponent!,
                          fromConnector: from!,
                          toComponent: toComponent!,
                          toConnector: to!,
                        });

                        // Set popup position
                        setPopupWirePosition({
                          x: fromX + 900,
                          y: intermediateY + 100,
                        });
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <polyline
                        key={i}
                        points={`${fromX},${fromY} ${fromX},${intermediateY} ${toX},${intermediateY} ${toX},${toY}`}
                        fill="none"
                        stroke={
                          selectedWires.includes(i.toString())
                            ? "#3390FF"
                            : wire.color
                        }
                        strokeWidth={selectedWires.includes(i.toString()) ? 6 : 3}
                        markerEnd="url(#arrowhead)"
                        pointerEvents="stroke" // important
                      />
                    </g>
                    {/* <circle cx={toX} cy={toY} r={5} fill={wire.color}></circle> */}
                    {toComponent?.componentType?.toLowerCase() !== "splice" && (
                      <>
                        {isToTop ? (
                          <>
                            <TridentShape
                              cx={toX}
                              cy={toY - 15}
                              color={wire.color}
                              size={10}
                            />

                            {/* Fuse flipped when trident on top */}
                            {toComponent?.category?.toLowerCase() === "supply" &&
                              toComponent?.label
                                ?.toLowerCase()
                                .includes("load center") && (
                                <g
                                  transform={`translate(${toX}, ${toY - 10
                                    }) scale(1, -1)`}
                                >
                                  <FuseSymbol
                                    cx={0}
                                    cy={30}
                                    size={14}
                                    color="black"
                                  />
                                </g>
                              )}
                          </>
                        ) : (
                          <>
                            <g
                              transform={`translate(${toX}, ${toY + 15
                                }) scale(1, -1)`}
                            >
                              <TridentShape
                                cx={0}
                                cy={0}
                                color={wire.color}
                                size={10}
                              />
                            </g>

                            {toComponent?.category?.toLowerCase() === "supply" &&
                              toComponent?.label
                                ?.toLowerCase()
                                .includes("load center") && (
                                <FuseSymbol
                                  cx={toX}
                                  cy={toY + 35}
                                  size={14}
                                  color="black"
                                />
                              )}
                          </>
                        )}
                      </>
                    )}
                    <text
                      x={fromX + 10}
                      y={fromLabelY}
                      textAnchor="start"
                      fontSize="10"
                      alignmentBaseline="middle"
                      fill="black"
                      fontWeight="bold"
                    >
                      {wire.from.cavity}
                    </text>
                    <text
                      x={toX + 10}
                      y={toLabelY}
                      textAnchor="start"
                      fontSize="10"
                      alignmentBaseline="middle"
                      fill="black"
                      fontWeight="bold"
                    >
                      {wire.to.cavity}
                    </text>
                  </g>
                );
                return <g key={i}>{wireElement}</g>;
              })}
            </svg>
          </div>
        </div>
        <PopupComponentDetails
          popupComponent={popupComponent}
          onClose={() => setPopupComponent(null)}
        />
        <PopupWireDetails
          popupWire={popupWire}
          onClose={(e) => {
            e.stopPropagation();
            setSelectedWires([]);
            setPopupWire(null);
          }}
        />
        <PopupConnectorDetails
          popupConnector={popupConnector}
          selectedDTC={selectedDTC}
          onClose={(e) => {
            e.stopPropagation();
            setPopupConnector(null);
            setSelectedConnector(null);
          }}
          selectedTab={activeTab}
        />
      </div>
    </div>
  );
}
// Add at the end of component file
const spinnerStyle = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
const style = document.createElement("style");
style.textContent = spinnerStyle;
document.head.appendChild(style);
