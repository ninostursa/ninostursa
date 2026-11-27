"""Hilfsskript ElevenLabs:
  python voices.py list                 → verfügbare Stimmen mit Merkmalen
  python voices.py sample <id> <datei>  "<text>"  → Hörprobe als mp3
  python voices.py quota                → verbrauchte / verfügbare Zeichen
Der Schlüssel kommt aus .env (ELEVENLABS_API_KEY) und wird nie ausgegeben."""
import json, pathlib, sys, urllib.request

HERE = pathlib.Path(__file__).parent


def key():
    for d in [HERE, *HERE.parents]:
        f = d / ".env"
        if f.exists():
            for line in f.read_text(encoding="utf-8").splitlines():
                if line.strip().startswith("ELEVENLABS_API_KEY="):
                    return line.split("=", 1)[1].strip().strip('"')
    sys.exit("Kein ELEVENLABS_API_KEY in .env gefunden")


def get(url):
    req = urllib.request.Request(url, headers={"xi-api-key": key()})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


cmd = sys.argv[1] if len(sys.argv) > 1 else "list"
if cmd == "list":
    for v in get("https://api.elevenlabs.io/v1/voices")["voices"]:
        lab = v.get("labels") or {}
        print(f'{v["voice_id"]}  {v["name"][:28]:28}  {v.get("category",""):10}  {lab.get("gender","")}/{lab.get("age","")}/{lab.get("accent","")}  {lab.get("descriptive", lab.get("description",""))}  {lab.get("use_case","")}')
elif cmd == "quota":
    s = get("https://api.elevenlabs.io/v1/user/subscription")
    print(f'Tarif: {s.get("tier")}  verbraucht: {s.get("character_count")} / {s.get("character_limit")} Zeichen  Neustart: {s.get("next_character_count_reset_unix")}')
elif cmd == "sample":
    vid, out, text = sys.argv[2], sys.argv[3], sys.argv[4]
    body = json.dumps({"text": text, "model_id": "eleven_multilingual_v2",
                       "voice_settings": {"stability": .5, "similarity_boost": .75, "style": .3, "use_speaker_boost": True}}).encode()
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{vid}?output_format=mp3_44100_128",
                                 data=body, headers={"Content-Type": "application/json", "xi-api-key": key()})
    with urllib.request.urlopen(req, timeout=120) as r:
        pathlib.Path(out).write_bytes(r.read())
    print("gespeichert:", out)
