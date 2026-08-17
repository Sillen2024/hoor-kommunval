# Opus-granskning av hoor-kommunval

**Datum:** 2026-08-15
**Uppdrag:** Djupgående analys och verifikation. Inga ändringar gjorda i kod eller data — allt samlat här.
**Omfattning:** samtliga 15 sidor, 7 datafiler, layout, komponenter, `nginx.conf`, byggd `dist/`, plus extern primärkälleverifiering mot val.se, Länsstyrelsen Skåne, kommunens protokoll och Region Skåne.
**Utgångsläge:** sajten är på det stora hela bra. Datadisciplinen är ovanligt hög för ett projekt av den här typen. Det här dokumentet handlar därför nästan uteslutande om det som är fel eller saknas.

---

## 0. Kort sammanfattning

Tre saker sticker ut:

1. **Ett riktigt sakfel med stor spridning.** Röstsiffrorna för budget 2024 (26–11–3) är inte en budgetomröstning. Det är en procedurvotering om återremiss. Felet är sedan uppförstorat till sajtens bärande tes ("fyra dokumenterade budgetomröstningar", "SD med styret i tre av fyra") och återkommer på minst sex ställen. Det här är det enda jag skulle kalla lanseringsblockerande på faktasidan.

2. **Sajten bryter mot sitt eget löfte om neutralitet — och lovar samtidigt uttryckligen att den inte gör det.** `/om-urvalet/` säger "Ingen text på den här sajten gör antaganden om vad som skulle hända om ett visst parti eller block vinner valet". `/styret-vs-oppositionen/` gör exakt det, flera gånger. `/om/` kallar oppositionen "rörig". Det är inte tonträffen som är problemet i sig — det är att löftet och praktiken inte går ihop, och det är den sortens sak en påläst Höörsbo hittar och använder för att avfärda hela sajten.

3. **Metodsidan beskriver ett projekt som är sämre än det du faktiskt byggt.** Flera "detta saknas fortfarande"-formuleringar på `/om-urvalet/` är sedan Ciceron-genombrottet 2026-08-12 inte längre sanna. Du underskattar dig själv i tryck.

Tekniskt: bygget går rent, kontrasterna är godkända rakt igenom, rubrikhierarkin är korrekt på alla 24 sidor, och delningsmetadatan är stark. De tekniska bristerna är få men konkreta: valkompassen renderas tom utan JS, det finns ingen 404-sida, och gzip är inte påslaget.

---

## 1. BLOCKERANDE — bör åtgärdas före lansering

### B1. Röstsiffrorna för budget 2024 är fel, och felet är sajtens tes

**Verifierat mot primärkälla:** `src/data/mejl kommunen/Beslut-202201111-KSF-§ 77.pdf` (KF 2023-06-14 § 77), s. 2–3.

`src/data/budget.json`, posten för 2024, uppger `{ja: 26, nej: 11, avstar: 3, franvarande: 1}` med noten "Alliansens förslag (26 ja) mot Socialdemokraternas förslag (11 nej), 3 avstod (Medborgerlig Samling)".

Vad protokollet faktiskt säger:

- Voteringen var en **procedurfråga**: "JA = Ärendet avgörs idag. NEJ = Bifall till Olle Krabbes (V) förslag, att återremittera ärendet till förvaltningen."
- Budgeten själv togs därefter **med acklamation**: "ställer ordföranden budgetförslagen mot varandra och finner att kommunfullmäktige beslutar anta Alliansens förslag". **Det fanns ingen votering om budget 2024.**
- De 11 nej var 8 S + 3 V och gällde återremissen — inte S:s budgetförslag.
- De 3 som avstod var **inte** Medborgerlig Samling. Protokollet s. 3 namnger dem: Andrew Briggs (MP), Anna Jung (MED), Johan Karlsson (MED). Alltså 2 MED + 1 MP. (MED har bara 2 mandat — noten var internt omöjlig redan innan.)
- Frånvarande: Roger Orwén (MP), lämnade 20:50.

**Vad SD faktiskt gjorde 2024:** hela gruppen (9 ledamöter, namngivna på s. 3) röstade ja — men till procedurfrågan. Att SD stödde själva budgeten framgår i stället av yrkandena på s. 2: Liljenberg, Lindblom Ohlson och Streijffert (SD) yrkade uttryckligen bifall till Alliansens budget. Tesen håller alltså — men belägget är ett annat, och svagare, än sajten påstår.

**Följdfel som måste rättas samtidigt:**

| Fil | Rad | Påstående |
|---|---|---|
| `src/pages/styret-vs-oppositionen/index.astro` | 106 | "de fyra dokumenterade budgetomröstningarna" |
| " | 120 | "26 ja-röster i samtliga fyra dokumenterade voteringar — 2023, 2024, 2025 och 2027" |
| " | 121–122 | "i tre av fyra voteringar (2023, 2024, 2025) … hela Sverigedemokraternas grupp röstat med styret" |
| " | 126 | "S, V och MP har i stället röstat nej och reserverat sig i samtliga fyra voteringar" — MP **avstod** 2024 |
| " | 144 | "vågmästaren … i tre av de fyra dokumenterade budgetomröstningarna" |
| " | 156 | samma i väljarfrågan |
| `src/pages/ai/kronika/index.astro` | 36 | "i fyra av de fem…" |
| `src/data/styret_vs_oppositionen_manus.md` | 64, 66, 70, 79 | samma formuleringar |
| `src/pages/om-urvalet/index.astro` | 104 | "Röstsiffror … finns dokumenterade för samtliga fem budgetbeslut 2023–2027" |

Korrekt bild: **tre riktiga budgetvoteringar** (2023, 2025, 2027), **en procedurvotering** (2024) och **ett acklamationsbeslut** (2026). Det är fortfarande en stark historia — och ärligare.

**Fotnot om 2025:** agenten kunde inte extrahera `Protokoll_KF_240619.pdf` (887 kB, 35 s.) i sin session. Posten för 2025 uppger 26–13–0 men nämner till skillnad från 2027-posten ingen namngiven röstlängd. Kontrollera den manuellt innan du skriver om texten — det vore olyckligt att rätta ett fel och samtidigt cementera ett annat.

**Fotnot om 2023:** verifierad och helt korrekt. `Kommunfullmäktige 2022-11-30 (2022-11-30 KF §145).pdf` s. 3–4: äkta huvudvotering 26–13–2, där 26 ja = 17 styret + 9 SD (namngivna), 13 nej = 8 S + 3 V + 2 MP, 2 avstod = MED.

---

### B2. "De har majoritet och styr kommunen" — sajten motsäger sig själv på samma sida

`src/pages/styret-vs-oppositionen/index.astro:22` och `src/data/styret_vs_oppositionen_manus.md:15`:

> Höör styrs idag av den s.k. Alliansen (Moderaterna, Liberalerna, Centerpartiet och Kristdemokraterna). **De har majoritet och styr kommunen.**

Rad 119 på samma sida säger det motsatta, och det korrekta: "Styret har bara 17 av 41 mandat i fullmäktige."

Det här är inte en petitess. Att styret är en **minoritetskoalition** är hela premissen för sajtens mest värdefulla insikt — att SD i praktiken är vågmästare. Meningen på rad 22 rycker undan mattan för allt som kommer efter den, och det är en av de första meningarna en läsare möter på sidan. Byt till "De styr i minoritet med 17 av 41 mandat."

---

### B3. Neutralitetslöftet håller inte

Instruktionens krav #1 är "Fakta, inga värderingar", uttryckligen inklusive förbud mot "om oppositionen vinner kommer…"-text. `src/pages/om-urvalet/index.astro:148–150` upprepar löftet i skärpt form:

> Ingen text på den här sajten gör antaganden om vad som skulle hända om ett visst parti eller block vinner valet.

Motexempel:

- **`src/pages/om/index.astro:27`** — "ett val mellan ett sittande blått styre eller **en rörig opposition**". Det är en värdering av ena sidan, i klartext, på sidan som ska etablera din trovärdighet. Även om du menar det deskriptivt (oppositionen är inte enig — vilket sajten belägger) så läser en S-, V- eller MP-väljare det som partiskhet. Formulera om till det du faktiskt kan belägga: "en opposition som inte är enig om vad den vill i stället".
- **`src/pages/styret-vs-oppositionen/index.astro:14–16, 45, 66**` — "Väljer du styret blir inriktningen förmodligen en fortsättning på inslagen väg" och liknande. Det *är* ett antagande om vad som händer om ett block vinner. Antingen stryks det, eller så justeras löftet på `/om-urvalet/` till att beskriva vad sajten faktiskt gör.

**Min rekommendation:** justera löftet snarare än att sterilisera texten. "Vibben"-rutorna är faktiskt sajtens bästa pedagogik och det som gör den läsbar för någon som inte redan är kommunpolitiskt intresserad. Skriv i stället: *"Sajten spekulerar inte i valresultat. Där vi sammanfattar eller tolkar är det tydligt märkt — se 'Vibben'- och 'Slutsats'-rutorna."* Det är ett löfte du kan hålla. Det nuvarande är det inte.

Två skrivfel i samma familj, båda på ställen där du talar om din egen trovärdighet:

- `src/layouts/Layout.astro:106` — "Den drivs inte av något parti och **görs inga värderingar** av vad partierna säger". Sitter i sidfoten på **varje** sida.
- `src/pages/valkompass/index.astro:45` — "**Sajten görs inga värderingar** av vad partierna säger".

Trasig svenska i just trovärdighetsmeningen är dyrare än trasig svenska någon annanstans.

---

### B4. Valkompassen renderas tom utan JavaScript

**Verifierat i byggd `dist/index.html`:** `<p id="vk-question-text"></p>` är tom i HTML-källan. Utan JS ser besökaren tre knappar — "Håller med" / "Vet ej" / "Håller inte med" — **utan någon fråga**. Sajtens hero-CTA ser trasig ut, inte tom. Det finns ingen `<noscript>`.

`src/components/Valkompass.astro:15–25`. Fix: rendera fråga 1 statiskt i markup så att JS bara *byter ut* innehåll, eller lägg en `<noscript>` som pekar till `/jamforelse/`.

Samma klass av problem, mindre allvarligt: `src/pages/din-vardag/index.astro:124` sätter `style="display:none"` inline på alla situationer utom den första, och knapparna gör inget utan JS — **3 av 4 vyer blir helt oåtkomliga**. (`/jamforelse/` degraderar däremot korrekt: allt syns, filtret gör bara inget. Gör likadant här.)

---

### B5. "Den enda dokumenterade omröstningen" — kvarlämnad text som motsäger sajtens egen berättelse

- `src/components/Valkompass.astro:32–34` — "I **den enda dokumenterade omröstningen** under mandatperioden (budget 2027, 2026-06-10) röstade SD med styret". Visas i resultatrutan för varje person som gör valkompassen på startsidan.
- `src/pages/styret-vs-oppositionen/index.astro:10` — samma formulering i sidans meta-description, alltså det som syns i Google och vid delning på Facebook.

Båda är från en tidigare version av materialet. En läsare som gör kompassen och sedan klickar vidare möter direkt "de fyra dokumenterade budgetomröstningarna". Det ser ut som att sajten inte vet vad den själv har kommit fram till.

---

## 2. BÖR FIXAS

### D1. `/om-urvalet/` beskriver ett sämre projekt än det du har

Ciceron-genombrottet 2026-08-12 gjorde flera "detta saknas"-formuleringar inaktuella:

| Rad | Påstår | Faktiskt läge |
|---|---|---|
| 126–127 | "Två uppgifter saknas fortfarande: paragrafnumret för budget 2026 och **skattesatsen för budget 2027**" | `budget.json` har `"kommunal_skattesats": "20,95 kr"` för 2027 |
| 99 | "ingen antagen budgethandling för 2027 publicerats av kommunen" | `KS_forslag_budget2027.pdf` hämtad 2026-08-13, ligger i `src/data/protokoll_ksf/budget2027/` |
| 142–143 | samma påstående en gång till | " |
| 97–101 | "En av dem [sju transkriptioner] har använts … De övriga sex ligger ännu oanvända" | minst två är använda |

Samma sak i `src/data/historiska_val.json`: `metod_not` och 2018 års `kalla_url_2_beskrivning` påstår att Länsstyrelsens PDF respektive historik.val.se "inte gått att läsa av maskinellt". **Båda gick utmärkt att läsa maskinellt.** Och `mandat_not` påstår att 2018 års mandatfördelning inte kunnat verifieras — den ligger publikt på val.se. Här är den:

| Parti | Mandat 2018 | (mot 2014) |
|---|---|---|
| SD | 9 | +1 |
| M | 8 | −2 |
| S | 6 | −4 |
| L | 5 | +2 |
| C | 4 | +1 |
| V | 3 | +1 |
| MP | 3 | −1 |
| KD | 2 | +1 |
| MED | 1 | +1 |
| **Summa** | **41** | |

Källa: `historik.val.se/val/val2018/slutresultat/K/kommun/12/67/valda.html`, bekräftad mot Wikipedias mandattabell för Höörs kommun.

Övrigt att fylla i för 2018: röstberättigade **12 763**, och restposten på 173 röster är "Övriga anmälda partier" (1,60 %) — filens "sannolikt ytterligare mindre partier" kan skärpas till ett konstaterande.

Det här spelar roll av två skäl. Dels är metodsidan din trovärdighetsgrund och bör vara den mest exakta sidan på sajten. Dels: när du skriver "kunde inte verifieras" om något som ligger fritt tillgängligt på val.se, ger du en kritisk läsare anledning att misstro *alla* dina begränsningsreservationer.

### D2. Valkompassen har tre metodproblem

**a) Grupperna är obalanserade.** `valkompass.json` har nu 11 frågor: styre 4, rödgröna 4, sd_med **3**. Men `Valkompass.astro:80–81` väljer vinnare på **absolut poäng**, medan staplarna på rad 96 visar **procent**. SD/MED kan alltså maximalt nå 3 där de andra når 4. En användare som håller med om alla tre sd_med-frågor och tre av fyra styre-frågor får "Du lutar lika mycket åt…" — trots 100 % mot 75 %. Antingen jämna ut till 4/4/4, eller ranka på procent (som staplarna redan gör).

**b) "Håller inte med" ger noll — precis som "Vet ej".** `Valkompass.astro:123`: bara `if (answer === "for")` ger poäng. Att aktivt ta avstånd från ett påstående behandlas identiskt med att hoppa över det. Kompassen mäter alltså bara instämmandegrad, inte riktning. Konsekvensen: den som konsekvent håller med om **inget** får "Du höll inte med om något av påståendena — testa gärna att svara om." Det är att skicka hem en väljare utan svar. Överväg −1 för "håller inte med", eller åtminstone att räkna avståndstagande som stöd för motsatt grupp där frågorna är polära.

**c) Två frågor ligger utanför kommunal kompetens.** `trygghet-migration` (hårdare straff för brott) och `bilism` (billigare att köra bil) avgörs inte i Höörs kommunfullmäktige. Att låta dem styra vilket **kommunalt** parti man rekommenderas är metodmässigt svagt — och det är just den sortens fråga som gör att en kompass pekar mot SD oavsett vad man tycker om kommunala frågor. Antingen ersätt med kommunala motsvarigheter (trygghetskameror, vinterväghållning på landsbygden, kollektivtrafiktäthet), eller märk dem tydligt som "nationell fråga, redovisas för partiets profil".

### D3. Moderaterna: styrets största parti har noll innehåll

Efter din revidering är `manifest_status: "saknas"` och `manifest_2026: []` för M — vilket är **rätt hanterat** och en förbättring. Men konsekvensen behöver mötas rakt:

- Höörs största parti (11 av 41 mandat) syns **inte alls** i `/jamforelse/`.
- `/styret-vs-oppositionen/index.astro:155` refererar fortfarande till "kameror (styret)" som väljarfråga, men trygghetskameror har efter revideringen ingen källa kvar någonstans i `partier.json`. Föräldralöst påstående.
- Representationsobalansen totalt: L (2 mandat) har 7 punkter med 7 unika källor; M (11 mandat) har 0; SD (9 mandat) har 4 punkter från 1 enda källa. En läsare som skummar `/jamforelse/` får intrycket att L är kommunens mest ambitiösa parti och att M knappt existerar — vilket är en artefakt av vilka partier som råkar ha en fungerande hemsida.

Det här är egentligen sajtens mest intressanta iakttagelse och den bör lyftas i stället för att döljas: **kommunens största parti har inget publicerat kommunalt program inför valet.** Det är en nyhet, inte en datalucka. Men den måste presenteras som verifierat frånvaro (du har kontrollerat hoor.moderatweb.se och alla undersidor 2026-08-14) och inte som något du kanske missat. En banner högst upp i `/jamforelse/` som förklarar varför M, och delvis KD och MED, är underrepresenterade skulle göra jämförelsen ärligare.

### D4. Ärendedelen: tunn, odaterad och delvis motiverad med föråldrade skäl

- **9 ärenden.** Instruktionen kräver 10–15.
- **Inget ärende har `rostning`-fält.** Instruktionen kräver att partisidorna visar "partiets röstning i track record-ärenden". Utan röstdata i `arenden.json` kan `/partier/[id]/` inte visa något track record alls — och gör det inte heller.
- **`arenden.json` motiverar upprepade gånger saknade paragrafnummer och röstsiffror med att "mötesportalen inte går att läsa av automatiskt".** Den motiveringen är sedan 2026-08-12 inte längre sann. Antingen hämta uppgifterna, eller byt motivering till den ärliga ("hann inte inom projektets tidsram").
- **Ringsjöskolan har `datum: "2025-01-01"`.** Det är ett påhittat datum, inte ett beslutsdatum. Nyårsdagen är dessutom en helgdag — ingen kommun fattar beslut då. En läsare som kollar upp det tappar förtroende. Antingen hämta rätt datum via Ciceron eller sätt `null` och förklara.
- **"Höör saknar medborgarförslag" har `datum: "2026-06-30"`**, vilket är tidningsartikelns publiceringsdatum, inte ett kommunalt beslutsdatum. Samma problem: en tidslinje blandar två sorters datum utan att säga det.
- **`exkluderade_kandidater_not` utesluter en V-motion** med hänvisning till möten 2023-10-11 och 2023-12-06 — båda ligger numera inom Ciceron-portalens täckning (från 2023-05-24). Uteslutningsskälet har upphört att gälla.
- **Interna filsökvägar renderas publikt.** `rostning_not` i `budget.json` innehåller strängar som `src/data/protokoll_ksf/reservationer/reservation_S_240619_par75.pdf`. De visas för besökaren. Antingen publicera PDF:erna under `public/kallor/` och länka dem på riktigt (starkt — det är exakt den sortens belägg som ger sajten tyngd), eller ta bort sökvägarna ur den publika texten.

### D5. Medborgarförslags-ärendet är svagare än källäget tillåter

`arenden.json` parafraserar neutralt: "kommunen bedömer att andra kanaler för medborgardialog är att föredra".

Jag har verifierat en betydligt starkare källa: Skånska Dagbladet, ledare av **Martina Jarminder, publicerad 2026-07-02** (uppdaterad 2026-07-06), "Höör kan inte fika sig till en fungerande demokrati", som citerar kommunstyrelsens ordförande **Johan Svahnberg** direkt:

> "Om man kan göra sin röst hörd på andra sätt, så kommer ingen att vilja bli politiker."

Det är ett ordagrant, attribuerat citat från den högst ansvariga politikern om varför kommunen inte har medborgarförslag. Det är fakta, inte värdering, och det är oändligt mycket mer informativt för en väljare än parafrasen. Två saker att notera: källan är en **ledare** (opinionsmaterial) och bör märkas så — men citatet i sig är refererat sakinnehåll. Och detta svarar direkt mot din stående feedback om att materialet är "väldigt platt": det här är precis den politiska texturen som saknas.

### D6. `/ai/media/` är tre tomma lådor som marknadsförs som innehåll

Alla tre kategorierna i `media.json` är `platshallare: true` med tomma URL:er. Sidan renderar tre "saknas ännu"-boxar — men länkas från `/ai/` och listas i `llms.txt` som om den hade innehåll. Antingen fyll den eller ta bort den ur navigation och `llms.txt` före lansering. En besökare som klickar sig till tre tomma rutor drar slutsatsen att resten av sajten också är halvfärdig.

### D7. Kolada saknas helt

`grep -rin "kolada" src/` ger **noll träffar**. Instruktionen listar Kolada som datakälla. Det är den enda källan som skulle låta dig sätta Höörs siffror i sammanhang — "Höör lägger X kr/elev, snittet i Skåne är Y" är dramatiskt mycket mer användbart för en väljare än ett absolut belopp. Just nu presenterar budgetsidan miljontal utan referenspunkt, och de flesta av 17 000 Höörsbor har ingen intuition för om 1 330 mnkr är mycket eller lite.

Om det inte hinns med före 2026-08-26: skriv in det som en uttalad begränsning på `/om-urvalet/` i stället för att tiga om det.

### D8. Teknik och drift

Från byggverifiering och `nginx.conf`-granskning:

- **Ingen 404-sida.** `src/pages/404.astro` saknas och `nginx.conf:9` slutar med `=404` → nginx standardvita felsida utan meny. En felstavad eller delad gammal länk blir en återvändsgränd. Lägg till `src/pages/404.astro` + `error_page 404 /404.html;`.
- **Gzip är inte påslaget.** `nginx.conf` saknar `gzip`-direktiv helt. Uppmätt potential: `jamforelse/index.html` 29,2 KB → 6,6 KB, CSS 13,9 KB → 3,2 KB. Ungefär 4× mindre över mobilnät. (Att basimagen levererar `#gzip on;` bortkommenterat är inte verifierat genom att köra containern — kontrollera.)
- **`immutable, max-age=2592000` på icke-hashade bilder.** `nginx.conf:12–15` gäller alla `png|jpg|svg|ico`. `/header-logo.png`, `/og-image.png` och partilogotyperna är **inte** innehållshashade (bara CSS ligger hashad i `_astro/`). Byter du OG-bild efter lansering ser återvändande besökare den gamla i en månad, utan möjlighet att bryta cachen.
- **Ingen cache-policy för HTML.** Under en valrörelse där du rättar innehåll dagligen kan heuristisk webbläsarcache visa gammal fakta. Sätt `no-cache` (revalidering) på `.html`.
- **5,6 MB oanvända bilder i `public/`.** Noll referenser i `src/` till `Gemini_Generated_Image_dt40lidt40lidt40.png` (4,3 MB), `LOGGO.png` (765 KB) och `hoor_kommunval_logo.jpg` (468 KB). `dist/` är 19 MB varav HTML+CSS bara ~0,4 MB.
- **Layouten spricker under ~350 px viewport.** Enda `@media` i `global.css:476` är `prefers-reduced-motion`. `.compare-grid` har `minmax(18rem, 1fr)` = 306 px mot ~317 px tillgänglig bredd på 360 px-skärm. Sänk till 15 rem. Tiopunktsmenyn radbryter dessutom till 3–4 rader på mobil.

### D9. Tillgänglighet

Grunden är bra — **alla kontraster klarar WCAG AA med marginal** (muted #5a5a5a på vitt = 6,90:1, `.not-box` 7,28:1, `.source-link` 6,78:1, `.badge--opposition` 5,30:1), rotstorlek 17 px är generös för äldre läsare, en `h1` per sida och inga hoppade rubriknivåer i någon av de 19 `.astro`-filerna. Det som fattas:

- **Ingen skip-link.** `Layout.astro:86–96` har 10 navlänkar som upprepas på varje sida; tangentbords- och skärmläsaranvändare måste tabba igenom alla varje gång.
- **Inga `:focus-visible`-stilar** definierade någonstans i `src/`. (Bra nyhet: inget `outline: none` heller, så webbläsarens standardring finns kvar. Men på `.card`, `.hook-card` och `.party-list a` — som saknar understrykning — blir den svag.)
- **Råa URL:er som länktext** på `jamforelse:132,151`, `din-vardag:138,155`, `partier/[id]:76,97`. CSS klipper dem med ellips (`global.css:271`) så seende inte kan läsa dem, och skärmläsare läser upp hela URL:en tecken för tecken. Använd domännamn eller källbeskrivning.
- **Valkompassen saknar `aria-live`.** Ny fråga byts tyst ut; resultatpanelen (`Valkompass.astro:75–77`) visas utan fokushantering.
- **`.table-scroll` (`global.css:239`) saknar `tabindex="0"`** — scrollbara tabeller går inte att bläddra med tangentbord (WCAG 2.1.1). Gäller nämndtabellen (`min-width: 40rem`).

---

## 3. SMÅTT

- `styret-vs-oppositionen/index.astro:151` — rubriken lovar "**tre** snabba frågor", `<ol>`:n innehåller **fyra**.
- `styret-vs-oppositionen/index.astro:160` länkar till `/#valkompass` medan det också finns en fristående `/valkompass/`-sida. Välj en.
- `/om/` och `/valkompass/` finns inte i huvudnavigationen trots att båda är fullvärdiga sidor.
- `ai/kronika/index.astro:36` — "fyra av de fem" (se B1).
- `budget/index.astro:133–134` — `<h3>Budget {ar}</h3>` ligger *inuti* `.table-scroll`-diven i stället för före den.
- `historiska-val/index.astro:40` — fyrkolumnstabell utan `.table-scroll`.
- Emoji i rubrik utan `aria-hidden`: `din-vardag:125` och `ai/partiet:112` (jämför `din-vardag:116` som gör rätt) — skärmläsare läser "kvinna med vitt hår".
- `ai/media/index.astro` — kortrubriker på rad 37/51/66/73/88/95 är `h3` under sektionsrubriker som också är `h3`; borde vara `h4`.
- `index.astro:78–85` — `<a class="hook-card">` omsluter en `<h3>`; giltigt, men hela kortets text blir länknamn.
- OG-metadatan är stark (korrekt absolut `canonical`, `og:url`, `og:image` 1200×630 som matchar deklarerade mått, `twitter:card=summary_large_image`, unika beskrivningar per sida). Saknas bara `og:locale=sv_SE`, `og:site_name` och `og:image:alt`.
- `partier/[id]/index.astro` matchar `relatedArenden` genom textjämförelse av `forslagsstallare` mot partinamnet — vilket i praktiken bara någonsin träffar Socialdemokraterna. Alla andra partisidor saknar tyst sitt ärendeavsnitt.

---

## 4. Vad vi kan ha missat

Sådant som inte är fel i det som finns, utan luckor i vad sajten gör:

**Väljaren saknar en "vad kostar det mig"-brygga.** Sajten redovisar skattesatsen 21,75 → 20,95 (−80 öre) korrekt och källbelagt. Men ingenstans står vad 80 öre är i kronor för en vanlig Höörsbo. För en medianinkomst är det storleksordningen några hundralappar i månaden. Det är den enda siffran på hela sajten som direkt rör läsarens plånbok, och den är osagd. Motsvarande på utgiftssidan: vad motsvarar 80 öre i kommunala intäkter, och vad hade de pengarna räckt till? Det är fakta, inte värdering, och det är exakt vad en väljare vill veta.

**Ingen bild av vem som faktiskt sitter i fullmäktige.** Kandidatlistorna finns i `partier.json` (Valmyndighetens öppna data) men det finns ingen sida som svarar på "vem representerar mig?". Åldersfördelning, könsfördelning, hur många som är omval — allt finns i den datan.

**Nämndnivån är osynlig.** All röstdata rör kommunfullmäktige. Men det mesta som påverkar en Höörsbos vardag avgörs i barn- och utbildningsnämnden och socialnämnden. Ärendet om minskat antal sammanträden (2024-09-25) antyder att du redan har spårat frågan — men själva nämndbesluten saknas.

**Ingenting om valet självt.** Var röstar man, när öppnar vallokalerna, hur förtidsröstar man, vad är personröst och varför spelar det roll i en kommun där ett parti kan ta ett mandat på ett par hundra röster. Det är den mest praktiskt användbara informationen för 17 000 invånare och den är gratis att lägga till.

**Ingen fungerande felrapportering.** En faktasajt som gör anspråk på källbelagd korrekthet behöver en synlig kanal för "det här är fel". Det både förbättrar datan och är i sig ett trovärdighetsargument.

**Frivillig men värdefull komplettering:** Johan Svahnberg (M) har verifierats som kommunstyrelsens ordförande från 2019-01-01 och sitter kvar. Belägget för hela perioden 2019–2022 är dock bara Wikipedia plus kommunens nuvarande sida — inte primärkälla. Om det påståendet används någonstans bör det reservationsmärkas.

---

## 5. Hur vi pratar om analysen

Du bad specifikt om det här, så jag skiljer ut det.

**Det som fungerar och som du inte ska röra:** "Vibben"-rutorna. De är sajtens främsta pedagogiska grepp. De översätter partiprogramsprosa till något en person som aldrig läst ett kommunalt budgetdokument kan ta till sig, och de är märkta som sammanfattning. Behåll dem. Att du dessutom skriver ut när något är osäkert, och varför, är ovanligt och bör vara mer synligt, inte mindre.

**Det som skaver:** sajten har två olika röster och de vet inte om varandra.

Den ena är metodisk, reserverad, nästan ängslig — `/om-urvalet/` underskattar systematiskt vad projektet åstadkommit och skriver "kunde inte verifieras" om saker som ligger fritt på val.se. Den andra är tvärsäker — "de fyra dokumenterade budgetomröstningarna", "mönstret är förvånansvärt konsekvent", en "Slutsats"-ruta i fetstil — och det är just där det enda riktiga sakfelet sitter (B1). Ängsligheten sitter alltså på fel ställe. Du reserverar dig där du har täckning och är kategorisk där du inte har det.

Åtgärden är inte mer reservationer överallt. Det är att flytta säkerheten dit belägget finns: var kategorisk om 2023 och 2027 (namngivna röstlängder, primärkälla, oantastligt) och var uttrycklig om att 2024 var en procedurfråga och 2026 en acklamation. Historien blir inte svagare av det. Den blir svårare att skjuta ner.

**Om AI-delen:** att `/ai/kronika/` är märkt som tankeexperiment löser den formella frågan. Men proportionerna gör det inte. Sajten har fyra AI-sidor (`/ai/`, `/ai/kronika/`, `/ai/media/`, `/ai/partiet/`) varav en är tom, mot nio ärenden i faktadelen. En förstagångsbesökare som skummar navigationen ser en sajt där AI-experimentet väger ungefär lika tungt som kommunpolitiken. Formuleringar som "röstboskap", "dörrmatta" och "centralortens diktatur" är dessutom, disclaimer eller ej, det enda på sajten som går att klippa ut och sprida ur sitt sammanhang — och det är det som kommer att spridas. Överväg att flytta AI-delen till en tydligt underordnad plats. Den är intressant, men den är inte varför någon i Höör ska besöka sajten i september.

**Om tilltalet till målgruppen:** sajten förutsätter genomgående en läsare som redan vet vad kontraproposition, huvudvotering, reservation, nämndram och skatteväxling betyder. De orden går att behålla — men de bör förklaras vid första förekomst. En ordlista skulle kosta lite och öppna materialet för betydligt fler än de kanske några hundra Höörsbor som redan följer kommunpolitiken. De människorna behöver inte den här sajten. De andra 16 000 gör det.

---

## 6. Verifierat korrekt — det du inte behöver oroa dig för

Ovanligt mycket höll vid extern primärkällekontroll. Värt att notera eftersom det är en stor del av granskningens resultat.

**Historiska val — inga sakfel alls.** Min ingående hypotes var att 2018 års siffror kunde vara från fel val (Liberalerna 12,5 % såg orimligt högt ut). **Hypotesen var fel.** Samtliga tio partiers röstetal och andelar för 2018 stämmer exakt mot `historik.val.se`, och samtliga nio poster för 2022 stämmer exakt mot Länsstyrelsen Skånes protokoll (dnr 201-20278-2022). L:s 12,51 % är ett äkta kommunvalsresultat i Höör — upp från 7,23 % 2014, ner till 4,14 % 2022. Raset på 8,37 procentenheter är verkligt och är en av de största enskilda partirörelserna i kommunen. Det är i sig en historia värd att lyfta. Valdeltagande (86,00 % / 83,93 %), giltiga och ogiltiga röster, allt stämmer.

**Mandatfördelningen 2022** stämmer i både `historiska_val.json` och `partier.json`: M 11, SD 9, S 8, V 3, C 2, L 2, KD 2, MP 2, MED 2 = 41. Styret 2023–2026 (M+L+C+KD = 17/41) likaså. Styret 2018–2022 var också minoritet, 19 av 41 — internt konsistent med de nu verifierade 2018-mandaten (8+5+4+2).

**Skattesänkningen är en äkta skattesänkning — ingen skatteväxling.** Jag misstänkte att de 80 örena delvis kunde vara en huvudmannaskapsväxling med Region Skåne. Det stämmer inte. Region Skånes skattesats har legat oförändrad på 11,18 hela perioden 2022–2027, och totalskatten går 32,93 → 32,63 → 32,13. Ordet "skatteväxling" förekommer noll gånger i hela repot och inte heller i undertexterna från beslutsmötet. `KS_beslut_260526_par114.pdf` s. 1–2 motiverar utrymmet med SKR:s budgetförutsättningar plus att skatteintäkterna räknats upp 300 kr/invånare. Avgörande belägg: skattesatsen är en egen omröstad beslutssats där S yrkade 21,45 och V yrkade 21,20 — en teknisk växling förhandlas inte i öretal. (Reservation: Region Skånes 2027-sats beslutas formellt i november 2026, så 32,13 är prognos, inte fastställt.)

**Röstaritmetiken går ihop.** Alla år med röstsiffror summerar till exakt 41. Nettokostnad-mot-nämndramar-gapet (61,8 / 69,5 / 38,9 / 8,9 mnkr) är korrekt förklarat på `/om-urvalet/:136–139` — det är två olika mått och de ska inte summera lika.

**Alla 12 oppositionsbudgetar finns** på plats i `public/kallor/`.

**Bygget går rent.** 24 sidor på 935 ms, inga varningar. Sitemap och robots.txt genereras korrekt.

**Alla 9 partilogotyper finns** i `public/logos/`. (Jag trodde först fyra saknades — det var trunkerad `ls`-utdata.)

**`/#valkompass`-ankaret fungerar.** `id="valkompass"` ligger på komponenten (`Valkompass.astro:15`), som renderas på startsidan.

---

## 7. Föreslagen ordning

**Före lansering 2026-08-26:**
1. B1 — rätta budget 2024 och de sex följdställena. Kontrollera 2025 manuellt samtidigt.
2. B2 — "majoritet" → "minoritet, 17 av 41".
3. B3 — jämka neutralitetslöftet mot praktiken, fixa "görs inga värderingar" på båda ställena.
4. B5 — stryk "den enda dokumenterade omröstningen" på båda ställena.
5. B4 — statisk fråga 1 eller `<noscript>` i valkompassen.
6. D1 — uppdatera `/om-urvalet/` och `historiska_val.json` så de beskriver det du faktiskt har.
7. D6 — fyll eller ta bort `/ai/media/`.
8. D8 — 404-sida och gzip.

**Om tid finns:** D2 (valkompassens metod), D3 (M-bannern i jämförelsevyn), D5 (Svahnberg-citatet), D4 (Ringsjöskolans datum), ordlistan.

**Efter lansering:** D4 i sin helhet (röstdata på ärenden, upp till 12–15 ärenden), D7 (Kolada), nämndnivån, praktisk valinformation, felrapportering.
