# Sammanställning: QA och Nästa Steg för hoor-kommunval.ibland.nu

## 1. Vad jag (Gemini) har gjort
Jag genomförde inledningsvis en arkitektonisk och källkritisk granskning av projektets grundinstruktion. Fokus låg på att säkerställa trovärdighet, neutralitet och viralitet inför den snäva deadlinen. Mina huvudsakliga insatser var:
* **Identifiering av befogenhetsfällan:** Att belysa risken med att oemotsagd publicera partilöften som egentligen rör statliga frågor (t.ex. polis och straff), vilket annars hade sänkt sajtens trovärdighet.
* **UX för vardagslivet:** Att föreslå en mobilanpassad "accordion"-design (dragspel) för jämförelsevyn, anpassad för invånare som läser på språng.
* **Krav på dynamisk delning:** Att poängtera vikten av dynamiska Open Graph-bilder vid djuplänkning, så att delningar i lokala Facebook-grupper blir specifika och engagerande.
* **Transparens i urvalet:** Att kräva en strikt, "matematisk" redovisning av hur de 10-15 historiska ärendena valdes ut för att undvika anklagelser om politisk bias.

## 2. Vad Opus hittade som var genuint bra (och kritiskt)
Opus genomförde en extremt skarp, djupgående datateknisk granskning och agerade som en briljant QA-ingenjör. Opus viktigaste och bästa fynd var:
* **Det stora sakfelet (Blockerande):** Opus upptäckte att röstsiffrorna för budget 2024 (26–11–3) gällde en procedurvotering om återremiss, inte själva budgeten (som antogs med acklamation). Att Opus fångade detta räddade sajtens huvudtes och trovärdighet.
* **Motsägelser i neutraliteten:** Opus hittade ställen där sajten bröt mot sitt eget löfte om oberoende, exempelvis genom att kalla oppositionen för "rörig" eller felaktigt benämna minoritetsstyret som en "majoritet".
* **Kritisk granskning av valkompassen:** Opus såg att kompassen renderades tom utan JavaScript och att poängberäkningen var obalanserad mellan blocken.
* **Datavalidering:** Opus verifierade historiska valdata och bekräftade att den redovisade skattesänkningen faktiskt var äkta, vilket ger en trygg grund att stå på.

## 3. Vad Opus missade (Helhetsperspektivet)
Opus var djupt nere i koden, men missade några övergripande system- och UX-perspektiv:
* **Nätverks- och DevOps-arkitekturen:** Opus anmärkte på att Gzip saknades i den lokala Nginx-konfigurationen. Eftersom sajten driftsätts bakom en extern proxy och Cloudflare, hanteras cache-regler och komprimering (som Brotli) mycket effektivare direkt i Cloudflare. Man behöver inte pilla i den lokala Docker-containern för detta.
* **Viraliteten i djuplänkningen:** Opus tyckte att sajtens statiska Open Graph-metadata var "stark". Men för en politisk sajt räcker det inte med en snygg startsida vid delning. Om en specifik omröstning delas, måste metadata och bild spegla just det beslutet för att driva debatt på sociala medier.
* **Mönstret för mobila skärmar:** Opus såg att CSS sprack på små skärmar, men föreslog bara kodjusteringar. Det verkliga problemet är gränssnittsmönstret. Att scrolla tabeller horisontellt på mobil fungerar dåligt. Det krävs en helt annan struktur (accordions).

## 4. Förslag på vad Opus gör nu (Action Plan)
Nu när analysfasen är klar bör Opus få i uppdrag att exekvera de viktigaste kodändringarna inför lanseringen:
1. **Skriv om historien kring Budget 2024:** Rätta JSON-datan och all tillhörande text så att procedurvoteringen och acklamationen beskrivs korrekt. Fixa även följdfelen där styret kallas "majoritet".
2. **Tvätta texterna:** Gå igenom och neutralisera de värderande orden (t.ex. "rörig opposition") så att sajtens löfte om strikt fakta hålls.
3. **Hantera "Tomma stolar":** Bygg in och implementera den tydliga bannern/komponenten som förklarar varför Moderaternas (och eventuellt andras) lokala manifest saknas, så det blir en redaktionell notering och inte ser ut som en bugg.
4. **Fixa Valkompassen:** Åtgärda JavaScript-beroendet (inför statisk fallback/noscript) och balansera poängberäkningen enligt den tidigare kritiken. Byt ut eller flagga riksdagsfrågor (som straffskalor) med tydliga faktarutor.
5. **Mobilanpassa jämförelsevyn:** Koda om den horisontella tabellvyn till expanderbara dragspel (accordions) för mobilanvändare.
