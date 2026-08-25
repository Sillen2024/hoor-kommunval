# KOLADA_PLAN.md — etappindelad instruktion för Kolada-integrationen

**Skapad:** 2026-08-15
**Motsvarar:** TASK.md punkt 20 (D7), `OPUS_GRANSKNING_2026-08-15.md` §D7
**Status:** etapp 0, 1 och 2 klara 2026-08-16 (commit `fad5e40`, `1fadfb7`, `90ce9c3`,
`5542b38`, `3824330`). Punkt 20 i TASK.md är därmed avklarad. **Etapp 3 klar
2026-08-17** (commit `ff859b8`). Etapp 4 avvaktas enligt Jonas beslut 2026-08-17
— spärren i 4.3 väger tyngre än nyttan så nära valet.

> Den här filen är trådhållaren för Kolada-arbetet. Allt som verifierats mot API:et
> står under §2–§4 så att ingen session behöver upptäcka det på nytt. Kryssa av i §6.

---

## Statuslegend

Samma som TASK.md: `[ ]` ej påbörjad · `[~]` påbörjad · `[x]` klar · `[–]` struken med motivering

---

## 1. Varför

Budgetsidan presenterar idag 1 330 mnkr utan referenspunkt. De flesta av Höörs
17 000 invånare har ingen intuition för om det är mycket eller lite. Kolada är den
enda källan som kan sätta Höörs siffror i sammanhang — och nyckeltalsfamiljen
**nettokostnadsavvikelse** neutraliserar dessutom "vi är en liten kommun"-försvaret,
eftersom den jämför Höörs faktiska utgifter mot SCB:s referenskostnad för en kommun
med Höörs demografi.

Poängen är inte att värdera. Siffrorna är tolkningsbara åt båda håll — styret kan
kalla dem effektivitet, oppositionen underfinansiering. Sajten redovisar utfallet
och låter läsaren dra slutsatsen. Det är samma hållning som resten av sajten.

---

## 2. Licensvillkor — läs innan något publiceras

Från <https://www.kolada.se/om-oss/api/>:

- Användning är **avgiftsfri och kräver inget avtal**. Kommersiell användning tillåten.
- Källa ska anges: **"Källa: Kolada"**.
- **`Gör du egna bearbetningar på vår data, får inte Kolada anges som källa.`**
- Tjänsten får inte presenteras som officiellt samarbete eller partnerskap med RKA/Kolada.
- Data tillhandahålls i befintligt skick; revideringar aviseras inte.

**Konsekvens för sajten — detta är inte en detalj:**

| Vad som visas | Hur det ska märkas |
|---|---|
| Ett råvärde rakt ur API:et (t.ex. Höörs −21,8 %) | `Källa: Kolada` — befintlig `.source-link` |
| Skånesnitt, ranking, differens, indexering, egen omräkning | `Egen bearbetning av data från Kolada` — **inte** `Källa: Kolada` |

De två måste vara visuellt åtskilda. Sajtens hela trovärdighetsmodell bygger på att
`✓ Källbelagt` betyder något exakt. Om en egenräknad ranking bär samma märke som ett
protokollcitat urholkas märket. Överväg en egen CSS-klass (`.derived-link` e.d.) med
annan färg och annat prefix än `.source-link`.

---

## 3. API-fakta (verifierat mot skarpa anrop 2026-08-15)

- **Bas:** `https://api.kolada.se/v3/` — **v2 är avstängd** och svarar
  `{"error": "This endpoint is deprecated. Please use /v3 instead."}`
- **Höörs kommunkod: `1267`** (`/v3/municipality?title=Höör`)
- **Datahämtning använder sökvägsform, inte query-parametrar.**
  Fungerar: `/v3/data/kpi/{kpi_id[,...]}/municipality/{kod[,...]}/year/{år[,...]}`
  Fungerar **inte**: `/v3/data?municipality=1267&kpi=N15033&year=2024` → tomt svar utan felkod.
- **För många id:n i URL:en ger `HTTP 422`.** 33 kommuner samtidigt fallerar;
  8 kommuner × 4 KPI:er fungerar. Chunka och slå ihop resultaten.
- **Paginering:** svaren har `next_url` / `previous_url` / `count`. Följ `next_url`
  tills den är `null`. `per_page` över gränsen ger 422.
- **KPI-metadata:** `/v3/kpi/{id}` → `title`, `description`, `operating_area`,
  `municipality_type`, `prel_publication_date`, `publication_date`, `publ_period`.
  Hela katalogen: `/v3/kpi` med paginering — **6 138 nyckeltal** totalt.
- **Värdeformat:** varje post har `values: [{gender, count, status, value, isdeleted}]`.
  Filtrera på `gender == "T"` (totalt) och hoppa över `value == null`.
  Kontrollera `status` och `isdeleted` innan värdet skrivs till JSON.
- **Jämförelsegrupper:** `/v3/municipality_groups?title=Höör` ger tolv officiella
  SKR-grupper, se §4.3. Medlemmar hämtas via `/v3/municipality_groups/{id}`.
- **Enhetsnivå:** `/v3/ou?municipality=1267` listar enskilda verksamheter i Höör
  (Sätofta förskola, Tjörnebo, Maglehill, Fogdaröd, Norra Rörum, Kubeliden m.fl.).
  KPI-metadatan har `has_ou_data: true/false` som talar om vilka nyckeltal som finns
  på enhetsnivå.
- **Teckenkodning:** svaren är UTF-8, men titlar från `municipality_groups` kom
  tillbaka dubbelkodade i vår hämtning. Verifiera kodningen innan text från API:et
  skrivs till `src/data/`. Skriv hellre egna svenska etiketter än att lita på API-titeln.

---

## 4. Verifierade siffror — behöver inte hämtas om för att fatta beslut

Allt nedan är hämtat 2026-08-15. Vid implementation ska värdena hämtas på nytt av
skriptet, men de duger som underlag för prioritering och som regressionskontroll.

### 4.1 Höör över tid

| Nyckeltal | 2018 | 2022 | 2023 | 2024 | 2025\* |
|---|---|---|---|---|---|
| Nettokostnadsavvikelse totalt, % (N00097) | −2,9 | −2,3 | −4,2 | −2,6 | **−8,4** |
| Nettokostnadsavvikelse grundskola, % (N15001) | −1,7 | +2,0 | −2,2 | −4,1 | **−8,3** |
| Nettokostnadsavvikelse grundskola, mnkr (N15045) | −3,6 | +4,9 | −5,8 | −11,6 | **−24,2** |
| Nettokostnadsavvikelse förskola, % (N11024) | −8,1 | −16,9 | −17,5 | −19,2 | **−21,8** |
| Nettokostnadsavvikelse förskola, mnkr (N11038) | – | – | – | −28,6 | **−33,6** |
| Nettokostnadsavvikelse äldreomsorg, % (N20900) | +2,3 | −1,3 | −0,7 | +13,4 | +2,0 |
| Kostnad grundskola, kr/elev (N15027) | 102 270 | 121 129 | 125 591 | 128 615 | 125 749 |
| Elever per lärare (N15033) | 12,2 | 11,9 | 12,2 | 12,5 | 11,9 |
| Behöriga till yrkesprogram, % (N15428) | 83,2 | 84,8 | 89,7 | 86,6 | 87,3 |
| Meritvärde åk 9 (N15507) | 228 | 222 | 230 | 227 | 229 |
| Kostnad förskola, kr/inskrivet barn (N11008) | 143 581 | 151 312 | 156 205 | 162 873 | 166 205 |
| Barn per årsarbetare, förskola (N11102) | 5,5 | 5,6 | 5,5 | 5,6 | 5,6 |
| Resultat, % av skatt + generella bidrag (N03001) | 2,2 | 6,7 | 3,4 | 4,0 | 7,8 |
| Soliditet, % (N03106) | 51,2 | 61,9 | 44,6 | 37,1 | 39,2 |
| Skattesats kommun, % (N00901) | 21,9 | 21,8 | 21,8 | 21,8 | 21,8 |
| Väntetid särskilt boende, dagar (U23401) | 75 | 31 | 49 | 89 | 78 |

\* **2025 är preliminärt.** `prel_publication_date: 2026-05-04`,
`publication_date: 2026-09-30` — alltså efter valet. 2024 är fastställt.
**2024 ska vara huvudår i all publicering före valet; 2025 får bara visas märkt
som preliminärt.** Se etapp 5.

### 4.2 Höör mot Skånes 33 kommuner, 2025 (preliminärt)

| Nyckeltal | Höör | Skånesnitt | Placering (1 = lägst) |
|---|---|---|---|
| Nettokostnadsavvikelse förskola | **−21,8 %** | −1,8 % | **1 av 33** |
| Nettokostnadsavvikelse grundskola | −8,3 % | −1,4 % | 4 av 33 |
| Soliditet | 39,2 % | 42,7 % | 15 av 33 |
| Nettokostnadsavvikelse äldreomsorg | +2,0 % | −2,9 % | 21 av 33 |

Näst lägst på förskola är Landskrona (−16,1). Höör ligger 5,7 procentenheter under
näst sista plats — det är inte en marginalskillnad.

Kommunkoder för Skåne (33 st) som användes:
`1214 1230 1231 1233 1256 1257 1260 1261 1262 1263 1264 1265 1266 1267 1270 1272
1273 1275 1276 1277 1278 1280 1281 1282 1283 1284 1285 1286 1287 1290 1291 1292 1293`

### 4.3 Officiella jämförelsegrupper för Höör

`/v3/municipality_groups?title=Höör`:

| Grupp-id | Titel |
|---|---|
| G37411 | Liknande kommuner, övergripande, Höör, 2025 |
| G35951 | Liknande kommuner grundskola, Höör, 2024 |
| G85837 | Liknande kommuner förskola, Höör, 2024 |
| G85545 | Liknande kommuner fritidshem, Höör, 2024 |
| G36243 | Liknande kommuner gymnasieskola, Höör, 2024 |
| G176571 | Liknande kommuner äldreomsorg, Höör, 2024 |
| G39584 | Liknande kommuner LSS, Höör, 2024 |
| G36535 | Liknande kommuner IFO, Höör, 2024 |
| G175991 | Liknande kommuner ekonomiskt bistånd, Höör, 2023 |
| G176281 | Liknande kommuner socioekonomi, Höör, 2024 |
| G216181 | Liknande kommuner arbetsmarknad, Höör, 2024 |
| G219124 | Liknande kommuner räddningstjänst, Höör, 2024 |

G35951 (grundskola) består av: Gnesta, Söderköping, Östra Göinge, Lilla Edet, Kil,
Gagnef, Lycksele.

**Avvägning:** grupperna är metodiskt starkast (strukturellt matchade), men en
Höörsbo jämför intuitivt med Hörby, Eslöv och Sjöbo. Visa hellre båda och förklara
skillnaden än att välja en.

### 4.4 Rättelser till §4.1 och §4.2 (upptäckta vid etapp 0)

Skarp hämtning 2026-08-16 reproducerade **samtliga** värden i §4.1 och §4.2, inklusive
förskolans −21,8 % och plats 1 av 33. Tre saker i tabellerna ovan var ändå fel eller
oprecisa, och är rättade i `kolada.json`:

1. **N11038 (förskola, mnkr) har värden även 2018–2023** — strecken i §4.1 var en lucka i
   den första hämtningen, inte i Kolada. Faktiska värden: 2018 −9,0 · 2022 −22,4 ·
   2023 −24,6 mnkr. Serien är alltså sammanhängande: avvikelsen har vuxit varje år.
2. **N00097 heter "Nettokostnadsavvikelse totalt (exkl. LSS)".** LSS ingår inte. Etiketten
   i §4.1 sa bara "totalt", vilket inbjuder till att läsa siffran som hela kommunens
   verksamhet. Rättat i skriptets etikett.
3. **N00901 (skattesats) är 21,88 för 2018 och 21,75 för 2022–2025**, inte 21,9/21,8.
   Bara avrundning i §4.1, men 21,75 är den siffra som står i budgetbesluten och ska
   användas.

Notera också: `U23401` saknar värden för två av Skånes 33 kommuner (31 av 33 svarar).
En ranking på det nyckeltalet måste redovisa antalet kommuner som faktiskt ingår.

---

## 5. Teknisk modell

Sajten är helstatisk och läser JSON direkt från `src/data/` (t.ex.
`budget/index.astro:3–4`). Kolada ska följa samma mönster som `scripts/og-bilder.mjs`:
**ett handkört skript, ingen build-koppling, ingen runtime-fetch.** Sajten ska bygga
och fungera även om Kolada ligger nere.

```
scripts/hamta-kolada.mjs   →  src/data/kolada.json   (checkas in i git)
```

`kolada.json` ska innehålla, per nyckeltal:

- `kpi_id`, `titel` (egen svensk etikett), `kolada_titel` (API:ets), `beskrivning`
  (API:ets `description` — den innehåller källhänvisningen, t.ex. "Källa: Skolverket")
- `enhet`, `operating_area`
- `varden`: `{ "1267": { "2018": …, … } }` — **råvärden, oberäknade**
- `preliminar_fran_ar` — vilket år som ännu inte är fastställt
- `publicering`: `prel_publication_date`, `publication_date`, `publ_period`
- `hamtad`: ISO-datum för hämtningen

Beräknade värden (snitt, ranking, differens) räknas i Astro vid byggtid ur råvärdena,
**inte** i hämtskriptet. Då finns alltid en oberäknad siffra att peka på, och
gränsen mot §2:s licensvillkor blir enkel att hålla.

Hämtskriptet ska:
1. Chunka kommunlistor (max ~8 åt gången), följa `next_url`, och avbryta högt vid 422.
2. Filtrera `gender == "T"`, hoppa över `null` och `isdeleted`.
3. **Aldrig skriva en tom eller partiell `kolada.json`.** Bygg i minnet, validera att
   varje efterfrågat KPI har minst ett Höörvärde, skriv sedan. Ett API-fel får inte
   tömma sajtens data.
4. Skriva ut en diff mot föregående körning så att revideringar i Kolada syns
   (RKA aviserar dem inte, se §2).

---

## 6. Etapper

### Etapp 0 — grund och ärlighet — KLAR 2026-08-16

- [x] **0.1** `scripts/hamta-kolada.mjs` enligt §5. De sexton nyckeltalen i §4.1,
      för Skånes 33 kommuner, 2018–2025. Kör: `node scripts/hamta-kolada.mjs`.
- [x] **0.2** `src/data/kolada.json` genererad och incheckad (150 KB).
      Reproducerar §4.1 och §4.2 exakt — se §4.4 för de tre avvikelserna, som alla
      är fel i den här filen, inte i datan.
- [x] **0.3** `.derived-note` i `global.css` (ockra, streckad ram, prefix
      `∑ Egen bearbetning — `) vid sidan av gröna `.source-link` (`✓ Källbelagt — `).
      Båda demonstrerade i praktiken på `/om-urvalet/#kolada`.
- [x] **0.4** `/ordlista/` — fyra nya begrepp inlagda i svensk bokstavsordning, med
      Höörexempel för nettokostnadsavvikelse (förskolan 2024: −19,2 % = −28,6 mnkr)
      och soliditet (37,1 % 2024 mot 51,2 % 2018). Källänkarna går till det exakta
      API-anropet, så läsaren kan se råvärdet själv. Nettokostnadsavvikelsen är
      uttryckligen skriven som **inte** samma sak som att kommunen sparar pengar.
      Ingressen och slutnoten är omskrivna: de påstod att alla begrepp kom ur protokoll.
- [x] **0.5** `/om-urvalet/#kolada` — fem stycken om vad Kolada och RKA är, varför
      kommunen inte kan ha valt siffrorna, hämtningsmodellen, märkningsskillnaden och
      att 2025 fastställs först 2026-09-30. Omfattning, preliminärår, fastställandedatum
      och huvudår **räknas ur `kolada.json`**, inte skrivna i prosan. De sexton
      nyckeltalen ligger också i källförteckningen med var sin API-länk.
      D7 fanns aldrig i sajtens egen lucklista (granskningens fallback-råd på
      `OPUS_GRANSKNING_2026-08-15.md:197` hade inte utförts) — inget att ta bort.

**Klar när:** en siffra kan renderas på sajten med korrekt märkning och en läsare
kan slå upp vad den betyder. ✔

### Etapp 1 — referenskostnad på `/budget/` (högst prioritet) — KLAR 2026-08-16

- [x] **1.1** Sektionen `#referenskostnad` på `/budget/`, mellan nämndramarna och
      oppositionens förslag. Tabell över sju verksamheter för huvudåret, i mnkr och
      procent, med vilken nämnds ram var och en ligger i. Sorterad på mest negativ
      avvikelse först. **Nio nya nyckeltal** hämtades för att alla verksamheter ska
      finnas i båda enheterna (fritidshem, gymnasieskola, IFO och LSS i % och mnkr,
      äldreomsorg i mnkr) — annars hade tabellen tvingats byta enhet mitt i.
      LSS togs med därför att det inte ingår i N00097 och annars fallit bort helt.
- [x] **1.2** Tidsserie {2018}–2025 i mnkr för förskola, grundskola och äldreomsorg,
      2025 märkt med asterisk och fastställandedatum.
- [x] **1.3** Underrubrik "Vad det betyder för oppositionens förslag": största
      föreslagna höjningen av BUN:s ram under mandatperioden (V inför 2026, +11,5 mnkr)
      ställd mot förskolans och grundskolans samlade avvikelse (−40,2 mnkr, märkt
      `.derived-note` eftersom Kolada inte publicerar summan). Not som säger rakt ut
      att talen **inte** är varandras motsvarighet och inte får subtraheras.
      **Rättat 2026-08-25:** stod först "S inför 2027, +24,6 mnkr". 24,6 är hela
      ramökningen mot 2026 i S:s eget förslag, inte skillnaden mot styret — styret
      föreslog 16,1 av den. Skillnaden är 8,5 mnkr. Talen i `oppositionsbudgetar.json`
      är alltid partiets nämndram minus styrets nämndram för samma år; kontrollräkna
      alltid mot budgetramstabellerna innan något av dem används i text.
- [–] **1.4** OG-bilden lämnad som `og-budget-v1.png`. Motivering: bildens innehåll
      (skattesänkningen 80 öre → "Vad blir det för dig?") är oförändrat sant och
      svarar fortfarande mot sidans första sektion. En versionshöjning utan ändrat
      innehåll hade bara tvingat fram ny Facebook-scraping i deploy-checklistan utan
      att någon ser något nytt. **Kvar som redaktionellt val för Jonas:** sidans
      starkaste delningsbara siffra är numera förskolans avvikelse, inte skattesatsen.
      Vill du byta bildmotiv är det då `og-budget-v2.png` som gäller.

**Klar när:** ingen siffra på budgetsidan står längre utan referenspunkt. ✔

**Upptäckt under arbetet:** §1.2 ovan påstod att förskolans avvikelse fallit "varje år
sedan 2018". Det stämmer inte — 2020 bröt trenden (−17,8 → −11,3 mnkr). Rätt svar är
att den fallit obrutet sedan **2020**. Sidan räknar numera ut sådana trendpåståenden ur
serien vid byggtid i stället för att ha dem i prosan, så att de inte kan glida isär från
datan när Kolada reviderar. Samma sak gäller åren då grundskolan låg över
referenskostnaden och påståendet om att förskolan haft mandatperiodens största negativa
avvikelse varje år — det sista renderas bara om det faktiskt stämmer.

### Etapp 2 — `/nyckeltal/`, Höör i jämförelse

- [x] **2.1** `src/pages/nyckeltal/index.astro`. Alla tre referenserna, med ett eget
      avsnitt (`#tre-referenser`) om varför de skiljer sig. Konkret siffra på det:
      av de 42 kommuner som ingår i Höörs åtta grupper ligger bara 9 i Skåne.
      Skriptet hämtar nu grupperna (`GRUPPER`, åtta st) och deras medlemmar, så
      `kolada.json` täcker 66 kommuner i stället för 33.
- [x] **2.2** Alla snitt, placeringar och sorteringar bär `.derived-note`. De fyra
      funktionerna som producerar uträknade tal (`snitt`, `placering`, `rader`,
      och verksamhetstabellens sammanställning) ligger samlade under en egen
      kommenterad rubrik i frontmattern, så att licensgränsen syns i koden.
- [x] **2.3** `src/components/Jamforelse.astro`. `<ol>` med grid, inte `<table>`:
      under 40rem bryter namn och värde ner på egen rad över stapeln, vilket ger
      noll horisontell scroll utan att korta av "Östra Göinge". Staplarna är divar
      med inline-bredd uträknad vid byggtid — ingen JavaScript. Namn och siffra
      står i klartext på varje rad, så stapeln kan vara `aria-hidden`.
      Nollan ritas alltid ut som linje när den ligger inom skalan.
- [x] **2.4** Nav (efter Budget), `llms.txt`, `og-nyckeltal-v1.png` (genereras ur
      `kolada.json` av `scripts/og-bilder.mjs`). Sitemap kommer automatiskt via
      `@astrojs/sitemap`. `/budget/#referenskostnad` länkar vidare till sidan.

**Klar.** Fynd som sidan räknar fram själv: Höör ligger lägst av Skånes 33 i
förskolans nettokostnadsavvikelse både 2024 (−19,2 %) och preliminärt 2025 (−21,8 %),
mot ett Skånesnitt på −1,1 %. Näst lägst 2024 är Klippan på −15,5 %. Förskolan är
det enda måttet där alla tre referenserna pekar åt samma håll — och den meningen
renderas bara om villkoret verifieras i datan vid byggtid.

**Färgval att inte ändra utan att tänka efter:** alla staplar har samma neutrala
färg, bara Höörs är accentfärgad. Att färga negativa värden röda vore en värdering
— en nettokostnadsavvikelse under noll kan läsas som sparsamt eller som
underfinansierat, och sajten ska inte välja åt läsaren (jfr B3).

### Etapp 3 — utfall mot löfte — KLAR 2026-08-17 (commit `ff859b8`)

- [x] **3.1** Temakopplingen ligger i `TEMA_NYCKELTAL` i nya `src/lib/tema-karta.ts`,
      dit även `TEMA_KARTA`/`TEMA_ORDNING` flyttats (låg tidigare kopierade i
      `/jamforelse/` och `/din-vardag/` och hade glidit isär — sex rubriker saknades
      i `/din-vardag/`, nu åtgärdat). Tre teman har nyckeltal: Skola och barnomsorg
      (6 mått), Vård och omsorg (3), Näringsliv och ekonomi (4). Övriga teman saknar
      nyckeltal i uttaget och `Utfall.astro` renderar då ingenting — medveten frånvaro.
      **Avvikelse från planens "2018–2024":** spannet är valåret 2022 → senaste
      fastställda året. Metodbytet 2019 gör 2018-jämförelser skeva för
      nettokostnadsavvikelserna, och "under mandatperioden" (3.3) är det spann som
      hör ihop med löftena från valet 2022. Långa serien finns kvar på `/nyckeltal/`.
- [x] **3.2** `src/components/Utfall.astro` renderas sist i varje temasektion på
      `/jamforelse/` ("Hur har det gått hittills?") och på `/partier/[id]/` under
      rubriken "Hur har det gått i områdena X skriver om?" — bara för teman där
      partiet har ståndpunkter. Kolonner: Höör 2022, Höör huvudår, Snitt Skåne
      (märkt `derived-note`; råvärdena `source-link` till API-anropet).
- [x] **3.3 — spärr.** Noten renderas alltid: "Siffrorna visar hur det blev — inte
      vilket parti som orsakat det", mandaten 17 av 41 räknas ur `partier.json`,
      och länkarna går till /arenden/ (vem röstade hur) och /nyckeltal/. Ingen
      formulering värderar eller pekar ut parti; granskad mot B3-måttstocken.

**Klar när:** manifestlöften kan läsas mot utfall utan att sajten tar ställning. ✔

### Etapp 4 — enhetsnivå på `/din-vardag/` — AVVAKTAS (Jonas beslut 2026-08-17)

Byggs inte före valet. Spärren i 4.3 väger tyngre än nyttan: små enheter ger
slumpvariation och namngivna verksamheter är namngivna arbetsplatser. Punkterna
står kvar ifall frågan öppnas igen efter valet.

- [ ] **4.1** Kartlägg vilka nyckeltal som har `has_ou_data: true` och faktiskt har
      värden för Höörs enheter.
- [ ] **4.2** Data per förskola/skola i Höör — den mest vardagsnära siffran som finns.
- [ ] **4.3 — spärr.** Enhetsnivå är känsligt. Små enheter ger små tal och stora
      slumpvariationer, och namngivna verksamheter är namngivna arbetsplatser.
      Sätt ett minsta underlag (`count`) och visa inte enheter under det. Överväg
      att helt avstå från kvalitetsomdömen på enhetsnivå och bara visa struktur
      (antal barn per årsarbetare o.d.).

**Klar när:** en förälder kan se siffror för sin egen förskola — eller så är etappen
medvetet struken med skriven motivering.

### Etapp 5 — efter valet

- [ ] **5.1** Kör om `hamta-kolada.mjs` efter **2026-09-30**, när 2025 fastställs.
- [ ] **5.2** Ta bort alla "preliminärt"-markeringar för 2025 och kontrollera om
      värdena reviderats. Om de ändrats: skriv ut det öppet, ta inte bort tyst.
      Särskilt förskolans −21,8 % — den siffran kommer att citeras.

---

## 7. Risker att bevaka

1. **Licensgränsen (§2)** är den enda punkt där sajten kan göra formellt fel.
   Blanda aldrig råvärde och bearbetning i samma märkning.
2. **Preliminär data före valet.** 2025 publiceras definitivt först 2026-09-30.
   Om ett preliminärt värde citeras i lokalpressen och sedan revideras är det
   sajtens trovärdighet som tar smällen. 2024 är huvudår.
3. **Nettokostnadsavvikelse är lätt att övertolka.** Den mäter avvikelse från en
   modellerad referenskostnad, inte kvalitet och inte politisk vilja. Förklaringen
   i `/ordlista/` är inte valfri.
4. **Kausalitet.** Se etapp 3.3. Minoritetsstyre + SD som vågmästare gör alla
   enkla orsakspåståenden felaktiga.
5. **Proportioner.** Granskningens §5 varnade redan för att AI-delen är för stor
   i förhållande till faktadelen. Kolada gör faktadelen tyngre, vilket är bra —
   men `/nyckeltal/` får inte svälla till att dominera en sajt vars kärna är
   protokollförda beslut.

---

## 8. Sammanhang

- TASK.md punkt 20 är den här filen. Kryssa av punkt 20 först när etapp 0–2 är klara.
- `hoor-kommunval-2026-instruktion.md:92` listar Kolada som datakälla:
  *"objektiva nyckeltal för Höör (skola, äldreomsorg, ekonomi) som referens, inte som
  partiställningstagande."* Etapp 3.3 och risk 4 är den meningen omsatt i praktik.
- Flera sessioner arbetar parallellt i repot: commita bara egna filer, aldrig `git add -A`.
