
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import {
  SchematicData,
  ComponentType,
  ConnectionType,
  ConnectorType,
  ExportOptions,
  ExportedComponentDetail,
  ExportedWireDetail,
  ExportedConnectorDetail,
  ConnectorMapping,
  ExportMetadata,
} from "./SchematicTypes";
import logoImage from '../../assets/Images/logo.jpg';
class SchematicExportManager {
  private async captureSchematicDiv(
    resolution: number = 300,
    zoom: number = 1
  ): Promise<string> {
    try {
      console.log("Capturing full schematic SVG using bounding box...");

      const svgElement = document.querySelector("#export svg") as SVGSVGElement;
      if (!svgElement) throw new Error("SVG not found inside #export div");

      // Get the actual bounding box of the entire schematic
      let bbox;
      try {
        bbox = svgElement.getBBox();

        if (!bbox || !bbox.width || !bbox.height) {
          throw new Error("Invalid BBox");
        }
      } catch (e) {
        console.warn("getBBox failed, using fallback dimensions");

        bbox = {
          x: 0,
          y: 0,
          width: svgElement.scrollWidth || svgElement.clientWidth || 2000,
          height: svgElement.scrollHeight || svgElement.clientHeight || 1200
        };
      }
      const fullWidth = bbox.width + Math.abs(bbox.x);
      const fullHeight = bbox.height + Math.abs(bbox.y);

      // Clone the SVG to safely modify it
      const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
      clonedSvg.setAttribute("width", `${fullWidth}`);
      clonedSvg.setAttribute("height", `${fullHeight}`);
      clonedSvg.setAttribute("viewBox", `${bbox.x} ${bbox.y} ${fullWidth} ${fullHeight}`);

      // Serialize the cloned SVG
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(clonedSvg);
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      // Prepare the canvas
      const scale = (resolution / 96) * zoom;
      const canvas = document.createElement("canvas");
      canvas.width = fullWidth * scale;
      canvas.height = fullHeight * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get 2D context");

      // Load the image and draw it onto the canvas
      const img = new Image();
      img.crossOrigin = "anonymous";

      return await new Promise<string>((resolve, reject) => {
        img.onload = () => {
          const MAX_PX = 8000;

          let renderWidth = fullWidth;
          let renderHeight = fullHeight;

          if (renderWidth > MAX_PX || renderHeight > MAX_PX) {
            const scaleDown = MAX_PX / Math.max(renderWidth, renderHeight);
            renderWidth = Math.floor(renderWidth * scaleDown);
            renderHeight = Math.floor(renderHeight * scaleDown);
          }
          // Use resized dimensions
          canvas.width = renderWidth;
          canvas.height = renderHeight;
          // Draw final scaled image
          ctx.drawImage(img, 0, 0, renderWidth, renderHeight);
          URL.revokeObjectURL(url);
          // Export JPEG (MUCH smaller, prevents RangeError)
          const imageData = canvas.toDataURL("image/jpeg", 0.92);
          resolve(imageData);
        };

        img.onerror = (e) => {
          URL.revokeObjectURL(url);
          reject(new Error("Failed to load SVG image: " + e));
        };
        img.src = url;
      });
    } catch (error) {
      console.error("Error capturing schematic:", error);
      throw error;
    }
  }
  private extractComponentDetails(
    data: SchematicData,
    connectorConnectionCount: { [id: string]: number }
  ): ExportedComponentDetail[] {
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

  private extractWireDetails(data: SchematicData): ExportedWireDetail[] {
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

  private extractConnectorDetails(data: SchematicData): ExportedConnectorDetail[] {
    const connectorDetails: ExportedConnectorDetail[] = [];
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

  private calculateCavityCount(connector: ConnectorType, data: SchematicData): number {
    const connections = (data.connections ?? []).filter(
      (conn) =>
        conn.from?.connectorId === connector.id ||
        conn.to?.connectorId === connector.id
    );
    return connections.length;
  }

  public async generatePDF(
    svgElement: SVGSVGElement | null, // Not used, kept for compatibility
    data: SchematicData,
    connectorConnectionCount: { [id: string]: number },
    options: ExportOptions = {}
  ): Promise<void> {
    const resolution = options.resolution || 300;
    const zoom = options.zoom || 1;
    const filename = `${data.name || "Unnamed Schematic"}.pdf`;


    try {
      console.log("=== Starting PDF Export ===");

      // Capture schematic from #export div
      const schematicImage = await this.captureSchematicDiv(resolution, zoom);

      // Extract all data
      console.log("Extracting component data...");
      const components = this.extractComponentDetails(data, connectorConnectionCount);
      const wires = this.extractWireDetails(data);
      const connectors = this.extractConnectorDetails(data);

      const metadata: ExportMetadata = {
        exportDate: new Date().toLocaleDateString(),
        exportTime: new Date().toLocaleTimeString(),
        zoomLevel: zoom,
        totalComponents: components.length,
        totalWires: wires.length,
        totalConnectors: connectors.length,
      };

      console.log("Creating PDF document...");

      // Create PDF
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      }) as any;

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;

      let yPosition = margin;

      // Title
      pdf.setFontSize(20);
      pdf.setFont(undefined, "bold");
      pdf.text(`Schematic :${data.name || "Unnamed Scheamtic"}`, margin, yPosition);
      yPosition += 10;

      // Metadata
      pdf.setFontSize(10);
      pdf.setFont(undefined, "normal");
      pdf.text(
        `Export Date: ${metadata.exportDate} | Time: ${metadata.exportTime}`,
        margin,
        yPosition
      );
      yPosition += 5;
      pdf.text(
        `Components: ${metadata.totalComponents} | Wires: ${metadata.totalWires} | Connectors: ${metadata.totalConnectors}`,
        margin,
        yPosition
      );
      yPosition += 10;

      // Add schematic image
      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = (imgWidth / 16) * 9; // 16:9 aspect ratio

      try {
        pdf.addImage(schematicImage, "PNG", margin, yPosition, imgWidth, imgHeight);
        console.log("✓ Schematic image added to PDF");
      } catch (imgError) {
        console.warn("Warning: Could not add image to PDF:", imgError);
      }

      const img = new Image();
      img.src = logoImage;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
      });

      const logoWidth = 30;
      const logoHeight = 30;
      const x = pageWidth - logoWidth - margin;
      const y = 0;
      pdf.addImage(img as any, "PNG", x, y, logoWidth, logoHeight);
      pdf.addPage();
      yPosition = margin;

      // Check if autoTable is available
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
          comp.connectors.map((c) => c.label).join(", "),
        ]);

        (pdf as any).autoTable({
          startY: yPosition,
          head: [["ID", "Label", "Category", "Manufacturer", "Part #", "Harness", "Connectors"]],
          body: componentRows,
          margin: { left: margin },
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255], fontStyle: "bold" },
          theme: "grid",
        });

        yPosition = (pdf as any).lastAutoTable.finalY + 10;
        // Wires Table
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setFontSize(14);
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

        (pdf as any).autoTable({
          startY: yPosition,
          head: [["Circuit", "Color", "Size", "Length", "From", "To", "From Cavity", "To Cavity", "Type"]],
          body: wireRows,
          margin: { left: margin },
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [40, 167, 69], textColor: [255, 255, 255], fontStyle: "bold" },
          theme: "grid",
        });

        yPosition = (pdf as any).lastAutoTable.finalY + 10;
        // Connectors Table
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setFontSize(14);
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

        (pdf as any).autoTable({
          startY: yPosition,
          head: [["Component", "Connector", "Part #", "Gender", "Cavities", "Manufacturer", "Harness"]],
          body: connectorRows,
          margin: { left: margin },
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [255, 193, 7], textColor: [0, 0, 0], fontStyle: "bold" },
          theme: "grid",
        });

        yPosition = (pdf as any).lastAutoTable.finalY + 10;

        console.log("✓ Tables added to PDF");
      } else {
        console.warn("autoTable not available, adding text summary instead");
        pdf.setFontSize(12);
        pdf.text(`Total Components: ${components.length}`, margin, yPosition);
        yPosition += 7;
        pdf.text(`Total Wires: ${wires.length}`, margin, yPosition);
        yPosition += 7;
        pdf.text(`Total Connectors: ${connectors.length}`, margin, yPosition);
      }
      // --- Add DTC Probable Causes & Steps ---
      const causes =
        (data as any).probableCauses || (data as any).problableCauses || [];
      const steps = (data as any).steps || [];

      if (causes.length || steps.length) {
        pdf.addPage();
        let y = 10;

        pdf.setFontSize(16);
        pdf.setFont(undefined, "bold");
        pdf.text("DTC DETAILS", 10, y);
        y += 12;

        // Probable Causes
        if (causes.length) {
          pdf.setFontSize(13);
          pdf.setFont(undefined, "bold");
          pdf.text("Probable Causes:", 10, y);
          y += 8;

          pdf.setFontSize(11);
          pdf.setFont(undefined, "normal");

          causes.forEach((cause: string, i: number) => {
            pdf.text(`${i + 1}. ${cause}`, 15, y);
            y += 6;
          });

          y += 6;
        }

        // Diagnostic Steps
        if (steps.length) {
          pdf.setFontSize(13);
          pdf.setFont(undefined, "bold");
          pdf.text("Diagnostic Steps:", 10, y);
          y += 8;

          pdf.setFontSize(11);
          pdf.setFont(undefined, "normal");

          steps.forEach((step: string, i: number) => {
            pdf.text(`${i + 1}. ${step}`, 15, y);
            y += 6;
          });
        }
      }

      // Save PDF
      pdf.save(filename);
      console.log(`✓✓✓ PDF exported successfully: ${filename}`);
      console.log("=== Export Complete ===");
    } catch (error) {
      console.error(" Error generating PDF:", error);
      throw error;
    }
  }

  public async exportAsImage(
    svgElement: SVGSVGElement | null,
    options: ExportOptions = {},
    data: SchematicData
  ): Promise<void> {
    const resolution = options.resolution || 300;
    const zoom = options.zoom || 1;
    const filename = `${data.name || "Unnamed Schematic"}.png`;
    // helper to trigger download
    const downloadDataUrl = (dataUrl: string, name: string) => {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    // fallback: inline computed styles for every element (deep)
    const inlineComputedStyles = (svg: SVGSVGElement) => {
      const win = document.defaultView || (window as any);
      const all = svg.querySelectorAll("*");
      for (let i = 0; i < all.length; i++) {
        const el = all[i] as Element;
        const style = win.getComputedStyle(el);
        if (!style) continue;

        // build style string of only useful properties (avoid very long)
        const props = [
          "fill", "fill-opacity", "stroke", "stroke-width",
          "font-size", "font-family", "font-weight", "font-style",
          "text-anchor", "opacity", "display", "visibility",
          "stroke-linecap", "stroke-linejoin", "stroke-dasharray"
        ];
        const styleTextParts: string[] = [];
        for (const p of props) {
          const v = style.getPropertyValue(p);
          if (v) styleTextParts.push(`${p}:${v};`);
        }
        if (styleTextParts.length) {
          (el as HTMLElement).setAttribute("style", styleTextParts.join(""));
        }
      }
    };
    const inlineExternalImages = async (svg: SVGSVGElement): Promise<SVGSVGElement> => {
      const cloned = svg.cloneNode(true) as SVGSVGElement;
      const images = Array.from(cloned.querySelectorAll("image")) as unknown as SVGImageElement[];

      for (const imgEl of images) {
        // href could be in xlink:href or href
        const href = imgEl.getAttribute("href") || imgEl.getAttributeNS("http://www.w3.org/1999/xlink", "href");
        if (!href) continue;
        // ignore data: already
        if (href.startsWith("data:")) continue;

        try {
          // fetch the image as blob 
          const resp = await fetch(href, { mode: "cors" });
          if (!resp.ok) throw new Error(`image fetch failed: ${resp.status}`);
          const blob = await resp.blob();

          // draw to a temporary canvas to get dataURL
          const bitmap = await createImageBitmap(blob);
          const canvas = document.createElement("canvas");
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(bitmap, 0, 0);
          const dataUrl = canvas.toDataURL("image/png");
          imgEl.setAttribute("href", dataUrl);
        } catch (e) {
          console.warn("Failed to inline external image (CORS?):", href, e);
        }
      }
      return cloned;
    };

    const svgToDataUrl = (svg: SVGSVGElement) => {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      return URL.createObjectURL(blob);
    };
    const openSerializedSvgInNewTab = (svg: SVGSVGElement) => {
      try {
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank")?.focus();
        setTimeout(() => URL.revokeObjectURL(url), 30000);
      } catch (e) {
        console.warn("openSerializedSvgInNewTab failed:", e);
      }
    };

    try {
      console.log("=== Starting Image Export (robust) ===");
      try {
        if ((document as any).fonts && (document as any).fonts.ready) {
          await (document as any).fonts.ready;
        }
      } catch { }

      try {
        console.log("Attempting full SVG capture (bounding box method)");
        const svg = document.querySelector("#export svg") as SVGSVGElement | null;
        if (!svg) throw new Error("SVG not found inside #export div");

        let bbox;
        try { bbox = svg.getBBox(); }
        catch (e) { bbox = { x: 0, y: 0, width: svg.clientWidth, height: svg.clientHeight }; }
        const fullWidth = bbox.width + Math.abs(bbox.x);
        const fullHeight = bbox.height + Math.abs(bbox.y);

        const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
        clonedSvg.setAttribute("width", `${fullWidth}`);
        clonedSvg.setAttribute("height", `${fullHeight}`);
        clonedSvg.setAttribute("viewBox", `${bbox.x} ${bbox.y} ${fullWidth} ${fullHeight}`);

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(clonedSvg);
        const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const img = new Image();
        img.crossOrigin = "anonymous";

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = (err) => reject(new Error("Failed to load serialized SVG image: " + err));
          img.src = url;
        });

        const scale = (resolution / 96) * zoom;
        const canvas = document.createElement("canvas");
        canvas.width = fullWidth * scale;
        canvas.height = fullHeight * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get 2D context");

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);

        const dataUrl = canvas.toDataURL("image/png", 1.0);
        downloadDataUrl(dataUrl, filename);
        console.log("✓ Full schematic PNG exported successfully");
        return;
      } catch (err) {
        console.warn("SVG capture failed, falling back to html2canvas:", err);
      }
      const svg = svgElement || (document.querySelector("#export svg") as SVGSVGElement | null);
      if (!svg) throw new Error("SVG not found inside #export div (fallback)");

      // Clone and inline images
      const svgWithImages = await inlineExternalImages(svg);

      // Inline computed styles (deep)
      inlineComputedStyles(svgWithImages);

      // Compute bounding box (use original svg's bbox for consistency)
      let bbox;
      try { bbox = svg.getBBox(); } catch (e) { bbox = { x: 0, y: 0, width: svg.clientWidth || 1000, height: svg.clientHeight || 800 }; }
      const fullWidth = bbox.width + Math.abs(bbox.x);
      const fullHeight = bbox.height + Math.abs(bbox.y);
      svgWithImages.setAttribute("width", `${fullWidth}`);
      svgWithImages.setAttribute("height", `${fullHeight}`);
      svgWithImages.setAttribute("viewBox", `${bbox.x} ${bbox.y} ${fullWidth} ${fullHeight}`);

      // serialize and load into image
      const svgUrl = svgToDataUrl(svgWithImages);
      const img = new Image();
      img.crossOrigin = "anonymous";

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = (err) => reject(new Error("Failed to load serialized SVG image: " + err));
        img.src = svgUrl;
      });

      // draw to canvas
      const scale = (resolution / 96) * zoom;
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(fullWidth * scale));
      canvas.height = Math.max(1, Math.round(fullHeight * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get 2D context");

      // draw
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(svgUrl);

      // export PNG
      const png = canvas.toDataURL("image/png", 1.0);
      downloadDataUrl(png, filename);
      console.log(" Fallback SVG-inlined export successful");
      return;
    } catch (err) {
      console.error(" exportAsImage failed (both methods):", err);

      throw err;
    }
  }
}
export const schematicExportManager = new SchematicExportManager();