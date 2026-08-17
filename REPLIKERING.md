# Replikera valgranskningssajten för din kommun

**Skriven 2026-08-17, baserad på bygget av Höör-sajten (11–17 augusti 2026).**

Det här dokumentet är en instruktion till **Claude Code** (eller en människa med
Claude Code) för att bygga motsvarande sajt för en annan svensk kommun. Ge hela
dokumentet till Claude Code som startinstruktion, byt ut "kommun Y" mot din kommun,
och arbeta igenom tasklistan i §6. Höör-repot finns som referensimplementation:
`github.com/Sillen2024/hoor-kommunval.git`.

---

## 1. MÅL — vad du ska ha när du är klar

> **En statisk webbsajt där en väljare i kommun Y på tio minuter kan se:
> (a) vad varje parti säger att de vill göra nästa mandatperiod,
> (b) vad styret faktiskt har beslutat under innevarande mandatperiod, med
> röstsiffror och oppositionens motförslag, och
> (c) hur kommunens siffror står sig mot jämförbara kommuner —
> där varje enskilt påstående länkar till ett originaldokument.**

Definition av klart:

- [ ] Alla partier i fullmäktige har en partisida med källbelagda ståndpunkter per politikområde — eller en ärlig notis om att partiet inte publicerat något
- [ ] Alla mandatperiodens budgetbeslut visas med röstsiffror, reservationer och oppositionens egna budgetförslag i fulltext
- [ ] En kurerad lista på 10–15 väljarrelevanta ärenden med protokollkälla
- [ ] Nyckeltal från Kolada i jämförelse med grannkommuner/länet
- [ ] En metodsida ("Om urvalet") som redovisar exakt vad som valts bort och varför
- [ ] Noll AI-anrop i drift — sajten är statisk, datan är incheckad JSON
- [ ] Varje datapunkt har `kalla_url` som fungerar (länkkontrollerad)

## 2. Vad vi byggde (X) — referens

Höör-sajten är en Astro-sajt (statisk, inga ramverk i klienten, ingen databas) med
platta JSON-filer i `src/data/` som enda datalager. Sidorna:

| Sida | Innehåll | Datakälla |
|---|---|---|
| `/partier/` + `/partier/[id]/` | Manifest per politikområde, kandidatlista, track record i voteringar | Partiernas kanaler + Valmyndigheten + protokoll |
| `/budget/` | Alla budgetbeslut sida vid sida, skattetabell "vad kostar X öre mig" | Protokoll via portalens API |
| `/styret-vs-oppositionen/` | Berättande genomgång: hur striden faktiskt stod, kontrapropositioner, splittringar | Protokoll |
| `/jamforelse/` | Styre vs opposition, filtrerbar per politikområde | partier.json |
| `/arenden/` | Kurerad ärendelista med urvalsmotivering per post | Protokoll + lokalpress (endast som urvalskriterium) |
| `/nyckeltal/` | Nettokostnadsavvikelser m.m. mot 33 grann-/länskommuner | Kolada API v3 |
| `/valkompass/` | Förenklad kompass, varje påstående kopplat till källbelagd ståndpunkt | Egna data ovan |
| `/din-vardag/` | Ingång via livssituation (förälder, pensionär …) | Egna data ovan |
| `/historiska-val/` | Valresultat bakåt | Valmyndigheten/SCB |
| `/om-urvalet/` | Metodsidan — obligatorisk | — |
| `/ordlista/`, `/ratta/`, `/om/` | Stödsidor; `/ratta/` = "hittat ett fel?" | — |

Teknik: Astro 7, Node 22, `@astrojs/sitemap`. Docker: `node:22-alpine` bygger,
`nginx:alpine` serverar `dist/`. Datadrivna OG-bilder genereras med `sharp`
(`scripts/og-bilder.mjs`). Läsbarhetsvakt: `scripts/lix.mjs` mäter LIX på byggd HTML.

## 3. Icke förhandlingsbara principer

Dessa är inte stil — de är det som gör sajten trovärdig och omöjlig att avfärda:

1. **Fakta, inga värderingar.** Aldrig "om X vinner kommer…". Bara: detta beslutades (källa), detta säger partiet (källa). Läsaren drar slutsatsen.
2. **AI endast i byggfasen.** Claude läser/strukturerar dokument EN gång. Den färdiga sajten gör inga LLM- eller API-anrop. Ingen löpande kostnad, inget som kan hallucinera i drift.
3. **Källhänvisning på varje datapunkt.** Ståndpunkt utan `kalla_url` publiceras inte. Hellre en ärlig lucka ("partiet har inte publicerat något") än en gissning.
4. **Metodsidan är obligatorisk** och länkas i sidfoten. Den redovisar: varför sajten är kurerad och inte heltäckande, exakt vad som uteslutits, urvalskriterierna i klartext.
5. **En rangordning är inte en åsikt** om grunden är utskriven — sortera efter det som berör flest/mest pengar/störst avvikelse, och skriv ut vilket.
6. **Skilj råvärden från egna bearbetningar.** Ett tal rakt ur en källa märks "Källa: X". Ett snitt/en ranking du räknat själv märks "Egen bearbetning av data från X" — Koladas licens *kräver* detta, och trovärdighetsmodellen bygger på att källmärket betyder något exakt.

Kopiera även redaktionsreglerna i Höör-repots `CLAUDE.md` (§ Redaktionsregler) —
de tio reglerna ("Svaret först", "LIX ≤ 45", "Rubriker är läsarens frågor",
"Varje stort tal får en jämförelsepunkt" osv.) kom ur tre AI-granskningar och
hindrar sajten från att växa tillbaka till förvaltningsprosa.

## 4. Förutsättningar

- **Verktyg:** Claude Code, Node ≥ 22, Python 3, git. Valfritt: Docker + VPS för drift (vilken statisk hosting som helst fungerar — Netlify/Cloudflare Pages/GitHub Pages duger).
- **Tid:** Höör tog ~6 dagars intensivt arbete inklusive tre granskningsrundor. Räkna med 1–2 veckor kalendertid; datainhämtningen är flaskhalsen, inte sajtbygget.
- **Lokalkännedom hjälper men räcker inte** — allt ska ändå källbeläggas innan publicering.
- **Kommunens förutsättningar varierar.** Det som är *universellt* för alla 290 kommuner: Kolada, Valmyndighetens kandidatregister, offentlighetsprincipen (registratorn). Det som *varierar*: mötesportalens plattform, partiernas digitala närvaro, webb-TV. §5 beskriver hur du hanterar varje fall.

## 5. Datakällorna — och hur de generaliserar

### 5.1 Kolada (universell — fungerar identiskt för alla kommuner)

Kommun- och landstingsdatabasen, `https://api.kolada.se/v3/`. Gratis, inget avtal,
ingen nyckel. Hitta din kommunkod: `/v3/municipality?title=Y`.

Dyrköpta API-fakta (verifierade 2026-08-15, se `KOLADA_PLAN.md` i Höör-repot):

- **v2 är avstängd.** Använd `/v3/`.
- **Sökvägsform, inte query-parametrar:** `/v3/data/kpi/{id,...}/municipality/{kod,...}/year/{år,...}`. Query-formen svarar **tomt utan felkod** — ser ut som "data saknas" men är fel anropsform.
- För många id:n i URL:en → HTTP 422. Chunka (8 kommuner × 4 KPI:er fungerar).
- Paginering via `next_url`, följ tills `null`.
- Filtrera värden på `gender == "T"`, hoppa över `value == null`, kolla `status`/`isdeleted`.
- Officiella jämförelsegrupper ("liknande kommuner"): `/v3/municipality_groups?title=Y`.
- **Licens:** råvärden märks "Källa: Kolada"; egna beräkningar får INTE märkas så — märk "Egen bearbetning av data från Kolada" och skilj dem visuellt.

Starkaste nyckeltalsfamiljen: **nettokostnadsavvikelse** (utfall mot SCB:s
referenskostnad för kommunens demografi) — den neutraliserar "vi är en liten
kommun"-försvaret och är tolkningsbar åt båda håll (effektivitet eller
underfinansiering), vilket är precis vad en värderingsfri sajt behöver.

Mönster: `scripts/hamta-kolada.mjs` körs för hand, skriver `src/data/kolada.json`,
som checkas in. Sajten bygger även om Kolada ligger nere.

### 5.2 Valmyndigheten (universell)

Öppna data, filen `kandidaturer.csv` — alla kandidater på alla valsedlar till alla
fullmäktige. Ger kandidatlistor per parti med toppnamn. Även historiska valresultat
och mandatfördelning finns hos Valmyndigheten/SCB.

### 5.3 Kommunens sammanträdesportal (varierar — här ligger detektivjobbet)

Detta är kärnkällan: protokoll ger beslut, röstsiffror, reservationer och
oppositionens egna budgetförslag i fulltext. Utan röstsiffror finns inget politiskt
drama — bara administrativa fakta. **Prioritera att knäcka den här källan.**

Höör använder **Ciceron** (Visma Consulting) på `sok-hr.unikom.se`. Många
skånska/svenska kommuner kör samma plattform (mönster: `sok-XX.unikom.se`).
Andra vanliga plattformar: Meetings Plus, NetPublicator, Assembly Voting, eller
platta dokumentlistor direkt på kommunsajten.

**Metoden som generaliserar** (viktigare än detaljerna): portalen är nästan alltid
en JavaScript-SPA som pratar med ett öppet, oautentiserat API. `curl` mot HTML-sidan
ger inget — **läs klientens JavaScript** (Network-fliken eller källfilerna) och hitta
API-anropen. I Höör var det ett JSON-RPC-API som aldrig dokumenterats någonstans;
det hittades genom att läsa `searchServices.js`, inte genom att gissa.

Om kommunen kör Ciceron fungerar Höör-metoden rakt av (fullt dokumenterad i
`KALLLUCKOR-RAPPORT.md` §1, körbart skript i `scripts/hamta-protokoll.py`):

```
POST https://sok-XX.unikom.se/json   (JSON-RPC 2.0, method "CiceronsokServer:<Metod>")
  ReadDiaries        → alla nämnder/diarier
  Search             → doctype 64 = protokoll; param är en JSON-STRÄNG (dubbel-serialiserad)
  ReadItems          → mötesträffarna, med hela dagordningen
  ReadObjectDetails  → dokumentlista per möte (protokoll, reservationer) med filename_b64
  ReadArendeFiles    → ALLA beslutsunderlag per ärende — inkl. oppositionens budgetförslag
GET /download/document?filename={filename_b64}&id={id}&session_id={sid}
```

Fallgropar från praktiken: kopiera `filename_b64` **exakt** från svaret (servern
kodar å/ä/ö med Latin-1 — egen base64-omkodning ger fel bytes och en HTML-felsida);
portalen 502:ar sporadiskt (retry:a); täckningen börjar ofta först mitt i
mandatperioden (Höör: 2023-05-24) — äldre protokoll begärs från registratorn.

### 5.4 Registratorn (universell — underskattad)

Mejla kommunens registrator och begär handlingar (offentlighetsprincipen). I Höör
svarade registratorn inom en dag, gratis, med PDF-bilagor — och tipsade dessutom om
att portalen var fritt sökbar. Använd för: protokoll äldre än portalens täckning,
handlingar som saknas, och verifieringsfrågor. Mall finns i `BEGARAN_OM_PROTOKOLL.md`.

### 5.5 Partiernas ståndpunkter (varierar mest — räkna med luckor)

Sanningen från Höör: **fem av nio partier saknade publicerat lokalt valmanifest.**
Lokala partisajter är ofta tomma skal (meny "Vår politik" med innehållslösa
undersidor). Arbeta dig ner genom eskalationstrappan, och dokumentera varje steg:

1. **Lokal partisajt** — manifest/valprogram som PDF eller sidor.
2. **Facebook/Instagram** — partiets lokala flöde. Höörs M kommunicerade hela sin plattform som 84 Facebook-reels; ståndpunkterna extraherades ur inläggstext + maskinell transkription av videorna (yt-dlp + KB-Whisper, `scripts/transkribera.py` — svensk Whisper från KBLab, fungerar på FB-reels utan cookies). Låt **en ståndpunkt = ett inlägg**, så att källänken alltid går att kontrollera mot påståendet.
3. **Riksmediers valkompasser** (SVT/lokalpress) — sekundärkälla för kommunspecifika svar.
4. **Mejla partiet** och fråga efter valprogram. Höör-modellen: ett rakt mejl före lansering — "så här kommer ni att presenteras, stämmer det?" — med länk till partiets sida, deadline före lansering, och löfte om löpande rättelser. Det ger partierna chansen att invända och gör att sajten aldrig kan anklagas för att ha smugit.
5. **Ärlig lucka.** Skriv ut i datan: `"manifest_status": "saknas"` med en not om exakt vad som kontrollerats och när. Det är en journalistisk poäng i sig att ett parti med 9 mandat inte publicerat någon lokal politik.

Märk varje partis datapost med `manifest_status` (`hemsida` / `sociala_medier` /
`saknas`) och en `manifest_not` som förklarar metoden för just det partiet.

### 5.6 Lokalpress (endast urvalskriterium)

Press används för att identifiera **vilka ärenden som varit omdebatterade** — aldrig
som sakkälla för själva beslutet. Sakkällan är alltid protokollet. (Undantag flaggas
öppet i datan om protokollet är onåbart.)

### 5.7 Webb-TV / fullmäktigesändningar (valfritt)

Kommunens webbsändningar har ofta undertextfiler eller går att transkribera
(KB-Whisper). Bra för att verifiera beslut utan formell votering ("acklamation")
och datum. Lägre prioritet än protokollen.

## 6. Tasklista — arbeta igenom i ordning

Skapa en `TASK.md` i ditt repo med den här listan och kryssa av löpande
(`[ ]` ej påbörjad · `[~]` påbörjad · `[x]` klar · `[–]` struken med motivering).
Committa varje logiskt avslutat steg direkt, inte allt i en klump.

### Fas 0 — Kartläggning (en halvdag)

- [ ] **0.1 Politisk karta:** Vilka partier sitter i fullmäktige? Mandatfördelning? Vem styr, i majoritet eller minoritet? Vem är kommunalråd? Källa: kommunens sajt + Valmyndigheten.
- [ ] **0.2 Portalkoll:** Vilken plattform kör mötesportalen? Ciceron/unikom → använd Höör-skripten. Annan → läs klient-JS:en och kartlägg API:et (§5.3). Notera täckningsfönstret (äldsta mötet).
- [ ] **0.3 Formatkoll:** Stickprovsöppna 2–3 protokoll. Textbaserade PDF:er eller skannade bilder? (Avgör om OCR behövs. Kolla vilken `pdftotext` du har — Xpdf kräver `-table`-flaggan för tabeller, poppler har andra flaggor.)
- [ ] **0.4 Partikanaler:** Lista varje partis lokala sajt + Facebook/Instagram. Notera direkt vilka som har publicerat program och vilka som är tomma skal.
- [ ] **0.5 Skriv MÅL-dokumentet:** kopiera §1 ovan, anpassa till kommun Y, sätt deadline (styr mot förtidsröstningens start, inte valdagen).

### Fas 1 — Datainhämtning

- [ ] **1.1 Budgetbesluten** (kärnan i "vad har hänt"): hämta protokollen för varje års budgetfullmäktige under mandatperioden. Extrahera: datum, paragraf, röstsiffror, reservationer, kontrapropositioner. Ladda även ner **oppositionens egna budgetförslag i fulltext** (i Ciceron: `ReadArendeFiles`). Detta är den mest koncentrerade politiska datan som finns.
- [ ] **1.2 Voteringsdata:** parsa ut alla voteringar med namngiven röstlängd per parti ur protokollen (mönster: `scripts/parsa-voteringar.py`). **Bygg in självkontroll:** jämför antalet parsade namn mot protokollets egna röstsiffror och flagga avvikelser. (Höör: 0 avvikelser på 31 voteringar — då kan datan användas.)
- [ ] **1.3 Kurerad ärendelista:** 10–15 väljarrelevanta ärenden. Urvalskriterier (skriv ner motiveringen PER ÄRENDE medan du väljer, inte i efterhand): (a) förekommer i lokalpress och/eller (b) rör politikområden partierna själva lyfter. Hämta protokoll + paragraf för varje.
- [ ] **1.4 Partiernas ståndpunkter:** eskalationstrappan i §5.5, parti för parti. En ståndpunkt = en källänk.
- [ ] **1.5 Kandidatlistor:** Valmyndighetens `kandidaturer.csv`, topp 5 per parti + länk till fullständig lista.
- [ ] **1.6 Kolada:** skriv/anpassa hämtskriptet (§5.1). Välj nyckeltal som rör det partierna bråkar om (skola, äldreomsorg, ekonomi, nettokostnadsavvikelser). Jämförelsegrupp: länets kommuner + grannar + SKR:s "liknande kommuner".
- [ ] **1.7 Historiska valresultat:** Valmyndigheten/SCB.
- [ ] **1.8 Skriv en källucke-rapport** (mönster: `KALLLUCKOR-RAPPORT.md`): allt du INTE hittade, varför, och vad som skulle kunna lösa det. Detta blir råmaterial till metodsidan och nästa researchrunda.

### Fas 2 — Datastrukturering

- [ ] **2.1 JSON-scheman:** följ Höörs `src/data/*.json` (partier.json, budget.json, arenden.json, kolada.json, valkompass.json, historiska_val.json, oppositionsbudgetar.json). Bärande fält: `kalla_url` + `kalla_titel` på varje ståndpunkt/beslut, `urvalsmotivering` på varje kurerat ärende, `manifest_status`/`manifest_not` per parti.
- [ ] **2.2 Källdokument publikt:** lägg nedladdade protokoll/reservationer/budgetförslag i `public/kallor/` så att sajtens länkar går till filer du själv serverar (kommunportaler ändrar sig; dina länkar ska inte ruttna).
- [ ] **2.3 Verifieringsdisciplin:** varje siffra som ska publiceras kontrolleras mot originaldokumentet en gång till. Gissa aldrig datum/paragrafer — Höörs "budget 2025 beslutades 2024-09-25" visade sig vara fel möte helt och hållet.

### Fas 3 — Sajtbygge

- [ ] **3.1 Skelettet:** Astro (eller motsvarande SSG), sidstrukturen i §2. Börja med partisidor + budget + om-urvalet; resten är påbyggnad.
- [ ] **3.2 Källänk-komponent:** en synlig, konsekvent `✓ Källa`-länk vid varje datapunkt. Separat visuell klass för egna bearbetningar ("Egen bearbetning av data från Kolada").
- [ ] **3.3 Metodsidan** (§3, princip 4): skriv den ur källucke-rapporten. Var sajten är tunn ska stå där, inte döljas.
- [ ] **3.4 Berättande sidor** (styret-vs-oppositionen): visa hur striden stod — röstsiffror, reservationer, oppositionens splittringar (kontrapropositioner!). Det är skillnaden mellan en sajt med politisk textur och en pliktskyldig faktalista.
- [ ] **3.5 Vardagsöversättning:** minst en sida som översätter abstrakta tal till läsarens plånbok/vardag ("vad kostar 30 öre i skattesats MIG i kronor per månad" — tabell över inkomstnivåer).
- [ ] **3.6 Tillgänglighet utan JS:** kärninnehållet ska fungera utan JavaScript (valkompassen i Höör fick byggas om för detta).

### Fas 4 — Granskning (hoppa inte över — detta gjorde Höör-sajten bra)

- [ ] **4.1 Fientlig AI-granskning:** låt en annan modell (eller en fräsch Claude-session utan byggkontext) granska sajten som en illvillig motståndare: "hitta allt som är fel, ogrundat eller vinklat". Höör körde tre rundor (Opus, Gemini, Fabel) — varje runda hittade verkliga fel (felaktiga röstsiffror, överdrifter, försvarsprosa). Åtgärda med spårbar arbetslista i TASK.md.
- [ ] **4.2 Läsbarhet:** mät LIX på byggd HTML (`scripts/lix.mjs`), mål ≤ 45 på egen prosa. "Skriv för en klok granne som aldrig läst ett protokoll."
- [ ] **4.3 Länkkontroll:** verifiera varje extern `kalla_url` (obs: många sajter ger "soft 404" — sida 200 OK men fel innehåll; kontrollera innehållet, inte bara statuskoden).
- [ ] **4.4 Rätta-mig-sida:** en `/ratta/`-sida där läsare kan anmäla fel, + en synlig rättelselogg (`rattelser.json`). Trovärdighet = att öppet visa att man rättar sig.

### Fas 5 — Publicering

- [ ] **5.1 OG-bilder:** datadrivna delningsbilder (mönster: `scripts/og-bilder.mjs` med sharp — siffrorna läses ur JSON-datan så bilderna inte glider isär från innehållet; versionerade filnamn `-v1`, `-v2` eftersom Facebooks scraper cachar hårt).
- [ ] **5.2 Drift:** Docker `node:22-alpine` build → `nginx:alpine` som serverar `dist/` (gzip på, 404-sida, `immutable`-cache endast på hashade `/_astro/`-filer). Eller valfri statisk hosting.
- [ ] **5.3 Deploy-checklista:** sitemap, favicon, OG-verifiering via Sharing Debugger, domän.
- [ ] **5.4 Efter lansering:** sajten uppdateras inte löpande (skriv det på metodsidan) — men rättelser görs alltid.

## 7. Rekommendationer ur erfarenheten

1. **Knäck protokollkällan först.** Allt annat är lätt i jämförelse, och utan röstsiffror blir sajten platt. En dag i portalens JavaScript är den bäst investerade dagen i projektet.
2. **Skriv ner allt du lär dig om API:erna direkt** i en trådhållarfil (`KALLLUCKOR-RAPPORT.md`, `KOLADA_PLAN.md`-mönstret) — så slipper nästa session återupptäcka att v2 är död eller att query-formen svarar tomt.
3. **TASK.md som nav.** En arbetslista med statuslegend, avbockad löpande, med motivering när något stryks. Överlever sessionsbyten och parallella sessioner. Vid parallella sessioner: committa bara egna filer, aldrig `git add -A`.
4. **Luckor är innehåll.** "Partiet har inte publicerat någon lokal politik (kontrollerat DATUM)" är en källbelagd, väljarrelevant upplysning — inte ett misslyckande.
5. **Skilj på kurerat och heltäckande, öppet.** Sajten blir omöjlig att avfärda om metodsidan själv säger var den är tunn, innan någon kritiker gör det.
6. **AI-granska fientligt, flera gånger, med olika modeller.** Byggarens blinda fläckar är verkliga: Höörs granskningar hittade bl.a. en votering som beskrivits som budgetomröstning men var en procedurvotering, och genomgående försvarsprosa som fick strykas.
7. **Räkna inget i datan som du kan räkna vid byggtid.** Incheckad JSON innehåller råvärden; snitt/rankingar räknas i sajtbygget. Då finns alltid en oberäknad siffra att peka på, och licensmärkningen blir rätt av sig själv.
8. **Verktygsfallgropar som kostade tid i Höör:** `pdftotext` kan vara Xpdf (kräver `-table`) i stället för poppler; Kolada v3:s tomma svar på query-form; Ciceron:s `filename_b64`; Dropbox-synk som ger EPERM under `astro build` (retry:a, eller bygg utanför synkad mapp).

## 8. Startprompt till Claude Code

När du satt upp ett tomt repo för kommun Y, ge Claude Code detta dokument plus:

> Bygg en valgranskningssajt för [KOMMUN] enligt REPLIKERING.md. Börja med Fas 0
> (kartläggning) och redovisa resultatet innan du går vidare. Skapa TASK.md med
> tasklistan ur §6 och kryssa av löpande. Icke förhandlingsbart: varje datapunkt
> källbeläggs, inga värderingar, statisk sajt utan AI i drift. Referens­-
> implementation: github.com/Sillen2024/hoor-kommunval.git — kopiera gärna
> skripten i scripts/ och JSON-schemana i src/data/, men verifiera allt mot
> [KOMMUN]s egna källor.
