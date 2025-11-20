// src/components/Schematic/SchematicUtils.ts
import {
    SchematicData,
    ComponentType,
    ConnectorType,
    ConnectionPoint,
    ConnectionType,
} from "./SchematicTypes";

export function spaceForWires(data: SchematicData) {
    let connectionsCount = data.connections.length;
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
    return data.connections.filter(
        (c) =>
            c.from.componentId === component.id || c.to.componentId === component.id
    );
}
export function getConnectionsForConnector(conn: ConnectorType, data: SchematicData): ConnectionType[] {
    return data.connections.filter(
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

export function calculateCavityCountForConnector(conn: ConnectorType,data:SchematicData): number {
    // Count all connections where this connector is involved
    const count = data.connections.filter(
        (connection) =>
            connection.from.connectorId === conn.id ||
            connection.to.connectorId === conn.id
    ).length;

    return count;
}
