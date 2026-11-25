"""Cek seberapa ramai sebuah ide di YouTube.

Pakai:  python yt_check.py "kueri 1" "kueri 2" ... [--n 20]
Contoh: python yt_check.py "kenapa jam berputar ke kanan" "why do clocks go clockwise"

Untuk tiap kueri mencetak hasil pencarian YouTube teratas (judul, views, durasi, channel, url).
Skrip ini TIDAK memutuskan apakah ide sudah "ramai": yang menilai video mana yang benar-benar
membahas sudut cerita yang sama adalah Claude (lihat SKILL.md, langkah 2).
Butuh yt-dlp di PATH.
"""
import json
import subprocess
import sys

sys.stdout.reconfigure(encoding="utf-8")


def search(query: str, n: int):
    out = subprocess.run(
        ["yt-dlp", f"ytsearch{n}:{query}", "--flat-playlist", "-J", "--no-warnings"],
        capture_output=True, text=True, encoding="utf-8", timeout=120,
    )
    if out.returncode != 0:
        raise RuntimeError(out.stderr.strip()[:300])
    return json.loads(out.stdout).get("entries", [])


def fmt_views(v):
    if v is None:
        return "?"
    for unit, div in (("jt", 1_000_000), ("rb", 1_000)):
        if v >= div:
            return f"{v / div:.1f}{unit}"
    return str(v)


def fmt_dur(d):
    if not d:
        return "?"
    d = int(d)
    return f"{d // 60}:{d % 60:02d}"


def main():
    args = sys.argv[1:]
    n = 20
    if "--n" in args:
        i = args.index("--n")
        n = int(args[i + 1])
        del args[i:i + 2]
    if not args:
        print(__doc__)
        sys.exit(1)
    for q in args:
        print(f"\n=== {q} ===")
        try:
            entries = search(q, n)
        except Exception as e:  # jaringan / yt-dlp gagal: laporkan, jangan pura-pura 0 hasil
            print(f"GAGAL: {e}")
            continue
        for k, e in enumerate(entries, 1):
            print(f"{k:2d}. [{fmt_views(e.get('view_count')):>7} | {fmt_dur(e.get('duration')):>6}] "
                  f"{e.get('title')}  — {e.get('channel')}  {e.get('url')}")


if __name__ == "__main__":
    main()
