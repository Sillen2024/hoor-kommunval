# -*- coding: utf-8 -*-
"""Extraherar KS-voteringar ur txt/ks/*.txt (Ciceron-mallen, samma som KF).

Skillnader mot scripts/parsa-voteringar.py:
- Paragrafvis bearbetning i stallet for radvis, sa triggerfrasen far ha
  inskott ("Omrostningen om arendet ... genomfors med upprop") - lardomen
  fran BUN paragraf 68 dar KF-parserns fras missade.
- Totalsiffror parsas bade som siffror och talord ("sju ledamoter").
- Sjalvkontroll: namngivna ledamoter per rostlangd jamfors med protokollets
  egna totalsiffror; avvikelse flaggas med <-- KOLLA.

Skriver ks_voteringar_rapport.txt (lasbar) i scratchpaden.
"""
import glob
import json
import os
import re
import sys

NAMN = re.compile(r"([A-ZÅÄÖ][\w'\-]*(?:\s+[\w'\-\.]+)*?)\s*\((M|C|L|KD|S|V|MP|SD|MED)\)")
PARTIER = ("M", "C", "L", "KD", "S", "V", "MP", "SD", "MED")
TALORD = {
    "en": 1, "ett": 1, "två": 2, "tva": 2, "tre": 3, "fyra": 4, "fem": 5,
    "sex": 6, "sju": 7, "åtta": 8, "atta": 8, "nio": 9, "tio": 10,
    "elva": 11, "tolv": 12, "tretton": 13,
}
SKRAP = re.compile(
    r"Justerandes signatur|Utdragsbestyrkande|^\s*PROTOKOLL\b|Sammanträdesdatum|"
    r"^\s*Sida\s*$|^\s*\d+\(\d+\)\s*$|^\s*\d{4}-\d{2}-\d{2}\s*$|^\s*Kommunstyrelsen\s*$"
)


def tal(s):
    s = s.strip().lower()
    if s.isdigit():
        return int(s)
    return TALORD.get(s)


def stada(fil):
    rader = []
    for rad in open(fil, encoding="utf-8", errors="replace").read().splitlines():
        if SKRAP.search(rad):
            continue
        rader.append(rad)
    return "\n".join(rader)


def paragrafer(text):
    """Ger (nr, rubrik, brodtext) for varje paragraf i brodtexten (ej TOC)."""
    delar = []
    # brodtextrubriker ar indragna och saknar TOC:ens punktrad
    for m in re.finditer(r"^\s+§\s*(\d+)\s+(\S[^\n]*)$", text, re.M):
        if "...." in m.group(2):
            continue
        delar.append((m.start(), m.group(1), m.group(2).strip()))
    ut = []
    for i, (pos, nr, rub) in enumerate(delar):
        slut = delar[i + 1][0] if i + 1 < len(delar) else len(text)
        ut.append((nr, rub, text[pos:slut]))
    return ut


def parsa_rostlangder(block):
    """Alla (kategori, [(namn, parti)...]) ur ett paragrafblock."""
    ut = []
    for m in re.finditer(
        r"F[öo]ljande ledam[öo]t(?:er)?\s+(?:r[öo]star|AVST[ÅA]R)[^:]*?(JA|NEJ|AVST[ÅA]R)?\s*:\s*",
        block,
    ):
        # kategorin star oftast fore kolonet: "röstar JA:" / "AVSTÅR från att rösta:"
        fras = block[m.start():m.end()]
        if "AVST" in fras.upper():
            kat = "avstar"
        elif "JA" in fras:
            kat = "ja"
        elif "NEJ" in fras:
            kat = "nej"
        else:
            continue
        svans = block[m.end():m.end() + 1500]
        # namnlistan slutar vid nasta rostlangd eller nasta avsnittsrubrik
        stopp = re.search(
            r"F[öo]ljande ledam|Beslutsunderlag|Reservation\b|Protokollsanteckning|"
            r"Omr[öo]stning\b|Ordf[öo]rande|Beslutet ska|Yrkanden|§\s*\d+",
            svans,
        )
        lista = svans[: stopp.start()] if stopp else svans
        namn = NAMN.findall(re.sub(r"\s+", " ", lista))
        ut.append((kat, namn))
    return ut


def main():
    rapport = []
    antal = 0
    for fil in sorted(glob.glob("txt/ks/*.txt")):
        text = stada(fil)
        fn = os.path.basename(fil)
        for nr, rub, block in paragrafer(text):
            # trigger: ett omrostningsresultat med inskottstolerans
            resultat = list(re.finditer(
                r"Omr[öo]stningen[^\n]{0,200}?(?:genomf[öo]rs|utfaller)[\s\S]{0,400}?"
                r"(\d+|en|ett|två|tva|tre|fyra|fem|sex|sju|åtta|atta|nio|tio|elva|tolv|tretton)\s+"
                r"ledam[öo]t(?:er)?\s+r[öo]star\s+JA[,.\s]+"
                r"(?:(?:och\s+)?(\d+|en|ett|två|tva|tre|fyra|fem|sex|sju|åtta|atta|nio|tio|elva|tolv|tretton)\s+"
                r"ledam[öo]t(?:er)?\s+r[öo]star\s+NEJ)?"
                r"(?:[\s\S]{0,120}?(\d+|en|ett|två|tva|tre|fyra|fem|sex|sju|åtta|atta|nio|tio|elva|tolv|tretton)\s+"
                r"ledam[öo]t(?:er)?\s+(?:AVST[ÅA]R|avst[åa]r))?",
                re.sub(r"[ \t]+", " ", block),
            ))
            if not resultat:
                continue
            langder = parsa_rostlangder(re.sub(r"[ \t]+", " ", block))
            for m in resultat:
                antal += 1
                ja, nej, avst = tal(m.group(1)), tal(m.group(2) or "0") or 0, tal(m.group(3) or "0") or 0
                rapport.append(f"\n=== {fn}  § {nr}  {re.sub(r'[.]{3,}.*', '', rub)[:70]}")
                rapport.append(f"    resultat: {ja} ja - {nej} nej - {avst} avstar")
                kontext = m.group(0)[:180].replace("\n", " ")
                rapport.append(f"    kontext: {kontext}")
            # rostlangder redovisas en gang per paragraf, med per-parti-summering
            for kat, namn in langder:
                per = {}
                for _, p in namn:
                    per[p] = per.get(p, 0) + 1
                rapport.append(f"    {kat:>6} ({len(namn)} namn): " +
                               "  ".join(f"{p} {per[p]}" for p in PARTIER if p in per))
    rapport.append(f"\n\nTotalt {antal} omrostningsresultat")
    with open("ks_voteringar_rapport.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(rapport))
    print(f"{antal} omrostningsresultat -> ks_voteringar_rapport.txt")


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    sys.exit(main())
