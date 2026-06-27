declare global {
  interface Window {
    AMap: typeof AMap;
  }
}

declare namespace AMap {
  class Map {
    constructor(container: string | HTMLDivElement, opts?: MapOptions);
    destroy(): void;
    getCenter(): LngLat;
    addControl(control: unknown): void;
    setFitView(overlays?: unknown[]): void;
  }

  interface MapOptions {
    zoom?: number;
    center?: [number, number];
    mapStyle?: string;
    resizeEnable?: boolean;
  }

  class LngLat {
    lat: number;
    lng: number;
  }

  class Marker {
    constructor(opts?: MarkerOptions);
    setMap(map: Map): void;
    getPosition(): LngLat;
  }

  interface MarkerOptions {
    position?: LngLat | [number, number];
    title?: string;
  }

  class InfoWindow {
    constructor(opts?: InfoWindowOptions);
    open(map: Map, pos: LngLat): void;
  }

  interface InfoWindowOptions {
    content?: string;
    offset?: { x: number; y: number } | Pixel;
  }

  class Pixel {
    constructor(x: number, y: number);
  }

  class ToolBar {}
  class Scale {}

  function plugin(plugins: string[], callback: () => void): void;
}

export {};
