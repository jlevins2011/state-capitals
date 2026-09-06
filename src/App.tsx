import { useEffect, useState } from "react";
import { Journal } from "./components/Journal";
import { LessonView } from "./components/LessonView";
import { ParentDashboard } from "./components/ParentDashboard";
import { ParentGate } from "./components/ParentGate";
import { ProfileSelect } from "./components/ProfileSelect";
import { RegionMap } from "./components/RegionMap";
import { Results } from "./components/Results";
import { Settings } from "./components/Settings";
import { TitleScreen } from "./components/TitleScreen";
import { useStore } from "./store/StoreContext";

export function App() {
  const { state } = useStore();
  const view = state.view;
  const [saveFailed, setSaveFailed] = useState(false);
  useEffect(() => { const listener = (event: Event) => setSaveFailed(!(event as CustomEvent<boolean>).detail); window.addEventListener("camp-save-status", listener); return () => window.removeEventListener("camp-save-status", listener); }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [view]);

  return (
    <div className={`app ${state.settings.highContrast ? "contrast" : ""}`}>
      {saveFailed && <p role="alert" className="save-warning">Your browser could not save progress. Keep this tab open; check available storage before leaving.</p>}
      {view.name === "title" && <TitleScreen />}
      {view.name === "profiles" && <ProfileSelect />}
      {view.name === "map" && <RegionMap />}
      {view.name === "lesson" && <LessonView key={`${state.activeChildId}:${view.lessonId}`} lessonId={view.lessonId} />}
      {view.name === "results" && <Results lessonId={view.lessonId} sessionId={view.sessionId} />}
      {view.name === "parent-gate" && <ParentGate />}
      {view.name === "parent" && <ParentDashboard />}
      {view.name === "settings" && <Settings />}
      {view.name === "journal" && <Journal />}
    </div>
  );
}
