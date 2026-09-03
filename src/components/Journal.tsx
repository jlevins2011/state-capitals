import { STATES } from "../data/states";
import { useActiveChild, useStore } from "../store/StoreContext";
import { Pip } from "./Pip";

export function Journal() {
  const { dispatch } = useStore();
  const child = useActiveChild();
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
      <div className="journal-grid">
        {STATES.map((state) => {
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
                  <p className="tip">{state.facts[0]}</p>
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
