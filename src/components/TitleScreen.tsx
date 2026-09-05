import { unlockAudio } from "../lib/audio";
import { useStore } from "../store/StoreContext";
import { APP_VERSION } from "../version";
import { Pip } from "./Pip";

export function TitleScreen() {
  const { state, dispatch } = useStore();
  return (
    <div className="screen title-screen">
      <div className="fireflies" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className="firefly" style={{ ["--i" as string]: i }} />
        ))}
      </div>
      <header className="title-hero">
        <Pip coat="ember" pose="sit" size={140} />
        <p className="eyebrow">An original geography adventure</p>
        <h1>Camp Compass</h1>
        <p className="lede">
          Light a lantern in every state. Pip the fox needs a trail partner to learn the United States by region — shapes, capitals, and a pocket of fun facts.
        </p>
        <div className="title-actions">
          <button
            className="btn primary"
            onClick={() => {
              unlockAudio();
              dispatch({ type: "go", view: { name: "profiles" } });
            }}
          >
            {state.children.length ? "Play" : "Start adventure"}
          </button>
          <button className="btn ghost" onClick={() => dispatch({ type: "go", view: { name: "parent-gate" } })}>
            Parent reports
          </button>
        </div>
        <p className="app-version">Version {APP_VERSION}</p>
      </header>
      <ul className="title-points">
        <li>Travel five camps: Northeast, Southeast, Midwest, Southwest, West</li>
        <li>Tap states on a real map, match capitals, and collect story stones</li>
        <li>Wrong answers teach the fact — Maggie the beagle only sneaks in if it gets silly</li>
        <li>PIN-protected reports for grown-ups, same as Keytrail</li>
      </ul>
    </div>
  );
}
