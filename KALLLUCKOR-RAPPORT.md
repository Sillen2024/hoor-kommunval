# Rapport: källor och data vi inte hittade

Skriven 2026-08-11, uppdaterad 2026-08-12. Underlag för fortsatt research. Syftet är
att peka ut exakt var det nuvarande bygget är tunt, varför, och vilka konkreta nästa
steg som skulle kunna lösa det — snarare än att bara konstatera "vi hittade inte allt".

**UPPDATERING 2026-08-12:** Punkt 1 nedan (den tekniska spärren mot
sammanträdesportalen) är **löst**. Höörs kommun besvarade en begäran om utlämnande av
handlingar (skickad 2026-08-11, se `src/data/mejl kommunen/`) och pekade samtidigt ut
att sammanträdesportalen `sok-hr.unikom.se` är fritt sökbar utan inloggning. En
genomgång av sidans JavaScript visade att den anropar ett öppet, oautentiserat
JSON-RPC-API som går att använda direkt utan webbläsarautomation. Det gamla
antagandet i denna rapport — "Ingen REST-API kunde hittas bakom den" — var fel; API:t
fanns hela tiden, det krävde bara att man läste klientkoden istället för att bara
`curl`:a mot HTML-sidan. Se avsnitt 1 för full dokumentation av API:t, och avsnitt 2
för hur det redan använts för att fylla i budget 2023/2024/2025 fullständigt.

**Kort diagnos av varför analysen kändes platt innan detta löstes:** den tidigare
sajten kunde bara visa _vad_ som beslutades, nästan aldrig _hur striden stod_. Utan
röstsiffror, oppositionens egna budgetförslag, eller protokollsutdrag med
reservationer/yrkanden fanns det inget politiskt drama kvar i texten — bara
administrativa fakta. Nu när API:t är löst finns denna data tillgänglig för i princip
alla nämnder och möten sedan 2023-05-24 (portalens faktiska täckning), inte bara
budgetbesluten.

---

## 1. Ciceron-API:et (LÖST 2026-08-12)

Höörs kommuns sammanträdesportal (`sok-hr.unikom.se`) är byggd på plattformen
"Ciceron" (Visma Consulting), som en AngularJS/RequireJS-SPA. Bakom SPA:n ligger ett
**öppet, oautentiserat JSON-RPC 2.0-API** som portalen själv anropar för att hämta
sökresultat och dokument. Ingen inloggning eller nyckel krävs. `hoor.okv.se`
(webb-TV) fungerar separat och är fortfarande inte utredd (se kvarstående punkter
nedan), men det spelar mindre roll nu eftersom protokollen med röstsiffror räcker för
det mesta av behovet.

### Endpoint

```
POST https://sok-hr.unikom.se/json
Content-Type: application/json
```

Alla anrop skickas som ett JSON-objekt:

```json
{
  "jsonrpc": "2.0",
  "method": "CiceronsokServer:<MetodNamn>",
  "params": { ... },
  "session_id": "<valfri, från tidigare svar>"
}
```

Varje svar innehåller ett `session_id`-fält på toppnivå. Det är inte strikt
nödvändigt att skicka med det på efterföljande anrop (fungerade även med ett nytt
`session_id` per anrop i praktiken), men bäst att återanvända samma `session_id`
genom en hel sekvens av anrop (sök → läs objekt → ladda ner dokument), särskilt för
nedladdning av dokument.

### Metoder som använts

- **`ReadDiaries`** — `params: {}`. Returnerar alla diarier/nämnder, t.ex.
  `"KSF":{"description":"Kommunstyrelsen/Kommunfullmäktige","instances":["Kommunfullmäktige","Kommunstyrelsen","Kommunstyrelsens Arbetsutskott"]}`.
  Bra första anrop för att hitta rätt `diary`/`board`-namn för andra nämnder
  (barn- och utbildningsnämnden, socialnämnden, nämnden för kultur/arbete/folkhälsa
  m.fl. har egna diarier).

- **`Search`** — `params: {"search_id":"ciceronsok_search","doctype":<int>,"text":"","param":"<JSON-sträng med filter>"}`.
  - `doctype`: 64 = Sammanträdesprotokoll, 1 = Möte, 512 = Styrande dokument,
    8 = Förtroendevalda.
  - `param` är en **JSON-sträng** (dvs. dubbel-serialiserad), t.ex.
    `"{\"diary\":\"KSF\",\"board\":\"Kommunfullmäktige\",\"from_date\":\"\",\"to_date\":\"\"}"`.
  - `search_id` kan utelämnas — defaultar till literalen `"ciceronsok_search"`
    (hårdkodat i klientens `searchServices.js`).
  - Svar: `{"hits":<antal träffar>}`.
  - Bekräftad täckning: sökning på `diary:"KSF", board:"Kommunfullmäktige",
    doctype:64` gav exakt 27 möten, från **2023-05-24 till 2026-06-10**. Portalen
    täcker alltså INTE mötet 2022-11-30 (budget 2023) — det fick vi istället från
    kommunens registrator som PDF-bilaga via mejl.

- **`ReadItems`** — `params: {"search_id":"ciceronsok_search","offset":0,"limit":<n>}`.
  Returnerar en lista `results[]`, varje post med `id` (litet heltal, 0 = senaste
  träffen), `doctype`, `type`, `title`, `contains_files`, `diary_name`,
  `object_link` (mönster `?t=1&i=<nämnd>&d=<datum>&n=<diarie>`).

- **`ReadObjectDetails`** — `params: {"search_id":"ciceronsok_search","id":"<id från ReadItems>"}`.
  Returnerar ett nästlat, JSON-sträng-kodat `value`-fält med:
  - `tid`, `plats` — mötets tid och plats.
  - `documents[]` — bifogade filer på mötesnivå (kallelse, protokoll,
    reservationsbilagor), varje post med `size`, `type`, `dok_id`, `id`, `name`,
    `filename`, **`filename_b64`** (base64-kodat filnamn, se nedan), `title`,
    `subtitle`.
  - `items[]` — hela mötets ärendelista (dagordningen), varje post med `title`,
    `diarie` (diarienummer), `diary_name`, `document_type`, `instans`, `motedat`,
    `object_link`. Bra för att snabbt se vilket möte som innehåller t.ex.
    "Budget 2025" utan att behöva öppna varje protokoll.

- **`ReadArendeFiles`** — `params: {"instans":<int>,"mote_dat":"<YYYY-MM-DD>","case_id":"<diarienummer>","avbild":<int>,"diary_name":"<t.ex. KSF>","doctype":<int>}`.
  Alla sex värden hämtas rakt av från en post i `items[]` (fälten `instans`,
  `motedat`, `diarie`→`case_id`, `avbild`, `diary_name`, `document_type`→`doctype`).
  Returnerar den fullständiga listan av **beslutsunderlag** för just det ärendet —
  alltså inte bara kallelse/protokoll/reservationer (det `ReadObjectDetails` ger på
  mötesnivå), utan varje enskilt bifogat dokument till ärendet: tjänsteskrivelser,
  konsekvensbeskrivningar, och — avgörande för budgetärenden — **oppositionens egna
  fullständiga budgetförslag** (t.ex. "Socialdemokraternas förslag till budget 2025
  VEP 2026-2027.pdf"). Detta var den saknade pusselbiten för att hämta hem
  oppositionens motförslag i fulltext, inte bara deras röstsiffror/reservationer.
  Hittades genom att läsa klientens `scripts/services/searchServices.js` →
  `getArendeFiles()` → `iciceronsok.js` → `ReadArendeFiles`, inte genom att gissa.
  Svaret är en lista med `description`, `filename`, `filename_b64`, `dok_id`, `id`,
  `exists` — samma `download/document`-flöde som nedan används sedan för att ladda
  ner filerna.

- **`download/document`** (inte JSON-RPC, vanligt GET mot en annan sökväg):
  ```
  GET https://sok-hr.unikom.se/download/document?filename={filename_b64}&id={id}&session_id={session_id}
  ```
  Laddar ner själva PDF-filen. **Viktigt:** `filename` ska vara exakt den
  `filename_b64`-sträng som servern returnerade i `ReadObjectDetails` — försök inte
  räkna om den själv (t.ex. med `python3 -c "base64.b64encode(...)"`). Filnamn med
  paragraftecken (§) eller å/ä/ö kodas av servern med en icke-UTF8-teckentabell
  (verkar vara Latin-1/cp1252), så en egen omkodning ger fel bytes och servern
  svarar då med en HTML-felsida istället för PDF:en. Kopiera `filename_b64` rakt av
  från JSON-svaret. `id` är dokumentets `id`-fält (inte `dok_id`).

### Exempel: hela flödet för att hämta ett protokoll med röstsiffror

```bash
# 1. Sök alla KF-protokoll
curl -s -X POST https://sok-hr.unikom.se/json -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"CiceronsokServer:Search","params":{"search_id":"ciceronsok_search","doctype":64,"text":"","param":"{\"diary\":\"KSF\",\"board\":\"Kommunfullmäktige\",\"from_date\":\"\",\"to_date\":\"\"}"}}'
# -> {"jsonrpc":"2.0","result":{"result":"{\"hits\":27}"},"session_id":"<SID>"}

# 2. Lista alla 27 möten
curl -s -X POST https://sok-hr.unikom.se/json -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"CiceronsokServer:ReadItems","params":{"search_id":"ciceronsok_search","offset":0,"limit":27},"session_id":"<SID>"}'

# 3. Läs detaljer för ett specifikt möte (id från steg 2), inkl. dokumentlista
curl -s -X POST https://sok-hr.unikom.se/json -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"CiceronsokServer:ReadObjectDetails","params":{"search_id":"ciceronsok_search","id":"16"},"session_id":"<SID>"}'
# -> ger bl.a. documents[] med filename_b64 för protokollet och ev. reservationer

# 4. Ladda ner protokollet (filename_b64 och id kopierade rakt av från steg 3)
curl -s -o protokoll.pdf "https://sok-hr.unikom.se/download/document?filename=<filename_b64>&id=<id>&session_id=<SID>"
```

### Begränsningar och fallgropar (upptäckta i praktiken)

- **`pdftoppm` saknas i denna miljö** — `Read`-verktygets `pages`-parameter kräver
  Poppler (`pdftoppm`) för att rendera PDF-sidor, vilket inte finns installerat här.
  Lösning: kör `Read` **utan** `pages`-parametern — det går via en annan kodväg och
  fungerar fint även för längre PDF:er (testat på 35-37 sidor).
- **Portalen täcker inte möten före 2023-05-24.** Äldre protokoll (t.ex.
  budget 2023, mötet 2022-11-30) måste begäras separat från kommunens registrator.
- **`filename_b64` måste kopieras exakt** — se ovan under `download/document`.
- Metoderna är inte officiellt dokumenterade av Visma/kommunen någonstans — allt
  ovan är reverse-engineerat ur klientens JavaScript (`searchServices.js` m.fl.) och
  verifierat genom faktiska anrop. Fungerade stabilt under hela sessionen
  2026-08-12, men kan ändras utan förvarning om kommunen byter portalversion.

**Kvarstående, ej löst:** `hoor.okv.se` (webb-TV-arkivet, redirectar till
`hoor.socialcast.se`) har inte undersökts på samma sätt. Sannolikt lägre prioritet
nu eftersom protokollen via Ciceron-API:et redan ger röstsiffror och reservationer
i textform, vilket var huvudbehovet.

---

## 2. Budgetdata (`src/data/budget.json`) — LÖST 2026-08-12

Alla fem budgetbeslut (2023-2027) har nu verifierade antagandedatum, paragrafer,
diarienummer och fullständiga röstsiffror. 2026 saknar fortfarande paragraf/exakt
diarienummer eftersom beslutet togs med acklamation (ingen votering begärdes).

| År | Antagningsdatum | Paragraf | Röstsiffror | Oppositionens budget/reservation |
|---|---|---|---|---|
| 2023 | **2022-11-30 (verifierat via mejl från registrator)** | **§ 145** | **26-13-2, plus en kontraproposition 10-3-28 om motförslag (S vs V)** | S, V och MP hade egna budgetförslag (ej hämtade i fulltext — möte föregår portalens täckning); S reserverade sig muntligt |
| 2024 | **2023-06-14 (verifierat)** | **§ 77** | **26-11-3, 1 frånvarande (MP lämnade före votering)** | Skriftliga reservationer S (Lissmark) och V (Krabbe) **+ S, V och MP:s fullständiga budgetförslag i fulltext**, allt hämtat som PDF via API (`src/data/protokoll_ksf/oppositionsbudgetar/`) |
| 2025 | **2024-06-19 (verifierat via Ciceron-API)** | **§ 75** | **26-13-0, 2 frånvarande, plus en kontraproposition 8-3-28 om motförslag (S vs V)** | Skriftliga reservationer S (Staaf) och V (Krabbe) **+ S, V och MP:s fullständiga budgetförslag i fulltext**, hämtade som PDF via API |
| 2026 | 2025-06-11 (verifierat via webbsändning) | Ej känd | Ingen votering (acklamation) | Reservationer S, V, MP **+ S/MP:s gemensamma och V:s eget fullständiga budgetförslag i fulltext**, hämtade som PDF via API — se politisk poäng nedan |
| 2027 | 2026-06-10 (verifierat mot undertextfil) | Ej känd | **26-13-0** | S:s förslag var motförslag (bara röstsiffran verifierad, inte dokumentet); reservationer S, V, MP |

Viktig korrigering: den gamla gissningen att budget 2025 beslutades 2024-09-25 var
**fel** — det mötesdatumet innehöll inget budgetärende alls. Rätt möte var
2024-06-19 (id 16 i Ciceron-sökningen), vilket bekräftades genom att söka igenom
`items[]`-listan för flera möten efter titeln "Budget 2025".

Se `src/data/protokoll_ksf/` för de nedladdade fullständiga protokollen och
reservationerna, och `src/data/protokoll_ksf/oppositionsbudgetar/` för
oppositionens egna fullständiga budgetförslag i fulltext (hämtade 2026-08-12 via
`ReadArendeFiles`, se avsnitt 1) — dessa ligger till grund för uppgifterna ovan.

**Politisk poäng hittad i materialet:** i budget 2026 gick Socialdemokraterna och
Miljöpartiet (gemensamt förslag) och Vänsterpartiet (eget förslag) åt olika håll —
S/MP ville behålla oförändrad skatt och satsa mer på skola/socialtjänst, medan V
tvärtom ville sänka skatten **mer** än styret (totalt 50 öre mot styrets 30 öre).
Detta är nu inlagt i `budget.json` och på sidan `/styret-vs-oppositionen/`.

**Kvarstående luckor:** exakt paragraf/diarienummer för budget 2026 och 2027 (togs
utan formell paragrafmarkering i den källa som fanns tillgänglig — skulle kunna
hämtas via samma Ciceron-API-flöde som ovan om det prioriteras). Oppositionens
fullständiga budgetförslag för 2023 (föregår portalens täckning, 2022-11-30) och
själva dokumentet för S:s motförslag 2027 (bara röstsiffran är verifierad) har inte
hämtats.

---

## 3. Ärenden (`src/data/arenden.json`) — svagt källade eller helt uteslutna poster

**Not 2026-08-12:** i princip alla poster nedan borde nu gå att lösa via
Ciceron-API:et beskrivet i avsnitt 1, förutsatt att händelsen ligger inom
täckningsfönstret 2023-05-24 till idag och behandlats av en nämnd/fullmäktige (inte
bara omskriven i press). Metoden är: `ReadDiaries` för att hitta rätt `diary` för
den aktuella nämnden, `Search`+`ReadItems` för att hitta rätt möte, sedan
`ReadObjectDetails` för paragraf/diarienummer/röstsiffror/reservationer, och
`download/document` för själva protokollet. Inget av detta har gjorts ännu för
posterna nedan — det är nästa session/uppgift.

### 3.1 Helt uteslutet på grund av obefintlig källa

**Motion om ökade budgetramar för barn- och utbildningsnämnden och socialnämnden**
(Vänsterpartiet, Olle Krabbe m.fl., föreslagen fördelning 5:2). Enligt sekundära
sökträffar behandlad vid kommunfullmäktige 2023-10-11 och 2023-12-06, men inget
Höör-specifikt officiellt dokument (motion, protokoll, tjänsteskrivelse) har
kunnat hittas. Uteslöts helt ur listan snarare än att tas med utan källa — men är
sannolikt en riktig, verifierbar händelse om man kommer åt protokollet.

### 3.2 Med i listan, men svagare källbelagda än övriga

- **"Minskat antal sammanträden 2025"** — inget diarienummer eller paragraf
  hittat för själva beslutet. Källan för sakuppgiften är kommunens allmänna
  mötessida, inte det specifika protokollet. Kritikperspektivet (S:s insändare)
  är den enda källan med substans.
- **"Samverkansavtal räddningstjänst/VA Höör-Hörby"** — datum (2024-05-22) är
  rimligt säkerställt via flera oberoende sökträffar, men paragrafnummer kunde
  bara knytas till **Hörbys** motsvarande beslut (2024-04-22, § 81/§ 83), inte
  bekräftat för Höörs eget beslut. `kalla_url` pekar bara på en allmän
  informationssida, inte protokollet.
- **"Rivning av Kvarnen/Magasinet"** — enda källan är en SkD-artikel
  (`skd.se/2025-12-06/...`), eftersom inget officiellt beslutsdokument för mötet
  2025-12-17 gick att nå. Bryter strikt mot principen "press bara för att
  identifiera ärenden, inte som sakkälla" — flaggat i datan, men värt att ersätta
  med protokollet om det går att nå.
- **"Höör saknar medborgarförslag"** — enda källan är en granskande
  SkD-artikel. Här finns egentligen inget "beslut" att hänvisa till (det är en
  avsaknad av en ordning), så det är delvis oundvikligt, men skulle stärkas av
  ett faktiskt kommunfullmäktigebeslut/motion där frågan om medborgarförslag
  behandlats och avslagits (om ett sådant finns).
- **"Fri kollektivtrafik för pensionärer 70+"** — själva händelseförloppet
  (ursprungligt avslag → senare infört) är dåligt daterat. Exakt datum för det
  ursprungliga avslaget (nämnt i pressen 2021, dvs. före nuvarande mandatperiod)
  och för själva 2026-beslutet saknas.
- **"Handbollsakademi Ringsjöskolan"** — vilket parti som la motionen 2024-01-31
  har inte kunnat identifieras.

### 3.3 Ledtrådar som dök upp men aldrig utreddes klart

Dessa nämndes i sökresultat men förkastades eller lämnades pga tidsbrist —
värda att återuppta:

- **"Byapeng"/lokalt inflytande för landsbygden** — nämndes kort i tidigare
  research (kopplat till bl.a. V:s manifestlöfte om ett "demokratiskt
  investeringsprogram för landsbygden" och S:s manifestpunkt om att hela
  kommunen ska ha inflytande) men aldrig undersökt om det finns ett faktiskt
  kommunalt beslut eller en existerande "byapeng"-ordning i Höör att jämföra mot.
- **Flyktingmottagande 2022–2023** (Ukraina) — undersöktes, men gav bara
  nationell/generell information (kommunen skulle ordna boende åt 50 personer
  enligt ny lag) utan ett tydligt lokalt kommunfullmäktigebeslut att peka på.
  Bedömdes för vagt för att inkluderas, men skulle kunna vara en riktig
  väljarrelevant fråga om ett konkret beslut (t.ex. om anläggningsboende,
  bosättning, eller kommunens andel jämfört med Migrationsverkets fördelningstal)
  går att hitta.
- **"Lånechocken i Höör"** (SkD: kommunen behöver låna för investeringar på
  cirka en miljard kronor, bl.a. utbyggnad av reningsverket i Ormanäs) — en
  potentiellt mycket väljarrelevant ekonomifråga (hög koppling till partiernas
  manifest om ekonomi/skatt), men artikeln beskriver en trend/prognos, inte ett
  enskilt daterat kommunfullmäktigebeslut. Skulle kunna brytas ner i flera
  konkreta investeringsbeslut om protokollen går att nå.
- **Mossen 1 / omorganisation av hemtjänst och vård- och omsorgspersonal** —
  ett beslut kring flytt till en renoverad fastighet (uppges ha behandlats kring
  januari 2025) hittades via sökning men följdes aldrig upp med datum, paragraf
  eller källa.
- **Nytt gymnasium/ombyggnad av Ringsjöskolan (~130 miljoner kr)** — stor
  investering som nämns i pressammanhang, men särskiljs otydligt från
  handbollsakademi-ärendet i sökträffarna. Skulle kunna vara ett eget,
  välsourcat ärende om investeringsbeslutet (belopp, datum, finansiering) går
  att hitta i protokoll eller investeringsbudget.
- **Höörs kommun som hyresgäst på Orupssjukhuset** — hittades men förkastades
  eftersom källan (SkD, 2020-04-30) föregår nuvarande mandatperiod (2022–2026).
  Om det skett en uppföljning/utökning under 2022–2026 (till exempel det
  trygghetsboende med 22 lägenheter som nämns) är det inom scope men aldrig
  verifierat med datum.

---

## 4. Partiernas 2026-manifest (`src/data/partier.json`) — fem av nio partier saknas

**M, C, KD, SD och Medborgerlig Samling saknar helt ett publicerat Höör-specifikt
valmanifest för 2026** i den data som finns nu. Det här är en stor lucka rent
väljarmässigt eftersom M (11 mandat, kommunalråd Johan Svahnberg) och SD
(9 mandat) är två av de tre största partierna i fullmäktige.

- **M** — lokal sida (`hoor.moderatweb.se`) har en meny "Vår politik" med åtta
  rubriker men tomma undersidor (bara rubrik + kontaktuppgifter).
- **C** — lokal sida finns med nyheter/kontakt, men inget "Vår politik"/valprogram.
- **KD** — lokal sida gav 404 på politiska undersidor.
- **SD** — lokal sida (`sd.se/hoor/`) har bara återanvänt nationellt
  partiinnehåll, ingen Höör-specifik sakpolitik.
- **Medborgerlig Samling** — ingen lokal plattform för Höör hittades alls.

Allt kontrollerat en gång (2026-08-11). **Inte omprövat eller sökt igen** med
alternativa sökord, eller kontrollerat mot t.ex. Facebook-sidor, lokala
Instagram-konton, tryckt material (flygblad, insändare) eller SVT/Sydsvenskans
valkompass, som skulle kunna innehålla Höör-specifika svar även om partiet
saknar en egen webbsida med manifest. Det är den mest lovande näst-vägen att
pröva för att fylla de här fem luckorna.

---

## 5. Sammanfattad prioritetslista för en uppföljande session

**Punkt 1 i den ursprungliga listan (webbläsarautomation för budgetprotokoll) är
löst — se avsnitt 1 och 2.** Kvarvarande prioriteringar:

1. **Använd Ciceron-API:et systematiskt på `arenden.json`-luckorna** (avsnitt 3) —
   nu när metoden är bevisad och dokumenterad är detta mest en fråga om att gå
   igenom listan post för post. Störst värde: V:s uteslutna budgetramar-motion
   (avsnitt 3.1, sök `diary` för BUN/SN kring 2023-10 till 2023-12),
   Ringsjöskolan/gymnasiet-investeringen och "lånechocken"-ekonomifrågan (avsnitt
   3.3), eftersom de har starkast koppling till partiernas ekonomi/skattelöften.
2. Hämta exakt paragraf/diarienummer för budget 2026 via samma API-flöde (mötet
   2025-06-11 borde finnas i Ciceron-sökningen).
3. **SVT Valkompass / Sydsvenskan valkompass 2026** för Höör, som sekundär källa
   till Höör-specifika partiställningstaganden för M, C, KD, SD och
   Medborgerlig Samling (opåverkat av API-lösningen — kräver annan researchväg).
4. Om ännu äldre material behövs (före 2023-05-24, portalens täckningsgräns):
   direktkontakt med kommunens registrator, som redan visat sig vara en snabb och
   avgiftsfri väg (se `src/data/mejl kommunen/`).
5. `hoor.okv.se`/webb-TV-arkivet är fortfarande outforskat som egen källa, men
   lägre prioritet nu när protokollstexten via Ciceron-API:et redan ger
   röstsiffror och reservationer.
