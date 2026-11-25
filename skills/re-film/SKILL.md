---
name: re-film
description: Alur lengkap membuat film YouTube (Shorts atau video panjang) dari nol, suara bahasa Indonesia atau Inggris. Tanya kategori → cari ide berpotensi viral yang BELUM ramai di YouTube (dicek dengan yt-dlp, maks 3 video serupa, Indonesia + Inggris) → user pilih ide, sisanya disimpan di bank ide → tanya durasi (30 dtk/1/3/5/10 mnt), format (vertikal/horizontal), bahasa suara & bahasa subtitle → riset web & karang cerita → narasi TTS Google AI Studio (adegan bernomor, detik, nada, baris │ "...") → tunggu audio user → animasi 3D Remotion + three.js dengan tokoh robot kotak plastik berkilat dan aset gratis (Kenney dll.), gaya visual menyesuaikan tema, end screen 20 detik untuk video non-Shorts → saran judul, deskripsi, tag, dan kategori YouTube. Gunakan skill ini setiap kali user minta "bikin film/video/short/reel baru", "cari ide video/konten", "ide yang belum banyak di YouTube", menyebut re-film atau robot kotak, atau mengirim audio narasi untuk film yang sedang dikerjakan, meskipun tidak menyebut nama skill ini.
---

# re-film: dari ide sampai siap unggah

Komunikasi dengan user dalam bahasa Indonesia santai, apa pun bahasa filmnya. Alur ini punya dua titik tunggu:
(a) user memilih ide dan pengaturan film, (b) user mengirim audio. Jangan lompati keduanya. Setelah audio ada,
kerjakan sampai video selesai tanpa banyak bertanya.

`<skill>` = folder skill ini. `<kerja>` = folder kerja saat ini (mis. `D:\film-saya` atau `~/film`).

## Struktur folder kerja (dipakai ulang antar film)

```
<kerja>/
  katalog.md            bank ide + daftar film selesai
  package.json, tsconfig.json, remotion.config.ts, node_modules/   ← dipasang SEKALI
  kit/                  komponen bersama (BoxBot, Stage, Glb, Captions, Endscreen, util)
  scripts/stills.mjs    render still untuk cek tampilan
  aset/<sumber>/        model/tekstur/suara gratis yang sudah diunduh (dipakai ulang antar film)
  aset/SUMBER.md        asal & lisensi tiap paket di aset/
  <slug-film>/          satu folder per film
    narasi.wav, transkrip.txt, TREATMENT.md, CREDITS.md, youtube.md, <slug>.mp4
    src/  (index.ts, Root.tsx, config.ts, Film.tsx, scenes/)
    public/ (narasi.wav, words.json, segments.json, subtitle.json, models/ …)
    out/
```

**Persiapan (sekali saja):** kalau `<kerja>/kit` atau `<kerja>/package.json` belum ada, salin isi
`<skill>/assets/workspace/` ke `<kerja>` lalu jalankan `npm install` (di latar belakang). Kalau sudah ada, **jangan
ditimpa**, karena kit di folder kerja mungkin sudah diperbaiki di film sebelumnya. Perbaikan kit yang berguna umum
(mis. pose baru BoxBot) disimpan di `<kerja>/kit` supaya film berikutnya ikut mendapatkannya.

`katalog.md` dibuat kalau belum ada:
```markdown
# Katalog re-film
## Bank ide
<!-- - [kategori] Judul kerja — hook 1 kalimat. Cek YouTube YYYY-MM-DD: N video serupa (terbesar: X views). -->
## Film selesai
<!-- - YYYY-MM-DD `slug` — judul — durasi/format — suara/subtitle — gaya: ... -->
```

---

## Tahap 1: Ide

### 1a. Tanya kategori
Baca `katalog.md`. Tanyakan kategori dengan AskUserQuestion (mis. Sains & Alam, Sejarah & Misteri, Teknologi,
Hewan & Tubuh Manusia; "Other" untuk lainnya). Kalau bank ide punya ide di kategori itu, sebutkan juga: user boleh
langsung memakainya (cek ulang YouTube kalau pengecekannya sudah lebih dari sebulan).

### 1b. Cari kandidat
Jalankan beberapa WebSearch sekaligus untuk menemukan 8-12 kandidat. Ide yang berpotensi viral biasanya punya:
- fakta yang terdengar mustahil tapi benar, atau kebalikan dari yang orang kira;
- sesuatu yang sehari-hari tapi jarang dipertanyakan;
- angka/skala yang bisa digambarkan (cocok untuk animasi 3D);
- plot twist alami;
- daya tarik lintas bahasa (film bisa dibuat versi Indonesia atau Inggris).
Utamakan sudut cerita yang spesifik, bukan topik umum: "Kenapa langit biru" sudah habis, "Kenapa langit Mars
saat senja justru biru" masih segar.

### 1c. Cek YouTube: buang yang sudah ramai
Untuk tiap kandidat, pakai minimal satu kueri Indonesia dan satu kueri Inggris. Jalankan semua kandidat dalam
satu perintah:

```bash
python <skill>/scripts/yt_check.py "kueri ID spesifik" "english specific query" "kueri lain" --n 20
```

Baca judulnya dan hitung **video serupa** dari hasil Indonesia **dan** Inggris digabung. Video serupa adalah video
yang inti bahasannya fakta, kisah, atau sudut yang sama, bukan sekadar topik besarnya sama.
- **Total ≤ 3 video serupa** → lolos.
- **Lebih dari 3** → buang, catat di bank ide sebagai "(ramai)" supaya tidak diusulkan lagi.
Kalau yt-dlp gagal (jaringan), katakan terus terang dan jangan anggap hasilnya nol.

### 1d. Tawarkan dan simpan
Tampilkan 4-6 ide yang lolos di chat:

```
1. **Judul kerja**: hook 1 kalimat
   Kenapa menarik: ... | YouTube: 2 video serupa (1 ID, 1 EN; terbesar 14 rb views)
```

Tanya mana yang dibuat (AskUserQuestion dengan 4 ide terkuat, sisanya lewat "Other"). Ide yang tidak dipilih
langsung ditambahkan ke **Bank ide** di `katalog.md` beserta tanggal cek.

### 1e. Tanya pengaturan film
Dalam satu pesan chat (pilihannya lebih dari 4, jadi jangan pakai AskUserQuestion):
- **durasi:** 30 dtk / 1 mnt / 3 mnt / 5 mnt / 10 mnt
- **format:** vertikal (9:16) / horizontal (16:9)
- **bahasa suara (narasi):** Indonesia / Inggris
- **subtitle:** Indonesia / Inggris / tanpa subtitle. Boleh beda dengan suara, mis. suara Inggris + subtitle Indonesia.

**End screen:** YouTube tidak menampilkan end screen di Shorts (vertikal ≤ 3 menit). Sisakan **20 detik terakhir**
untuk placeholder end screen pada video non-Shorts ≥ 3 menit: **horizontal 3/5/10 mnt** dan **vertikal 5/10 mnt**.
Narasinya = durasi − 20 detik. Vertikal 3 mnt adalah Shorts: total ≤ 3:00, tanpa end screen. Sampaikan keputusan
ini ke user dalam satu kalimat.

| Durasi | Narasi ±(detik) | Kata ID ±(2,3/dtk) | Kata EN ±(2,5/dtk) | Adegan | End screen |
|---|---|---|---|---|---|
| 30 dtk | 28 | 65 | 70 | 5-7 | tidak |
| 1 mnt | 57 | 130 | 140 | 7-10 | tidak |
| 3 mnt | vertikal 170 / horizontal 160 | 390 / 370 | 425 / 400 | 14-20 | horizontal saja |
| 5 mnt | 280 | 640 | 700 | 22-30 | ya |
| 10 mnt | 580 | 1330 | 1450 | 40-55 | ya |

## Tahap 2: Cerita & narasi

### 2a. Riset mendalam
Jalankan beberapa WebSearch sekaligus. Cari sumber primer atau tepercaya (jurnal, lembaga, museum, media besar).
Kumpulkan angka, tahun, nama, istilah, dan satu-dua detail kecil yang jarang diketahui (detail inilah yang membuat
penonton bertahan). Kalau ada sumber yang bertentangan, pakai angka yang paling aman lalu catat.
Sambil riset, catat calon footage nyata yang bisa memperkuat cerita (foto arsip, rekaman asli). Pencarian dan
pengunduhannya dilakukan di tahap 4b.

### 2b. Karang ceritanya
Jangan sekadar mendaftar fakta. Bangun cerita dengan tokoh BoxBot (mis. robot penjelajah yang penasaran, ilmuwan,
saksi sejarah), sebuah pertanyaan atau konflik, dan pembayaran di akhir:
- **Hook (0-3 detik):** kalimat yang membuat jempol berhenti, berupa pertanyaan, klaim mustahil, atau gambar aneh.
- **Setup:** konteks secepatnya. Jangan buka dengan salam.
- **Eskalasi:** tiap adegan sedikit lebih mengejutkan dari sebelumnya.
- **Twist:** fakta yang membalik dugaan, ditaruh sekitar 60-75 % durasi.
- **Payoff + Outro:** jawaban yang memuaskan, lalu kalimat penutup berkesan atau pertanyaan untuk kolom komentar.
- Video ≥ 3 mnt: bagi jadi 3-6 bab. Tiap bab dibuka dengan mini-hook, dan tiap ±45-60 detik ada "loop terbuka"
  (janji jawaban nanti) supaya retensi tidak jatuh.

### 2c. Tulis narasi (langsung di chat, jangan buat file)
Kalimat narasi ditulis dalam **bahasa suara** yang dipilih. Judul adegan dan nada tetap dalam bahasa Indonesia
supaya user mudah membaca. Format tetap untuk TTS Google AI Studio:

```
1. 0–3 detik (Hook) — Nada penasaran / misterius:
│ "Pernah nggak kamu bertanya-tanya... kenapa robot ini takut sama genangan air?"

2. 3–9 detik (Judul Adegan) — Nada menjelaskan:
│ "..."
```

- Satu baris per adegan, bernomor, waktu dari perkiraan kecepatan bicara ditambah jeda.
- Adegan pertama selalu **Hook** (penasaran/misterius), terakhir **Outro** (penutup berkesan). Nada berganti-ganti:
  menjelaskan, takjub, tegang, kaget/plot twist, heran, informatif, hangat, lucu.
- Kalimat pendek dan enak diucapkan. Angka yang rawan salah baca ditulis seperti diucapkan. Hindari singkatan,
  simbol, dan kata yang sulit dilafalkan TTS (tulis bunyinya bila perlu).
- Total kata mengikuti tabel durasi untuk bahasa itu.

Setelah daftar, tulis **Catatan** singkat:
- fakta/angka yang dipakai beserta sumbernya (URL);
- perkiraan durasi narasi (dan +20 dtk end screen bila ada);
- bahasa suara & subtitle;
- pemeran BoxBot (nama, warna, peran), 1 baris;
- tips: di AI Studio, tempel hanya kalimat di dalam tanda kutip (nada boleh dipakai sebagai arahan gaya), supaya
  nomor dan judul adegan tidak ikut dibaca.

Lalu minta user mengirim audionya (wav/mp3) dan berhenti di sini. Video baru dibuat setelah audio ada.

## Tahap 3: Audio → timing

1. Pastikan persiapan folder kerja sudah dilakukan (lihat atas). Buat `<kerja>/<slug>/` (huruf kecil, tanda hubung)
   dan salin `<skill>/assets/film/*` ke dalamnya.
2. Pindahkan audio user ke `<slug>/narasi.wav` (mp3 atau format lain dikonversi:
   `ffmpeg -i in.mp3 -ar 48000 <slug>/narasi.wav`), lalu salin ke `<slug>/public/narasi.wav`.
3. Transkrip: `python <skill>/scripts/transcribe.py <slug> --lang id|en` (bahasa suara). Hasilnya
   `transkrip.txt`, `public/words.json` (per kata), dan `public/segments.json` (per kalimat). Butuh
   `faster-whisper`; kalau belum ada, `pip install faster-whisper`.
4. Bandingkan transkrip dengan naskah:
   - kata yang salah dengar → `PERBAIKAN` di `src/Film.tsx` (words.json jangan diubah);
   - kalau TTS ikut membaca nomor/judul adegan, buang kata-kata itu dari words.json/segments.json, dan potong dari
     audio bila mengganggu (beri tahu user);
   - kalimat yang hilang atau berubah → ikuti audio, karena audio adalah kebenarannya.
5. **Subtitle beda bahasa:** tulis `public/subtitle.json` = segments.json dengan `text` diterjemahkan (waktu `s/e`
   tidak diubah). Terjemahkan secara natural dan ringkas, karena subtitle dibaca sambil menonton, bukan dibaca kata per kata.
6. Waktu tiap adegan = waktu kata pertama sampai awal kalimat adegan berikutnya (jeda napas masuk ke adegan
   sebelumnya). `NARASI_SEC` di `src/config.ts` = durasi asli `ffprobe narasi.wav`. Durasi film mengikuti audio,
   bukan target awal.

## Tahap 4: Video (Remotion + three.js)

### 4a. Treatment
Baca `references/gaya.md` dan bagian "Film selesai" di katalog, lalu pilih dan ubah gaya untuk film ini.
Tulis `TREATMENT.md` (5-10 baris): gaya, palet hex, cahaya, kamera, set utama, pemeran BoxBot (warna & aksesoris),
transisi, musik. Tujuannya supaya tiap film punya wajah sendiri dan tidak terasa otomatis.

### 4b. Isi film
- `src/config.ts`: format, `BAHASA_NARASI`, `BAHASA_SUBTITLE` (null = tanpa), `NARASI_SEC`, `ENDSCREEN_SEC`
  (20 atau 0), `TEMA` (palet & font). Font tema: `loadFont()` dari `@remotion/google-fonts/<NamaFont>` di Film.tsx.
  Pastikan font mendukung karakter bahasanya.
- `src/Film.tsx`: daftar `ADEGAN` (mulai/selesai dari transkrip), audio, subtitle (otomatis per kata bila bahasanya
  sama, per kalimat dari subtitle.json bila beda), end screen ("Tonton juga"/"Watch next" mengikuti bahasa suara).
- **Bahasa teks di layar:** semua tulisan informasi (label, angka, satuan, judul, end screen) mengikuti **bahasa
  suara**, termasuk format angkanya (EN: 70,000,000 · 23.5; ID: 70.000.000 · 23,5). Bahasa subtitle hanya berlaku
  untuk subtitle, yaitu transkripsi/terjemahan narasi. Contoh: suara Inggris + subtitle Indonesia → label tetap Inggris.
- `src/scenes/*.tsx`: satu komponen per adegan atau per lokasi, impor dari `../../../kit/...`. Hapus
  `ContohAdegan.tsx` setelah dipelajari.
- `<kerja>/kit/`:
  - `Stage`: kanvas three.js + pantulan lingkungan (wajib supaya plastik berkilat) + preset cahaya
    (siang/senja/malam/studio) + kabut + kamera.
  - `BoxBot`: tokoh robot kotak plastik. Prop: `warna`, `aksen`, `pose`, `wajah`
    (netral/senang/kaget/sedih/marah/kedip/bingung), `aksesoriKepala`, `pegangKanan`. Ada pembantu
    `jalan(t)`, `diam(t)`, `kedip(t, wajah)`.
  - `Glb`: memuat model .glb dari `public/` film, dengan ganti warna per nama material.
  - `util`: `camAt(keys, t)` untuk gerak kamera halus antar kunci, `smooth`, `lin`, `pop`, `easeOut`, tipe `Tema`.
  - `Captions` dan `Endscreen` (placeholder kotak video + lingkaran subscribe; prop `latar` untuk adegan 3D pelan).
  - `Teks`: `Label` (teks informasi yang "pop", posisi tengah atau `kiri`), `Kilat`, `Sapuan` (transisi cahaya).
  - `Footage`: `FotoBingkai` (gambar/video nyata berbingkai polaroid/tv/kartu) dan `PapanFoto` (gambar di dunia 3D).
  - `Sfx`: daftar efek suara terjadwal + `kata(words, "...")` untuk mengambil waktu kata dari transkrip.
  - Kit di `<kerja>` yang lebih lama dari skill tidak otomatis diperbarui. Kalau komponen di atas belum ada di
    `<kerja>/kit`, salin **hanya file yang belum ada** dari `<skill>/assets/workspace/kit/`.
- Aset: cek `<kerja>/aset/` dulu, karena mungkin sudah pernah diunduh. Kalau belum ada, unduh dari sumber di
  `references/aset-gratis.md` ke `<kerja>/aset/<sumber>/` dan catat di `aset/SUMBER.md`. Salin **hanya file yang
  dipakai** ke `<slug>/public/models/`, karena Remotion menyalin seluruh `public/` setiap render. Catat di
  `<slug>/CREDITS.md`.
- **Footage nyata (gambar/video gratis):** untuk setiap adegan yang lebih kuat dengan bukti asli (foto arsip,
  dokumen lama, rekaman NASA, slow-motion, mikroskop), cari bahannya dengan
  `python <skill>/scripts/cari_footage.py "<kueri Inggris>" --jenis gambar|video` (Wikimedia Commons, NASA, plus
  Pexels/Pixabay bila API key-nya ada). Ikuti `references/footage.md`: hanya lisensi aman (PD/CC0/CC BY/BY-SA,
  Pexels, Pixabay; hindari NC/ND), maksimal ±20 % durasi, selalu dibingkai lewat kit `Footage` (`FotoBingkai` 2D
  atau `PapanFoto` 3D), dan semua dicatat di `CREDITS.md` + deskripsi YouTube bila wajib atribusi.
- **SFX (selalu dipakai, supaya dramatis):** ikuti `references/sfx.md`. Buat pustaka sintesis sekali
  (`python <skill>/scripts/sfx.py pustaka <kerja>/aset/sfx/sintesis`: whoosh, pop, ding, boom, retak, kaca_pecah,
  dll.). Untuk suara nyata yang khusus, cari yang gratis dengan `sfx.py cari "<kueri Inggris>"` (Commons, Freesound
  CC0). Pasang lewat kit `Sfx`. Waktunya dari kata di transkrip (`kata(words, "explodes")`), rata-rata satu SFX
  per 2-4 detik, selalu di bawah narasi, dan cek `max_volume` < −1 dB di hasil akhir.
- Musik latar opsional: `<Audio>` dengan volume rendah, narasi harus tetap jelas.

Prinsip animasi (inilah yang membuat hasilnya terlihat dibuat sungguh-sungguh):
- Semua gerak dihitung dari waktu adegan `t`, jangan dari state. Setiap reaksi visual jatuh 0-3 frame sebelum
  kata yang memicunya (pakai `words.json`).
- Jangan ada frame yang diam: kamera selalu bergerak sedikit, dan tokoh bernapas atau berkedip.
- Gambar harus menunjukkan hal yang tidak diucapkan narasi (menambah, bukan mengulang).
- Format vertikal: lebar pandang sempit (±1,7 unit pada jarak 9 dengan fov 38). Tokoh ditumpuk ke kedalaman dan
  dijaga di tengah layar. Subtitle ada di ±64 % tinggi layar, di atas area UI Shorts.
- Video panjang: buat beberapa set (lokasi) yang dipakai ulang dengan kamera, cahaya, dan waktu yang berbeda,
  daripada puluhan set yang setengah jadi.

### 4c. Cek tampilan sebelum render penuh
Dari `<kerja>`: `npx tsc --noEmit`, lalu `node scripts/stills.mjs <slug> 2 10.5 31 ...` →
`<slug>/out/stills/s_<detik>.jpg` (skala 0,5). Ambil minimal satu still per adegan, lalu **lihat gambarnya** (Read).
Cek: tokoh masuk frame, plastik berkilat, tidak gelap atau pucat, subtitle tidak menutupi wajah, aset termuat,
end screen rapi. Perbaiki lalu ulangi.

### 4d. Render final (dari `<kerja>`)
```bash
npx remotion render <slug>/src/index.ts Film <slug>/out/<slug>.mp4 --public-dir=<slug>/public --gl=angle --crf=18 --concurrency=4
```
- Render panjang (≥ 3 mnt) dijalankan di latar belakang. Untuk 10 menit bisa makan waktu lebih dari satu jam.
- Setiap render menyalin `public/` ke folder TEMP dan tidak menghapusnya. Kalau ruang disk menipis, set
  `TEMP`/`TMP` ke drive yang lega, dan minta izin user sebelum menghapus sisa `remotion-webpack-bundle-*`.
- Verifikasi dengan `ffprobe`: durasi ≈ `TOTAL_SEC`, ada stream audio, resolusi benar, vertikal Shorts ≤ 3:00.
  Ambil 3-4 frame dari video jadi (`ffmpeg -ss <t> -i <file> -frames:v 1 cek_<t>.jpg`) dan lihat, terutama awal,
  twist, dan end screen.
- Salin hasil akhir ke `<slug>/<slug>.mp4`.

## Tahap 5: Siap unggah
Ikuti `references/youtube-meta.md`: judul, deskripsi, tag, kategori, dan **prompt thumbnail** untuk generator gambar
AI (bahasa Inggris, tokoh & gaya sesuai treatment, teks thumbnail dalam bahasa suara). Metadata ditulis dalam **bahasa suara**. Kalau subtitle-nya beda bahasa, tambahkan
juga judul dan deskripsi terjemahan (untuk fitur "Terjemahan" di YouTube Studio), plus file `.srt` dari
subtitle.json/segments.json bila user mau mengunggah subtitle terpisah. Berikan di chat, lalu simpan ke `<slug>/youtube.md`.
Terakhir, perbarui `katalog.md`: tambahkan film ke "Film selesai" (tanggal, slug, judul, durasi/format,
suara/subtitle, gaya) dan hapus idenya dari bank ide.
