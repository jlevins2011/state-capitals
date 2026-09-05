import { LESSONS } from "../data/curriculum";
import type { Lesson } from "../types";

export function lessonShowsAbbreviations(lesson: Lesson): boolean {
  if (lesson.worldId === "night-atlas") return false;
  if (lesson.kind === "guide") return true;
  if (lesson.kind !== "map") return false;
  const firstMap = LESSONS.find((item) => item.worldId === lesson.worldId && item.kind === "map");
  return firstMap?.id === lesson.id;
}
