# Höörs kommunval 2026 — faktasajt

Statisk, oberoende faktasajt inför kommunvalet i Höör 13 september 2026:
<https://hoor-kommunval.ibland.nu>. Se `hoor-kommunval-2026-instruktion.md` för
det fullständiga uppdraget och `/om-urvalet/` på sajten för metodik och
urvalskriterier.

**Vill du bygga motsvarande sajt för din kommun?** Läs `REPLIKERING.md` — en
komplett instruktion (mål, datakällor, tasklista) för att replikera sajten för
valfri svensk kommun med hjälp av Claude Code.

Byggd med [Astro](https://astro.build). All data ligger som platta JSON-filer i
`src/data/` (`partier.json`, `budget.json`, `arenden.json`) — inget backend, ingen
databas, inga AI-/API-anrop i drift.

## Utveckling

```sh
npm install
npm run dev        # localhost:4321
npm run build       # bygger till ./dist
npm run preview     # förhandsgranska produktionsbygget lokalt
```

## Docker

```sh
docker build -t hoor-kommunval-2026 .
docker run --rm -p 8080:80 hoor-kommunval-2026
# öppna http://localhost:8080
```

`docker-compose.yml` är anpassad för sajtens egen driftmiljö (externt
proxy-nätverk framför containern) — bygg och kör hellre imagen direkt enligt
ovan om du vill testa lokalt.
