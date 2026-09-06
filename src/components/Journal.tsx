import { useState } from "react";
import { STATES } from "../data/states";
import { useActiveChild, useStore } from "../store/StoreContext";
import { Pip } from "./Pip";

export function Journal() {
  const { dispatch } = useStore();
  const child = useActiveChild();
  const [query, setQuery] = useState("");
  const [collectedOnly, setCollectedOnly] = useState(false);
  if (!child) return null;

  const found = new Set(child.factsFound.map((id) => id.split("-")[0]));

  return (
    <div className="screen journal">
      <button className="text-back" onClick={() => dispatch({ type: "go", view: { name: "map" } })}>
        ← Camps
      </button>
      <div className="map-who">
        <Pip coat={child.coat} pose="sit" size={72} />
        <div>
          <h1>Story journal</h1>
          <p className="lede">
            {found.size} / 50 states have a stone in {child.name}’s pouch. Light a lantern to keep the fact.
          </p>
        </div>
      </div>
      <div className="journal-tools"><input aria-label="Search states or capitals" placeholder="Find a state or capital…" value={query} onChange={e => setQuery(e.target.value)}/><button aria-pressed={collectedOnly} onClick={() => setCollectedOnly(v => !v)}>Collected stones</button></div>
      <div className="journal-grid">
        {STATES.filter(s => (!collectedOnly || found.has(s.id)) && `${s.name} ${s.capital}`.toLowerCase().includes(query.toLowerCase())).map((state) => {
          const known = found.has(state.id);
          return (
            <article key={state.id} className={`journal-card panel ${known ? "is-known" : "is-locked"}`}>
              <p className="eyebrow">{state.regionId.replace(/^\w/, (c) => c.toUpperCase())}</p>
              <h3>
                {state.id} · {state.name}
              </h3>
              {known ? (
                <>
                  <p>
                    Capital: <b>{state.capital}</b>
                  </p>
                  <p>The {state.nickname}</p>
                  <p className="tip">{state.facts[0]}</p><p className="tip">{state.facts[1]}</p>
                </>
              ) : (
                <p className="muted">Still dark. Play a trail that visits this state.</p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
