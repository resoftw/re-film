# Menu gaya visual

Tujuan: tiap film terasa dibuat tangan untuk temanya, bukan keluaran pabrik. Tokohnya selalu BoxBot plastik
berkilat, tapi dunia, cahaya, kamera, palet, huruf dan transisinya berganti mengikuti cerita.

Cara pakai:
1. Baca bagian "Film selesai" di `katalog.md`. Gaya 3 film terakhir jangan diulang persis.
2. Pilih satu gaya di bawah yang paling cocok dengan *perasaan* cerita (bukan sekadar topiknya), lalu ubah
   minimal dua hal (palet, sudut kamera, material dunia, transisi) supaya jadi milik film ini.
3. Tulis pilihannya di `TREATMENT.md` (5-10 baris): gaya, palet hex, cahaya, kamera, set utama, transisi, musik.

Boleh juga mengarang gaya baru di luar daftar. Daftar ini titik awal, bukan batas.

| Gaya | Cocok untuk | Palet & cahaya | Kamera & gerak | Dunia/set | Transisi |
|---|---|---|---|---|---|
| **Diorama mainan** | sains sehari-hari, "kok bisa" | pastel cerah, siang, bayangan lembut | sudut tinggi miring 30-45°, tilt-shift (DOF kuat) | meja/kota mini, aset Kenney diperkecil | wipe geser, benda "pop" masuk |
| **Studio produk** | teknologi, benda, penemuan | latar mulus satu warna (sweep), cahaya studio, kilap maksimal | putar 360° pelan, close-up makro, dolly lurus | panggung bundar, benda melayang | potong tajam di ketukan, cahaya menyapu |
| **Malam neon** | misteri, internet, masa depan | biru tua + magenta/sian emisif, preset malam, bloom | low angle, kamera mengambang lambat | kota kotak emisif, grid lantai | glitch singkat, kedip neon |
| **Senja epik** | sejarah, perjalanan, kisah heroik | oranye-ungu, preset senja, cahaya dari belakang | wide shot jauh lalu push-in, siluet | lanskap low-poly, kapal, benteng | fade lewat matahari, crossfade |
| **Kertas & kardus warna** | anak-anak, cerita ringan | warna primer jenuh, siang | datar dari samping (seperti panggung boneka) | pohon/rumah datar berlapis seperti pop-up book | lipatan/geser panggung |
| **Bawah laut / angkasa** | alam, astronomi, biologi | biru gelap bergradasi, kabut tebal, partikel | melayang 3 sumbu, roll kecil | low-poly laut/planet, gelembung/bintang | tenggelam/naik ke warna |
| **Laboratorium bersih** | tubuh manusia, kimia, data | putih + satu warna aksen, studio | top-down, potongan melintang (cutaway) | meja lab, tabung, papan angka | zoom masuk ke benda (match cut) |
| **Retro poster** | fakta sejarah unik, budaya | krem, merah bata, teal pudar, sedikit grain | statis-dengan-creep, framing simetris | bentuk geometris besar, langit polos | iris/lingkaran, kertas digeser |
| **Dramatis gelap** | tragedi, bencana, tegang | hampir hitam + satu sumber cahaya keras, kontras tinggi | handheld dibuat halus, dolly zoom saat twist | ruang sempit, debu/partikel | potong ke hitam, kilat putih |
| **Dunia blok raksasa** | skala, angka besar, "seberapa besar" | warna mainan, langit cerah | kamera mundur jauh berulang (reveal skala) | BoxBot kecil di depan benda raksasa | tarik mundur terus (zoom-out chain) |

## Aturan yang selalu berlaku
- Plastik BoxBot harus terlihat berkilat: selalu pakai `Stage` (ada pantulan lingkungan) atau beri `scene.environment` sendiri.
- Warna BoxBot disesuaikan peran & tema (mis. ilmuwan putih-teal, penjelajah oranye, tokoh jahat ungu gelap).
  Aksesoris kepala/tangan (topi, kacamata, helm, obor, buku) dibuat dari bentuk primitif sederhana.
- Tidak ada adegan yang diam: tiap shot punya gerak kamera kecil (push-in pelan) atau gerak tokoh.
- Format vertikal: bidang pandang horizontal sempit. Susun tokoh bertumpuk ke kedalaman (depan-belakang),
  bukan berjajar ke samping; jaga subjek di tengah 60 % tinggi layar (atas & bawah tertutup UI Shorts).
- Format horizontal: manfaatkan lebar (dua tokoh berhadapan, perjalanan kiri→kanan).
- Teks di layar (angka, istilah kunci) boleh, singkat, memakai font tema film, dan selalu dalam bahasa suara
  (bukan bahasa subtitle).
