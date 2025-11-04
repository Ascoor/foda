import L from "leaflet";

type HeatLayer = {
  addTo: (map: L.Map) => HeatLayer;
  setLatLngs: (points: L.LatLngExpression[]) => HeatLayer;
  setOptions: (options: Record<string, unknown>) => HeatLayer;
  addLatLng: (point: L.LatLngExpression) => HeatLayer;
  remove: () => void;
};

const noopLayer: HeatLayer = {
  addTo: () => noopLayer,
  setLatLngs: () => noopLayer,
  setOptions: () => noopLayer,
  addLatLng: () => noopLayer,
  remove: () => undefined,
};

if (!(L as unknown as { heatLayer?: typeof noopLayer }).heatLayer) {
  (L as unknown as { heatLayer: (...args: unknown[]) => HeatLayer }).heatLayer =
    () => {
      if (import.meta.env.DEV) {
        console.info(
          "leaflet.heat plugin not available; rendering fallback heat layer.",
        );
      }
      return noopLayer;
    };
}

export {};
