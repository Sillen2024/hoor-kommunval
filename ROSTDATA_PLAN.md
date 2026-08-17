# ROSTDATA_PLAN.md — punkt 19 (D4 i sin helhet)

**Skapad:** 2026-08-16
**Gäller:** TASK.md punkt 19 — röstdata på ärenden, 12–15 ärenden totalt
**Status:** KLAR 2026-08-16. Urvalet i §4 godkändes av Jonas samma dag och samtliga etapper (0–3 + följdändringarna i §5.5) är genomförda och committade — se TASK.md punkt 19 för sammanfattningen. Dokumentet behålls som referens för datamodellen (§5.1) och för de 13 verifierade men oanvända voteringarna (§4, slutet).
**Läs också:** `KALLLUCKOR-RAPPORT.md` §1 (Ciceron-API:et), `OPUS_GRANSKNING_2026-08-15.md` §D4

---

## 1. Vad problemet är

`src/data/arenden.json` innehåller 9 ärenden och **inget enda `rostning`-fält**.
Instruktionen (`hoor-kommunval-2026-instruktion.md`) kräver 10–15 ärenden och att
partisidorna visar partiets röstning i track record-ärenden. `/partier/[id]/` kan
därför inte visa något track record alls i dag — den visar bara ärenden där
partiet står som förslagsställare, matchat på textsträng.

Dessutom är fyra av de nio ärendena motiverade med att "mötesportalen inte går att
läsa av automatiskt". Den motiveringen är osann sedan 2026-08-12.

---

## 2. Etapp 0 — KLAR 2026-08-16. All röstdata är hämtad och verifierad.

Samtliga 27 KF-protokoll 2023-05-24 → 2026-06-10 är hämtade ur Ciceron-portalen
och **31 voteringar med namngiven röstlängd** är utparsade per parti.

### Verktygen ligger i repot

| Fil | Vad den gör |
|---|---|
| `scripts/hamta-protokoll.py` | Hämtar alla KF-protokoll + protokollsbilagor (reservationer, yrkanden) via Ciceron-API:et till en arbetsmapp utanför repot |
| `scripts/parsa-voteringar.py` | Parsar ut varje votering med röstsiffror, beslutsordning (JA=/NEJ=) och namngiven röstlängd per parti |

Körordning:

```bash
python scripts/hamta-protokoll.py                    # -> %TEMP%/hoorprot, ~28 MB PDF
cd "$TEMP/hoorprot" && mkdir -p txt
for f in pdf/*.pdf; do pdftotext -table -enc UTF-8 "$f" "txt/$(basename "$f" .pdf).txt"; done
python scripts/parsa-voteringar.py                   # -> voteringar.json + rapport.txt
```

`-table` är nödvändigt: `pdftotext` i den här miljön är Xpdf, inte poppler.

### Resultatet ligger i repot — du behöver inte köra om något

| Fil | Innehåll |
|---|---|
| `src/data/protokoll_ksf/voteringar_kf.json` | 31 voteringar, maskinläsbart, med `per_parti`-sammanställning och fullständiga namnlistor |
| `src/data/protokoll_ksf/voteringar_rapport.txt` | Samma sak som läsbar text — **läs den här först**, den är hela beslutsunderlaget för etapp 1 |
| `src/data/protokoll_ksf/kf_moten.json` | De 27 sammanträdena, `id` → datum. `id` är Ciceron-portalens sökindex och används av båda skripten |

PDF:erna är medvetet **inte** incheckade (28 MB). Kör `hamta-protokoll.py` igen om
de behövs — API:et är oautentiserat och svarade stabilt 2026-08-16.

### Kvalitetskontrollen som gäller

`parsa-voteringar.py` jämför antalet namngivna ledamöter mot protokollets egna
röstsiffror och flaggar avvikelser med `<-- KOLLA`. **Vid körningen 2026-08-16 var
det 0 avvikelser på 31 voteringar.** Om en framtida körning flaggar något är det
parsern som är fel, inte protokollet — fixa den innan datan används.

Två fallgropar som redan är lösta och som lätt återintroduceras:
- Regexen för att avgränsa NEJ-listan måste vara `ledam\w+`, inte `ledamo\w+`.
  Plural heter "ledamöter" och har inget o.
- När en paragraf har flera omröstningar räknas **alla** beslutsordningar upp
  före det första omröstningsresultatet. De måste paras ihop i dokumentordning,
  annars får kontrapropositionen huvudvoteringens JA=/NEJ=-text.

---

## 3. Etapp 1 — rätta och komplettera de nio befintliga ärendena

**Detta är inte "lägg till en detalj". Två av ärendena har fel datum i dag.**

### 3.1 Fri kollektivtrafik 70+ — fel datum, och den bästa historien på sajten

`arenden.json` har `datum: "2025-10-14"`. Det är Skånska Dagbladets
publiceringsdatum, inte beslutsdatumet.

Protokollet: **KF 2025-08-27 § 99**, "Motion: Seniorkort för fri kollektivtrafik
för alla över 70 år – Kent Staaf (S), Olle Krabbe (V), Roger Orwén (MP)".

- Utfall **19–19**. Ordföranden Anders Netterheim (M) hade utslagsröst enligt
  kommunallagen 5 kap. 56 § och motionen avslogs.
- **Sverigedemokraterna sprack: 3 ja, 6 nej.** Sex av nio SD-ledamöter röstade med
  oppositionen för motionen. Det är enda gången i hela materialet som SD:s grupp
  delar sig så jämnt i en avgörande fråga.
- Voteringen är protokollförd i ett avvikande format — namn för namn med "- JA" /
  "- NEJ" i stället för tre samlade listor. Parsern hanterar det, men om någon
  läser protokollet för hand: det ser inte ut som de andra.

Sammantaget: reformen föll på en enda röst, ordförandens, trots att en majoritet
av de närvarande SD-ledamöterna ville ha den — och togs sedan in i styrets egen
budget 2027 mindre än ett år senare. Ärendets `urvalsmotivering` säger redan att
blockgränserna inte är fasta; nu finns siffrorna som bevisar det.

### 3.2 Minskat antal sammanträden — det var två beslut, inte ett

`arenden.json` har `datum: "2024-09-25"` och "paragraf ej oberoende verifierad".
Verkligheten är ett tvåstegsförlopp:

1. **KF 2024-09-25 § 111** — oppositionen begärde återremiss. JA = ärendet avgörs
   idag, NEJ = bifall till Kent Staafs (S) återremissyrkande. **24–15**, alltså
   återremiss, eftersom minoritetsåterremiss bara kräver en tredjedel (14).
2. **KF 2024-11-06 § 129** — ärendet kom tillbaka och avgjordes. JA = KS förslag,
   NEJ = Kent Staafs (S) yrkande. **26–13.** SD sprack lätt: 7 ja, 2 nej.

Det är ett rent skolexempel på minoritetsåterremiss som ordlistan redan förklarar,
och det bör kopplas dit.

### 3.3 Rivning av Kvarnen/Magasinet — röstsiffror finns nu

`arenden.json` säger "paragraf och röstsiffror ej oberoende verifierade" och
använder undantagsvis SkD som huvudkälla. Protokollet: **KF 2025-12-17 § 148,
"Rivning av Magasinet (Bävern 10)"**, **29–6–4**.

**Socialdemokraterna sprack i tre delar**: 4 ja, 1 nej, 3 avstod. Även M sprack —
Tom Ström avstod. Det är den mest splittrade voteringen i materialet och gör
ärendet mycket starkare än den nuvarande neutrala beskrivningen.

Byt huvudkälla från SkD till protokollet. SkD-artikeln kan stå kvar som kontext.

### 3.4 Samverkansavtal räddningstjänst/VA — paragrafer finns nu

**KF 2024-05-22 § 58** (räddningstjänst) och **§ 59** (vatten och avlopp). Inga
voteringar. Ta bort "paragraf ej verifierad"-brasklappen ur `datum_not`.

### 3.5 Ringsjöskolan — beslutsdatumet är hittat, `datum: null` kan fyllas

Det här stänger den öppna luckan från punkt 17.

**KF 2024-05-22 § 62 "Renovering av Ringsjöskolan"**, dnr KSF-2022-00486. Beslutet:
HFL AB får investeringsgodkännande, maximal hyresnivå **15,9 mnkr/år** godkänns,
kommundirektören får teckna hyresavtal. Ingen votering — Johan Svahnberg (M) **och**
Stefan Lissmark (S) yrkade båda bifall.

Två saker att vara noggrann med:
- Sajten säger i dag "budget på ca 130 miljoner" med Höörfast som källa. Protokollet
  talar inte om 130 mnkr utan om hyresnivå. Behåll 130-siffran med Höörfast som
  källa, men skriv inte om det som om protokollet belade den.
- Protokollet nämner att projekteringskostnader om ca 9 mnkr hade belastat
  resultatet 2024 om fullmäktige sagt nej. Värt att ta med — det förklarar varför
  beslutet var enigt.

Ersätt `datum_not` (som i dag säger att antagandedatumet inte kunnat verifieras)
med paragrafhänvisningen.

### 3.6 De tre återstående

Miljö- och klimatstrategin (2023-10-11 § 108), riktlinjer för bostadsförsörjning
(2025-03-12 § 23) och handbollsakademin (2024-01-31) har inga voteringar i
protokollen. Handbollsakademins `datum_not` säger att förslagsställaren inte kunnat
verifieras — det går sannolikt att lösa via `ReadObjectDetails` på möte id 20, men
det är lågt prioriterat.

"Höör saknar medborgarförslag" har inget kommunalt beslut alls och ska förbli utan
röstdata. Det är korrekt som det står.

---

## 4. Etapp 2 — sex nya ärenden (ger 15 totalt)

Urvalet nedan är **föreslaget men inte godkänt av Jonas** — det var frågan som
låg öppen när arbetet pausades 2026-08-16. Alla siffror är verifierade.

Prioritetsordningen är medveten: de tre första är de enda dokumenterade tillfällena
under mandatperioden då **minoritetsstyret faktiskt förlorade en votering**. Det är
den mest konkreta illustration av "17 av 41 mandat" som finns i materialet, och
den motiverar hela `/styret-vs-oppositionen/`-sidans premiss.

### 4.1 Reglemente för kommunstyrelsen — KF 2023-05-24 § 60 — **17–24, styret förlorade**

JA = KS förslag. NEJ = bifall till Stefan Lissmarks (S) yrkande.
Styrets 17 mot 24: hela oppositionen (S 8, V 3, MP 2) **plus SD 9 plus MED 2**.
Blockdisciplinen är total på båda sidor — det här är styret mot alla andra.

### 4.2 Kommunfullmäktiges mål 2024–2027 — KF 2023-06-14 § 76 — **22–17–2, SD:s yrkande vann**

JA = bifall till Stefan Liljenbergs (SD) yrkande. NEJ = avslag.
S (8), V (3) och MP (2) röstade **för SD:s yrkande** mot styret. MED avstod.
Fullmäktiges egna mål för mandatperioden sattes alltså mot styrets vilja.

### 4.3 Borgensram HFB AB 2026 — KF 2025-06-11 § 68 — **15–21–3, styret förlorade mot sin egen ledamot**

JA = KS förslag. NEJ = bifall till **Lars-Håkan Perssons (M)** yrkande.
M sprack 9–1: Persson röstade mot sin egen kommunstyrelses förslag och vann, med
S, V, MP och SD bakom sig. **Johan Svahnberg (M) och Nino Dervisagic (M) lämnade
skriftlig reservation** — kommunstyrelsens ordförande reserverade sig mot ett
beslut som drivits igenom av en partikamrat.

Reservationen finns som PDF, `Protokollsbilaga KF 250611 - 68 RESERVATION Johan
Svahnberg (M) och Nino Dervisagic (M)`. Hämta den och publicera under
`public/kallor/reservationer/` — den bör läsas innan ärendet skrivs, så att
beskrivningen blir rättvis mot båda M-leden.

### 4.4 MP:s fråga om frivillig återvandring fick inte ställas — KF 2026-02-04 § 5 — **22–15**

JA = Miljöpartiets fråga får **inte** ställas. NEJ = frågan får ställas.
**Centerpartiets båda ledamöter röstade mot styret** och ville tillåta frågan. En
SD-ledamot likaså. Fullmäktige röstade alltså bort en interpellationsfråga.

Det här hör ihop med det befintliga ärendet om avsaknaden av medborgarförslag och
med Svahnberg-citatet — samma tema, men med protokollförd omröstning i stället för
en tidningsledare. Länka ihop dem.

### 4.5 Motion om språktester inom vård och omsorg — KF 2026-02-04 § 14 — **27–9–1**

SD:s egen motion (Emma Öster), avslagen. SD 8 nej + MED 1 nej mot alla andra 27.
V sprack (2 ja, 1 avstod). Balanserar urvalet: här är SD ensamt isolerat, till
skillnad från §§ 60 och 76 där SD fällde avgörandet tillsammans med oppositionen.

### 4.6 VA-taxan — KF 2023-10-11 § 104 (**25–16**) och KF 2024-09-25 § 109

2023: JA = KS förslag, NEJ = SD:s förslag. **S röstade med styret** mot SD.
V, MP, SD och MED emot.
2024: två voteringar. Först 18–19–3 om debatten skulle fortsätta, sedan **30–9** om
återremiss enligt Johan Svahnbergs (M) eget yrkande — SD ensamt emot.

Direkt plånbokspåverkan, och visar att S och SD inte är utbytbara oppositionsroller.

### Vad som INTE valdes, men finns i `voteringar_rapport.txt`

Ytterligare 13 voteringar är verifierade och oanvända: motionerna om arbetsskor
(2026-06-10 § 66), offentlig toalett i Tjörnarp (2026-04-22 § 46), skolan och
ungdomsföreningarna (2025-11-05 § 137), granskning av Höörs Handelsklubb
(2025-04-23 § 56, MED röstade med oppositionen), vind- och regnskydd samt
kostnadsfria valbodar (båda 2025-03-12), 4 Day Week (2024-09-25 § 114),
kompetensförsörjningsplan (2024-08-28 § 100), Gudmuntorps skola (2025-10-01 § 113,
kopplar till M:s Facebook-material), AV Media Skåne (2024-06-19 § 80),
uthyrningstaxan (2024-06-19 § 81), partistödet (2023-10-11 § 106) och revideringen
av bolagskoncernens styrdokument (2026-02-04 § 11, SD sprack 4–4).

Budgetvoteringarna 2024-06-19 § 75, 2023-06-14 § 77, 2026-06-10 § 58 och
2025-01-29 § 5 ligger redan i `budget.json` och ska **inte** dubbleras in i
`arenden.json`.

---

## 5. Etapp 3 — datamodell och rendering

### 5.1 Datamodell

Lägg `rostning` som en **array** direkt på ärendet i `arenden.json`. Array, inte
objekt, eftersom flera ärenden har två voteringar (kontraproposition + huvudfråga,
återremiss + sakfråga).

```json
"rostning": [
  {
    "datum": "2025-12-17",
    "paragraf": "§ 148",
    "fraga": "Ska Magasinet rivas?",
    "ja_betyder": "Bifall till kommunstyrelsens förslag till beslut.",
    "nej_betyder": "Avslag på kommunstyrelsens förslag till beslut.",
    "ja": 29, "nej": 6, "avstar": 4,
    "utfall": "Bifall. Byggnaden rivs.",
    "per_parti": {
      "m": { "ja": 10, "nej": 0, "avstar": 1 },
      "s": { "ja": 4, "nej": 1, "avstar": 3 }
    },
    "kalla_protokoll": "/kallor/protokoll/KF_251217_par148.pdf"
  }
]
```

Fyra saker att inte slarva med:

- **`fraga` är redaktionell, `ja_betyder`/`nej_betyder` är ordagranna ur
  protokollet.** Blanda inte ihop dem. Beslutsordningen är ofta kontraintuitiv —
  i § 5 om MP:s fråga betyder JA att frågan *inte* får ställas. Renderas bara
  siffror utan beslutsordning blir sajten direkt vilseledande.
- **Partinycklarna måste matcha `partier.json`:s `id`.** Parsern använder
  protokollens förkortningar (`M`, `MED`, …). Kontrollera mappningen, särskilt
  `MED` → `medborgerlig-samling`.
- **`per_parti` ska bara innehålla partier som deltog.** Frånvaro är inte
  detsamma som att avstå, och får inte renderas som en nolla.
- Källan ska vara den publicerade PDF:en under `public/kallor/protokoll/`, inte en
  sökväg i `src/data/` — punkt 12 i TASK.md städade bort de interna sökvägarna och
  de får inte smyga tillbaka.

### 5.2 Publicera protokollen

`public/kallor/protokoll/` innehåller i dag bara `Protokoll_KF_240619.pdf` och
`Protokoll_KF_260610.pdf`. Lägg dit de protokoll de valda ärendena hänvisar till,
och de reservationer som citeras (särskilt Svahnberg/Dervisagic-reservationen i
4.3). Följ namngivningen i `public/kallor/reservationer/`:
`reservation_<parti>_<yymmdd>_par<nr>.pdf`.

Filerna är ~700–900 kB styck. Publicera bara dem som faktiskt länkas.

### 5.3 `/arenden/`

Rendera en voteringstabell per ärende, under `resultat`-raden i den befintliga
`<table>`. Måste visa beslutsordningen, inte bara siffrorna — se varningen ovan.
Ärenden utan `rostning` ska se ut precis som i dag; komponenten får inte lämna
tomma rubriker efter sig.

### 5.4 `/partier/[id]/` — själva poängen med punkten

Ny sektion "Så har {parti} röstat" som går igenom alla ärenden med `rostning` och
visar partiets rad. Det är den här sektionen som saknas helt i dag och som
instruktionen kräver.

Lyft partisplittringarna särskilt — de är det mest informativa i hela materialet:

| Parti | Sprack i |
|---|---|
| SD | Seniorkort 70+ (3–6), bolagskoncernens styrdokument (4–4), sammanträdesplanering 2025 (7–2) |
| S | Rivning av Magasinet (4 ja, 1 nej, 3 avstod) |
| M | Borgensram HFB (9–1), Magasinet (Tom Ström avstod) |
| C | MP:s fråga om återvandring (båda mot styret) |
| V | Språktester (2 ja, 1 avstod) |

Ett parti som röstat likadant varje gång ska också synas som just det — total
gruppdisciplin är en upplysning om partiet, inte frånvaro av data.

### 5.5 Följdändringar

- `arenden.json:3` (`urvalskriterier_not`) påstår fortfarande att mötesportalen
  inte går att läsa av automatiskt. **Stryk hela den brasklappen** — den är osann
  sedan 2026-08-12 och undergräver alla andra begränsningsreservationer på sajten.
- `exkluderade_kandidater_not` säger att listan omfattar 9 ärenden i stället för
  10–15. Skriv om när antalet ändras.
- Samma not utesluter V:s motion om budgetramar (5:2) med hänvisning till mötena
  2023-10-11 och 2023-12-06. **Båda protokollen är nu hämtade.** Sök igenom
  `txt/23_*` och `txt/21_*` efter motionen innan noten skrivs om — antingen tas
  ärendet in, eller så byts uteslutningsskälet mot det ärliga.
- `/om-urvalet/` beskriver de tekniska begränsningarna. Uppdatera i takt med att
  brasklapparna försvinner.
- Ordlistan har redan `minoritetsåterremiss`, `kontraproposition`, `votering` och
  `acklamation` med Höör-exempel. Sammanträdesplaneringen (3.2) är ett bättre
  exempel på minoritetsåterremiss än det som står där nu.

---

## 6. Ordning att jobba i

1. Få urvalet i avsnitt 4 godkänt av Jonas. **Det var här arbetet pausades.**
2. Etapp 1 (avsnitt 3) — rätta de nio befintliga. Commit.
3. Datamodell + `/arenden/`-rendering på de rättade nio. Commit.
4. Etapp 2 (avsnitt 4) — de nya ärendena, ett i taget. Commit per ärende.
5. `/partier/[id]/`-sektionen. Commit.
6. Följdändringarna i 5.5. Commit.
7. Kryssa av punkt 19 i TASK.md.
