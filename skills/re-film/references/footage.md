# Footage tambahan: gambar & video gratis dari internet

Tujuan: memberi "bukti nyata" yang tidak bisa dibuat dengan animasi, seperti foto arsip, gambar ilmiah asli, rekaman
NASA, mikroskop, atau peristiwa sejarah. Footage **mendukung** dunia BoxBot, bukan menggantikannya. Sebagai pedoman,
tidak lebih dari ±20 % durasi film, dan selalu dibingkai (lihat "Cara menampilkan"). Dengan begitu gaya film tetap
utuh dan penonton tahu mana bukti nyata, mana ilustrasi.

## Kapan dipakai
- Fakta yang lebih meyakinkan kalau dilihat aslinya: foto penemu, dokumen lama, alat asli di museum, citra satelit,
  rekaman slow-motion, mikroskop.
- Hook atau twist yang butuh kejutan dunia nyata ("ini foto aslinya").
- **Jangan** dipakai untuk hal yang bisa dianimasikan dengan jelas, dan jangan menampilkan orang nyata secara
  menyesatkan, logo/merek dagang sebagai fokus, atau konten berhak cipta.

## Sumber (urutkan dari yang paling aman)
| Sumber | Jenis | Lisensi | Catatan |
|---|---|---|---|
| Wikimedia Commons | gambar, video, ilustrasi lama | per file (PD, CC0, CC BY, CC BY-SA) | ada di skrip; **cek kolom lisensi tiap hasil** |
| NASA Image & Video Library | foto & video antariksa, Bumi | umumnya domain publik | ada di skrip; logo NASA tidak boleh dipakai sebagai endorsement |
| Pexels | foto & video stok modern | Pexels License (bebas komersial, tanpa atribusi) | ada di skrip, butuh `PEXELS_API_KEY` gratis |
| Pixabay | foto, video, ilustrasi | Pixabay Content License (bebas komersial) | ada di skrip, butuh `PIXABAY_API_KEY` gratis |
| Smithsonian Open Access, The Met Open Access, Rijksmuseum | koleksi museum | CC0 | cari manual di situsnya |
| Internet Archive (Prelinger, film PD) | film arsip | domain publik (cek tiap item) | cari manual; potong bagian yang perlu saja |
| NOAA, USGS, ESA | sains Bumi & antariksa | NOAA/USGS umumnya PD; ESA sering CC BY-SA 3.0 IGO | cek halaman item |

Lisensi yang **aman**: Public domain, CC0, Pexels/Pixabay License, CC BY, dan CC BY-SA (dua terakhir wajib atribusi).
**Hindari**: NC (non-commercial, karena channel YouTube bisa dimonetisasi), ND (tidak boleh diubah atau dipotong),
"All rights reserved", dan semua yang lisensinya tidak jelas.

## Cara cari & unduh
```bash
python <skill>/scripts/cari_footage.py "<kueri bahasa Inggris>" --jenis gambar|video --n 8
python <skill>/scripts/cari_footage.py --unduh "<url>" <kerja>/aset/footage/<sumber>/
```
1. Pakai kueri Inggris yang spesifik ("Prince Rupert's drop high speed", "IBM 350 RAMAC"). Coba 2-3 variasi.
2. Pilih berdasarkan: isi tepat, resolusi cukup (≥1280 px lebar untuk horizontal), lisensi aman, tanpa watermark.
3. Unduh ke `<kerja>/aset/footage/<sumber>/` agar bisa dipakai ulang, lalu salin **hanya** yang dipakai ke
   `<slug>/public/footage/`. Video dipotong seperlunya dulu:
   `ffmpeg -ss <mulai> -t <durasi> -i in.mp4 -an -vf scale=1280:-2 -c:v libx264 -crf 20 <slug>/public/footage/x.mp4`
4. Catat **setiap** file di `<slug>/CREDITS.md`: judul, pembuat, sumber (URL halaman), lisensi. Baris CC BY/BY-SA juga
   disalin ke deskripsi YouTube ("Footage: <judul> by <pembuat>, <lisensi>, via <sumber>").
5. Kalau situs butuh login/klik atau API key belum ada, sebutkan URL persisnya ke user dan minta mereka mengunduh,
   atau tawarkan mengisi `PEXELS_API_KEY` / `PIXABAY_API_KEY` (gratis, cukup daftar).

## Cara menampilkan (kit `Footage.tsx`)
- `FotoBingkai` (2D di atas adegan): gaya `polaroid` (foto arsip/sejarah, bisa diberi `keterangan`), `tv` (rekaman
  lama/berita), `kartu` (foto modern). Otomatis "pop" masuk dan bergerak pelan (Ken Burns). Video diputar tanpa suara.
- `PapanFoto` (gambar di dunia 3D): layar TV di bengkel, foto di dinding, papan yang dipegang BoxBot.
  Hanya untuk gambar; untuk video pakai `FotoBingkai`.
- BoxBot sebaiknya bereaksi terhadap footage (menunjuk, kaget, memegang papannya), supaya footage terasa bagian
  dari cerita, bukan tempelan.
- Teks keterangan footage mengikuti **bahasa suara**. Kredit singkat di layar (mis. "Photo: NASA") boleh ditulis kecil
  di pojok bingkai bila lisensinya meminta atribusi.
