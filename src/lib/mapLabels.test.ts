import { describe, expect, it } from "vitest";
import { getLesson } from "../data/curriculum";
import { lessonShowsAbbreviations } from "./mapLabels";

function lesson(id: string) {
  const found = getLesson(id);
  if (!found) throw new Error(`missing ${id}`);
  return found;
}

describe("map abbreviations", () => {
  it("keeps postal codes on each camp meet and first scout trail", () => {
    expect(lessonShowsAbbreviations(lesson("ne-meet"))).toBe(true);
    expect(lessonShowsAbbreviations(lesson("ne-shapes"))).toBe(true);
    expect(lessonShowsAbbreviations(lesson("se-meet"))).toBe(true);
    expect(lessonShowsAbbreviations(lesson("se-coast"))).toBe(true);
    expect(lessonShowsAbbreviations(lesson("sw-map"))).toBe(true);
  });

  it("hides them on later maps, exams, and Night Atlas", () => {
    expect(lessonShowsAbbreviations(lesson("ne-mid"))).toBe(false);
    expect(lessonShowsAbbreviations(lesson("ne-exam"))).toBe(false);
    expect(lessonShowsAbbreviations(lesson("se-inland"))).toBe(false);
    expect(lessonShowsAbbreviations(lesson("se-exam"))).toBe(false);
    expect(lessonShowsAbbreviations(lesson("sw-exam"))).toBe(false);
    expect(lessonShowsAbbreviations(lesson("atlas-review"))).toBe(false);
    expect(lessonShowsAbbreviations(lesson("atlas-exam"))).toBe(false);
  });
});
