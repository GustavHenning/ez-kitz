import { describe, expect, test } from "bun:test";
import { getSeasonForDate, getSeasonTheme } from "../src/seasonTheme";

describe("season theme selection", () => {
  test("maps calendar dates to the four meteorological seasons", () => {
    expect(getSeasonForDate(new Date("2026-03-01T12:00:00Z"))).toBe("spring");
    expect(getSeasonForDate(new Date("2026-05-31T12:00:00Z"))).toBe("spring");
    expect(getSeasonForDate(new Date("2026-06-01T12:00:00Z"))).toBe("summer");
    expect(getSeasonForDate(new Date("2026-08-31T12:00:00Z"))).toBe("summer");
    expect(getSeasonForDate(new Date("2026-09-01T12:00:00Z"))).toBe("autumn");
    expect(getSeasonForDate(new Date("2026-11-30T12:00:00Z"))).toBe("autumn");
    expect(getSeasonForDate(new Date("2026-12-01T12:00:00Z"))).toBe("winter");
    expect(getSeasonForDate(new Date("2026-02-28T12:00:00Z"))).toBe("winter");
  });

  test("returns a deployable hero and body theme for the active season", () => {
    const theme = getSeasonTheme(new Date("2026-07-15T12:00:00Z"));

    expect(theme.id).toBe("summer");
    expect(theme.heroImage).toBe("/assets/hero-kitz-summer.webp");
    expect(theme.documentClass).toBe("season-summer");
  });
});
