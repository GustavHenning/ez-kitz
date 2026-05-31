import "./styles.css";
import { SEASON_CLASSES, getSeasonTheme } from "./seasonTheme";
import {
  canonicalUrlForLocale,
  getLocaleMetadata,
  languageAlternates,
  localeFromPath,
  pathForLocale,
} from "./siteMetadata";
import {
  AIRPORTS,
  type AirportGuide,
  type AirportId,
  type Locale,
  getAirportGuide,
  getLocaleCopy,
  normalizeAirport,
  normalizeLocale,
} from "./travelGuide";

const localeLinks = document.querySelectorAll<HTMLAnchorElement>("[data-locale]");
const airportSelector = document.querySelector<HTMLElement>("#airport-selector");
const result = document.querySelector<HTMLElement>("#result");
const resultShell = document.querySelector<HTMLElement>("#result-shell");
const resetButton = document.querySelector<HTMLButtonElement>("#reset-selection");

function readAirportFromUrl(): AirportId | null {
  return normalizeAirport(new URLSearchParams(window.location.search).get("airport"));
}

function readLocaleFromUrl(): Locale {
  return (
    localeFromPath(window.location.pathname) ||
    normalizeLocale(new URLSearchParams(window.location.search).get("lang"))
  );
}

let currentLocale: Locale = readLocaleFromUrl();
let selectedAirport: AirportId | null = readAirportFromUrl();

function applySeasonTheme(date: Date = new Date()): void {
  const theme = getSeasonTheme(date);
  document.documentElement.classList.remove(...SEASON_CLASSES);
  document.documentElement.classList.add(theme.documentClass);
  document.documentElement.dataset.season = theme.id;
}

function setText(selector: string, value: string): void {
  const node = document.querySelector<HTMLElement>(selector);
  if (node) node.textContent = value;
}

function setMeta(selector: string, value: string): void {
  const node = document.querySelector<HTMLMetaElement>(selector);
  if (node) node.content = value;
}

function setLink(selector: string, href: string): void {
  const node = document.querySelector<HTMLLinkElement>(selector);
  if (node) node.href = href;
}

function syncBrowserUrl(replace = false): void {
  const nextPath = pathForLocale(currentLocale, selectedAirport);
  const currentPath = `${window.location.pathname}${window.location.search}`;
  if (nextPath === currentPath) return;

  window.history[replace ? "replaceState" : "pushState"]({}, "", nextPath);
}

function renderHeadMetadata(): void {
  const copy = getLocaleCopy(currentLocale);
  const metadata = getLocaleMetadata(currentLocale);
  const canonicalUrl = canonicalUrlForLocale(currentLocale);

  document.documentElement.lang = metadata.hreflang;
  document.title = copy.metaTitle;

  setMeta("meta[name='description']", copy.metaDescription);
  setMeta("meta[name='application-name']", metadata.applicationName);
  setMeta("meta[property='og:title']", copy.metaTitle);
  setMeta("meta[property='og:description']", copy.metaDescription);
  setMeta("meta[property='og:url']", canonicalUrl);
  setMeta("meta[property='og:locale']", metadata.ogLocale);
  setMeta("meta[property='og:image:alt']", metadata.ogImageAlt);
  setMeta("meta[name='twitter:title']", copy.metaTitle);
  setMeta("meta[name='twitter:description']", copy.metaDescription);
  setMeta("meta[name='twitter:image:alt']", metadata.ogImageAlt);
  setLink("link[rel='canonical']", canonicalUrl);
}

function renderLocale(): void {
  const copy = getLocaleCopy(currentLocale);
  renderHeadMetadata();

  setText("[data-copy='hero-kicker']", copy.heroKicker);
  setText("[data-copy='skip-link']", copy.skipLink);
  setText("[data-copy='hero-title']", copy.heroTitle);
  setText("[data-copy='hero-body']", copy.heroBody);
  setText("[data-copy='selector-kicker']", copy.selectorKicker);
  setText("[data-copy='selector-heading']", copy.airportSelectorHeading);
  setText("[data-copy='selector-body']", copy.airportSelectorBody);
  setText("[data-copy='reset-selection']", copy.resetSelection);
  setText("[data-copy='privacy-link']", copy.privacyLink);
  setText("[data-copy='llms-link']", copy.llmsLink);
  setText("[data-copy='guide-data-link']", copy.guideDataLink);
  setText("[data-copy='footer-note']", copy.footerNote);
  airportSelector?.setAttribute("aria-label", copy.airportSelectorHeading);

  localeLinks.forEach((link) => {
    const locale = normalizeLocale(link.dataset.locale);
    const isActive = locale === currentLocale;
    const metadata = getLocaleMetadata(locale);

    link.href = pathForLocale(locale, selectedAirport);
    link.classList.toggle("is-active", isActive);
    link.setAttribute("aria-current", isActive ? "page" : "false");
    link.setAttribute("hreflang", metadata.hreflang);
  });

  renderAirportButtons();
  renderSelectedGuide();
}

function renderAirportButtons(): void {
  if (!airportSelector) return;

  const copy = getLocaleCopy(currentLocale);
  airportSelector.innerHTML = AIRPORTS.map(({ id }) => {
    const airport = copy.airports[id];
    const isSelected = id === selectedAirport;
    return `
      <button class="airport-option${isSelected ? " is-selected" : ""}" type="button" data-airport="${id}" aria-pressed="${isSelected}">
        <span class="airport-code">${airport.city}</span>
        <span class="airport-name">${airport.name}</span>
        <span class="airport-teaser">${airport.teaser}</span>
      </button>
    `;
  }).join("");

  airportSelector
    .querySelectorAll<HTMLButtonElement>("[data-airport]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        selectedAirport = button.dataset.airport as AirportId;
        syncBrowserUrl();
        renderLocale();
        resultShell?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
}

function renderSelectedGuide(): void {
  if (!result || !resultShell) return;

  if (!selectedAirport) {
    resultShell.hidden = true;
    result.innerHTML = "";
    return;
  }

  resultShell.hidden = false;
  const copy = getLocaleCopy(currentLocale);
  const guide = getAirportGuide(selectedAirport, currentLocale);

  result.innerHTML = `
    <header class="result-header">
      <div>
        <p class="section-kicker">${copy.resultHeadingPrefix} ${guide.city}</p>
        <h2>${guide.airportName}</h2>
      </div>
      <p>${guide.apps.note}</p>
    </header>
    <div class="guidance-grid">
      ${renderAppsBlock(guide, copy)}
      ${renderRouteBlock(guide, copy.routeBlockTitle)}
      ${renderAdviceBlock(copy.ticketBlockTitle, guide.ticketTip)}
      ${renderAdviceBlock(copy.watchBlockTitle, guide.connectionWatch)}
      ${renderAdviceBlock(copy.flightBlockTitle, guide.flightPlanning)}
    </div>
  `;
}

function renderAppsBlock(
  guide: AirportGuide,
  copy: ReturnType<typeof getLocaleCopy>,
): string {
  return `
    <section class="guidance-panel guidance-panel-wide">
      <p class="panel-label">${copy.appBlockTitle}</p>
      <div class="app-list" aria-label="${copy.officialApps}">
        ${[...guide.apps.primary, ...guide.apps.secondary]
          .map(
            (app) => `
              <a class="app-link" href="${app.href}" target="_blank" rel="noopener noreferrer">
                <span class="app-link-main">
                  <span class="app-icon app-icon-${app.brand}" aria-hidden="true">
                    <span>${app.mark}</span>
                  </span>
                  <span>
                    <strong>${app.name}</strong>
                    <small>${app.purpose}</small>
                  </span>
                </span>
                <span aria-hidden="true">↗</span>
              </a>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderRouteBlock(guide: AirportGuide, title: string): string {
  return `
    <section class="guidance-panel guidance-panel-wide">
      <p class="panel-label">${title}</p>
      <ol class="route-line">
        ${guide.route.stops
          .map(
            (stop) => `
              <li>
                <span class="route-dot" aria-hidden="true"></span>
                <a href="${stop.mapsUrl}" target="_blank" rel="noopener noreferrer">${stop.label}</a>
              </li>
            `,
          )
          .join("")}
      </ol>
      <p class="panel-note">${guide.route.qualifier}</p>
    </section>
  `;
}

function renderAdviceBlock(title: string, block: AirportGuide["ticketTip"]): string {
  return `
    <section class="guidance-panel">
      <p class="panel-label">${title}</p>
      <p class="advice-eyebrow">${block.eyebrow}</p>
      <h3>${block.title}</h3>
      <p>${block.body}</p>
    </section>
  `;
}

localeLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    currentLocale = normalizeLocale(link.dataset.locale);
    syncBrowserUrl();
    renderLocale();
  });
});

resetButton?.addEventListener("click", () => {
  selectedAirport = null;
  syncBrowserUrl();
  renderLocale();
  airportSelector?.scrollIntoView({ behavior: "smooth", block: "center" });
});

window.addEventListener("popstate", () => {
  currentLocale = readLocaleFromUrl();
  selectedAirport = readAirportFromUrl();
  renderLocale();
});

if (new URLSearchParams(window.location.search).has("lang")) {
  syncBrowserUrl(true);
}

for (const alternate of languageAlternates()) {
  const selector = `link[rel='alternate'][hreflang='${alternate.locale}']`;
  setLink(selector, alternate.href);
}

applySeasonTheme();
renderLocale();
