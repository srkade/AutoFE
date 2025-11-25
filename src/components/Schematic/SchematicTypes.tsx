export type ComponentType = {
  id: string;
  label: string;
  category: string;
  shape: string;
  connectors: Array<{ id: string; label: string }>;
  engineering_component_name?: string;
  engineering_manufacturer?: string;
  primary_part_number?: string;
  harness_name?: string;
  componentType?: string;
  connector_type?: string;
  remove?: boolean;
  manufacturer?: string;
  connector_part_number?: string;
  gender?: string;
};
export interface FuseInfo {
  code: string;
  ampere: string | number;
}
export type ConnectorType = {
  id: string;
  label: string;
  color?: string;
  gender?: string;
  fuse?: FuseInfo;
};
export type ConnectionPoint = {
  componentId: string;
  connectorId: string;
  cavity: string;
  gender?: string;
};
export type ConnectionType = {
  color: string;
  from: ConnectionPoint;
  to: ConnectionPoint;
  label: string;
  wireDetails?: WireDetailsType;
};
export type SchematicData = {
  masterComponents: string[];
  components: ComponentType[];
  connections: ConnectionType[];
  name: string;
};

export type WirePopupType = {
  color?: string;
  fromComponent?: ComponentType;
  toComponent?: ComponentType;
  fromConnector?: {
    label?: string;
    gender?: string;
  };
  toConnector?: {
    label?: string;
    gender?: string;
  };
  wire?: {
    color?: string;
    from?: {
      componentId?: string;
      connectorId?: string;
      cavity?: string;
      gender?: string;
    };
    to?: {
      componentId?: string;
      connectorId?: string;
      cavity?: string;
      gender?: string;
    };
    wireDetails?: {
      circuitNumber?: string;
      wireSize?: number;
      wireColor?: string;
      wireLength?: number;
      wireType?: string;
      twistId?: string;
      shieldId?: string;
      wireOption?: string;
      mark?: string;
      fuse?: FuseInfo;
      from?: {
        connectorNumber?: string;
        devName?: string;
        connPartNumber?: string;
        termPartNo?: string;
        sealPartNo?: string;
        cavity?: string;
      };
      to?: {
        connectorNumber?: string;
        devName?: string;
        connPartNumber?: string;
        termPartNo?: string;
        sealPartNo?: string;
        cavity?: string;
      };
    };
  };

};

export type WireDetailsType = {
  circuitNumber: string;
  wireSize: number;
  wireColor: string;
  wireLength: number;
  wireType: string;
  twistId: string;
  shieldId: string;
  wireOption: string;
  mark: string;
  fuse?: FuseInfo;
  from: {
    connectorNumber: string;
    devName: string;
    connPartNumber: string;
    termPartNo: string;
    sealPartNo: string;
    cavity: string;
  };
  to: {
    connectorNumber: string;
    devName: string;
    connPartNumber: string;
    termPartNo: string;
    sealPartNo: string;
    cavity: string;
  };
};
export type PopupConnectorType = {
  componentCode?: string;
  connectorCode?: string;
  label?: string;
  harnessName?: string;
  partNumber?: string;
  gender?: string;
  cavityCount?: number;
  color?: string;
  connectorType?: string;
  manufacturer?: string;
  termPartNo?: string;
  sealPartNo?: string;
};

export interface ExportOptions {
  filename?: string;
  resolution?: number;
  zoom?: number;
}

export interface ExportedComponentDetail {
  id: string;
  label: string;
  category: string;
  engineeringName: string;
  manufacturer: string;
  partNumber: string;
  harnessName: string;
  connectorPartNumber: string;
  gender: string;
  connectors: ConnectorMapping[];
}

export interface ExportedWireDetail {
  circuitNumber: string;
  wireColor: string;
  wireSize: number;
  wireLength: number;
  wireType: string;
  from: {
    component: string;
    connector: string;
    cavity: string;
    partNumber: string;
  };
  to: {
    component: string;
    connector: string;
    cavity: string;
    partNumber: string;
  };
  twistId: string;
  shieldId: string;
  mark: string;
}

export interface ExportedConnectorDetail {
  componentCode: string;
  connectorCode: string;
  label: string;
  harnessName: string;
  partNumber: string;
  gender: string;
  cavityCount: number;
  color: string;
  connectorType: string;
  manufacturer: string;
  terminalPartNumber: string;
  sealPartNumber: string;
}

export interface ConnectorMapping {
  id: string;
  label: string;
  connectionCount: number;
}

export interface ExportMetadata {
  exportDate: string;
  exportTime: string;
  zoomLevel: number;
  totalComponents: number;
  totalWires: number;
  totalConnectors: number;
}
