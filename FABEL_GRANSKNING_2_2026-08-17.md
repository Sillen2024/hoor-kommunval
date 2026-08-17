# Fabels andra genomgång — full revision med fokus på UI/UX och målgruppen

**Datum:** 2026-08-17 (andra passet, efter att första granskningens åtgärder genomförts)
**Granskare:** Claude Fable 5
**Underlag:** Samtliga 29 byggda sidor i `dist/` (byggd 2026-08-17), källkoden i `src/pages/` och `src/components/`, `global.css`, datafilerna, `TASK.md`. Allt mätbart är mätt: LIX per sida (`scripts/lix.mjs`), länk- och ankarkontroll på hela byggda sajten, blockräkningar per sida. Målgruppsbedömningen utgår från redaktionsregel 10: en klok granne som aldrig läst ett protokoll.

---

## Sammanfattning

**Förra granskningens recept är genomfört, och det syns.** Startsidan har gått från LIX 42 till 35 och öppnar nu med tre nyckelfynd i callout-form. Nyckeltalssidan är vänd — förskolefyndet först, metoden i veck. Menyn är 8 poster, Ciceron finns bara på Om urvalet, "kurerad" är borta (utom ett ställe), käll-URL:erna har etiketter, emoji-ikonerna är borta, dubbelfrågorna i valkompassen är delade, alla fem småfelen i §8 är rättade. Dessutom har tre av de saknade sidorna byggts: `/sa-rostar-du/` (LIX 43 — bäst av de nya), `/vad-bestammer-kommunen/` och Vägvals-mönstret på både `/nyckeltal/` och `/budget/`. Länkkontrollen ger **0 trasiga interna länkar, 0 trasiga ankare, 0 saknade käll-PDF:er** på hela sajten.

**Det som återstår är litet men konkret.** Ett stale sakpåstående i läsartext ("listan omfattar 15 ärenden" — den omfattar 35), en sida som helt missades i första städningen (`/historiska-val/` — sajtens sista försvarsskrift, med JSON-fältnamn i läsartext), och en handfull UI-detaljer som märks mest på mobil. Inget av det tar mer än en arbetsdag sammanlagt.

---

## 1. Kvitto: vad från första granskningen som är verifierat genomfört

Uppmätt i byggd HTML 2026-08-17, inte avläst ur TASK.md:

| Åtgärd | Status | Belägg |
|---|---|---|
| Ciceron-städningen 7 sidor → 1 | ✅ | grep: enda träffen i läsartext är `/om-urvalet/` |
| "Kurerad" bort | ⚠️ nästan | 0 träffar utom **404-sidans kort** ("Kurerad lista över beslut…") |
| Meny 11 → 8, AI till sidfoten | ✅ | Huvudmenyn: Start · Din vardag · Partierna · Jämförelse · Styret vs opp · Budget · Nyckeltal · Så röstar du |
| Startsidan: Tre saker som sticker ut + kortens språk + bantad trust-note | ✅ | LIX 35; korten är läsarfrågor; callouts läser talen ur datafilerna |
| Nyckeltal vänd: fynd först, legend, licensraden 12 → 1 | ✅ | Lead öppnar med förskolefyndet (villkorad på datan); derived-notes 12 → 6 |
| 41-prickarsfiguren | ✅ | `.mandatprickar`, mandaten läses ur `partier.json`, `role="img"` + aria-label |
| "Din hundralapp" på budget | ✅ | `#din-hundralapp` med staplar, uträknad ur nämndramarna 2027 |
| 80-öressänkningens årskostnad | ✅ | ~39 mnkr/år, källbelagd mot resultaträkningens egen rad, uppräkningen märkt som egen bearbetning |
| Budgetens årsbeslut i `<details>` | ✅ | Alla fem åren fällbara under `#arsbeslut` |
| Ärendekortens tudelning | ✅ | "Vad hände" 2 meningar + "Hela förloppet" i veck; "Omdiskuterat"-märkning med utskriven mekanisk grund |
| Valkompassens dubbelfrågor | ✅ | `sankt-skatt`, `ishall`, `personaltathet`, `bilism` är nu en proposition var |
| M-bannern på /jamforelse/ | ✅ | Datadriven på `manifest_status`; ersatt-förklaringen renderas alltid, även på /din-vardag/ |
| Käll-URL:er i fulltext → etikett | ✅ | `kalla_titel` med fallback "Källa →" |
| Emoji på Din vardag | ✅ | 0 träffar |
| §8: 11/12 frågor, −28,6-öppningen, "dubbla förskolepengen", väljarfråga 3, M-bannern | ✅ alla fem | 11 överallt (läses ur datan); väljarfråga 3 har riksdagsmarkering; S-löftet omformulerat till citatet "dubbelt så mycket på förskolan…" |
| `/sa-rostar-du/` | ✅ | LIX 43, svaret först, trösklarna uträknade ur `historiska_val.json` |
| `/vad-bestammer-kommunen/` | ✅ | Byggd, i sidfoten, länkad från valkompass-sammanhangen |
| Vägvalet som mönster | ✅ | `/nyckeltal/` (förskolan, inkl. opinionsraden) och `/budget/` (skatten) |

**Länk- och ankarkontroll (ny mätning):** alla interna länkar, alla `#`-ankare och alla `/kallor/`-PDF:er på samtliga 29 sidor kontrollerade maskinellt — noll fel.

---

## 2. Nya fel — rätta före lansering

### 2.1 Stale siffra i läsartext: "listan omfattar 15 ärenden" (viktigast)

`arenden.json` → `exkluderade_kandidater_not` säger: *"…listan omfattar 15 ärenden, vilket fyller instruktionens ram om 10-15."* Noten renderas i sin helhet som banner längst ned på `/arenden/` — en sida vars egen summering tre skärmar ovanför säger **35 ärenden**. Det är exakt den sortens motsägelse sajten finns till för att slå ned på hos andra.

Samma banner har två följdproblem: den är ~1 500 tecken lång i löptext (längst av sajtens alla banners), och "instruktionens ram" är byggarspråk — läsaren vet inte vilken instruktion. **Åtgärd:** skriv om noten till 2–3 meningar i läsarens värld ("Varför är V:s budgetmotion inte med? Budgetramarna täcks redan av budgetgenomgången…"), utan antalsuppgift som kan ruttna, eller läs antalet ur datan.

### 2.2 `/historiska-val/` — sidan som städningen missade

Första granskningen avfärdade den med "fungerar". Vid närläsning är den sajtens sista sida skriven för granskaren i stället för grannen:

- **JSON-fältnamn i läsartext:** "se `kalla_mandat` i `partier.json`" och "se `resultat_not` per år" — läsaren kan inte se de fälten. Bryter regel 6 rakt av.
- **Inledningen säger samma sak två gånger:** lead-stycket och banner-stycket upprepar båda "röster och röstandelar, inte bara mandat".
- **Hela mandatkontrollen står i löptext** ("M 11, SD 9, S 8 … totalt 41, vilket stämmer") — det är byggarens avstämningsprotokoll, inte läsarinnehåll. Flytta till `<details>` eller Om urvalet.
- Mätt: LIX 55, 5 öppna not-boxar på 575 ord — sämst förhållande innehåll:apparat på sajten nu.

**Åtgärd:** samma vändning som nyckeltal fick. Svaret först ("Så röstade Höör 2022 — och så flyttades makten": M +7,3 procentenheter, L −8,4 är en berättelse i sig), tabellerna direkt, all metod i ett veck. Sidan är liten; det är en timmes arbete.

### 2.3 Regel 5-överträdelser: två Om urvalet-länkar i brödtext

Max en per sida utöver sidfoten. Fyra sidtyper har två: `/budget/` (bannern + Kolada-stycket), partisidorna S/V/MP (track record-noten + budgetförslagsstycket), `/ratta/`, `/om/`. Behåll den som bär mest, gör den andra till vanlig text.

### 2.4 Småfel

| # | Fel | Var | Åtgärd |
|---|---|---|---|
| 1 | "Kurerad lista över beslut…" | 404-sidans Ärenden-kort | "Ett urval beslut…" — samma text som startsidans kort |
| 2 | KS-metodstycket står två gånger på Om urvalet | En gång ur `arenden.json:urvalskriterier_not`, en gång i sidans egen paragraf (rad ~169) | Låt sidans egen paragraf vara huvudtexten; korta JSON-noten till en hänvisning |
| 3 | Sidfoten länkar "Rätta en uppgift", "Om urvalet" och "AI-experimentet" dubbelt (först i löptexten, sen i menyn) | `Layout.astro` | Medvetet? Skärmläsare läser upp båda. Överväg att låta löptexten vara utan länk där menyn redan har den |
| 4 | `trygghet-migration` är fortfarande en dubbelfråga ("restriktiv migrationspolitik **och** hårdare straff") | `valkompass.json` | Lägre prioritet än de fyra som delades — båda leden är SD-profil och nationell-markerade — men samma logik gäller |

---

## 3. UI/UX — det som märks för målgruppen

### 3.1 `/arenden/`: filtret upptäcks inte (största UX-fyndet)

Sidan har vuxit 15 → 35 ärenden (10 344 ord, 172 KB — sajtens tyngsta) och bär det förvånansvärt väl: index, sticky filter, tudelade kort. Men **filterraden ligger i DOM efter det 35 rader långa indexet**. En läsare som landar på sidan ser rubrik → summering → 35 indexrader, och upptäcker först därefter att det går att filtrera. Filtret filtrerar redan indexraderna — flytta det ovanför indexet så gör det sitt jobb från början. (Sticky-beteendet gör resten.)

**Sekundärt, samma sida:** indexet saknar årsgruppering. 35 rader med datum i löpande följd är svåra att skumma; en tunn årsrubrik (2026 / 2025 / 2024 / 2023) gör listan skannbar utan att ändra något annat.

### 3.2 Skip-länk saknas (enda kvarvarande a11y-luckan)

Varje sida börjar med logga + 8 menylänkar innan `<main>`. En tangentbords- eller skärmläsaranvändare tabbar genom alla på varje sidladdning. En rad i `Layout.astro` (`<a class="skip-link" href="#main">Hoppa till innehållet</a>` + `id` på main) löser det. I övrigt är tillgänglighetsnivån ovanligt god: `scope` på alla tabeller, `aria-pressed` på filterknappar, `role="img"` med aria-label på prickfiguren, `aria-live` på filterstatus, synlig fokusram via webbläsarens default.

### 3.3 Tre tabeller utan `.table-scroll`

`budget/index.astro:237` (80-öres-tabellen, 4 kolumner), `budget:367` (nettokostnader) och `historiska-val:25/41` (4 kolumner) ligger utan scroll-container. Med `width:100%` pressas de ihop i stället för att svämma över, men 80-öres-tabellen är på gränsen vid 320–360 px. Wrappa för säkerhets skull — mönstret finns redan överallt annars.

### 3.4 `/valkompass/` är föräldralös

Noll interna länkar pekar dit (alla går till `/#valkompass`). Sidan är uppenbart byggd som delnings-/sök-landningssida ("Höör valkompass 2026", egen OG-bild) — det är ett legitimt syfte, men då bör det stå i en kodkommentar så nästa session inte "städar bort" den. Alternativt: låt `/sa-rostar-du/` och sidfoten peka på `/valkompass/` i stället för `/#valkompass` — då får delningssidan intern kraft och läsaren en sida med mindre brus omkring kompassen.

### 3.5 Om urvalet saknar fortfarande innehållsförteckning

Utlovad i första granskningen (§4). Sidan är nu 3 938 ord och elva h2 — och har dessutom blivit mottagare av allt som flyttats från andra sidor, precis som planerat. `/nyckeltal/` har redan `sidnav`-mönstret; kopiera det. Sidfotens "Källor"-länk pekar på `#kallor` längst ned — utan TOC är det enda sättet att navigera sidan att skrolla.

### 3.6 Det som är bra och ska ligga kvar (bekräftat i denna genomgång)

- **`/sa-rostar-du/`** är sajtens bästa nya sida: svaret i lead ("Ta med legitimation. Mer än så krävs inte."), personröstsexemplet räknat ur valdatan, ambulerande röstmottagare med telefonnummer. Rör inte.
- **Vägvals-blocken** (nyckeltal, budget) gör exakt det §3 i förra granskningen bad om — Läget/Pengarna/Alternativen/Handlingen/Frågan, allt datadrivet, opinionsraden källbelagd.
- **Hundralappen** med staplar, **mandatprickarna**, **nyckelfynd-callouterna** — sajten *visar* nu sina fynd.
- **Ärendekortens form**: resultatetikett → två meningar → veck. Förhållandet innehåll:apparat är åtgärdat.
- Sortering med utskriven grund överallt ("nyast först", "störst avvikelse först", "störst belopp överst") — regel 7 efterlevs konsekvent.

---

## 4. LIX-läget: var gränsen på 45 faktiskt bryts — och var mätaren lurar

Uppmätt på byggd HTML (`<main>`, sidhuvud/sidfot exkluderade):

| Kategori | Sidor | Bedömning |
|---|---|---|
| **Egen prosa, under målet** | `/` 35, `/ratta/` 36, `/om/` 43, `/sa-rostar-du/` 43, `/valkompass/` 43, `/ai/` 43 | Klart. Notera att sajtens viktigaste sidor nu är dess mest lättlästa. |
| **Egen prosa, över målet — äkta problem** | `/historiska-val/` 55 | §2.2 ovan. |
| **Egen prosa, över målet — mätartefakt** | `/vad-bestammer-kommunen/` 53 | 287 ord där tabellcellerna ("kommunfullmäktige", "Bostadsplanering") dominerar ordlängden. Prosan i sig är enkel. Ingen åtgärd — men se metodnoten nedan. |
| **Blandat, nära målet** | `/ordlista/` 47, `/styret-vs-oppositionen/` 48, `/nyckeltal/` 48 | Facktermerna är själva innehållet (ordlistan definierar dem). Acceptera 45–50 här; en sista genomläsning med kortare meningar räcker. |
| **Citatdominerat** | partisidorna 51–58, `/jamforelse/` 58, `/din-vardag/` 59, `/budget/` 55, `/arenden/` 52, `/om-urvalet/` 59 | Partiernas och protokollens egna ord — undantagna enligt regel 3. Om urvalet är uttalat maskinrum. |

**Metodnot till regel 3:** `lix.mjs` mäter allt i `<main>`, inklusive tabellceller och citat. Det gör att citat- och tabelltunga sidor aldrig kan nå 45 hur bra den egna prosan än är — och det syns inte i utskriften vilka sidor det gäller. Förslag (litet): låt skriptet räkna bort `<table>`, `<blockquote>` och `.stance-card p` (partiernas egna formuleringar), eller markera de undantagna sidorna i utskriften. Poängen är inte att sminka siffran utan att göra mätaren användbar som commit-grind: i dag varnar den på 21 av 29 sidor, vilket lär alla att ignorera varningen.

---

## 5. Prioriterat

**P1 — före lansering/deploy (allt under en dag):**
1. Stale "15 ärenden"-noten (§2.1) — sakfel i läsartext.
2. `/historiska-val/` vänds (§2.2) — sista sidan i gamla stilen.
3. Ärendefiltret flyttas ovanför indexet (§3.1).
4. Skip-länk (§3.2) — fem minuter.
5. 404-"Kurerad" + regel 5-trimmen (§2.3, §2.4.1).

**P2 — före 13 september:**
6. TOC på Om urvalet (§3.5) + KS-dubbleringen (§2.4.2).
7. Årsgruppering i ärendeindexet (§3.1).
8. `/valkompass/`-beslutet: länka eller dokumentera (§3.4).
9. `.table-scroll` på de tre tabellerna (§3.3).
10. `lix.mjs`-metodnoten (§4) — gör mätaren till en användbar grind.

**P3 — om tid finns:**
11. `trygghet-migration`-frågan delas (§2.4.4).
12. Sidfotens dubbellänkar (§2.4.3).
13. "Löftet och pengarna" per parti — kvarstår från första granskningen (§2D där); Vägvals-blocken har tagit den halvvägs.

---

## 6. Rör inte detta

Allt i första granskningens §10 står sig. Nytt sedan dess som också ska överleva varje framtida omarbetning:

- **Villkorad rendering av fynd** — "lägst i Skåne"-meningarna renderas bara om villkoret håller i datan vid byggtid. Detta är sajtens starkaste försvar mot att bli fel när Kolada reviderar. Sprid mönstret, ta aldrig bort det.
- **Vägvals-blocken** och **opinionsraden** i dem.
- **`/sa-rostar-du/`** i sin helhet.
- **Tudelningen på ärendekorten** och den mekaniska "Omdiskuterat"-grunden.
- **Rättelselänken per sida** med förifylld adress.
- **Det statiska bygget** — fortsatt inga API-anrop i drift, allt fungerar utan JavaScript (filtren döljs med `hidden` när JS saknas i stället för att visas trasiga — föredömligt).

---

*Mätmetod: LIX via `node scripts/lix.mjs` på dist byggd 2026-08-17; länk-/ankarkontrollen med engångsskript (alla `href` mot alla `id` i byggd HTML + filkontroll av `/kallor/`); blockräkningar med grep/python mot `<main>`-innehållet. Allt annat är bedömning och märkt som sådan.*
