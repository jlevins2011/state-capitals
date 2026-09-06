import { useEffect } from "react";
import { getLesson, nextLessonId, WORLDS } from "../data/curriculum";
import { getState } from "../data/states";
import { sounds } from "../lib/audio";
import { useActiveChild, useStore } from "../store/StoreContext";
import { Pip } from "./Pip";

function formatPlayTime(ms: number): string {
  const secs = Math.max(1, Math.round(ms / 1000));
  if (secs < 60) return `${secs}s`;
  const mins = Math.floor(secs / 60);
  const rem = secs % 60;
  return `${mins}m ${rem}s`;
}

export function Results({ lessonId, sessionId }: { lessonId: string; sessionId: string }) {
  const { state, dispatch } = useStore();
  const child = useActiveChild();
  const lesson = getLesson(lessonId);
  const session = child?.sessions.find((item) => item.id === sessionId);
  const next = nextLessonId(lessonId);

  useEffect(() => {
    if (session?.passed && state.settings.sound) sounds.star();
  }, [session?.passed, state.settings.sound]);

  if (!child || !lesson || !session) return null;
  const world = WORLDS.find((w) => w.id === lesson.worldId);
  const weak = Object.entries(session.stateErrors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  let headline = "Pip is proud of that practice.";
  let body = "Every run lights a little more of the map.";
  if (session.passed && session.stars >= 3) {
    headline = "Lanterns blazing!";
    body = "Shapes, capitals, and stories — that was a keeper’s run.";
  } else if (session.passed && session.stars === 2) {
    headline = "The camp is bright.";
    body = "Great accuracy. One more smooth trail and the third star is yours.";
  } else if (session.passed) {
    headline = "Path unlocked.";
    body = "You hit the score Pip needed. Replay for more stars whenever you like.";
  } else if (lesson.kind === "exam") {
    headline = "Passport still waiting.";
    body = `Aim for ${lesson.goals.accuracy}% accuracy. Warm up on the earlier lanterns, then try again.`;
  } else {
    headline = "A little practice. A brighter trail.";
    body = `Try to land ${lesson.goals.accuracy}% accuracy. The map does not go anywhere.`;
  }

  return (
    <div className="screen results">
      <p className="eyebrow">
        {world?.name} · Lesson {lesson.number}
      </p>
      <Pip coat={child.coat} pose={session.passed ? "celebrate" : "sit"} size={120} />
      <h1>{headline}</h1>
      <p className="lede">{body}</p>
      <div className="star-row" aria-label={`${session.stars} stars`}>
        {[1, 2, 3].map((n) => (
          <span key={n} className={n <= session.stars ? "star on" : "star"}>
            ★
          </span>
        ))}
      </div>
      <div className="stat-grid">
        <div>
          <b>{session.accuracy}%</b>
          <span>accuracy</span>
        </div>
        <div>
          <b>{session.correct}</b>
          <span>lanterns lit</span>
        </div>
        <div>
          <b>{session.errors}</b>
          <span>misses</span>
        </div>
        <div>
          <b>{formatPlayTime(session.durationMs)}</b>
          <span>time</span>
        </div>
      </div>
      {session.passed && <div className="reward-note"><b>{lesson.kind === "exam" ? `✧ ${world?.name} passport stamped` : "✦ Another light on your expedition"}</b><p>{lesson.kind === "exam" ? "Your stamp is waiting on the expedition map." : `${new Set(session.factsFound.map(id => id.split("-")[0])).size} states explored on this trail. Find their stories in your journal.`}</p></div>}
      {weak.length > 0 && (
        <p className="weak">
          Practice next:{" "}
          {weak.map(([id, n]) => `${getState(id).name} (${n})`).join(" · ")}
        </p>
      )}
      {weak.length > 0 && <div className="review-cards">{weak.map(([id]) => <div className="review-card" key={id}><b>{getState(id).name}</b><span>{getState(id).capital}</span></div>)}</div>}
      <div className="row-actions">
        <button className="btn ghost" onClick={() => dispatch({ type: "go", view: { name: "map" } })}>
          Camps
        </button>
        <button className="btn ghost" onClick={() => dispatch({ type: "go", view: { name: "lesson", lessonId } })}>
          Try again
        </button>
        {session.passed && next && (
          <button className="btn primary" onClick={() => dispatch({ type: "go", view: { name: "lesson", lessonId: next } })}>
            Next trail
          </button>
        )}
        {session.passed && !next && (
          <button className="btn primary" onClick={() => dispatch({ type: "go", view: { name: "map" } })}>
            You finished Camp Compass
          </button>
        )}
      </div>
    </div>
  );
}
