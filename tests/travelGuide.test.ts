import { describe, expect, test } from "bun:test";
import {
  AIRPORTS,
  getAirportGuide,
  getLocaleCopy,
  normalizeAirport,
  normalizeLocale,
} from "../src/travelGuide";

describe("travel guide contract", () => {
  test("keeps the airport selector focused on the four supported arrival airports", () => {
    expect(AIRPORTS.map((airport) => airport.id)).toEqual([
      "munich",
      "salzburg",
      "innsbruck",
      "vienna",
    ]);
  });

  test("falls back unsupported locales to English", () => {
    expect(normalizeLocale("de")).toBe("de");
    expect(normalizeLocale("sv")).toBe("sv");
    expect(normalizeLocale("fr")).toBe("en");
    expect(getLocaleCopy("fr").airportSelectorHeading).toBe(
      "Choose your arrival airport",
    );
  });

  test("accepts only known airports for deep links", () => {
    expect(normalizeAirport("munich")).toBe("munich");
    expect(normalizeAirport("vienna")).toBe("vienna");
    expect(normalizeAirport("paris")).toBeNull();
    expect(normalizeAirport(null)).toBeNull();
  });

  test("recommends both rail apps for Munich because cross-border prices can differ", () => {
    const guide = getAirportGuide("munich", "en");

    expect(guide.apps.primary.map((app) => app.name)).toEqual([
      "DB Navigator",
      "ÖBB",
    ]);
    expect(guide.apps.note).toContain("Both DB Navigator and ÖBB");
    expect(guide.apps.note).toContain("whole journey");
    expect(guide.apps.note).toContain("DB Navigator often tends to be cheaper");
    expect(guide.ticketTip.title).toContain("Bayern Ticket");
    expect(guide.ticketTip.body).toContain("Deutschlandticket");
    expect(guide.connectionWatch.body).toContain("German trains");
  });

  test("keeps Austrian airport guidance ÖBB-first", () => {
    for (const airport of ["salzburg", "innsbruck", "vienna"] as const) {
      const guide = getAirportGuide(airport, "en");

      expect(guide.apps.primary[0]?.name).toBe("ÖBB");
      expect(guide.apps.secondary).toEqual([]);
      expect(guide.route.stops.at(-1)?.label).toBe("Kitzbühel");
    }
  });

  test("includes Salzburg public bus guidance without replacing train as the default", () => {
    const guide = getAirportGuide("salzburg", "en");

    expect(guide.route.title).toContain("Salzburg Hbf");
    expect(guide.ticketTip.title).toContain("public bus");
    expect(guide.ticketTip.body).toContain("Postbus 260");
    expect(guide.ticketTip.body).toContain("bus 4012");
    expect(guide.ticketTip.body).toContain("Lofer");
  });

  test("documents route shapes without forcing every stop into every itinerary", () => {
    const munich = getAirportGuide("munich", "en");
    const salzburg = getAirportGuide("salzburg", "en");

    expect(munich.route.stops.map((stop) => stop.label)).toEqual([
      "MUC airport",
      "München Ost",
      "Kufstein",
      "Wörgl",
      "Kitzbühel",
    ]);
    expect(munich.route.qualifier).toContain("not every connection");
    expect(salzburg.route.qualifier).toContain("often via Wörgl");
  });

  test("exposes Google Maps links for each route stop", () => {
    const guide = getAirportGuide("munich", "en");

    expect(guide.route.stops).toHaveLength(5);
    for (const stop of guide.route.stops) {
      expect(stop.mapsUrl).toStartWith("https://www.google.com/maps/search/?api=1&query=");
    }
    expect(guide.route.stops[0]?.mapsUrl).toContain("Munich%20Airport");
    expect(guide.route.stops.at(-1)?.mapsUrl).toContain("Kitzb%C3%BChel%20Bahnhof");
  });

  test("surfaces luggage, short-transfer, and flight-time safety advice", () => {
    const guide = getAirportGuide("vienna", "en");

    expect(guide.connectionWatch.body).toContain("skis");
    expect(guide.connectionWatch.body).toContain("less than 10 minutes");
    expect(guide.flightPlanning.body).toContain("15:00-16:00");
    expect(guide.flightPlanning.body).toContain("after 14:00");
  });
});
