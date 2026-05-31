# ez-kitz
Describes how to reach Kitzbühel

## Product direction

The site is a static, rail-first decision guide for guests traveling to Kitzbühel from nearby airports. It should explain recommended booking apps, typical route patterns, and ticket caveats, then hand users off to DB Navigator or ÖBB for exact departures, prices, and platform details.

The first screen should use progressive disclosure: show language controls, a concise "Travel to Kitzbühel" title, and four airport choices only. After the visitor selects Munich, Salzburg, Innsbruck, or Vienna airport, reveal the app recommendation, best route pattern, and ticket tips for that airport.

App guidance should be airport-specific. For trips starting in Germany and continuing to Austria, especially Munich Airport, advise guests to download both DB Navigator and ÖBB and compare prices because fares can differ significantly. DB Navigator is generally cheaper for these cross-border trips and can usually book the full journey in one app. For Salzburg, Innsbruck, and Vienna, ÖBB should be the primary app recommendation.

For Munich Airport, present the standard route shape as MUC airport -> München Ost -> Kufstein -> Wörgl -> Kitzbühel. Explain that not every connection exposes Kufstein and Wörgl as transfer stops, so visitors should follow the app itinerary instead of forcing every station manually.

For Munich-origin trips, present Bayern Ticket as a conditional money-saving tip rather than the default route. It can be worth checking when two or more people travel together, especially if they route via Kufstein and buy the onward Austrian leg to Kitzbühel separately. The same route is also useful for travelers who already have a Deutschlandticket because it may reduce the German-leg cost; the Austrian onward leg still needs checking and booking as required.

Munich guidance should also warn that German trains are frequently delayed. Travelers can usually take later connections, but they should check that later options exist, especially when arriving late in the day or when returning to the airport for a flight.

For Salzburg, Innsbruck, and Vienna, use the same compact pattern: airport -> main station -> likely rail route toward Kitzbühel -> one "watch out" note. Salzburg Airport should route via Salzburg Hbf, then toward Kitzbühel, often via Wörgl. Innsbruck Airport should route via Innsbruck Hbf, then toward Kitzbühel, often via Wörgl. Vienna Airport should route via Wien Hbf, then toward Kitzbühel on the westbound Railjet corridor, usually via Wörgl.

Salzburg guidance should also mention the public bus alternative from Salzburg Airport: Postbus 260 toward Lofer, then bus 4012 onward via St. Johann i. Tirol to Kitzbühel. Keep the train route as the default recommendation and present the bus as a fallback or scenic option that requires careful departure checks.

Locales should be natural guest-facing copy rather than strict word-for-word translations. English is the default/fallback. German should use familiar rail terms such as Hbf, Umstieg, ÖBB, and DB Navigator. Swedish should stay plain and practical, explaining local rail terms where needed.

The visual design should use the same kind of layout grammar as the reference site: a full-width photographic hero, generous vertical rhythm, soft section transitions, and tasteful decorative details. The identity should shift to a Tyrolean travel style through fonts, colors, and imagery: alpine/Kitzbühel cues, grounded natural colors, and practical travel UI rather than wedding-invitation styling.

The site should automatically switch between four seasonal themes based on the visitor's current date. Use meteorological seasons: spring March-May, summer June-August, autumn September-November, and winter December-February. Each season should have its own Tyrolean rail hero image and matching palette.

Each airport result should stay limited to four blocks: apps to download, recommended route shape, ticket or money tip, and delay or connection watch-out. Do not include detailed platform guidance, exact train numbers, full timetables, taxi/private-transfer alternatives, or deep fare rules. Hand users back to DB Navigator and ÖBB for those details.

Connection advice should remind travelers to check transfer times, especially when traveling with skis or bulky luggage. Some itineraries have less than 10 minutes between trains, and Wörgl is a common place where travelers may need to move quickly to catch the next connection.

Flight booking advice should recommend arriving before roughly 15:00-16:00 in the afternoon and booking return flights after roughly 14:00 when possible. The train journey between Kitzbühel and the airports can take several hours, and travelers may need a safety margin for delayed trains, missed connections, luggage, and airport procedures.

## Development

This is a Bun-managed Vite static site intended for later Vercel deployment.

```bash
bun install
bun run generate:public
bun test
bun run typecheck
bun run build
bun run dev
```

Vercel should use the repository's `vercel.json`: install with `bun install`, build with `bun run build`, and serve the generated `dist` directory.

## Public specification surfaces

The site publishes static discovery and compliance files generated from the same guide data as the UI:

- `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/llms-full.txt`, `/guide.md`, `/guide.json`, and `/guide.schema.jsonld`
- `/.well-known/api-catalog`, `/.well-known/security.txt`, and `/.well-known/agent-skills/index.json`
- `/de/` and `/sv/` localized entry pages with translated metadata and reciprocal `hreflang`

`bun run build` runs `bun run generate:public` first, so Vercel receives the generated locale pages, WebP assets, icons, and machine-readable files.
