"""SFX untuk film: cari yang gratis di internet, atau buat sendiri (sintesis, tanpa lisensi pihak ketiga).

Pakai:
  python sfx.py cari "glass shatter" [--n 8] [--sumber commons,freesound]
  python sfx.py unduh <url> <folder>
  python sfx.py buat <jenis> <out.wav> [--dur detik] [--nada hz]
  python sfx.py pustaka <folder>          # buat semua jenis sintesis sekaligus ke <folder>
Jenis sintesis: whoosh, swoosh_naik, pop, klik, tik, ding, boom, dentum, retak, kaca_pecah, kilau, glitch, detak

Sumber pencarian:
  commons   — Wikimedia Commons (tanpa kunci; lisensi per file, cek kolom lisensi)
  freesound — Freesound.org, HANYA CC0 (butuh env FREESOUND_API_KEY gratis: https://freesound.org/apiv2/apply)
Hasil sintesis buatan sendiri bebas dipakai (dibuat oleh skrip ini, tidak ada pemilik lain).
"""
import json
import os
import re
import sys
import urllib.parse
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")
UA = {"User-Agent": "re-film-sfx/1.0 (educational video tool)"}
SR = 48000


# ---------------- pencarian ----------------
def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


def commons(q, n):
    p = {"action": "query", "format": "json", "generator": "search", "gsrnamespace": 6, "gsrlimit": n,
         "gsrsearch": f"{q} filetype:audio", "prop": "imageinfo", "iiprop": "url|extmetadata"}
    d = get("https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(p))
    for pg in (d.get("query", {}).get("pages", {}) or {}).values():
        ii = pg["imageinfo"][0]
        m = ii.get("extmetadata", {})
        yield {"judul": pg["title"].replace("File:", ""), "lisensi": m.get("LicenseShortName", {}).get("value", "?"),
               "pembuat": re.sub(r"<[^>]+>", "", m.get("Artist", {}).get("value", ""))[:60], "durasi": "?",
               "url": ii["url"], "halaman": ii.get("descriptionurl")}


def freesound(q, n):
    key = os.environ["FREESOUND_API_KEY"]
    p = {"query": q, "filter": 'license:"Creative Commons 0"', "page_size": n, "token": key,
         "fields": "id,name,license,username,duration,previews,url"}
    d = get("https://freesound.org/apiv2/search/text/?" + urllib.parse.urlencode(p))
    for it in d.get("results", []):
        yield {"judul": it["name"], "lisensi": "CC0", "pembuat": it["username"], "durasi": f"{it['duration']:.1f}s",
               "url": it["previews"]["preview-hq-mp3"], "halaman": it["url"]}


def cari(q, n, sumber):
    for s in sumber.split(","):
        if s == "freesound" and not os.environ.get("FREESOUND_API_KEY"):
            print("\n=== freesound: dilewati (isi env FREESOUND_API_KEY, gratis) ===")
            continue
        print(f"\n=== {s} ===")
        try:
            for k, r in enumerate({"commons": commons, "freesound": freesound}[s](q, n), 1):
                print(f"{k}. {r['judul']} [{r['durasi']}]\n   lisensi: {r['lisensi']} | oleh: {r['pembuat']}\n   url: {r['url']}\n   halaman: {r['halaman']}")
        except Exception as e:
            print(f"GAGAL: {e}")


def unduh(url, folder):
    os.makedirs(folder, exist_ok=True)
    nama = urllib.parse.unquote(url.split("?")[0].rsplit("/", 1)[-1])[:120]
    tujuan = os.path.join(folder, nama)
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120) as r, open(tujuan, "wb") as f:
        f.write(r.read())
    print(f"ok {tujuan} ({os.path.getsize(tujuan) // 1024} KB)")


# ---------------- sintesis ----------------
def sintesis(jenis, dur=None, nada=None):
    import numpy as np
    from scipy.signal import butter, sosfilt

    rng = np.random.default_rng(7)
    D = {"whoosh": 0.7, "swoosh_naik": 1.6, "pop": 0.18, "klik": 0.05, "tik": 0.06, "ding": 1.4, "boom": 1.8, "dentum": 0.6,
         "retak": 0.9, "kaca_pecah": 1.6, "kilau": 1.2, "glitch": 0.45, "detak": 0.5}[jenis]
    d = dur or D
    t = np.arange(int(SR * d)) / SR
    noise = rng.standard_normal(len(t))
    env = lambda a, r: np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / r)

    def bp(x, lo, hi):
        return sosfilt(butter(2, [lo, hi], btype="band", fs=SR, output="sos"), x)

    def sweep_noise(f0, f1):
        # Noise yang "pusat nadanya" bergeser f0→f1 tanpa klik: beberapa pita TETAP difilter sekali (filter kontinu),
        # lalu dicampur dengan bobot halus (Gauss di skala log) mengikuti frekuensi saat ini.
        pusat = np.geomspace(min(f0, f1) * 0.7, max(f0, f1) * 1.4, 10)
        fnow = np.geomspace(f0, f1, len(t))
        out = np.zeros_like(t)
        for fc in pusat:
            pita = bp(noise, max(30, fc / 1.5), min(SR / 2 - 100, fc * 1.5))
            out += pita * np.exp(-0.5 * (np.log(fnow / fc) / 0.35) ** 2)
        return out

    if jenis == "whoosh":
        y = sweep_noise(300, 2500) * np.sin(np.pi * t / d) ** 2
    elif jenis == "swoosh_naik":
        y = sweep_noise(200, 6000) * (t / d) ** 2 + 0.3 * np.sin(2 * np.pi * (200 + 600 * t / d) * t) * (t / d) ** 3
    elif jenis == "pop":
        f = (nada or 700) * np.exp(-t * 18)
        y = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(0.002, 0.05)
    elif jenis == "klik":
        y = bp(noise, 2000, 9000) * env(0.0005, 0.008)
    elif jenis == "tik":
        y = (np.sin(2 * np.pi * (nada or 2400) * t) + 0.5 * bp(noise, 3000, 8000)) * env(0.0005, 0.012)
    elif jenis == "ding":
        f = nada or 1318.5
        y = sum(a * np.sin(2 * np.pi * f * m * t) * np.exp(-t * k) for a, m, k in [(1, 1, 3), (0.5, 2.76, 5), (0.3, 5.4, 8)])
    elif jenis == "boom":
        f = 38 + 60 * np.exp(-t * 6)
        y = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(0.01, 0.6) + 0.5 * sosfilt(butter(2, 300, fs=SR, output="sos"), noise) * env(0.003, 0.25)
    elif jenis == "dentum":
        f = (nada or 90) * np.exp(-t * 4)
        y = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(0.002, 0.18) + 0.25 * bp(noise, 100, 1200) * env(0.001, 0.04)
    elif jenis == "retak":
        y = np.zeros_like(t)
        for k in range(22):
            s = int(rng.uniform(0, 0.6) * SR * (k / 22) ** 0.5 + rng.uniform(0, 0.05) * SR)
            L = int(SR * rng.uniform(0.004, 0.02))
            seg = bp(rng.standard_normal(L), 1500, 12000) * np.exp(-np.arange(L) / (L / 4)) * rng.uniform(0.4, 1)
            y[s:s + L] += seg[: len(y[s:s + L])]
    elif jenis == "kaca_pecah":
        y = bp(noise, 2500, 14000) * env(0.002, 0.12) * 1.2
        for k in range(40):  # denting serpihan
            s = int(SR * rng.uniform(0.05, d * 0.85)); L = int(SR * 0.25)
            ff = rng.uniform(2500, 7500)
            seg = np.sin(2 * np.pi * ff * np.arange(L) / SR) * np.exp(-np.arange(L) / (SR * rng.uniform(0.02, 0.08))) * rng.uniform(0.05, 0.3)
            y[s:s + L] += seg[: len(y[s:s + L])]
    elif jenis == "kilau":
        y = np.zeros_like(t)
        for k, ff in enumerate([1568, 2093, 2637, 3136, 4186]):
            s = int(SR * k * 0.08); L = len(t) - s
            y[s:] += np.sin(2 * np.pi * ff * np.arange(L) / SR) * np.exp(-np.arange(L) / (SR * 0.25)) * 0.4
    elif jenis == "glitch":
        y = np.zeros_like(t); blk = int(SR * 0.03)
        for i in range(0, len(t), blk):
            y[i:i + blk] = (np.sign(np.sin(2 * np.pi * rng.uniform(80, 1200) * t[i:i + blk])) * 0.4 if rng.random() > 0.4 else 0)
        y = y * env(0.002, 0.25)
    elif jenis == "detak":
        y = sum(np.sin(2 * np.pi * 55 * (t - o)) * np.exp(-np.maximum(0, t - o) * 25) * (t >= o) for o in (0, 0.22))
    else:
        raise SystemExit(f"jenis tidak dikenal: {jenis}")

    fade = np.minimum(1, (len(t) - np.arange(len(t))) / (SR * 0.01))  # hindari klik di akhir
    y = y * fade
    y = y / (np.max(np.abs(y)) + 1e-9) * 0.89  # puncak ≈ −1 dBFS
    return y


def buat(jenis, out, dur=None, nada=None):
    import numpy as np
    from scipy.io import wavfile
    y = sintesis(jenis, dur, nada)
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    wavfile.write(out, SR, (y * 32767).astype(np.int16))
    print(f"ok {out} ({len(y) / SR:.2f}s)")


def main():
    a = sys.argv[1:]
    if not a:
        print(__doc__); sys.exit(1)
    opt = lambda k, d=None: a[a.index(k) + 1] if k in a else d
    if a[0] == "cari":
        cari(a[1], int(opt("--n", 8)), opt("--sumber", "commons,freesound"))
    elif a[0] == "unduh":
        unduh(a[1], a[2])
    elif a[0] == "buat":
        buat(a[1], a[2], float(opt("--dur")) if opt("--dur") else None, float(opt("--nada")) if opt("--nada") else None)
    elif a[0] == "pustaka":
        for j in ["whoosh", "swoosh_naik", "pop", "klik", "tik", "ding", "boom", "dentum", "retak", "kaca_pecah", "kilau", "glitch", "detak"]:
            buat(j, os.path.join(a[1], f"{j}.wav"))
    else:
        print(__doc__)


if __name__ == "__main__":
    main()
