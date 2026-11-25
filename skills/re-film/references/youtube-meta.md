# Saran metadata YouTube

Tulis langsung di chat (dan simpan juga di `youtube.md` folder film supaya mudah disalin nanti).

## Judul (beri 3 pilihan)
- Maksimal 100 karakter, tapi kata kunci & rasa penasaran harus ada di ±60 karakter pertama (yang terlihat di HP).
- Sudut dari hook narasi: fakta mengejutkan, pertanyaan, atau kontras ("Kecil tapi ...").
- Tanpa clickbait yang tidak dijawab videonya. Bahasa Indonesia santai; huruf kapital seperlunya.
- Shorts: tidak perlu menulis #Shorts di judul (YouTube mengenali dari format ≤3 menit vertikal), boleh di deskripsi.

## Deskripsi
1. 1-2 kalimat pembuka yang mengulang hook + kata kunci utama (inilah yang tampil di pencarian).
2. Ringkasan isi 2-4 kalimat.
3. Video ≥3 menit: **bab (chapters)** dari transkrip: baris pertama `0:00`, minimal 3 bab, tiap bab ≥10 detik,
   format `0:00 Judul bab`. Bab terakhir boleh "Penutup".
4. Sumber fakta (judul + URL singkat) dari riset.
5. Kredit aset/musik CC-BY dari `CREDITS.md` (CC0 boleh disebut singkat).
6. 3-5 hashtag di baris terakhir (3 pertama tampil di atas judul), mis. `#sains #faktaunik #shorts`.

## Tag
- Daftar dipisah koma, total ≤500 karakter. Campur: kata kunci utama, variasi ejaan/sinonim, versi Inggris,
  topik umum. 10-20 tag sudah cukup.

## Kategori (pilih satu, nama sesuai YouTube Studio bahasa Indonesia)
Film & Animasi · Otomotif & Kendaraan · Musik · Hewan Peliharaan & Binatang · Olahraga · Perjalanan & Acara · Game ·
Orang & Blog · Komedi · Hiburan · Berita & Politik · Gaya & Tips · Pendidikan · Sains & Teknologi · Nonprofit & Aktivisme

Biasanya: fakta sains/alam → Sains & Teknologi atau Pendidikan; sejarah/cerita → Pendidikan atau Film & Animasi;
cerita fiksi lucu → Film & Animasi atau Komedi. Sebutkan alasannya dalam satu kalimat.

## Prompt thumbnail (selalu dibuat, untuk Shorts maupun video biasa)
Tulis prompt siap tempel untuk generator gambar AI (Gemini/Imagen, ChatGPT, Midjourney, dll.) dalam **bahasa Inggris**
(generator paling patuh pada prompt Inggris), di dalam blok kode supaya mudah disalin. Thumbnail harus terasa satu
dunia dengan videonya, jadi prompt menggambarkan tokoh dan gaya persis seperti di `TREATMENT.md`.

Isi prompt, berurutan:
1. **Ukuran:** video biasa → `16:9, 1280x720`; Shorts → `9:16, 1080x1920` (subjek di tengah, karena feed Shorts
   memotong pinggir).
2. **Subjek utama:** BoxBot dengan warna & aksesoris film ini ("a cute glossy plastic box-shaped robot, rounded
   corners, orange #ff8a3d, big round black eyes, alarm clock on its head"), ekspresi yang kuat (kaget/takjub),
   ditambah satu benda kunci cerita (mis. T-Rex mainan plastik).
3. **Momen:** satu gambar yang memancing rasa penasaran (biasanya hook atau twist), bukan rangkuman seluruh video.
4. **Gaya:** sesuai treatment ("toy diorama, glossy plastic, soft studio reflections, tilt-shift, vibrant saturated
   colors, 3D render"), palet hex film, kontras tinggi antara subjek dan latar.
5. **Teks:** maksimal 3-4 kata, dalam **bahasa suara**, ditulis persis di dalam tanda kutip, huruf tebal besar dengan
   outline gelap, posisinya disebutkan (mis. "top third"). Teks thumbnail berbeda dari judul dan saling melengkapi.
6. **Larangan:** `no watermark, no logo, no extra text, no realistic humans`.

Berikan juga 1 varian alternatif (sudut/momen lain) dan satu baris saran: kalau hasil AI melenceng dari tokoh,
pakai still dari video sebagai referensi gambar (`node scripts/stills.mjs <slug> <detik>`) lalu minta generator
"keep the same character design". Simpan prompt-nya di `youtube.md`.

## Tambahan singkat
- Pengingat end screen: pasang elemen di YouTube Studio tepat di atas kotak placeholder (20 detik terakhir).
- Centang "Konten yang diubah atau sintetis"? Narasi TTS dan animasi 3D buatan kode biasanya *tidak* wajib dilabel
  kecuali menampilkan orang/peristiwa nyata secara realistis; sebutkan ini sebagai catatan, keputusan di user.
