// LIX-mätning på byggd HTML (redaktionsregel 3 i CLAUDE.md: LIX ≤ 45 på
// sajtens egen prosa). Mäter innehållet i <main> — sidhuvud och sidfot
// räknas inte. Citat från partier och protokoll går inte att skilja ut
// maskinellt, så sidor som domineras av citat (t.ex. jämförelsevyn) läses
// med det i minnet.
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

function text(html) {
  const main = html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? html;
  return main
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
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
  const r = lix(text(readFileSync(fil, "utf8")));
  if (r) rader.push({ sida: "/" + relative(distDir, fil).replace(/\\/g, "/").replace(/index\.html$/, ""), ...r });
}
rader.sort((a, b) => b.lix - a.lix);

console.log("LIX per sida (mål ≤ 45 på egen prosa; ⚠ = över 45)\n");
for (const r of rader) {
  const flagga = r.lix > 45 ? "⚠" : " ";
  console.log(`${flagga} ${String(r.lix).padStart(3)}  ${String(r.ord).padStart(5)} ord  ${String(r.ordPerMening).padStart(2)} ord/mening  ${r.sida}`);
}
