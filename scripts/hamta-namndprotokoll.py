"""Hämtar nämndprotokoll från Höörs Ciceron-portal (TASK punkt 21).

Samma API-flöde som hamta-protokoll.py (KALLLUCKOR-RAPPORT.md §1) men för
facknämnderna. Kör från en arbetsmapp UTANFÖR repot (Dropbox-synken ska inte
hantera PDF:erna):

    python scripts/hamta-namndprotokoll.py diaries          # lista alla nämnder
    python scripts/hamta-namndprotokoll.py search <nämnd>   # skriver moten_<nämnd>.json
    python scripts/hamta-namndprotokoll.py fetch <nämnd>    # laddar ner till pdf/<nämnd>/

<nämnd> är en av: bun, sn, nkaf, ttn, vr, va. Sedan pdftotext -table -enc UTF-8.
Utfallet av genomsökningen 2026-08-17 står i NAMNDDATA_REKOGNOSERING.md.
"""
import json
import os
import sys
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
    for forsok in range(5):
        try:
            with urllib.request.urlopen(req, timeout=90) as r:
                data = json.loads(r.read().decode("utf-8"))
            break
        except Exception as e:  # noqa: BLE001
            print(f"    retry {forsok + 1} ({e})", flush=True)
            time.sleep(3 * (forsok + 1))
    else:
        raise RuntimeError(f"{method} misslyckades efter 5 forsok")

    if "session_id" in data:
        session_id = data["session_id"]
    outer = data.get("result", {})
    res = outer.get("result", outer) if isinstance(outer, dict) else outer
    if isinstance(res, str):
        try:
            return json.loads(res)
        except json.JSONDecodeError:
            return res
    return res


def main():
    lage = sys.argv[1] if len(sys.argv) > 1 else "diaries"

    if lage == "diaries":
        res = rpc("ReadDiaries", {})
        print(json.dumps(res, ensure_ascii=False, indent=1))

    elif lage == "search":
        # python recon_namnder.py search <bun|sn>
        NAMNDER = {
            "bun": ("BUN", "Barn- och utbildningsnämnden"),
            "sn": ("SN", "Socialnämnden"),
            "nkaf": ("NKAF", "Nämnden för kultur, arbete och folkhälsa"),
            "ttn": ("TTN", "Tillstånds- och tillsynsnämnden"),
            "vr": ("VR", "Nämnden för VA och Räddningstjänst"),
            "va": ("VA", "VA-nämnden"),
        }
        diary, board = NAMNDER[sys.argv[2]]
        hits = rpc("Search", {
            "search_id": "ciceronsok_search",
            "doctype": 64,
            "text": "",
            "param": json.dumps({"diary": diary, "board": board,
                                 "from_date": "", "to_date": ""}, ensure_ascii=False),
        })
        n = hits["hits"]
        print(f"{n} traffar for diary={diary!r} board={board!r}")
        if n:
            items = rpc("ReadItems", {"search_id": "ciceronsok_search", "offset": 0, "limit": n})
            results = items["results"] if isinstance(items, dict) else items
            with open(f"moten_{sys.argv[2]}.json", "w", encoding="utf-8") as f:
                json.dump(results, f, ensure_ascii=False, indent=1)
            for it in results:
                print(f"  {it['id']:>4} {it.get('title')}".encode("ascii", "replace").decode())

    elif lage == "fetch":
        # python recon_namnder.py fetch <bun|sn> — laddar ner protokoll-PDF:erna
        kort = sys.argv[2]
        with open(f"moten_{kort}.json", encoding="utf-8") as f:
            results = json.load(f)
        pdfdir = os.path.join("pdf", kort)
        os.makedirs(pdfdir, exist_ok=True)
        # Search maste koras om i samma session for att ReadObjectDetails ska funka
        NAMNDER = {
            "bun": ("BUN", "Barn- och utbildningsnämnden"),
            "sn": ("SN", "Socialnämnden"),
            "nkaf": ("NKAF", "Nämnden för kultur, arbete och folkhälsa"),
            "ttn": ("TTN", "Tillstånds- och tillsynsnämnden"),
            "vr": ("VR", "Nämnden för VA och Räddningstjänst"),
            "va": ("VA", "VA-nämnden"),
        }
        diary, board = NAMNDER[kort]
        rpc("Search", {
            "search_id": "ciceronsok_search",
            "doctype": 64,
            "text": "",
            "param": json.dumps({"diary": diary, "board": board,
                                 "from_date": "", "to_date": ""}, ensure_ascii=False),
        })
        rpc("ReadItems", {"search_id": "ciceronsok_search", "offset": 0, "limit": len(results)})
        for it in results:
            det = rpc("ReadObjectDetails", {"search_id": "ciceronsok_search", "id": str(it["id"])})
            if isinstance(det, dict) and isinstance(det.get("value"), str):
                det = json.loads(det["value"])
            docs = det.get("documents", []) if isinstance(det, dict) else []
            for d in docs:
                namn = (d.get("name") or d.get("title") or "").lower()
                fil = (d.get("filename") or "").lower()
                if "protokoll" not in namn and "protokoll" not in fil:
                    continue
                basnamn = f"{it['id']}_{d.get('filename', 'p')}"
                for tecken in '§:*?"<>|/\\':
                    basnamn = basnamn.replace(tecken, "-")
                if not basnamn.lower().endswith(".pdf"):
                    basnamn += ".pdf"
                target = os.path.join(pdfdir, basnamn)
                if os.path.exists(target):
                    continue
                url = (f"{BASE}/download/document?filename={d['filename_b64']}"
                       f"&id={d['id']}&session_id={session_id}")
                try:
                    with urllib.request.urlopen(url, timeout=120) as r:
                        blob = r.read()
                except Exception as e:  # noqa: BLE001
                    print(f"  FEL {basnamn}: {e}".encode("ascii", "replace").decode(), flush=True)
                    continue
                if blob[:4] != b"%PDF":
                    print(f"  EJ PDF {basnamn} ({len(blob)} b)".encode("ascii", "replace").decode(), flush=True)
                    continue
                with open(target, "wb") as f:
                    f.write(blob)
                print(f"  sparade {basnamn} ({len(blob) // 1024} kB)".encode("ascii", "replace").decode(), flush=True)
                time.sleep(0.3)


if __name__ == "__main__":
    sys.exit(main())
