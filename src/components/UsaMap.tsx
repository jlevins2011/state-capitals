import { useEffect, useRef, useState } from "react";
import { STATE_BY_ID } from "../data/states";
import { MAP_VIEWBOX, REGION_VIEWS, SMALL_STATES, STATE_CENTROIDS, STATE_PATHS } from "../data/usMap";
import {
  boundsFromCentroid,
  easeInOutCubic,
  formatViewBox,
  lerpViewBox,
  parseViewBox,
  shouldZoomToState,
  zoomViewBox,
} from "../lib/mapView";
import type { RegionId } from "../types";

const REGION_FILL: Record<string, string> = {
  northeast: "#7da36f",
  southeast: "#5aa3b5",
  midwest: "#c48a6a",
  southwest: "#e07a3d",
  west: "#6b7fa8",
};

const ASK = "#2f7dff";
const LIT = "#f4c14e";
const LIT_DIM = "#e8c56a";

function pathBounds(svg: SVGSVGElement, id: string) {
  const el = svg.querySelector<SVGGraphicsElement>(`[data-state="${id}"]`);
  if (!el) return null;
  const box = el.getBBox();
  if (box.width <= 0 || box.height <= 0) return null;
  return { x: box.x, y: box.y, width: box.width, height: box.height };
}

export function UsaMap({
  regionId = "all",
  highlightId,
  wrongId,
  litIds = [],
  interactive = false,
  onSelect,
  showLabels = true,
  focusIds,
  zoomToId,
  zoomMode = "tight",
}: {
  regionId?: RegionId;
  highlightId?: string | null;
  wrongId?: string | null;
  litIds?: string[];
  interactive?: boolean;
  onSelect?: (id: string) => void;
  showLabels?: boolean;
  focusIds?: string[];
  zoomToId?: string | null;
  zoomMode?: "tight" | "wide";
}) {
  const regionalView = REGION_VIEWS[regionId] ?? MAP_VIEWBOX;
  const [viewBox, setViewBox] = useState(regionalView);
  const [zoomed, setZoomed] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const lit = new Set(litIds);
  const focus = focusIds ? new Set(focusIds) : null;
  const askId = highlightId ?? null;

  useEffect(() => {
    setViewBox(regionalView);
    setZoomed(false);
    const targetId = zoomToId ?? askId;
    if (!targetId) return;

    const reduceMotion =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;
    let frame = 0;
    let hold = 0;

    const run = () => {
      if (cancelled) return;
      const svg = svgRef.current;
      const centroid = STATE_CENTROIDS[targetId];
      const measured = svg ? pathBounds(svg, targetId) : null;
      const bounds =
        measured ??
        (centroid ? boundsFromCentroid(centroid[0], centroid[1], SMALL_STATES.has(targetId) ? 16 : 40) : null);
      if (!bounds) return;
      const start = parseViewBox(regionalView);
      if (!shouldZoomToState(targetId, bounds, start, SMALL_STATES)) return;
      const end = zoomViewBox(bounds, zoomMode, start);
      setZoomed(true);
      if (reduceMotion) {
        setViewBox(formatViewBox(end));
        return;
      }
      const duration = 1100;
      const began = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        const t = Math.min(1, (now - began) / duration);
        setViewBox(formatViewBox(lerpViewBox(start, end, easeInOutCubic(t))));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    if (reduceMotion) {
      run();
    } else {
      hold = window.setTimeout(run, 1100);
    }

    return () => {
      cancelled = true;
      if (hold) window.clearTimeout(hold);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [askId, regionalView, zoomMode, zoomToId]);

  function adjustMap(scale: number, dx = 0, dy = 0) {
    const [x,y,w,h] = parseViewBox(viewBox);
    const [, , baseW] = parseViewBox(regionalView);
    const width = Math.max(45, Math.min(baseW * 2, w * scale));
    const height = h * width / w;
    setViewBox(formatViewBox([x + (w-width)/2 + w*dx, y + (h-height)/2 + h*dy, width, height]));
  }

  return (
    <div className={`map-frame ${zoomed ? "is-zoomed" : ""}`} data-zoomed={zoomed ? "true" : "false"}>
    <svg ref={svgRef} className="usa-map" viewBox={viewBox} role={interactive ? "group" : "img"} aria-label="Map of the United States">
      {STATE_PATHS.map((path) => {
        const info = STATE_BY_ID[path.id];
        if (!info && path.id !== "DC") return null;
        const region = info?.regionId ?? "northeast";
        const isFocus = !focus || focus.has(path.id) || path.id === askId;
        const isLit = lit.has(path.id);
        const isAsk = askId === path.id && !isLit;
        const isWrong = wrongId === path.id;
        const fill = isWrong ? "var(--danger)" : isAsk ? ASK : isLit ? (path.id === askId ? LIT : LIT_DIM) : REGION_FILL[region];
        return (
          <path
            key={path.id}
            id={`state-${path.id}`}
            data-state={path.id}
            d={path.d}
            role={interactive && path.id !== "DC" ? "button" : undefined}
            tabIndex={interactive && path.id !== "DC" && isFocus ? 0 : undefined}
            aria-label={interactive ? `Select map shape ${STATE_PATHS.indexOf(path) + 1}${showLabels ? ` (${path.id})` : ""}` : undefined}
            onKeyDown={e => { if (interactive && path.id !== "DC" && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onSelect?.(path.id); } }}
            className={`usa-state ${isAsk ? "is-ask" : ""} ${isLit ? "is-lit" : ""} ${interactive ? "is-hot" : ""}`}
            fill={fill}
            opacity={isFocus ? 1 : 0.22}
            stroke={isAsk ? "#f7f0e2" : "#12231c"}
            strokeWidth={isAsk ? (zoomed ? 1.15 : 2.6) : isLit && path.id === askId ? (zoomed ? 1 : 2) : 1}
            onClick={() => {
              if (interactive && path.id !== "DC") onSelect?.(path.id);
            }}
          >
            {!interactive && !askId && <title>{info?.name ?? "Washington, D.C."}</title>}
          </path>
        );
      })}
      {showLabels &&
        STATE_PATHS.map((path) => {
          if (path.id === "DC") return null;
          const centroid = STATE_CENTROIDS[path.id];
          if (!centroid) return null;
          const force = path.id === askId || lit.has(path.id);
          if (path.id === askId && !lit.has(path.id)) return null;
          if (!force && regionId === "all" && SMALL_STATES.has(path.id)) return null;
          if (focus && !focus.has(path.id) && path.id !== askId) return null;
          return (
            <text
              key={`label-${path.id}`}
              x={centroid[0]}
              y={centroid[1]}
              className={`usa-label ${path.id === askId ? "is-ask" : ""}`}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {path.id}
            </text>
          );
        })}
    </svg>
    {interactive && <div className="map-controls" aria-label="Map controls"><button aria-label="Zoom in" onClick={() => adjustMap(.7)}>+</button><button aria-label="Zoom out" onClick={() => adjustMap(1.4)}>−</button><button aria-label="Pan left" onClick={() => adjustMap(1,-.2)}>←</button><button aria-label="Pan right" onClick={() => adjustMap(1,.2)}>→</button><button aria-label="Pan up" onClick={() => adjustMap(1,0,-.2)}>↑</button><button aria-label="Pan down" onClick={() => adjustMap(1,0,.2)}>↓</button><button aria-label="Reset map view" onClick={() => setViewBox(regionalView)}>Reset</button></div>}
    {zoomed && <span className="zoom-caption">Looking closer</span>}
    </div>
  );
}

export function StateSilhouette({ stateId }: { stateId: string }) {
  const path = STATE_PATHS.find((item) => item.id === stateId);
  const ref = useRef<SVGPathElement>(null);
  const [box, setBox] = useState(MAP_VIEWBOX);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const b = el.getBBox();
    const pad = Math.max(b.width, b.height) * 0.2 + 10;
    setBox(`${b.x - pad} ${b.y - pad} ${b.width + pad * 2} ${b.height + pad * 2}`);
  }, [stateId]);
  if (!path) return null;
  return (
    <svg className="silhouette" viewBox={box} role="img" aria-label="Shape of a U.S. state">
      <path
        ref={ref}
        data-state={stateId}
        d={path.d}
        className="silhouette-shape is-ask"
        fill={ASK}
        stroke="#f7f0e2"
        strokeWidth="2"
      />
    </svg>
  );
}
