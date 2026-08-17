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

`docker-compose.yml` förutsätter ett externt Docker-nätverk (`proxy-net`) som
Nginx Proxy Manager är ansluten till, samma mönster som övriga ibland.nu-tjänster.
Kontrollera det faktiska nätverksnamnet på VPS:en (`docker network ls`) om det
skulle skilja sig åt.

## Driftsättning

Repot är publikt, så `git clone`/`git pull` via HTTPS fungerar utan inloggning.

**Första gången på VPS:en:**

```sh
git clone https://github.com/Sillen2024/hoor-kommunval.git
cd hoor-kommunval
docker compose build
docker compose up -d
```

**Vid varje uppdatering** (efter att ändringar pushats till `main`):

```sh
cd hoor-kommunval
git pull
docker compose build
docker compose up -d
```

Koppla en proxy host i Nginx Proxy Manager mot containerns interna port 80,
med SSL via Cloudflare — samma mönster som övriga tjänster. Det behöver bara
göras en gång, inte vid varje uppdatering.

Ingen del av driftsättningen (SSH till VPS, NPM-konfiguration, DNS) har
utförts automatiskt i det här projektet — det kräver tillgång som inte finns i
den här miljön.
