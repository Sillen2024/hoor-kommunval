# Analysrapport: Copy, Fakta och Användarupplevelse
*Datum: 2026-08-12*

Denna rapport sammanfattar en noggrann genomläsning av allt textinnehåll på sajten för Höörs kommunval 2026. Fokus har legat på att hitta logiska luckor i texten (copy), potentiella faktafel som bör dubbelkollas samt att bedöma hur informationen landar hos besökaren (tillgänglighet och användarvänlighet).

Ingen kod har ändrats i projektet enligt instruktion.

---

## 1. Luckor i copy och korrektur
Här är några direkta missar och motsägelser i texten som ni snabbt kan rätta till:

*   **Fel antal budgetbeslut på startsidan:** På `index.astro` under "Vill du gräva djupare? > Budgetöversikt" står det *"De fyra budgetbesluten 2023–2026 sida vid sida"*. Men datan och budget-sidan självt täcker även budgeten för 2027 (som klubbades i juni 2026). Det bör ändras till *"De fem budgetbesluten 2023–2027"*.
*   **Votering för 2026 vs antal beslut:** På sidan *Styret vs oppositionen* står det: *"styrets förslag på exakt 26 ja-röster i samtliga fyra dokumenterade voteringar — 2023, 2024, 2025 och 2027."* Det är korrekt att det är 4 *voteringar* av 5 möjliga *beslut* (eftersom 2026 togs utan votering). Texten är noga med detta, men var vaksam på att det inte blir rörigt för läsaren. Ni förklarar det bra i parantesen efteråt.
*   **Hårdkodad CSS (småsak):** I `arenden/index.astro` används en inline style för etiketter: `<span class="badge badge--styre" style="background:#f0f0f0;border-color:#999;color:#333;">{a.politikomrade}</span>`. Detta avviker förmodligen från hur CSS normalt hanteras på sidan och bör kanske städas bort för konsekvent utseende.

## 2. Fakta att dubbelkolla (Kritiska punkter)
För att sajten ska behålla sitt löfte om att vara "fakta och inga värderingar" finns ett par starka påståenden som ni bör verifiera en extra gång för att undvika att partierna slår ner på sajtens trovärdighet:

*   **Röstar SD *verkligen* alltid med styret? (Matte vs verklighet):** På `styret-vs-oppositionen/index.astro` skriver ni: *"17 + 9 = 26, vilket bara går ihop om Sverigedemokraterna (9 mandat) röstat med styret varje gång."* 
    *   *Faktakoll:* Det är en logisk slutsats om *alla* ledamöter var närvarande och *alla* röstade exakt enligt partilinjen. Men om exempelvis två från SD var sjuka, och två från Socialdemokraterna röstade "fel", blir resultatet också 26. Kontrollera (t.ex. via webb-tv eller namnuppropsprotokollet) att det faktiskt var de 9 SD-ledamöterna som tryckte ja. 
*   **Avsaknad av medborgarförslag i Höör:** I både *Styret vs oppositionen* och *AI-partiet* slås det fast att Höör saknar möjlighet till medborgarförslag (till skillnad från grannarna Eslöv och Hörby). Det är en mycket bra politisk poäng att belysa – men dubbelkolla att de inte smugit in någon form av "e-förslag" eller "Höörförslaget" under annan flagg.
*   **Medborgerlig Samling saknar manifest:** På partisidan för MED står det att en lokal hemsida/manifest saknas. Eftersom det är så kort tid kvar till valet (och förtidsröstningen börjar om 2 veckor), rekommenderas en sista koll på deras sociala medier. De kanske precis har publicerat ett lokalt handlingsprogram på Facebook som inte indexerats av sökmotorer ännu.

## 3. Besökarens och användarens perspektiv
Sajten är mycket gedigen och välstrukturerad, men det finns en risk att vissa besökare känner att den har "slagsida".

*   **Risk för "AI-övervikt":** Sajten profilerar sig som en objektiv plats för fakta om kommunvalet. Samtidigt finns det otroligt mycket innehåll dedikerat till Artificiell Intelligens (sidorna *AI i kommunen*, *Krönika*, *AI-partiet* och stor del av *Media*). AI är uppenbarligen en profilfråga för skaparna av sajten. Det är roligt och innovativt, men ur besökarens perspektiv kan det framstå som att sajten har en "dold agenda" att driva AI-frågan, snarare än att bara granska valet i sin helhet. Det nyanseras väl av era "trust-notes", men intrycket förblir tungt.
*   **"Din vardag" saknar de unga:** Under sektionen "Din vardag" sorteras innehållet mycket fint i "Förälder", "Pensionär", "Företagare" och "Landsbygdsbo". Ni missar dock en viktig målgrupp: **Förstagångsväljare / Unga vuxna**. Frågor som kollektivtrafik till Lund/Malmö, ungdomsbostäder, kultur (som Kvarnen) eller A-traktorer etc. är ofta avgörande för dem. Om underlaget tillåter, överväg att lägga till ett femte kort för "Ung i kommunen".
*   **Valkompassens "Vet ej":** Valkompassen på startsidan är briljant och lättillgänglig. Om en besökare klickar "Vet ej" på alla (eller majoriteten av) frågorna blir resultatet just nu att *"Du höll inte med om något av påståendena"*. Rent tekniskt fungerar det, men ur ett användarperspektiv kanske ett meddelande som uppmanar dem att utforska jämförelsevyn eller förtydligar att "Vet ej" inte ger utslag mot något block vore hjälpsamt.
*   **Den mänskliga kontexten bakom de stora besluten:** Ni nämner "Rivningen av Kvarnen/Magasinet (Elektrish)". För Höörs invånare är detta troligen en jättekänd debatt, men för en nyinflyttad besökare saknas lite kontext. (Varför ville vissa bygga ett synthmuseum just där?). Det behöver inte bli långt, men små korta "varför är detta en grej?"-meningar ökar läsförståelsen för de som inte läst lokaltidningen varje dag.

## Sammanfattning 
Texterna håller ihop väl. Tonen är seriös, datan är spårbar, och greppet att ställa block-narrativet (Alliansen vs De rödgröna) mot vad röstsiffrorna i fullmäktige faktiskt säger (Styret + SD = Sant) är oerhört stark lokaldemokratisk journalistik. Justera siffrorna kring budgetåren på startsidan och fundera över balansen mellan "lokalval" och "AI-experiment" så har ni en fantastisk tjänst inför den 13 september.
