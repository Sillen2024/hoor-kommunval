// Partifärger för diagram. Presentationsval, inte källbelagd data — därför
// ligger de här och inte i partier.json.
//
// Utgångspunkten är SVT:s partimärken (valkompassen/valresultaten), som
// läsarna redan mött, mörkade eller ljusade där kontrast och särskiljbarhet
// krävde det. Medborgerlig Samling saknar SVT-färg och har fått en egen
// petrolblå. Paletten är maskinellt kontrollerad (OKLab-avstånd under
// simulerad färgblindhet + kontrast mot vit yta) i båda valens
// storleksordningar, 2026-08-29. M, SD och MP ligger under 3:1 mot vitt —
// tillåtet därför att varje stapel alltid bär partinamn och siffra i
// klartext; färgen är förstärkning, aldrig enda bärare av identiteten.
//
// Nycklarna är partier.jsons id-fält.
export const PARTIFARG: Record<string, string> = {
  m: "#5aabe3",
  l: "#24528f",
  c: "#31973b",
  kd: "#8a5ae0",
  s: "#e0524c",
  sd: "#d4a828",
  v: "#98212b",
  mp: "#7cc87f",
  "medborgerlig-samling": "#0a86a4",
};

// Partinamn → id, för datafiler (historiska_val.json) som skriver ut
// fullständiga namn i stället för id.
export const PARTI_ID_AV_NAMN: Record<string, string> = {
  Moderaterna: "m",
  Liberalerna: "l",
  Centerpartiet: "c",
  Kristdemokraterna: "kd",
  Socialdemokraterna: "s",
  Sverigedemokraterna: "sd",
  Vänsterpartiet: "v",
  "Miljöpartiet de gröna": "mp",
  "Medborgerlig Samling": "medborgerlig-samling",
};

/** Neutral stapelfärg för rader utan parti (samma som Jamforelse.astro). */
export const NEUTRAL_STAPEL = "#9bb3c4";

export const partifarg = (id: string): string => PARTIFARG[id] ?? NEUTRAL_STAPEL;

// Färger för serier som inte är partier (verksamheter, mått), i fast
// ordning. Maskinellt kontrollerade mot vit yta 2026-08-29, precis som
// partifärgerna. Medvetet skilda från partipaletten så en verksamhetslinje
// aldrig ser ut som ett parti.
export const SERIEFARG = ["#1c6ea8", "#c2571f", "#7a4fb5"];

// Polaritetsfärger för voteringar: kall för JA, varm för NEJ, neutral grå
// för AVSTOD. Medvetet skilda från partifärgerna så ett segment aldrig ser
// ut som ett parti. Blått/orange-paret är samma kontrollerade par som i
// SERIEFARG; grå är avsiktligt färglös — att avstå är inte en sida.
export const FARG_JA = "#1c6ea8";
export const FARG_NEJ = "#c2571f";
export const FARG_AVSTOD = "#767676";
