// ...existing code...
import React, {
  useState,
  useEffect,
  useRef,
  JSX,
  useLayoutEffect,
  useMemo,
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
  SplicePopupType,
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
  getConnectionPointsForConnector,
} from "./SchematicUtils";
import PopupComponentDetails from "../popup/PopupComponentDetails";
import PopupWireDetails from "../popup/PopupWireDetails";
import PopupConnectorDetails from "../popup/PopupConnectorDetails";
import PopupSpliceDetails from "../popup/PopupSpliceDetails";

import { DTC_STEPS_DATA } from "../../utils/DtcStepsData";
import {
  resetView,
  handleWheel,
  zoom,
  handleMouseMove,
  enterFullscreen,
  exitFullscreen,
} from "./SchematicViews";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RefreshCw,
  Maximize,
  Minimize,
  Download,
} from "lucide-react";
import { schematicExportManager } from "./SchematicExport";


// ...existing code...
const colors = {
  OG: "orange",
};

// Safe numeric helper to prevent NaN from being rendered
const safe = (val: number, fallback: number = 0): number => {
  return Number.isFinite(val) ? val : fallback;
};

// Global constants for schematic layout
const componentSize = { width: 100, height: 60 };
const padding = 20;
const connectorSpacing = 30;
const connectorHeight = 20;
const connectorNamePadding = 25;

export default function Schematic({
  data,
  scale = 1,
  activeTab,
  dtcCode,
  onComponentRightClick,
}: {
  data: SchematicData;
  scale?: number;
  activeTab?: string;
  dtcCode?: string;
  onComponentRightClick?: (component: ComponentType, pos: { x: number; y: number }) => void; // <-- ADDED
}) {
  const svgWrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const renderInitialized = useRef(false);
  const clickTimeout = useRef<number | null>(null);
  const componentNameRefs = useRef<{ [id: string]: SVGTextElement | null }>({});
  const connectorNameRefs = useRef<{ [id: string]: SVGTextElement | null }>({});

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [renderCount, setRenderCount] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragOrigin, setDragOrigin] = useState<{ x: number; y: number } | null>(null);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 800, h: 600 });
  const [fitViewBox, setFitViewBox] = useState(viewBox);
  
  const [selectedComponentIds, setSelectedComponentIds] = useState<string[]>([]);
  const [selectedWires, setSelectedWires] = useState<string[]>([]);
  const [selectedConnector, setSelectedConnector] = useState<ConnectorType | null>(null);
  const [selectedDTC, setSelectedDTC] = useState<any>(null);
  
  const [popupComponent, setPopupComponent] = useState<ComponentType | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [popupWire, setPopupWire] = useState<WirePopupType | null>(null);
  const [popupWirePosition, setPopupWirePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [popupConnector, setPopupConnector] = useState<PopupConnectorType | null>(null);
  const [popupSplice, setPopupSplice] = useState<SplicePopupType | null>(null);
  const [popupSpliceLoading, setPopupSpliceLoading] = useState(false);
  const [popupSpliceError, setPopupSpliceError] = useState<string | null>(null);
  const [popupClosedManually, setPopupClosedManually] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, component: ComponentType } | null>(null);
  const [componentNameWidths, setComponentNameWidths] = useState<{ [id: string]: number }>({});
  const [connectorNameWidths, setConnectorNameWidths] = useState<{ [id: string]: number }>({});
  const [connectorConnectionCount, setConnectorConnectionCount] = useState<{ [id: string]: number }>({});

  const smartMasterIds = useMemo(() => {
    const seeds = new Set(data.masterComponents || []);
    const rowAssignment: { [id: string]: number } = {};
    const adj: { [id: string]: string[] } = {};

    (data.components || []).forEach((c) => {
      adj[c.id] = [];
    });
    (data.connections || []).forEach((conn) => {
      const f = conn.from?.componentId;
      const t = conn.to?.componentId;
      if (f && t && f !== t) {
        adj[f].push(t);
        adj[t].push(f);
      }
    });

    const queue: string[] = [];
    seeds.forEach((id) => {
      rowAssignment[id] = 0;
      queue.push(id);
    });

    // BFS from master components
    while (queue.length > 0) {
      const curr = queue.shift()!;
      (adj[curr] || []).forEach((neighbor) => {
        if (rowAssignment[neighbor] === undefined) {
          rowAssignment[neighbor] = 1 - rowAssignment[curr];
          queue.push(neighbor);
        }
      });
    }

    // Handle remaining islands
    (data.components || []).forEach((c) => {
      if (rowAssignment[c.id] === undefined) {
        rowAssignment[c.id] = 1; // Default to regular row
        queue.push(c.id);
        while (queue.length > 0) {
          const curr = queue.shift()!;
          (adj[curr] || []).forEach((neighbor) => {
            if (rowAssignment[neighbor] === undefined) {
              rowAssignment[neighbor] = 1 - rowAssignment[curr];
              queue.push(neighbor);
            }
          });
        }
      }
    });

    return new Set((data.components || []).filter((c) => rowAssignment[c.id] === 0).map((c) => c.id));
  }, [data]);

  // Barycenter heuristic: reorder components within each row to minimise wire crossings.
  // Components whose connections land mostly on the LEFT will be placed on the LEFT, etc.
  // This is the standard O(n log n) approach used in layered graph drawing.
  const sortedComponentIds = useMemo(() => {
    const masterComps = (data.components || []).filter(c => smartMasterIds.has(c.id));
    const regularComps = (data.components || []).filter(c => !smartMasterIds.has(c.id));

    if (masterComps.length === 0 || regularComps.length === 0) {
      return {
        master: masterComps.map(c => c.id),
        regular: regularComps.map(c => c.id),
      };
    }

    // Step 1 — initial regular positions (original data order)
    const regularPos: { [id: string]: number } = {};
    regularComps.forEach((c, i) => { regularPos[c.id] = i; });

    // Step 2 — sort master row by barycenter of regular-row neighbours
    const masterBary: { [id: string]: number } = {};
    masterComps.forEach((mc, i) => {
      const targets = (data.connections || [])
        .filter(w =>
          (w.from.componentId === mc.id && regularPos[w.to.componentId] !== undefined) ||
          (w.to.componentId === mc.id && regularPos[w.from.componentId] !== undefined))
        .map(w => regularPos[w.from.componentId === mc.id ? w.to.componentId : w.from.componentId] ?? 0);
      masterBary[mc.id] = targets.length > 0 ? targets.reduce((a, b) => a + b, 0) / targets.length : i;
    });
    const sortedMaster = [...masterComps].sort((a, b) => masterBary[a.id] - masterBary[b.id]).map(c => c.id);

    // Step 3 — update master positions, then sort regular row by barycenter of master-row neighbours
    const masterPos: { [id: string]: number } = {};
    sortedMaster.forEach((id, i) => { masterPos[id] = i; });

    const regularBary: { [id: string]: number } = {};
    regularComps.forEach((rc, i) => {
      const targets = (data.connections || [])
        .filter(w =>
          (w.from.componentId === rc.id && masterPos[w.to.componentId] !== undefined) ||
          (w.to.componentId === rc.id && masterPos[w.from.componentId] !== undefined))
        .map(w => masterPos[w.from.componentId === rc.id ? w.to.componentId : w.from.componentId] ?? 0);
      regularBary[rc.id] = targets.length > 0 ? targets.reduce((a, b) => a + b, 0) / targets.length : i;
    });
    const sortedRegular = [...regularComps].sort((a, b) => regularBary[a.id] - regularBary[b.id]).map(c => c.id);

    return { master: sortedMaster, regular: sortedRegular };
  }, [data, smartMasterIds]);

  // Barycenter sorting for connectors within each component
  // This ensures bottom connectors are ordered based on where their wires connect on the top row
  const sortedConnectorsMap = useMemo(() => {
    const connectorMap = new Map<string, string[]>();
    
    (data.components || []).forEach(component => {
      const connectors = component.connectors || [];
      if (connectors.length <= 1) {
        // No sorting needed for 0 or 1 connector
        connectorMap.set(component.id, connectors.map(c => c.id));
        return;
      }

      // Determine if this component is master (top) or regular (bottom)
      const isMaster = smartMasterIds.has(component.id);
      
      // Get the opposite row components
      const oppositeComps = (data.components || []).filter(c => 
        isMaster ? !smartMasterIds.has(c.id) : smartMasterIds.has(c.id)
      );
      
      // Create position map for opposite row
      const oppositePos: { [id: string]: number } = {};
      oppositeComps.forEach((c, i) => { oppositePos[c.id] = i; });

      // Calculate barycenter for each connector
      const connectorBary: { [connId: string]: number } = {};
      connectors.forEach((conn, originalIndex) => {
        // Find all connections involving this connector
        const connectedTargets = (data.connections || [])
          .filter(w => 
            (w.from.componentId === component.id && w.from.connectorId === conn.id) ||
            (w.to.componentId === component.id && w.to.connectorId === conn.id)
          )
          .map(w => {
            // Get the opposite component ID
            const oppositeCompId = w.from.componentId === component.id 
              ? w.to.componentId 
              : w.from.componentId;
            return oppositePos[oppositeCompId] ?? 0;
          });

        // Barycenter = average position of connected components
        connectorBary[conn.id] = connectedTargets.length > 0
          ? connectedTargets.reduce((sum, pos) => sum + pos, 0) / connectedTargets.length
          : originalIndex; // fallback to original position if no connections
      });

      // Sort connectors by barycenter value
      const sortedConnIds = [...connectors]
        .sort((a, b) => connectorBary[a.id] - connectorBary[b.id])
        .map(c => c.id);

      connectorMap.set(component.id, sortedConnIds);
    });

    return connectorMap;
  }, [data, smartMasterIds]);

  // Channel routing heuristic: sort cross-row wires to eliminate track crossings
  const crossRowTracks = useMemo(() => {
    const tracks: { [index: number]: number } = {};
    if (!data.connections) return tracks;
    
    const wireSpans = data.connections.map((wire, i) => {
      const fromComp = (data.components || []).find(c => c.id === wire.from.componentId);
      const toComp = (data.components || []).find(c => c.id === wire.to.componentId);
      const fx = fromComp ? getXForComponent(fromComp) : 0;
      const tx = toComp ? getXForComponent(toComp) : 0;
      return { index: i, fx, tx };
    });

    const rightGoing = wireSpans.filter(w => w.fx <= w.tx);
    const leftGoing = wireSpans.filter(w => w.fx > w.tx);

    // Right-going wires: Largest fromX gets Top track
    rightGoing.sort((a, b) => b.fx - a.fx);
    
    // Left-going wires: Smallest fromX gets Top track (among bottom tracks)
    leftGoing.sort((a, b) => a.fx - b.fx);

    let trackNo = 1;
    rightGoing.forEach(w => tracks[w.index] = trackNo++);
    leftGoing.forEach(w => tracks[w.index] = trackNo++);

    return tracks;
  }, [data, smartMasterIds, sortedComponentIds, componentNameWidths]);

  // Temporary storage for connection points during wire rendering
  let connectionPoints: { [id: string]: { x: number; y: number } } = {};

  const draggingRef = useRef(dragging);
  const dragStartRef = useRef(dragStart);
  const dragOriginRef = useRef(dragOrigin);
  const rotationRef = useRef(rotation);
  const viewBoxRef = useRef(viewBox);

  // Sync refs with state
  useEffect(() => { draggingRef.current = dragging; }, [dragging]);
  useEffect(() => { dragStartRef.current = dragStart; }, [dragStart]);
  useEffect(() => { dragOriginRef.current = dragOrigin; }, [dragOrigin]);
  useEffect(() => { rotationRef.current = rotation; }, [rotation]);
  useEffect(() => { viewBoxRef.current = viewBox; }, [viewBox]);

  // Track render count and analytics
  useEffect(() => {
    setRenderCount(prev => prev + 1);
    if (!renderInitialized.current) {
      renderInitialized.current = true;
      try {
        const today = new Date().toDateString();
        const storedData = localStorage.getItem('schematicRendersAnalytics');
        let renderData = storedData ? JSON.parse(storedData) : { date: today, count: 0 };
        if (renderData.date !== today) {
          renderData = { date: today, count: 1 };
        } else {
          renderData.count += 1;
        }
        localStorage.setItem('schematicRendersAnalytics', JSON.stringify(renderData));
      } catch (error) {
        console.error('Failed to update schematic render analytics:', error);
      }
    }
  }, [data]);

  // Global interactions
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const svgWrapper = svgWrapperRef.current;
      const popup = popupRef.current;
      if (svgWrapper && !svgWrapper.contains(event.target as Node) && (!popup || !popup.contains(event.target as Node))) {
        setSelectedComponentIds([]);
        setSelectedWires([]);
        setSelectedConnector(null);
        setPopupComponent(null);
        setPopupConnector(null);
        setPopupWire(null);
        setPopupSplice(null);
        setSelectedDTC(null);
        setPopupClosedManually(false);
        setContextMenu(null);
      }
    };
    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (activeTab !== 'DTC') setSelectedDTC(null);
  }, [activeTab]);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragOrigin({ x: viewBoxRef.current.x, y: viewBoxRef.current.y });
  };

  const handleMouseUp = () => {
    setDragging(false);
    setDragStart(null);
    setDragOrigin(null);
  };

  const handleMouseMoveLocal = (e: React.MouseEvent<SVGSVGElement> | MouseEvent) => {
    handleMouseMove(
      e as any,
      svgRef.current,
      draggingRef.current,
      dragStartRef.current,
      dragOriginRef.current,
      viewBoxRef.current,
      setViewBox,
      rotationRef.current
    );
  };



  const handleSpliceClick = async (
    e: React.MouseEvent,
    comp: ComponentType,
    connections: ConnectionType[]
  ) => {
    e.stopPropagation();
    setSelectedComponentIds([]);
    setSelectedWires([]);
    setSelectedConnector(null);
    setPopupComponent(null);
    setPopupWire(null);
    setPopupConnector(null);
    setSelectedDTC(null);
    setPopupSpliceError(null);

    // Optimistically build from local data first
    const localSpliceData: SplicePopupType = {
      spliceId: comp.id,
      label: comp.label,
      category: comp.category,
      connections: connections.map((wire) => ({
        wireColor: wire.color,
        circuitNumber: wire.wireDetails?.circuitNumber,
        fromComponentId: wire.from?.componentId,
        fromConnectorId: wire.from?.connectorId,
        fromCavity: wire.from?.cavity,
        toComponentId: wire.to?.componentId,
        toConnectorId: wire.to?.connectorId,
        toCavity: wire.to?.cavity,
      })),
    };
    // Only use local data since backend endpoint is not implemented yet
    setPopupSplice(localSpliceData);
  };

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

    // Close other popups but preserve connector selection
    setPopupComponent(null);
    setPopupWire(null);
    setPopupSplice(null);

    setPopupConnector({
      componentCode: comp.label || comp.id,
      connectorCode: connector.label || connector.id,
      harnessName: comp.harness_name,
      partNumber: comp.connector_part_number,
      gender: connector.gender,
      color: connector.color,
      connectorType: comp.connector_type,
      cavityCount,
      manufacturer: connector.manufacturer,
      termPartNo: connector.termPartNo,
      sealPartNo: connector.sealPartNo,
    });


    if (activeTab === 'DTC') {
      if (dtcCode && DTC_STEPS_DATA[dtcCode]) {
        setSelectedDTC({
          ...DTC_STEPS_DATA[dtcCode],
          code: dtcCode,
        });
      } else {
        setSelectedDTC(null);
      }
    }

  };

  // 5. EFFECTS (LISTENERS & VIEW MANAGEMENT)
  useLayoutEffect(() => {
    if (fitViewBox) resetView(svgWrapperRef, fitViewBox, setViewBox);
  }, [fitViewBox, rotation]);

  useEffect(() => {
    const svgElement = svgWrapperRef.current?.querySelector("svg");
    if (!svgElement) return;
    const handleWheelEvent = (e: WheelEvent) => {
      handleWheel(e, svgElement as SVGSVGElement, viewBoxRef.current, setViewBox, rotationRef.current);
    };
    svgElement.addEventListener("wheel", handleWheelEvent, { passive: false });
    return () => svgElement.removeEventListener("wheel", handleWheelEvent);
  }, []);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const handleTouchMoveNative = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        const t = e.touches[0];
        handleMouseMoveLocal({ clientX: t.clientX, clientY: t.clientY } as unknown as React.MouseEvent<SVGSVGElement>);
      }
    };
    svg.addEventListener("touchmove", handleTouchMoveNative, { passive: false });
    return () => svg.removeEventListener("touchmove", handleTouchMoveNative);
  }, []);

  useLayoutEffect(() => {
    var maxY = padding + componentSize.height + spaceForWires(data) + componentSize.height + padding;
    let newWidths: { [id: string]: number } = {};
    let connWidths: { [id: string]: number } = {};
    let tempMaxX = 0;
    let masterRowX = padding;
    let regularRowX = padding;

    (data.components || []).forEach((comp) => {
      const ref = componentNameRefs.current[comp.id];
      newWidths[comp.id] = ref ? ref.getBBox().width : 100;
      
      const isMaster = smartMasterIds.has(comp.id);
      // We'll calculate a rough max width here. 
      // Since we can't easily call getWidthForComponent here due to state update timing,
      // and getXForComponent will be used for actual rendering, 
      // we just need a safe tempMaxX for fitViewBox.
      // But actually, we want the viewbox to be accurate.
      
      (comp.connectors || []).forEach((conn) => {
        const ref = connectorNameRefs.current[conn.id];
        connWidths[conn.id] = ref ? ref.getBBox().width : 50;
      });
    });

    setComponentNameWidths(newWidths);
    setConnectorNameWidths(connWidths);

    const connCount: { [id: string]: number } = {};
    data.connections?.forEach((conn) => {
      connCount[conn.from.connectorId] = (connCount[conn.from.connectorId] || 0) + 1;
      connCount[conn.to.connectorId] = (connCount[conn.to.connectorId] || 0) + 1;
    });
    setConnectorConnectionCount(connCount);

    // Calculate tempMaxX based on row alignment
    // This is a bit of a placeholder until the next render when widths are fully applied,
    // but it's better than summing everything.
    let maxX = 0;
    let mX = padding;
    let rX = padding;
    (data.components || []).forEach(comp => {
        const isMaster = smartMasterIds.has(comp.id);
        // Approximation of width for viewbox
        const w = (newWidths[comp.id] || 100) + padding; 
        if (isMaster) mX += w + padding;
        else rX += w + padding;
    });
    tempMaxX = Math.max(mX, rX, 800);

    setFitViewBox({ x: 0, y: 0, w: tempMaxX, h: maxY });
  }, [data]);

  function checkAndReturnIntersection(
    i: number,
    x1: number,
    x2: number,
    y1: number,
    y2: number
  ): JSX.Element | undefined {
    let intersection = null;
    for (let j = 0; j < (data.connections?.length ?? 0); j++) {
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
    const isMaster = smartMasterIds.has(component.id);
    const masterComps = (data.components || []).filter(c => smartMasterIds.has(c.id));
    const regularComps = (data.components || []).filter(c => !smartMasterIds.has(c.id));

    // --- Equal-width layout: 2 master + 1 regular → single regular spans the full master row width ---
    if (masterComps.length === 2 && regularComps.length === 1 && !isMaster) {
      let totalMaster = padding;
      masterComps.forEach(mc => {
        totalMaster += getNaturalWidthForComponent(mc) + padding;
      });
      // Return total master row width minus one padding (for symmetry)
      return Math.max(totalMaster - padding, 100);
    }

    return getNaturalWidthForComponent(component);
  }

  function getNaturalWidthForComponent(component: ComponentType): number {
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
        // Use sorted connectors for width calculation
        getSortedConnectors(component).forEach((conn) => {
          connectorWidth += getWidthForConnector(conn, component) + connectorSpacing;
        });
        width = Math.max(width, connectorWidth, width);
      }
    }

    return width;
  }

  function getXForComponent(component: ComponentType): number {
    const isMaster = smartMasterIds.has(component.id);
    // Use the barycenter-sorted order for X position to minimise wire crossings
    const sortedIds = isMaster ? sortedComponentIds.master : sortedComponentIds.regular;
    const index = sortedIds.indexOf(component.id);

    let x = padding;
    for (let i = 0; i < index; i++) {
      const compId = sortedIds[i];
      const compBefore = (data.components || []).find(c => c.id === compId);
      if (compBefore) {
        x += getWidthForComponent(compBefore) + padding;
      }
    }
    return x;
  }

  function getYForComponent(component: ComponentType): number {
    let isMasterComponent = smartMasterIds.has(component.id);
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
    const nameWidth = componentNameWidths[component.id] ?? 100; // fallback if not measured yet
    return safe(
      getXForComponent(component) +
      nameWidth / 2 +
      padding / 2,
      padding
    );
  }

  function getXForConnector(
    connector: ConnectorType,
    component: ComponentType
  ): number {
    let x = getXForComponent(component);
    if (component.shape === "rectangle") {
      // Use sorted connectors for positioning
      const sortedConns = getSortedConnectors(component);
      let connectorCount = sortedConns.length;
      let index = sortedConns.findIndex((c) => c.id === connector.id);
      var connWidth = 0;
      if (connectorCount > 1) {
        connWidth += connectorSpacing;
        for (var i = 0; i < index; i++) {
          let conn = sortedConns[i];
          if (conn) {
            connWidth += getWidthForConnector(conn, component);
            connWidth += connectorSpacing;
          }
        }
        return x + connWidth;
      }
    }
    return (
      x +
      getWidthForComponent(component) / 2 -
      (component.connectors && component.connectors.length > 0
        ? getWidthForConnector(component.connectors[0], component) / 2
        : 0)
    );
  }

  function getYForConnector(
    connector: ConnectorType,
    component: ComponentType
  ): number {
    let isMasterComponent = smartMasterIds.has(component.id);
    return isMasterComponent
      ? getYForComponent(component) + componentSize.height
      : getYForComponent(component) - 20;
  }

  function getSpliceCenterY(component: ComponentType): number {
    const isMasterComponent = smartMasterIds.has(component.id);
    const baseY = getYForComponent(component);
    const offset = connectorHeight / 2 + 2;

    return isMasterComponent
      ? baseY + componentSize.height + offset
      : baseY - offset;
  }

  // Get sorted connectors for a component based on barycenter ordering
  function getSortedConnectors(component: ComponentType): ConnectorType[] {
    const sortedConnIds = sortedConnectorsMap.get(component.id);
    if (!sortedConnIds) {
      return component.connectors || [];
    }
    
    // Return connectors in the sorted order
    const connMap = new Map<string, ConnectorType>();
    (component.connectors || []).forEach(conn => connMap.set(conn.id, conn));
    
    return sortedConnIds
      .map(id => connMap.get(id))
      .filter((conn): conn is ConnectorType => conn !== undefined);
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
  const buttonStyle: React.CSSProperties = {
    padding: "3px 7px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    background: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
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
        background: "var(--bg-primary, #f6f8fc)",
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
              onClick={handleRotate}
              title="Rotate view"
              style={buttonStyle}
            >
              <RotateCcw size={18} />
            </button>
            <button
              onClick={() => {
                setRotation(0);
                resetView(svgWrapperRef, fitViewBox, setViewBox);
              }}
              title="Reset view"
              style={buttonStyle}
            >
              <RefreshCw size={18} />
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
              ref={svgRef}
              onClick={(e) => {
                setContextMenu(null)
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
              onWheel={(e) => {
                handleWheel(
                  e.nativeEvent,
                  e.currentTarget as SVGSVGElement,
                  viewBoxRef.current,
                  setViewBox,
                  rotation
                );
              }}
              style={{
                border: "1px solid #ccc",
                width: "100%",
                height: "100%",
                cursor: dragging ? "grabbing" : "grab",
                display: "block",
                backgroundColor: "var(--bg-primary, #f6f8fc)",
                userSelect: dragging ? "none" : "auto", // Disable text selection while dragging
                WebkitUserSelect: dragging ? "none" : "auto", // For Safari
                MozUserSelect: dragging ? "none" : "auto", // For Firefox
                msUserSelect: dragging ? ("none" as any) : ("auto" as any),
                position: "relative",
                overflow: "auto",
                touchAction: "none", // also helps prevent browser default behavior
              }}
              viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMoveLocal}
              onTouchStart={(e) => {
                const t = e.touches[0];
                handleMouseDown({
                  clientX: t.clientX,
                  clientY: t.clientY,
                } as unknown as React.MouseEvent<SVGSVGElement>);
              }}
              // onTouchMove is handled manually via ref to allow preventDefault
              onTouchEnd={(e) => {
                handleMouseUp();
              }}
            >
              <g transform={`rotate(${rotation} ${viewBox.x + viewBox.w / 2} ${viewBox.y + viewBox.h / 2})`}>

              {(data.components || []).map((comp, componentIndex) => (
                <g key={comp.id}>
                  {(comp.componentType?.toLowerCase() === "splice" ||
                    comp.label?.toLowerCase() === "splice")
                    ? (
                      <g
                        onClick={(e) => {
                          const spliceConnections = (data.connections || []).filter(
                            (wire) =>
                              wire.from?.componentId === comp.id ||
                              wire.to?.componentId === comp.id
                          );
                          handleSpliceClick(e, comp, spliceConnections);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <circle
                          cx={safe(
                            getXForComponent(comp) + getWidthForComponent(comp) / 2,
                            padding
                          )}
                          cy={safe(getSpliceCenterY(comp), padding)}
                          r={componentSize.height / 8} // adjust radius as needed
                          fill={
                            comp.isHighlighted
                              ? "#fca5a5"                     // duplicate = red-300
                              : popupSplice?.spliceId === comp.id
                              ? "#ede9fe"                     // selected splice = purple-100
                              : "white"
                          }
                          stroke={
                            comp.isHighlighted
                              ? "#dc2626"                     // duplicate = strong red border
                              : popupSplice?.spliceId === comp.id
                              ? "#2563eb"                    // selected splice = purple
                              : "black"
                          }
                          strokeWidth={
                            comp.isHighlighted ? 3 : popupSplice?.spliceId === comp.id ? 2 : 1
                          }
                        />
                        <circle
                          cx={safe(
                            getXForComponent(comp) + getWidthForComponent(comp) / 2,
                            padding
                          )}
                          cy={safe(getSpliceCenterY(comp), padding)}
                          r={componentSize.height / 10}
                          fill={
                            comp.isHighlighted
                              ? "yellow"                     // duplicate = red-300
                              : popupSplice?.spliceId === comp.id
                              // ? "#8b5cf6"     
                              ? "#2563eb"              // selected = purple dot
                              : "black"
                          }
                        />
                      </g>
                    ) : (
                      comp.shape === "rectangle" && (
                        <g
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedWires([]);

                            // Select this component
                            setSelectedComponentIds([comp.id]);

                            // Close other popups and clear connector selection
                            setPopupComponent(null);
                            setPopupWire(null);
                            setPopupConnector(null);
                            setSelectedConnector(null); // Clear connector highlight
                            setSelectedDTC(null);
                            setPopupSplice(null);

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
                            x={safe(getXForComponent(comp), padding)}
                            y={safe(getYForComponent(comp), padding)}
                            width={safe(getWidthForComponent(comp), 100)}
                            height={componentSize.height}

                            //  Dynamic fill
                            fill={
                              selectedComponentIds.includes(comp.id)
                                ? "#93c5fd"                     // selected = blue-300
                                : comp.isHighlighted
                                  ? "yellow"                     // duplicate = yellow
                                  : "lightblue"
                            }

                            //  Dynamic stroke
                            stroke={
                              comp.isHighlighted
                                ? "#dc2626"                     // duplicate = strong red border
                                : selectedComponentIds.includes(comp.id)
                                  ? "#2563eb"                     // selected = strong blue
                                  : "black"
                            }

                            strokeWidth={
                              comp.isHighlighted ? 3 : 1
                            }

                            strokeDasharray={
                              componentIndex !== 0 ? "6,4" : undefined
                            }

                            style={{
                              cursor: "pointer",
                            }}

                            onContextMenu={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const pos = { x: e.clientX, y: e.clientY };

                              setSelectedWires([]);
                              setPopupComponent(null);
                              setPopupWire(null);
                              setPopupConnector(null);
                              setSelectedConnector(null);
                              setSelectedDTC(null);
                              setPopupSplice(null);

                              setContextMenu({ x: e.clientX, y: e.clientY, component: comp });
                              if (onComponentRightClick) onComponentRightClick(comp, pos);
                            }}

                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedComponentIds([comp.id]);
                              setSelectedWires([]);

                              setPopupComponent(null);
                              setPopupWire(null);
                              setPopupConnector(null);
                              setSelectedConnector(null);
                              setSelectedDTC(null);
                              setPopupSplice(null);

                              setPopupComponent(comp);
                            }}
                          />
                          {selectedComponentIds.includes(comp.id) && (
                            <rect
                              x={safe(getXForComponent(comp), padding)}
                              y={safe(
                                getYForComponent(comp) <
                                  fitViewBox.y + fitViewBox.h / 2
                                  ? getYForComponent(comp) - 60
                                  : getYForComponent(comp) + 60,
                                padding
                              )}
                              width={safe(getWidthForComponent(comp), 100)}
                              height={componentSize.height}
                              fill="#3390FF"
                              opacity={0.3}
                              pointerEvents="none" // so the click still passes through to the base rect
                            />
                          )}

                          {comp.category?.toLowerCase() === "sensor" && (
                            <Sensor
                              x={safe(getXForComponent(comp) + 20, 50)} // left of rectangle
                              y={safe(getYForComponent(comp) + 15, 50)} // top of rectangle
                              width={safe(getWidthForComponent(comp) / 20, 5)} // match rectangle width
                              height={componentSize.height / 2} // match rectangle height
                              stroke="black"
                              strokeWidth={1}
                            />
                          )}

                          {comp.category?.toLowerCase() === "switch" && (
                            <ElectricalSwitch
                              x={safe(getXForComponent(comp), padding)}
                              y={safe(getYForComponent(comp), padding)}
                              sizeMultiplier={0.5}
                              stroke="black"
                              strokeWidth={1}
                            />
                          )}

                          {comp.category?.toLowerCase() === "transistor" && (
                            <Transistor
                              x={safe(
                                getXForComponent(comp) +
                                getWidthForComponent(comp) / 12,
                                padding
                              )} // horizontal centering
                              y={safe(getYForComponent(comp) + componentSize.height / 2, padding)} // vertical centering
                              sizeMultiplier={0.3} // make smaller so it fits neatly inside
                              stroke="black"
                              strokeWidth={5}
                            />
                          )}
                          {comp.category?.toLowerCase() === "transformer" && (
                            <Transformer
                              x={safe(
                                getXForComponent(comp) +
                                getWidthForComponent(comp) / 16,
                                padding
                              )} // horizontal centering
                              y={safe(getYForComponent(comp) + componentSize.height / 6, padding)} // vertical centering
                              sizeMultiplier={0.2} // scale it down to fit
                              stroke="black"
                              strokeWidth={1}
                              fill="black"
                            />
                          )}
                          {comp.category?.toLowerCase() === "motor" && (
                            <MotorSymbol
                              cx={safe(
                                getXForComponent(comp) +
                                getWidthForComponent(comp) / 5,
                                padding
                              )} // center of rectangle
                              cy={safe(getYForComponent(comp) + componentSize.height / 2, padding)} // center of rectangle
                              size={safe(
                                Math.min(
                                  getWidthForComponent(comp),
                                  componentSize.height
                                ) * 0.5,
                                20
                              )} // scale to fit rectangle
                              color="black"
                              fill="#B0E0E6"
                            />
                          )}
                          {comp.category?.toLowerCase() === "lamp" && (
                            <LampSymbol
                              cx={safe(
                                getXForComponent(comp) +
                                getWidthForComponent(comp) / 5,
                                padding
                              )}
                              cy={safe(getYForComponent(comp) + componentSize.height / 2, padding)}
                              size={safe(
                                Math.min(
                                  getWidthForComponent(comp),
                                  componentSize.height
                                ) * 0.5,
                                20
                              )}
                              color="black"
                            />
                          )}
                          {comp.category?.toLowerCase() === "ground" && (
                            <GroundSymbol
                              x={safe(getXForComponent(comp), padding)} // adjust horizontal position
                              y={safe(getYForComponent(comp) + 15, padding)} // adjust vertical position
                              width={safe(getWidthForComponent(comp) / 2, 50)} // adjust width scaling
                              height={safe(componentSize.height / 2, 30)} // adjust height scaling
                              stroke="black"
                              strokeWidth={3}
                            />
                          )}
                          {comp.category?.toLowerCase() === "resistor" && (
                            <ResistorSymbol
                              x={safe(getXForComponent(comp) - 50, padding)}
                              y={safe(getYForComponent(comp) + 13, padding)}
                              width={safe(getWidthForComponent(comp), 100)}
                              height={40}
                            />
                          )}
                          {comp.category?.toLowerCase() === "battery" && (
                            <Battery
                              x={safe(getXForComponent(comp) + 10, padding)}
                              y={safe(getYForComponent(comp) + 10, padding)}
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
                    x={safe(getXForComponentTitle(comp), padding)}
                    // y={getYForComponent(comp) + componentSize.height / 2}
                    y={safe(
                      getYForComponent(comp) +
                      (getYForComponent(comp) + componentSize.height / 2 <
                        fitViewBox.y + fitViewBox.h / 2
                        ? (comp.componentType?.toLowerCase() === "splice" ? componentSize.height - 10 : -componentSize.height / 2) // above component
                        : componentSize.height +
                        (comp.componentType?.toLowerCase() === "splice" ? -30 : 30)),
                      padding
                    )}
                    textAnchor="middle"
                    fontSize="20"
                    fill="black"
                  >
                    {comp.label + ` (${comp.id})`}
                  </text>
                  {getSortedConnectors(comp).map((conn) => (
                    <g key={conn.id}>
                      {/* render connector box only if component is not a splice */}
                      {comp.componentType?.toLowerCase() !== "splice" && (
                        <g>
                          <rect
                            x={safe(getXForConnector(conn, comp), padding)}
                            y={safe(getYForConnector(conn, comp), padding)}
                            width={safe(getWidthForConnector(conn, comp), 50)}
                            height={connectorHeight}
                            fill={
                              selectedConnector?.id === conn.id
                                ? "#3390FF"
                                : "lightgreen"
                            }
                            stroke="black"
                            strokeDasharray={
                              componentIndex !== 0 ? "6,4" : undefined
                            }
                            onClick={(e) => handleConnectorClick(e, conn, comp)}
                            style={{ cursor: "pointer" }}
                          />
                          {selectedConnector?.id === conn.id && (
                            <rect
                              x={safe(getXForConnector(conn, comp), padding)}
                              y={safe(getYForConnector(conn, comp), padding)}
                              width={safe(getWidthForConnector(conn, comp), 50)}
                              height={connectorHeight}
                              fill="#3390FF"
                              opacity={0.3}
                              pointerEvents="none" // so the click still passes through to the base rect
                            />
                          )}
                        </g>
                      )}

                      <text
                        ref={(el) => {
                          connectorNameRefs.current[conn.id] = el;
                        }}
                        x={safe(
                          getXForConnector(conn, comp) -
                          (comp.componentType?.toLowerCase() === "splice" ? -10 : 1),
                          padding
                        )} // reduce gap if splice
                        y={safe(getYForConnector(conn, comp) + 13, padding)}
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

              {/* Pre-compute a single shared intermediate Y for ALL cross-row wires.
               *  This creates a clean single-bus topology: all wires travel vertically
               *  from their connectors to a shared horizontal band, then turn to
               *  reach the destination. Much more readable than per-wire staggering. */}
              {(() => {
                // Find a representative master component and regular component to compute row Y levels
                const masterComp = (data.components || []).find(c => smartMasterIds.has(c.id));
                const regularComp = (data.components || []).find(c => !smartMasterIds.has(c.id));
                // masterBusY: just below the master row connectors (bottom of connector box)
                const masterBusY = masterComp
                  ? getYForComponent(masterComp) + componentSize.height + connectorHeight
                  : padding + componentSize.height + connectorHeight;
                // regularBusY: just above the regular row connectors (top of connector box)
                const regularBusY = regularComp
                  ? getYForComponent(regularComp) - connectorHeight
                  : masterBusY + 80;
                // Shared horizontal bus: midpoint of the gap between rows
                const sharedCrossRowY = Math.round((masterBusY + regularBusY) / 2);

                return (data.connections ?? []).map((wire, i) => {
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
                    getSpliceCenterY(fromComponent);

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
                    getSpliceCenterY(toComponent);

                  to = {
                    id: `splice-to-${toComponent.id}-${i}`,
                    label: "",
                    x: centerX,
                    y: centerY
                  } as any;
                }

                if (!from || !to) return null;

                let isFromMasterComponent = smartMasterIds.has(
                  fromComponent!.id
                );
                let isToMasterComponent = smartMasterIds.has(
                  toComponent!.id
                );

                let fromKey =
                  fromComponent?.componentType?.toLowerCase() === "splice"
                    ? `splice-${fromComponent.id}-${i}`
                    : `${connectionPointKey(wire.from)}-${i}`;

                var fromStoredConnectionPoint = connectionPoints[fromKey];


                var fromX = fromStoredConnectionPoint?.x;
                if (fromX == undefined) {

                  // FIX FOR SPLICE: fan wires out from the splice dot so vertical lines don't overlap
                  if (fromComponent?.componentType?.toLowerCase() === "splice") {
                    fromX =
                      getXForComponent(fromComponent) +
                      getWidthForComponent(fromComponent) / 2 +
                      (i * 6) - 15;
                  } else {
                    const fromConnectorX = getXForConnector(from, fromComponent!);
                    const fromConnectorWidth = getWidthForConnector(from, fromComponent!);
                    const fromConnectorCount = calculateCavityCountForConnector(from, data);

                    const connPoints = getConnectionPointsForConnector(from, data, smartMasterIds);
                    const pointIndex = connPoints.findIndex(
                      (p) => p.wire === wire && p.side === "from"
                    );

                    const fromConnectorOffset =
                      fromConnectorCount === 1
                        ? fromConnectorWidth / 2
                        : (fromConnectorWidth / (fromConnectorCount + 1)) *
                        (pointIndex + 1);

                    fromX =
                      fromComponent?.shape === "circle"
                        ? fromConnectorX + (fromConnectorWidth / 2) + ((pointIndex - (fromConnectorCount - 1) / 2) * 5)
                        : fromConnectorX + fromConnectorOffset;
                  }
                }

                var fromY = fromStoredConnectionPoint?.y;
                if (fromY == undefined) {
                  if (fromComponent?.componentType?.toLowerCase() === "splice") {
                    // Align wire to splice dot Y-position
                    fromY =
                      getSpliceCenterY(fromComponent);
                  } else {
                    fromY = isFromMasterComponent
                      ? getYForConnector(from, fromComponent!) + 20
                      : getYForConnector(from, fromComponent!);
                  }
                }


                fromKey =
                  fromComponent?.componentType?.toLowerCase() === "splice"
                    ? `splice-${fromComponent.id}-${i}`
                    : connectionPointKey(wire.from);

                connectionPoints[fromKey] = { x: fromX, y: fromY };


                var toKey =
                  toComponent?.componentType?.toLowerCase() === "splice"
                    ? `splice-${toComponent.id}-${i}`
                    : `${connectionPointKey(wire.to)}-${i}`;

                var toStoredConnectionPoint = connectionPoints[toKey];

                var toX = toStoredConnectionPoint?.x;
                if (toX == undefined) {

                  // FIX FOR SPLICE: fan wires out from the splice dot
                  if (toComponent?.componentType?.toLowerCase() === "splice") {
                    toX =
                      getXForComponent(toComponent) +
                      getWidthForComponent(toComponent) / 2 +
                      (i * 6) - 15;
                  } else {
                    const toConnectorX = getXForConnector(to, toComponent!);
                    const toConnectorWidth = getWidthForConnector(to, toComponent!);
                    const toConnectorCount = calculateCavityCountForConnector(to, data);

                    const connPointsTo = getConnectionPointsForConnector(to, data, smartMasterIds);
                    const pointIndexTo = connPointsTo.findIndex(
                      (p) => p.wire === wire && p.side === "to"
                    );

                    const toConnectorOffset =
                      toConnectorCount === 1
                        ? toConnectorWidth / 2
                        : (toConnectorWidth / (toConnectorCount + 1)) *
                        (pointIndexTo + 1);

                    toX =
                      toComponent?.shape === "circle"
                        ? toConnectorX + (toConnectorWidth / 2) + ((pointIndexTo - (toConnectorCount - 1) / 2) * 5)
                        : toConnectorX + toConnectorOffset;
                  }
                }

                var toY = toStoredConnectionPoint?.y;
                if (toY == undefined) {
                  if (toComponent?.componentType?.toLowerCase() === "splice") {
                    toY = getSpliceCenterY(toComponent);
                  } else {
                    toY = isToMasterComponent
                      ? getYForConnector(to, toComponent!) + 20
                      : getYForConnector(to, toComponent!);
                  }
                }

                toKey =
                  toComponent?.componentType?.toLowerCase() === "splice"
                    ? `splice-${toComponent.id}-${i}`
                    : connectionPointKey(wire.to);

                connectionPoints[toKey] = { x: toX, y: toY };

                const spliceRadius = componentSize.height / 8; // matches rendered splice radius

                if (fromComponent?.componentType?.toLowerCase() === "splice") {
                  const cx =
                    getXForComponent(fromComponent) +
                    getWidthForComponent(fromComponent) / 2;
                  const cy = getSpliceCenterY(fromComponent);
                  // if from is master (top row), attach at bottom center; else attach at top center
                  if (isFromMasterComponent) {
                    fromX = cx;
                    fromY = cy + spliceRadius;
                  } else {
                    fromX = cx;
                    fromY = cy - spliceRadius;
                  }
                  connectionPoints[fromKey] = { x: fromX, y: fromY };
                }
                // If 'to' is a splice, place the endpoint at the circle's center edge
                if (toComponent?.componentType?.toLowerCase() === "splice") {
                  const cx = getXForComponent(toComponent) + getWidthForComponent(toComponent) / 2;
                  const cy = getSpliceCenterY(toComponent);
                  if (isToMasterComponent) {
                    // splice at top — connect at bottom center
                    toX = cx;
                    toY = cy + spliceRadius;
                  } else {
                    // splice at bottom — connect at top center
                    toX = cx;
                    toY = cy - spliceRadius;
                  }
                  connectionPoints[toKey] = { x: toX, y: toY };
                }

                let intermediateY: number;
                if (isFromMasterComponent && isToMasterComponent) {
                  // Both in master row: route below both master components with distinct vertical tiers
                  // using the wire index so multiple same-row wires don't overlap horizontally.
                  intermediateY = Math.max(fromY, toY) + 40 + (i * 10);
                } else if (!isFromMasterComponent && !isToMasterComponent) {
                  // Both in regular row: route above both regular components with distinct vertical tiers
                  intermediateY = Math.min(fromY, toY) - 40 - (i * 10);
                } else {
                  // Cross-row wire: each wire gets its own evenly-spaced horizontal band.
                  // Sorted perfectly by the channel routing heuristic (crossRowTracks) 
                  // to eliminate horizontal/vertical track line crossings.
                  const availableGap = regularBusY - masterBusY;
                  const totalWires = data.connections?.length ?? 1;
                  const slotHeight = availableGap / (totalWires + 1);
                  const optimalTrackIndex = crossRowTracks[i] || (i + 1);
                  intermediateY = Math.round(masterBusY + slotHeight * optimalTrackIndex);
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
                const fromCavity = Number(wire.from.cavity); // get cavity of "from" connector
                const toCavity = Number(wire.to.cavity); // get cavity of "to" connector

                let wireElement;
                wireElement = (
                  <g>
                    {fromComponent?.componentType?.toLowerCase() !== "splice" && (
                      <>
                        {isFromTop ? (
                          <>
                            {/* top component → trident points UP */}
                            <TridentShape
                              cx={safe(fromX, 0)}
                              cy={safe(fromY - 15, 0)}
                              color={wire.color}
                              size={10}
                            />
                            {(fromComponent?.category?.toLowerCase() === "supply" || fromComponent?.label?.toLowerCase().includes("load center") || fromComponent?.label?.toLowerCase().includes("fuse") || fromComponent?.label?.toLowerCase().includes("transformator") || ((activeTab === "systems" || activeTab === "harnesses") && fromComponent?.label?.toLowerCase().includes("load center"))) &&
                              wire.wireDetails?.fuse && (
                                <g transform={`translate(${safe(fromX, 0)}, ${safe(fromY - 45, 0)})`}>

                                  {/* LEFT NORMAL TEXT (not flipped) */}
                                  {wire.wireDetails?.fuse?.code && (
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
                                  {wire.wireDetails?.fuse?.ampere && (
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
                              transform={`translate(${safe(fromX, 0)}, ${safe(fromY + 15, 0)
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
                            {(fromComponent?.category?.toLowerCase() === "supply" || fromComponent?.label?.toLowerCase().includes("load center") || fromComponent?.label?.toLowerCase().includes("fuse") || fromComponent?.label?.toLowerCase().includes("transformator") || ((activeTab === "systems" || activeTab === "harnesses") && fromComponent?.label?.toLowerCase().includes("load center"))) &&
                              wire.wireDetails?.fuse && (
                                <g transform={`translate(${safe(fromX, 0)}, ${safe(fromY + 28, 0)})`}>

                                  {/* CODE (left) */}
                                  {wire.wireDetails?.fuse?.code && (
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
                                  {wire.wireDetails?.fuse?.ampere && (
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
                        // Select only this wire
                        setSelectedWires([i.toString()]);

                        // Close other popups and clear connector selection
                        setPopupComponent(null);
                        setPopupWire(null);
                        setPopupConnector(null);
                        setSelectedConnector(null); // Clear connector highlight
                        setSelectedDTC(null);
                        setPopupSplice(null);

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
                      {Math.abs(safe(fromX, 0) - safe(toX, 0)) < 5 ? (
                        // Straight vertical line when endpoints share same X
                        <line
                          x1={safe(fromX, 0)}
                          y1={safe(fromY, 0)}
                          x2={safe(toX, 0)}
                          y2={safe(toY, 0)}
                          fill="none"
                          stroke={selectedWires.includes(i.toString()) ? "#3390FF" : wire.color}
                          strokeWidth={selectedWires.includes(i.toString()) ? 6 : 3}
                          markerEnd="url(#arrowhead)"
                          pointerEvents="stroke"
                        />
                      ) : (
                        // Z-shape routing when X positions differ
                        <polyline
                          key={i}
                          points={`${safe(fromX, 0)},${safe(fromY, 0)} ${safe(fromX, 0)},${safe(intermediateY, 0)} ${safe(toX, 0)},${safe(intermediateY, 0)} ${safe(toX, 0)},${safe(toY, 0)}`}
                          fill="none"
                          stroke={selectedWires.includes(i.toString()) ? "#3390FF" : wire.color}
                          strokeWidth={selectedWires.includes(i.toString()) ? 6 : 3}
                          markerEnd="url(#arrowhead)"
                          pointerEvents="stroke"
                        />
                      )}
                    </g>
                    {/* <circle cx={toX} cy={toY} r={5} fill={wire.color}></circle> */}
                    {toComponent?.componentType?.toLowerCase() !== "splice" && (
                      <>
                        {isToTop ? (
                          <>
                            <TridentShape
                              cx={safe(toX, 0)}
                              cy={safe(toY - 15, 0)}
                              color={wire.color}
                              size={10}
                            />

                            {/* Fuse flipped when trident on top */}
                            {(toComponent?.category?.toLowerCase() === "supply" || toComponent?.label?.toLowerCase().includes("load center") || toComponent?.label?.toLowerCase().includes("fuse") || toComponent?.label?.toLowerCase().includes("transformator") || ((activeTab === "systems" || activeTab === "harnesses") && toComponent?.label?.toLowerCase().includes("load center"))) &&
                              wire.wireDetails?.fuse && (
                                <g
                                  transform={`translate(${safe(toX, 0)}, ${safe(toY - 10, 0)
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
                              transform={`translate(${safe(toX, 0)}, ${safe(toY + 15, 0)
                                }) scale(1, -1)`}
                            >
                              <TridentShape
                                cx={0}
                                cy={0}
                                color={wire.color}
                                size={10}
                              />
                            </g>

                            {(toComponent?.category?.toLowerCase() === "supply" || toComponent?.label?.toLowerCase().includes("load center") || toComponent?.label?.toLowerCase().includes("fuse") || toComponent?.label?.toLowerCase().includes("transformator") || ((activeTab === "systems" || activeTab === "harnesses") && toComponent?.label?.toLowerCase().includes("load center"))) &&
                              wire.wireDetails?.fuse && (
                                <FuseSymbol
                                  cx={safe(toX, 0)}
                                  cy={safe(toY + 35, 0)}
                                  size={14}
                                  color="black"
                                />
                              )}
                          </>
                        )}
                      </>
                    )}
                    {/* Cavity labels near connectors */}
                    <text
                      x={safe(fromX + 10, 0)}
                      y={safe(fromLabelY, 0)}
                      textAnchor="start"
                      fontSize="10"
                      alignmentBaseline="middle"
                      fill="black"
                      fontWeight="bold"
                    >
                      {wire.from.cavity}
                    </text>
                    <text
                      x={safe(toX + 10, 0)}
                      y={safe(toLabelY, 0)}
                      textAnchor="start"
                      fontSize="10"
                      alignmentBaseline="middle"
                      fill="black"
                      fontWeight="bold"
                    >
                      {wire.to.cavity}
                    </text>
                    {/* Wire identity label: circuit number centered on the wire */}
                    {wire.wireDetails?.circuitNumber && (
                      <g>
                        {(() => {
                          const isStraight = Math.abs(safe(fromX, 0) - safe(toX, 0)) < 5;
                          // Both straight and Z-shape: center label on the wire
                          const labelX = isStraight
                            ? safe(fromX, 0)                           // center on vertical line
                            : safe((fromX + toX) / 2, 0);              // center of horizontal segment
                          const labelY = isStraight
                            ? safe((fromY + toY) / 2, 0)               // vertical midpoint
                            : safe(intermediateY, 0);                   // horizontal segment level
                          
                          const labelText = wire.wireDetails.circuitNumber || "";
                          const labelWidth = Math.max(40, labelText.length * 6 + 12);

                          return (
                            <>
                              <rect
                                x={labelX - labelWidth / 2}
                                y={labelY - 7}
                                width={labelWidth}
                                height={14}
                                rx={3}
                                fill="white"
                                stroke={wire.color}
                                strokeWidth={1}
                                opacity={0.92}
                              />
                              <text
                                x={labelX}
                                y={labelY + 1}
                                textAnchor="middle"
                                fontSize="9"
                                alignmentBaseline="middle"
                                fill={
                                  ["white", "#fff", "#ffffff", "yellow", "#ffff00"].includes(wire.color?.toLowerCase() ?? "")
                                    ? "#333"
                                    : wire.color
                                }
                                fontWeight="bold"
                              >
                                {labelText}
                              </text>
                            </>
                          );
                        })()}
                      </g>
                    )}
                  </g>
                );
                return <g key={i}>{wireElement}</g>;
                });
              })()}

              </g>
            </svg>
            {/* 3. THE CONTEXT MENU UI */}
            {contextMenu && (
              <div style={{
                position: 'fixed', top: contextMenu.y, left: contextMenu.x,
                background: 'white', border: '1px solid #ccc', borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1000, padding: '8px 0', minWidth: '160px'
              }}>
                <div style={{ padding: '4px 16px', color: '#888', fontSize: '12px' }}>{contextMenu.component.label}</div>
                <button
                  onClick={() => {
                    if (onComponentRightClick) {
                      onComponentRightClick(contextMenu.component, { x: contextMenu.x, y: contextMenu.y });
                    } else {
                      console.error("❌ TRACE: onComponentRightClick prop is MISSING in Schematic.tsx!");
                    }
                    setContextMenu(null);
                  }}
                  style={{ width: '100%', padding: '10px', cursor: 'pointer' }}
                >
                  📍 Open Component
                </button>
              </div>
            )}

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
        <PopupSpliceDetails
          popupSplice={popupSplice}
          isLoading={popupSpliceLoading}
          error={popupSpliceError}
          onClose={(e) => {
            e.stopPropagation();
            setPopupSplice(null);
          }}
        />
        <PopupConnectorDetails
          popupConnector={popupConnector}
          selectedDTC={selectedDTC}
          dtcCode={dtcCode}
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

const spinnerStyle = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
const style = document.createElement("style");
style.textContent = spinnerStyle;
document.head.appendChild(style);
