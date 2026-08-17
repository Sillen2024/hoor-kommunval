## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Redaktionsregler (Fabel-granskningen 2026-08-17, §7)

Reglerna hindrar att presentationen växer tillbaka till försvarsskrift:

1. **Svaret först.** Varje sida och varje avsnitt börjar med slutsatsen i klarspråk, max 20 ord. Metod, förbehåll och termer kommer efter.
2. **En brasklapp per sida i löptext.** Resten i `<details>`, fotnot eller Om urvalet.
3. **LIX ≤ 45** på all prosa sajten själv skriver (citat från partier/protokoll undantagna). Mät på byggd HTML innan commit: `node scripts/lix.mjs`.
4. **Rubriker är läsarens frågor**, inte förvaltningens substantiv. ("Lägger Höör mer eller mindre än andra?" — inte "Nettokostnadsavvikelse totalt".)
5. **Max en länk till /om-urvalet/ per sida** (utöver sidfoten).
6. **Berätta aldrig hur datan hämtades i läsartext.** Det står på Om urvalet.
7. **En rangordning är inte en åsikt** om grunden är utskriven. Sortera efter det som berör flest/mest pengar/störst avvikelse — och skriv ut vilket.
8. **Varje stort tal får en jämförelsepunkt i samma mening.** ("130 mnkr — ungefär en tiondel av kommunens årsbudget.")
9. **Frågor till läsaren är sajtens enda tillåtna vägledning.** ("Vad väger tyngst för dig: …?")
10. **Skriv för en klok granne som aldrig läst ett protokoll.** Inte för granskaren som ska underkänna sajten — hon är redan nöjd; källorna finns.
