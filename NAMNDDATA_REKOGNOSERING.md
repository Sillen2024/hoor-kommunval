# Nämnddata — rekognosering för TASK punkt 21

> **Utfall 2026-08-17:** Jonas valde urvalet "kärnfynden". 8 ärenden inlagda på
> sajten (commits `688e263` + `5a7c416`), detaljer i TASK.md punkt 21. NKAF:s
> voteringar och TTN:s bygglov ligger kvar här som ohämtat urval.

**Utförd:** 2026-08-17. Samtliga protokoll från de sex facknämnderna hämtade via
Ciceron-API:et (samma flöde som `scripts/hamta-protokoll.py`, se
KALLLUCKOR-RAPPORT.md §1) och genomsökta efter voteringar, reservationer och
protokollsanteckningar. Hämtskript: `scripts/hamta-namndprotokoll.py`.

## Täckning

| Diarie | Nämnd | Protokoll | Period |
|---|---|---|---|
| BUN | Barn- och utbildningsnämnden | 22 möten | 2023-05-08 – 2026-06-08 |
| SN | Socialnämnden | 21 möten | 2023-05-25 – 2026-06-11 |
| NKAF | Nämnden för kultur, arbete och folkhälsa | 18 möten | 2023 – 2026-06-09 |
| TTN | Tillstånds- och tillsynsnämnden | 21 möten | 2023 – 2026-06-17 |
| VR | Nämnden för VA och Räddningstjänst | 13 möten | 2023 – 2024-12-06 (upphörde) |
| VA | VA-nämnden | 8 möten | 2025 – 2026-06-05 (ersatte VR) |

Ej genomsökta: bolagen, revisionen, överförmyndar- och valnämnden — inga
partipolitiska beslut. Kommunstyrelsen ligger också utanför (finns i KSF-diariet
om den ska tas senare).

## Voteringar med namngiven röstlängd — 9 ärenden

| Nämnd | Datum | § | Ärende | Utfall |
|---|---|---|---|---|
| BUN | 2024-11-25 | 104 | Pedagogisk omsorg i Norra Rörum | 5–4. M+SD behåller verksamheten med SD:s nedläggningsvillkor (<10 elever vid läsårsstart; 8 inskrivna vid beslutet). S+C+V emot. Skriftlig reservation S+V (bilaga § 104), muntlig C. **C röstade mot M.** |
| BUN | 2025-09-22 | 68 | Delegationsordning (avgiftsbefrielse) | **Tre voteringar. Styret M+L+C förlorade 4–5 mot S+V+SD**, bl.a. om ärendet skulle återupptas. M reserverade sig muntligen. |
| SN | 2023-05-25 | 72 | Besparingar 4 mnkr (månadsuppföljning april) | 4–3–2. M+KD ja (KD-yrkande: uppdra socialchefen spara 4 mnkr helårseffekt 2024), **SD+V nej** (SD ville ta underskottet ur RUR), S avstod med protokollsanteckning. SD muntlig reservation. Bakgrund: prognos −11,6 mnkr. |
| NKAF | 2024-05-07 | 32 | Föreningen Alltet, bidragsansökan | 7–2 om att avgöra ärendet samma dag (C+M-yrkande). Två protokollsanteckningar. |
| NKAF | 2024-02-27 | 9 | Maglasäte Musikscen, projektbidrag | Flera voteringar (MP-yrkande om bifall, S-motförslag). **V skriftlig reservation — bilagan finns i Ciceron.** |
| NKAF | 2023-04-25 | 34 | Initiativärende: begäran om rapport | 6–3. C/M/SD/KD mot S-sidan om förvaltningen skulle svara på frågorna 2–5. |
| TTN | 2024-12-11 | 104 | Bygglov, tillbyggnad | 6–3 bevilja. **Myndighetsutövning mot enskild — se förbehåll nedan.** |
| TTN | 2023-06-14 | 47 | Bygglov, nybyggnad | 6–3 bevilja mot V-yrkande. Samma förbehåll. |
| VA | 2025-06-13 | 53 | Kurser och konferenser 2025 | 2–3–1. **SD sprack:** Liljenberg (SD) röstade med Lissmark (S) mot M+C+Nilsson (SD). |

## Reservationer utan votering — ca 8 ärenden

| Nämnd | Datum | § | Ärende | Vem reserverade |
|---|---|---|---|---|
| BUN | 2026-06-08 | 49 | Initiativärende: vårdnadshavare bjuds in till skolarrangemang (bifallet) | V |
| BUN | 2025-11-24 | 93 | Initiativärende: transport till idrottsakademier | SD ×2 |
| BUN | 2025-01-13 | 5 | Öppettider pedagogisk omsorg på obekväm tid (Maglehill, 18–22) | S ×2 + V |
| BUN | 2024-03-18 | 25 | Remissyttrande om utträde ur AV Media | **M ×2 + V ×2 + KD — blandad konstellation** |
| SN | 2023-11-09 | 126 | Socialnämndens budget 2024 | V |
| VR | 2 protokoll (id 6, 10) | – | ej närlästa | – |
| TTN | 2026-06-17 | – | ej närläst | – |

## Förbehåll

1. **TTN:s bygglovsärenden är myndighetsutövning mot enskilda.** Protokollen är
   GDPR-rensade externversioner, men sajten bör ändå inte peka ut enskilda
   fastigheter. Publiceras något ska det vara mönstret (hur partierna röstar om
   bygglov), inte fallet. Eget redaktionellt beslut innan de tas med.
2. **Parserns triggerfras räcker inte.** `parsa-voteringar.py` letar efter
   "Omröstningen genomförs/utfaller" som sammanhängande fras. I nämndprotokollen
   skjuts ord in ("Omröstningen om ärendet ska anses färdigbehandlat eller inte
   genomförs med upprop…") — det var så BUN § 68 först missades. Bredda till
   `Omröstning(en)? .* (genomförs|utfaller)` + ankaret "Omröstning/Votering
   begärs", och lägg nämndnamnen i SKRAP-regexen.
3. **Små tal.** Nämnderna har 9 ledamöter (VA 6). Partier sitter med 1–3 platser
   och ersättare tjänstgör ofta — en "så röstade partiet"-summering blir skör.
   Redovisa hellre per ärende med namngivna ledamöter än som partistatistik.
4. **Protokollen har egna fel.** BUN 2025-09-22 skriver "Jack Ljungberg (M)" på
   ett ställe (ska vara SD). Varje röstlängd måste kontrollräknas mot
   protokollets egna siffror, som i punkt 19.

## Storleksbedömning

Klart mindre än punkt 19 (som gav 31 voteringar i KF). Skörden är ~9
voteringsärenden + ~8 reservationsärenden på 103 protokoll, varav kanske 5–7 håller
för publicering. Kärnfynden med tydligast berättelse:

1. **SN § 72** — besparingar i socialnämnden, SD+V på samma sida mot M+KD.
   Knyter direkt an till opinionsmätningen (1 % vill spara på äldrevård) och
   "Vägvalet: förskolan" på /nyckeltal/.
2. **BUN § 104** — Norra Rörum: landsbygdsfråga där C bröt med M.
3. **BUN § 68** — styret nedröstat 4–5 i egen nämnd av S+V+SD.
4. **VA § 53** — SD röstar mot SD.

Rådata (PDF + txt) ligger i sessionens scratchpad och hämtas om på ~10 min med
`python scripts/hamta-namndprotokoll.py search <nämnd>` + `fetch <nämnd>`.
Uppskattad återstående arbetsinsats för hela punkt 21: 2–3 arbetspass
(närläsning + verifiering av ~17 ärenden, urval, rendering, käll-PDF:er till
`/kallor/`, uppdatering av /om-urvalet/).
