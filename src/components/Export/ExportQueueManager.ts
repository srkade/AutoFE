import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import { SchematicData } from "../Schematic/SchematicTypes";
import { schematicExportManager } from "../Schematic/SchematicExport";
import logoImage from '../../assets/Images/logo.png';

export interface ExportQueueItem {
  id: string;
  code: string;
  name: string;
  type: string;
  schematicData: SchematicData;
  activeTab: string;
  dtcCode?: string;
}

export interface ExportProgress {
  current: number;
  total: number;
  currentItem: string;
  status: 'processing' | 'capturing' | 'generating' | 'complete' | 'error';
}

export type ExportProgressCallback = (progress: ExportProgress) => void;

class ExportQueueManager {
  private queue: ExportQueueItem[] = [];
  private isProcessing: boolean = false;
  private progressCallback: ExportProgressCallback | null = null;
  private abortController: AbortController | null = null;

  setProgressCallback(callback: ExportProgressCallback) {
    this.progressCallback = callback;
  }

  addToQueue(items: ExportQueueItem[]) {
    this.queue.push(...items);
  }

  clearQueue() {
    this.queue = [];
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  private updateProgress(progress: ExportProgress) {
    if (this.progressCallback) {
      this.progressCallback(progress);
    }
  }

  private async renderHiddenSchematic(
    item: ExportQueueItem
  ): Promise<{ container: HTMLElement; root: any }> {
    return new Promise((resolve, reject) => {
      try {
        // Dynamically import React, ReactDOM, ThemeProvider, and Schematic
        import('react').then(React => {
          import('react-dom/client').then(ReactDOM => {
            import('../ThemeContext').then(ThemeContextModule => {
              const ThemeProvider = ThemeContextModule.ThemeProvider;
              
              import('../Schematic/Schematic').then(SchematicModule => {
                const Schematic = SchematicModule.default;

                // Create a temporary container for the schematic
                const tempContainer = document.createElement('div');
                tempContainer.id = `export-${item.id}`;
                tempContainer.style.position = 'fixed';
                tempContainer.style.left = '-9999px';
                tempContainer.style.top = '-9999px';
                tempContainer.style.width = '2000px';
                tempContainer.style.height = '1500px';
                tempContainer.style.visibility = 'hidden';
                tempContainer.style.pointerEvents = 'none';
                tempContainer.style.zIndex = '-9999';
                tempContainer.style.background = 'white';

                // Create a wrapper div for the schematic - this is what schematicExportManager expects
                const schematicWrapper = document.createElement('div');
                schematicWrapper.id = 'export';
                schematicWrapper.style.width = '100%';
                schematicWrapper.style.height = '100%';
                schematicWrapper.style.position = 'relative';
                schematicWrapper.style.overflow = 'hidden';

                tempContainer.appendChild(schematicWrapper);
                document.body.appendChild(tempContainer);

                // Create a React root and render the Schematic component wrapped in ThemeProvider
                const root = ReactDOM.createRoot(schematicWrapper);
                
                root.render(
                  React.createElement(
                    ThemeProvider,
                    null,
                    React.createElement(Schematic, {
                      key: item.id,
                      data: item.schematicData,
                      activeTab: item.activeTab,
                      dtcCode: item.dtcCode,
                      scale: 1,
                      isExportMode: true
                    })
                  )
                );

                // Wait for the schematic to render
                let attempts = 0;
                const maxAttempts = 50; // 5 seconds max wait

                const checkRenderComplete = () => {
                  const svg = schematicWrapper.querySelector('svg');
                  if (svg) {
                    const hasContent = svg.children.length > 0;
                    if (hasContent) {
                      setTimeout(() => {
                        resolve({ container: tempContainer, root });
                      }, 1000); // Extra time for calculations
                    } else if (attempts < maxAttempts) {
                      attempts++;
                      setTimeout(checkRenderComplete, 100);
                    } else {
                      resolve({ container: tempContainer, root });
                    }
                  } else if (attempts < maxAttempts) {
                    attempts++;
                    setTimeout(checkRenderComplete, 100);
                  } else {
                    resolve({ container: tempContainer, root });
                  }
                };

                setTimeout(checkRenderComplete, 200);
              }).catch(err => reject(err));
            }).catch(err => reject(err));
          }).catch(err => reject(err));
        }).catch(err => reject(err));
      } catch (error) {
        reject(error);
      }
    });
  }

  private createSVGFromSchematicData(data: SchematicData): SVGSVGElement {
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("width", "2000");
    svgElement.setAttribute("height", "1500");
    svgElement.setAttribute("viewBox", "0 0 2000 1500");

    // Add white background
    const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bgRect.setAttribute("width", "100%");
    bgRect.setAttribute("height", "100%");
    bgRect.setAttribute("fill", "white");
    svgElement.appendChild(bgRect);

    // Add title
    const titleText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    titleText.setAttribute("x", "20");
    titleText.setAttribute("y", "40");
    titleText.setAttribute("font-size", "24");
    titleText.setAttribute("font-weight", "bold");
    titleText.setAttribute("font-family", "Arial");
    titleText.textContent = data.name || 'Schematic';
    svgElement.appendChild(titleText);

    // Calculate component positions
    const padding = 20;
    const componentWidth = 120;
    const componentHeight = 80;
    const componentsPerRow = 5;
    
    data.components?.forEach((comp, index) => {
      const row = Math.floor(index / componentsPerRow);
      const col = index % componentsPerRow;
      
      const x = padding + col * (componentWidth + padding);
      const y = 80 + row * (componentHeight + padding + 50);

      // Component rectangle
      const compRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      compRect.setAttribute("x", x.toString());
      compRect.setAttribute("y", y.toString());
      compRect.setAttribute("width", componentWidth.toString());
      compRect.setAttribute("height", componentHeight.toString());
      compRect.setAttribute("fill", "#e7f3ff");
      compRect.setAttribute("stroke", "#007bff");
      compRect.setAttribute("stroke-width", "2");
      compRect.setAttribute("rx", "4");
      svgElement.appendChild(compRect);

      // Component label
      const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      labelText.setAttribute("x", (x + 10).toString());
      labelText.setAttribute("y", (y + 25).toString());
      labelText.setAttribute("font-size", "12");
      labelText.setAttribute("font-weight", "bold");
      labelText.setAttribute("font-family", "Arial");
      labelText.textContent = comp.label || comp.id;
      svgElement.appendChild(labelText);

      // Component category
      const categoryText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      categoryText.setAttribute("x", (x + 10).toString());
      categoryText.setAttribute("y", (y + 45).toString());
      categoryText.setAttribute("font-size", "10");
      categoryText.setAttribute("font-family", "Arial");
      categoryText.textContent = comp.category || '';
      svgElement.appendChild(categoryText);

      // Connectors
      comp.connectors?.forEach((conn, connIndex) => {
        const connX = x + 20 + connIndex * 30;
        const connRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        connRect.setAttribute("x", connX.toString());
        connRect.setAttribute("y", (y + componentHeight - 10).toString());
        connRect.setAttribute("width", "20");
        connRect.setAttribute("height", "10");
        connRect.setAttribute("fill", "#90EE90");
        connRect.setAttribute("stroke", "#28a745");
        connRect.setAttribute("stroke-width", "1");
        svgElement.appendChild(connRect);
      });
    });

    // Add connections (wires)
    data.connections?.forEach((conn) => {
      const fromComp = data.components?.find(c => c.id === conn.from.componentId);
      const toComp = data.components?.find(c => c.id === conn.to.componentId);
      
      if (fromComp && toComp) {
        const fromIndex = data.components?.indexOf(fromComp) || 0;
        const toIndex = data.components?.indexOf(toComp) || 0;
        
        const fromRow = Math.floor(fromIndex / componentsPerRow);
        const fromCol = fromIndex % componentsPerRow;
        const toRow = Math.floor(toIndex / componentsPerRow);
        const toCol = toIndex % componentsPerRow;
        
        const fromX = padding + fromCol * (componentWidth + padding) + componentWidth / 2;
        const fromY = 80 + fromRow * (componentHeight + padding + 50) + componentHeight;
        const toX = padding + toCol * (componentWidth + padding) + componentWidth / 2;
        const toY = 80 + toRow * (componentHeight + padding + 50);
        
        // Draw wire with color
        const wire = document.createElementNS("http://www.w3.org/2000/svg", "line");
        wire.setAttribute("x1", fromX.toString());
        wire.setAttribute("y1", fromY.toString());
        wire.setAttribute("x2", toX.toString());
        wire.setAttribute("y2", toY.toString());
        wire.setAttribute("stroke", conn.color || '#000000');
        wire.setAttribute("stroke-width", "2");
        svgElement.appendChild(wire);
      }
    });

    return svgElement;
  }

  private async captureSchematicFromSVG(
    svgElement: SVGSVGElement,
    resolution: number = 300,
    zoom: number = 1
  ): Promise<string> {
    try {
      // Serialize SVG to string
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      // Load SVG into canvas
      const img = new Image();
      img.crossOrigin = "anonymous";

      return await new Promise<string>((resolve, reject) => {
        img.onload = () => {
          const scale = (resolution / 96) * zoom;
          const canvas = document.createElement("canvas");
          canvas.width = 2000 * scale;
          canvas.height = 1500 * scale;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            URL.revokeObjectURL(url);
            reject(new Error("Could not get 2D context"));
            return;
          }

          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);

          const imageData = canvas.toDataURL("image/png", 1.0);
          resolve(imageData);
        };

        img.onerror = (e) => {
          URL.revokeObjectURL(url);
          reject(new Error("Failed to load SVG image: " + e));
        };
        img.src = url;
      });
    } catch (error) {
      console.error("Error capturing schematic SVG:", error);
      throw error;
    }
  }

  async processQueue(
    exportType: 'pdf' | 'images',
    resolution: number = 300,
    zoom: number = 1
  ): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    this.abortController = new AbortController();

    const pdf = exportType === 'pdf' ? new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    }) as any : null;

    const capturedImages: string[] = [];

    try {
      for (let i = 0; i < this.queue.length; i++) {
        if (this.abortController.signal.aborted) {
          throw new Error('Export aborted');
        }

        const item = this.queue[i];
        
        this.updateProgress({
          current: i + 1,
          total: this.queue.length,
          currentItem: item.name,
          status: 'processing'
        });

        // Render the schematic in hidden container
        const { container: renderContainer, root } = await this.renderHiddenSchematic(item);
        
        this.updateProgress({
          current: i + 1,
          total: this.queue.length,
          currentItem: item.name,
          status: 'capturing'
        });

        // Capture the schematic using the existing schematicExportManager
        const imageData = await schematicExportManager.captureSchematicDiv(resolution, zoom);
        capturedImages.push(imageData);

        // Clean up the React root and container
        root.unmount();
        document.body.removeChild(renderContainer);

        this.updateProgress({
          current: i + 1,
          total: this.queue.length,
          currentItem: item.name,
          status: 'generating'
        });

        if (exportType === 'pdf' && pdf) {
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const margin = 10;

          if (i > 0) {
            pdf.addPage();
          }

          let yPosition = margin;

          // Add title
          pdf.setFontSize(18);
          pdf.setFont(undefined, "bold");
          pdf.text(`${item.type}: ${item.name}`, margin, yPosition);
          yPosition += 8;

          // Add metadata
          pdf.setFontSize(10);
          pdf.setFont(undefined, "normal");
          pdf.text(
            `Export Date: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}`,
            margin,
            yPosition
          );
          yPosition += 5;
          pdf.text(
            `Code: ${item.code} | Type: ${item.type}${item.dtcCode ? ` | DTC: ${item.dtcCode}` : ''}`,
            margin,
            yPosition
          );
          yPosition += 10;

          // Add schematic image and all technical details
          yPosition = await this.addSchematicDetailsToPDF(
            pdf,
            item,
            imageData,
            yPosition,
            pageWidth,
            pageHeight,
            margin
          );
        }
      }

      this.updateProgress({
        current: this.queue.length,
        total: this.queue.length,
        currentItem: 'Complete',
        status: 'complete'
      });

      // Save the output
      if (exportType === 'pdf' && pdf) {
        pdf.save('schematic-export.pdf');
      } else if (exportType === 'images') {
        // Download individual images
        capturedImages.forEach((imageData, index) => {
          const item = this.queue[index];
          const link = document.createElement('a');
          link.href = imageData;
          link.download = `${item.code}-${item.name}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      }

    } catch (error) {
      console.error('Export failed:', error);
      this.updateProgress({
        current: this.queue.length,
        total: this.queue.length,
        currentItem: 'Error',
        status: 'error'
      });
      throw error;
    } finally {
      this.isProcessing = false;
      this.abortController = null;
    }
  }

  private calculateConnectorConnectionCount(data: SchematicData): { [id: string]: number } {
    const connectionCount: { [id: string]: number } = {};
    
    (data.connections ?? []).forEach((conn) => {
      if (conn.from?.connectorId) {
        connectionCount[conn.from.connectorId] = (connectionCount[conn.from.connectorId] || 0) + 1;
      }
      if (conn.to?.connectorId) {
        connectionCount[conn.to.connectorId] = (connectionCount[conn.to.connectorId] || 0) + 1;
      }
    });
    
    return connectionCount;
  }

  private extractComponentDetails(
    data: SchematicData,
    connectorConnectionCount: { [id: string]: number }
  ): any[] {
    return (data.components ?? []).map((comp) => ({
      id: comp.id ?? "",
      label: comp.label ?? "",
      category: comp.category ?? "",
      engineeringName: comp.engineering_component_name ?? "N/A",
      manufacturer: comp.manufacturer ?? "N/A",
      partNumber: comp.primary_part_number ?? "N/A",
      harnessName: comp.harness_name ?? "N/A",
      connectorPartNumber: comp.connector_part_number ?? "N/A",
      gender: comp.gender ?? "N/A",
      connectors: (comp.connectors ?? []).map((conn) => ({
        id: conn.id ?? "",
        label: conn.label ?? "",
        connectionCount: connectorConnectionCount[conn.id] ?? 0,
      })),
    }));
  }

  private extractWireDetails(data: SchematicData): any[] {
    return (data.connections ?? []).map((wire) => {
      const wireDetails = wire.wireDetails ?? {};
      const from = (wireDetails as any)?.from ?? {};
      const to = (wireDetails as any)?.to ?? {};

      return {
        circuitNumber: (wireDetails as any)?.circuitNumber ?? "",
        wireColor: (wireDetails as any)?.wireColor ?? wire.color ?? "",
        wireSize: (wireDetails as any)?.wireSize ?? 0,
        wireLength: (wireDetails as any)?.wireLength ?? 0,
        wireType: (wireDetails as any)?.wireType ?? "",
        from: {
          component: from.devName ?? wire.from?.componentId ?? "",
          connector: from.connectorNumber ?? wire.from?.connectorId ?? "",
          cavity: from.cavity ?? wire.from?.cavity ?? "",
          partNumber: from.connPartNumber ?? "",
        },
        to: {
          component: to.devName ?? wire.to?.componentId ?? "",
          connector: to.connectorNumber ?? wire.to?.connectorId ?? "",
          cavity: to.cavity ?? wire.to?.cavity ?? "",
          partNumber: to.connPartNumber ?? "",
        },
        twistId: (wireDetails as any)?.twistId ?? "",
        shieldId: (wireDetails as any)?.shieldId ?? "",
        mark: (wireDetails as any)?.mark ?? "",
      };
    });
  }

  private extractConnectorDetails(data: SchematicData): any[] {
    const connectorDetails: any[] = [];
    const processedConnectors = new Set<string>();

    (data.components ?? []).forEach((comp) => {
      (comp.connectors ?? []).forEach((conn) => {
        const connKey = `${comp.id}-${conn.id}`;
        if (!processedConnectors.has(connKey)) {
          connectorDetails.push({
            componentCode: comp.label ?? comp.id ?? "",
            connectorCode: conn.label ?? conn.id ?? "",
            label: conn.label ?? "",
            harnessName: comp.harness_name ?? "N/A",
            partNumber: comp.connector_part_number ?? "N/A",
            gender: (conn as any)?.gender ?? comp.gender ?? "N/A",
            cavityCount: this.calculateCavityCount(conn, data),
            color: (conn as any)?.color ?? "",
            connectorType: comp.connector_type ?? "N/A",
            manufacturer: comp.manufacturer ?? "N/A",
            terminalPartNumber: (conn as any)?.terminal_part_number ?? "",
            sealPartNumber: (conn as any)?.seal_part_number ?? "",
          });
          processedConnectors.add(connKey);
        }
      });
    });

    return connectorDetails;
  }

  private calculateCavityCount(connector: any, data: SchematicData): number {
    const connections = (data.connections ?? []).filter(
      (conn) =>
        conn.from?.connectorId === connector.id ||
        conn.to?.connectorId === connector.id
    );
    return connections.length;
  }

  private extractSpliceDetails(data: SchematicData): any[] {
    const splices = (data.components ?? []).filter(
      (comp) =>
        comp.componentType?.toLowerCase() === "splice" ||
        comp.label?.toLowerCase() === "splice"
    );

    return splices.map((comp) => {
      const connectedWires = (data.connections ?? []).filter(
        (wire) =>
          wire.from?.componentId === comp.id || wire.to?.componentId === comp.id
      ).length;

      return {
        spliceId: comp.id ?? "",
        label: comp.label ?? "",
        category: comp.category ?? "Splice",
        connectedWires,
      };
    });
  }

  private async addSchematicDetailsToPDF(
    pdf: any,
    item: ExportQueueItem,
    imageData: string,
    yPosition: number,
    pageWidth: number,
    pageHeight: number,
    margin: number
  ): Promise<number> {
    // Extract technical details
    const connectorConnectionCount = this.calculateConnectorConnectionCount(item.schematicData);
    const components = this.extractComponentDetails(item.schematicData, connectorConnectionCount);
    const wires = this.extractWireDetails(item.schematicData);
    const connectors = this.extractConnectorDetails(item.schematicData);
    const splices = this.extractSpliceDetails(item.schematicData);

    // Add schematic image
    const imgWidth = pageWidth - 2 * margin;
    const img = new Image();
    img.src = imageData;
    
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });
    
    const aspectRatio = img.width / img.height;
    const imgHeight = imgWidth / aspectRatio;
    
    const maxHeight = pageHeight - yPosition - margin - 20;
    let finalImgWidth = imgWidth;
    let finalImgHeight = imgHeight;
    
    if (finalImgHeight > maxHeight) {
      finalImgHeight = maxHeight;
      finalImgWidth = finalImgHeight * aspectRatio;
    }

    try {
      const xPosition = (pageWidth - finalImgWidth) / 2;
      pdf.addImage(imageData, "PNG", xPosition, yPosition, finalImgWidth, finalImgHeight);
    } catch (imgError) {
      console.warn("Warning: Could not add image to PDF:", imgError);
    }

    yPosition += finalImgHeight + 15;

    // Add logo
    const logo = new Image();
    logo.src = logoImage;

    await new Promise<void>((resolve, reject) => {
      logo.onload = () => resolve();
      logo.onerror = reject;
    });

    const logoWidth = 30;
    const logoHeight = 30;
    const x = pageWidth - logoWidth - margin;
    const y = 0;
    pdf.addImage(logo as any, "PNG", x, y, logoWidth, logoHeight);

    // Add page break if needed before details
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = margin;
    }

    // Add technical details sections
    if (typeof pdf.autoTable === "function") {
      // Components Table
      pdf.setFontSize(14);
      pdf.setFont(undefined, "bold");
      pdf.text("COMPONENT DETAILS", margin, yPosition);
      yPosition += 8;

      const componentRows = components.map((comp) => [
        comp.id,
        comp.label,
        comp.category,
        comp.manufacturer,
        comp.partNumber,
        comp.harnessName,
        comp.connectors.map((c: any) => c.label).join(", "),
      ]);

      pdf.autoTable({
        startY: yPosition,
        head: [["ID", "Label", "Category", "Manufacturer", "Part #", "Harness", "Connectors"]],
        body: componentRows,
        margin: { left: margin },
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255], fontStyle: "bold" },
        theme: "grid",
      });

      yPosition = pdf.lastAutoTable.finalY + 10;

      // Check for page break
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = margin;
      }

      // Connectors Table
      pdf.setFontSize(14);
      pdf.setFont(undefined, "bold");
      pdf.text("CONNECTOR DETAILS", margin, yPosition);
      yPosition += 8;

      const connectorRows = connectors.map((conn) => [
        conn.componentCode,
        conn.connectorCode,
        conn.partNumber,
        conn.gender,
        conn.cavityCount.toString(),
        conn.manufacturer,
        conn.harnessName,
      ]);

      pdf.autoTable({
        startY: yPosition,
        head: [["Component", "Connector", "Part #", "Gender", "Cavities", "Manufacturer", "Harness"]],
        body: connectorRows,
        margin: { left: margin },
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [255, 193, 7], textColor: [0, 0, 0], fontStyle: "bold" },
        theme: "grid",
      });

      yPosition = pdf.lastAutoTable.finalY + 10;

      // Check for page break
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = margin;
      }

      // Splices Table
      if (splices.length > 0) {
        pdf.setFontSize(14);
        pdf.setFont(undefined, "bold");
        pdf.text("SPLICE DETAILS", margin, yPosition);
        yPosition += 8;

        const spliceRows = splices.map((splice) => [
          splice.spliceId,
          splice.label,
          splice.category,
          splice.connectedWires.toString(),
        ]);

        pdf.autoTable({
          startY: yPosition,
          head: [["Splice ID", "Label", "Category", "Connected Wires"]],
          body: spliceRows,
          margin: { left: margin },
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [139, 92, 246], textColor: [255, 255, 255], fontStyle: "bold" },
          theme: "grid",
        });

        yPosition = pdf.lastAutoTable.finalY + 10;
      }

      // Check for page break
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = margin;
      }

      // Wire Connections Table
      pdf.setFontSize(14);
      pdf.setFont(undefined, "bold");
      pdf.text("WIRE CONNECTIONS", margin, yPosition);
      yPosition += 8;

      const wireRows = wires.map((wire) => [
        wire.circuitNumber,
        wire.wireColor,
        wire.wireSize.toString(),
        wire.wireLength.toString(),
        wire.from.component,
        wire.to.component,
        wire.from.cavity,
        wire.to.cavity,
        wire.wireType,
      ]);

      pdf.autoTable({
        startY: yPosition,
        head: [["Circuit", "Color", "Size", "Length", "From", "To", "From Cavity", "To Cavity", "Type"]],
        body: wireRows,
        margin: { left: margin },
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [40, 167, 69], textColor: [255, 255, 255], fontStyle: "bold" },
        theme: "grid",
      });

      yPosition = pdf.lastAutoTable.finalY + 10;
    }

    // Add DTC Details if available
    const causes = (item.schematicData as any).probableCauses || (item.schematicData as any).problableCauses || [];
    const steps = (item.schematicData as any).steps || [];

    if (causes.length || steps.length) {
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(16);
      pdf.setFont(undefined, "bold");
      pdf.text("DTC DETAILS", margin, yPosition);
      yPosition += 12;

      // Probable Causes
      if (causes.length) {
        pdf.setFontSize(13);
        pdf.setFont(undefined, "bold");
        pdf.text("Probable Causes:", margin, yPosition);
        yPosition += 8;

        pdf.setFontSize(11);
        pdf.setFont(undefined, "normal");

        causes.forEach((cause: string, i: number) => {
          pdf.text(`${i + 1}. ${cause}`, margin + 5, yPosition);
          yPosition += 6;
        });

        yPosition += 6;
      }

      // Diagnostic Steps
      if (steps.length) {
        pdf.setFontSize(13);
        pdf.setFont(undefined, "bold");
        pdf.text("Diagnostic Steps:", margin, yPosition);
        yPosition += 8;

        pdf.setFontSize(11);
        pdf.setFont(undefined, "normal");

        steps.forEach((step: string, i: number) => {
          pdf.text(`${i + 1}. ${step}`, margin + 5, yPosition);
          yPosition += 6;
        });
      }
    }

    return yPosition;
  }

  abort() {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.isProcessing = false;
  }
}

export const exportQueueManager = new ExportQueueManager();
