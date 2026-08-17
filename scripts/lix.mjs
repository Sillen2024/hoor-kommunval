// LIX-mätning på byggd HTML (redaktionsregel 3 i CLAUDE.md: LIX ≤ 45 på
// sajtens egen prosa). Mäter innehållet i <main> — sidhuvud och sidfot
// räknas inte.
//
// Tre slags innehåll räknas bort före mätningen, eftersom regel 3 bara
// gäller sajtens egen prosa: <table> (celler är etiketter och tal, inte
// meningar), <blockquote> (citat ur protokoll och manifest) och styckena i
// .stance-card (partiernas egna formuleringar). Poängen är inte en bättre
// siffra utan en användbar grind — innan exkluderingen varnade mätaren på
// 21 av 29 sidor, vilket lärde alla att ignorera varningen. Sidor där det
// borträknade är en stor andel av orden markeras i utskriften: där mäter
// siffran bara den kvarvarande egna prosan, inte sidan som helhet.
//
//   node scripts/lix.mjs [dist-katalog]
//
// LIX = (ord per mening) + 100 × (andel ord längre än 6 tecken).
// 30–40 lättläst, 40–50 normal tidningstext, 50–60 facktext.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const distDir = process.argv[2] ?? "dist";

function htmlFiler(dir) {
  const ut = [];
  for (const namn of readdirSync(dir)) {
    const p = join(dir, namn);
    if (statSync(p).isDirectory()) ut.push(...htmlFiler(p));
    else if (namn.endsWith(".html")) ut.push(p);
  }
  return ut;
}

// Tar bort varje <div class="stance-card ...">-block ur HTML:en och
// returnerar [html utan blocken, blockens sammanlagda innehåll]. Blocken
// innehåller nästlade divar, så slutet hittas med djupräkning i stället
// för regex.
function utanStanceCards(html) {
  let kvar = "";
  let bort = "";
  let i = 0;
  const start = /<div[^>]*class="[^"]*\bstance-card\b[^"]*"[^>]*>/g;
  let m;
  while ((m = start.exec(html)) !== null) {
    if (m.index < i) continue; // startade inne i ett redan borttaget block
    kvar += html.slice(i, m.index);
    let djup = 1;
    const tagg = /<div\b|<\/div>/g;
    tagg.lastIndex = m.index + m[0].length;
    let t;
    while (djup > 0 && (t = tagg.exec(html)) !== null) {
      djup += t[0] === "</div>" ? -1 : 1;
    }
    const slut = t ? t.index + t[0].length : html.length;
    bort += " " + html.slice(m.index, slut);
    i = slut;
    start.lastIndex = slut;
  }
  kvar += html.slice(i);
  return [kvar, bort];
}

function tillText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

// Returnerar { prosa, bortraknat }: sidans egen prosa som text, och det
// borträknade (tabeller, citat, stance-card-stycken) som text — det senare
// bara för att kunna redovisa hur stor andel som räknats bort.
function text(html) {
  const main = html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? html;
  const [utanKort, kortHtml] = utanStanceCards(main);
  let bort = kortHtml;
  const prosa = utanKort
    .replace(/<table[\s\S]*?<\/table>/g, (m2) => ((bort += " " + m2), " "))
    .replace(/<blockquote[\s\S]*?<\/blockquote>/g, (m2) => ((bort += " " + m2), " "));
  return { prosa: tillText(prosa), bortraknat: tillText(bort) };
}

function lix(t) {
  const ord = t.split(/\s+/).filter((o) => /[a-zA-ZåäöÅÄÖ]/.test(o));
  if (ord.length === 0) return null;
  // Meningsslut: punkt/utrop/fråga följt av mellanslag och versal eller siffra.
  // Kolon och semikolon räknas inte — de dominerar i tabeller och etiketter.
  const meningar = t.split(/[.!?](?:\s+|$)/).filter((m) => m.trim().length > 1).length || 1;
  const langa = ord.filter((o) => o.replace(/[^a-zA-ZåäöÅÄÖ-]/g, "").length > 6).length;
  return {
    lix: Math.round(ord.length / meningar + (100 * langa) / ord.length),
    ord: ord.length,
    ordPerMening: Math.round(ord.length / meningar),
  };
}

const rader = [];
for (const fil of htmlFiler(distDir)) {
  const { prosa, bortraknat } = text(readFileSync(fil, "utf8"));
  const r = lix(prosa);
  if (!r) continue;
  const ordBort = bortraknat.split(/\s+/).filter((o) => /[a-zA-ZåäöÅÄÖ]/.test(o)).length;
  rader.push({
    sida: "/" + relative(distDir, fil).replace(/\\/g, "/").replace(/index\.html$/, ""),
    ...r,
    // Andel av sidans ord som räknats bort (tabeller, citat, stance-cards).
    andelBort: Math.round((100 * ordBort) / (r.ord + ordBort)),
  });
}
rader.sort((a, b) => b.lix - a.lix);

console.log("LIX per sida, mätt på egen prosa (mål ≤ 45; ⚠ = över 45).");
console.log("Tabeller, blockcitat och stance-card-stycken är borträknade;");
console.log("§ = citat-/tabelldominerad sida (≥ 30 % borträknat) — siffran");
console.log("gäller den kvarvarande prosan, inte sidan som helhet.\n");
for (const r of rader) {
  const flagga = r.lix > 45 ? "⚠" : " ";
  const dominans = r.andelBort >= 30 ? `§ ${r.andelBort} % borträknat` : "";
  console.log(
    `${flagga} ${String(r.lix).padStart(3)}  ${String(r.ord).padStart(5)} ord  ${String(r.ordPerMening).padStart(2)} ord/mening  ${r.sida}  ${dominans}`.trimEnd()
  );
}
