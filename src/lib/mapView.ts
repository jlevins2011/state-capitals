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
  return areaRatio(bounds, view) < 0.03;
}

/** How much of the camera the state should fill after a close-up. */
const FILL = { tight: 0.4, wide: 0.2 } as const;
/** Never stay wider than this share of the regional map — forces a real zoom. */
const MAX_REGIONAL = { tight: 0.38, wide: 0.58 } as const;
const MIN_SPAN = { tight: 48, wide: 72 } as const;

export function zoomViewBox(bounds: Bounds, mode: "tight" | "wide", regional?: ViewBox): ViewBox {
  const longest = Math.max(bounds.width, bounds.height, 10);
  const regionalSpan = regional ? Math.max(regional[2], regional[3]) : 280;
  const maxSpan = regionalSpan * MAX_REGIONAL[mode];
  const span = Math.min(maxSpan, Math.max(longest / FILL[mode], MIN_SPAN[mode]));
  const cx = bounds.x + bounds.width / 2;
  const cy = bounds.y + bounds.height / 2;
  return [cx - span / 2, cy - span / 2, span, span];
}

export function boundsFromCentroid(cx: number, cy: number, size: number): Bounds {
  return { x: cx - size / 2, y: cy - size / 2, width: size, height: size };
}
