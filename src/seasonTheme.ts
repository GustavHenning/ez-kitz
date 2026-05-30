export type Season = "spring" | "summer" | "autumn" | "winter";

export type SeasonTheme = {
  id: Season;
  documentClass: `season-${Season}`;
  heroImage: string;
};

const seasonThemes: Record<Season, SeasonTheme> = {
  spring: {
    id: "spring",
    documentClass: "season-spring",
    heroImage: "/assets/hero-kitz-spring.png",
  },
  summer: {
    id: "summer",
    documentClass: "season-summer",
    heroImage: "/assets/hero-kitz-summer.png",
  },
  autumn: {
    id: "autumn",
    documentClass: "season-autumn",
    heroImage: "/assets/hero-kitz-autumn.png",
  },
  winter: {
    id: "winter",
    documentClass: "season-winter",
    heroImage: "/assets/hero-kitz-winter.png",
  },
};

export const SEASON_CLASSES = Object.values(seasonThemes).map(
  (theme) => theme.documentClass,
);

export function getSeasonForDate(date: Date): Season {
  const month = date.getMonth();

  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

export function getSeasonTheme(date: Date = new Date()): SeasonTheme {
  return seasonThemes[getSeasonForDate(date)];
}
