import { describe, expect, it } from "vitest";
import { SMALL_STATES } from "../data/usMap";
import {
  areaRatio,
  easeInOutCubic,
  formatViewBox,
  lerpViewBox,
  parseViewBox,
  shouldZoomToState,
  zoomViewBox,
} from "./mapView";

describe("map view", () => {
  it("parses and formats viewBoxes", () => {
    expect(parseViewBox("710 12 245 280")).toEqual([710, 12, 245, 280]);
    expect(formatViewBox([710.126, 12.4, 245, 280])).toBe("710.13 12.4 245 280");
  });

  it("interpolates a zoom halfway", () => {
    const mid = lerpViewBox([0, 0, 100, 100], [40, 40, 20, 20], 0.5);
    expect(mid).toEqual([20, 20, 60, 60]);
  });

  it("eases slowly at the start and end", () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(1)).toBe(1);
    expect(easeInOutCubic(0.25)).toBeLessThan(0.25);
    expect(easeInOutCubic(0.75)).toBeGreaterThan(0.75);
  });

  it("zooms tiny states on the Northeast camp map", () => {
    const northeast: [number, number, number, number] = [710, 12, 245, 280];
    const rhodeIsland = { x: 872, y: 170, width: 10, height: 12 };
    expect(shouldZoomToState("RI", rhodeIsland, northeast, SMALL_STATES)).toBe(true);
    expect(areaRatio(rhodeIsland, northeast)).toBeLessThan(0.01);
    const zoomed = zoomViewBox(rhodeIsland, "tight");
    expect(zoomed[2]).toBeGreaterThan(rhodeIsland.width);
    expect(zoomed[2]).toBeLessThan(90);
    expect(zoomed[2] * zoomed[3]).toBeLessThan((northeast[2] * northeast[3]) / 4);
  });

  it("does not zoom a large state that already fills the view", () => {
    const southwest: [number, number, number, number] = [110, 270, 440, 325];
    const texas = { x: 250, y: 330, width: 280, height: 220 };
    expect(shouldZoomToState("TX", texas, southwest, SMALL_STATES)).toBe(false);
  });
});
