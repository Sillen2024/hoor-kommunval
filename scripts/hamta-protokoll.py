"""Hämtar samtliga KF-protokoll från Höörs Ciceron-portal.

API:et är dokumenterat i KALLLUCKOR-RAPPORT.md §1. Skriptet körs för hand och
laddar ner ~28 MB PDF till en arbetsmapp UTANFÖR repot (Dropbox-synken ska inte
behöva hantera dem, och de behövs bara som mellanled).

    python scripts/hamta-protokoll.py [arbetsmapp]

Standardmapp är %TEMP%/hoorprot. Skriptet skriver:
    moten.json     — listan över de 27 sammanträdena (id -> datum)
    detaljer.json  — ReadObjectDetails per möte, inkl. dagordning och bilagor
    pdf/           — protokoll och protokollsbilagor (reservationer, yrkanden)

Nästa steg är `pdftotext -table -enc UTF-8` till txt/ och sedan
scripts/parsa-voteringar.py. Se ROSTDATA_PLAN.md.
"""
import json
import os
import sys
import tempfile
import time
import urllib.request

BASE = "https://sok-hr.unikom.se"
session_id = None


def rpc(method, params):
    global session_id
    body = {"jsonrpc": "2.0", "method": f"CiceronsokServer:{method}", "params": params}
    if session_id:
        body["session_id"] = session_id
    req = urllib.request.Request(
        f"{BASE}/json",
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )
    # Portalen svarar sporadiskt med 502; den återhämtar sig på några sekunder.
    for forsok in range(5):
        try:
            with urllib.request.urlopen(req, timeout=90) as r:
                data = json.loads(r.read().decode("utf-8"))
            break
        except Exception as e:  # noqa: BLE001
            print(f"    retry {forsok + 1} ({e})", flush=True)
            time.sleep(3 * (forsok + 1))
    else:
        raise RuntimeError(f"{method} misslyckades efter 5 försök")

    if "session_id" in data:
        session_id = data["session_id"]
    # Search svarar under result.result (JSON-sträng), ReadItems under result.results.
    outer = data.get("result", {})
    res = outer.get("result", outer)
    if isinstance(res, str):
        try:
            return json.loads(res)
        except json.JSONDecodeError:
            return res
    return res


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(tempfile.gettempdir(), "hoorprot")
    os.makedirs(out, exist_ok=True)

    hits = rpc("Search", {
        "search_id": "ciceronsok_search",
        "doctype": 64,
        "text": "",
        "param": json.dumps({"diary": "KSF", "board": "Kommunfullmäktige",
                             "from_date": "", "to_date": ""}, ensure_ascii=False),
    })
    n = hits["hits"]
    print(f"{n} protokoll -> {out}", flush=True)

    items = rpc("ReadItems", {"search_id": "ciceronsok_search", "offset": 0, "limit": n})
    results = items["results"] if isinstance(items, dict) else items
    with open(os.path.join(out, "moten.json"), "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=1)

    alla = []
    for it in results:
        det = rpc("ReadObjectDetails", {"search_id": "ciceronsok_search", "id": str(it["id"])})
        if isinstance(det, dict) and isinstance(det.get("value"), str):
            det = json.loads(det["value"])
        alla.append({"item": it, "detail": det})
        print(f"  {it['id']:>3} {it.get('title')}", flush=True)
        time.sleep(0.3)

    with open(os.path.join(out, "detaljer.json"), "w", encoding="utf-8") as f:
        json.dump(alla, f, ensure_ascii=False, indent=1)

    pdfdir = os.path.join(out, "pdf")
    os.makedirs(pdfdir, exist_ok=True)
    for rec in alla:
        det = rec["detail"]
        docs = det.get("documents", []) if isinstance(det, dict) else []
        for d in docs:
            namn = (d.get("name") or d.get("title") or "").lower()
            if "protokoll" not in namn and "protokoll" not in (d.get("filename") or "").lower():
                continue
            basnamn = f"{rec['item']['id']}_{d.get('filename', 'p')}"
            for tecken in '§:*?"<>|/\\':
                basnamn = basnamn.replace(tecken, "-")
            if not basnamn.lower().endswith(".pdf"):
                basnamn += ".pdf"
            target = os.path.join(pdfdir, basnamn)
            if os.path.exists(target):
                continue
            # filename_b64 måste kopieras rakt av — servern kodar å/ä/ö/§ med en
            # icke-UTF8-tabell och en egen omkodning ger en HTML-felsida i stället.
            url = (f"{BASE}/download/document?filename={d['filename_b64']}"
                   f"&id={d['id']}&session_id={session_id}")
            try:
                with urllib.request.urlopen(url, timeout=120) as r:
                    blob = r.read()
            except Exception as e:  # noqa: BLE001
                print(f"  FEL {basnamn}: {e}", flush=True)
                continue
            if blob[:4] != b"%PDF":
                print(f"  EJ PDF {basnamn} ({len(blob)} b)", flush=True)
                continue
            with open(target, "wb") as f:
                f.write(blob)
            print(f"  sparade {basnamn} ({len(blob) // 1024} kB)", flush=True)
            time.sleep(0.3)


if __name__ == "__main__":
    sys.exit(main())
