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

  return (
    <div className={`app ${state.settings.highContrast ? "contrast" : ""}`}>
      {view.name === "title" && <TitleScreen />}
      {view.name === "profiles" && <ProfileSelect />}
      {view.name === "map" && <RegionMap />}
      {view.name === "lesson" && <LessonView lessonId={view.lessonId} />}
      {view.name === "results" && <Results lessonId={view.lessonId} sessionId={view.sessionId} />}
      {view.name === "parent-gate" && <ParentGate />}
      {view.name === "parent" && <ParentDashboard />}
      {view.name === "settings" && <Settings />}
      {view.name === "journal" && <Journal />}
    </div>
  );
}
