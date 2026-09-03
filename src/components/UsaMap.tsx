import { useEffect, useRef, useState } from "react";
import { STATE_BY_ID } from "../data/states";
import { MAP_VIEWBOX, REGION_VIEWS, SMALL_STATES, STATE_CENTROIDS, STATE_PATHS } from "../data/usMap";
import type { RegionId } from "../types";

const REGION_FILL: Record<string, string> = {
  northeast: "#7da36f",
  southeast: "#5aa3b5",
  midwest: "#c48a6a",
  southwest: "#e07a3d",
  west: "#6b7fa8",
};

export function UsaMap({
  regionId = "all",
  highlightId,
  pulseId,
  wrongId,
  litIds = [],
  interactive = false,
  onSelect,
  showLabels = true,
  focusIds,
}: {
  regionId?: RegionId;
  highlightId?: string | null;
  pulseId?: string | null;
  wrongId?: string | null;
  litIds?: string[];
  interactive?: boolean;
  onSelect?: (id: string) => void;
  showLabels?: boolean;
  focusIds?: string[];
}) {
  const viewBox = REGION_VIEWS[regionId] ?? MAP_VIEWBOX;
  const lit = new Set(litIds);
  const focus = focusIds ? new Set(focusIds) : null;
  const zoomed = regionId !== "all";

  return (
    <svg className="usa-map" viewBox={viewBox} role="img" aria-label="Map of the United States">
      {STATE_PATHS.map((path) => {
        const info = STATE_BY_ID[path.id];
        if (!info && path.id !== "DC") return null;
        const region = info?.regionId ?? "northeast";
        const isFocus = !focus || focus.has(path.id) || path.id === highlightId;
        const isLit = lit.has(path.id);
        const isPulse = pulseId === path.id || highlightId === path.id;
        const isWrong = wrongId === path.id;
        const fill = isWrong
          ? "var(--danger)"
          : isPulse
            ? "#f4c14e"
            : isLit
              ? "#e8c56a"
              : REGION_FILL[region];
        return (
          <path
            key={path.id}
            d={path.d}
            className={`usa-state ${isPulse ? "is-pulse" : ""} ${isLit ? "is-lit" : ""} ${interactive ? "is-hot" : ""}`}
            fill={fill}
            opacity={isFocus ? 1 : 0.22}
            stroke="#12231c"
            strokeWidth={isPulse ? 2.2 : 1}
            onClick={() => {
              if (interactive && path.id !== "DC") onSelect?.(path.id);
            }}
          >
            <title>{info?.name ?? "Washington, D.C."}</title>
          </path>
        );
      })}
      {showLabels &&
        STATE_PATHS.map((path) => {
          if (path.id === "DC") return null;
          const centroid = STATE_CENTROIDS[path.id];
          if (!centroid) return null;
          if (!zoomed && SMALL_STATES.has(path.id)) return null;
          if (focus && !focus.has(path.id) && path.id !== highlightId) return null;
          return (
            <text
              key={`label-${path.id}`}
              x={centroid[0]}
              y={centroid[1]}
              className="usa-label"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {path.id}
            </text>
          );
        })}
    </svg>
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
        d={path.d}
        className="silhouette-shape is-pulse"
        fill="#f4c14e"
        stroke="#12231c"
        strokeWidth="2"
      />
    </svg>
  );
}
