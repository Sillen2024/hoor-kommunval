# Överlämning 2026-08-13 — ärenden.json, odaterade poster

Jonas pausade sessionen med "vi får gräva i detta i morgon". Nedan står var vi
står, vad som gjordes idag, och vad som återstår.

## PÅMINNELSE TILL MIG SJÄLV: MEJLA KOMMUNEN

Innan mer gissningsbaserad research i nyhetsartiklar — mejla kommunens registrator
(kommunen@hoor.se, samma tråd som i
`BEGARAN_OM_PROTOKOLL.md`) och be om protokollsutdrag/beslut för de tre
ärendena nedan (särskilt A och B). Hon har redan visat sig snabb och hjälpsam.
Alternativt: prova Ciceron-API:et (`sok-hr.unikom.se/json`, se
`KALLLUCKOR-RAPPORT.md` §1) för protokoll från 2023-05-24 och framåt, vilket
täcker både oktober 2025-omröstningen och 2026-vändningen i ärende A.

## Gjort idag

1. **Miljö- och klimatstrategi för Höörs kommun** — `beskrivning`-fältet i
   `src/data/arenden.json` uppdaterat med konkret innehåll hämtat ur källans
   PDF (26 sidor, hämtad och konverterad med `pdftotext -layout` — WebFetch
   klarade inte att läsa PDF:en, den kom ut som binärskräp, men `pdftotext`
   från mingw64 funkade felfritt). Tillagt:
   - 4 fokusområden: Natur med höga värden / Hög livskvalitet /
     Nettonollutsläpp år 2045 / Resurseffektiv kommun.
   - Konkret mål: växthusgasutsläppen i Höör ska vara 80 % lägre år 2030
     jämfört med 1990 (skånska klimatmålet).
   - Uppvärmning/el i kommunens egna lokaler ska vara 100 % förnybar senast
     **2027**.
   - Revideras vart 4:e år, nästa gång 2027.
   - Denna ändring är redan gjord i filen (ej committad separat ännu, kolla
     `git status`/`git diff` imorgon).

2. **Research på de tre ärenden med `"datum": null`** — inget skrivet till
   JSON än, se A/B/C nedan.

## Öppna beslut till imorgon

### A. "Fri kollektivtrafik för pensionärer 70+" — trolig sakfel, inte bara datumlucka

- Nuvarande `kalla_url` (hoor.se, 2025-09-02, "det-har-planerar-hoors-kommun...")
  nämner INTE fri kollektivtrafik alls när den hämtas — fel/omatchad källa.
- Verifierat via Skånska Dagbladet istället:
  - **2025-10-14**: S:s motion (tredje försöket) **röstades ner** — kvittning
    i fullmäktige, ordförande Anders Netterheim (M) fällde utslagsrösten mot.
    Källa: skd.se "ar-det-under-epitetet-smasnala-utsugare..."
  - **2026-06-08**: SKD rapporterar att styret vänt och nu planerar införa fri
    kollektivtrafik för 70+ "från nästa år" — dvs **2027**, inte 2026 som
    nuvarande text påstår. Källa: skd.se "ovantade-inviten-till-pensionarerna..."
  - Exakt beslutsdatum för vändningen är INTE verifierat ännu.
- **Nästa steg:** fråga registratorn, eller sök i Ciceron-API:et, för det faktiska
  protokollet. Uppdatera sedan `beskrivning`/`resultat`/`kalla_url` i JSON:en
  i linje med vad som verkligen går att verifiera.

### B. "Kommunens yttrande om ny stambana Hässleholm-Lund" — avgränsningsfråga

- Enda verifierade formella beslutet: kommunstyrelsen tog ställning
  **2021-03-23** — det är FÖRE mandatperioden 2022-2026 som sajten är
  avgränsad till.
- Trafikverkets process pausades 2023, ny lokaliseringsutredning startade
  först 2026 (hoor.se "planeringen-av-fyra-spar...", publicerad 2026-05-29).
  Inget senare formellt Höör-yttrande hittat inom 2022-2026.
- **Beslut Jonas behöver ta:** antingen (a) plocka bort ärendet som utanför
  tidsramen, eller (b) behålla det men datera 2021-03-23 med tydlig notis om
  att det ligger före mandatperioden.

### C. "Höör saknar medborgarförslag" — enkel fix, ej genomförd än

- Inget kommunalt beslut — det är ett granskande reportage som dokumenterar
  en avsaknad. Exakt publiceringsdatum verifierat: **2026-06-30, 06:00**
  (skd.se "m-i-hoor-lovade-okat-inflytande-men-nobbar-medborgarforslag").
- Förslag: sätt `"datum": "2026-06-30"` + en `datum_not` som förklarar att
  det är artikelns publiceringsdatum, inte ett kommunalt beslutsdatum. Det
  räcker för att ärendet ska hamna i den sorterade tidslinjen istället för
  bland "Odaterade ärenden" (se `src/pages/arenden/index.astro`).
- Inget öppet ställningstagande här — bara väntar på klartecken.

## Övrigt värt att veta

- Ett `Agent`-verktygsanrop (general-purpose-subagent, samma researchuppdrag
  som ovan) gav ett trasigt svar mitt i sessionen — bara "Quibble, hey little
  guy 👋" plus ett agent-id, inget faktiskt researchresultat. Inget
  `SendMessage`-verktyg fanns tillgängligt för att återuppta den. Gjorde om
  researchen direkt med WebSearch/WebFetch istället, vilket fungerade normalt.
  Värt att prova delegering igen om det händer igen, men lita inte blint på
  Agent-resultat utan att sanity-checka dem först.
