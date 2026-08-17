# TASK.md — arbetslista fram till lansering

**Skapad:** 2026-08-15
**Lansering:** 2026-08-26
**Underlag:** `OPUS_GRANSKNING_2026-08-15.md` (verifikationsgrad) + `Gemini_hoor-kommunval-slutrapport.md` (arkitektur/UX-lager ovanpå Opus-rapporten)

> **Två sessioner arbetar parallellt.** Session A betar av punkt 1–8 (Opus-rapportens §7). Session B (denna) har utrett cache/nginx, verifierat budget 2025 och tagit fram punkt 9–24. Kolla status här innan du börjar, och kryssa av när något är klart.

---

## Statuslegend

- `[ ]` ej påbörjad
- `[~]` påbörjad
- `[x]` klar
- `[–]` struken, med motivering

---

## Före lansering 2026-08-26

### Punkt 1–8 (Session A — Opus-rapportens §7) — KLARA

Verifierat i koden 2026-08-15 av Session B. Samtliga åtta är åtgärdade:

- [x] **1. B1** — budget 2024 är omskriven som procedurvotering. `budget.json` har `rostning: null` + `procedurvotering`-objekt med MED/MP-korrigeringen. Noll träffar kvar på "fyra dokumenterade" / "fyra av de fem" / "samtliga fem budget".
- [x] **2. B2** — `styret-vs-oppositionen/index.astro:22` säger nu "De styr i minoritet med 17 av 41 mandat."
- [x] **3. B3** — "görs inga värderingar" borta på båda ställena. "rörig opposition" borttaget ur `/om/`.
- [x] **4. B5** — "den enda dokumenterade omröstningen" borta. (Frasen finns kvar i en annan, korrekt betydelse: MED röstade med styret "för första och enda dokumenterade gången" 2027 — det är rätt och ska stå kvar.)
- [x] **5. B4** — valkompassens JS-beroende åtgärdat.
- [x] **6. D1** — `/om-urvalet/` och `historiska_val.json` uppdaterade.
- [x] **7. D6** — `/ai/media/` borttagen. `src/data/media.json` städad 2026-08-17 (noll referenser i src/ och scripts/).
- [x] **8a. 404** — både `src/pages/404.astro` och `error_page 404 /404.html;` i `nginx.conf:11` finns.
- [x] **8b. gzip** — påslaget i `nginx.conf:7–18` (commit `d93e1df`). Se punkt 10a.

### Punkt 9–13 (Session B) — KLARA 2026-08-15

- [x] **9. OG-bilder per sida.** Åtta egna bilder (1200×630, 57–65 KB), alla inkopplade via `image`-propen: `og-budget-v1.png`, `og-styret-v1.png`, `og-jamforelse-v1.png`, `og-arenden-v1.png`, `og-partier-v1.png` (används av både `/partier/` och `/partier/[id]/`), `og-valkompass-v1.png`, `og-historiska-val-v1.png`, `og-din-vardag-v1.png`. Övriga sidor faller tillbaka på `og-image.png`. Genereras av `scripts/og-bilder.mjs` (körs för hand, ingen build-koppling). Versionerade filnamn — höj `-v1` vid ändring.
  **Kvar att göra vid deploy:** se deploy-checklistan nedan.
- [x] **10a. gzip** — redan gjort i Session A, se 8b.
- [x] **10b. OG-bildens cache.** `immutable` gäller nu bara `location ^~ /_astro/`. Övriga statiska filer (inkl. `/og-image.png`, logotyper och käll-PDF:er) får `max-age=86400` utan `immutable`. Filnamnen är dessutom versionerade som bälte-och-hängslen.
- [x] **11. Oppositionens splittring belagd med primärkälla.** Nytt stycke + lista i `styret-vs-oppositionen/index.astro` under §4: kontrapropositionerna 2023 (10–3, 28 avstod), 2025 (8–3, 28 avstod, MP:s båda namngivna) och 2027. Protokollet KF 2024-06-19 § 75 länkas som `source-link`.
- [x] **12. Interna filsökvägar.** PDF:erna ligger nu publikt: `public/kallor/protokoll/`, `public/kallor/reservationer/`, `public/kallor/budget2027/`. `budget.json` har ett nytt `bilagor`-fält per beslut som renderas som "Källdokument i original" på `/budget/`. Noll träffar på `src/data/` i `dist/**/*.html`.
  Kvarvarande sökvägar i `arenden.json:59`, `arenden.json:90` (`kalla_url_3`, renderas inte av någon sida) och `oppositionsbudgetar.json:3` (`kalla_metod`, renderas inte) — inte publika, lämnade som provenance i datan.
- [x] **13. "Vad kostar 80 öre mig?"** Ny sektion högst upp på `/budget/` (`#vad-kostar-80-ore`) med tabell över beskattningsbar inkomst 20 000–45 000 kr/mån. Skattesatserna läses ur `budget.json`, inte hårdkodade. Not om grundavdrag och om att region-/begravnings-/kyrkoavgift inte påverkas. Länkad från skattesänknings-punkten i `styret-vs-oppositionen`.

### Att verifiera och följa upp (tillagt 2026-08-16)

- [x] **26. `public/og-jamforelse-v1.png` ligger ändrad men ocommittad.** KLAR 2026-08-16: siffran 59 verifierad mot `partier.json` (24 M + 7 L + 3 C + 1 KD + 5 S + 4 SD + 6 V + 7 MP + 2 MED), skriptet omkört, endast denna bild ändrades, committad i `65b443b`. `-v1` behölls (samma motiv). Sharing Debugger-rensning efter deploy kvarstår i deploy-checklistan. Ändringen uppstod när `scripts/og-bilder.mjs` kördes om i samband med Kolada-arbetet (punkt 20). Skillnaden kommer inte av det arbetet utan av **dina egna redigeringar i `partier.json`** — antalet ståndpunkter i bilden räknas ur datafilen och gick upp till 59. Bilden lämnades ocommittad därför att en parallell session verkade ha hand om `partier.json`.
  **Att göra:** kontrollera att 59 stämmer mot `partier.json` som den ser ut nu, och committa bilden — annars ligger den utrullade OG-bilden och påstår ett gammalt antal. Notera att filnamnet är versionerat (`-v1`): byts *motivet* måste siffran höjas och `image`-propen pekas om, men här är det bara samma motiv med uppdaterad siffra, så `-v1` kan ligga kvar. Facebooks scraper-cache behöver då rensas manuellt via Sharing Debugger (se deploy-checklistan).
- [x] **27. `/budget/` byter OG-motiv till förskoleutfallet.** AVGJORT OCH GENOMFÖRT 2026-08-17 (commits `19a2bc2` + `871ec6a`). Jonas valde "byt, men med egen vinkel" — och strök platssiffran på köpet: "Plats 1 av 33" lät som en pallplats, men med premissen att förskolesatsning är något bra är samma siffra sista plats. Sorteringsriktningen är ett värderingsval, inte en faktabeskrivning.
  - `og-budget-v2.png`: rubrik "Minst i Skåne", brödtext "Förskolan kostade 19,2 procent mindre än väntat — lägst av Skånes 33. Effektivt eller underfinansierat?" Formuleringen "lägger minst på förskolan" undveks medvetet: datan säger minst *mot referenskostnaden*, inte minst i kronor. Datadriven ur `kolada.json`; skriptet vägrar rendera om Höör inte längre är plats 1 med negativ avvikelse.
  - `og-nyckeltal-v2.png`: "Plats 1 av 33" ersatt av neutrala "Höör mot 65 kommuner" (65 = unionen av Skånes 33, grannkommunerna och liknande-grupperna minus Höör, räknad ur datan). Förskolefyndet bärs nu av budgetkortet ensamt — ingen dubblering.
  - Båda `image`-proparna ompekade; v1-filerna ligger kvar orörda i `public/` så redan delade inlägg inte tappar sin bild. Verifierat i `dist/`: båda og:image-taggarna ger v2, noll referenser till v1.
  - **Bifynd:** `og-jamforelse-v1.png` följde med i omkörningen — `partier.json` ger nu 87 ståndpunkter (S 5 → 34 via parallell S-session, M 24 → 23). Kontrollräknad mot datafilen och committad, samma hantering som punkt 26.
  - **Kvar efter nästa deploy:** Sharing Debugger-rensning för `/budget/`, `/nyckeltal/` och `/jamforelse/` (plus `/arenden/` från punkt 19).
- [x] **28. SkD/Novus-mätningen om besparingar inlagd.** KLAR 2026-08-17. Skånskans Novus-mätning (publ. 2026-07-26, 1 029 svarande i Höör) visar att bara 1 % vill spara på barnomsorg, skola respektive äldrevård. Ny datafil `src/data/opinion.json` (talen + metadata, artikeln läst i sin helhet via Jonas prenumeration); renderas som ny rad "Opinionen" i "Vägvalet: förskolan" på `/nyckeltal/` och som källpost under Övriga källor på `/om-urvalet/`. Artikeln ligger bakom betalvägg — länken är märkt "(betalvägg)" och PDF-kopian är gitignorerad (`skd_*.pdf`), den får inte committas eller återpubliceras.
  **Att bevaka:** SkD aviserar en uppföljare om *toppen* av listan — var flest Höörsbor tycker att kommunen kan spara, med köns- och åldersskillnader. Fånga den när den publiceras och lägg in i `opinion.json`; först då blir bilden komplett (bottenvalen ensamma säger inte var folk faktiskt vill spara).

---

## Deploy-checklista (Jonas — kräver inloggning/webbläsare)

**Läget 2026-08-16:** deployen är gjord och verifierad live. `/budget/` ger `og-budget-v1.png`, styret-sidans `og:description` är den nya (frasen "enda dokumenterade" finns bara kvar i MED-meningen, vilket är korrekt enligt punkt 4/B5) och `og-budget-v1.png` svarar med `Cache-Control: public, max-age=86400` utan `immutable` — punkt 10b därmed mätt och bekräftad. **Kvar är bara steg 2–3, som kräver webbläsare med inloggning.**

1. [x] Deploya. Verifierat 2026-08-16:
   `curl -s https://hoor-kommunval.ibland.nu/budget/ | grep 'og:image'`
   ger `og-budget-v1.png`.
2. **Facebooks Sharing Debugger** — https://developers.facebook.com/tools/debug/. Kräver Facebook-inloggning, kan inte automatiseras. Klistra in en URL → **Scrape Again** (Facebook cachar första svaret i ~30 dygn, därför måste det göras aktivt, inte bara tittas på). Kör dessa tio:
   `/`, `/budget/`, `/nyckeltal/`, `/styret-vs-oppositionen/`, `/jamforelse/`, `/arenden/`, `/partier/`, `/valkompass/`, `/historiska-val/`, `/din-vardag/`
   Viktigast efter 2026-08-17: `/budget/` och `/nyckeltal/` (nya v2-motiv, punkt 27), `/jamforelse/` (87 ståndpunkter) och `/arenden/` (23 ärenden, punkt 19 + 21).
   Fel att reagera på: "Provided og:image URL could not be processed" (bilden 404:ar eller blockeras) eller att förhandsvisningen visar fel bild.
3. **LinkedIn Post Inspector** — https://www.linkedin.com/post-inspector/. Egen cache, samma sak igen. Hoppa över om tiden är knapp; Facebook och Messenger är de troliga delningskanalerna i Höör.
4. X/Twitter har ingen fungerande card validator längre. Ingen åtgärd.
5. [x] Mät om OG-bildens cache-header efter deploy (punkt 10b). Gjort 2026-08-16:
   `curl -sI https://hoor-kommunval.ibland.nu/og-budget-v1.png | grep -i cache-control`
   ger `public, max-age=86400` — inget `immutable`.

Verifierat lokalt 2026-08-15: alla åtta bilder är 1200×630 och ligger i `public/`, och samtliga `image`-propar pekar på en fil som finns. Det som återstår kräver en riktig webbläsare med Facebook-session.

---

## Punkt 14–18 (Gemini, granskad och kompletterad) — KLARA 2026-08-15

Gemini körde punkt 14–18 enligt `PROMPT_GEMINI_14-18.md` (commit `15cddda`). Granskad mot koden och byggd HTML; punkt 15 och 18 behövde efterarbete (commit `5aed7a9` + `0f140b3`).

- [x] **14. D2 — valkompassens tre metodproblem.** `Valkompass.astro` räknar nu `instammer`/`avvisar` per grupp och rankar på samma procenttal som staplarna visar; `vet-ej` hoppas över och grupper utan besvarade frågor visar `–`. Verifierat: 3/3 sd_med (100 %) slår 3/4 styre (75 %) — det var hela buggen. `kompetens: "nationell"` satt på `trygghet-migration` och `bilism`, `metod_not` utökad.
- [x] **15. D3 — banner i `/jamforelse/`.** Presenterad som kontrollerad frånvaro med datum (2026-08-14) och konsekvens ("inga kort i temana nedan"). Mandat och listan över `manifest_status: "ersatt"` (C, KD, SD, MED) hämtas ur datan. Villkoret är `p.id === "m" && manifest_status === "saknas"` — inte antal — så bannern inte kan visa M-text för ett annat parti.
  Kamerapåståendet i väljarfrågan är borttaget: noll träffar på "kamer" i `partier.json`. Övriga tre led har källa (SD skärpta straff / restriktiv migrationspolitik / sänkta bränslepriser, MP+V kollektivtrafik). **Samma mening står kvar på rad 80 i `src/data/styret_vs_oppositionen_manus.md`** — arbetsmanus, renderas inte.
- [x] **16. D5 — Svahnberg-citatet** inlagt ordagrant i `arenden.json`, attribuerat, med distinktionen att citatet är refererat sakinnehåll medan artikeln är opinionsmaterial. `kalla_url_2` är levererad och ligger i `arenden.json:105` (SkD-ledaren "Höör kan inte fika sig till en fungerande demokrati", 2026-07-02) — källförteckningen på `/om-urvalet/` pekar på den, verifierat live 2026-08-16. Punkten är helt klar.
- [x] **17. D4 delvis — Ringsjöskolan** har `datum: null` och en `datum_not` som säger rakt ut att KF:s antagandedatum inte kunnat verifieras. Verifierat i `dist/`: ankaret `#ringsjoskolan-renoveras-och-byggs-ut-for-130-miljoner` finns kvar och ärendet ligger under "Odaterade ärenden". Ingen typning behövde röras. Tidslinjen har en not om att datumen är beslutsdatum där inget annat anges.
- [x] **18. Ordlista** på `/ordlista/`. Elva begrepp, tio med protokollfört Höör-exempel och intern länk (kontraproposition 10–3, huvudvotering 26–13, acklamation § 77, återremiss 26–11–3 mot gränsen 14, nämndram, reservation, yrkande, votering, vågmästare, minoritetsstyre). `skatteväxling` står utan exempel — inget belägg finns. Inlänkad från sidfoten, budgetsidans banner och som inbäddad länk på "acklamation" i `styret-vs-oppositionen`. CSS ligger i `global.css`.

---

## Efter lansering

- [x] **19. D4 i sin helhet** — röstdata på ärenden. **KLAR 2026-08-16.** Jonas godkände urvalet av de sex nya ärendena i `ROSTDATA_PLAN.md` §4, och hela arbetsordningen i §6 är genomförd (commits `c3b833f`–`1eb51be` + OG-bilden `8f154f8`):
  - **Etapp 1:** de nio befintliga rättade — seniorkortet 2025-08-27 § 99 (19–19, SD sprack 3–6), sammanträdesplaneringen som tvåstegsförlopp (§ 111 återremiss + § 129), Magasinet § 148 (29–6–4, protokollet ny huvudkälla), samverkansavtalen §§ 58–59, Ringsjöskolan 2024-05-22 § 62 (stänger punkt 17:s lucka), handbollsakademins förslagsställare verifierade (§ 11).
  - **Etapp 2:** sex nya ärenden → 15 totalt (instruktionens 10–15 uppfylld): reglementet 17–24, KF-målen 22–17–2, borgensramen 15–21–3 (M sprack 9–1, Svahnbergs reservation läst och publicerad), MP-frågan 22–15, språktesterna 27–9–1 ("anses besvarad", inte avslag), VA-taxan med tre voteringar och slutet 2024-12-18 § 148.
  - **Etapp 3:** `Votering.astro` (beslutsordningen alltid före siffrorna), track record-sektionen "Så har partiet röstat" på alla nio partisidor (12 voteringar per parti; splittringar M 3 / SD 4 / S 1 / V 1), följdändringarna i §5.5 (brasklappar strukna, V-motionen 5:2 dokumenterad KF 2023-12-06 § 149, ordlistans återremiss-exempel bytt). Alla per_parti-summor kontrollräknade mot totalsiffrorna; 10 nya protokolls-PDF:er + 3 reservationer publicerade under `/kallor/`.
  - **Bifynd:** budget 2026:s paragraf är hittad och belagd — **KF 2025-06-11 § 77**, utan votering, skriftliga reservationer S+MP och V (publicerade). `budget.json` och `/om-urvalet/` uppdaterade. `og-arenden-v1.png` omgenererad ("15 ärenden") — Sharing Debugger-rensning för `/arenden/` efter deploy.
- [x] **20. D7 — Kolada.** Klart 2026-08-16, etapp 0–2 i `KOLADA_PLAN.md`. **Etapp 3 genomförd 2026-08-17** (commit `ff859b8`): `Utfall.astro` visar utfall bredvid löften på `/jamforelse/` och partisidorna, temakopplingen ligger i `src/lib/tema-karta.ts`, spärren 3.3 renderas alltid. Etapp 4 (enhetsnivå) avvaktas enligt Jonas beslut 2026-08-17. Kolada ligger i sajten: `scripts/hamta-kolada.mjs` → `src/data/kolada.json` (25 nyckeltal × 66 kommuner × 2018–2025, incheckad, ingen runtime-fetch), märkningen `.derived-note` för egenräknade tal, fyra begrepp i `/ordlista/`, `/om-urvalet/#kolada`, `/budget/#referenskostnad` och nya sidan **`/nyckeltal/`** med sajtens första diagramkomponent (`src/components/Jamforelse.astro`, ingen JavaScript, ingen horisontell scroll på mobil). Höör ställs där mot tre referenser samtidigt: Skånes 33, grannkommunerna och Koladas åtta "Liknande kommuner"-grupper. Starkaste fyndet, verifierat mot API:et: Höör har **lägst nettokostnadsavvikelse för förskola av Skånes 33 kommuner** — 2024 −19,2 % (näst lägst Klippan −15,5), preliminärt 2025 −21,8 %. Förskolan är det enda måttet där alla tre referenserna pekar åt samma håll, och sidan renderar bara den meningen om villkoret verifieras i datan vid byggtid.
- [x] **21. Nämndnivån** — **KLAR 2026-08-17** (commits `688e263` + `5a7c416`; rekognoseringen i `aab91f4`, se `NAMNDDATA_REKOGNOSERING.md`). Jonas valde urvalet "kärnfynden": 8 nämndärenden inlagda i `arenden.json` med nytt `organ`-fält → 23 ärenden totalt på `/arenden/`.
  - **Voteringsärenden (6 voteringar):** SN 2023-05-25 § 72 (besparingar 4 mnkr: M+KD mot SD+V, S avstod — kopplat till opinionsraden på /nyckeltal/), BUN 2024-11-25 § 104 (Norra Rörum 5–4, C bröt med M; skriftlig S+V-reservation publicerad), BUN 2025-09-22 § 68 (tre voteringar, styret nedröstat 4–5 av S+V+SD; protokollets partifel "(M)" för Ljungberg noterat i beskrivningen), VA 2025-06-13 § 53 (konferensresan 2–3, SD sprack; Lissmarks skriftliga reservation publicerad).
  - **Reservationsärenden:** BUN § 5 (natt/helgomsorgen bort — budgetramens vardagskonsekvens), § 93 (busskort idrottsakademier, SD res), § 49 (vårdnadshavare/skolavslutningar, V res med skyddad identitet-motivering), § 25 (AV Media: 6 av 9 reserverade, beslutet stod fast). SN § 126 invävt som not i § 72-ärendet.
  - **Rendering:** organ-badge + "Nämnd"-tagg (`badge--organ`), lead/summering uppdaterade; partisidornas KF-track-record filtrerar bort nämndvoteringar (`!a.organ`) med utskriven motivering. `/om-urvalet/` har metodstycke + avgränsningar (TTN = myndighetsutövning, NKAF ej i första omgång). Alla per_parti-summor kontrollräknade; LIX ≤ 45 på alla nya egna texter; `og-arenden-v1.png` → "23 ärenden".
  - **Andra omgången samma dag (Jonas beslut):** NKAF:s tre voteringsärenden inlagda → **26 ärenden totalt, 11 från nämnderna, 22 voteringar**. Maglasäte Musikscen § 9 (avslag 5–4, L mot styret, MP:s enda nämndyrkande, V:s skriftliga reservation publicerad; protokollets omröstning 1 redovisar bara 7 av 9 ledamöter — noterat i utfallstexten), Operan Abjekt § 32 (7–2, SD ensamt mot alla), initiativärendet om ungas förebyggande arbete § 34 (6–3, fråga 1 om tjänstemännen besvaras inte). `og-arenden-v1.png` → "26 ärenden". **TTN:s bygglov förblir uteslutna (Jonas beslut 2026-08-17)** — myndighetsutövning mot enskilda, står på /om-urvalet/.
  - **Kvar (medvetet):** kommunstyrelsens protokoll — nu största luckan, står så på /om-urvalet/. **KS-rekognosering körd 2026-08-17:** 70 protokollfiler hämtade (ligger i sessionens scratchpad, återhämtas med `scripts/hamta-namndprotokoll.py` + diarienyckeln `ks`), **19 protokoll innehåller voteringar, ~29 begärda omröstningar** — samma storleksklass som punkt 19, delvis överlappande KF-ärendena. Egen punkt om det ska göras. Sharing Debugger för `/arenden/` efter deploy — se checklistan.
- [x] **22. Praktisk valinformation** — **KLAR 2026-08-17.** Ny sida `/sa-rostar-du/`, länkad i huvudmenyn. Förtidsröstning (Kulturhuset Anders, öppettider inkl. avvikande dagar), alla tio vallokaler på valdagen, rösträttsreglerna, id-kravet (röstkort behövs inte längre — ny regel 2026, verifierad mot val.se), personröstens spärrar (5 % + 50 kryss) med Höör-räkneexempel ur `historiska_val.json` (märkt som egen bearbetning), ambulerande röstmottagare och budröstning. Lokaler/tider kontrollerade mot hoor.se/kommun-politik/val-2026/ 2026-08-17, reglerna mot val.se.
- [x] **23. Felrapporteringskanal.** **KLAR 2026-08-16.** Ny sida **`/ratta/`** ("Rätta en uppgift") plus en rättelselänk i sidfoten på **samtliga 27 sidor**.
  - **Per-sida-länken** ligger i `Layout.astro` och bygger sin `mailto:` vid byggtillfället av sidans egen `Astro.url` och `title`: ämnesraden blir "Rättelse: {sidans rubrik}" och brödtexten börjar med sidans fulla adress plus tomma fält för "vad står det nu / vad borde det stå / källa". Läsaren behöver alltså inte veta vad sidan heter. Ingen JavaScript, ingen tredjepartstjänst — sajten är statisk och ska förbli det.
  - **`/ratta/` innehåller fem block:** en öppen brasklapp om att fel *kommer* att finnas (materialets storlek + att det är byggt på kort tid med AI-verktyg), vad som är värt att rapportera (sakfel, trasig/fel källa, rätt siffra fel sammanhang, parti som anser sig felaktigt återgivet, något som saknas), vad som är bra att ha med, **rättelsepolicyn i fem punkter**, och ett eget avsnitt **"Till partierna"**.
  - **Policyn** säger uttryckligen: prövning mot primärkällan (inte mot minnet, inte mot vad någon uppger per telefon), **ingen tyst ändring av sakuppgifter**, svagt belägg → märks som osäkert eller tas bort, tolkningsinvändningar rättas inte men kan skrivas in i texten, och ingen utlovad svarstid. Gränsdragningen mot urvalskritik står i en egen banner: begränsat urval är inte ett fel utan ett redovisat val, och hänvisas till `/om-urvalet/`.
  - **Rättelseloggen** (`#logg`) renderas ur nya `src/data/rattelser.json` — fälten är dokumenterade i filens `_instruktion` och typade i sidans frontmatter. **Loggen är tom och seedas inte med påhittade poster**; tomma tillståndet säger rakt ut varför. Lägg in en post per rättelse som ändrar en sakuppgifts innebörd (stavfel och layoutfixar loggas inte).
  - Inlänkad från sidfotsmenyn, `/om/` och `/om-urvalet/` (nytt stycke under "Löfte: fakta, inga värderingar"). CSS i `global.css` (`.site-footer__ratta`, `.ratta-cta`, `.ratta-policy`, `.rattelselogg`). Verifierat i `dist/`: `/ratta/` byggd och med i sitemapen, mailto-länken korrekt kodad per sida, alla 27 sidor har sidfotslänken.
  - **Bifynd, åtgärdat i commit `3b1429c`:** en genomsökning av byggd HTML visade 35 ställen där mellanslaget före ett inline-element försvunnit i renderingen ("Se<a>budgetöversikten", "på sidan<a>Om urvalet") — Astro klipper radbrytningen när elementet börjar en ny rad i källan. Tyngst på `/ordlista/` (14), `/om-urvalet/` (4) och `/styret-vs-oppositionen/` (3), plus `/budget/`, `/arenden/`, `/valkompass/`, `/ai/kronika/`, `/404`, alla nio partisidorna (`(valet 2022).` klistrat mot källbelagt-märket) och `Valkompass.astro`. Även rubriken i `Jamforelse.astro`, där enheten satt ihop med rubriken på `/nyckeltal/` ("2024(procent)"). Alla fixade med `{" "}` sist på raden före elementet; omkontrollerat mot byggd HTML, noll kvar. Tre mönster är medvetet lämnade: mellanslaget ligger redan inuti taggen (`<strong> Budget 2026</strong>`), det ska inte finnas något (parentes före `<code>`), eller träffen ligger i en sträng inne i `<script>`.
- [x] **24. AI-delens proportioner.** **KLAR 2026-08-17.** Huvudmenyn bantad 11 → 8 poster enligt Fabel-granskningen §6; AI-experimentet, Ärenden, Historiska val och Om urvalet ligger nu i sidfotsmenyn. AI-hookkortet på startsidan ligger kvar längst ned.
- [x] **25. Öronmärkta budgetposter 2023–2026.** **KLAR 2026-08-17** (commits `99a0bfa` + `91846f5`). Alla fem budgetåren har nu `oronmarkta_poster` i `budget.json` och renderas som flerårstabell på `/budget/` (åren som kolumner, samma form som nämndtabellen). Beloppen kontrollräknade i två oberoende pdftotext-lägen (`-table` + `-fixed`; `-lineprinter` visade sig splittra bokstäverna på de här PDF:erna och är oanvändbar — noterat i instruktionsfilen). Beslutssatsen verifierad ordagrant likalydande i alla fem protokollen; punktnummer skiljer: 2023 § 145 p. 2 (av 6), 2024 § 77 p. 2 (av 5), 2025 § 75 p. 3 (av 7), 2026 § 77 p. 3 (av 7), 2027 § 58 p. 3 (av 6). Instruktionsfilens varning om att 2026 saknade protokoll var överspelad — `Protokoll_KF_250611.pdf` fanns redan publicerat. Trenden syns nu: gymnasiet 94,9 → 107,2 mnkr, ekonomiskt bistånd 12,0 → 9,0 mnkr. Nämndtabellens summor orörda; LIX på `/budget/` oförändrat (55 före och efter — sidan domineras av protokollcitat).
- [x] **29. Kommunstyrelsens voteringar.** **KLAR 2026-08-17** (Jonas beslut samma dag: "Kör KS-delen"). Alla KS-protokoll 2023–2026 hämtade (70 filer) och samtliga **27 voteringar** extraherade maskinellt (`scripts/parsa-ks-voteringar.py`, bredare triggerfras än KF-parserns — lärdomen från BUN § 68) och kontrollräknade mot protokollens totalsiffror.
  - **9 nya ärenden** på `/arenden/` (→ 35 totalt, 33 voteringar): Gudmuntorps skola (KF 2025-10-01 § 113 + KS-station, V ensamt, 2 skriftliga V-reservationer), "Höör anger inte" (angiverilagen: C bröt med styret, 3 skriftliga reservationer), räddningstjänstens bemanning (styret förlorade 6–7 + 6–6-utslagsröst där S sprack), Översiktsplan 2026 (KD:s åkermarksreservation, Kyrkbyn/Fogdarp), flaggriktlinjerna (SD:s egna riktlinjer föll 3–10), kvarteret Anders (7–6, SD sprack, S:s kulturkvartersreservation), Maglehill centrala etappen (KD+SD mot punkthusen, S+V med styret), skattebroms-remissen (styret förlorade 5–8 tre månader före valet, L på andra sidan), rådssammanslagningen KMPR (MP:s tillägg vann 7–6, L+KD fällde).
  - **6 komplement** invävda i befintliga ärenden med käll-PDF: KF-målen (KS 6–6-utslagsröst), borgensramen (Persson M avvek redan i KS), VA-taxan (styret förlorade i KS 6–7), seniorkortet (SD sprack redan i KS, 2 skriftliga reservationer), rivningen (KS 9–4 där S+MP var med styret), AV Media (KS 9–4 + KF § 80, kedjan BUN→KS→KF komplett).
  - **15 protokoll + 9 skriftliga reservationer** publicerade under `/kallor/` (inkl. `Protokoll_KF_251001.pdf` som saknades). `kalla_url_5`-stöd i `kallor()`. Uteslutet med redovisning i urvalskriterier_not: budgetärendenas repetitiva 9–4-stationer och föredragningslista-proceduren 2025-12-02 (§ 249, "Mossen 1" — kan tas senare om KF 250129 § 8 grävs fram). `og-arenden-v1.png` → "35 ärenden". Sharing Debugger för `/arenden/` efter deploy.
  - **Kvar efter detta:** arbetsutskotten och bolagsstyrelserna (står så på /om-urvalet/), samt KF-voteringar utanför bevakade ärenden.

---

## Strukna punkter

- [–] **Geminis punkt 5: accordions i jämförelsevyn.** Bygger på en felaktig premiss. `/jamforelse/` innehåller ingen tabell — det är en `compare-grid` av kort som redan kollapsar till en kolumn på mobil. Sajtens enda horisontellt scrollande tabeller ligger på `/budget/`, `/historiska-val/` och `/arenden/`. **Rör inte jämförelsevyn.** Kvarstående åtgärd var den ursprungliga: sänk `minmax(18rem, 1fr)` till 15rem för skärmar under 350 px — **åtgärdad 2026-08-17** (media query i `global.css`).
- [–] **HTML-cachepolicy i nginx.** Cloudflare cachar inte HTML (`cf-cache-status: DYNAMIC`) och `Last-Modified` är färskt, så webbläsarheuristiken blir kort. Inte värt att pilla i.
- [–] **Cache Rules i Cloudflare.** `DYNAMIC` på HTML är bevis nog för att ingen "Cache Everything"-regel finns. Ingen åtgärd.

---

## Verifierat 2026-08-15 (Session B)

### Budget 2025 — helt korrekt, inga fel

Extraherat ur `src/data/protokoll_ksf/Protokoll_KF_240619.pdf` med `pdftotext -layout -enc UTF-8` (fungerar — tidigare session misslyckades). **§ 75, s. 11–13.** Allt i `budget.json` stämmer mot protokollet:

- Huvudomröstning (Omröstning 2): **26 ja – 13 nej – 0 avstår**, namngiven röstlängd
- Ja (26) = 11 M + 2 C + 2 L + 2 KD (styrets 17) + **hela SD-gruppen, 9 namngivna**
- Nej (13) = 8 S + 3 V + 2 MP
- 26 + 13 = 39, frånvarande 2 = MED (Anna Jung, Johan Karlsson) → summa 41
- § 75, dnr KSF-2023-00923, skattesats 21,75 — alla tre ordagrant i protokollet

**Slutsats:** fotnoten under §B1 i granskningen är avförd. 2025 är sajtens starkaste enskilda belägg — äkta huvudvotering, fullständig röstlängd, hela SD-gruppen namngiven. **Var kategorisk om den.**

### Nytt fynd: oppositionens splittring som primärkälla

Samma protokoll, **Omröstning 1** (vilket oppositionsförslag som skulle bli motförslag):

> 8 ledamöter röstar JA (S), 3 röstar NEJ (V), 28 AVSTÅR — bland dem Roger Orwén (MP) och Andrew Briggs (MP).

S, V och MP hade tre olika budgetar. S och V röstade mot varandra om vilken som skulle gälla. MP avstod från att stödja någondera. Samma mönster i 2023 (10–3, 28 avstod) och 2027.

Det här är **"oppositionen är inte enig" som primärkälla med namngiven röstlängd** — underlaget för punkt 11. Ligger redan i datan, oanvänt.

### Cache- och nginx-utredning

Live-headers 2026-08-15 mot `https://hoor-kommunval.ibland.nu/`:

| Resurs | Resultat | Slutsats |
|---|---|---|
| HTML | `Content-Encoding: br`, `cf-cache-status: DYNAMIC` | Cloudflare komprimerar redan med Brotli. Besökaren har inget prestandaproblem. |
| `/_astro/*.css` | `immutable`, `cf-cache-status: HIT` | Korrekt — filerna är innehållshashade. |
| `/og-image.png` | `immutable`, `HIT`, `Age: 117576` | **Var fel.** Åtgärdat i punkt 10b — mät om efter nästa deploy. |

DNS: `*.ibland.nu` A → Proxied (orange cloud). `hoor-kommunval` faller under wildcarden.

**Varför gzip ändå är kvar (punkt 10a):** `DYNAMIC` betyder att varje sidvisning går hela vägen till origin-containern. Utan gzip skickas 29 KB i stället för 6,6 KB per visning från Jonas egen uppkoppling. Cloudflare skickar `Accept-Encoding: gzip` till origin, så det används direkt. Det är en försäkring mot trafiktopp i valveckan — inte en prestandafix för besökaren.

---

## Öppen fråga — avförd 2026-08-16

Frågan var om det outnyttjade 2024-protokollet (`Protokoll_KF_240619.pdf`) kunde fylla luckan mellan dagens 9 ärenden och instruktionens 10–15. Den är överspelad: **alla** 27 KF-protokoll är nu hämtade och parsade, inte bara det ena. Se punkt 19 och `ROSTDATA_PLAN.md`. Kvar är ett urvalsbeslut, inte ett extraktionsproblem.

---

## Bedömning av de två rapporterna

`OPUS_GRANSKNING_2026-08-15.md` är verifikationsgrad: externa primärkällor, namngivna röstlängder, mätta värden.

`Gemini_hoor-kommunval-slutrapport.md` är opinionsgrad: den har läst Opus-rapporten och lagt ett arkitektur-/UX-lager ovanpå. Inga egna källkontroller. Av dess tre "missar" var **en giltig** (dynamiska OG-bilder → punkt 9), **en villkorad och delvis fel** (gzip → punkt 10a, omvärderad efter mätning), och **en byggd på felaktig premiss** (accordions → struken).

Geminis åtgärdslista strök tyst B5, D1, D6, 404-sidan, D5, D7 och hela §5. De punkterna är återinförda ovan.

---

# Moderaterna via Facebook (tillagt 2026-08-16)

Bakgrund: M:s hemsida är tomma platshållare, men hela valplattformen ligger som
84 reels på facebook.com/mihoor. Hämtade med `yt-dlp`, transkriberade med
KB-Whisper. Råmaterial i `M_FACEBOOK_RAADATA.md`, tidkodade transkriptioner i
`src/data/transkriptioner/m_facebook/`. `partier.json` har nu 24 källbelagda
punkter för M under nytt `manifest_status: "sociala_medier"`.

## M1. Gudmuntorps-videon — [–] STRUKEN 2026-08-17

Jonas beslutade att hoppa över videon helt. Den används inte i `partier.json`
och blir ingen Landsbygd-punkt. Transkriptionen ligger kvar i
`src/data/transkriptioner/m_facebook/5039223069637156.vtt` men ska inte
avlyssnas eller publiceras.

## M2. Tre av M:s sifferpåståenden kontrollerade mot Kolada — [x] gjort 2026-08-15

M gör tre mätbara skryt i sina reels. Kontrollerade mot Kolada v3 (33 skånska
kommuner, kommunkoderna i `KOLADA_PLAN.md` §4.2). Resultatet nedan är underlag
för publicering, inte publicerbart som det står — se märkningskravet i
`KOLADA_PLAN.md` §2: allt som är ranking eller snitt är **egen bearbetning**,
inte `Källa: Kolada`.

\* = 2025 är preliminärt för ekonomi- och skolnyckeltal, fastställs 2026-09-30
(efter valet). Se `KOLADA_PLAN.md` §4.1. Enkätnyckeltalet U21468 i M2c har
publiceringsdatum 2026-10-04 men avser 2025 års undersökning och är den siffra M
citerar.

Ingen av de tre siffrorna står i dag i `partier.json` — de är skryt om utfall,
inte vallöften, och togs därför inte med bland M:s 24 punkter. Kontrollen görs för
att de kan bli aktuella på `/nyckeltal/` (KOLADA_PLAN etapp 2–3).

### M2a. Arbetslöshet — påståendets *riktning* stämmer, *siffran* går inte att verifiera

Citat: *"Idag har Höör en arbetslöshet på 4,8 %. Det är lägre än genomsnittet i
Skåne."* (https://www.facebook.com/reel/1338841281077433/, 2026-07-11)

| nyckeltal | år | Höör | Skånesnitt | placering (1 = lägst) |
|---|---|---|---|---|
| N03920 Arbetslösa av befolkningen 18–65 år, % | 2024 | 4,38 | 6,31 | **4 av 33** |
| N03920 | 2025\* | 4,48 | 6,34 | **4 av 33** |
| N03941 Arbetslösa av arbetskraften (BAS) 18–65 år, % | 2024 | 5,23 | 7,69 | 6 av 33 |
| N03941 | 2025\* | 5,35 | 7,75 | **4 av 33** |

"Lägre än genomsnittet i Skåne" är **klart bekräftat** — Höör ligger omkring
2 procentenheter under snittet och är fjärde lägst av 33 på båda måtten. Endast
Lomma, Vellinge och Båstad ligger lägre.

**Men 4,8 % finns inte i Kolada.** Kolada har årsvärden; närmaste värden är 4,48
och 5,35. Reelen är från juli 2026 och avser sannolikt Arbetsförmedlingens
månadsstatistik för 16–64 år, som Kolada inte hunnit publicera. Vill sajten citera
4,8 % måste källan vara Arbetsförmedlingen, inte Kolada — och då ska månad anges.

### M2b. Meritvärde åk 6 — går **inte** att verifiera i Kolada

Citat: *"våra elever i årskurs sex … hamnat på plats nummer fyra av Skånes alla
33 kommuner i rankingen av meritvärde"*
(https://www.facebook.com/reel/750174958098240/, 2025-12-16)

**Kolada har inget sammanvägt meritvärde för åk 6.** Meritvärde finns bara för
åk 9 (N15504–N15507, N15566–N15568). För åk 6 finns enbart betygspoäng *per
ämne* (N02438–N02485 samt N15509 matematik och N15510 svenska).

Som indikation summerades betygspoängen i 16 obligatoriska ämnen, lägeskommun:

| år | Höör, snitt betygspoäng åk 6 | placering av 33 |
|---|---|---|
| 2024 | 13,72 | 8 |
| 2025\* | 13,35 | 10 |

Det är **inte** samma sak som meritvärde (som är summan av de 17 bästa betygen och
räknas på hemkommun), så det motbevisar ingenting. Men det reproducerar inte
plats 4 heller. **Slutsats: påståendet kan varken bekräftas eller avfärdas med
Kolada.** För att avgöra krävs Skolverkets egen statistik för åk 6, och man måste
veta vilken ranking M syftar på. Publicera inget om detta innan källan är hittad.

Kvarstår som not: L:s manifest anger meritvärde **åk 9** på 225,2 som ett *problem*,
medan M lyfter **åk 6** som en *framgång*. Höörs åk 9-meritvärde enligt Kolada är
229 (2025) och 227 (2024) — se `KOLADA_PLAN.md` §4.1. Skillnaden ligger i vilket
årskurs partierna väljer att mäta.

### M2c. Hemtjänstnöjdhet 93 % — bekräftad på decimalen

Citat: *"Höörs kommun … gått upp 110 placeringar och ligger nu på plats 128 av 290.
Ett index på 70,0 … Nöjdheten ligger på hela 93."*
(https://www.facebook.com/reel/1132095822102495/, 2025-12-12)

`U21468 Brukarbedömning hemtjänst äldreomsorg – helhetssyn, andel (%)` — andelen
65+ med hemtjänst som svarat "mycket nöjd" eller "ganska nöjd":

| år | Höör | Skånesnitt | placering (1 = högst) |
|---|---|---|---|
| 2023 | 85,0 | 84,4 | 16 av 32 |
| 2024 | 83,5 | 84,1 | 21 av 33 |
| 2025 | **93,1** | 85,0 | **2 av 33** |

93 % stämmer exakt. Underlaget är 104 svarande, 59 % svarsfrekvens (U23592,
U23593) — över Koladas gräns på 30 svarande, men litet nog att ett hopp på
9,6 procentenheter på ett år delvis kan vara slumpvariation. **Skriv ut
svarandeantalet om siffran publiceras.** Källa är Socialstyrelsens undersökning
"Vad tycker de äldre om äldreomsorgen", inte kommunen själv.

Placeringen 128 av 290 och index 70,0 är **SPF Seniorernas Hemtjänstindex**, en
helt annan mätning som inte finns i Kolada. Den delen måste källbeläggas mot
SPF:s egen rapport. Kolada har ett eget hemtjänstindex, `N25807`, där Höör 2025
har 61,1 mot Skånesnittet 39,7 (plats 8 av 33) — snarlik riktning, men
**förväxla dem inte**.

### Vad det här betyder för sajten

Två av tre påståenden håller. Det tredje är inte falskt, bara omöjligt att spåra
med den källa sajten tänkt använda. Mönstret är värt att notera i `/om-urvalet/`:
partierna citerar rankingar från olika mätningar (Arbetsförmedlingen, Skolverket,
SPF Seniorerna) som alla låter som samma sorts fakta men inte går att jämföra.

## M3. Samma metod på SD, C, KD och Medborgerlig Samling — [x] KLAR 2026-08-17

**Utfall:** Jonas har kontrollerat alla fyra. Ingen av SD, C, KD eller MED har
lokalt innehåll i sina sociala medier likt M:s reels — det finns inget att
hämta. Deras `manifest_status` i `partier.json` står därmed kvar som de är;
luckan är kontrollerad frånvaro, inte ohämtad data.

Metoden nedan sparas som referens ifall något parti börjar publicera lokalt
före valdagen. Den är testad och fungerar utan inloggning eller cookies:

1. Öppna partiets Facebook-sida i Chrome med Claude-widgeten och be om:
   *"Lista bara URL:erna till samtliga videor och reels på den här sidan, en per
   rad, inget annat. Scrolla tills de tar slut."*
2. Spara raderna i en `urls.txt` **utanför Dropbox-mappen** — Dropbox-synken
   dödar nedladdningen med WinError 5. Använd t.ex. `%TEMP%\hoorvid\`.
3. `python -m yt_dlp -a urls.txt -x --audio-format mp3 --write-info-json --sleep-requests 1 -o "%(id)s.%(ext)s"`
4. `python scripts/transkribera.py <mappen>` — KB-Whisper, skriver `.vtt`.
5. Läs `--write-info-json`-texterna först. Transkribera bara där texten är
   avhuggen med `...`, är tom, eller där talet tillför siffror.

Använder partiet vanliga textinlägg i stället för video räcker steg 1, med en
prompt som ber om inläggstext + permalänk per inlägg.

**Viktigt om transkriptionerna:** egennamn förvanskas systematiskt (Höör → Töör,
Gudmuntorp → Gulmankrop, Tjörnarp → "Schweiz Tjörnarp", Maglehillsskolan →
Haglahillskolan). Referera i sak, citera aldrig ordagrant utan avlyssning.
