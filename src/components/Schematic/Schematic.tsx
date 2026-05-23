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
import InfinitySymbol from "../symbols/InfinitySymbol";
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
import { useTheme } from "../ThemeContext";


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
  Palette,
} from "lucide-react";
import { schematicExportManager } from "./SchematicExport";



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
  onSpliceRightClick,
  highlightedElementId,
}: {
  data: SchematicData;
  scale?: number;
  activeTab?: string;
  dtcCode?: string;
  onComponentRightClick?: (component: ComponentType, pos: { x: number; y: number }) => void;
  onSpliceRightClick?: (splice: ComponentType) => void;
  highlightedElementId?: string | null;
}) {
  const { theme } = useTheme();
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
  const [hoveredWire, setHoveredWire] = useState<string | null>(null);
  const [useStandardColors, setUseStandardColors] = useState(false);

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
  // Improved logic: Wires are sorted such that "outer" wires (longer spans) 
  // get tracks further from the center, creating a nested "waterfall" look.
  const crossRowTracks = useMemo(() => {
    const tracks: { [index: number]: number } = {};
    if (!data.connections) return tracks;

    const wireInfo = data.connections.map((wire, i) => {
      const fromData = getComponentConnectorTupleFromConnectionPoint(wire.from, data);
      const toData = getComponentConnectorTupleFromConnectionPoint(wire.to, data);

      const fromComp = fromData[0];
      const fromConn = fromData[1];
      const toComp = toData[0];
      const toConn = toData[1];

      let fx = 0;
      if (fromComp && fromConn) {
        const fromConnectorX = getXForConnector(fromConn, fromComp);
        const fromConnectorWidth = getWidthForConnector(fromConn, fromComp);
        const fromConnectorCount = calculateCavityCountForConnector(fromConn, data);
        const connPoints = getConnectionPointsForConnector(fromConn, data, smartMasterIds);
        const pointIndex = connPoints.findIndex(p => p.wire === wire && p.side === "from");
        const fromConnectorOffset = fromConnectorCount === 1 ? fromConnectorWidth / 2 : (fromConnectorWidth / (fromConnectorCount + 1)) * (pointIndex + 1);
        fx = fromComp.shape === "circle" ? fromConnectorX + (fromConnectorWidth / 2) + ((pointIndex - (fromConnectorCount - 1) / 2) * 5) : fromConnectorX + fromConnectorOffset;
      }

      let tx = 0;
      if (toComp && toConn) {
        const toConnectorX = getXForConnector(toConn, toComp);
        const toConnectorWidth = getWidthForConnector(toConn, toComp);
        const toConnectorCount = calculateCavityCountForConnector(toConn, data);
        const connPointsTo = getConnectionPointsForConnector(toConn, data, smartMasterIds);
        const pointIndexTo = connPointsTo.findIndex(p => p.wire === wire && p.side === "to");
        const toConnectorOffset = toConnectorCount === 1 ? toConnectorWidth / 2 : (toConnectorWidth / (toConnectorCount + 1)) * (pointIndexTo + 1);
        tx = toComp.shape === "circle" ? toConnectorX + (toConnectorWidth / 2) + ((pointIndexTo - (toConnectorCount - 1) / 2) * 5) : toConnectorX + toConnectorOffset;
      }

      const isFromTop = smartMasterIds.has(fromComp?.id || "");
      const isToTop = smartMasterIds.has(toComp?.id || "");
      const isCrossRow = isFromTop !== isToTop;

      return { index: i, fx, tx, isCrossRow, isFromTop };
    });

    const crossRowWires = wireInfo.filter(w => w.isCrossRow);

    const ltr = crossRowWires.filter(w => w.fx <= w.tx);
    const rtl = crossRowWires.filter(w => w.fx > w.tx);

    // Precise sorting to eliminate crossings
    // For Right-Going: Rightmost source turns highest.
    ltr.sort((a, b) => {
      if (Math.abs(a.fx - b.fx) > 1) return b.fx - a.fx;
      return a.tx - b.tx;
    });

    // For Left-Going: Leftmost source turns highest.
    rtl.sort((a, b) => {
      if (Math.abs(a.fx - b.fx) > 1) return a.fx - b.fx;
      return b.tx - a.tx;
    });

    let trackNo = 1;
    ltr.forEach(w => tracks[w.index] = trackNo++);
    rtl.forEach(w => tracks[w.index] = trackNo++);

    return tracks;
  }, [data, smartMasterIds, sortedComponentIds]);

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

  // Selection logic removed focus effect to respect user position

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

    // --- Single master component: width spans all regular components ---
    if (masterComps.length === 1 && isMaster && regularComps.length > 0) {
      let totalRegularWidth = padding;
      regularComps.forEach(rc => {
        totalRegularWidth += getNaturalWidthForComponent(rc) + padding;
      });
      return Math.max(totalRegularWidth, 100);
    }

    // --- Equal-width layout: 2 master + 1 regular → single regular spans the full master row width ---
    if (masterComps.length === 2 && regularComps.length === 1 && !isMaster) {
      let totalMaster = padding;
      masterComps.forEach(mc => {
        totalMaster += getNaturalWidthForComponent(mc) + padding;
      });
      // Return total master row width minus one padding (for symmetry)
      return Math.max(totalMaster - padding, 100);
    }

    // --- Equal-width layout: 1 master + 1 regular → both components have the same width ---
    if (masterComps.length === 1 && regularComps.length === 1) {
      const masterWidth = getNaturalWidthForComponent(masterComps[0]);
      const regularWidth = getNaturalWidthForComponent(regularComps[0]);
      // Both components get the maximum of their natural widths
      return Math.max(masterWidth, regularWidth, 100);
    }

    return getNaturalWidthForComponent(component);
  }

  function getNaturalWidthForComponent(component: ComponentType): number {
    const nameWidth = componentNameWidths[component.id] ?? 100;
    // Cap the width contribution from the name to keep components standard-sized
    const cappedNameWidth = Math.min(nameWidth, 180);
    const defaultWidth = cappedNameWidth + padding;

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
    const isMaster = smartMasterIds.has(component.id);
    const masterComps = (data.components || []).filter(c => smartMasterIds.has(c.id));
    
    if (component.shape === "rectangle") {
      // Use sorted connectors for positioning
      const sortedConns = getSortedConnectors(component);
      let connectorCount = sortedConns.length;
      let index = sortedConns.findIndex((c) => c.id === connector.id);
      var connWidth = 0;
      
      // --- Single master component: expand connectors to fill width ---
      if (masterComps.length === 1 && isMaster && connectorCount > 0) {
        const componentWidth = getWidthForComponent(component);
        const totalConnectorSpacing = (connectorCount + 1) * connectorSpacing;
        const availableWidth = componentWidth - totalConnectorSpacing;
        const expandedConnectorWidth = availableWidth / connectorCount;
        
        connWidth = connectorSpacing;
        for (var i = 0; i < index; i++) {
          connWidth += expandedConnectorWidth + connectorSpacing;
        }
        return x + connWidth;
      }
      
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

    const isMaster = smartMasterIds.has(comp.id);
    const masterComps = (data.components || []).filter(c => smartMasterIds.has(c.id));
    const sortedConns = getSortedConnectors(comp);
    const connectorCount = sortedConns.length;

    // --- Single master component: expand connector width to fill available space ---
    if (masterComps.length === 1 && isMaster && connectorCount > 0 && comp.shape === "rectangle") {
      const componentWidth = getWidthForComponent(comp);
      const totalConnectorSpacing = (connectorCount + 1) * connectorSpacing;
      const availableWidth = componentWidth - totalConnectorSpacing;
      const expandedConnectorWidth = availableWidth / connectorCount;
      
      let interConnectionSpacing = 60;
      let connectionsBasedWidth =
        (connections.length + 1) * interConnectionSpacing;
      originalWidth = Math.max(
        connectionsBasedWidth,
        (connectorNameWidths[conn.id] ?? 50) + connectorNamePadding,
        100
      );
      
      // Return the expanded width, but ensure it's at least the original width
      return Math.max(expandedConnectorWidth, originalWidth);
    }

    if (comp.shape === "rectangle") {
      let interConnectionSpacing = 60;
      let connectionsBasedWidth =
        (connections.length + 1) * interConnectionSpacing;
      originalWidth = Math.max(
        connectionsBasedWidth,
        (connectorNameWidths[conn.id] ?? 50) + connectorNamePadding,
        100
      );
    } else {
      originalWidth = (connectorNameWidths[conn.id] ?? 50) + connectorNamePadding;
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

  return (
    <div
      ref={svgWrapperRef}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: isFullscreen ? "100vh" : "100%",
        background: "var(--bg-primary, #fafafa)",
        overflow: "hidden",
        minHeight: isFullscreen ? undefined : "100%",
        maxHeight: isFullscreen ? undefined : "100%",
      }}
    >
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <div
            className="schematic-toolbar"
            style={{
              position: "absolute",
              top: 4,
              left: 4,
              padding: 8,
              zIndex: 10,
              display: "flex",
              gap: 8,
              borderRadius: 8,
              flexShrink: 0,
            }}
          >
            <button
              onClick={handleRotate}
              title="Rotate view"
              className="schematic-toolbar-btn"
            >
              <RotateCcw size={18} />
            </button>
            <button
              onClick={() => {
                setRotation(0);
                resetView(svgWrapperRef, fitViewBox, setViewBox);
              }}
              title="Reset view"
              className="schematic-toolbar-btn"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={() => setUseStandardColors(!useStandardColors)}
              title={useStandardColors ? "Revert to Original Colors" : "Standardize Colors (Power=Red, Ground=Black, Signal=Blue)"}
              className={`schematic-toolbar-btn ${useStandardColors ? 'active-tool' : ''}`}
              style={{
                background: useStandardColors ? "var(--accent-primary)" : "transparent",
                color: useStandardColors ? "var(--text-on-accent)" : "inherit"
              }}
            >
              <Palette size={18} />
            </button>
            <button
              onClick={() => zoom("in", viewBox, setViewBox)}
              className="schematic-toolbar-btn"
            >
              <ZoomIn size={18} />
            </button>
            <button
              onClick={() => zoom("out", viewBox, setViewBox)}
              className="schematic-toolbar-btn"
            >
              <ZoomOut size={18} />
            </button>
            <button
              onClick={() =>
                isFullscreen ? exitFullscreen() : enterFullscreen(svgWrapperRef)
              }
              className="schematic-toolbar-btn"
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>

            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                padding: "0 12px",
                borderLeft: "1px solid var(--border-color)",
              }}
            >
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
                  className="schematic-toolbar-dropdown-btn"
                >
                  ▼
                </button>

                <div
                  id="export-menu"
                  className="schematic-export-menu"
                >
                  <button
                    onClick={() => {
                      handleExportPDF();
                      const menu = document.getElementById("export-menu");
                      if (menu) menu.style.display = "none";
                    }}
                    disabled={isExporting}
                    className="schematic-export-menu-btn"
                  >
                    📄 Export as PDF
                  </button>
                  <hr className="schematic-export-menu-hr" />
                  <button
                    onClick={() => {
                      handleExportImage();
                      const menu = document.getElementById("export-menu");
                      if (menu) menu.style.display = "none";
                    }}
                    disabled={isExporting}
                    className="schematic-export-menu-btn"
                  >
                    🖼️ Export as PNG
                  </button>
                  <hr className="schematic-export-menu-hr" />
                </div>
              </div>

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

              {isExporting && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0 12px",
                    color: "var(--text-secondary)",
                    fontSize: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      border: "2px solid var(--border-color)",
                      borderTop: "2px solid var(--accent-primary)",
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
              onDoubleClick={(e) => {
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
              onContextMenu={(e) => {
                // We let the current context menu logic run, but also clear selection if it's on the background
                if ((e.target as SVGElement).tagName === "svg") {
                  e.preventDefault();
                  setSelectedComponentIds([]);
                  setSelectedWires([]);
                  setSelectedConnector(null);
                  setPopupComponent(null);
                  setPopupConnector(null);
                  setPopupWire(null);
                  setPopupClosedManually(false);
                }
              }}
              onClick={(e) => {
                setContextMenu(null);
                // Do not clear wire selections here anymore. Panning uses single click/drag.
                // Left click on background will just clear popups but leave highlights intact.
                if ((e.target as SVGElement).tagName === "svg") {
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
              <defs>
                <filter id="highlight-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="10" result="blur" />
                  <feFlood floodColor="#007bff" result="color" />
                  <feComposite in="color" in2="blur" operator="in" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <style>
                  {`
                    @keyframes highlight-pulse {
                      0% { filter: drop-shadow(0 0 2px #007bff); stroke-width: 2; }
                      50% { filter: drop-shadow(0 0 8px #007bff); stroke-width: 4; }
                      100% { filter: drop-shadow(0 0 2px #007bff); stroke-width: 2; }
                    }
                    .element-highlighted {
                      animation: highlight-pulse 2s infinite;
                      stroke: #007bff !important;
                    }
                  `}
                </style>
              </defs>
              
              {(() => {
                const getWireColor = (wire: any, iStr: string) => {
                  if (selectedWires.includes(iStr)) return "#39FF14"; // Fluorescent green
                  if (selectedWires.length > 0) return "#cbd5e1"; // Dim grey when another is selected
                  if (useStandardColors) {
                    const toComp = (data.components || []).find((c) => c.id === wire.to?.componentId);
                    const toCategory = toComp?.category?.toLowerCase() || "";
                    const toLabel = toComp?.label?.toLowerCase() || "";
                    if (toCategory === "supply" || toCategory === "battery" || toLabel.includes("fuse") || toLabel.includes("power")) return "red";
                    if (toCategory === "ground" || toLabel.includes("ground") || toLabel.includes("gnd") || toLabel.includes("earth")) return "black";
                    return "#3b82f6"; // Blue for signal/other
                  }
                  // Original Colors
                  if (wire.color === "RD") return "red";
                  if (wire.color === "BLK") return "var(--text-primary, black)";
                  if (wire.color === "WH") return "#ccc";
                  return wire.color || "var(--text-primary, black)";
                };

                return (
                  <g transform={`rotate(${rotation} ${viewBox.x + viewBox.w / 2} ${viewBox.y + viewBox.h / 2})`}>

                {(data.components || []).map((comp, componentIndex) => {
                  const compX = safe(getXForComponent(comp), padding);
                  const compY = safe(getYForComponent(comp), padding);
                  const compW = safe(getWidthForComponent(comp), 100);
                  const compH = componentSize.height;
                  const compCenterX = safe(compX + compW / 2, padding);
                  const isTopSide = compY + compH / 2 < fitViewBox.y + fitViewBox.h / 2;

                  const titleX = compCenterX;
                  const titleY = safe(
                    compY +
                    (isTopSide
                      ? (comp.componentType?.toLowerCase() === "splice" ? compH - 10 : -compH / 2 - 25)
                      : compH +
                      (comp.componentType?.toLowerCase() === "splice" ? -30 : 55)),
                    padding
                  );

                  const fullLabel = comp.label + ` (${comp.id})`;
                  const maxCharsPerLine = 16;
                  const words = fullLabel.split(/\s+/);
                  const lines: string[] = [];
                  let currentLine = "";

                  words.forEach(word => {
                    if ((currentLine + " " + word).trim().length > maxCharsPerLine && currentLine !== "") {
                      lines.push(currentLine.trim());
                      currentLine = word;
                    } else {
                      currentLine = (currentLine + " " + word).trim();
                    }
                  });
                  if (currentLine) lines.push(currentLine);

                  const lineHeight = 22;
                  const totalTextHeight = (lines.length - 1) * lineHeight;

                  // Label visual dimensions
                  const labelVW = componentNameWidths[comp.id] ?? 100;
                  const labelVH = lines.length * lineHeight;

                  // Determine anchoring based on rotation and position
                  let anchor: "middle" | "start" | "end" = "middle";
                  if (rotation === 90) {
                    anchor = isTopSide ? "start" : "end";
                  } else if (rotation === 270) {
                    anchor = isTopSide ? "end" : "start";
                  }

                  // Label local bounds calculation
                  let tMinX, tMaxX, tMinY, tMaxY;
                  if (rotation === 0 || rotation === 180) {
                    tMinX = titleX - labelVW / 2;
                    tMaxX = titleX + labelVW / 2;
                    tMinY = titleY - labelVH / 2;
                    tMaxY = titleY + labelVH / 2;
                  } else if (rotation === 90) {
                    // Local Width = visual Height, Local Height = visual Width
                    tMinX = titleX - labelVH / 2;
                    tMaxX = titleX + labelVH / 2;
                    if (anchor === "start") {
                      tMinY = titleY - labelVW;
                      tMaxY = titleY;
                    } else {
                      tMinY = titleY;
                      tMaxY = titleY + labelVW;
                    }
                  } else { // rotation === 270
                    tMinX = titleX - labelVH / 2;
                    tMaxX = titleX + labelVH / 2;
                    if (anchor === "start") {
                      tMinY = titleY;
                      tMaxY = titleY + labelVW;
                    } else {
                      tMinY = titleY - labelVW;
                      tMaxY = titleY;
                    }
                  }

                  // Selection bounds in local space
                  let actualCompMinX = compX;
                  let actualCompMaxX = compX + compW;
                  let actualCompMinY = compY;
                  let actualCompMaxY = compY + compH;

                  if (comp.componentType?.toLowerCase() === "splice" || comp.label?.toLowerCase() === "splice") {
                    const scY = getSpliceCenterY(comp);
                    const sR = componentSize.height / 8;
                    actualCompMinY = scY - sR;
                    actualCompMaxY = scY + sR;
                    actualCompMinX = compCenterX - sR;
                    actualCompMaxX = compCenterX + sR;
                  }

                  const selectionMinX = Math.min(actualCompMinX, tMinX);
                  const selectionMaxX = Math.max(actualCompMaxX, tMaxX);
                  const selectionMinY = Math.min(actualCompMinY, tMinY);
                  const selectionMaxY = Math.max(actualCompMaxY, tMaxY);

                  const isSelected = selectedComponentIds.includes(comp.id) ||
                    comp.id === highlightedElementId ||
                    (popupSplice?.spliceId === comp.id);

                  return (
                    <g key={comp.id}>
                      {isSelected && (
                        <rect
                          x={selectionMinX - 5}
                          y={selectionMinY - 5}
                          width={selectionMaxX - selectionMinX + 10}
                          height={selectionMaxY - selectionMinY + 10}
                          fill="#3390FF"
                          opacity={0.3}
                          pointerEvents="none"
                        />
                      )}
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
                            onContextMenu={(e) => {
                              e.preventDefault();
                              if (onSpliceRightClick) {
                                onSpliceRightClick(comp);
                              }
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
                                  ? "yellow"                      // highlighted/expanded = yellow
                                  : popupSplice?.spliceId === comp.id
                                    ? "#ede9fe"                     // selected splice = purple-100
                                    : "white"
                              }
                              stroke={
                                comp.isHighlighted
                                  ? "#ca8a04"                     // expanded = gold border
                                  : popupSplice?.spliceId === comp.id
                                    ? "#2563eb"                    // selected splice = purple
                                    : "black"
                              }
                              strokeWidth={
                                comp.id === highlightedElementId ? 4 : (comp.isHighlighted ? 3 : (popupSplice?.spliceId === comp.id ? 2 : 1))
                              }
                              className={comp.id === highlightedElementId ? "element-highlighted" : ""}
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
                                  selectedComponentIds.includes(comp.id) || comp.id === highlightedElementId
                                    ? "#93c5fd"                     // selected/highlighted = blue-300
                                    : comp.isHighlighted
                                      ? "yellow"                     // duplicate = yellow
                                      : "lightblue"
                                }

                                //  Dynamic stroke
                                stroke={
                                  comp.isHighlighted
                                    ? "#dc2626"                     // duplicate = strong red border
                                    : (selectedComponentIds.includes(comp.id) || comp.id === highlightedElementId)
                                      ? "#2563eb"                     // selected/highlighted = strong blue
                                      : "black"
                                }

                                strokeWidth={
                                  comp.id === highlightedElementId ? 4 : (comp.isHighlighted ? 3 : 1)
                                }
                                className={comp.id === highlightedElementId ? "element-highlighted" : ""}

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
                              {/* selection highlight handled at component group level */}

                              {comp.category?.toLowerCase() === "sensor" && (
                                <Sensor
                                  x={safe(getXForComponent(comp) + 20, 50)} // left of rectangle
                                  y={safe(getYForComponent(comp) + 15, 50)} // top of rectangle
                                  width={safe(getWidthForComponent(comp) / 20, 5)} // match rectangle width
                                  height={componentSize.height / 2} // match rectangle height
                                  stroke="var(--text-primary, black)"
                                  strokeWidth={1}
                                />
                              )}

                              {comp.category?.toLowerCase() === "switch" && (
                                <ElectricalSwitch
                                  x={safe(getXForComponent(comp), padding)}
                                  y={safe(getYForComponent(comp), padding)}
                                  sizeMultiplier={0.5}
                                  stroke="var(--text-primary, black)"
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
                                  stroke="var(--text-primary, black)"
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
                                  stroke="var(--text-primary, black)"
                                  strokeWidth={1}
                                  fill="var(--text-primary, black)"
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
                                  color="var(--text-primary, black)"
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
                                  color="var(--text-primary, black)"
                                />
                              )}
                              {comp.category?.toLowerCase() === "ground" && (
                                <GroundSymbol
                                  x={safe(getXForComponent(comp), padding)} // adjust horizontal position
                                  y={safe(getYForComponent(comp) + 15, padding)} // adjust vertical position
                                  width={safe(getWidthForComponent(comp) / 2, 50)} // adjust width scaling
                                  height={safe(componentSize.height / 2, 30)} // adjust height scaling
                                  stroke="var(--text-primary, black)"
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
                      {(() => {
                        return (
                          <text
                            vectorEffect="non-scaling-stroke"
                            ref={(el) => {
                              componentNameRefs.current[comp.id] = el;
                            }}
                            x={titleX}
                            y={titleY}
                            textAnchor={anchor}
                            fontSize="20"
                            fontWeight="bold"
                            fill="var(--text-primary, black)"
                            transform={rotation !== 0 ? `rotate(${-rotation} ${titleX} ${titleY})` : undefined}
                          >
                            {lines.map((line, i) => (
                              <tspan
                                key={i}
                                x={titleX}
                                dy={i === 0 ? -(totalTextHeight / 2) : lineHeight}
                              >
                                {line}
                              </tspan>
                            ))}
                          </text>
                        );
                      })()}
                      {(comp.connectors || []).map((conn) => (
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
                                stroke="var(--text-primary, black)"
                                strokeWidth={conn.id === highlightedElementId ? 4 : 1}
                                strokeDasharray={
                                  componentIndex !== 0 ? "6,4" : undefined
                                }
                                onClick={(e) => handleConnectorClick(e, conn, comp)}
                                style={{ cursor: "pointer" }}
                                className={conn.id === highlightedElementId ? "element-highlighted" : ""}
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

                          {(() => {
                            let labelX = 0;
                            let labelY = 0;
                            let textAnchor: "start" | "middle" | "end" = "end";

                            const x_c = getXForConnector(conn, comp);
                            const y_c = getYForConnector(conn, comp);
                            const w_c = getWidthForConnector(conn, comp);
                            const h_c = connectorHeight;
                            const isMaster = smartMasterIds.has(comp.id);
                            const isSplice = comp.componentType?.toLowerCase() === "splice";

                            if (isSplice) {
                              labelX = x_c - (-10);
                              labelY = y_c + 13;
                              textAnchor = "end";
                            } else if (rotation === 270) {
                              // 270 degrees rotation (e.g. Master on Left, Regular on Right)
                              // "XD01" (master): top-left corner of connector, starts at boundary
                              // "XD-12" (regular): top-right corner of connector, ends at boundary
                              if (isMaster) {
                                labelX = x_c + w_c + 6;
                                labelY = y_c + 4;
                                textAnchor = "start";
                              } else {
                                labelX = x_c + w_c + 6;
                                labelY = (y_c + h_c) - 4;
                                textAnchor = "end";
                              }
                            } else if (rotation === 90) {
                              // 90 degrees rotation (e.g. Master on Right, Regular on Left)
                              // Master: top-right corner of connector, ends at boundary
                              // Regular: top-left corner of connector, starts at boundary
                              if (isMaster) {
                                labelX = x_c - 6;
                                labelY = (y_c + h_c) - 4;
                                textAnchor = "end";
                              } else {
                                labelX = x_c - 6;
                                labelY = y_c + 4;
                                textAnchor = "start";
                              }
                            } else if (rotation === 180) {
                              labelX = x_c + w_c / 2;
                              labelY = isMaster ? y_c - 6 : y_c + h_c + 12;
                              textAnchor = "middle";
                            } else {
                              // 0 degrees rotation (default layout)
                              labelX = x_c - 1;
                              labelY = y_c + 13;
                              textAnchor = "end";
                            }

                            labelX = safe(labelX, padding);
                            labelY = safe(labelY, padding);

                            return (
                              <text
                                ref={(el) => {
                                  connectorNameRefs.current[conn.id] = el;
                                }}
                                x={labelX}
                                y={labelY}
                                textAnchor={textAnchor}
                                dominantBaseline="middle"
                                fontSize="10"
                                fill="var(--text-primary, black)"
                                fontWeight="bold"
                                transform={rotation !== 0 ? `rotate(${-rotation} ${labelX} ${labelY})` : undefined}
                              >
                                {conn.label}
                              </text>
                            );
                          })()}
                        </g>
                      ))}
                    </g>
                  )
                })}

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
                    const totalConnections = data.connections?.length ?? 1;
                    const trackIndex = crossRowTracks[i] || (i + 1);

                    if (isFromMasterComponent && isToMasterComponent) {
                      // Same Row (Top): staggered U-shape below components
                      const offset = 30 + (trackIndex * 8);
                      intermediateY = Math.max(fromY, toY) + offset;
                    } else if (!isFromMasterComponent && !isToMasterComponent) {
                      // Same Row (Bottom): staggered U-shape above components
                      const offset = 30 + (trackIndex * 8);
                      intermediateY = Math.min(fromY, toY) - offset;
                    } else {
                      // Cross-Row (Top to Bottom or Bottom to Top)
                      // We use a very generous slot height (20px) and a large base offset (60px)
                      // to ensure absolutely no "touching" and maximum readability.
                      const slotHeight = 20;
                      const baseOffset = 60;

                      // If going from Top to Bottom, we start the waterfall with a clear gap below the connector
                      if (isFromMasterComponent) {
                        intermediateY = masterBusY + baseOffset + (slotHeight * trackIndex);
                      } else {
                        // If going from Bottom to Top, we start the waterfall with a clear gap above the connector
                        intermediateY = regularBusY - baseOffset - (slotHeight * trackIndex);
                      }
                    }


                    // Calculate the positions where the tridents should be
                    const fromTridentY = fromY < toY ? intermediateY : fromY - 10; // lift if needed
                    const toTridentY = fromY < toY ? toY : intermediateY + 10;

                    let isFromTop = isFromMasterComponent;
                    let isToTop = isToMasterComponent;

                    let fromLabelY = isFromTop ? fromY + 12 : fromY - 12;
                    let toLabelY = isToTop ? toY + 12 : toY - 12;
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
                                    <g transform={`translate(${safe(fromX, 0)}, ${safe(fromY - 45, 0)}) ${rotation !== 0 ? `rotate(${-rotation})` : ""}`}>

                                      {/* LEFT NORMAL TEXT (not flipped) */}
                                      {wire.wireDetails?.fuse?.code && (
                                        <text
                                          x={-10}
                                          y={4}
                                          textAnchor="end"
                                          fontSize="10"
                                          fill="var(--text-primary, black)"
                                          fontWeight="bold"
                                          alignmentBaseline="middle"
                                        >
                                          {wire.wireDetails.fuse.code}
                                        </text>
                                      )}

                                      {/* FLIPPED SYMBOL ONLY */}
                                      <g transform="scale(1, -1)">
                                        <FuseSymbol cx={0} cy={0} size={12} color="var(--text-primary, black)" />
                                      </g>

                                      {/* RIGHT NORMAL TEXT (not flipped) */}
                                      {wire.wireDetails?.fuse?.ampere && (
                                        <text
                                          x={10}
                                          y={4}
                                          textAnchor="start"
                                          fontSize="10"
                                          fill="var(--text-primary, black)"
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
                                    <g transform={`translate(${safe(fromX, 0)}, ${safe(fromY + 28, 0)}) ${rotation !== 0 ? `rotate(${-rotation})` : ""}`}>

                                      {/* CODE (left) */}
                                      {wire.wireDetails?.fuse?.code && (
                                        <text
                                          x={-22}
                                          y={4}
                                          textAnchor="end"
                                          fontSize="10"
                                          fill="var(--text-primary, black)"
                                          fontWeight="bold"
                                          alignmentBaseline="middle"
                                        >
                                          {wire.wireDetails.fuse.code}
                                        </text>
                                      )}

                                      {/* Fuse Icon (center) */}
                                      <FuseSymbol cx={0} cy={0} size={12} color="var(--text-primary, black)" />

                                      {/* AMP (right) */}
                                      {wire.wireDetails?.fuse?.ampere && (
                                        <text
                                          x={22}
                                          y={4}
                                          textAnchor="start"
                                          fontSize="10"
                                          fill="var(--text-primary, black)"
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
                          onMouseEnter={() => setHoveredWire(i.toString())}
                          onMouseLeave={() => setHoveredWire(null)}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent deselecting everything else
                            setSelectedComponentIds([]);
                            
                            // Toggle this wire in selection
                            setSelectedWires(prev => 
                              prev.includes(i.toString()) 
                                ? prev.filter(w => w !== i.toString())
                                : [...prev, i.toString()]
                            );

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
                          {(() => {
                            const fx = safe(fromX, 0);
                            const fy = safe(fromY, 0);
                            const tx = safe(toX, 0);
                            const ty = safe(toY, 0);
                            const iy = safe(intermediateY, 0);
                            const r = 6; // compact corner radius

                            if (Math.abs(fx - tx) < 5) {
                              // Straight vertical line
                              return (
                                <line
                                  x1={fx}
                                  y1={fy}
                                  x2={tx}
                                  y2={ty}
                                  fill="none"
                                  opacity={selectedWires.length > 0 && !selectedWires.includes(i.toString()) ? 0.3 : 1}
                                  stroke={getWireColor(wire, i.toString())}
                                  strokeWidth={
                                    selectedWires.includes(i.toString())
                                      ? 6
                                      : hoveredWire === i.toString()
                                        ? 8
                                        : 4
                                  }
                                  markerEnd="url(#arrowhead)"
                                  pointerEvents="stroke"
                                  filter={
                                    hoveredWire === i.toString() ||
                                      selectedWires.includes(i.toString())
                                      ? "url(#wire-glow)"
                                      : undefined
                                  }
                                />
                              );
                            }

                            // Orthogonal path with rounded corners (Z-shape)
                            // Points: (fx, fy) -> (fx, iy) -> (tx, iy) -> (tx, ty)

                            // Direction from Y1 to IY
                            const dirY1 = iy > fy ? 1 : -1;
                            // Direction from FX to TX
                            const dirX = tx > fx ? 1 : -1;
                            // Direction from IY to TY
                            const dirY2 = ty > iy ? 1 : -1;

                            const d = `
                              M ${fx} ${fy}
                              L ${fx} ${iy - r * dirY1}
                              Q ${fx} ${iy} ${fx + r * dirX} ${iy}
                              L ${tx - r * dirX} ${iy}
                              Q ${tx} ${iy} ${tx} ${iy + r * dirY2}
                              L ${tx} ${ty}
                            `;

                            return (
                              <path
                                d={d}
                                fill="none"
                                opacity={selectedWires.length > 0 && !selectedWires.includes(i.toString()) ? 0.3 : 1}
                                stroke={getWireColor(wire, i.toString())}
                                strokeWidth={
                                  selectedWires.includes(i.toString())
                                    ? 6
                                    : hoveredWire === i.toString()
                                      ? 8
                                      : 4
                                } markerEnd="url(#arrowhead)"
                                pointerEvents="stroke"
                                filter={
                                  hoveredWire === i.toString() ||
                                    selectedWires.includes(i.toString())
                                    ? "url(#wire-glow)"
                                    : undefined
                                }
                              />
                            );
                          })()}
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
                                        }) scale(1, -1) ${rotation !== 0 ? `rotate(${-rotation})` : ""}`}
                                    >
                                      <FuseSymbol
                                        cx={0}
                                        cy={30}
                                        size={14}
                                        color="var(--text-primary, black)"
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
                                    <g transform={`translate(${safe(toX, 0)}, ${safe(toY + 35, 0)}) ${rotation !== 0 ? `rotate(${-rotation})` : ""}`}>
                                      <FuseSymbol
                                        cx={0}
                                        cy={0}
                                        size={14}
                                        color="var(--text-primary, black)"
                                      />
                                    </g>
                                  )}
                              </>
                            )}
                          </>
                        )}
                        {/* Cavity labels near connectors */}
                        {(() => {
                          const fX = safe(fromX + 18, 0); // Shift further right to avoid trident
                          const fY = safe(fromLabelY, 0);
                          const tX = safe(toX + 18, 0); // Shift further right to avoid trident
                          const tY = safe(toLabelY, 0);

                          return (
                            <>
                              <text
                                x={fX}
                                y={fY}
                                textAnchor="start"
                                fontSize="10"
                                alignmentBaseline="middle"
                                fill="var(--text-primary, black)"
                                stroke="var(--bg-secondary, white)"
                                strokeWidth="3px"
                                paintOrder="stroke fill"
                                fontWeight="bold"
                                transform={rotation !== 0 ? `rotate(${-rotation} ${fX} ${fY})` : undefined}
                              >
                                {wire.from.cavity}
                              </text>
                              
                              <text
                                x={tX}
                                y={tY}
                                textAnchor="start"
                                fontSize="10"
                                alignmentBaseline="middle"
                                fill="var(--text-primary, black)"
                                stroke="var(--bg-secondary, white)"
                                strokeWidth="3px"
                                paintOrder="stroke fill"
                                fontWeight="bold"
                                transform={rotation !== 0 ? `rotate(${-rotation} ${tX} ${tY})` : undefined}
                              >
                                {wire.to.cavity}
                              </text>
                            </>
                          );
                        })()}
                        {/* Wire identity label: circuit number centered on the wire */}
                        {wire.wireDetails?.circuitNumber && (
                          <g transform={rotation !== 0 ? `rotate(${-rotation} ${(() => {
                            const isStraight = Math.abs(safe(fromX, 0) - safe(toX, 0)) < 5;
                            return isStraight ? safe(fromX, 0) : safe((fromX + toX) / 2, 0);
                          })()} ${(() => {
                            const isStraight = Math.abs(safe(fromX, 0) - safe(toX, 0)) < 5;
                            return isStraight ? safe((fromY + toY) / 2, 0) : safe(intermediateY, 0);
                          })()})` : undefined}>
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

                {/* Render Infinity Symbols for CAN wire pairs sequentially */}
                {(() => {
                  const elements: JSX.Element[] = [];

                  interface CanEndpoint {
                    wire: ConnectionType;
                    side: "from" | "to";
                  }

                  const canEndpoints: CanEndpoint[] = [];
                  (data.connections || []).forEach(w => {
                    if (w.wireDetails?.from?.devName?.toUpperCase().includes("PIN CAN")) {
                      canEndpoints.push({ wire: w, side: "from" });
                    }
                    if (w.wireDetails?.to?.devName?.toUpperCase().includes("PIN CAN")) {
                      canEndpoints.push({ wire: w, side: "to" });
                    }
                  });

                  const getWireXAndY = (wire: ConnectionType, side: "from" | "to") => {
                    const connPoint = side === "from" ? wire.from : wire.to;
                    const comp = (data.components || []).find(c => c.id === connPoint.componentId);
                    if (!comp) return { x: 0, y: 0, isMasterComponent: false };
                    const conn = comp.connectors?.find(c => c.id === connPoint.connectorId);
                    if (!conn) return { x: 0, y: 0, isMasterComponent: false };

                    const isMasterComponent = smartMasterIds.has(comp.id);
                    const connectorX = getXForConnector(conn, comp);
                    const connectorWidth = getWidthForConnector(conn, comp);
                    const connectorCount = calculateCavityCountForConnector(conn, data);
                    const connPoints = getConnectionPointsForConnector(conn, data, smartMasterIds);

                    const pointIndex = connPoints.findIndex(p => p.wire === wire && p.side === side);
                    let x = connectorX + connectorWidth / 2;
                    if (pointIndex !== -1) {
                      const offset = connectorCount === 1
                        ? connectorWidth / 2
                        : (connectorWidth / (connectorCount + 1)) * (pointIndex + 1);
                      x = comp.shape === "circle"
                        ? connectorX + (connectorWidth / 2) + ((pointIndex - (connectorCount - 1) / 2) * 5)
                        : connectorX + offset;
                    }

                    const y = isMasterComponent ? getYForConnector(conn, comp) + 20 : getYForConnector(conn, comp);
                    return { x, y, isMasterComponent };
                  };

                  for (let i = 0; i < canEndpoints.length - 1; i += 2) {
                    const ep1 = canEndpoints[i];
                    const ep2 = canEndpoints[i + 1];
                    const pos1 = getWireXAndY(ep1.wire, ep1.side);
                    const pos2 = getWireXAndY(ep2.wire, ep2.side);

                    if (!pos1.x || !pos2.x) continue;

                    const cx = (pos1.x + pos2.x) / 2;
                    // If pos1 is master, the connector is at the top, wire goes down. Place symbol below connector.
                    // If pos1 is regular, connector is at the bottom, wire goes up. Place symbol above connector.
                    const cy = pos1.isMasterComponent
                      ? Math.max(pos1.y, pos2.y) + 25
                      : Math.min(pos1.y, pos2.y) - 25;

                    const width = Math.max(Math.abs(pos2.x - pos1.x), 10);
                    // Fixed height to prevent stretching into giant ellipses
                    const height = 12;

                    elements.push(
                      <InfinitySymbol
                        key={`can-pair-${i}`}
                        cx={cx}
                        cy={cy}
                        width={width}
                        height={height}
                        color="var(--text-primary, black)"
                      />
                    );
                  }

                  return elements;
                })()}

                </g>
              );
            })()}

              {useStandardColors && (
                <g transform={`translate(${viewBox.x + 20}, ${viewBox.y + 20})`}>
                  <rect x="0" y="0" width="160" height="90" fill="var(--bg-secondary, white)" opacity="0.9" rx="8" stroke="var(--border-color, #ccc)" />
                  <text x="10" y="20" fontSize="12" fontWeight="bold" fill="var(--text-primary, black)">Functional Colors</text>
                  
                  <line x1="10" y1="35" x2="30" y2="35" stroke="red" strokeWidth="4" />
                  <text x="40" y="39" fontSize="11" fill="var(--text-primary, black)">Power / Supply</text>
                  
                  <line x1="10" y1="55" x2="30" y2="55" stroke="black" strokeWidth="4" />
                  <text x="40" y="59" fontSize="11" fill="var(--text-primary, black)">Ground / Earth</text>
                  
                  <line x1="10" y1="75" x2="30" y2="75" stroke="#3b82f6" strokeWidth="4" />
                  <text x="40" y="79" fontSize="11" fill="var(--text-primary, black)">Signal / Bus / Other</text>
                </g>
              )}
            </svg>
            {/* 3. THE CONTEXT MENU UI */}
            {contextMenu && (
              <div style={{
                position: 'fixed', top: contextMenu.y, left: contextMenu.x,
                background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px',
                boxShadow: 'var(--card-shadow)', zIndex: 1000, padding: '8px 0', minWidth: '160px'
              }}>
                <div style={{ padding: '4px 16px', color: 'var(--text-secondary)', fontSize: '12px' }}>{contextMenu.component.label}</div>
                <button
                  onClick={() => {
                    if (onComponentRightClick) {
                      onComponentRightClick(contextMenu.component, { x: contextMenu.x, y: contextMenu.y });
                    } else {
                      console.error("❌ TRACE: onComponentRightClick prop is MISSING in Schematic.tsx!");
                    }
                    setContextMenu(null);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    cursor: 'pointer',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    fontSize: '14px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
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
          dtcCode={dtcCode}
        />
        <PopupWireDetails
          popupWire={popupWire}
          onClose={(e) => {
            e.stopPropagation();
            setSelectedWires([]);
            setPopupWire(null);
          }}
          dtcCode={dtcCode}
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
