"""Erzähltext für "Patent Future – File 002: The Mind Reader".

Stimmen (ElevenLabs):
  N = Erzähler – Jarnathan (feste Kanalstimme)
  T = Tom      – Will (Relaxed Optimist)
Aufruf:  python narration.py   → audio/<id>.mp3 + timeline.json
         python narration.py s07  → nur diesen Clip neu sprechen
"""
import json, pathlib, subprocess, urllib.request, sys

HERE = pathlib.Path(__file__).parent
AUDIO = HERE / "audio"
AUDIO.mkdir(exist_ok=True)

VOICES = {
    "N": ("c6SfcYrb2t09NHXiT80T", {"stability": .75, "similarity_boost": .75, "style": 0.0, "use_speaker_boost": True, "speed": 1.1}),
    "T": ("bIHbv24MWmeRgasZH58o", {"stability": .5, "similarity_boost": .75, "style": 0.3, "use_speaker_boost": True}),
}


def b(x):
    return f' <break time="{x}s" /> '


# (id, Stimme, Text, Pause danach in s)
LINES = [
    ("s01", "N", "Meet Tom. Tom just got a chip that turns his thoughts into text." + b(.4) + "Today is his first meeting with it.", .5),
    ("s02", "T", "This meeting could have been an email.", .9),
    ("s03", "N", "It was also his last meeting.", .6),
    ("s04", "N", "By the end of this video, you will know how close this chip really is. And there is one thought Tom must never, ever think." + b(.3) + "We will get to it.", .5),
    ("s05", "N", "This is Patent Future." + b(.5) + "File number two." + b(.4) + "The Mind Reader.", .9),
    ("s06", "N", "Science fiction? For some people, it is already real. Casey Harrell lost his voice to ALS. In 2024, surgeons in California placed four tiny sensors in his brain.", .3),
    ("s07", "N", "Two hundred and fifty-six electrodes listen while he tries to speak. A computer turns the signals into words, and reads them out in his old voice.", .3),
    ("s08", "N", "It gets about ninety-seven out of a hundred words right.", .5),
    ("s09", "N", "In January 2024, Neuralink put its first chip into a human. Noland Arbaugh, paralyzed from the shoulders down, used it to play chess." + b(.3) + "With his mind. By early 2026, twenty-one people had one.", .8),
    ("s10", "N", "But here is the catch. These chips do not read thoughts. They read the brain trying to move the mouth, or the hand.", .3),
    ("s11", "N", "Real mind reading would mean your inner voice. The words you only say in your head.", .3),
    ("s12", "N", "In 2025, scientists at Stanford tried exactly that. They decoded inner speech, in real time. Up to seventy-four percent right.", .3),
    ("s13", "N", "And they found the chip could pick up thoughts nobody asked it to. So they built a lock." + b(.3) + "More on that later.", .8),
    ("s14", "N", "What about without surgery? In Texas, volunteers lay in a brain scanner for sixteen hours, listening to stories.", .3),
    ("s15", "N", "Then an AI guessed what they were hearing, and even what they imagined. Not word for word. But the gist.", .3),
    ("s16", "N", "The weak spot? It only worked on people who trained it. And anyone could beat it." + b(.4) + "Just think about animals.", .8),
    ("s17", "N", "Tom's second day with the chip. A job interview. And the classic question: where do you see yourself in five years?", .6),
    ("s18", "T", "In your chair.", .8),
    ("s19", "N", "Some thoughts should stay thoughts.", .8),
    ("s20", "N", "So who owns your brain data? In 2024, Colorado became the first US state to protect it by law. California followed. Chile even wrote neurorights into its constitution.", .8),
    ("s21", "N", "Our verdict. Chips that give people their voice back: already here, and getting better fast. A chip that reads your inner voice, every day, for everyone? Maybe in twenty years. Reading thoughts you want to keep? We hope never. That is our own estimate.", .5),
    ("s22", "N", "And if it works? Messages you just think. Silent phone calls. Meetings where nobody says a word." + b(.4) + "Tom would love that.", .5),
    ("s23", "N", "Which brings us back to the one thought Tom must never think. Remember the lock?", .4),
    ("s24", "N", "The Stanford chip only listens after a secret thought. A mental password. Theirs was:" + b(.3) + "chitty chitty bang bang.", .4),
    ("s25", "N", "Tom picked his own password. Something he will never think by accident.", .6),
    ("s26", "T", "I love Mondays.", .9),
    ("s27", "N", "Patent status: pending." + b(.5) + "Would you get the chip? Tell us in the comments.", .4),
    ("s28", "N", "Next time: a test that tells you the day you will die. Subscribe, so you do not miss it.", 1.5),
]

CHAPTERS = {"s01": "Tom's first meeting", "s06": "Already here", "s10": "The catch", "s14": "Without surgery",
            "s17": "Day two", "s20": "Who owns your thoughts?", "s21": "Verdict"}

LEAD_IN = 1.2


def api_key():
    """Schlüssel aus Umgebungsvariable oder .env (Ordner oder Elternordner)."""
    import os
    if os.environ.get("ELEVENLABS_API_KEY"):
        return os.environ["ELEVENLABS_API_KEY"]
    for d in [HERE, *HERE.parents]:
        f = d / ".env"
        if f.exists():
            for line in f.read_text(encoding="utf-8").splitlines():
                if line.strip().startswith("ELEVENLABS_API_KEY="):
                    return line.split("=", 1)[1].strip().strip('"')
    return "proxy-injected"


def tts(cid, voice, text):
    out = AUDIO / f"{cid}.mp3"
    if out.exists() and "--force" not in sys.argv and cid not in sys.argv:
        return out
    vid, settings = VOICES[voice]
    body = json.dumps({"text": text, "model_id": "eleven_multilingual_v2", "voice_settings": settings}).encode()
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{vid}?output_format=mp3_44100_128",
                                 data=body, headers={"Content-Type": "application/json", "xi-api-key": api_key()})
    with urllib.request.urlopen(req, timeout=120) as r:
        out.write_bytes(r.read())
    print("TTS", cid)
    return out


def duration(p):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)]).decode())


if __name__ == "__main__":
    t = LEAD_IN
    tl = []
    for cid, voice, text, gap in LINES:
        p = tts(cid, voice, text)
        d = duration(p)
        tl.append({"id": cid, "voice": voice, "start": round(t, 3), "end": round(t + d, 3), "text": text})
        t += d + gap
    (HERE / "timeline.json").write_text(json.dumps({"duration": round(t, 2), "clips": tl, "chapters": CHAPTERS}, indent=1), encoding="utf-8")
    print(f"Gesamtlänge: {t:.1f} s ({int(t // 60)}:{int(t % 60):02d})")
