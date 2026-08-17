// Hämtar nyckeltal från Koladas API (v3) och skriver src/data/kolada.json.
//
// Körs för hand: node scripts/hamta-kolada.mjs
// Ingen build-koppling, ingen runtime-fetch. Sajten ska bygga även om Kolada
// ligger nere — därför checkas kolada.json in i git.
//
// LICENS (https://www.kolada.se/om-oss/api/): data får användas fritt men ska
// märkas "Källa: Kolada". Egna bearbetningar får INTE anges med Kolada som
// källa. Därför skriver det här skriptet bara RÅVÄRDEN. Snitt, ranking och
// differenser räknas i Astro vid byggtid, så att det alltid finns en
// oberäknad siffra att peka på. Se KOLADA_PLAN.md §2.
//
// API-egenheter som kostat tid att upptäcka (KOLADA_PLAN.md §3):
//  - v2 är avstängd. Bas är /v3/.
//  - Data hämtas i sökvägsform, inte som query-parametrar. Query-formen
//    svarar tomt utan felkod, vilket ser ut som "inga värden finns".
//  - För många id:n i URL:en ger HTTP 422. Därför chunkas kommunlistan.
//  - Svaren pagineras med next_url.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Sökvägen innehåller mellanslag ("1 Ibland"), så URL:er måste avkodas med
// fileURLToPath — .pathname ger %20. Samma sak som i og-bilder.mjs.
const sökväg = (rel) => fileURLToPath(new URL(rel, import.meta.url));
const UTFIL = sökväg("../src/data/kolada.json");

const BAS = "https://api.kolada.se/v3";
const HÖÖR = "1267";
const ÅR = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

// Kommunkoderna verifierade mot /v3/municipality 2026-08-16. Namnen skrivs här
// i stället för att läsas ur API:et: titlar därifrån har kommit tillbaka
// dubbelkodade i andra endpoints, och en felstavad kommun i en jämförelse är
// värre än en extra rad kod.
const KOMMUNER = {
  1214: "Svalöv",
  1230: "Staffanstorp",
  1231: "Burlöv",
  1233: "Vellinge",
  1256: "Östra Göinge",
  1257: "Örkelljunga",
  1260: "Bjuv",
  1261: "Kävlinge",
  1262: "Lomma",
  1263: "Svedala",
  1264: "Skurup",
  1265: "Sjöbo",
  1266: "Hörby",
  1267: "Höör",
  1270: "Tomelilla",
  1272: "Bromölla",
  1273: "Osby",
  1275: "Perstorp",
  1276: "Klippan",
  1277: "Åstorp",
  1278: "Båstad",
  1280: "Malmö",
  1281: "Lund",
  1282: "Landskrona",
  1283: "Helsingborg",
  1284: "Höganäs",
  1285: "Eslöv",
  1286: "Ystad",
  1287: "Trelleborg",
  1290: "Kristianstad",
  1291: "Simrishamn",
  1292: "Ängelholm",
  1293: "Hässleholm",
};

// Grannkommuner enligt hur en Höörsbo faktiskt jämför — inte en metodiskt
// matchad grupp. Koladas egna "Liknande kommuner"-grupper är en annan sak och
// hämtas nedan.
const GRANNAR = ["1266", "1285", "1265", "1214"];

// Koladas officiella "Liknande kommuner"-grupper för Höör, hämtade ur
// /v3/municipality_groups?title=Höör (KOLADA_PLAN.md §4.3). RKA matchar
// kommunerna strukturellt (befolkning, andel barn, skattekraft, geografi) per
// verksamhet — därför är grupperna olika för förskola och äldreomsorg, och
// därför ligger inga skånska grannar i flera av dem. Höör ingår inte själv i
// sina grupper, så ett gruppsnitt jämför Höör med sju andra kommuner.
//
// Grupp-id:na är daterade (t.ex. "…, Höör, 2024"). RKA gör om matchningen med
// jämna mellanrum och ger då nya id:n; skriptet kastar om ett id försvinner
// hellre än att tyst tappa en jämförelse.
const GRUPPER = [
  { id: "G37411", nyckel: "overgripande", etikett: "övergripande" },
  { id: "G85837", nyckel: "forskola", etikett: "förskola" },
  { id: "G85545", nyckel: "fritidshem", etikett: "fritidshem" },
  { id: "G35951", nyckel: "grundskola", etikett: "grundskola" },
  { id: "G36243", nyckel: "gymnasieskola", etikett: "gymnasieskola" },
  { id: "G176571", nyckel: "aldreomsorg", etikett: "äldreomsorg" },
  { id: "G36535", nyckel: "ifo", etikett: "individ- och familjeomsorg" },
  { id: "G39584", nyckel: "lss", etikett: "LSS" },
];

// Egna svenska etiketter och enheter. Koladas titlar bakar in enheten i
// strängen ("..., (%)") och är för långa för en tabellrubrik, men de sparas
// ändå som kolada_titel så att varje siffra går att spåra till rätt nyckeltal.
//
// grupp pekar ut vilken "Liknande kommuner"-grupp som hör till nyckeltalet.
// Fel grupp vore värre än ingen: att jämföra förskolekostnad mot
// äldreomsorgsgruppen ser lika rimligt ut men mäter något annat.
const NYCKELTAL = [
  // "exkl. LSS" står med i etiketten därför att LSS är en tung post som lätt
  // gör att totalen läses som hela kommunens verksamhet. Det är den inte.
  { id: "N00097", titel: "Nettokostnadsavvikelse totalt (exkl. LSS)", enhet: "%", grupp: "overgripande" },
  // Verksamheterna nedan hämtas i både procent och miljoner kronor. Procenten
  // är jämförbar mellan kommuner, men budgetsidan redovisar nämndramar i mnkr
  // — utan mnkr-varianten går avvikelsen inte att ställa bredvid ramen i samma
  // enhet, och då blir jämförelsen en abstraktion i stället för ett belopp.
  // Uppsättningen täcker de verksamheter som nämndramarna faktiskt avser.
  { id: "N11024", titel: "Nettokostnadsavvikelse förskola", enhet: "%", grupp: "forskola" },
  { id: "N11038", titel: "Nettokostnadsavvikelse förskola", enhet: "mnkr", grupp: "forskola" },
  { id: "N13020", titel: "Nettokostnadsavvikelse fritidshem", enhet: "%", grupp: "fritidshem" },
  { id: "N13032", titel: "Nettokostnadsavvikelse fritidshem", enhet: "mnkr", grupp: "fritidshem" },
  { id: "N15001", titel: "Nettokostnadsavvikelse grundskola", enhet: "%", grupp: "grundskola" },
  { id: "N15045", titel: "Nettokostnadsavvikelse grundskola", enhet: "mnkr", grupp: "grundskola" },
  { id: "N17001", titel: "Nettokostnadsavvikelse gymnasieskola", enhet: "%", grupp: "gymnasieskola" },
  { id: "N17030", titel: "Nettokostnadsavvikelse gymnasieskola", enhet: "mnkr", grupp: "gymnasieskola" },
  { id: "N20900", titel: "Nettokostnadsavvikelse äldreomsorg", enhet: "%", grupp: "aldreomsorg" },
  { id: "N20029", titel: "Nettokostnadsavvikelse äldreomsorg", enhet: "mnkr", grupp: "aldreomsorg" },
  { id: "N30001", titel: "Nettokostnadsavvikelse individ- och familjeomsorg", enhet: "%", grupp: "ifo" },
  { id: "N30026", titel: "Nettokostnadsavvikelse individ- och familjeomsorg", enhet: "mnkr", grupp: "ifo" },
  // LSS ingår inte i N00097. Utan de här två saknas en av socialnämndens
  // tyngsta verksamheter helt i jämförelsen.
  { id: "N28018", titel: "Nettokostnadsavvikelse LSS", enhet: "%", grupp: "lss" },
  { id: "N28021", titel: "Nettokostnadsavvikelse LSS", enhet: "mnkr", grupp: "lss" },
  { id: "N15027", titel: "Kostnad grundskola", enhet: "kr/elev", grupp: "grundskola" },
  { id: "N15033", titel: "Elever per lärare, grundskola", enhet: "elever", grupp: "grundskola" },
  { id: "N15428", titel: "Behöriga till yrkesprogram", enhet: "%", grupp: "grundskola" },
  { id: "N15507", titel: "Meritvärde årskurs 9", enhet: "poäng", grupp: "grundskola" },
  { id: "N11008", titel: "Kostnad förskola", enhet: "kr/inskrivet barn", grupp: "forskola" },
  { id: "N11102", titel: "Barn per årsarbetare, förskola", enhet: "barn", grupp: "forskola" },
  { id: "N03001", titel: "Resultat som andel av skatt och generella bidrag", enhet: "%", grupp: "overgripande" },
  { id: "N03106", titel: "Soliditet", enhet: "%", grupp: "overgripande" },
  { id: "N00901", titel: "Kommunal skattesats", enhet: "%", grupp: "overgripande" },
  { id: "U23401", titel: "Väntetid till särskilt boende", enhet: "dagar", grupp: "aldreomsorg" },
];

// ——— Hämtning ————————————————————————————————————————————————————————

async function hämta(url, försök = 0) {
  const svar = await fetch(url, { headers: { "User-Agent": "hoor-kommunval/1.0" } });

  if (svar.status === 422) {
    // Avbryt högt. 422 betyder att URL:en har för många id:n — tyst
    // fortsättning skulle ge en tystnad som ser ut som saknad data.
    throw new Error(`HTTP 422 (för många id:n i URL:en?): ${url}`);
  }
  if (!svar.ok) {
    if (försök < 3) {
      await new Promise((r) => setTimeout(r, 1000 * (försök + 1)));
      return hämta(url, försök + 1);
    }
    throw new Error(`HTTP ${svar.status} efter ${försök + 1} försök: ${url}`);
  }
  return svar.json();
}

// Följer next_url tills den är null och slår ihop values.
async function hämtaAlla(url) {
  const poster = [];
  let nästa = url;
  while (nästa) {
    const data = await hämta(nästa);
    poster.push(...(data.values ?? []));
    nästa = data.next_url ?? null;
  }
  return poster;
}

const chunka = (lista, storlek) =>
  Array.from({ length: Math.ceil(lista.length / storlek) }, (_, i) =>
    lista.slice(i * storlek, (i + 1) * storlek),
  );

async function hämtaMetadata(kpiId) {
  const data = await hämta(`${BAS}/kpi/${kpiId}`);
  const m = data.values?.[0];
  if (!m) throw new Error(`Ingen metadata för ${kpiId}`);
  return m;
}

async function hämtaGrupp(spec) {
  const data = await hämta(`${BAS}/municipality_groups/${spec.id}`);
  const g = data.values?.[0];
  if (!g) {
    throw new Error(
      `Gruppen ${spec.id} (${spec.etikett}) finns inte längre. RKA gör om ` +
        "matchningen med jämna mellanrum och ger nya id:n — slå upp " +
        "/v3/municipality_groups?title=Höör och uppdatera GRUPPER.",
    );
  }
  const medlemmar = (g.members ?? []).map((m) => ({
    kod: m.member_id,
    namn: m.member_title,
  }));
  if (medlemmar.length === 0) throw new Error(`Gruppen ${spec.id} har inga medlemmar.`);
  // Höör ska inte ligga i sin egen jämförelsegrupp. Om RKA någon gång ändrar
  // det måste snittberäkningen på /nyckeltal/ skrivas om, så det ska smälla.
  if (medlemmar.some((m) => m.kod === HÖÖR)) {
    throw new Error(`Gruppen ${spec.id} innehåller Höör själv — gruppsnittet skulle jämföra Höör med sig själv.`);
  }
  return { ...spec, titel: g.title, medlemmar };
}

async function hämtaVärden(kpiId, kommunkoder) {
  const värden = {};
  // 8 kommuner åt gången: verifierat att 33 ger 422 och att 8 fungerar.
  for (const grupp of chunka(kommunkoder, 8)) {
    const url = `${BAS}/data/kpi/${kpiId}/municipality/${grupp.join(",")}/year/${ÅR.join(",")}`;
    for (const post of await hämtaAlla(url)) {
      // gender "T" = totalt. Könsuppdelade poster hoppas över; inget av
      // nyckeltalen ovan används könsuppdelat på sajten.
      const v = post.values?.find((x) => x.gender === "T" && !x.isdeleted);
      if (!v || v.value === null || v.value === undefined) continue;
      // status sätts när värdet är osäkert eller sekretessmarkerat. Ett
      // värde med status ska inte tyst passera som ett vanligt värde.
      if (v.status) {
        console.warn(`  ! ${kpiId} ${post.municipality} ${post.period}: status "${v.status}" — hoppar över`);
        continue;
      }
      (värden[post.municipality] ??= {})[post.period] = v.value;
    }
  }
  return värden;
}

// ——— Diff mot föregående körning ——————————————————————————————————————
//
// Kolada reviderar publicerade värden utan att avisera det (licensvillkoren
// säger uttryckligen att revideringar inte aviseras). Utan den här utskriften
// skulle en revidering se ut som en oförklarad diff i git.

function skrivDiff(gammal, ny) {
  if (!gammal) {
    console.log("\nIngen tidigare kolada.json — inget att jämföra mot.");
    return;
  }

  const gamlaNyckeltal = new Map(gammal.nyckeltal.map((n) => [n.kpi_id, n]));
  const ändringar = [];

  for (const nyttN of ny.nyckeltal) {
    const gammaltN = gamlaNyckeltal.get(nyttN.kpi_id);
    if (!gammaltN) {
      ändringar.push(`+ nytt nyckeltal ${nyttN.kpi_id} (${nyttN.titel})`);
      continue;
    }
    for (const [kod, år] of Object.entries(nyttN.varden)) {
      for (const [årtal, värde] of Object.entries(år)) {
        const förr = gammaltN.varden[kod]?.[årtal];
        if (förr === undefined) {
          ändringar.push(`+ ${nyttN.kpi_id} ${NAMN[kod] ?? kod} ${årtal}: ${värde}`);
        } else if (förr !== värde) {
          ändringar.push(`~ ${nyttN.kpi_id} ${NAMN[kod] ?? kod} ${årtal}: ${förr} → ${värde}`);
        }
      }
    }
    for (const [kod, år] of Object.entries(gammaltN.varden)) {
      for (const årtal of Object.keys(år)) {
        if (nyttN.varden[kod]?.[årtal] === undefined) {
          ändringar.push(`- ${nyttN.kpi_id} ${NAMN[kod] ?? kod} ${årtal}: värdet är borta`);
        }
      }
    }
  }

  if (ändringar.length === 0) {
    console.log("\nDiff mot föregående körning: inga ändringar.");
    return;
  }
  console.log(`\nDiff mot föregående körning (${ändringar.length} ändringar):`);
  for (const rad of ändringar) console.log(`  ${rad}`);
  const reviderade = ändringar.filter((r) => r.startsWith("~"));
  if (reviderade.length > 0) {
    console.log(
      `\n  OBS: ${reviderade.length} redan publicerade värden har ändrats i Kolada.` +
        "\n  Kontrollera om något av dem citeras i text på sajten innan du commitar.",
    );
  }
}

// ——— Huvudflöde ———————————————————————————————————————————————————————

const idag = new Date().toISOString().slice(0, 10);

// Namnregister för alla kommuner som förekommer i filen: Skånes 33 plus
// medlemmarna i Koladas grupper, som ligger utspridda över landet.
const NAMN = { ...KOMMUNER };

console.log(`Hämtar ${GRUPPER.length} jämförelsegrupper …`);
const grupper = [];
for (const spec of GRUPPER) {
  const grupp = await hämtaGrupp(spec);
  for (const m of grupp.medlemmar) NAMN[m.kod] ??= m.namn;
  grupper.push({
    nyckel: grupp.nyckel,
    grupp_id: grupp.id,
    etikett: grupp.etikett,
    titel: grupp.titel,
    medlemmar: grupp.medlemmar.map((m) => m.kod),
  });
  console.log(`  ${grupp.id} ${grupp.titel}: ${grupp.medlemmar.map((m) => m.namn).join(", ")}`);
}

// Unionen av Skåne och gruppmedlemmarna. Alla nyckeltal hämtas för alla
// kommuner även om varje nyckeltal bara har en relevant grupp — det kostar
// några extra anrop i ett handkört skript, och alternativet vore en
// hämtningsmatris som är lätt att få fel utan att det syns.
const kommunkoder = [...new Set([...Object.keys(KOMMUNER), ...grupper.flatMap((g) => g.medlemmar)])];

console.log(
  `\nHämtar ${NYCKELTAL.length} nyckeltal för ${kommunkoder.length} kommuner ` +
    `(${Object.keys(KOMMUNER).length} skånska + ${kommunkoder.length - Object.keys(KOMMUNER).length} ur grupperna), ` +
    `${ÅR[0]}–${ÅR.at(-1)}.`,
);

// Byggs klart i minnet först. En halvfärdig kolada.json vore värre än ingen
// alls: sajten skulle bygga utan fel men visa fel siffror.
const nyckeltal = [];

for (const spec of NYCKELTAL) {
  process.stdout.write(`  ${spec.id} ${spec.titel} (${spec.enhet}) … `);
  const meta = await hämtaMetadata(spec.id);
  const varden = await hämtaVärden(spec.id, kommunkoder);

  if (!varden[HÖÖR] || Object.keys(varden[HÖÖR]).length === 0) {
    throw new Error(`${spec.id} saknar Höörvärden — avbryter utan att skriva fil.`);
  }

  // Ett år är preliminärt bara när Kolada faktiskt släppt en preliminär
  // siffra som ännu inte fastställts: prel_publication_date har passerat men
  // publication_date har inte. Räcker det inte med publication_date i
  // framtiden? Nej — då flaggas även perioder som inte publicerats alls
  // (t.ex. N15428 publ_period 2026, som varken finns preliminärt eller
  // fastställt) som "preliminära", vilket vore fel om årtalet någon gång
  // dyker upp i datan. För nettokostnadsavvikelserna ligger
  // publication_date 2026-09-30, alltså efter valdagen — det är det fall
  // som gör fältet nödvändigt. Se KOLADA_PLAN.md risk 2.
  const nu = new Date();
  const prel = meta.prel_publication_date ? new Date(meta.prel_publication_date) : null;
  const definitiv = meta.publication_date ? new Date(meta.publication_date) : null;
  const preliminärFrånÅr =
    prel && prel <= nu && definitiv && definitiv > nu ? Number(meta.publ_period) : null;

  nyckeltal.push({
    kpi_id: spec.id,
    titel: spec.titel,
    enhet: spec.enhet,
    grupp: spec.grupp,
    kolada_titel: meta.title,
    // description innehåller Koladas egen källhänvisning ("Källa: SKR",
    // "Källa: Skolverket") och metodbrytpunkter — den ska följa med, inte
    // sammanfattas av oss.
    beskrivning: meta.description,
    operating_area: meta.operating_area,
    has_ou_data: meta.has_ou_data,
    preliminar_fran_ar: preliminärFrånÅr,
    publicering: {
      prel_publication_date: meta.prel_publication_date,
      publication_date: meta.publication_date,
      publ_period: meta.publ_period,
    },
    varden,
  });

  const antalÅrHöör = Object.keys(varden[HÖÖR]).length;
  const antalKommuner = Object.keys(varden).length;
  console.log(`${antalKommuner} kommuner, ${antalÅrHöör} år för Höör`);
}

const ny = {
  hamtad: idag,
  kalla: "Kolada (Rådet för främjande av kommunala analyser, RKA)",
  api: `${BAS}/`,
  licensnot:
    "Råvärdena nedan får anges med 'Källa: Kolada'. Beräkningar gjorda på dem " +
    "(snitt, ranking, differenser) får inte anges med Kolada som källa utan ska " +
    "märkas som egen bearbetning. Se KOLADA_PLAN.md §2.",
  kommuner: NAMN,
  skane: Object.keys(KOMMUNER),
  hoor: HÖÖR,
  grannar: GRANNAR,
  grupper,
  ar: ÅR,
  nyckeltal,
};

const gammal = existsSync(UTFIL) ? JSON.parse(readFileSync(UTFIL, "utf8")) : null;
skrivDiff(gammal, ny);

writeFileSync(UTFIL, JSON.stringify(ny, null, 2) + "\n", "utf8");
console.log(`\nSkrev ${UTFIL}`);
