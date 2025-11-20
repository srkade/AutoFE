// ComponentCategory.ts
import Antenna from "./Antenna";
import FuseSymbol from "./FuseSymbol";
import Sensor from "./Sensor";
import TridentShape from "./TridentShape";


export const ComponentCategory = { Antenna, FuseSymbol, Sensor, TridentShape };

// This is what you actually use for dynamic rendering
export const symbolLibrary: { [category: string]: React.FC<any> } = {
  antenna: Antenna,
  fuse: FuseSymbol,
  sensor: Sensor,
  trident: TridentShape,
};
