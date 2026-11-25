"""Transkrip narasi.wav sebuah film dengan cap waktu per kata (faster-whisper, CPU).

Pakai:  python transcribe.py <folder-film> [--lang id|en] [--model small]
Hasil (di folder film):
  transkrip.txt         kalimat + kata dengan waktu, untuk dibaca
  public/words.json     [{"w","s","e"}] per kata   → subtitle per kata & timing adegan
  public/segments.json  [{"s","e","text"}] per kalimat → dasar subtitle terjemahan (public/subtitle.json)
Model "small" cukup untuk id/en (±1-3 menit proses per menit audio). Pakai "medium" bila banyak salah dengar.
"""
import argparse
import json
import os

os.environ.setdefault("OMP_NUM_THREADS", "2")
from faster_whisper import WhisperModel  # noqa: E402

ap = argparse.ArgumentParser()
ap.add_argument("film")
ap.add_argument("--lang", default="id", choices=["id", "en"])
ap.add_argument("--model", default="small")
a = ap.parse_args()

wav = os.path.join(a.film, "narasi.wav")
m = WhisperModel(a.model, device="cpu", compute_type="int8")
segs, _ = m.transcribe(wav, language=a.lang, word_timestamps=True, beam_size=5, vad_filter=True)

lines, words, sentences = [], [], []
for s in segs:
    lines.append(f"[{s.start:7.2f}-{s.end:7.2f}] {s.text.strip()}")
    sentences.append({"s": round(s.start, 3), "e": round(s.end, 3), "text": s.text.strip()})
    for w in s.words:
        lines.append(f"    {w.start:7.2f}-{w.end:7.2f} {w.word.strip()}")
        words.append({"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)})

pub = os.path.join(a.film, "public")
os.makedirs(pub, exist_ok=True)
open(os.path.join(a.film, "transkrip.txt"), "w", encoding="utf-8").write("\n".join(lines))
json.dump(words, open(os.path.join(pub, "words.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=0)
json.dump(sentences, open(os.path.join(pub, "segments.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"ok: {len(words)} kata, {len(sentences)} kalimat, akhir {words[-1]['e'] if words else 0:.2f} s")
