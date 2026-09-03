import { useActiveChild, useStore } from "../store/StoreContext";

export function Settings() {
  const { state, dispatch } = useStore();
  const child = useActiveChild();

  return (
    <div className="screen settings">
      <button className="text-back" onClick={() => dispatch({ type: "go", view: { name: "map" } })}>
        ← Camps
      </button>
      <h1>Settings</h1>
      {child && <p className="lede">Playing as {child.name}.</p>}
      <div className="panel form">
        <label className="toggle">
          <input
            type="checkbox"
            checked={state.settings.sound}
            onChange={(e) => dispatch({ type: "settings", patch: { sound: e.target.checked } })}
          />
          Sounds
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={state.settings.showLabels}
            onChange={(e) => dispatch({ type: "settings", patch: { showLabels: e.target.checked } })}
          />
          State abbreviations on the map
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={state.settings.highContrast}
            onChange={(e) => dispatch({ type: "settings", patch: { highContrast: e.target.checked } })}
          />
          High contrast
        </label>
      </div>
      <div className="row-actions">
        <button className="btn ghost" onClick={() => dispatch({ type: "go", view: { name: "profiles" } })}>
          Switch explorer
        </button>
        <button className="btn ghost" onClick={() => dispatch({ type: "go", view: { name: "parent-gate" } })}>
          Parent reports
        </button>
      </div>
    </div>
  );
}
