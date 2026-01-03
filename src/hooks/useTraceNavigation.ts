import { useState, useCallback } from 'react';

export function useTraceNavigation() {
  const [isTraceMode, setIsTraceMode] = useState(false);
  const [traceStack, setTraceStack] = useState<any[]>([]);
  const [originalTab, setOriginalTab] = useState<string>('systems');

  const enterTrace = useCallback((tabId: string, itemCode: string, itemName: string, prevTab: string) => {
    // If we aren't already in trace mode, remember where we started
    if (!isTraceMode) {
      setOriginalTab(prevTab);
    }
    
    setTraceStack([{ tabId, itemCode, itemName, timestamp: Date.now() }]);
    setIsTraceMode(true);
  }, [isTraceMode]);

  const exitTrace = useCallback(() => {
    setTraceStack([]);
    setIsTraceMode(false);
    return originalTab;
  }, [originalTab]);

  const getBreadcrumb = useCallback(() => {
    if (!isTraceMode || traceStack.length === 0) return '';
    // Formats as: "Systems / Load center (X90)"
    const prefix = originalTab.charAt(0).toUpperCase() + originalTab.slice(1);
    return `${prefix} / ${traceStack[0].itemName}`;
  }, [isTraceMode, traceStack, originalTab]);

  return {
    isTraceMode,
    enterTrace,
    exitTrace,
    getBreadcrumb,
    originalTab
  };
}