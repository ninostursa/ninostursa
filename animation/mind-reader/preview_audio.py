"""Hörprobe der Erzählung: alle Clips an ihren Zeitpunkten → Datei aus argv[1] (Standard: preview.mp3)."""
import json, pathlib, subprocess, sys

HERE = pathlib.Path(__file__).parent
out = sys.argv[1] if len(sys.argv) > 1 else str(HERE / "preview.mp3")
tl = json.loads((HERE / "timeline.json").read_text(encoding="utf-8"))
args, f = ["ffmpeg", "-loglevel", "error", "-y"], ""
for i, c in enumerate(tl["clips"]):
    args += ["-i", str(HERE / "audio" / (c["id"] + ".mp3"))]
    ms = int(c["start"] * 1000)
    f += f"[{i}]adelay={ms}|{ms}[a{i}];"
n = len(tl["clips"])
f += "".join(f"[a{i}]" for i in range(n)) + f"amix=inputs={n}:normalize=0,apad=whole_dur={tl['duration']}[o]"
subprocess.run(args + ["-filter_complex", f, "-map", "[o]", "-b:a", "160k", out], check=True)
print("Hörprobe:", out)
