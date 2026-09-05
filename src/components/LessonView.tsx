import { useEffect, useState } from "react";
import { getLesson, WORLDS } from "../data/curriculum";
import { getState } from "../data/states";
import { sounds } from "../lib/audio";
import { buildDeck, factId } from "../lib/quiz";
import { useActiveChild, useStore } from "../store/StoreContext";
import type { MatchQuestion, Question } from "../types";
import { Maggie } from "./Maggie";
import { Pip } from "./Pip";
import { StateSilhouette, UsaMap } from "./UsaMap";

export function LessonView({ lessonId }: { lessonId: string }) {
  const { state, dispatch } = useStore();
  const child = useActiveChild();
  const lesson = getLesson(lessonId);
  const [started, setStarted] = useState(false);
  const [deck] = useState(() => (lesson ? buildDeck(lesson) : []));
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [errors, setErrors] = useState(0);
  const [stateErrors, setStateErrors] = useState<Record<string, number>>({});
  const [factsFound, setFactsFound] = useState<string[]>([]);
  const [startedAt] = useState(() => Date.now());
  const [feedback, setFeedback] = useState<null | { ok: boolean; text: string; fact: string }>(null);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [leftPick, setLeftPick] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);

  useEffect(() => {
    setLeftPick(null);
    setMatched([]);
    setWrongId(null);
  }, [index]);

  if (!child || !lesson) return null;
  const world = WORLDS.find((item) => item.id === lesson.worldId);
  const question = deck[index];
  const progress = deck.length ? index / deck.length : 0;
  const pose = feedback?.ok === false ? "stumble" : feedback?.ok ? "celebrate" : started ? "idle" : "sit";
  const showMaggie = errors >= 3 && feedback?.ok === false;

  function finish() {
    dispatch({
      type: "record-session",
      lessonId,
      durationMs: Date.now() - startedAt,
      correct,
      errors,
      stateErrors,
      factsFound,
      finished: true,
    });
  }

  function mark(ok: boolean, q: Question, extraWrong?: string) {
    if (feedback) return;
    const stateId = q.kind === "match" ? q.left[0].id : q.stateId;
    if (ok) {
      if (state.settings.sound) sounds.correct();
      setCorrect((n) => n + 1);
      setFactsFound((list) => [...new Set([...list, factId(stateId, 0)])]);
      setFeedback({ ok: true, text: "Lantern lit!", fact: q.fact });
    } else {
      if (state.settings.sound) sounds.miss();
      setErrors((n) => n + 1);
      setStateErrors((map) => ({ ...map, [stateId]: (map[stateId] ?? 0) + 1 }));
      if (extraWrong) setWrongId(extraWrong);
      const answer = q.kind === "tap" || q.kind === "choice" ? q.answer : "the matching capitals";
      setFeedback({ ok: false, text: `Pip needed ${answer}.`, fact: q.fact });
    }
  }

  function next() {
    setFeedback(null);
    setWrongId(null);
    if (index + 1 >= deck.length) {
      finish();
      return;
    }
    setIndex((n) => n + 1);
  }

  function onMatch(side: "left" | "right", id: string, q: MatchQuestion) {
    if (feedback) return;
    if (side === "left") {
      setLeftPick(id);
      return;
    }
    if (!leftPick) return;
    if (q.pairs[leftPick] === id) {
      const nextMatched = [...matched, leftPick];
      setMatched(nextMatched);
      setLeftPick(null);
      if (state.settings.sound) sounds.combo();
      if (nextMatched.length === q.left.length) {
        mark(true, q);
      }
    } else {
      setLeftPick(null);
      mark(false, q);
    }
  }

  return (
    <div className="screen lesson-screen">
      <header className="lesson-top">
        <button className="text-back" onClick={() => dispatch({ type: "go", view: { name: "map" } })}>
          ← Camps
        </button>
        <div className="hud">
          <span>
            {world?.name} · <b>{lesson.title}</b>
          </span>
          <span>
            {index + (started ? 1 : 0)}/{deck.length}
          </span>
          <span>
            <b>{correct}</b> lit
          </span>
        </div>
      </header>

      {!started && (
        <section className="intro panel">
          <Pip coat={child.coat} pose="sit" size={110} />
          <p className="eyebrow">{world?.name}</p>
          <h2>{lesson.title}</h2>
          <p>{lesson.intro}</p>
          <p className="tip">{lesson.tip}</p>
          <button
            className="btn primary"
            onClick={() => {
              if (state.settings.sound) sounds.start();
              setStarted(true);
            }}
          >
            Light the first lantern
          </button>
        </section>
      )}

      {started && question && (
        <>
          <div className="lesson-stage">
            <div className="pip-column">
              <Pip coat={child.coat} pose={pose} size={108} />
              {showMaggie && <Maggie size={64} />}
              <div className="mini-bar" aria-hidden="true">
                <span style={{ width: `${Math.round(progress * 100)}%` }} />
              </div>
            </div>

            <section className="prompt-card panel">
              <p className="eyebrow">
                {question.skill.replace(/-/g, " ")}
                {feedback && question.kind !== "match" ? ` · ${getState(question.stateId).name}` : ""}
              </p>
              <h2>{question.prompt}</h2>

              {(question.kind === "tap" || (question.kind === "choice" && question.skill === "highlight-name")) && (
                <div className="play-map">
                  <UsaMap
                    regionId={lesson.regionId}
                    highlightId={question.kind === "choice" ? question.stateId : null}
                    zoomToId={question.stateId}
                    zoomMode={question.kind === "tap" ? "wide" : "tight"}
                    wrongId={wrongId}
                    litIds={factsFound.map((id) => id.split("-")[0])}
                    interactive={question.kind === "tap" && !feedback}
                    onSelect={(id) => {
                      if (question.kind !== "tap") return;
                      mark(id === question.stateId, question, id === question.stateId ? undefined : id);
                    }}
                    showLabels={state.settings.showLabels}
                    focusIds={lesson.stateIds}
                  />
                </div>
              )}

              {question.kind === "choice" && question.skill === "silhouette" && (
                <div className="play-map silhouette-wrap">
                  <StateSilhouette stateId={question.stateId} />
                </div>
              )}

              {question.kind === "choice" && (
                <div className="choice-grid">
                  {question.choices.map((choice) => (
                    <button
                      key={choice}
                      className="choice"
                      disabled={!!feedback}
                      onClick={() => mark(choice === question.answer, question)}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              )}

              {question.kind === "match" && (
                <div className="match-board">
                  <div className="match-col">
                    {question.left.map((item) => (
                      <button
                        key={item.id}
                        className={`choice ${leftPick === item.id ? "is-on" : ""} ${matched.includes(item.id) ? "is-lit" : ""}`}
                        disabled={!!feedback || matched.includes(item.id)}
                        onClick={() => onMatch("left", item.id, question)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <div className="match-col">
                    {question.right.map((item) => (
                      <button
                        key={item.id}
                        className={`choice ${matched.includes(item.id) ? "is-lit" : ""}`}
                        disabled={!!feedback || matched.includes(item.id)}
                        onClick={() => onMatch("right", item.id, question)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {feedback && (
                <div className={`feedback ${feedback.ok ? "is-ok" : "is-miss"}`}>
                  <strong>{feedback.text}</strong>
                  <p>{feedback.fact}</p>
                  {showMaggie && <p className="tip">Maggie the beagle wandered over to sniff the missed lantern. Try the next one — she only steals dirt, never stars.</p>}
                  <button className="btn primary" onClick={next}>
                    {index + 1 >= deck.length ? "See results" : "Next lantern"}
                  </button>
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
