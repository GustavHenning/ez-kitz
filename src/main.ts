import "./styles.css";
import { SEASON_CLASSES, getSeasonTheme } from "./seasonTheme";
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

const localeButtons = document.querySelectorAll<HTMLButtonElement>("[data-locale]");
const airportSelector = document.querySelector<HTMLElement>("#airport-selector");
const result = document.querySelector<HTMLElement>("#result");
const resultShell = document.querySelector<HTMLElement>("#result-shell");
const resetButton = document.querySelector<HTMLButtonElement>("#reset-selection");

let currentLocale: Locale = normalizeLocale(
  new URLSearchParams(window.location.search).get("lang") ||
    window.localStorage.getItem("ez-kitz-locale") ||
    navigator.language.slice(0, 2),
);
let selectedAirport: AirportId | null = normalizeAirport(
  new URLSearchParams(window.location.search).get("airport"),
);

function applySeasonTheme(date: Date = new Date()): void {
  const theme = getSeasonTheme(date);
  document.documentElement.classList.remove(...SEASON_CLASSES);
  document.documentElement.classList.add(theme.documentClass);
  document.documentElement.dataset.season = theme.id;
  document.documentElement.style.setProperty(
    "--season-hero-image",
    `url("${theme.heroImage}")`,
  );
}

function setText(selector: string, value: string): void {
  const node = document.querySelector<HTMLElement>(selector);
  if (node) node.textContent = value;
}

function renderLocale(): void {
  const copy = getLocaleCopy(currentLocale);
  document.documentElement.lang = currentLocale;
  document.title = copy.metaTitle;

  setText("[data-copy='hero-kicker']", copy.heroKicker);
  setText("[data-copy='hero-title']", copy.heroTitle);
  setText("[data-copy='hero-body']", copy.heroBody);
  setText("[data-copy='selector-kicker']", copy.selectorKicker);
  setText("[data-copy='selector-heading']", copy.airportSelectorHeading);
  setText("[data-copy='selector-body']", copy.airportSelectorBody);
  setText("[data-copy='reset-selection']", copy.resetSelection);
  setText("[data-copy='footer-note']", copy.footerNote);

  localeButtons.forEach((button) => {
    const isActive = button.dataset.locale === currentLocale;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
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
              <a class="app-link" href="${app.href}" target="_blank" rel="noreferrer">
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
                <a href="${stop.mapsUrl}" target="_blank" rel="noreferrer">${stop.label}</a>
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

localeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentLocale = normalizeLocale(button.dataset.locale);
    window.localStorage.setItem("ez-kitz-locale", currentLocale);
    renderLocale();
  });
});

resetButton?.addEventListener("click", () => {
  selectedAirport = null;
  renderLocale();
  airportSelector?.scrollIntoView({ behavior: "smooth", block: "center" });
});

applySeasonTheme();
renderLocale();
