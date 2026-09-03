import { describe, expect, it } from "vitest";
import { LESSONS } from "../data/curriculum";
import { isLessonUnlocked, recommendedLessonId } from "./stats";
import type { Child } from "../types";

function childWith(passed: string[]): Child {
  return {
    id: "c1",
    name: "Spencer",
    coat: "ember",
    createdAt: 1,
    sessions: [],
    factsFound: [],
    completedLessons: Object.fromEntries(
      passed.map((id) => [id, { stars: 1, bestAccuracy: 80, attempts: 1, completedAt: 1 }]),
    ),
  };
}

describe("unlocks", () => {
  it("opens the first lesson and gates the rest", () => {
    const child = childWith([]);
    expect(isLessonUnlocked(child, LESSONS[0].id)).toBe(true);
    expect(isLessonUnlocked(child, LESSONS[1].id)).toBe(false);
    expect(recommendedLessonId(child)).toBe(LESSONS[0].id);
  });

  it("unlocks the next lesson after a star", () => {
    const child = childWith([LESSONS[0].id]);
    expect(isLessonUnlocked(child, LESSONS[1].id)).toBe(true);
    expect(isLessonUnlocked(child, LESSONS[2].id)).toBe(false);
    expect(recommendedLessonId(child)).toBe(LESSONS[1].id);
  });
});
