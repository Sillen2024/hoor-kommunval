// Partiernas egna rubriker (politikomrade i partier.json) är fritext från deras
// egna sajter och skiljer sig åt även när sakinnehållet är samma tema ("Skola" vs
// "Skola och elevhälsa" vs "Vård och hälsa" osv). Kartan grupperar dem under
// gemensamma, jämförbara teman utan att röra datafilen. Partiets egen rubrik
// visas fortfarande på varje kort.
//
// Delas av /jamforelse/, /din-vardag/ och Utfall.astro. Tidigare låg kartan
// kopierad i varje sida och hann glida isär (sex rubriker saknades i
// /din-vardag/). Nya rubriker läggs bara till här.
export const TEMA_KARTA: Record<string, string> = {
  "Skola": "Skola och barnomsorg",
  "Skola och elevhälsa": "Skola och barnomsorg",
  "Barn och unga": "Skola och barnomsorg",

  "Vård": "Vård och omsorg",
  "Vård och omsorg": "Vård och omsorg",
  "Vård och hälsa": "Vård och omsorg",
  "Vård, trygghet och familj": "Vård och omsorg",
  "Äldreomsorg": "Vård och omsorg",
  "Välfärd": "Vård och omsorg",

  "Trygghet": "Trygghet och migration",
  "Migration": "Trygghet och migration",
  "Frihet och trygghet": "Trygghet och migration",

  "Vatten och avlopp": "Trafik, infrastruktur och bostäder",
  "Kollektivtrafik": "Trafik, infrastruktur och bostäder",
  "Trafik och ekonomi": "Trafik, infrastruktur och bostäder",
  "Trafik": "Trafik, infrastruktur och bostäder",
  "Infrastruktur": "Trafik, infrastruktur och bostäder",
  "Transporter": "Trafik, infrastruktur och bostäder",
  "Bostäder": "Trafik, infrastruktur och bostäder",

  "Natur och rekreation": "Miljö, klimat och landsbygd",
  "Natur och friluftsliv": "Miljö, klimat och landsbygd",
  "Miljö och landsbygd": "Miljö, klimat och landsbygd",
  "Miljö och VA": "Miljö, klimat och landsbygd",
  "Landsbygd": "Miljö, klimat och landsbygd",
  "Klimat och miljö": "Miljö, klimat och landsbygd",

  "Näringsliv": "Näringsliv och ekonomi",
  "Ekonomi": "Näringsliv och ekonomi",
  "Ekonomi och skatt": "Näringsliv och ekonomi",

  "Idrott och fritid": "Kultur, fritid och folkhälsa",
  "Fritid och idrott": "Kultur, fritid och folkhälsa",
  "Kultur och fritid": "Kultur, fritid och folkhälsa",
  "Kultur": "Kultur, fritid och folkhälsa",
  "Folkhälsa och kultur": "Kultur, fritid och folkhälsa",

  "Demokrati": "Demokrati och lokalt inflytande",
};

export const TEMA_ORDNING = [
  "Skola och barnomsorg",
  "Vård och omsorg",
  "Trygghet och migration",
  "Trafik, infrastruktur och bostäder",
  "Miljö, klimat och landsbygd",
  "Näringsliv och ekonomi",
  "Kultur, fritid och folkhälsa",
  "Demokrati och lokalt inflytande",
];

// Kolada etapp 3 (KOLADA_PLAN.md §6): vilka nyckeltal som beskriver utfallet
// inom respektive tema. Teman som saknas här har inga nyckeltal i sajtens
// Kolada-uttag (trygghet, trafik, miljö m.fl.) — frånvaron är medveten, och
// Utfall.astro renderar då ingenting. dec = antal decimaler i visningen.
export const TEMA_NYCKELTAL: Record<string, { id: string; dec: number }[]> = {
  "Skola och barnomsorg": [
    { id: "N11024", dec: 1 }, // nettokostnadsavvikelse förskola, %
    { id: "N11102", dec: 1 }, // barn per årsarbetare, förskola
    { id: "N15001", dec: 1 }, // nettokostnadsavvikelse grundskola, %
    { id: "N15033", dec: 1 }, // elever per lärare, grundskola
    { id: "N15507", dec: 0 }, // meritvärde årskurs 9
    { id: "N15428", dec: 1 }, // behöriga till yrkesprogram, %
  ],
  "Vård och omsorg": [
    { id: "N20900", dec: 1 }, // nettokostnadsavvikelse äldreomsorg, %
    { id: "U23401", dec: 0 }, // väntetid till särskilt boende, dagar
    { id: "N30001", dec: 1 }, // nettokostnadsavvikelse IFO, %
  ],
  "Näringsliv och ekonomi": [
    { id: "N00901", dec: 2 }, // kommunal skattesats
    { id: "N03001", dec: 1 }, // resultat, % av skatt + generella bidrag
    { id: "N03106", dec: 1 }, // soliditet, %
    { id: "N00097", dec: 1 }, // nettokostnadsavvikelse totalt (exkl. LSS), %
  ],
};
