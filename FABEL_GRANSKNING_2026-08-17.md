# Fabels genomgång — granskning av innehåll och presentation

**Datum:** 2026-08-17
**Granskare:** Claude Fable 5
**Underlag:** Samtliga 19 sidor i `src/pages/`, alla datafiler i `src/data/`, byggd HTML i `dist/` (byggd 2026-08-17), `TASK.md`, `OPUS_GRANSKNING_2026-08-15.md`. Läsbarheten är uppmätt med LIX på den byggda HTML:en, inte bedömd på känsla.
**Fråga från Jonas:** Sidan ska tydligt och enkelt granska lokalpolitiken i Höör — men redovisningen har blivit för invecklad, "som att en AI gjorde det här". Läsarna är politiker, väljare, låg- och högutbildade. Alla vill bara förstå sin kommun.

---

## Sammanfattning

**Materialet är inte problemet. Presentationen är byggd för att försvara sig, inte för att förstås.**

Sajten sitter på tre berättelser som ingen annan i Höör kan berätta: förskolan som kostar minst i hela Skåne, styret som vinner varje budgetomröstning tack vare SD:s röster, och en skattesänkning vars pris i välfärd aldrig räknats ut offentligt. Men sidorna öppnar med metod i stället för fynd, avbryter läsaren med förbehåll innan hon hunnit läsa påståendet, och redovisar allt på samma visuella nivå — så att det viktigaste ser lika viktigt ut som det minst viktiga.

Uppmätt, inte tyckt:

| Sida | LIX | Ord | Ord/mening |
|---|---|---|---|
| Startsida | 42 | 433 | 14 |
| Styret vs oppositionen | 48 | 1 611 | 18 |
| Ordlista | 49 | 1 152 | 19 |
| Nyckeltal | 50 | 2 251 | 20 |
| Ärenden | 54 | 4 244 | 15 |
| Budget | 56 | 2 661 | 19 |
| Din vardag | 57 | 2 331 | 18 |
| Jämförelse | 58 | 2 627 | 20 |
| Om urvalet | 58 | 3 082 | 21 |

LIX-skalan: 30–40 är lättläst, 40–50 är normal tidningstext, 50–60 är facktext och myndighetsspråk. **Sajtens kärnsidor ligger på 48–58 — samma nivå som de protokoll sajten finns till för att översätta.** Målet för en sajt "för oss alla" är 40–45 på varje sida där sajten själv skriver prosan.

Receptet i en mening: **vänd varje sida — svaret först, förbehållet sen; berättelse före tabell; en brasklapp per sida i löptexten och resten i en fotnot.**

Ingenting i den här granskningen kräver att källdisciplinen luckras upp. Tvärtom: källorna, voteringskomponenten, ordlistan och rättelsekanalen är sajtens bästa delar och ska inte röras (§10).

---

## 1. Diagnos: därför känns det som att en AI gjorde sidan

Känslan "en AI gjorde det här" kommer inte av språkfel eller av fabricerade fakta — det finns inga. Den kommer av fem mönster som alla har samma rot: **texten är skriven för att klara en granskning, inte för att bli läst.** En mänsklig redaktör med samma material hade skurit hårt i självförsvaret och litat på att källorna talar för sig själva.

### 1.1 Metoden står framför innehållet

Exempel, samtliga ur byggd HTML:

- `/arenden/` öppnar med: *"En kurerad, inte heltäckande, lista över ärenden och motioner som antingen förekommit i lokal press och/eller kopplar till politikområden…"* Läsaren har inte sett ett enda ärende än, men har redan fått urvalskriterierna två gånger (lead + länk till Om urvalet).
- Ordet **"kurerad"** förekommer på samtliga 27 sidor (sidfoten). Det är ett ord ur sajtbyggarens värld, inte läsarens. En Höörsbo säger "ett urval".
- Historien om **Ciceron-API:et** — hur datan hämtades — står i läsartext på **7 sidor** (`/arenden/`, `/budget/`, `/styret-vs-oppositionen/`, `/om-urvalet/` samt partisidorna för S, V och MP). Läsaren bryr sig inte om hur ni fick tag i protokollen. Det är byggarens stolthet, inte läsarens behov — och det är exakt den textur som skvallrar om att en AI skrivit. **En förekomst ska finnas kvar: på Om urvalet.** Överallt annars räcker "hämtat direkt ur kommunens mötesportal ([metod](/om-urvalet/))".
- Startsidans trust-note ägnar halva utrymmet åt sajtens tillkomsthistoria ("Idén till sajten uppkom 11 augusti 2026, bara 15 dagar innan…"). Sajten ber om ursäkt innan den levererat. Tillkomsthistorien hör hemma på Om urvalet — på startsidan räcker en rad: *"Allt är källbelagt. Inte allt är med — [här står varför](/om-urvalet/)."*

### 1.2 Brasklappstätheten — uppmätt

Antal förbehållsblock per sida i byggd HTML:

| Sida | not-box | derived-note | banner | Länkar till /om-urvalet/ |
|---|---|---|---|---|
| Budget | 11 | 1 | 2 | **10** |
| Ärenden | 23 | 0 | 1 | 5 |
| Nyckeltal | 3 | **12** | 0 | 6 |

- `/budget/` länkar till Om urvalet **tio gånger på en sida**. Varje länk är en liten signal till läsaren: "lita inte riktigt på det du just läste förrän du läst någon annanstans".
- `/nyckeltal/` upprepar samma licenspoäng — "snittraden är räknad på Koladas råvärden, inte hämtad ur Kolada" — **tolv gånger**. Koladas villkor kräver att bearbetningar inte tillskrivs dem; villkoren kräver inte att det sägs vid varje tabell. **En** rad längst ned på sidan uppfyller samma krav: *"Alla snitt och placeringar på den här sidan är uträknade här ur Koladas råvärden; enskilda kommunsiffror är hämtade som de är och länkar till API-anropet."* Behåll gärna det streckade märket visuellt — men texten behöver inte upprepas.
- `/arenden/` har 23 not-boxar. Många är `<details>` (bra mönster — förbehållet finns men skymmer inte), men "Not om datum" + "Varför är det här ärendet med?" på varje ärende gör att varje kort får två metaklossar och ett källblock kring en enda beskrivande paragraf. Förhållandet innehåll:apparat är ungefär 1:2.

**Regeln:** en brasklapp per sida får stå i löpande text — den viktigaste. Resten flyttas till `<details>`, till en samlad fotnot, eller till Om urvalet. Förbehållen försvinner inte; de slutar bara avbryta.

### 1.3 Allt är lika viktigt — alltså är inget viktigt

Sajtens tysta princip verkar vara att platthet = neutralitet: om allt redovisas på samma nivå har ingen vinklats. Men **urvalet är redan gjort** (15 ärenden av hundratals, 25 nyckeltal av tusentals) — att därefter vägra rangordna är inte neutralitet, det är abdikation. Att sätta det mest anmärkningsvärda först är journalistik, inte åsikt, så länge rangordningsgrunden är öppen ("störst pengar", "störst avvikelse", "flest berörda").

Konsekvensen i dag: förskolefyndet — sajtens starkaste, dubbelt verifierade resultat — ligger som avsnitt tre av sex på en undersida med LIX 50, bakom ett metodavsnitt om jämförelsegrupper. "Riktlinjer för bostadsförsörjning 2025–2028" (en paragraf, noll votering) ser på ärendesidan exakt lika viktig ut som busskorts-motionen som föll på ordförandens utslagsröst 19–19.

### 1.4 Språket ligger på myndighetsnivå

LIX-tabellen ovan är symptomet. Orsaken är tre vanor:

**a) Förbehållet kommer före påståendet.** Mönstret "X — fast observera att Y, och Z ska inte förväxlas med W — är alltså V" tvingar läsaren att hålla tre saker i huvudet innan hon fått veta en. Vänd: påstående, punkt. Förbehåll, punkt.

**b) Facktermer bär rubrikerna.** "Nettokostnadsavvikelse totalt (exkl. LSS), 2024" är en rubrik för RKA:s handläggare. Läsarens fråga är: *"Lägger Höör mer eller mindre än liknande kommuner?"* — det är rubriken. Termen får stå i brödtexten med ordlistelänk, precis som nu.

**c) Precisionen får kosta hur mycket läsbarhet som helst.** "Plats 3 av 33 räknat från lägsta värdet, oavsett om lågt är önskvärt eller inte" är korrekt och oläsligt, och varianter av den frasen återkommer på hela nyckeltalssidan. Definiera **en gång** i en legend högst upp: *"Plats 1 = lägst värde i Skåne."* Skriv sedan bara "plats 3 av 33".

Tre omskrivningar som exempel på nivån:

> **Nu** (`/nyckeltal/`, sidans första mening — notera att det osignerade talet är en avvikelse som läsaren ännu inte fått förklarad):
> *"En budgetsiffra säger ingenting ensam. −28,6 miljoner kronor är mycket eller lite beroende på vad man jämför med — och vem man jämför med avgör en stor del av svaret. Den här sidan ställer Höör mot tre olika referenser samtidigt, och visar när de säger samma sak och när de inte gör det."*
>
> **Förslag:**
> *"Höörs förskola kostar minst i hela Skåne — oavsett hur man räknar. Det är det tydligaste som syns när Höörs siffror ställs mot andra kommuners. Den här sidan visar var Höör lägger mer än jämförbara kommuner, var kommunen lägger mindre — och jämfört med vilka."*

> **Nu** (`/budget/`):
> *"Måttet nedan, verksamhetens nettokostnader, är vad kommunens verksamhet kostar totalt varje år efter att avgifter och statsbidrag räknats bort. Det är hämtat ur resultaträkningen i respektive års egen budgethandling (inte ur senare års omräknade siffror – se Om urvalet)."*
>
> **Förslag:**
> *"Kommunens verksamhet kostar ungefär 1,3 miljarder kronor om året. Så här har summan vuxit, år för år."* — och källmeningen blir en fotnot under tabellen.

> **Nu** (`/arenden/`, lead): *"En kurerad, inte heltäckande, lista över ärenden och motioner som antingen förekommit i lokal press och/eller kopplar till politikområden som partierna själva lyfter i sina 2026-manifest."*
>
> **Förslag:**
> *"15 beslut som märkts i Höör den här mandatperioden — från rivningen av Kvarnen till busskortet för alla över 70. För varje beslut: vad som hände, hur partierna röstade, och källan."* — urvalskriterierna i en rad längst ned.

### 1.5 Tabeller där ögat behöver en bild

Sajten har **en** diagramkomponent (`Jamforelse.astro`, staplarna) och den är bra: ingen JavaScript, sorterad, med nollinje. Men den används bara på `/nyckeltal/`. Resten är tabeller — och en tabell med 7 kolumner × 8 rader svarar inte på någon fråga; den arkiverar svaret.

- "−19,2 % mot snittets −1,9 %" landar på en sekund som stapel, aldrig som tabellcell.
- "26 ja mot 13 nej i ett fullmäktige där styret har 17 av 41" landar som **41 prickar i tre färger** (17 styre + 9 SD + 15 övriga) — en ren HTML/CSS-figur, ingen bild behövs.
- Budgetens nämndramar (10 rader × 5 år) besvarar ingen läsarfråga. Läsarens fråga är *"vart går min hundralapp?"* — och svaret går att räkna ut ur `budget.json` som redan finns: skola ≈ X kr, omsorg ≈ Y kr, allt annat ≈ Z kr av varje hundralapp i skatt. Det är dessutom det mest delbara innehållet sajten skulle ha.

---

## 2. Sajtens tre berättelser — och den fjärde som ligger oanvänd i datan

Det här är vad sajten faktiskt äger, och vad hela presentationen borde hänga på:

**A. Förskolan: billigast i Skåna, hur man än räknar.** Två oberoende mått (avvikelse mot referenskostnad −19,2 %, rå kostnad per barn), samma slutsats, växande år för år, robust mot alla tre jämförelsegrupperna. Ingen annan i Höör har publicerat detta. I dag: avsnitt 3 på en undersida.

**B. Vem styr egentligen? 17 + 9 = 26.** Styret har 17 av 41 mandat men vinner varje budgetvotering med exakt 26 röster — SD:s grupp fyller ut, varje gång (en gång MED). Samtidigt röstar S, V och MP ned *varandras* budgetar innan de enas om att rösta nej till styrets. Detta är dokumenterat med namngivna röstlängder. I dag: berättas bra på `/styret-vs-oppositionen/` men drunknar i sidans längd.

**C. 80 öre — och vad de kostar.** Skatten sänks med 80 öre; sajten räknar ut vad det ger invånaren per månad (bra!). Men den räknar aldrig ut **vad det kostar kommunen per år** — den siffran finns i budgethandlingens resultaträkning (skatteunderlaget) och är i storleksordningen 25–35 mnkr/år *(räkna ur handlingen och källbelägg innan publicering — 0,80/21,75 ≈ 3,7 % av skatteintäkterna)*. Först när båda talen står bredvid varandra blir skattefrågan ett riktigt vägval: ~200 kr/mån för ett hushåll — eller ungefär lika mycket pengar som förskolans hela avstånd till referenskostnaden. Att ställa talen bredvid varandra är inte att tycka; det är att göra valet synligt. (Not-boxen på `/budget/` som varnar för att subtrahera ram mot avvikelse gäller fortfarande — formulera som storleksordningar, inte som ekvation.)

**D. Den oanvända: löfte mot handling.** Sajten har partiernas löften (`partier.json`), deras faktiska röster (`arenden.json`, 12 voteringar per parti) och deras egna budgetförslag (`oppositionsbudgetar.json`) — men **kopplar aldrig ihop dem**. Exempel på frågor datan redan kan besvara: M lovar +6 mnkr till skolans grundbelopp — hur förhåller det sig till styrets egna ramar och till förskoleavvikelsen? S säger sig vilja "dubbla förskolepengen" — vad avsatte S i sin egen alternativbudget? *(Kontrollera förresten "dubbla förskolepengen" ordagrant mot källan — en dubblad förskolepeng vore en enorm kostnad; om S menar något snävare ska sajten inte förstärka formuleringen.)* En sektion "Löftet och pengarna" per parti vore sajtens starkaste nya innehåll, och den är rent deskriptiv.

---

## 3. "Vad är bäst för invånarna?" — hur man svarar utan att tyckas

Din fråga i klartext: vi antar att väljarna vill ha det bra för sig själva och sin nästa — kan sidan hjälpa dem att bedöma om politiken är *rimlig*, utan att tala om vad de ska tycka?

Svaret: **"bäst" går inte att räkna fram, för det beror på vad väljaren värderar. Men sajten kan göra det värderingen behöver: göra konsekvenserna läsbara.** Det är skillnaden mellan att säga "sänkt skatt är fel" (åsikt) och att säga "sänkningen ger dig ~200 kr/mån och motsvarar ~30 mnkr/år; här är vad partierna vill göra med samma pengar; här är hur de faktiskt röstade" (fakta som gör åsikten möjlig).

Sajten har redan uppfunnit sina två bästa verktyg för detta — den använder dem bara inte systematiskt:

1. **"Siffran avgör inte tolkningen"-rutan** på `/nyckeltal/`: *"Att Höör lägger minst per barn i Skåne kan läsas som en effektiv förskola, som en underfinansierad förskola, eller som en strukturfaktor modellen missar. Det är en politisk fråga, och den ska ställas till partierna."* Detta är exakt rätt. Det är inte en brasklapp — det är sajtens **redaktionella idé**, och den borde stå som mönster på varje temasida.
2. **De fyra frågorna** i slutet av `/styret-vs-oppositionen/` ("Skatt vs välfärd: föredrar du…?"). Frågor till läsaren är den neutrala formen av vägledning.

Gör detta till ett återkommande mönster — kalla det **Vägvalet** — med fast form på varje temaområde:

> **Vägvalet: [förskolan / skatten / tryggheten / landsbygden]**
> 1. *Läget:* en mening + en stapel. ("Höörs förskola kostar minst i Skåne per barn.")
> 2. *Pengarna:* vad handlar det om i kronor. ("Avståndet till referenskostnaden: ~29 mnkr/år.")
> 3. *Alternativen:* vad partierna vill, med källa. ("S och MP vill höja ramen; styret prioriterar sänkt skatt; V …")
> 4. *Handlingen:* hur de faktiskt röstat. ("I budgetvoteringarna röstade …")
> 5. *Frågan till dig:* en enda rad. ("Vad väger tyngst för dig: 200 kr lägre skatt i månaden eller mer resurser per förskolebarn?")

Punkt 1–4 är källbelagd fakta. Punkt 5 är läsarens. Ingen värdering har smugit sig in — men läsaren har fått allt hon behöver för att göra sin egen.

**"Är politiken rimlig?"** går att operationalisera på samma prövbara sätt, i tre frågor sajten kan besvara utan att tycka:
- **Hänger löftena ihop med pengarna?** (Kostnadssatta löften mot budgetutrymme — §2D.)
- **Gör partierna som de säger?** (Track record-sektionerna finns redan; koppla dem till löftena.)
- **Vad prioriterar du själv?** (Vägvals-frågorna + valkompassen.)

Mer än så ska sajten inte lova. "Rimlig" i absolut mening är väljarens dom — och det är poängen med val.

---

## 4. Sida för sida

### `/styret-vs-oppositionen/` — förebilden. Rör innehållet minimalt.
Sajtens bästa sida: den har berättelse, röst, konkreta röstsiffror, ärligt märkta tolkningar ("Vibben" — behåll ordet, det är sajtens mänskligaste) och frågorna till läsaren. **Använd den som mall för allt annat.** Att göra: 41-prickarsfiguren för 26–13-mekaniken (§1.5); §4 förklarar 26-rösterslogiken två gånger — stryk en; Ciceron-meningen bort (§1.1).

### `/` (startsidan) — byt kortens språk, lyft fynden, banta trust-noten.
Bra: valkompassen direkt, rimlig längd, LIX 42. Problem: de åtta korten är skrivna som releasenoteser ("De fem budgetbesluten 2023–2027 sida vid sida: skattesats, förslagsställare, källor") — ingen väljare klickar på det. Gör om till läsarens frågor: *"Vart går pengarna?" / "Vem bestämmer egentligen?" / "Vad lovar partierna just dig?"*. Lägg ett block **"Tre saker som sticker ut i Höör"** ovanför korten: berättelse A, B, C i en mening var + länk. Trust-noten: stryk tillkomsthistorien (§1.1). AI-hookkortet: behåll längst ned men flytta ur huvudmenyn (§6).

### `/nyckeltal/` — vänd sidan uppochned.
Bäst analys, tyngst läsning. Konkret: (1) Ny inledning med förskolefyndet först (omskrivningen i §1.4 — dagens −28,6-öppning är dessutom obegriplig innan man vet vad talet är). (2) Flytta "Tre referenser, tre olika svar" till en `<details>` eller längre ned — det är en utmärkt text, men det är metod, inte fynd. (3) Legend "Plats 1 = lägst i Skåne" en gång; stryk varje upprepning av "räknat från lägsta värdet". (4) De tolv derived-notes → en samlad rad (§1.2). (5) Behåll "Totalen är den minst intressanta siffran på sidan" — det är sajtens bästa rubrik. (6) 7-kolumnstabellen "Alla verksamheter": gör Höör-% till staplar med `Jamforelse.astro` eller banta till 4 kolumner (Höör %, mnkr, plats, snitt Skåne) och lägg grann-/gruppsnitten i `<details>`.

### `/budget/` — från arkiv till svar.
Bra: "Vad kostar 80 öre mig?" först — rätt instinkt. Att göra: (1) **"Din hundralapp"** ur `namndfordelning_tkr` (§1.5) högst upp, bredvid 80-öressektionen. (2) Räkneexemplet 80 öre ≈ X mnkr/år för kommunen (§2C, verifiera först). (3) De fem årsbesluts-sektionerna längst ned är arkivmaterial — lägg varje år i en `<details>` ("Budget 2025 — beslut, votering, källdokument"). (4) Tio länkar till Om urvalet → max två. (5) Ciceron-stycket bort.

### `/jamforelse/` och `/din-vardag/` — innehållet är partiernas, apparaten er.
LIX 57–58 här beror till stor del på citerade partiståndpunkter — det ska inte skrivas om (det är deras ord). Men apparaten kan bantas: käll-URL:en visas i dag i fulltext på varje kort (`{s.kalla_url}` — långa Facebook-adresser som radbryts); visa `kalla_titel` eller "Källa →" i stället. M-bannern på `/jamforelse/` är viktig men lång — två meningar + länk räcker: *"Största partiet, Moderaterna, saknar publicerat lokalt program; deras 24 punkter nedan bygger på partiets Facebook-inlägg. [Så kontrollerade vi det.]"* (Notera: bannern säger "Partiet har därför inga kort i temana nedan" — stämmer det fortfarande, nu när M har 24 punkter med status `sociala_medier`? Verifiera att bannerns text matchar dagens data.)

### `/arenden/` — bra struktur, för mycket apparat per kort.
Index + filter fungerar. Att göra: dela varje ärendes beskrivning i **"Vad hände"** (2–3 meningar) och resten i `<details>`; "Varför är det här ärendet med?" är redan `<details>` — bra, behåll mönstret konsekvent. Överväg en "Mest omdiskuterat"-markering (press + votering = topp) så att busskortet 19–19 inte ser ut som bostadsriktlinjerna.

### `/partier/` och partisidorna — nära rätt.
Track record-sektionen med "JA betydde / NEJ betydde" är föredömlig. Att göra: Ciceron-stycket bort från S/V/MP-sidorna; lägg "Löftet och pengarna" (§2D) när den byggs; M-sidans manifest-not är lång — kortversion + `<details>`.

### Valkompassen — fyra dubbelfrågor.
Metodfixarna från punkt 14 är gjorda och bra. Kvarstående: fyra påståenden är dubbla och går inte att svara ärligt på om man tycker olika om halvorna: `skatt-effektivisering` (sänkt skatt **och** färre sammanträden), `ishall-investering` (ishall **och** Ringsjöskolan), `vinst-valfard` (vinststopp **och** personaltäthet), `bilism` (formulerad som motsättning bil **mot** kollektivtrafik). Dela eller förenkla till en proposition per fråga. Rätta också sifferkrocken: startsidan säger "11 frågor", Om urvalet säger "12 sakfrågor" (§8).

### `/ordlista/` — sajtens bästa hantverk. Rör inte.
Elva begrepp med belagda Höör-exempel och interna länkar. Enda förslaget: länka ordlistan *inline* första gången en term används på varje sida (görs redan ofta).

### `/om-urvalet/` — rätt innehåll, fel längd, och nu även mottagare av allt som flyttas.
Detta är rätt plats för Ciceron-historien, tillkomsthistorien, licensresonemangen och alla brasklappar som lyfts bort från andra sidor. Ge den en innehållsförteckning (som `/nyckeltal/` har) så den fungerar som uppslagsverk. LIX 58 är acceptabelt *här* — det är sajtens maskinrum.

### `/historiska-val/`, `/ratta/`, `/om/` — fungerar. `/ai/` — flytta ur huvudmenyn (se §6; TASK punkt 24 säger samma sak).

---

## 5. Det som saknas

1. **Praktisk valinformation** (TASK punkt 22 — öppen). Var förtidsröstar man, från när (26 augusti — *nio dagar bort*), vad krävs, vad är en personröst och varför kan den avgöra i en kommun där mandat tas på några hundra röster. Detta är sajtens mest grundläggande tjänst för "alla ska förstå sin kommun", den är billigast att bygga, och den saknas helt. **Högsta prioritet av allt nytt.**
2. **"Vad bestämmer kommunen egentligen?"** En kort sida (15 rader + tabell): kommunen = förskola, skola, äldreomsorg, gator, bygglov; regionen = vårdcentraler, sjukhus, bussar; staten = polis, straff, migration. Valkompassen märker redan enskilda frågor som nationella — bra — men förklaringen finns ingenstans samlad. Utan den kan en väljare inte bedöma vilka löften ett kommunparti ens *kan* hålla. Billig, och kanske sajtens viktigaste sida för lågutbildade läsare.
3. **"Löftet och pengarna"** — §2D.
4. **80-öressänkningens årskostnad för kommunen** — §2C.
5. Nämndnivån (TASK punkt 21) — känd lucka, Fas 2, rätt prioriterad som "efter valet".

---

## 6. UI/UX

**Navigationen: 11 platta poster → 8, och ordna efter läsarens resa.**
I dag ligger "AI-experimentet" mitt i menyn, mellan Ärenden och Historiska val — sajtens minst viktiga innehåll på en av de mest synliga platserna. Förslag:

> Huvudmeny: Start · Din vardag · Partierna · Jämförelse · Styret vs oppositionen · Budget · Nyckeltal · Så röstar du *(ny, §5.1)*
> Sidfot: Ärenden · Historiska val · AI-experimentet · Om urvalet · Ordlista · Rätta en uppgift · Om mig

(Ärenden kan också behållas i huvudmenyn på bekostnad av något annat — men elva poster utan hierarki är för många, och AI + Historiska val + Om urvalet är tydliga sidfotskandidater.)

**Ett siffer-callout-mönster.** Sajtens fynd behöver en visuell form: stort tal + en rad + källänk.

```html
<div class="nyckelfynd">
  <span class="nyckelfynd__tal">−19,2 %</span>
  <span class="nyckelfynd__text">Förskolans avstånd till referenskostnaden 2024 — lägst i Skåne</span>
  <a class="source-link" href="…">Kolada N11024</a>
</div>
```

Tre sådana på startsidan (berättelse A, B, C), en högst upp per temasida. Det är skillnaden mellan en sajt som *har* fynd och en som *visar* dem.

**Fler staplar, färre tabeller.** `Jamforelse.astro` finns, är JS-fri och bra — använd den på `/budget/` (avvikelsetidsserien) och överallt där en tabellkolumn egentligen är en rangordning. 41-prickarsfiguren på styret-sidan (§1.5). "Din hundralapp" på budgetsidan (§4).

**`<details>` som standard för fördjupning.** Mönstret används redan på `/arenden/` — gör det till sajtens bärande idé: *ytan svarar, vecket fördjupar.* Årsbesluten på budget, referensmetodiken på nyckeltal, datumnoter, urvalsmotiveringar — allt i veck.

**Typografi och färg: behåll.** Georgia-brödtext, återhållna färger, styre/oppositionspaletten och det gröna källmärket är bra och känns mer dagstidning än AI. Undantag: emoji-ikonerna på Din vardag (👨‍👩‍👧 💼) är den enda visuella detalj som drar åt "AI-genererat" — text räcker, eller enkla SVG:er.

**Käll-URL:er i fulltext på korten** (`/jamforelse/`, `/din-vardag/`) → kort etikett (§4).

**Mobil:** table-scroll finns och fungerar; den redan noterade minmax-justeringen för <350 px (TASK, struken punkt) kvarstår som enda kända problem.

---

## 7. Redaktionsregler — klistra in i CLAUDE.md

Det här är reglerna som hindrar att problemet växer tillbaka nästa session:

1. **Svaret först.** Varje sida och varje avsnitt börjar med slutsatsen i klarspråk, max 20 ord. Metod, förbehåll och termer kommer efter.
2. **En brasklapp per sida i löptext.** Resten i `<details>`, fotnot eller Om urvalet.
3. **LIX ≤ 45** på all prosa sajten själv skriver (citat från partier/protokoll undantagna). Mät på byggd HTML innan commit.
4. **Rubriker är läsarens frågor**, inte förvaltningens substantiv. ("Lägger Höör mer eller mindre än andra?" — inte "Nettokostnadsavvikelse totalt".)
5. **Max en länk till /om-urvalet/ per sida** (utöver sidfoten).
6. **Berätta aldrig hur datan hämtades i läsartext.** Det står på Om urvalet.
7. **En rangordning är inte en åsikt** om grunden är utskriven. Sortera efter det som berör flest/mest pengar/störst avvikelse — och skriv ut vilket.
8. **Varje stort tal får en jämförelsepunkt i samma mening.** ("130 mnkr — ungefär en tiondel av kommunens årsbudget.")
9. **Frågor till läsaren är sajtens enda tillåtna vägledning.** ("Vad väger tyngst för dig: …?")
10. **Skriv för en klok granne som aldrig läst ett protokoll.** Inte för granskaren som ska underkänna sajten — hon är redan nöjd; källorna finns.

---

## 8. Småfel hittade under granskningen

| # | Fel | Var | Åtgärd |
|---|---|---|---|
| 1 | Startsidan säger "Svara på **11** frågor", Om urvalet säger "en valkompass med **12** sakfrågor". `valkompass.json` innehåller 11. | `/om-urvalet/` (hårdkodad siffra) | Läs antalet ur `valkompassData.fragor.length` — samma princip sajten redan tillämpar överallt annars. |
| 2 | `/nyckeltal/` öppnar med "−28,6 miljoner kronor är mycket eller lite…" — ett signerat avvikelsetal presenterat som "en budgetsiffra", innan begreppet förklarats. | `nyckeltal/index.astro:298` | Löses av nya inledningen (§4). |
| 3 | "S vill **dubbla förskolepengen**" — mycket starkt påstående; om källan menar något snävare förstärker sajten det. | `/styret-vs-oppositionen/`, valkompassens källnot | Verifiera ordagrant mot S-källan; justera formulering vid behov. |
| 4 | **M-bannern på `/jamforelse/` renderas inte längre** (verifierat i byggd HTML: noll träffar på "Största partiet saknas"). Villkoret kräver `manifest_status === "saknas"`, men M står numera som `sociala_medier`. Följdfel: förklaringen om att C, KD, SD och MED visas med **nationella** ståndpunkter låg nästlad inne i samma banner — den är alltså också borta. Sidan visar nu nationella löften som ser lokala ut, utan förbehåll — sajtens i övrigt viktigaste distinktion. | `jamforelse/index.astro:104–119` | Bryt ut "ersatt"-förklaringen ur M-villkoret så den alltid renderas; ersätt M-bannern med en kort rad om Facebook-källorna (§4). Samma mönster finns i `din-vardag/index.astro` — kontrollera att distinktionen syns även där. |
| 5 | Väljarfråga 3 på styret-sidan buntar "hårdare straff och migrationskrav" (riksfrågor) med kommunala trafikval utan nationell-markering — valkompassen markerar samma frågor som nationella. | `styret-vs-oppositionen/index.astro:199` | Lägg samma markering här. |

---

## 9. Prioriterat mot 26 augusti (förtidsröstningen) och 13 september

**P1 — före 26 augusti (störst effekt per timme):**
1. Sidan **"Så röstar du"** (§5.1) — ny, liten, viktigast.
2. **Startsidan**: "Tre saker som sticker ut", kortens språk, bantad trust-note (§4).
3. **Nyckeltal vänds**: fyndet först, metod i veck, legend, en licensrad (§4). Sajtens tyngsta sida blir läsbar.
4. **Menyn** 11 → 8, AI till sidfoten (§6; stänger även TASK punkt 24).
5. **Ciceron-städningen**: 7 sidor → 1 (§1.1). En timmes arbete, stor effekt på "AI-känslan".
6. Småfelen i §8.

**P2 — före 13 september:**
7. "Din hundralapp" + 80-öressänkningens årskostnad på `/budget/` (§2C, §4).
8. Siffer-callouts + 41-prickarsfiguren (§6).
9. "Vad bestämmer kommunen egentligen?" (§5.2).
10. Budgetens årsbeslut i `<details>`; arendekortens tudelning (§4).
11. Valkompassens dubbelfrågor (§4).

**P3 — om tid finns / efter valet:**
12. "Löftet och pengarna" per parti (§2D).
13. Vägvals-mönstret utrullat som fast form på alla temaområden (§3).
14. Nämndnivån (TASK 21), resterande transkriptioner (Fas 2).

**Skär bort utan ånger:** ingenting av innehållet — men flytta utan ånger: all metodtext till Om urvalet, alla årsarkiv till veck, AI-delen till sidfoten.

---

## 10. Rör inte detta

Sådant som är ovanligt bra och ska överleva varje omarbetning:

- **Källdisciplinen.** Grönt märke för hämtat, streckat för uträknat, länk till exakt API-anrop. Detta är sajtens själ. (Bara *upprepningen* av förklaringen ska bort — inte märkningen.)
- **`Votering.astro`-mönstret**: "JA betydde / NEJ betydde" före siffrorna. Bättre än hur de flesta tidningar redovisar voteringar.
- **Ordlistan** med belagda Höör-exempel.
- **Rättelsekanalen** (`/ratta/` + mailto per sida) och principen "ingen tyst ändring".
- **"Siffran avgör inte tolkningen"-rutan** — uppgradera från brasklapp till bärande idé (§3).
- **"Vibben"** och frågorna till läsaren på styret-sidan — sajtens mänskligaste inslag.
- **Det statiska bygget** — inga API-anrop i drift, fungerar utan JavaScript. Behåll kompromisslöst.
- **Ärligheten om luckor** ("Moderaternas webbplats var tom när vi kontrollerade") — men som konstaterande, inte som ursäkt.

---

*Granskningen är gjord i samma anda som sajten själv: allt mätbart är mätt (LIX, blockräkningar, länkräkningar — mot byggd HTML 2026-08-17), allt annat är märkt som bedömning. Siffror i §2C är storleksordningar som ska räknas ur budgethandlingen innan de publiceras.*
