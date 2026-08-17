// Genererar OG-bilder (1200x630) för de sidor som är mest sannolika att delas.
// Körs för hand vid behov: node scripts/og-bilder.mjs
//
// Siffrorna i bilderna läses ur src/data/*.json, inte ur hårdkodade strängar.
// Ändras datan och skriptet körs om följer bilderna med. Undantaget är ren
// prosa (situationsnamnen på /din-vardag/ definieras inline i sidan, inte i
// någon datafil) — den är medvetet formulerad utan siffror som kan glida isär.
//
// Filnamnen är versionerade (-v1). Byter du innehållet i en bild som redan
// ligger ute: höj siffran och peka om sidan. Filerna är inte innehållshashade
// av Astro, och versionerade namn är det enda som säkert bryter Facebooks
// scraper-cache.

import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Sökvägen innehåller mellanslag ("1 Ibland"), så URL:er måste avkodas med
// fileURLToPath — .pathname ger %20 och får sharp att inte hitta filerna.
const sökväg = (rel) => fileURLToPath(new URL(rel, import.meta.url));
const läs = (fil) => JSON.parse(readFileSync(sökväg(`../src/data/${fil}`), "utf8"));

const partier = läs("partier.json");
const budget = läs("budget.json");
const arenden = läs("arenden.json");
const valkompass = läs("valkompass.json");
const historiskaVal = läs("historiska_val.json");
const kolada = läs("kolada.json");

// ——— Härledda siffror ———————————————————————————————————————————————

const mandatTotalt = partier.partier.reduce((s, p) => s + p.mandat_2022, 0);
const mandatStyre = partier.partier
  .filter((p) => p.block === "styre")
  .reduce((s, p) => s + p.mandat_2022, 0);
const antalPartier = partier.partier.length;

const partierMedManifest = partier.partier.filter((p) => p.manifest_2026.length > 0);
const antalStandpunkter = partier.partier.reduce((s, p) => s + p.manifest_2026.length, 0);

// Skattesatsen står som t.ex. "21,75 kr/hundralapp (oförändrad)" i budget.json.
const skattesats = (ar) =>
  budget.beslut.find((b) => b.ar === ar).kommunal_skattesats.match(/[\d,]+/)[0];

// Största parti per valår, för att visa maktskiftet utan att peka ut ett
// enskilt parti som förlorare.
const störstaParti = (ar) => {
  const val = historiskaVal.val.find((v) => v.ar === ar);
  const vinnare = [...val.resultat].sort(
    (a, b) => parseFloat(b.andel.replace(",", ".")) - parseFloat(a.andel.replace(",", "."))
  )[0];
  return partier.partier.find((p) => p.namn === vinnare.parti)?.id.toUpperCase() ?? vinnare.parti;
};

// Höörs placering i Skåne för förskolans nettokostnadsavvikelse. Räknas fram
// ur kolada.json av samma skäl som allt annat här: siffran i bilden ska inte
// kunna hamna i otakt med siffran på sidan. Huvudåret är det senaste som inte
// är preliminärt — nettokostnadsavvikelserna fastställs efter valdagen.
const koladaPrelÅr = kolada.nyckeltal
  .map((n) => n.preliminar_fran_ar)
  .filter((a) => a !== null);
const koladaHuvudår =
  koladaPrelÅr.length > 0 ? Math.min(...koladaPrelÅr) - 1 : kolada.ar.at(-1);
const förskolaRankad = kolada.skane
  .map((kod) => ({
    kod,
    v: kolada.nyckeltal.find((n) => n.kpi_id === "N11024").varden[kod]?.[String(koladaHuvudår)],
  }))
  .filter((p) => p.v !== undefined)
  .sort((a, b) => a.v - b.v);
const förskolaPlats = förskolaRankad.findIndex((p) => p.kod === kolada.hoor) + 1;
const förskolaRå = förskolaRankad.find((p) => p.kod === kolada.hoor).v;
const förskolaVärde = förskolaRå.toLocaleString("sv-SE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const förskolaAbs = Math.abs(förskolaRå).toLocaleString("sv-SE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

// Budgetbildens formulering ("mindre än väntat", "lägst av Skånes 33") är bara
// sann så länge Höör ligger sist med negativ avvikelse. Håller det inte ska
// bilden formuleras om — inte tyst få fel innebörd när datan uppdateras.
if (förskolaPlats !== 1 || förskolaRå >= 0)
  throw new Error(
    `og-budget-v2: förskolan är plats ${förskolaPlats} med värdet ${förskolaVärde} — formulera om bilden`
  );

// Antalet kommuner Höör ställs mot på /nyckeltal/: unionen av Skånes 33,
// grannkommunerna och Koladas åtta "Liknande kommuner"-grupper, utan Höör själv.
const jämförelseKommuner = new Set([
  ...kolada.skane,
  ...kolada.grannar,
  ...kolada.grupper.flatMap((g) => g.medlemmar),
]);
jämförelseKommuner.delete(kolada.hoor);

// ——— Bilderna ————————————————————————————————————————————————————————

const bilder = [
  {
    // v1 (skattesänkningen 21,75 → 20,95) ligger kvar orörd i public/ så att
    // redan delade inlägg inte tappar sin bild. /budget/ pekar på v2 sedan
    // 2026-08-17: förskolans utfall är sidans starkaste fynd, och en platssiffra
    // ("plats 1 av 33") undviks — sorteringsriktningen är ett värderingsval.
    fil: "og-budget-v2.png",
    etikett: `Budgetöversikt — utfall ${koladaHuvudår}`,
    rubrik: ["Minst i Skåne"],
    brödtext: [
      `Förskolan kostade ${förskolaAbs} procent mindre än väntat —`,
      `lägst av Skånes ${förskolaRankad.length}. Effektivt eller underfinansierat?`,
    ],
  },
  {
    // v1 ("Plats 1 av 33") ligger kvar i public/ av samma skäl. Omgjord
    // 2026-08-17: platssiffran lät som en pallplats, men med premissen att
    // förskolesatsning är bra är samma siffra sista plats. Neutral vinkel i
    // stället; förskolefyndet bär og-budget-v2.
    fil: "og-nyckeltal-v2.png",
    etikett: "Nyckeltal — Höör i jämförelse",
    rubrik: [`Höör mot ${jämförelseKommuner.size} kommuner`],
    brödtext: [
      "Skåne, grannarna och liknande kommuner —",
      "nyckeltal för nyckeltal, med källa.",
    ],
  },
  {
    fil: "og-styret-v1.png",
    etikett: "Styret vs oppositionen",
    rubrik: [`${mandatStyre} av ${mandatTotalt} mandat`],
    brödtext: [
      "Styret styr i minoritet. Ändå landar deras budget",
      "på 26 röster — i varenda budgetvotering.",
    ],
  },
  {
    fil: "og-jamforelse-v1.png",
    etikett: "Jämförelsevy",
    rubrik: [`${antalStandpunkter} ståndpunkter`],
    brödtext: [
      `Ur ${partierMedManifest.length} partiers egna program, grupperade i`,
      "jämförbara teman — med källa på varje.",
    ],
  },
  {
    fil: "og-valkompass-v1.png",
    etikett: "Valkompassen",
    rubrik: [`${valkompass.fragor.length} frågor om Höör`],
    brödtext: [
      "Svara på påståenden om din vardag och se vilket",
      "block du lutar åt. Varje påstående har källa.",
    ],
  },
  {
    fil: "og-din-vardag-v1.png",
    etikett: "Din vardag",
    rubrik: ["Vad lovar de dig?"],
    brödtext: [
      "Förälder, pensionär, företagare eller landsbygdsbo",
      "— välj din situation i stället för att leta parti.",
    ],
  },
  {
    fil: "og-historiska-val-v1.png",
    etikett: "Historiska val",
    rubrik: [`Störst 2018: ${störstaParti(2018)}.`, `Störst 2022: ${störstaParti(2022)}.`],
    brödtext: [
      "Röster och röstandelar per parti i två val —",
      "inte bara mandaten som kommunen publicerar.",
    ],
  },
  {
    fil: "og-arenden-v1.png",
    etikett: "Ärenden och motioner",
    rubrik: [`${arenden.arenden.length} ärenden`],
    brödtext: [
      "Kvarnen, Ringsjöskolan, busskorten för 70+ och",
      "de saknade medborgarförslagen. Kurerat, med källa.",
    ],
  },
  {
    fil: "og-partier-v1.png",
    etikett: "Partierna i Höör",
    rubrik: [`${antalPartier} partier, ${mandatTotalt} mandat`],
    brödtext: [
      "Mandat, valmanifest och vad partierna faktiskt",
      "har röstat för — parti för parti, med källa.",
    ],
  },
];

// ——— Rendering ———————————————————————————————————————————————————————

const W = 1200;
const H = 630;
const NAVY = "#0b4a6f";
const TEXT = "#1a1a1a";
const MUTED = "#5a5a5a";
const SANS = "Arial, Helvetica, sans-serif";
const MARGINAL = 80;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Grov breddberäkning för Arial Bold: ~0,58 em per tecken i genomsnitt. Räcker
// för att välja en storlek som håller sig innanför marginalerna.
const passandeStorlek = (rader, max) => {
  const längst = Math.max(...rader.map((r) => r.length));
  const tillgängligt = W - MARGINAL * 2;
  return Math.min(max, Math.floor(tillgängligt / (längst * 0.58)));
};

const märke = await sharp(sökväg("../public/favicon.png")).resize(96, 96).toBuffer();

for (const b of bilder) {
  // Två rubrikrader måste hålla sig mindre för att brödtexten ska få luft
  // ovanför den nedre linjen vid y=545.
  const tvåRader = b.rubrik.length > 1;
  const storlek = passandeStorlek(b.rubrik, tvåRader ? 80 : 104);
  const rubrikStart = tvåRader ? 296 : 348;
  const radAvstånd = storlek + 12;
  const brödStart = tvåRader ? 462 : 452;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#ffffff"/>
  <rect x="0" y="0" width="18" height="${H}" fill="${NAVY}"/>
  <text x="190" y="128" font-family="${SANS}" font-size="30" font-weight="700"
        letter-spacing="3" fill="${NAVY}">HÖÖRS KOMMUNVAL 2026</text>
  <text x="190" y="164" font-family="${SANS}" font-size="24" fill="${MUTED}"
        letter-spacing="1">${esc(b.etikett)}</text>
  <line x1="${MARGINAL}" y1="215" x2="${W - MARGINAL}" y2="215" stroke="#d8d8d8" stroke-width="2"/>
  ${b.rubrik
    .map(
      (rad, i) =>
        `<text x="${MARGINAL}" y="${rubrikStart + i * radAvstånd}" font-family="${SANS}" font-size="${storlek}" font-weight="700" fill="${NAVY}">${esc(rad)}</text>`
    )
    .join("\n  ")}
  ${b.brödtext
    .map(
      (rad, i) =>
        `<text x="${MARGINAL}" y="${brödStart + i * 44}" font-family="${SANS}" font-size="34" fill="${TEXT}">${esc(rad)}</text>`
    )
    .join("\n  ")}
  <line x1="${MARGINAL}" y1="545" x2="${W - MARGINAL}" y2="545" stroke="#d8d8d8" stroke-width="2"/>
  <text x="${MARGINAL}" y="586" font-family="${SANS}" font-size="26" fill="${MUTED}">hoor-kommunval.ibland.nu</text>
  <text x="${W - MARGINAL}" y="586" text-anchor="end" font-family="${SANS}" font-size="26" fill="${MUTED}">Fakta med källa — inte kampanj</text>
</svg>`;

  const utfil = sökväg(`../public/${b.fil}`);
  await sharp(Buffer.from(svg))
    .composite([{ input: märke, top: 72, left: MARGINAL }])
    .png()
    .toFile(utfil);

  // Måtten deklareras hårdkodat i og:image:width/height i Layout.astro, så en
  // avvikelse här skulle tyst ge fel förhandsvisning hos Facebook.
  const { width, height } = await sharp(readFileSync(utfil)).metadata();
  if (width !== W || height !== H) throw new Error(`${b.fil}: ${width}x${height}`);

  console.log(`${b.fil.padEnd(28)} ${b.rubrik.join(" / ")}`);
}
