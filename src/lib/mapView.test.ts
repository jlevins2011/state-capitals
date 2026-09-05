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

const NORTHEAST: [number, number, number, number] = [710, 12, 245, 280];

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

  it("zooms Rhode Island in close on the Northeast camp map", () => {
    const rhodeIsland = { x: 872, y: 168, width: 14, height: 16 };
    expect(shouldZoomToState("RI", rhodeIsland, NORTHEAST, SMALL_STATES)).toBe(true);
    expect(areaRatio(rhodeIsland, NORTHEAST)).toBeLessThan(0.01);
    const zoomed = zoomViewBox(rhodeIsland, "tight", NORTHEAST);
    expect(zoomed[2]).toBeGreaterThan(rhodeIsland.width);
    expect(zoomed[2]).toBeLessThan(110);
    expect(zoomed[2]).toBeLessThan(NORTHEAST[2] * 0.45);
    expect(zoomed[2] * zoomed[3]).toBeLessThan((NORTHEAST[2] * NORTHEAST[3]) / 5);
  });

  it("still zooms Connecticut enough to fill the frame", () => {
    const connecticut = { x: 781, y: 125, width: 80, height: 100 };
    const zoomed = zoomViewBox(connecticut, "tight", NORTHEAST);
    expect(zoomed[2]).toBeLessThan(NORTHEAST[2] * 0.45);
    expect(zoomed[3]).toBeLessThan(NORTHEAST[3] * 0.45);
  });

  it("does not zoom a large state that already fills the view", () => {
    const southwest: [number, number, number, number] = [110, 270, 440, 325];
    const texas = { x: 250, y: 330, width: 280, height: 220 };
    expect(shouldZoomToState("TX", texas, southwest, SMALL_STATES)).toBe(false);
  });
});
