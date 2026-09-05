import { describe, expect, it } from "vitest";
import { PAIR_TONES, pairTone } from "./matchPairs";

describe("match pair colors", () => {
  it("gives each pair a different tone", () => {
    const tones = [0, 1, 2, 3].map(pairTone);
    const backgrounds = new Set(tones.map((tone) => tone.bg));
    expect(backgrounds.size).toBe(4);
    expect(tones[0]).toEqual(PAIR_TONES[0]);
  });

  it("wraps after four pairs", () => {
    expect(pairTone(4)).toEqual(PAIR_TONES[0]);
  });
});
