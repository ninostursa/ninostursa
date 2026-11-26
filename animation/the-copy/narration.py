"""Erzähltext für "Patent Future – File 001: The Copy".

Stimmen (ElevenLabs):
  N = Erzähler  – Jarnathan (gleiche Stimme wie im Wissenskanal)
  R = Roboter-Papa – Retro Robot
  K = Tochter Lily – Jessica
Aufruf:  python3 narration.py   → audio/<id>.mp3 + timeline.json
"""
import json, pathlib, subprocess, urllib.request, sys

HERE = pathlib.Path(__file__).parent
AUDIO = HERE / "audio"
AUDIO.mkdir(exist_ok=True)

VOICES = {
    "N": ("c6SfcYrb2t09NHXiT80T", {"stability": .75, "similarity_boost": .75, "style": 0.0, "use_speaker_boost": True, "speed": 1.1}),
    "R": ("ZEcx3Wdpj4EvM8PltzHY", {"stability": .55, "similarity_boost": .75, "style": 0.2, "use_speaker_boost": True}),
    "K": ("cgSgspJ2msm6clMCkdW9", {"stability": .45, "similarity_boost": .75, "style": 0.3, "use_speaker_boost": True}),
}


def b(x):
    return f' <break time="{x}s" /> '


# (id, Stimme, Text, Pause danach in s)
LINES = [
    ("s01", "N", "Sunday dinner at the Millers. Spaghetti, as always." + b(.4) + "And this is Dad." + b(.6) + "Dad died three years ago.", .3),
    ("s02", "N", "But he still comes to dinner. Every Sunday. Same terrible jokes." + b(.3) + "He just drinks motor oil now.", .3),
    ("s03", "N", "By the end of this video, you will decide if you would sit at this table. And there is one question this family never dared to ask him." + b(.3) + "We will get to it.", .5),
    ("s04", "N", "This is Patent Future." + b(.5) + "File number one." + b(.4) + "The Copy.", .9),
    ("s05", "N", "Science fiction? It has already begun. A Canadian man named Joshua Barbeau gave an AI the old text messages of his fiancée, eight years after she died." + b(.3) + "Then he talked to her. For hours.", .3),
    ("s06", "N", "In 2022, Marina Smith, eighty-seven, answered questions at her own funeral. On a screen. From interviews she recorded before she died.", .3),
    ("s07", "N", "And in South Korea, a TV show let a mother meet her little daughter again. In virtual reality. Years after the girl had died.", .3),
    ("s08", "N", "But here is the catch. These are echoes. They copy what a person said, not how a person thinks. To really bring Dad back, you would need much more." + b(.4) + "His brain.", .8),
    ("s09", "N", "In 2024, scientists finished the first complete wiring map of an adult fruit fly brain. About a hundred and forty thousand nerve cells. Over fifty million connections. It took years.", .3),
    ("s10", "N", "Your brain? About eighty-six billion nerve cells. More than six hundred thousand fruit fly brains." + b(.3) + "In one head.", .3),
    ("s11", "N", "And a map is not a mind. It is like owning the blueprint of a piano, and never hearing it play.", .8),
    ("s12", "N", "But let us pretend it works. 2080. Dad sits down in a scanner. It reads his brain, connection by connection, and starts it again inside a machine.", .3),
    ("s13", "N", "Upload complete." + b(.5) + "The machine opens its eyes and says:", .3),
    ("s13r", "R", "Hi. Did I miss anything?", .8),
    ("s14", "N", "So, is it really him? Test one: memory. His wedding. His passwords. Every song he was ever embarrassed about." + b(.3) + "Pass.", .3),
    ("s15", "N", "Test two: change. Real people learn, forget, and change their minds. A copy that never changes is just a photo that talks.", .3),
    ("s16", "N", "Test three, the nasty one. What if the copy wakes up while Dad is still alive?" + b(.4) + "Two Dads. Both sure they are the real one.", .3),
    ("s17", "N", "Who gets the car keys? The last slice of pizza? Philosophers have argued about this for centuries." + b(.3) + "Nobody has won.", .8),
    ("s18", "N", "And then, there is money. In 2024, researchers at Cambridge warned that grief bots could be used to sell you things, confuse children, or haunt people who never wanted them.", .3),
    ("s19r", "R", "Speaking of dinner. Have you tried new Crunchy Bits? Now with extra crunch!", .3),
    ("s20", "N", "So they want clear rules. Always know when you are talking to a machine. A way to switch it off. Even a digital funeral.", .8),
    ("s21", "N", "Our verdict. Echoes are already here, and they get more real every year. A true copy of a mind? The hardest machine in this series. We would not bet on it this century. That is our own estimate.", .5),
    ("s22", "N", "And if it ever works: a copy never gets old. The kids grow up. Their kids arrive. And Dad is still at the table." + b(.3) + "Still drinking oil.", .5),
    ("s23", "N", "Which brings us back to the question this family never dared to ask.", .4),
    ("s24", "K", "Dad?" + b(.5) + "Are you still you?", .5),
    ("s25", "R", "I think so." + b(.7) + "But I would say that, wouldn't I?", .8),
    ("s26", "N", "Patent status: pending." + b(.5) + "Would you sit at this table? Tell us in the comments.", .4),
    ("s27", "N", "Next time: a chip that could read your thoughts. Subscribe, so you do not miss it.", 1.5),
]

CHAPTERS = {"s01": "Sunday dinner", "s05": "Echoes, today", "s09": "Copying a brain", "s12": "Upload day, 2080",
            "s14": "Three tests", "s18": "The business", "s21": "Verdict"}

LEAD_IN = 1.2


def tts(cid, voice, text):
    out = AUDIO / f"{cid}.mp3"
    if out.exists() and "--force" not in sys.argv and cid not in sys.argv:
        return out
    vid, settings = VOICES[voice]
    body = json.dumps({"text": text, "model_id": "eleven_multilingual_v2", "voice_settings": settings}).encode()
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{vid}?output_format=mp3_44100_128",
                                 data=body, headers={"Content-Type": "application/json", "xi-api-key": "proxy-injected"})
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
