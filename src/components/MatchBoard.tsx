import { useState, type PointerEvent } from "react";
import { pairTone } from "../lib/matchPairs";
import type { MatchQuestion } from "../types";

export function MatchBoard({
  question,
  leftPick,
  matched,
  locked,
  onPickLeft,
  onChooseRight,
}: {
  question: MatchQuestion;
  leftPick: string | null;
  matched: string[];
  locked: boolean;
  onPickLeft: (id: string) => void;
  onChooseRight: (id: string) => void;
}) {
  const [drag, setDrag] = useState<{ id: string; label: string; x: number; y: number } | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  function toneFor(id: string) {
    const index = matched.indexOf(id);
    return index >= 0 ? pairTone(index) : null;
  }

  function capitalFromPoint(x: number, y: number) {
    const el = document.elementFromPoint(x, y);
    const node = el?.closest("[data-capital]") as HTMLElement | null;
    const id = node?.dataset.capital;
    if (!id || matched.includes(id)) return null;
    return id;
  }

  function startDrag(id: string, label: string, event: PointerEvent<HTMLButtonElement>) {
    if (locked || matched.includes(id)) return;
    event.preventDefault();
    onPickLeft(id);
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({ id, label, x: event.clientX, y: event.clientY });
  }

  function moveDrag(event: PointerEvent<HTMLButtonElement>) {
    if (!drag) return;
    setDrag({ ...drag, x: event.clientX, y: event.clientY });
    setOverId(capitalFromPoint(event.clientX, event.clientY));
  }

  function endDrag(event: PointerEvent<HTMLButtonElement>) {
    if (!drag) return;
    const capitalId = capitalFromPoint(event.clientX, event.clientY);
    setDrag(null);
    setOverId(null);
    if (capitalId) onChooseRight(capitalId);
  }

  return (
    <div className="match-wrap">
      <p className="match-howto">Drag a state onto its capital. You can also tap a state, then tap the city.</p>
      <div className="match-board">
        <div className="match-col">
          <h3>States</h3>
          {question.left.map((item) => {
            const tone = toneFor(item.id);
            const isHeld = leftPick === item.id || drag?.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`choice ${isHeld ? "is-on" : ""} ${tone ? "is-paired" : ""} ${drag?.id === item.id ? "is-dragging" : ""}`}
                style={tone ? { background: tone.bg, color: tone.ink } : undefined}
                disabled={locked || matched.includes(item.id)}
                onClick={(event) => { if (event.detail === 0) onPickLeft(item.id); }}
                onPointerDown={(event) => startDrag(item.id, item.label, event)}
                onPointerMove={moveDrag}
                onPointerUp={endDrag}
                onPointerCancel={() => {
                  setDrag(null);
                  setOverId(null);
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <div className="match-col">
          <h3>Capitals</h3>
          {question.right.map((item) => {
            const tone = toneFor(item.id);
            return (
              <button
                key={item.id}
                type="button"
                data-capital={item.id}
                className={`choice ${tone ? "is-paired" : ""} ${overId === item.id ? "is-over" : ""}`}
                style={tone ? { background: tone.bg, color: tone.ink } : undefined}
                disabled={locked || matched.includes(item.id)}
                onClick={() => {
                  if (drag) return;
                  onChooseRight(item.id);
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
      {drag && (
        <div className="match-ghost" style={{ left: drag.x, top: drag.y }} aria-hidden="true">
          {drag.label}
        </div>
      )}
    </div>
  );
}
