import { describe, expect, it } from "vitest";
import { ALL_STATE_IDS, LESSONS, WORLDS, getLesson } from "../data/curriculum";
import { REGION_STATES, STATES } from "../data/states";
import { STATE_PATHS } from "../data/usMap";
import { accuracyOf, buildDeck, buildMatch, evaluateQuiz, starsFor } from "./quiz";

function seeded(seed = 1): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

describe("curriculum", () => {
  it("covers each of the 50 states exactly once across the five regions", () => {
    expect(STATES).toHaveLength(50);
    const ids = STATES.map((s) => s.id);
    expect(new Set(ids).size).toBe(50);
    const assigned = Object.values(REGION_STATES).flat();
    expect(assigned.sort()).toEqual([...ids].sort());
    expect(assigned).toHaveLength(50);
  });

  it("has unique official capitals", () => {
    const capitals = STATES.map((s) => s.capital);
    expect(new Set(capitals).size).toBe(50);
  });

  it("gives every state two facts and a nickname", () => {
    for (const state of STATES) {
      expect(state.facts).toHaveLength(2);
      expect(state.nickname.length).toBeGreaterThan(3);
      expect(state.capital.length).toBeGreaterThan(2);
    }
  });

  it("has map paths for every state", () => {
    const pathIds = new Set(STATE_PATHS.map((p) => p.id));
    for (const state of STATES) {
      expect(pathIds.has(state.id)).toBe(true);
    }
  });

  it("numbers lessons in order and keeps world ids valid", () => {
    const worldIds = new Set(WORLDS.map((w) => w.id));
    LESSONS.forEach((lesson, i) => {
      expect(lesson.number).toBe(i + 1);
      expect(worldIds.has(lesson.worldId)).toBe(true);
      expect(lesson.stateIds.length).toBeGreaterThan(0);
      expect(lesson.questionCount).toBeGreaterThan(0);
    });
  });

  it("uses every state in at least one Night Atlas lesson", () => {
    const atlas = LESSONS.filter((lesson) => lesson.worldId === "night-atlas");
    const ids = new Set(atlas.flatMap((lesson) => lesson.stateIds));
    expect([...ids].sort()).toEqual([...ALL_STATE_IDS].sort());
  });
});

describe("quiz builder", () => {
  it("never puts the correct answer twice or omits it", () => {
    const lesson = getLesson("ne-capitals-north");
    if (!lesson) throw new Error("missing lesson");
    const deck = buildDeck(lesson, seeded(42));
    expect(deck.length).toBe(lesson.questionCount);
    for (const q of deck) {
      if (q.kind === "choice") {
        expect(q.choices).toContain(q.answer);
        expect(new Set(q.choices).size).toBe(q.choices.length);
        expect(q.choices.length).toBe(4);
      }
    }
  });

  it("builds four unique match pairs", () => {
    const q = buildMatch(["TX", "OK", "NM", "AZ", "CA"], seeded(7));
    expect(q.left).toHaveLength(4);
    expect(q.right).toHaveLength(4);
    expect(new Set(q.left.map((x) => x.id)).size).toBe(4);
    expect(Object.keys(q.pairs)).toHaveLength(4);
  });

  it("scores stars from accuracy gates", () => {
    expect(starsFor(false, 99)).toBe(0);
    expect(starsFor(true, 80)).toBe(1);
    expect(starsFor(true, 85)).toBe(2);
    expect(starsFor(true, 95)).toBe(3);
    expect(accuracyOf(9, 1)).toBe(90);
  });

  it("requires the Night Atlas exam to hit 85%", () => {
    const exam = getLesson("atlas-exam");
    if (!exam) throw new Error("missing exam");
    const miss = evaluateQuiz(exam, 13, 3);
    expect(miss.accuracy).toBeLessThan(85);
    expect(miss.passed).toBe(false);
    const pass = evaluateQuiz(exam, 14, 2);
    expect(pass.passed).toBe(true);
    expect(pass.stars).toBeGreaterThan(0);
  });

  it("lets early guides pass with a lower accuracy gate", () => {
    const lesson = getLesson("ne-meet");
    if (!lesson) throw new Error("missing guide");
    const result = evaluateQuiz(lesson, 4, 2);
    expect(result.passed).toBe(true);
  });
});
