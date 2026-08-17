"""Transkribera ljudfiler till WebVTT med KB-Whisper (svensk Whisper från KBLab).

Användning:
    python scripts/transkribera.py <mapp-med-ljudfiler> [--modell KBLab/kb-whisper-medium]

Skriver en .vtt bredvid varje ljudfil. Hoppar över filer som redan har en .vtt.
"""

import argparse
import pathlib
import sys

from faster_whisper import WhisperModel

LJUDFORMAT = {".mp3", ".m4a", ".wav", ".mp4", ".webm", ".opus"}


def tidsstampel(sekunder: float) -> str:
    timmar, rest = divmod(sekunder, 3600)
    minuter, sek = divmod(rest, 60)
    return f"{int(timmar):02d}:{int(minuter):02d}:{sek:06.3f}"


def transkribera(model: WhisperModel, ljudfil: pathlib.Path) -> str:
    segment, info = model.transcribe(str(ljudfil), language="sv", vad_filter=True)
    rader = ["WEBVTT", "Kind: captions", "Language: sv", ""]
    antal = 0
    for i, seg in enumerate(segment, start=1):
        text = seg.text.strip()
        if not text:
            continue
        rader += [str(i), f"{tidsstampel(seg.start)} --> {tidsstampel(seg.end)}", text, ""]
        antal += 1
    if antal == 0:
        return ""
    return "\n".join(rader)


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("mapp", type=pathlib.Path)
    p.add_argument("--modell", default="KBLab/kb-whisper-medium")
    args = p.parse_args()

    filer = sorted(f for f in args.mapp.iterdir() if f.suffix.lower() in LJUDFORMAT)
    if not filer:
        print(f"Inga ljudfiler i {args.mapp}")
        return 1

    print(f"Laddar {args.modell} ...")
    model = WhisperModel(args.modell, device="cpu", compute_type="int8")

    for f in filer:
        ut = f.with_suffix(".vtt")
        if ut.exists():
            print(f"hoppar över {f.name} (vtt finns)")
            continue
        print(f"transkriberar {f.name} ...", flush=True)
        vtt = transkribera(model, f)
        if not vtt:
            print(f"  inget tal hittat i {f.name}")
            continue
        ut.write_text(vtt, encoding="utf-8")
        print(f"  -> {ut.name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
