import { createHash } from "node:crypto";
import { mkdir, readFile } from "node:fs/promises";
import { dirname } from "node:path";
import sharp from "sharp";
import toIco from "to-ico";
import {
  AIRPORTS,
  getAirportGuide,
  getLocaleCopy,
  type AirportId,
  type Locale,
} from "../src/travelGuide";
import {
  LAST_CONTENT_UPDATE,
  SITE_NAME,
  SITE_ORIGIN,
  absoluteUrl,
  canonicalUrlForLocale,
  getLocaleMetadata,
  languageAlternates,
  orderedLocales,
} from "../src/siteMetadata";

const textEncoder = new TextEncoder();

async function writeText(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await Bun.write(path, content);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pageSchema(locale: Locale): string {
  const copy = getLocaleCopy(locale);
  const meta = getLocaleMetadata(locale);
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${SITE_ORIGIN}/#website`,
          url: SITE_ORIGIN + "/",
          name: meta.applicationName,
          inLanguage: meta.hreflang,
        },
        {
          "@type": "WebPage",
          "@id": `${canonicalUrlForLocale(locale)}#webpage`,
          url: canonicalUrlForLocale(locale),
          name: copy.metaTitle,
          description: copy.metaDescription,
          isPartOf: {
            "@id": `${SITE_ORIGIN}/#website`,
          },
          about: {
            "@type": "Place",
            name: "Kitzbühel",
            address: {
              "@type": "PostalAddress",
              addressCountry: "AT",
            },
          },
          inLanguage: meta.hreflang,
        },
      ],
    },
    null,
    8,
  );
}

function renderHead(locale: Locale): string {
  const copy = getLocaleCopy(locale);
  const meta = getLocaleMetadata(locale);
  const alternates = languageAlternates()
    .map(
      (alternate) =>
        `    <link rel="alternate" hreflang="${alternate.locale}" href="${alternate.href}" />`,
    )
    .join("\n");
  const ogAlternates = meta.alternateOgLocales
    .map((ogLocale) => `    <meta property="og:locale:alternate" content="${ogLocale}" />`)
    .join("\n");
  const schema = pageSchema(locale);

  return `    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(copy.metaDescription)}" />
    <meta name="robots" content="index, follow" />
    <meta name="application-name" content="${escapeHtml(meta.applicationName)}" />
    <meta name="theme-color" media="(prefers-color-scheme: light)" content="#244536" />
    <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#173126" />
    <meta name="color-scheme" content="light" />
    <link rel="canonical" href="${canonicalUrlForLocale(locale)}" />
${alternates}
    <link rel="alternate" type="text/markdown" href="${absoluteUrl("/guide.md")}" title="Kitzbühel rail guide Markdown source" />
    <link rel="alternate" type="application/json" href="${absoluteUrl("/guide.json")}" title="Kitzbühel rail guide data" />
    <link rel="describedby" type="text/markdown" href="${absoluteUrl("/llms.txt")}" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="alternate icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escapeHtml(meta.applicationName)}" />
    <meta property="og:title" content="${escapeHtml(copy.metaTitle)}" />
    <meta property="og:description" content="${escapeHtml(copy.metaDescription)}" />
    <meta property="og:url" content="${canonicalUrlForLocale(locale)}" />
    <meta property="og:locale" content="${meta.ogLocale}" />
${ogAlternates}
    <meta property="og:image" content="${absoluteUrl("/assets/hero-kitz-winter.webp")}" />
    <meta property="og:image:width" content="1672" />
    <meta property="og:image:height" content="941" />
    <meta property="og:image:alt" content="${escapeHtml(meta.ogImageAlt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(copy.metaTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(copy.metaDescription)}" />
    <meta name="twitter:image" content="${absoluteUrl("/assets/hero-kitz-winter.webp")}" />
    <meta name="twitter:image:alt" content="${escapeHtml(meta.ogImageAlt)}" />
    <title>${escapeHtml(copy.metaTitle)}</title>
    <script type="application/ld+json">
${schema
  .split("\n")
  .map((line) => `      ${line}`)
  .join("\n")}
    </script>`;
}

function localizeBody(body: string, locale: Locale): string {
  const copy = getLocaleCopy(locale);
  const replacements: Record<string, string> = {
    "skip-link": copy.skipLink,
    "hero-kicker": copy.heroKicker,
    "hero-title": copy.heroTitle,
    "hero-body": copy.heroBody,
    "selector-kicker": copy.selectorKicker,
    "selector-heading": copy.airportSelectorHeading,
    "selector-body": copy.airportSelectorBody,
    "reset-selection": copy.resetSelection,
    "footer-note": copy.footerNote,
    "privacy-link": copy.privacyLink,
    "llms-link": copy.llmsLink,
    "guide-data-link": copy.guideDataLink,
  };

  return Object.entries(replacements).reduce(
    (html, [key, value]) =>
      html.replace(
        new RegExp(`(<[^>]*data-copy="${key}"[^>]*>)([\\s\\S]*?)(</[^>]+>)`),
        `$1${escapeHtml(value)}$3`,
      ),
    body,
  );
}

async function generateLocalizedHtml(): Promise<void> {
  const rootHtml = await Bun.file("index.html").text();
  const body = rootHtml.slice(rootHtml.indexOf("  <body>"));

  for (const locale of ["de", "sv"] as const) {
    const html = `<!doctype html>
<html lang="${getLocaleMetadata(locale).hreflang}" data-initial-locale="${locale}">
  <head>
${renderHead(locale)}
  </head>
${localizeBody(body, locale)}`;
    await writeText(`${locale}/index.html`, html);
  }
}

function guideData() {
  return {
    name: SITE_NAME,
    url: SITE_ORIGIN,
    updated: LAST_CONTENT_UPDATE,
    locales: Object.fromEntries(
      orderedLocales.map((locale) => {
        const copy = getLocaleCopy(locale);
        return [
          locale,
          {
            url: canonicalUrlForLocale(locale),
            title: copy.metaTitle,
            description: copy.metaDescription,
            airports: Object.fromEntries(
              AIRPORTS.map(({ id }) => [id, getAirportGuide(id, locale)]),
            ) as Record<AirportId, ReturnType<typeof getAirportGuide>>,
          },
        ];
      }),
    ),
  };
}

function markdownForLocale(locale: Locale): string {
  const copy = getLocaleCopy(locale);
  const lines = [
    `## ${getLocaleMetadata(locale).nativeLabel}`,
    "",
    `Canonical URL: ${canonicalUrlForLocale(locale)}`,
    "",
    copy.metaDescription,
    "",
  ];

  for (const { id } of AIRPORTS) {
    const guide = getAirportGuide(id, locale);
    lines.push(`### ${guide.airportName}`);
    lines.push("");
    lines.push(`Airport code: ${guide.city}`);
    lines.push("");
    lines.push(`Apps: ${[...guide.apps.primary, ...guide.apps.secondary].map((app) => app.name).join(", ")}`);
    lines.push("");
    lines.push(`App note: ${guide.apps.note}`);
    lines.push("");
    lines.push(`Route: ${guide.route.stops.map((stop) => stop.label).join(" -> ")}`);
    lines.push("");
    lines.push(`Route note: ${guide.route.qualifier}`);
    lines.push("");
    lines.push(`Ticket tip: ${guide.ticketTip.title} ${guide.ticketTip.body}`);
    lines.push("");
    lines.push(`Connection watch-out: ${guide.connectionWatch.title} ${guide.connectionWatch.body}`);
    lines.push("");
    lines.push(`Flight planning: ${guide.flightPlanning.title} ${guide.flightPlanning.body}`);
    lines.push("");
  }

  return lines.join("\n");
}

async function generateMachineReadableGuide(): Promise<void> {
  const json = guideData();
  const frontmatter = `---
title: "${SITE_NAME}"
url: "${SITE_ORIGIN}/"
updated: "${LAST_CONTENT_UPDATE}"
locales: [en, de, sv]
---
`;
  const guideMarkdown = `${frontmatter}
# ${SITE_NAME}

> Compact airport-by-airport rail guidance for guests travelling to Kitzbühel from Munich, Salzburg, Innsbruck, or Vienna airport.

This markdown endpoint mirrors the public guide content without navigation, styling, or JavaScript. Use DB Navigator and ÖBB for live prices, platforms, and booking rules.

${orderedLocales.map(markdownForLocale).join("\n")}
`;

  await writeText("public/guide.json", `${JSON.stringify(json, null, 2)}\n`);
  await writeText("public/guide.md", guideMarkdown);
  await writeText(
    "public/llms.txt",
    `# ${SITE_NAME}

> Compact rail guidance for reaching Kitzbühel from MUC, Salzburg, Innsbruck, and Vienna airports.

The site is static, multilingual, and intentionally limited to app recommendations, route shapes, ticket caveats, connection warnings, and flight timing advice.

## Core

- [Guide page](${SITE_ORIGIN}/): Interactive airport selector.
- [Markdown source](${SITE_ORIGIN}/guide.md): Full guide content without layout or JavaScript.
- [Guide JSON](${SITE_ORIGIN}/guide.json): Structured airport, route, app, and advice data.
- [Structured data](${SITE_ORIGIN}/guide.schema.jsonld): Schema.org JSON-LD graph.
- [Sitemap](${SITE_ORIGIN}/sitemap.xml): Canonical public URLs.

## Policies

- [Privacy policy](${SITE_ORIGIN}/privacy/): Data-minimisation statement.
- [Security contact](${SITE_ORIGIN}/.well-known/security.txt): Responsible disclosure contact.
`,
  );
  await writeText("public/llms-full.txt", guideMarkdown);
}

async function generateStructuredData(): Promise<void> {
  const itemList = orderedLocales.flatMap((locale) =>
    AIRPORTS.map(({ id }, index) => {
      const guide = getAirportGuide(id, locale);
      return {
        "@type": "ListItem",
        position: index + 1,
        name: `${guide.airportName} to Kitzbühel`,
        url: `${canonicalUrlForLocale(locale)}?airport=${id}`,
        item: {
          "@type": "Trip",
          name: guide.route.title,
          itinerary: {
            "@type": "ItemList",
            itemListElement: guide.route.stops.map((stop, stopIndex) => ({
              "@type": "ListItem",
              position: stopIndex + 1,
              name: stop.label,
              url: stop.mapsUrl,
            })),
          },
          inLanguage: getLocaleMetadata(locale).hreflang,
        },
      };
    }),
  );

  await writeText(
    "public/guide.schema.jsonld",
    `${JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": `${SITE_ORIGIN}/guide.schema.jsonld`,
        name: SITE_NAME,
        url: SITE_ORIGIN + "/",
        dateModified: LAST_CONTENT_UPDATE,
        itemListElement: itemList,
      },
      null,
      2,
    )}\n`,
  );
  await writeText(
    "public/schemamap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<schemamap xmlns="https://specification.website/ns/schemamap">
  <resource>
    <loc>${SITE_ORIGIN}/</loc>
    <schema>${SITE_ORIGIN}/guide.schema.jsonld</schema>
  </resource>
</schemamap>
`,
  );
}

async function generateSitemapAndRobots(): Promise<void> {
  const urls = [
    { loc: SITE_ORIGIN + "/", lastmod: LAST_CONTENT_UPDATE },
    { loc: `${SITE_ORIGIN}/de/`, lastmod: LAST_CONTENT_UPDATE },
    { loc: `${SITE_ORIGIN}/sv/`, lastmod: LAST_CONTENT_UPDATE },
    { loc: `${SITE_ORIGIN}/privacy/`, lastmod: LAST_CONTENT_UPDATE },
  ];

  await writeText(
    "public/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>
`,
  );
  await writeText(
    "public/sitemap.xsl",
    `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" />
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>${SITE_NAME} sitemap</title>
      </head>
      <body>
        <h1>${SITE_NAME} sitemap</h1>
        <ul>
          <xsl:for-each select="sitemap:urlset/sitemap:url">
            <li><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc" /></a></li>
          </xsl:for-each>
        </ul>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
`,
  );
  await writeText(
    "public/robots.txt",
    `User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`,
  );
}

function appIconSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="${SITE_NAME}">
  <rect width="512" height="512" rx="96" fill="#244536"/>
  <path d="M96 330h320l-46 64H142l-46-64Z" fill="#f6efe3"/>
  <path d="M128 302c33-70 75-124 128-162 54 38 96 92 128 162H128Z" fill="#fffaf1"/>
  <path d="M256 140v162" stroke="#a0492e" stroke-width="24" stroke-linecap="round"/>
  <path d="M136 354h240" stroke="#c4883c" stroke-width="18" stroke-linecap="round"/>
  <circle cx="180" cy="394" r="20" fill="#173126"/>
  <circle cx="332" cy="394" r="20" fill="#173126"/>
</svg>
`;
}

async function generateIcons(): Promise<void> {
  const svg = appIconSvg();
  const svgBuffer = textEncoder.encode(svg);
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const png48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();

  await writeText("public/favicon.svg", svg);
  await Bun.write("public/favicon.ico", await toIco([png32, png48]));
  await Bun.write("public/apple-touch-icon.png", await sharp(svgBuffer).resize(180, 180).png().toBuffer());
  await Bun.write("public/icons/icon-192.png", await sharp(svgBuffer).resize(192, 192).png().toBuffer());
  await Bun.write("public/icons/icon-512.png", await sharp(svgBuffer).resize(512, 512).png().toBuffer());
  await Bun.write(
    "public/icons/maskable-512.png",
    await sharp(svgBuffer)
      .resize(512, 512)
      .extend({ top: 48, bottom: 48, left: 48, right: 48, background: "#244536" })
      .resize(512, 512)
      .png()
      .toBuffer(),
  );
}

async function generateManifest(): Promise<void> {
  await writeText(
    "public/site.webmanifest",
    `${JSON.stringify(
      {
        name: SITE_NAME,
        short_name: "Kitzbühel",
        description: getLocaleCopy("en").metaDescription,
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#f6efe3",
        theme_color: "#244536",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/icons/maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      null,
      2,
    )}\n`,
  );
}

async function generateWellKnown(): Promise<void> {
  const skillPath = "public/.well-known/agent-skills/rail-guide/SKILL.md";
  const skill = `---
name: rail-guide
description: Use this skill when an agent needs concise, source-of-truth travel guidance for rail journeys from Munich, Salzburg, Innsbruck, or Vienna airports to Kitzbühel.
---
# Kitzbühel Rail Guide

Use /guide.json for structured airport data, /guide.md for readable source text, and /guide.schema.jsonld for schema.org route markup. Treat DB Navigator and ÖBB as booking hand-off tools; do not invent live fares, platforms, or departure times.
`;
  await writeText(skillPath, skill);
  const digest = createHash("sha256").update(await readFile(skillPath)).digest("hex");

  await writeText(
    "public/.well-known/agent-skills/index.json",
    `${JSON.stringify(
      {
        $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
        skills: [
          {
            name: "rail-guide",
            type: "skill-md",
            description:
              "Use this skill for source-of-truth rail guidance from nearby airports to Kitzbühel.",
            url: `${SITE_ORIGIN}/.well-known/agent-skills/rail-guide/SKILL.md`,
            digest: `sha256:${digest}`,
          },
        ],
      },
      null,
      2,
    )}\n`,
  );
  await writeText(
    "public/.well-known/api-catalog",
    `${JSON.stringify(
      {
        linkset: [
          {
            anchor: SITE_ORIGIN + "/",
            describedby: [
              { href: `${SITE_ORIGIN}/llms.txt`, type: "text/markdown" },
              { href: `${SITE_ORIGIN}/guide.md`, type: "text/markdown" },
            ],
            alternate: [
              { href: `${SITE_ORIGIN}/guide.json`, type: "application/json" },
              { href: `${SITE_ORIGIN}/guide.schema.jsonld`, type: "application/ld+json" },
            ],
            sitemap: [{ href: `${SITE_ORIGIN}/sitemap.xml`, type: "application/xml" }],
            security: [
              {
                href: `${SITE_ORIGIN}/.well-known/security.txt`,
                type: "text/plain",
              },
            ],
            "agent-skills": [
              {
                href: `${SITE_ORIGIN}/.well-known/agent-skills/index.json`,
                type: "application/json",
              },
            ],
          },
        ],
      },
      null,
      2,
    )}\n`,
  );
  await writeText(
    "public/.well-known/security.txt",
    `Contact: https://github.com/GustavHenning/ez-kitz/security/advisories/new
Expires: 2027-05-31T00:00:00Z
Preferred-Languages: en, de, sv
Canonical: ${SITE_ORIGIN}/.well-known/security.txt
Policy: ${SITE_ORIGIN}/privacy/
`,
  );
}

async function generateImageFormats(): Promise<void> {
  const images = [
    "hero-kitz-spring",
    "hero-kitz-summer",
    "hero-kitz-autumn",
    "hero-kitz-winter",
    "train-divider-austrian",
  ];

  await Promise.all(
    images.map((name) =>
      sharp(`public/assets/${name}.png`)
        .webp({ quality: name.startsWith("hero") ? 78 : 72 })
        .toFile(`public/assets/${name}.webp`),
    ),
  );
}

async function main(): Promise<void> {
  await generateLocalizedHtml();
  await generateMachineReadableGuide();
  await generateStructuredData();
  await generateSitemapAndRobots();
  await generateIcons();
  await generateManifest();
  await generateWellKnown();
  await generateImageFormats();
}

await main();
