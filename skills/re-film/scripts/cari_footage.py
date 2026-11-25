"""Cari gambar/video GRATIS untuk bahan film, lengkap dengan lisensi & pembuatnya.

Pakai:  python cari_footage.py "kueri bahasa inggris" [--jenis gambar|video] [--n 8] [--sumber commons,nasa,pexels,pixabay]
Contoh: python cari_footage.py "Prince Rupert's drop" --jenis gambar
        python cari_footage.py "molten glass" --jenis video --sumber pexels,pixabay

Sumber tanpa kunci API: Wikimedia Commons (lisensi per file), NASA Image & Video Library (umumnya domain publik).
Sumber dengan kunci API gratis (lewati otomatis kalau env belum diisi):
  PEXELS_API_KEY  (https://www.pexels.com/api/)   — Pexels License: bebas komersial, tanpa atribusi
  PIXABAY_API_KEY (https://pixabay.com/api/docs/) — Pixabay Content License: bebas komersial, tanpa atribusi
Unduh: python cari_footage.py --unduh <url> <folder>   (simpan ke <kerja>/aset/footage/<sumber>/)

Skrip ini hanya mencari & mengunduh. Yang memutuskan cocok/tidaknya (isi, kualitas, lisensi) tetap Claude + user.
"""
import json
import os
import re
import sys
import urllib.parse
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")
UA = {"User-Agent": "re-film-footage-search/1.0 (educational video tool)"}


def get(url, headers=None):
    req = urllib.request.Request(url, headers={**UA, **(headers or {})})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


def bersih(html):
    return re.sub(r"<[^>]+>", "", html or "").strip()[:80]


def commons(q, jenis, n):
    ft = "filetype:video" if jenis == "video" else "filetype:bitmap"
    p = {"action": "query", "format": "json", "generator": "search", "gsrnamespace": 6, "gsrlimit": n,
         "gsrsearch": f"{q} {ft}", "prop": "imageinfo", "iiprop": "url|size|extmetadata", "iiurlwidth": 1920}
    d = get("https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(p))
    for pg in (d.get("query", {}).get("pages", {}) or {}).values():
        ii = pg["imageinfo"][0]
        m = ii.get("extmetadata", {})
        yield {"sumber": "commons", "judul": pg["title"].replace("File:", ""), "lisensi": m.get("LicenseShortName", {}).get("value", "?"),
               "pembuat": bersih(m.get("Artist", {}).get("value")), "ukuran": f"{ii.get('width')}x{ii.get('height')}",
               "url": ii.get("thumburl") or ii["url"], "halaman": ii.get("descriptionurl")}


def nasa(q, jenis, n):
    d = get("https://images-api.nasa.gov/search?" + urllib.parse.urlencode({"q": q, "media_type": "video" if jenis == "video" else "image"}))
    for it in d["collection"]["items"][:n]:
        dt = it["data"][0]
        nid = dt.get("nasa_id")
        yield {"sumber": "nasa", "judul": dt.get("title", "")[:70], "lisensi": "NASA (umumnya domain publik, cek halaman)",
               "pembuat": dt.get("center", "NASA"), "ukuran": "?", "url": it.get("href"),  # manifest; unduh pakai --unduh asset
               "halaman": f"https://images.nasa.gov/details/{nid}"}


def pexels(q, jenis, n):
    key = os.environ.get("PEXELS_API_KEY")
    if not key:
        return
    base = "https://api.pexels.com/videos/search?" if jenis == "video" else "https://api.pexels.com/v1/search?"
    d = get(base + urllib.parse.urlencode({"query": q, "per_page": n}), {"Authorization": key})
    for it in d.get("videos" if jenis == "video" else "photos", []):
        if jenis == "video":
            f = max((v for v in it["video_files"] if (v.get("width") or 0) <= 1920), key=lambda v: v.get("width") or 0, default=it["video_files"][0])
            url, uk = f["link"], f"{f.get('width')}x{f.get('height')} {it.get('duration')}s"
        else:
            url, uk = it["src"]["large2x"], f"{it['width']}x{it['height']}"
        yield {"sumber": "pexels", "judul": it.get("alt") or it.get("url", "")[-60:], "lisensi": "Pexels License",
               "pembuat": (it.get("user") or {}).get("name") or it.get("photographer", ""), "ukuran": uk, "url": url, "halaman": it.get("url")}


def pixabay(q, jenis, n):
    key = os.environ.get("PIXABAY_API_KEY")
    if not key:
        return
    base = "https://pixabay.com/api/videos/?" if jenis == "video" else "https://pixabay.com/api/?"
    d = get(base + urllib.parse.urlencode({"key": key, "q": q, "per_page": max(3, n), "safesearch": "true"}))
    for it in d.get("hits", [])[:n]:
        if jenis == "video":
            v = it["videos"].get("large") or it["videos"]["medium"]
            url, uk = v["url"], f"{v['width']}x{v['height']} {it.get('duration')}s"
        else:
            url, uk = it["largeImageURL"], f"{it['imageWidth']}x{it['imageHeight']}"
        yield {"sumber": "pixabay", "judul": it.get("tags", ""), "lisensi": "Pixabay Content License",
               "pembuat": it.get("user", ""), "ukuran": uk, "url": url, "halaman": it.get("pageURL")}


def unduh(url, folder):
    os.makedirs(folder, exist_ok=True)
    if "images-assets.nasa.gov" in url and url.endswith("collection.json"):  # manifest NASA → ambil file terbesar
        files = get(url)
        url = next((f for f in files if f.endswith(("~orig.mp4", "~orig.jpg", "~large.jpg", "~large.mp4"))), files[0])
    nama = urllib.parse.unquote(url.split("?")[0].rsplit("/", 1)[-1])[:120]
    tujuan = os.path.join(folder, nama)
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=120) as r, open(tujuan, "wb") as f:
        f.write(r.read())
    print(f"ok {tujuan} ({os.path.getsize(tujuan) // 1024} KB)")


def main():
    a = sys.argv[1:]
    if not a:
        print(__doc__); sys.exit(1)
    if a[0] == "--unduh":
        unduh(a[1], a[2]); return
    q, jenis, n, sumber = a[0], "gambar", 8, "commons,nasa,pexels,pixabay"
    for i, x in enumerate(a):
        if x == "--jenis": jenis = a[i + 1]
        if x == "--n": n = int(a[i + 1])
        if x == "--sumber": sumber = a[i + 1]
    fungsi = {"commons": commons, "nasa": nasa, "pexels": pexels, "pixabay": pixabay}
    for s in sumber.split(","):
        if s in ("pexels", "pixabay") and not os.environ.get(f"{s.upper()}_API_KEY"):
            print(f"\n=== {s}: dilewati (isi env {s.upper()}_API_KEY, gratis) ===")
            continue
        print(f"\n=== {s} ({jenis}) ===")
        try:
            for k, r in enumerate(fungsi[s](q, jenis, n), 1):
                print(f"{k}. {r['judul']}\n   lisensi: {r['lisensi']} | oleh: {r['pembuat']} | {r['ukuran']}\n   url: {r['url']}\n   halaman: {r['halaman']}")
        except Exception as e:
            print(f"GAGAL: {e}")


if __name__ == "__main__":
    main()
