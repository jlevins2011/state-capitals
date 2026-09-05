export type ViewBox = [number, number, number, number];

export type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function parseViewBox(value: string): ViewBox {
  const parts = value.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) {
    throw new Error(`Invalid viewBox: ${value}`);
  }
  return [parts[0], parts[1], parts[2], parts[3]];
}

export function formatViewBox(box: ViewBox): string {
  return box.map((n) => Math.round(n * 100) / 100).join(" ");
}

export function lerpViewBox(from: ViewBox, to: ViewBox, t: number): ViewBox {
  return [
    from[0] + (to[0] - from[0]) * t,
    from[1] + (to[1] - from[1]) * t,
    from[2] + (to[2] - from[2]) * t,
    from[3] + (to[3] - from[3]) * t,
  ];
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function areaRatio(bounds: Bounds, view: ViewBox): number {
  const viewArea = view[2] * view[3];
  if (viewArea <= 0) return 1;
  return (bounds.width * bounds.height) / viewArea;
}

export function shouldZoomToState(
  id: string,
  bounds: Bounds,
  view: ViewBox,
  smallIds: Set<string>,
): boolean {
  if (smallIds.has(id)) return true;
  return areaRatio(bounds, view) < 0.045;
}

export function zoomViewBox(bounds: Bounds, mode: "tight" | "wide"): ViewBox {
  const padMul = mode === "wide" ? 2.8 : 1.2;
  const minPad = mode === "wide" ? 36 : 18;
  const pad = Math.max(bounds.width, bounds.height) * padMul + minPad;
  const width = Math.max(bounds.width + pad * 2, 40);
  const height = Math.max(bounds.height + pad * 2, 40);
  return [bounds.x - (width - bounds.width) / 2, bounds.y - (height - bounds.height) / 2, width, height];
}

export function boundsFromCentroid(cx: number, cy: number, size: number): Bounds {
  return { x: cx - size / 2, y: cy - size / 2, width: size, height: size };
}
