"""Parsar ut varje votering i KF-protokollen med namngiven röstlängd per parti.

Förutsätter att scripts/hamta-protokoll.py har körts och att PDF:erna
konverterats till text i arbetsmappens txt/:

    pdftotext -table -enc UTF-8 pdf/X.pdf txt/X.txt

(`-table` behövs — pdftotext här är Xpdf, inte poppler.)

    python scripts/parsa-voteringar.py [arbetsmapp]

Skriver voteringar.json (maskinläsbart) och rapport.txt (läsbar sammanställning)
i arbetsmappen. Självkontroll: antalet namngivna ledamöter jämförs med
protokollets egna röstsiffror och avvikelser flaggas med "<-- KOLLA". Vid
senaste körningen (2026-08-16) var det 0 avvikelser på 31 voteringar.
"""
import glob
import json
import os
import re
import sys
import tempfile

SKRAP = re.compile(
    r"^\s*(Justerandes signatur|Utdragsbestyrkande|PROTOKOLL|Sammanträdesdatum|"
    r"Kommunfullmäktige\s*$|Sida\s*$|\d+\(\d+\)\s*$|\d{4}-\d{2}-\d{2}\s*$)"
)
PAR = re.compile(r"^\s{8,}§\s*(\d+)\s+(\S.*)$")
NAMN = re.compile(r"([A-ZÅÄÖ][\w'\-]*(?:\s+[\w'\-\.]+)*?)\s*\((M|C|L|KD|S|V|MP|SD|MED)\)")
PARTIER = ("M", "C", "L", "KD", "S", "V", "MP", "SD", "MED")


def stada(fil):
    """Ger (rader, parlista) där sidhuvud/sidfot är bortstädat och parlista[i]
    är den paragraf rad i tillhör."""
    rader, parlista = [], []
    aktuell = None
    for rad in open(fil, encoding="utf-8", errors="replace").read().splitlines():
        if SKRAP.match(rad):
            continue
        m = PAR.match(rad)
        if m and "...." not in m.group(2):
            aktuell = [m.group(1), m.group(2).strip()]
            rader.append(rad.strip())
            parlista.append(aktuell)
            continue
        if not rad.strip():
            continue
        rader.append(rad.strip())
        parlista.append(aktuell)
    return rader, parlista


def hop(rader, i, j):
    return re.sub(r"\s+", " ", " ".join(rader[i:j])).strip()


def parsa_namn(text):
    return [(m.group(1).strip(), m.group(2)) for m in NAMN.finditer(text)]


def parsa_fil(fil, datum, alla):
    rader, parlista = stada(fil)
    # Innehållsförteckningen har de fullständiga ärenderubrikerna; brödtextens
    # rubriker är radbrutna och blir stympade.
    rat = re.sub(r"\s+", " ", "\n".join(rader))
    toc = {nr: re.sub(r"\s+", " ", t).strip()
           for nr, t in re.findall(r"§\s*(\d+)\s+(.+?)\s*\.{4,}\s*\d+", rat, re.S)}
    fn = os.path.basename(fil)

    for i, rad in enumerate(rader):
        if "Omröstningen genomförs" not in rad and "Omröstningen utfaller" not in rad:
            continue
        # Blocket börjar efter föregående omröstning och slutar före nästa, så att
        # två voteringar i samma paragraf inte blandar ihop sina röstlängder.
        start = max(0, i - 40)
        for k in range(i - 1, start, -1):
            if "Omröstningen genomförs" in rader[k] or "Omröstningen utfaller" in rader[k]:
                start = k + 1
                break
        slut = i + 1
        while slut < len(rader) and slut < i + 60:
            r = rader[slut]
            if (PAR.match(" " * 10 + r) or r.startswith("Beslutsunderlag")
                    or r.startswith("Beslutet ska skickas")
                    or "Omröstningen genomförs" in r or "Omröstningen utfaller" in r
                    or r.startswith("Kommunfullmäktige godkänner följande beslutsordning")):
                break
            slut += 1
        fore = hop(rader, start, i)
        block = hop(rader, i, slut)

        # När en paragraf har flera omröstningar räknas ALLA beslutsordningar upp
        # före den första omröstningsresultatet — para ihop dem i dokumentordning.
        par_start = i
        while par_start > 0 and not (parlista[par_start - 1] and parlista[i]
                                     and parlista[par_start - 1] != parlista[i]):
            par_start -= 1
        ordningar = re.findall(
            r"JA\s*=\s*(.+?)\s*NEJ\s*=\s*(.+?)(?=\s*(?:AVSTÅR\s*=|Omröstningsresultat|JA\s*=)|$)",
            hop(rader, par_start, i), re.S)
        paragraf = parlista[i][0] if parlista[i] else None
        nr = sum(1 for v in alla if v["fil"] == fn and v["paragraf"] == paragraf)
        ordning = None
        if ordningar:
            ordning = ordningar[nr] if nr < len(ordningar) else ordningar[-1]

        resultat = re.search(
            r"(\d+)\s*(?:ledamot|ledamöter)\s*röstar JA[,\s]*(?:och\s*)?"
            r"(\d+)\s*(?:ledamot|ledamöter)\s*röstar NEJ"
            r"(?:[,\s]*och\s*(\d+)\s*(?:ledamot|ledamöter)\s*AVSTÅR)?", block)

        ja_text = re.search(r"röstar JA:(.+?)(?:Följande ledamöter röstar NEJ|$)", block, re.S)
        # OBS: "ledam\w+", inte "ledamo\w+" — plural är "ledamöter", utan o.
        nej_text = re.search(r"röstar NEJ:(.+?)(?:Följande ledam\w+ AVSTÅR|Beslutsunderlag|$)",
                             block, re.S)
        avs_text = re.search(r"AVSTÅR från att rösta:(.+?)(?:Beslutsunderlag|$)", block, re.S)

        # Avvikande format: "Namn (Parti) - JA" rad för rad i stället för tre
        # samlade listor. Förekommer i KF 2025-08-27 § 99 (Seniorkort 70+).
        upprop = None
        if not (ja_text or nej_text):
            upprop = re.findall(
                r"([A-ZÅÄÖ][\w'\- ]*?)\s*\((M|C|L|KD|S|V|MP|SD|MED)\)\s*[-–]\s*(JA|NEJ|AVSTÅR)",
                fore + " " + block)
            ja_par = [(n.strip(), p) for n, p, u in upprop if u == "JA"]
            nej_par = [(n.strip(), p) for n, p, u in upprop if u == "NEJ"]
            avs_par = [(n.strip(), p) for n, p, u in upprop if u == "AVSTÅR"]
        else:
            ja_par = parsa_namn(ja_text.group(1)) if ja_text else []
            nej_par = parsa_namn(nej_text.group(1)) if nej_text else []
            avs_par = parsa_namn(avs_text.group(1)) if avs_text else []

        if upprop and not resultat:
            lika = re.search(r"lika röstetal,?\s*(\d+)\s*Ja-röster och\s*(\d+)\s*Nej-röster", block)
            antal_ja = int(lika.group(1)) if lika else len(ja_par)
            antal_nej = int(lika.group(2)) if lika else len(nej_par)
        else:
            antal_ja = int(resultat.group(1)) if resultat else None
            antal_nej = int(resultat.group(2)) if resultat else None

        per_parti = {}
        for utfall, lista in (("ja", ja_par), ("nej", nej_par), ("avstar", avs_par)):
            for _, parti in lista:
                per_parti.setdefault(parti, {"ja": 0, "nej": 0, "avstar": 0})[utfall] += 1

        alla.append({
            "datum": datum,
            "fil": fn,
            "paragraf": paragraf,
            "rubrik": toc.get(paragraf, parlista[i][1] if parlista[i] else None),
            "ja_betyder": ordning[0].strip() if ordning else None,
            "nej_betyder": ordning[1].strip() if ordning else None,
            "antal_ja": antal_ja,
            "antal_nej": antal_nej,
            "antal_avstar": (int(resultat.group(3)) if resultat and resultat.group(3)
                             else len(avs_par)),
            "per_parti": per_parti,
            "utfall": block[:600],
            "ja": ja_par,
            "nej": nej_par,
            "avstar": avs_par,
        })


def main():
    arb = sys.argv[1] if len(sys.argv) > 1 else os.path.join(tempfile.gettempdir(), "hoorprot")
    txt = os.path.join(arb, "txt")
    moten = json.load(open(os.path.join(arb, "moten.json"), encoding="utf-8"))
    motesdatum = {m["id"]: re.search(r"(20\d\d-\d\d-\d\d)", m["title"]).group(1) for m in moten}

    # Ett protokoll (KF 2025-08-27) heter bara "Protokoll" utan datum i filnamnet,
    # därför matchas mötesdatumet på id-prefixet i stället.
    filer = sorted(
        (f for f in glob.glob(os.path.join(txt, "*.txt")) if "bilaga" not in f.lower()
         and "anteckning" not in f.lower()),
        key=lambda p: int(os.path.basename(p).split("_")[0]),
    )
    alla = []
    for fil in filer:
        parsa_fil(fil, motesdatum[os.path.basename(fil).split("_")[0]], alla)

    with open(os.path.join(arb, "voteringar.json"), "w", encoding="utf-8") as f:
        json.dump(alla, f, ensure_ascii=False, indent=1)

    rader = [f"{len(alla)} voteringar", ""]
    for v in alla:
        summa = sum(sum(d.values()) for d in v["per_parti"].values())
        angivet = (v["antal_ja"] or 0) + (v["antal_nej"] or 0) + v["antal_avstar"]
        flagga = "  <-- KOLLA" if summa != angivet else ""
        rader.append(f"{v['datum']} § {v['paragraf']} — {v['rubrik']}")
        rader.append(f"   {v['antal_ja']}–{v['antal_nej']}–{v['antal_avstar']} "
                     f"(namngivna: {summa}){flagga}")
        rader.append(f"   JA = {v['ja_betyder']}")
        rader.append(f"   NEJ = {v['nej_betyder']}")
        for parti in PARTIER:
            if parti in v["per_parti"]:
                d = v["per_parti"][parti]
                rader.append(f"     {parti:<4} ja {d['ja']:>2}  nej {d['nej']:>2} "
                             f" avstår {d['avstar']:>2}")
        rader.append("")
    text = "\n".join(rader)
    with open(os.path.join(arb, "rapport.txt"), "w", encoding="utf-8") as f:
        f.write(text)
    print(text)


if __name__ == "__main__":
    main()
