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
            checked={state.settings.alwaysShowLabels}
            onChange={(e) => dispatch({ type: "settings", patch: { alwaysShowLabels: e.target.checked } })}
          />
          Always show state abbreviations
        </label>
        <p className="tip">
          Early trails show NY, PA, and the other postal codes. Later trails hide them so kids use the shapes — unless you keep this on.
        </p>
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
