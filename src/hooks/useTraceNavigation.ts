import { useState, useCallback } from 'react';
import { DashboardItem } from '../App';
import { SchematicData } from '../components/Schematic/SchematicTypes';

interface TraceState {
  tabId: string;
  itemCode: string;
  itemName: string;
  timestamp: number;
}

interface OriginalState {
  tab: string;
  selectedItem: DashboardItem | null;
  mergedSchematic: SchematicData | null;
}

export function useTraceNavigation() {
  const [isTraceMode, setIsTraceMode] = useState(false);
  const [traceStack, setTraceStack] = useState<TraceState[]>([]);
  const [originalState, setOriginalState] = useState<OriginalState>({
    tab: 'systems',
    selectedItem: null,
    mergedSchematic: null
  });

  const enterTrace = useCallback((tabId: string, itemCode: string, itemName: string, prevTab: string, prevSelectedItem: DashboardItem | null, prevMergedSchematic: SchematicData | null) => {
    // If we aren't already in trace mode, remember where we started
    if (!isTraceMode) {
      setOriginalState({
        tab: prevTab,
        selectedItem: prevSelectedItem,
        mergedSchematic: prevMergedSchematic
      });
    }
    
    setTraceStack([{ tabId, itemCode, itemName, timestamp: Date.now() }]);
    setIsTraceMode(true);
  }, [isTraceMode]);

  const exitTrace = useCallback(() => {
    setTraceStack([]);
    setIsTraceMode(false);
    return {
      tab: originalState.tab,
      selectedItem: originalState.selectedItem,
      mergedSchematic: originalState.mergedSchematic
    };
  }, [originalState]);

  const getBreadcrumb = useCallback(() => {
    if (!isTraceMode || traceStack.length === 0) return '';
    // Formats as: "Systems / Load center (X90)"
    const prefix = originalState.tab.charAt(0).toUpperCase() + originalState.tab.slice(1);
    return `${prefix} / ${traceStack[0].itemName}`;
  }, [isTraceMode, traceStack, originalState]);

  return {
    isTraceMode,
    enterTrace,
    exitTrace,
    getBreadcrumb,
    originalState
  };
}