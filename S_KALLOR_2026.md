# Socialdemokraterna i Höör — genomgång av partiets egna källor

Hämtat 2026-08-17 från `socialdemokraternahoor.se`. Motsvarar `M_FACEBOOK_RAADATA.md`
för Moderaterna, men bilden är den omvända: M har ingen webbplats att tala om och all
politik i Facebook-reels, S har en fungerande webbplats med publicerat program och
nästan ingenting åtkomligt på Facebook.

## Metod

Sajten är WordPress med öppet REST-API. Hela innehållet gick att hämta i klartext utan
skrapning av HTML:

```
https://www.socialdemokraternahoor.se/wp-json/wp/v2/posts?per_page=100
https://www.socialdemokraternahoor.se/wp-json/wp/v2/pages?per_page=100
```

Det gav 56 inlägg (2019-03-17 – 2026-07-15) och 24 sidor. Sitemap på
`/sitemap.xml` → `/wp-sitemap-posts-post-1.xml` och `-page-1.xml` bekräftar att inget
saknas. Två PDF:er länkade från inläggen hämtades separat och lästes med
`pdftotext -table -enc UTF-8`.

**Fallgrop med URL:erna.** Ämnessidorna under `/var-politik/` har kvar sina sluggar
från 2022 års sajt, medan innehållet är utbytt. Rubrik och adress stämmer därför inte
alltid överens — mest förvirrande är att `/var-politik/gymnasieskolan-och-vuxenutbildningen/`
i dag innehåller avsnittet **"Demokrati & förvaltning"**, och att
`/var-politik/nar-saker-blir-jobbiga/` innehåller **"Omsorg"**. API:t visar `date`
2022-09-29 men `modified` 2026-08-07 för samtliga nio sidor: det är sidobjekten som är
gamla, inte texten. Kontrollera alltid mot rubriken, inte mot adressen.

## Källor som används på sajten

| Källa | Vad den ger | Används i |
|---|---|---|
| Nio ämnessidor under `/var-politik/` | ~46 att-satser, partiets program 2026–2030 | `partier.json` → `manifest_2026` |
| `Kommunalt-handlingsprogram-2026.pdf` (2026-06-27) | Samma text i tryckt form + kandidatcitat | referens i `manifest_not` |
| `/2026/05/28/budget-2027/` | Partiets egen presentation av budgetförslaget | `manifest_2026`, korsref. till `/budget/` |
| `/2026/07/05/motion-gratis-intrade…/` | Motion: gratis bad för barn t.o.m. 12 år | `manifest_2026` |
| `/2026/07/05/initiativarende-ringsjon…/` | Initiativärende: passager ner till Ringsjön | `manifest_2026` |
| `KF-listan-2026-2030.pdf` (2026-04-06) | Alla 21 kandidater med yrke och bostadsort | `kandidater_2026` |
| `/2021/11/29/aterremiss-pa-forslaget…/` | Vem drev igenom återremissen om Magasinet | `arenden.json` → Kvarnen |
| Facebook-inlägg om förskolan | "Dubbelt så mycket på förskolan som styret" | `manifest_2026` |

Resultat i `partier.json`: **5 → 34 ståndpunkter**, **5 → 21 kandidater**.

## Handlingsprogrammets egen prioritering

Programmet lyfter själv fram fem punkter före alla andra, i den här ordningen:

1. Ökade resurser till förskola och skola — högre personaltäthet, nattis, höjt timantal
   i förskolan för äldre barn när föräldern är föräldraledig. "Höör ska vara Skånes
   bästa kommun för barnfamiljer."
2. **Byapeng** — avsatta medel som byinvånarna själva förfogar över.
3. Bättre kommunikationer — pendlarparkeringar, cykelleder, båda tågstationerna.
4. Gratis kollektivtrafik för seniorer.
5. Natur och strand — strandskydd, bevarad skogs- och jordbruksmark.

Byapengen är det förslag som är mest särskiljande mot övriga partier och som partiet
själv återkommer till oftast (programmet, budget 2027, Evalisa Forshells kandidatcitat).

## Iakttagelser värda att följa upp

**1. Skattespänningen i partiets eget program.** Under "Demokrati & förvaltning" står
att partiet vill sköta ekonomin ansvarsfullt "med ambitionen att sänka den kommunala
skatten, dock aldrig på bekostnad av välfärden". I praktiken har S avvisat båda av
styrets sänkningar: budgetförslaget för 2026 behöll 21,75 kr och förslaget för 2027
behåller 21,45 kr mot styrets 20,95. Den uteblivna sänkningen är enligt
`oppositionsbudgetar.json` den huvudsakliga finansieringen av partiets satsningar.
Formuleringen och budgetpraktiken går alltså i olika riktning — inte en motsägelse
(brasklappen "aldrig på bekostnad av välfärden" täcker det), men värt att visa.

**2. S och M lovar samma siffra till skolan.** Båda lovar 6 miljoner kronor i höjt
grundbelopp till förskola/grundskola inför 2027 — S i sin budget (2026-05-28), M i en
reel (2026-07-18). Överlappen finns även i elevhälsa/kuratorer, höjt LOK-stöd och fria
resor för 70+. Kan vara ett bra grepp på `/jamforelse/`: det som ser ut som blockstrid
är i flera fall samma förslag.

**3. Påståendet som går att kontrollera.** S hävdar på Facebook att man vill "satsa
dubbelt så mycket på förskolan som dagens borgerliga styre". Deras budget 2027 ger BUN
+24,6 mnkr mot styrets ram — men "dubbelt så mycket på förskolan" specifikt går inte
att räkna hem ur det underlag vi har. Antingen bör påståendet kontrolleras mot
budgetdokumentets förskoledel, eller redovisas uttryckligen som partiets eget
räknesätt. Sajten återger det i dag som partiets utsaga, med hänvisning till
`/nyckeltal/` där Höörs faktiska kostnadsläge för förskolan står. Transkriptionen av
videon (se Luckor) visar dessutom att det talade löftet gäller *ökningen* av resurser
till förskola och skola, inte den totala förskolebudgeten — vilket är en rimligare och
mer kontrollerbar tolkning än inläggstextens formulering.

**4. Två färska fullmäktigeförslag utan utfall.** Motionen om gratis bad och
initiativärendet om Ringsjön lämnades båda 2026-07-03. Sammanträdesportalens senaste
KF-möte är 2026-06-10, så inget är avgjort ännu. Värt att kontrollera efter höstens
första sammanträde — utfallet är i så fall ett nytt ärende.

## Material från 2019–2022 som inte används

Ligger utanför "Valmanifest 2026" men är den bästa politiska texturen i materialet.
Notera att S ledde kommunen under förra mandatperiodens första del, vilket färgar
texterna.

- **`/2020/11/05/…halverar-vagbidraget…/`** — M, L, KD och SD röstade 2020-11-04 igenom
  en halvering av det kommunala vägbidraget, från 6 kr till 3 kr per vägmeter. Kopplar
  direkt till att V:s budget 2025 föreslår att återställa det till 6 kr/m
  (`oppositionsbudgetar.json`). Ingen primärkälla kontrollerad — 2020 års protokoll
  saknas i sammanträdesportalen.
- **`/2021/11/29/fortsatt-41-ledamoter…/`** — motionen om att minska fullmäktige från
  41 till 31 ledamöter föll med en rösts marginal. Skriftlig reservation finns
  publicerad separat (`/2021/08/10/…minska-antalet-ledamoter…/`), undertecknad Stefan
  Lissmark, KS-gruppledare. Relevant bakgrund till att styret 2025 i stället minskade
  *antalet sammanträden* — ett ärende sajten redan bevakar.
- **`/2021/08/10/skriftlig-reservation-i-arendet-satofta-621/`** — ovanligt öppen text:
  "Ja vi Socialdemokrater har ändrat oss. Ibland kan och får man göra så även inom
  politiken." Handlar om detaljplan på mark som enligt köpeavtal skulle bevaras som
  grönområde.
- **`/2021/08/10/skriftlig-reservation-i-arendet-budget/`** — S:s budgetreservation
  2021, med belopp: 900 tkr till KAF för en socionomtjänst på fältet, 600 tkr till KS
  förfogandemedel för trygghetsskapande verksamhet, finansierat med 1,5 mnkr från
  avtalet med Ishallsbolaget, plus 2 mnkr till bredbandsutbyggnad. Här ligger ursprunget
  till dagens löfte om att återinföra fältsekreterare.
- **`/2021/03/18/…hoghastighetsbanan/`** — S sa **nej** till nya stambanor på de
  föreslagna sträckningarna 2021, med hänvisning till natur- och kulturvärden och den
  skyddade tysta miljön. I 2026 års program vill man i stället att stambanorna ska dras
  *i anslutning till* kommunens två tågstationer. Positionen har alltså rört sig, och
  det är den enda tydliga kursändringen i materialet.
- **`/2022/04/24/salj-inte-ut-vara-kommunala-hyresfastigheter/`** — nej till att sälja
  ut allmännyttan, nej till marknadshyror.

## Luckor

**Facebook-flödet går inte att räkna upp.** Partiets sida
(`facebook.com/socialdemokraternaihoor`, id `1379993262240982`) kräver inloggning:
direkt HTML-hämtning ger 1,5 kB inloggningsvägg, och `yt-dlp` svarar "Unsupported URL"
för sidan och för dess `/videos`- och `/reels`-flikar. Det är samma begränsning som
gällde när M:s reels hämtades 2026-08-16 — **enskilda inläggs-URL:er fungerar
fortfarande utmärkt**, det är bara uppräkningen av flödet som kräver en webbläsare.
För M löstes det genom att samla URL-listan manuellt i webbläsaren först. Samma sak
behöver göras för S om fler inlägg ska med; utan inloggad webbläsare vet vi inte ens
hur många inlägg partiet har.

Det som gick att läsa utan webbläsare är de fem senaste inläggen, som partiets
webbplats speglar i ett feed-widget på startsidan. Deras fulltext ligger i
`title`-parametern på sidans LinkedIn-delningslänkar. Widgeten anger bara relativa
datum ("1 week ago"), men exakta datum går att få ur `yt-dlp` för de inlägg som är
videor.

De fem inläggen:

| Permalänk | Datum | Innehåll |
|---|---|---|
| `…/posts/1571317451855635` | 2026-08-04 | "Sveriges bästa förskola börjar i Höör" — dubbelt så mycket som styret |
| `…/posts/1570440605276653` | 2026-08-03 | "10 satsningar för ett bättre Höör" — sammanfattning av programmet |
| `…/posts/1571684988485548` | — | Presentation av kandidater |
| `…/posts/1568671358786911` | — | Valstuga på byn med My Rosell |
| `…/photo.php?fbid=1572480858405961` | — | "Fråga oss vad du vill" — frågelåda under valrörelsen |

Förskole-videon är transkriberad med KB-Whisper; råtranskriptionen förvaras lokalt,
utanför det publika repot — samma bedömning som för M:s videor. Det
talade löftet är bredare än inläggstexten. Lucas Nilsson (S) säger "dubbelt så mycket
på mer resurser till förskolan **och skolan** än vad det borgerliga styret gör i dag",
medan inläggstexten bara nämner förskolan. Ståndpunktskortet i `partier.json` återger
båda formuleringarna.

**Regionmotioner utelämnade.** Två inlägg i april 2026 (mammografi livet ut,
personalsatsning i vården) är motioner till **Region Skåne**, inte till Höörs kommun.
De hör inte hemma på en sajt om kommunvalet och är medvetet inte inlagda.

**Nämndsidorna är inaktuella.** `/vara-politiker/`-sidorna listar uppdrag från
2020-11-16 och stämmer inte med dagens mandatperiod. De är inte använda som källa.
