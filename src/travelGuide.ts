export type Locale = "en" | "de" | "sv";

export type AirportId = "munich" | "salzburg" | "innsbruck" | "vienna";

export type TravelApp = {
  name: "DB Navigator" | "ÖBB";
  brand: "db" | "oebb";
  mark: "DB" | "ÖBB";
  href: string;
  purpose: string;
};

export type RouteStop = {
  label: string;
  mapsUrl: string;
};

export type AdviceBlock = {
  eyebrow: string;
  title: string;
  body: string;
};

export type AirportGuide = {
  airportId: AirportId;
  airportName: string;
  city: string;
  apps: {
    primary: TravelApp[];
    secondary: TravelApp[];
    note: string;
  };
  route: {
    title: string;
    stops: RouteStop[];
    qualifier: string;
  };
  ticketTip: AdviceBlock;
  connectionWatch: AdviceBlock;
  flightPlanning: AdviceBlock;
};

export type LocaleCopy = {
  locale: Locale;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroKicker: string;
  heroBody: string;
  selectorKicker: string;
  airportSelectorHeading: string;
  airportSelectorBody: string;
  resultHeadingPrefix: string;
  appBlockTitle: string;
  routeBlockTitle: string;
  ticketBlockTitle: string;
  watchBlockTitle: string;
  flightBlockTitle: string;
  officialApps: string;
  openApp: string;
  skipLink: string;
  resetSelection: string;
  privacyLink: string;
  llmsLink: string;
  guideDataLink: string;
  footerNote: string;
  airports: Record<AirportId, { name: string; city: string; teaser: string }>;
};

const DB_NAVIGATOR_URL = "https://int.bahn.de/en/booking-information/db-navigator";
const OEBB_APP_URL =
  "https://www.oebb.at/en/tickets-kundenkarten/online-mobile-ticketing/oebb-app";

export const AIRPORTS: Array<{ id: AirportId }> = [
  { id: "munich" },
  { id: "salzburg" },
  { id: "innsbruck" },
  { id: "vienna" },
];

const localeCopies: Record<Locale, LocaleCopy> = {
  en: {
    locale: "en",
    metaTitle: "Travel to Kitzbühel by train",
    metaDescription:
      "A compact rail guide for reaching Kitzbühel from Munich, Salzburg, Innsbruck, or Vienna airport.",
    heroTitle: "Train routes to Kitzbühel",
    heroKicker: "MUC · Salzburg · Innsbruck · Vienna",
    heroBody:
      "A compact airport-by-airport guide for guests arriving in Tirol by rail.",
    selectorKicker: "Airport first",
    airportSelectorHeading: "Choose your arrival airport",
    airportSelectorBody:
      "Start with the airport. The guide then shows only the apps, route, ticket tip, and connection warning that matter for that journey.",
    resultHeadingPrefix: "From",
    appBlockTitle: "Apps to download",
    routeBlockTitle: "Recommended route shape",
    ticketBlockTitle: "Ticket tip",
    watchBlockTitle: "Connection watch-out",
    flightBlockTitle: "Before booking flights",
    officialApps: "Official app links",
    openApp: "Open",
    skipLink: "Skip to main content",
    resetSelection: "Choose another airport",
    privacyLink: "Privacy",
    llmsLink: "llms.txt",
    guideDataLink: "Guide data",
    footerNote:
      "Use this as orientation only. Always confirm current departures, fares, platforms, and ticket validity in DB Navigator or ÖBB before booking.",
    airports: {
      munich: {
        name: "Munich Airport",
        city: "MUC",
        teaser: "Best when comparing DB and ÖBB prices.",
      },
      salzburg: {
        name: "Salzburg Airport",
        city: "SZG",
        teaser: "A short hop to Salzburg Hbf, then west toward Tirol.",
      },
      innsbruck: {
        name: "Innsbruck Airport",
        city: "INN",
        teaser: "The closest airport, usually via Innsbruck Hbf.",
      },
      vienna: {
        name: "Vienna Airport",
        city: "VIE",
        teaser: "Longer rail day on the westbound Railjet corridor.",
      },
    },
  },
  de: {
    locale: "de",
    metaTitle: "Mit dem Zug nach Kitzbühel",
    metaDescription:
      "Ein kompakter Bahn-Guide nach Kitzbühel ab den Flughäfen München, Salzburg, Innsbruck und Wien.",
    heroTitle: "Zugrouten nach Kitzbühel",
    heroKicker: "MUC · Salzburg · Innsbruck · Wien",
    heroBody:
      "Ein kompakter Flughafen-Guide für Gäste, die per Bahn nach Tirol reisen.",
    selectorKicker: "Flughafen zuerst",
    airportSelectorHeading: "Ankunftsflughafen wählen",
    airportSelectorBody:
      "Wähle zuerst den Flughafen. Danach zeigen wir nur die Apps, Route, Spartipps und Umstiegs-Hinweise, die für diese Reise wichtig sind.",
    resultHeadingPrefix: "Ab",
    appBlockTitle: "Apps herunterladen",
    routeBlockTitle: "Empfohlene Route",
    ticketBlockTitle: "Ticket-Tipp",
    watchBlockTitle: "Umstieg beachten",
    flightBlockTitle: "Vor der Flugbuchung",
    officialApps: "Offizielle App-Links",
    openApp: "Öffnen",
    skipLink: "Zum Hauptinhalt springen",
    resetSelection: "Anderen Flughafen wählen",
    privacyLink: "Datenschutz",
    llmsLink: "llms.txt",
    guideDataLink: "Guide-Daten",
    footerNote:
      "Nur zur Orientierung. Prüfe aktuelle Abfahrten, Preise, Bahnsteige und Ticketgültigkeit immer in DB Navigator oder ÖBB vor der Buchung.",
    airports: {
      munich: {
        name: "Flughafen München",
        city: "MUC",
        teaser: "Gut zum Preisvergleich zwischen DB und ÖBB.",
      },
      salzburg: {
        name: "Flughafen Salzburg",
        city: "SZG",
        teaser: "Kurz zum Salzburg Hbf, dann westwärts Richtung Tirol.",
      },
      innsbruck: {
        name: "Flughafen Innsbruck",
        city: "INN",
        teaser: "Der nächste Flughafen, meist über Innsbruck Hbf.",
      },
      vienna: {
        name: "Flughafen Wien",
        city: "VIE",
        teaser: "Längere Bahnfahrt über die westliche Railjet-Achse.",
      },
    },
  },
  sv: {
    locale: "sv",
    metaTitle: "Tåg till Kitzbühel",
    metaDescription:
      "En kompakt tågguide till Kitzbühel från flygplatserna München, Salzburg, Innsbruck och Wien.",
    heroTitle: "Tågvägar till Kitzbühel",
    heroKicker: "MUC · Salzburg · Innsbruck · Wien",
    heroBody:
      "En kompakt flygplatsguide för gäster som fortsätter med tåg till Tyrolen.",
    selectorKicker: "Flygplats först",
    airportSelectorHeading: "Välj ankomstflygplats",
    airportSelectorBody:
      "Börja med flygplatsen. Guiden visar sedan bara apparna, rutten, biljettrådet och bytesvarningen som gäller för resan.",
    resultHeadingPrefix: "Från",
    appBlockTitle: "Appar att ladda ner",
    routeBlockTitle: "Rekommenderad rutt",
    ticketBlockTitle: "Biljettråd",
    watchBlockTitle: "Håll koll på byten",
    flightBlockTitle: "Innan ni bokar flyg",
    officialApps: "Officiella applänkar",
    openApp: "Öppna",
    skipLink: "Hoppa till huvudinnehåll",
    resetSelection: "Välj annan flygplats",
    privacyLink: "Integritet",
    llmsLink: "llms.txt",
    guideDataLink: "Guidedata",
    footerNote:
      "Använd detta som orientering. Kontrollera alltid aktuella avgångar, priser, perronger och biljettregler i DB Navigator eller ÖBB innan bokning.",
    airports: {
      munich: {
        name: "Münchens flygplats",
        city: "MUC",
        teaser: "Bäst att jämföra priser mellan DB och ÖBB.",
      },
      salzburg: {
        name: "Salzburgs flygplats",
        city: "SZG",
        teaser: "Kort väg till Salzburg Hbf och sedan västerut mot Tyrolen.",
      },
      innsbruck: {
        name: "Innsbrucks flygplats",
        city: "INN",
        teaser: "Närmaste flygplatsen, oftast via Innsbruck Hbf.",
      },
      vienna: {
        name: "Wiens flygplats",
        city: "VIE",
        teaser: "Längre tågresa västerut på Railjet-sträckan.",
      },
    },
  },
};

const dbNavigator = (purpose: string): TravelApp => ({
  name: "DB Navigator",
  brand: "db",
  mark: "DB",
  href: DB_NAVIGATOR_URL,
  purpose,
});

const oebbApp = (purpose: string): TravelApp => ({
  name: "ÖBB",
  brand: "oebb",
  mark: "ÖBB",
  href: OEBB_APP_URL,
  purpose,
});

type GuideCopy = {
  appNote: string;
  apps: { primary: TravelApp[]; secondary: TravelApp[] };
  routeTitle: string;
  routeQualifier: string;
  ticketTip: AdviceBlock;
  connectionWatch: AdviceBlock;
  flightPlanning: AdviceBlock;
};

const sharedConnectionWatch: Record<Locale, AdviceBlock> = {
  en: {
    eyebrow: "Transfers",
    title: "Check short connections before you commit.",
    body:
      "Some itineraries give you less than 10 minutes between trains. In Wörgl this can mean moving quickly between connections, especially with skis or bulky luggage.",
  },
  de: {
    eyebrow: "Umstieg",
    title: "Prüfe knappe Umstiege vor der Buchung.",
    body:
      "Manche Verbindungen haben weniger als 10 Minuten Umstiegszeit. In Wörgl kann das bedeuten, dass man mit Skiern oder großem Gepäck zügig zum nächsten Zug muss.",
  },
  sv: {
    eyebrow: "Byten",
    title: "Kontrollera korta byten innan ni bokar.",
    body:
      "Vissa förbindelser har mindre än 10 minuter mellan tågen. I Wörgl kan man behöva skynda till nästa tåg, särskilt med skidor eller stort bagage.",
  },
};

const sharedFlightPlanning: Record<Locale, AdviceBlock> = {
  en: {
    eyebrow: "Flights",
    title: "Leave daylight and buffer for the rail leg.",
    body:
      "If possible, book arrival flights that land before roughly 15:00-16:00 and return flights after 14:00. The train ride to or from the airport takes several hours, so a safety margin helps with delays, luggage, and airport procedures.",
  },
  de: {
    eyebrow: "Flüge",
    title: "Plane Tageslicht und Puffer für die Bahnfahrt ein.",
    body:
      "Wenn möglich, Ankunftsflüge vor ungefähr 15:00-16:00 und Rückflüge nach 14:00 buchen. Die Zugfahrt zum oder vom Flughafen dauert mehrere Stunden; ein Puffer hilft bei Verspätungen, Gepäck und Abläufen am Flughafen.",
  },
  sv: {
    eyebrow: "Flyg",
    title: "Lämna dagsljus och marginal för tågresan.",
    body:
      "Boka om möjligt ankomstflyg som landar före ungefär 15:00-16:00 och hemresor efter 14:00. Tågresan till eller från flygplatsen tar flera timmar, så marginal behövs för förseningar, bagage och flygplatsrutiner.",
  },
};

const guideCopies: Record<Locale, Record<AirportId, GuideCopy>> = {
  en: {
    munich: {
      appNote:
        "Download both apps and compare prices. Both DB Navigator and ÖBB can usually book the whole journey, but DB Navigator often tends to be cheaper for Germany-to-Austria trips.",
      apps: {
        primary: [
          dbNavigator("Usually the first place to compare and book Munich-to-Kitzbühel trips."),
          oebbApp("Useful for checking the Austrian leg and comparing cross-border fares."),
        ],
        secondary: [],
      },
      routeTitle: "MUC airport -> München Ost -> Kufstein -> Wörgl -> Kitzbühel",
      routeQualifier:
        "Treat this as the common route shape: not every connection shows Kufstein and Wörgl as transfer stops, so follow the app itinerary.",
      ticketTip: {
        eyebrow: "Money tip",
        title: "Bayern Ticket or Deutschlandticket can change the math.",
        body:
          "For two or more people, check whether a Bayern Ticket plus a separate Kufstein-to-Kitzbühel leg is worth it. This route can also be a good choice for travelers with a Deutschlandticket; the Austrian leg still needs checking and booking as required.",
      },
      connectionWatch: {
        eyebrow: "Delays",
        title: "Expect German delays and check later options.",
        body:
          "German trains are frequently delayed. You can usually take later connections, but check that they exist, especially when arriving late or returning to the airport for a flight. Also watch for Wörgl transfers under 10 minutes if you travel with skis.",
      },
      flightPlanning: sharedFlightPlanning.en,
    },
    salzburg: {
      appNote:
        "ÖBB is the main app for this Austrian-led journey. Use it for the airport-to-Hbf connection and onward rail options.",
      apps: {
        primary: [oebbApp("Best primary app for Salzburg-to-Kitzbühel planning and booking.")],
        secondary: [],
      },
      routeTitle: "Salzburg Airport -> Salzburg Hbf -> Wörgl -> Kitzbühel",
      routeQualifier:
        "The rail route is often via Wörgl, though the exact transfer pattern depends on the departure you choose.",
      ticketTip: {
        eyebrow: "Bus option",
        title: "There is also a public bus route from the airport.",
        body:
          "Salzburg Airport lists Postbus 260 from the airport toward Lofer, then bus 4012 onward via St. Johann i. Tirol to Kitzbühel. Treat it as a fallback or scenic option and check departures carefully, because bus connections can be less frequent than trains.",
      },
      connectionWatch: sharedConnectionWatch.en,
      flightPlanning: sharedFlightPlanning.en,
    },
    innsbruck: {
      appNote:
        "ÖBB is the main app for the shortest rail approach. Check bus or local transfer timing into Innsbruck Hbf before choosing a train.",
      apps: {
        primary: [oebbApp("Best primary app for Innsbruck-to-Kitzbühel planning and booking.")],
        secondary: [],
      },
      routeTitle: "Innsbruck Airport -> Innsbruck Hbf -> Wörgl -> Kitzbühel",
      routeQualifier:
        "The train portion often changes around Wörgl, but some departures may show a different transfer pattern.",
      ticketTip: {
        eyebrow: "Money tip",
        title: "Closest airport usually means fewer moving parts.",
        body:
          "Innsbruck is often the easiest arrival if flight times work. Still check whether a short airport-to-Hbf transfer leaves enough time with luggage.",
      },
      connectionWatch: sharedConnectionWatch.en,
      flightPlanning: sharedFlightPlanning.en,
    },
    vienna: {
      appNote:
        "ÖBB is the main app for the westbound Railjet corridor from Vienna Airport or Wien Hbf toward Tirol.",
      apps: {
        primary: [oebbApp("Best primary app for Vienna-to-Kitzbühel planning and booking.")],
        secondary: [],
      },
      routeTitle: "Vienna Airport -> Wien Hbf -> Wörgl -> Kitzbühel",
      routeQualifier:
        "Plan for a longer westbound rail journey, usually on the Railjet corridor with a transfer toward Kitzbühel around Wörgl.",
      ticketTip: {
        eyebrow: "Money tip",
        title: "Book early if Vienna is your best flight option.",
        body:
          "Vienna can work well when flights are better, but the rail day is longer. Compare earlier departures and leave more buffer than for Innsbruck or Salzburg.",
      },
      connectionWatch: sharedConnectionWatch.en,
      flightPlanning: sharedFlightPlanning.en,
    },
  },
  de: {
    munich: {
      appNote:
        "Beide Apps herunterladen und Preise vergleichen. DB Navigator und ÖBB können meist die ganze Strecke buchen, aber bei Deutschland-nach-Österreich-Reisen ist DB Navigator oft günstiger.",
      apps: {
        primary: [
          dbNavigator("Meist der erste Preis- und Buchungsvergleich für München nach Kitzbühel."),
          oebbApp("Hilfreich für den österreichischen Abschnitt und den Tarifvergleich."),
        ],
        secondary: [],
      },
      routeTitle: "Flughafen MUC -> München Ost -> Kufstein -> Wörgl -> Kitzbühel",
      routeQualifier:
        "Das ist die typische Routenform. Nicht jede Verbindung zeigt Kufstein und Wörgl als Umstieg, deshalb der App-Verbindung folgen.",
      ticketTip: {
        eyebrow: "Spartipp",
        title: "Bayern Ticket oder Deutschlandticket können sich lohnen.",
        body:
          "Ab zwei Personen prüfen, ob Bayern Ticket plus separates Ticket von Kufstein nach Kitzbühel günstiger ist. Für Reisende mit Deutschlandticket ist diese Route ebenfalls interessant; der österreichische Abschnitt muss trotzdem geprüft und ggf. gebucht werden.",
      },
      connectionWatch: {
        eyebrow: "Verspätungen",
        title: "Mit Verspätungen in Deutschland rechnen.",
        body:
          "Deutsche Züge sind häufig verspätet. Meist kann man spätere Anschlüsse nehmen, aber prüfe, ob es sie gibt, besonders bei später Ankunft oder Rückfahrt zum Flughafen. In Wörgl auch auf Umstiege unter 10 Minuten achten, vor allem mit Skiern.",
      },
      flightPlanning: sharedFlightPlanning.de,
    },
    salzburg: {
      appNote:
        "ÖBB ist die wichtigste App für diese Reise innerhalb Österreichs. Dort lassen sich die Verbindung zum Hbf und die Weiterfahrt gut prüfen.",
      apps: {
        primary: [oebbApp("Beste Haupt-App für Salzburg nach Kitzbühel.")],
        secondary: [],
      },
      routeTitle: "Flughafen Salzburg -> Salzburg Hbf -> Wörgl -> Kitzbühel",
      routeQualifier:
        "Die Bahnstrecke läuft oft über Wörgl. Die genaue Umstiegsfolge hängt von der gewählten Verbindung ab.",
      ticketTip: {
        eyebrow: "Bus-Option",
        title: "Es gibt auch eine öffentliche Busroute ab dem Flughafen.",
        body:
          "Der Flughafen Salzburg nennt Postbus 260 vom Flughafen Richtung Lofer und danach Bus 4012 weiter über St. Johann i. Tirol nach Kitzbühel. Als Alternative oder landschaftlich schöne Option prüfen, aber Abfahrten genau kontrollieren, weil Busverbindungen seltener sein können als Züge.",
      },
      connectionWatch: sharedConnectionWatch.de,
      flightPlanning: sharedFlightPlanning.de,
    },
    innsbruck: {
      appNote:
        "ÖBB ist die wichtigste App für die kürzeste Anreise. Prüfe vorher den Bus oder lokalen Transfer zum Innsbruck Hbf.",
      apps: {
        primary: [oebbApp("Beste Haupt-App für Innsbruck nach Kitzbühel.")],
        secondary: [],
      },
      routeTitle: "Flughafen Innsbruck -> Innsbruck Hbf -> Wörgl -> Kitzbühel",
      routeQualifier:
        "Der Bahnabschnitt wechselt oft rund um Wörgl. Manche Verbindungen zeigen aber ein anderes Umstiegsmuster.",
      ticketTip: {
        eyebrow: "Spartipp",
        title: "Der nächste Flughafen hat meist weniger Reibung.",
        body:
          "Innsbruck ist oft am einfachsten, wenn die Flugzeiten passen. Trotzdem prüfen, ob der Transfer zum Hbf mit Gepäck genug Zeit lässt.",
      },
      connectionWatch: sharedConnectionWatch.de,
      flightPlanning: sharedFlightPlanning.de,
    },
    vienna: {
      appNote:
        "ÖBB ist die wichtigste App für die westliche Railjet-Achse vom Flughafen Wien oder Wien Hbf Richtung Tirol.",
      apps: {
        primary: [oebbApp("Beste Haupt-App für Wien nach Kitzbühel.")],
        secondary: [],
      },
      routeTitle: "Flughafen Wien -> Wien Hbf -> Wörgl -> Kitzbühel",
      routeQualifier:
        "Mit einer längeren westwärts führenden Bahnfahrt rechnen, meist per Railjet und mit Umstieg Richtung Kitzbühel rund um Wörgl.",
      ticketTip: {
        eyebrow: "Spartipp",
        title: "Früh buchen, wenn Wien die beste Flugoption ist.",
        body:
          "Wien funktioniert gut bei besseren Flugzeiten, aber die Bahnfahrt ist länger. Frühere Abfahrten vergleichen und mehr Puffer einplanen als bei Innsbruck oder Salzburg.",
      },
      connectionWatch: sharedConnectionWatch.de,
      flightPlanning: sharedFlightPlanning.de,
    },
  },
  sv: {
    munich: {
      appNote:
        "Ladda ner båda apparna och jämför priser. Både DB Navigator och ÖBB kan oftast boka hela resan, men DB Navigator brukar vara billigare för resor från Tyskland till Österrike.",
      apps: {
        primary: [
          dbNavigator("Ofta bästa första appen för att jämföra och boka München till Kitzbühel."),
          oebbApp("Bra för den österrikiska delen och för att jämföra gränsöverskridande priser."),
        ],
        secondary: [],
      },
      routeTitle: "MUC flygplats -> München Ost -> Kufstein -> Wörgl -> Kitzbühel",
      routeQualifier:
        "Se detta som en vanlig ruttform. Alla förbindelser visar inte Kufstein och Wörgl som byten, så följ appens resplan.",
      ticketTip: {
        eyebrow: "Spara pengar",
        title: "Bayern Ticket eller Deutschlandticket kan ändra priset.",
        body:
          "Om ni är minst två personer, kontrollera om Bayern Ticket plus separat biljett från Kufstein till Kitzbühel lönar sig. Rutten kan också passa den som redan har Deutschlandticket; den österrikiska delen måste ändå kontrolleras och bokas vid behov.",
      },
      connectionWatch: {
        eyebrow: "Förseningar",
        title: "Räkna med tyska förseningar och kontrollera senare tåg.",
        body:
          "Tyska tåg är ofta försenade. Man kan oftast ta senare anslutningar, men kontrollera att de finns, särskilt vid sen ankomst eller när ni ska tillbaka till flygplatsen. I Wörgl kan byten under 10 minuter vara stressiga med skidor.",
      },
      flightPlanning: sharedFlightPlanning.sv,
    },
    salzburg: {
      appNote:
        "ÖBB är huvudappen för den här österrikiska resan. Använd den för anslutningen till Hbf och vidare tåg mot Kitzbühel.",
      apps: {
        primary: [oebbApp("Bästa huvudappen för Salzburg till Kitzbühel.")],
        secondary: [],
      },
      routeTitle: "Salzburgs flygplats -> Salzburg Hbf -> Wörgl -> Kitzbühel",
      routeQualifier:
        "Tågresan går ofta via Wörgl, men exakt byte beror på avgången ni väljer.",
      ticketTip: {
        eyebrow: "Bussalternativ",
        title: "Det finns också en offentlig bussväg från flygplatsen.",
        body:
          "Salzburgs flygplats listar Postbus 260 från flygplatsen mot Lofer och sedan buss 4012 vidare via St. Johann i. Tirol till Kitzbühel. Se det som ett reserv- eller utsiktsalternativ och kontrollera avgångarna noga, eftersom bussförbindelser kan gå mer sällan än tågen.",
      },
      connectionWatch: sharedConnectionWatch.sv,
      flightPlanning: sharedFlightPlanning.sv,
    },
    innsbruck: {
      appNote:
        "ÖBB är huvudappen för den kortaste tågresan. Kontrollera bussen eller transfern till Innsbruck Hbf innan ni väljer tåg.",
      apps: {
        primary: [oebbApp("Bästa huvudappen för Innsbruck till Kitzbühel.")],
        secondary: [],
      },
      routeTitle: "Innsbrucks flygplats -> Innsbruck Hbf -> Wörgl -> Kitzbühel",
      routeQualifier:
        "Tågdelen byter ofta kring Wörgl, men vissa avgångar kan visa ett annat bytesmönster.",
      ticketTip: {
        eyebrow: "Spara pengar",
        title: "Närmaste flygplats ger oftast minst krångel.",
        body:
          "Innsbruck är ofta enklast om flygtiderna passar. Kontrollera ändå att transfern till Hbf ger tillräckligt med tid med bagage.",
      },
      connectionWatch: sharedConnectionWatch.sv,
      flightPlanning: sharedFlightPlanning.sv,
    },
    vienna: {
      appNote:
        "ÖBB är huvudappen för Railjet-sträckan västerut från Wiens flygplats eller Wien Hbf mot Tyrolen.",
      apps: {
        primary: [oebbApp("Bästa huvudappen för Wien till Kitzbühel.")],
        secondary: [],
      },
      routeTitle: "Wiens flygplats -> Wien Hbf -> Wörgl -> Kitzbühel",
      routeQualifier:
        "Räkna med en längre tågdag västerut, oftast på Railjet-sträckan med byte mot Kitzbühel runt Wörgl.",
      ticketTip: {
        eyebrow: "Spara pengar",
        title: "Boka tidigt om Wien är bästa flygalternativet.",
        body:
          "Wien kan fungera bra när flygen passar bättre, men tågdagen är längre. Jämför tidiga avgångar och lämna mer marginal än för Innsbruck eller Salzburg.",
      },
      connectionWatch: sharedConnectionWatch.sv,
      flightPlanning: sharedFlightPlanning.sv,
    },
  },
};

const mapsUrl = (query: string): string =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const routeStops: Record<
  Locale,
  Record<AirportId, Array<{ label: string; mapsQuery: string }>>
> = {
  en: {
    munich: [
      { label: "MUC airport", mapsQuery: "Munich Airport" },
      { label: "München Ost", mapsQuery: "München Ost station" },
      { label: "Kufstein", mapsQuery: "Kufstein Bahnhof" },
      { label: "Wörgl", mapsQuery: "Wörgl Hauptbahnhof" },
      { label: "Kitzbühel", mapsQuery: "Kitzbühel Bahnhof" },
    ],
    salzburg: [
      { label: "Salzburg Airport", mapsQuery: "Salzburg Airport" },
      { label: "Salzburg Hbf", mapsQuery: "Salzburg Hauptbahnhof" },
      { label: "Wörgl", mapsQuery: "Wörgl Hauptbahnhof" },
      { label: "Kitzbühel", mapsQuery: "Kitzbühel Bahnhof" },
    ],
    innsbruck: [
      { label: "Innsbruck Airport", mapsQuery: "Innsbruck Airport" },
      { label: "Innsbruck Hbf", mapsQuery: "Innsbruck Hauptbahnhof" },
      { label: "Wörgl", mapsQuery: "Wörgl Hauptbahnhof" },
      { label: "Kitzbühel", mapsQuery: "Kitzbühel Bahnhof" },
    ],
    vienna: [
      { label: "Vienna Airport", mapsQuery: "Vienna International Airport" },
      { label: "Wien Hbf", mapsQuery: "Wien Hauptbahnhof" },
      { label: "Wörgl", mapsQuery: "Wörgl Hauptbahnhof" },
      { label: "Kitzbühel", mapsQuery: "Kitzbühel Bahnhof" },
    ],
  },
  de: {
    munich: [
      { label: "Flughafen MUC", mapsQuery: "Flughafen München" },
      { label: "München Ost", mapsQuery: "München Ost Bahnhof" },
      { label: "Kufstein", mapsQuery: "Kufstein Bahnhof" },
      { label: "Wörgl", mapsQuery: "Wörgl Hauptbahnhof" },
      { label: "Kitzbühel", mapsQuery: "Kitzbühel Bahnhof" },
    ],
    salzburg: [
      { label: "Flughafen Salzburg", mapsQuery: "Flughafen Salzburg" },
      { label: "Salzburg Hbf", mapsQuery: "Salzburg Hauptbahnhof" },
      { label: "Wörgl", mapsQuery: "Wörgl Hauptbahnhof" },
      { label: "Kitzbühel", mapsQuery: "Kitzbühel Bahnhof" },
    ],
    innsbruck: [
      { label: "Flughafen Innsbruck", mapsQuery: "Flughafen Innsbruck" },
      { label: "Innsbruck Hbf", mapsQuery: "Innsbruck Hauptbahnhof" },
      { label: "Wörgl", mapsQuery: "Wörgl Hauptbahnhof" },
      { label: "Kitzbühel", mapsQuery: "Kitzbühel Bahnhof" },
    ],
    vienna: [
      { label: "Flughafen Wien", mapsQuery: "Flughafen Wien-Schwechat" },
      { label: "Wien Hbf", mapsQuery: "Wien Hauptbahnhof" },
      { label: "Wörgl", mapsQuery: "Wörgl Hauptbahnhof" },
      { label: "Kitzbühel", mapsQuery: "Kitzbühel Bahnhof" },
    ],
  },
  sv: {
    munich: [
      { label: "MUC flygplats", mapsQuery: "Munich Airport" },
      { label: "München Ost", mapsQuery: "München Ost station" },
      { label: "Kufstein", mapsQuery: "Kufstein Bahnhof" },
      { label: "Wörgl", mapsQuery: "Wörgl Hauptbahnhof" },
      { label: "Kitzbühel", mapsQuery: "Kitzbühel Bahnhof" },
    ],
    salzburg: [
      { label: "Salzburgs flygplats", mapsQuery: "Salzburg Airport" },
      { label: "Salzburg Hbf", mapsQuery: "Salzburg Hauptbahnhof" },
      { label: "Wörgl", mapsQuery: "Wörgl Hauptbahnhof" },
      { label: "Kitzbühel", mapsQuery: "Kitzbühel Bahnhof" },
    ],
    innsbruck: [
      { label: "Innsbrucks flygplats", mapsQuery: "Innsbruck Airport" },
      { label: "Innsbruck Hbf", mapsQuery: "Innsbruck Hauptbahnhof" },
      { label: "Wörgl", mapsQuery: "Wörgl Hauptbahnhof" },
      { label: "Kitzbühel", mapsQuery: "Kitzbühel Bahnhof" },
    ],
    vienna: [
      { label: "Wiens flygplats", mapsQuery: "Vienna International Airport" },
      { label: "Wien Hbf", mapsQuery: "Wien Hauptbahnhof" },
      { label: "Wörgl", mapsQuery: "Wörgl Hauptbahnhof" },
      { label: "Kitzbühel", mapsQuery: "Kitzbühel Bahnhof" },
    ],
  },
};

export function normalizeLocale(locale: string | null | undefined): Locale {
  return locale === "de" || locale === "sv" ? locale : "en";
}

export function normalizeAirport(
  airportId: string | null | undefined,
): AirportId | null {
  return AIRPORTS.some((airport) => airport.id === airportId)
    ? (airportId as AirportId)
    : null;
}

export function getLocaleCopy(locale: string | null | undefined): LocaleCopy {
  return localeCopies[normalizeLocale(locale)];
}

export function getAirportGuide(
  airportId: AirportId,
  locale: string | null | undefined,
): AirportGuide {
  const resolvedLocale = normalizeLocale(locale);
  const copy = localeCopies[resolvedLocale];
  const airportCopy = copy.airports[airportId];
  const guideCopy = guideCopies[resolvedLocale][airportId];
  const stops = routeStops[resolvedLocale][airportId].map((stop) => ({
    label: stop.label,
    mapsUrl: mapsUrl(stop.mapsQuery),
  }));

  return {
    airportId,
    airportName: airportCopy.name,
    city: airportCopy.city,
    apps: {
      ...guideCopy.apps,
      note: guideCopy.appNote,
    },
    route: {
      title: guideCopy.routeTitle,
      stops,
      qualifier: guideCopy.routeQualifier,
    },
    ticketTip: guideCopy.ticketTip,
    connectionWatch: guideCopy.connectionWatch,
    flightPlanning: guideCopy.flightPlanning,
  };
}
