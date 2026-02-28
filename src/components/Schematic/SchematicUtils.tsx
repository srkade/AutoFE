// src/components/Schematic/SchematicUtils.ts
import {
    SchematicData,
    ComponentType,
    ConnectorType,
    ConnectionPoint,
    ConnectionType,
} from "./SchematicTypes";

export function spaceForWires(data: SchematicData) {
    let connectionsCount = data.connections?.length ?? 0;
    return connectionsCount * 20 + 40; // 20px per connection + padding
}

export function connectionPointKey(point: ConnectionPoint): string {
    return `${point.componentId}_${point.connectorId}_${point.cavity}`;
}

export function getConnectionOffset(
    index: number,
    count: number,
    y1: number,
    y2: number,
    offsetStep = 10
) {
    let max = Math.max(y1, y2);
    let min = Math.min(y1, y2);
    let reverseOffset = max - min - index * offsetStep - offsetStep;
    return reverseOffset;
}

export function getIntersection(
    xa: number,
    ya: number,
    xb: number,
    yb: number,
    xc: number,
    yc: number,
    xd: number,
    yd: number
) {
    // Returns intersection point if line AB and CD intersect
    const denom = (xb - xa) * (yd - yc) - (yb - ya) * (xd - xc);
    if (denom === 0) return null;
    const r = ((ya - yc) * (xd - xc) - (xa - xc) * (yd - yc)) / denom;
    const s = ((ya - yc) * (xb - xa) - (xa - xc) * (yb - ya)) / denom;
    if (r > 0 && r < 1 && s > 0 && s < 1) {
        // Intersection point
        return {
            x: xa + r * (xb - xa),
            y: ya + r * (yb - ya),
        };
    }
    return null;
}
export function getConnectionsForComponent(component: ComponentType, data: SchematicData) {
    return (data.connections ?? []).filter(
        (c) =>
            c.from.componentId === component.id || c.to.componentId === component.id
    );
}
export function getConnectionsForConnector(conn: ConnectorType, data: SchematicData): ConnectionType[] {
    return (data.connections ?? []).filter(
        (c) => c.from.connectorId === conn.id || c.to.connectorId === conn.id
    );
}

export function getComponentConnectorTupleFromConnectionPoint(
    point: ConnectionPoint,
    data: SchematicData
): [ComponentType?, ConnectorType?] {
    const fromComponent = data.components.find(
        (comp) => point.componentId === comp.id
    );
    if (fromComponent) {
        const connector = fromComponent.connectors.find(
            (conn) => conn.id === point.connectorId
        );
        if (connector) {
            return [fromComponent, connector];
        }
    }
    return [undefined, undefined];
}

export function calculateCavityCountForConnector(conn: ConnectorType, data: SchematicData): number {
    // Count all connection points where this connector is involved.
    // If a connection is a self-loop on this connector, it counts as 2 points.
    let count = 0;
    (data.connections ?? []).forEach((connection) => {
        if (connection.from.connectorId === conn.id) count++;
        if (connection.to.connectorId === conn.id) count++;
    });

    return count;
}

/**
 * Returns an array of objects representing each attachment point on a connector.
 * If a wire starts and ends on the same connector, it will appear twice in this list.
 */
export function getConnectionPointsForConnector(conn: ConnectorType, data: SchematicData): Array<{ wire: ConnectionType; side: "from" | "to" }> {
    const points: Array<{ wire: ConnectionType; side: "from" | "to" }> = [];
    (data.connections ?? []).forEach((wire) => {
        if (wire.from.connectorId === conn.id) {
            points.push({ wire, side: "from" });
        }
        if (wire.to.connectorId === conn.id) {
            points.push({ wire, side: "to" });
        }
    });
    return points;
}

