# ORONMARKTA_POSTER_BACKFILL.md

> **KLART 2026-08-17** (commits `99a0bfa` + `91846f5`) — se TASK.md punkt 25.
> Alla belopp i avsnitt 3 kontrollräknades och stämde. Två avvikelser mot
> instruktionen: (1) `-lineprinter` splittrar bokstäverna på de här PDF:erna
> och duger inte som korskontroll — `-fixed 6` användes i stället; (2) 2026
> års protokoll fanns redan hämtat (`public/kallor/protokoll/Protokoll_KF_250611.pdf`,
> § 77, beslutspunkt 3 av 7), så Ciceron-steget i avsnitt 4 behövdes aldrig.

Instruktion för att backfilla de öronmärkta budgetposterna för budgetåren
**2023, 2024, 2025 och 2026**. 2027 är redan klart och fungerar som mall.

Skriven 2026-08-16. Läs `reference_pdf_extraction`-minnet innan du börjar, eller
åtminstone avsnitt 2 nedan — verktygsvalet är hela knuten.

---

## 1. Vad det handlar om

Höörs kommunfullmäktige fördelar inte bara nämndramar i budgetbeslutet. Det
beslutar samtidigt att fyra specifika pengapåsar **inte får användas till något
annat**. Beslutssatsen är ordagrant likalydande alla år:

> "Budgetramarna för ekonomiskt bistånd, gymnasiekostnader, bostadsanpassning
> samt badet får inte användas av respektive nämnd till andra kostnader."

Det är en egen beslutspunkt (punkt 3 av sex i 2027 års beslut) och den återkommer
**samtliga fem budgetår under mandatperioden** — kontrollerat, se avsnitt 4.

Beloppen står som `Varav`-rader i tabellen **Budgetramar** i respektive års
budgethandling. De är delposter *inom* nämndernas ramar och ingår alltså redan i
nämndsummorna. **De får aldrig läggas till som egna rader i nämndtabellen** — då
går summorna sönder.

### Varför det är värt att göra

Gymnasieposten är den stora: 107,2 mnkr för 2027, drygt en tredjedel av hela
kommunstyrelsens ram. Höörs kommun driver inga nationella gymnasieprogram
(verifierat mot `hoor.se/utbildning-barnomsorg/gymnasium/`), så pengarna köper
platser i andra kommuner. Ingenting av detta syns i en tabellrad som heter
"Kommunstyrelse".

Och trenden över mandatperioden går åt olika håll för olika poster — gymnasiet
uppåt, ekonomiskt bistånd nedåt. Det är precis den sortens sak sajten finns för
att visa, och den blir synlig först när alla fem åren ligger bredvid varandra.

---

## 2. Metod: `pdftotext -table`, inte `-layout`

`pdftotext` på den här maskinen är **Xpdf 4.00, inte poppler**. Det betyder:

- `-bbox-layout`, `-bbox` och `-tsv` finns inte. Bygg ingenting på dem.
- Read-verktyget kan **inte** öppna PDF:er här (`pdftoppm` saknas, likaså
  ghostscript och ImageMagick). Du kan inte "titta på sidan".
- `-layout` förvanskar de här tabellerna: radetiketter som radbryts glider ur
  fas mot sifferkolumnerna. En tidigare session drog slutsatsen att tabellen var
  omöjlig att extrahera och skrev in det i `budget.json` som ett permanent
  förbehåll. Det var fel — det var bara fel flagga.
- **`-table` läser dem rent.** `-lineprinter` och `-fixed <n>` är två helt andra
  algoritmer och duger som oberoende korskontroll.

```bash
pdftotext -table -enc UTF-8 <fil.pdf> - | grep -iE "^ *Varav|Kommunstyrelse"
```

### Kolumnkonventionen — den felkänsliga biten

Budgetramar-tabellen har fyra sifferkolumner:

| kolumn 1 | **kolumn 2** | kolumn 3 | kolumn 4 |
|---|---|---|---|
| föregående år | **budgetåret — den du vill ha** | VEP +1 | VEP +2 |

**Ta alltid kolumn 2.** Det är verifierat, inte antaget: kolumn 2:s
`Kommunstyrelse`-värde i varje handling stämmer exakt mot det redan verifierade
`namndfordelning_tkr.Kommunstyrelse` som ligger i `budget.json` för samma år
(229 926 / 241 624 / 268 177 / 286 380 / 298 373). Dessutom länkar åren ihop sig:
kolumn 1 i år N är identisk med kolumn 2 i år N−1.

**Använd alltid respektive års egen handling.** Senare handlingar räknar om
tidigare år. Exempel: badet budget 2025 står som 10 283 tkr i 2025 års egen
handling men som 10 531 tkr i 2026 års. Sajten följer genomgående principen
"varje års egen handling" — se `/om-urvalet/`.

---

## 3. Siffror jag redan extraherat

Uttagna med `-table`, kolumn 2. **Kontrollräkna dem, lita inte på dem** — till
skillnad från nämndramarna har `Varav`-raderna ingen summarad att stämma av mot,
så enda kontrollen är att extrahera om i ett andra läge (`-lineprinter`) och se
att det blir samma. Det tar en minut och bör göras.

Alla belopp i tkr.

| Budgetår | Gymnasieverksamhet | Ekonomiskt bistånd | Badet | Bostadsanpassning |
|---|---|---|---|---|
| 2023 | 94 914 | 12 000 | 8 253 | 1 636 |
| 2024 | 98 871 | 11 500 | 8 911 | 1 485 |
| 2025 | 99 743 | 10 311 | 10 283 | 1 490 |
| 2026 | 103 404 | 10 811 | 9 361 | 1 490 |
| 2027 ✅ | 107 177 | 9 011 | 9 579 | 2 012 |

Nämndtillhörighet (samma alla år): gymnasieverksamhet och bostadsanpassning
ligger inom **kommunstyrelsen**, ekonomiskt bistånd inom **socialnämnden**,
badet inom **nämnden för kultur, arbete och folkhälsa**.

---

## 4. Källfiler

**Budgethandlingar** (för beloppen), alla i `data/raw/budget/`:

| År | Fil |
|---|---|
| 2023 | `budget-2023-vep-2024-2025-forslag-ksau-221108.pdf` |
| 2024 | `budget-2024-vep-2025-2026-antagen-kf-2023-06-14-c2a7-77.pdf` |
| 2025 | `alliansens-forslag-till-budget-2025-vep-2026-2027-pub.pdf` |
| 2026 | `budget-for-ar-2026-med-verksamhetsplan-for-ar-2027-2028.pdf` |
| 2027 | `src/data/protokoll_ksf/budget2027/KS_forslag_budget2027.pdf` (sid. 41) |

**Protokoll** (för beslutssatsen). Kontrollerat att frasen "får inte användas"
finns i samtliga:

| Budgetår | Möte | Fil |
|---|---|---|
| 2023 | KF 2022-11-30 § 145 | `src/data/mejl kommunen/Kommunfullmäktige 2022-11-30 (2022-11-30 KF §145).pdf` |
| 2024 | KF 2023-06-14 § 77 | `src/data/mejl kommunen/Beslut-202201111-KSF-§ 77.pdf` |
| 2025 | KF 2024-06-19 § 75 | `public/kallor/protokoll/Protokoll_KF_240619.pdf` |
| 2026 | KF 2025-06-11 | **saknas som protokoll** — se nedan |
| 2027 | KF 2026-06-10 § 58 | `public/kallor/protokoll/Protokoll_KF_260610.pdf` |

⚠️ **2026 har inget skriftligt protokoll i repot.** Beslutssatsen finns bara i
webbsändningens undertexter, `src/data/transkriptioner/meeting_17.vtt` (sök på
"får inte användas av respektive"). Hämta hellre det riktiga protokollet för
KF 2025-06-11 via Ciceron-API:et — metoden med färdiga curl-anrop står i
`KALLLUCKOR-RAPPORT.md` avsnitt 1. Om det inte går: notera i datan att källan
för just 2026 är undertexter och inte protokoll. Blanda inte ihop det.

Notera också att beslutssatsen bör citeras **ordagrant ur respektive års
protokoll**, inte kopieras från 2027. Formuleringen har sett likadan ut men
paragrafnummer och punktnummer skiljer sig mellan åren, och punktnumret ("punkt
3 av sex") står utskrivet i den renderade texten.

---

## 5. Datastruktur

Följ 2027-posten i `src/data/budget.json` exakt (sök på `oronmarkta_poster`).
Fältet ligger direkt efter `namndfordelning_not` i varje beslutsobjekt:

```json
"oronmarkta_poster": {
  "beslutssats": "<ordagrant ur årets protokoll>",
  "beslutssats_kalla": "Kommunfullmäktige <datum>, § <nr>, beslutspunkt <n> (av <m>).",
  "poster_tkr": {
    "Gymnasieverksamhet": 0,
    "Badet": 0,
    "Ekonomiskt bistånd": 0,
    "Bostadsanpassningsbidrag": 0
  },
  "poster_namnd": {
    "Gymnasieverksamhet": "Kommunstyrelsen",
    "Badet": "Nämnden för kultur, arbete och folkhälsa",
    "Ekonomiskt bistånd": "Socialnämnden",
    "Bostadsanpassningsbidrag": "Kommunstyrelsen"
  },
  "summa_tkr": 0,
  "not": "...",
  "not_kalla": "...",
  "aterkommande": "..."
}
```

`summa_tkr` måste vara summan av `poster_tkr`. Kontrollera i Node:

```bash
node -e "
const d=JSON.parse(require('fs').readFileSync('src/data/budget.json','utf8'));
d.beslut.filter(b=>b.oronmarkta_poster).forEach(b=>{
  const o=b.oronmarkta_poster;
  const s=Object.values(o.poster_tkr).reduce((a,c)=>a+c,0);
  console.log(b.ar, s===o.summa_tkr?'OK':'FEL '+s+' != '+o.summa_tkr);
});"
```

---

## 6. Renderingen måste byggas om

Det här är den enda delen som kräver riktigt arbete, inte bara datainmatning.

Blocket på `/budget/` är i dag **hårdkodat till 2027** — se `src/pages/budget/index.astro`,
konstanterna `oronmarkta` / `oronmarktaSorterad` i frontmattern och `.oronmarkta`-blocket
efter nämndtabellen. CSS ligger i `src/styles/global.css` (sök `.oronmarkta`).

När alla fem åren finns bör blocket bli **en tabell med åren som kolumner**, i
samma form som nämndtabellen ovanför — trenden är hela poängen och den syns inte
i fem separata textblock. Behåll beslutssatsen som citat ovanför tabellen, men
citera då den senaste och notera att lydelsen återkommit varje år, i stället för
att upprepa fem nästan identiska citat.

Kontrollera efteråt att båda dessa fortfarande stämmer:

- beloppen ligger **inte** som rader i `namndRader` (nämndtabellens summor ska
  vara orörda)
- texten säger fortfarande uttryckligen att beloppen ingår i nämndramarna och
  inte ska adderas

---

## 7. Innan du börjar

- Kolla att `budget.json` inte redan hand-editerats — Jonas redigerar datafilerna
  direkt själv.
- Flera sessioner kan köra samtidigt. Commita bara dina egna filer, aldrig
  `git add -A`. `TASK.md`, `KOLADA_PLAN.md` och Kolada-spåret ägs av en annan
  session — rör dem inte.
- Dev-servern körs i bakgrunden (`astro dev status`). Den låser
  `node_modules/.vite/deps`, så `astro build` kan faila med `EBUSY`. Verifiera
  mot `http://localhost:4322/budget/` med curl i stället, eller stoppa servern
  först.
