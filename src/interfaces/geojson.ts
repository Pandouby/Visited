export enum featureType {
  FEATURE = "Feature",
}
export interface Feature {
  type: featureType;
  properties: {[id: string]: any};
  geometry: {
    type: string;
    coordinates: number[][] | number[][][];
  };
}

export interface FeatureCollection {
  type: string;
  features: Feature[];
}
