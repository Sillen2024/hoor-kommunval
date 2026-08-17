# Instruktion: Faktasajt om Höörs kommunval 2026

## Bakgrund

Söndag 13 september 2026 är det val till kommunfullmäktige i Höörs kommun (samtidigt som riksdags- och regionval). Förtidsröstning startar 26 augusti 2026.

Sittande styre 2023–2026: **Moderaterna, Liberalerna, Centerpartiet, Kristdemokraterna** — minoritetskoalition med 17 av 41 mandat. Johan Svahnberg (M) är kommunalråd.

Övriga partier i fullmäktige (opposition): Socialdemokraterna (8), Sverigedemokraterna (9), Vänsterpartiet (3), Miljöpartiet (2), Medborgerlig Samling (2).

Idén till den här sajten uppkom **11 augusti 2026 — 15 dagar innan förtidsröstningen startar**. Det korta tidsfönstret är den direkta anledningen till att omfattningen nedan är medvetet avgränsad snarare än heltäckande. Det ska vara transparent för besökaren, inte gömmas.

Syftet med sajten: ge väljare i Höör en saklig bild av vad sittande styre faktiskt har beslutat under mandatperioden, och vad varje parti (styre och opposition) säger att de vill göra i nästa mandatperiod — utan värderingar eller spekulation om framtiden.

## Icke förhandlingsbara krav

1. **Fakta, inga värderingar.** Ingen text i stil med "om oppositionen vinner kommer...". Bara: det här är vad som beslutats (med källa), det här är vad partiet säger att de vill göra (med källa). Läsaren drar egna slutsatser.
2. **Ingen AI-drift i produktion.** All AI-assisterad bearbetning (läsning/strukturering av dokument) sker EN GÅNG under byggfasen, utfört av dig (Claude Code). Den färdiga sajten är statisk och gör inga LLM-/API-anrop vid körning. Ingen löpande kostnad.
3. **Källhänvisning på varje datapunkt.** Varje ståndpunkt, beslut och siffra ska länka till originaldokumentet (protokoll, manifest, etc).
4. **En tydlig metodik-sida ("Om urvalet") är obligatorisk** — se separat avsnitt nedan. Ska vara lätt att hitta (footer + nav), inte gömd.
5. **Måste vara driftklar innan 26 augusti 2026.**
6. **Docker-image**, driftsätts på Jonas egen VPS (Ubuntu 24.04, Docker Compose, Nginx Proxy Manager + Cloudflare — samma mönster som övriga ibland.nu-tjänster, t.ex. FilÄtaren).

## Omfattning — Fas 1 (det som byggs nu)

Endast **kommunvalet i Höör**. Inte region- eller riksdagsval.

9 partier: M, L, C, KD (styre) + S, SD, V, MP, Medborgerlig Samling (opposition).

Två innehållsdelar:

**A. "Vad vill partierna göra"** — valmanifest 2026 per parti, strukturerat per politikområde. Låt politikområdena (skola, äldreomsorg, bostäder, klimat, ekonomi/skatt, trafik osv) växa fram ur vad som faktiskt finns i manifesten — tvinga inte in kategorier som saknar innehåll.

**B. "Vad har hänt"** (track record) — kurerat, inte heltäckande:
- **Budgetbesluten** för varje år under mandatperioden 2022–2026 (ca 4 tillfällen). Majoritetens budget vs oppositionens budgetreservationer/alternativa budgetar, med röstsiffror. Detta är den mest koncentrerade och tydligaste datan som finns och ska vara kärnan i "vad har hänt"-delen.
- En **kurerad lista på 10–15 ärenden/motioner** från mandatperioden — de mest väljarrelevanta, inte ett slumpmässigt urval. Urvalskriterium: ärenden som (a) förekommer i lokal press (Skånska Dagbladet, Lokaltidningen Höör-Hörby) och/eller (b) rör politikområden som partierna själva lyfter i sina 2026-manifest. Dokumentera exakt vilka sökningar/kriterier som användes — det ska gå att redovisa på metodik-sidan.

## Fas 2 — INTE del av detta bygge

- Fullständig genomgång av samtliga protokoll/nämndmöten under mandatperioden
- Regionval Skåne
- Löpande uppdatering efter valet
Nämn kort på metodik-sidan att detta är en möjlig utbyggnad, men bygg det inte nu.

## Datamodell (förslag)

```json
{
  "partier": [
    {
      "id": "m",
      "namn": "Moderaterna",
      "block": "styre",
      "mandat_2022": 11,
      "manifest_2026": [
        {
          "politikomrade": "Skola",
          "standpunkt": "...",
          "kalla_url": "..."
        }
      ]
    }
  ],
  "beslut": [
    {
      "typ": "budget",
      "ar": 2024,
      "beskrivning": "...",
      "resultat": "...",
      "rostning": { "for": [...], "emot": [...] },
      "kalla_url": "..."
    },
    {
      "typ": "arende",
      "titel": "...",
      "datum": "...",
      "politikomrade": "...",
      "beskrivning": "...",
      "motionar": "s",
      "resultat": "...",
      "kalla_url": "...",
      "urvalsmotivering": "..."
    }
  ]
}
```

## Datakällor

- **Höörs kommuns sammanträdesportal** (hoor.se, "Möten, kallelser och protokoll") — protokoll och handlingar för kommunfullmäktige och kommunstyrelsen. Har en sökfunktion (sökbart på ord, dokumenttyp, namn) — använd den för att hitta ärenden istället för att bläddra möte för möte.
- **Partiernas egna valmanifest/valprogram 2026** — hämtas från respektive partis riks- eller lokalsida. Om ett parti saknar publicerat lokalt manifest, notera det tydligt i stället för att gissa eller fylla i.
- **Kolada** (kommun- och landstingsdatabasen) — objektiva nyckeltal för Höör (skola, äldreomsorg, ekonomi) som referens, inte som partiställningstagande.
- Lokal press (Skånska Dagbladet, Lokaltidningen Höör-Hörby) — endast för att identifiera vilka ärenden som varit debatterade (urvalskriterium), inte som citatkälla i sig.
- hoor.se allmänt — ledamöter, nämnder.

## Byggprocess

1. **Formatkoll först.** Stickprovsöppna ett par dokument i sammanträdesportalen. Är de textbaserade PDF:er eller skannade bilder? Det avgör om OCR behövs. Anpassa extraktionsansatsen efter svaret innan resten av jobbet påbörjas.
2. **Extrahera manifest-data** (del A) — strukturera till JSON enligt schemat ovan.
3. **Extrahera track record** (del B) — budgetbeslut + kurerad ärendelista. Skriv ner urvalsmotivering per ärende samtidigt som du väljer ut det, inte i efterhand.
4. **Generera statiska datafiler**, checka in i repo.
5. **Bygg statisk frontend** — partisidor, jämförelsevy (styre vs opposition per politikområde), källänkar synliga överallt.
6. **Metodik-/"Om urvalet"-sida** — se krav nedan. Obligatorisk, inte en eftertanke.
7. **Dockerize** — nginx som serverar statisk build, samma mönster som övriga ibland.nu-tjänster.
8. **Driftsätt** på VPS:en.

## Metodik-sidan ("Om urvalet") — måste innehålla

- Varför sajten är kurerad och inte heltäckande: idén uppkom 11 augusti 2026, 15 dagar innan förtidsröstningen — tiden fanns helt enkelt inte till en fullständig genomgång av mandatperioden.
- Exakt vad som är med och vad som medvetet uteslutits.
- Urvalskriterierna för den kurerade ärendelistan, i klartext.
- Ett tydligt löfte: inga värderingar, bara dokumenterade fakta med källa.
- Kort omnämnande av Fas 2 (vad som skulle kunna byggas ut senare).

## Sidstruktur

- Startsida — kort intro, länk till jämförelsevy och partisidor
- Partisida (en per parti) — manifest per politikområde + partiets röstning i track record-ärenden
- Jämförelsevy — styre vs opposition, filtrerbar per politikområde
- Budgetöversikt — de fyra budgetbesluten, sida vid sida
- Om urvalet / metod (se ovan)
- Källor — samlad lista

## Teknik och drift

- Statisk site generator (t.ex. Astro eller Eleventy, Node-baserat — matchar stacken från transit-kartan)
- Data som platta JSON-filer, inget backend/databas behövs eftersom inget ändras i drift
- Docker: nginx:alpine som serverar `dist/`-mappen
- Deploy: samma VPS, Nginx Proxy Manager + Cloudflare, som övriga tjänster

## Tidslinje

Mål: driftklar och publicerad senast **26 augusti 2026** (15 dagar från idag, 11 augusti).
