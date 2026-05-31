import type { AirportId, Locale } from "./travelGuide";

export const SITE_ORIGIN = "https://ez-kitz.vercel.app";
export const SITE_NAME = "Kitzbühel rail guide";
export const DEFAULT_LOCALE: Locale = "en";
export const LAST_CONTENT_UPDATE = "2026-05-31";

export type LocaleMetadata = {
  locale: Locale;
  href: string;
  hreflang: string;
  ogLocale: string;
  alternateOgLocales: string[];
  nativeLabel: string;
  shortLabel: string;
  flagClass: string;
  applicationName: string;
  ogImageAlt: string;
};

export const orderedLocales: Locale[] = ["en", "de", "sv"];

export const localeMetadata: Record<Locale, LocaleMetadata> = {
  en: {
    locale: "en",
    href: "/",
    hreflang: "en",
    ogLocale: "en_GB",
    alternateOgLocales: ["de_DE", "sv_SE"],
    nativeLabel: "English",
    shortLabel: "EN",
    flagClass: "flag-gb",
    applicationName: "Kitzbühel rail guide",
    ogImageAlt: "A Tyrolean rail scene with mountains above Kitzbühel.",
  },
  de: {
    locale: "de",
    href: "/de/",
    hreflang: "de",
    ogLocale: "de_DE",
    alternateOgLocales: ["en_GB", "sv_SE"],
    nativeLabel: "Deutsch",
    shortLabel: "DE",
    flagClass: "flag-de",
    applicationName: "Bahn-Guide Kitzbühel",
    ogImageAlt: "Eine Tiroler Bahnlandschaft mit Bergen oberhalb von Kitzbühel.",
  },
  sv: {
    locale: "sv",
    href: "/sv/",
    hreflang: "sv",
    ogLocale: "sv_SE",
    alternateOgLocales: ["en_GB", "de_DE"],
    nativeLabel: "Svenska",
    shortLabel: "SV",
    flagClass: "flag-se",
    applicationName: "Tågguide Kitzbühel",
    ogImageAlt: "Ett tyrolskt tågmotiv med berg ovanför Kitzbühel.",
  },
};

export function getLocaleMetadata(locale: Locale): LocaleMetadata {
  return localeMetadata[locale];
}

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_ORIGIN).toString();
}

export function canonicalPathForLocale(locale: Locale): string {
  return localeMetadata[locale].href;
}

export function canonicalUrlForLocale(locale: Locale): string {
  return absoluteUrl(canonicalPathForLocale(locale));
}

export function localeFromPath(pathname: string): Locale | null {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return firstSegment === "de" || firstSegment === "sv" ? firstSegment : null;
}

export function pathForLocale(locale: Locale, airportId: AirportId | null): string {
  const url = new URL(canonicalPathForLocale(locale), SITE_ORIGIN);
  if (airportId) {
    url.searchParams.set("airport", airportId);
  }
  return `${url.pathname}${url.search}`;
}

export function languageAlternates(): Array<{ locale: Locale | "x-default"; href: string }> {
  return [
    ...orderedLocales.map((locale) => ({
      locale,
      href: canonicalUrlForLocale(locale),
    })),
    { locale: "x-default", href: canonicalUrlForLocale(DEFAULT_LOCALE) },
  ];
}
