import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, test } from "bun:test";
import {
  DEFAULT_LOCALE,
  SITE_ORIGIN,
  canonicalUrlForLocale,
  languageAlternates,
  localeFromPath,
} from "../src/siteMetadata";
import { getAirportGuide, getLocaleCopy } from "../src/travelGuide";

describe("specification.website compliance surfaces", () => {
  test("publishes stable localized canonical URLs and alternates", () => {
    expect(DEFAULT_LOCALE).toBe("en");
    expect(canonicalUrlForLocale("en")).toBe(`${SITE_ORIGIN}/`);
    expect(canonicalUrlForLocale("de")).toBe(`${SITE_ORIGIN}/de/`);
    expect(canonicalUrlForLocale("sv")).toBe(`${SITE_ORIGIN}/sv/`);
    expect(languageAlternates().map((alternate) => alternate.locale)).toEqual([
      "en",
      "de",
      "sv",
      "x-default",
    ]);
    expect(localeFromPath("/de/")).toBe("de");
    expect(localeFromPath("/sv/?airport=munich")).toBe("sv");
    expect(localeFromPath("/")).toBeNull();
  });

  test("keeps localized page metadata translated", () => {
    expect(getLocaleCopy("en").metaDescription).toContain("Munich");
    expect(getLocaleCopy("de").metaDescription).toContain("München");
    expect(getLocaleCopy("sv").metaDescription).toContain("München");
  });

  test("guide JSON mirrors owned route data for agents", () => {
    const guideJson = JSON.parse(readFileSync("public/guide.json", "utf8"));
    const sourceGuide = getAirportGuide("munich", "en");

    expect(guideJson.url).toBe(SITE_ORIGIN);
    expect(guideJson.locales.en.airports.munich.route.stops).toEqual(
      sourceGuide.route.stops,
    );
    expect(guideJson.locales.de.airports.salzburg.ticketTip.body).toContain(
      "Postbus 260",
    );
  });

  test("Vercel CSP allows every inline JSON-LD block by hash only", () => {
    const vercelConfig = readFileSync("vercel.json", "utf8");
    const htmlFiles = ["index.html", "de/index.html", "sv/index.html"];

    for (const htmlFile of htmlFiles) {
      const html = readFileSync(htmlFile, "utf8");
      const scripts = [
        ...html.matchAll(
          /<script type="application\/ld\+json">\n([\s\S]*?)\n    <\/script>/g,
        ),
      ];

      expect(scripts).toHaveLength(1);
      const hash = createHash("sha256").update(scripts[0][1]).digest("base64");
      expect(vercelConfig).toContain(`'sha256-${hash}'`);
    }
    expect(vercelConfig).not.toContain("'unsafe-inline'");
  });
});
