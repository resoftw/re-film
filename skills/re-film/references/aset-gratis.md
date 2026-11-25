# Sumber aset gratis

Selalu cek lisensi di halaman aset itu sendiri, lalu catat setiap aset yang dipakai di `CREDITS.md` folder film
(nama, pembuat, URL, lisensi). CC0 tidak wajib atribusi, tapi tetap dicatat. CC-BY wajib atribusi: salin juga
barisnya ke deskripsi YouTube.

Unduhan disimpan sekali di `<kerja>/aset/<sumber>/<paket>/` (dicatat di `aset/SUMBER.md`) dan dipakai ulang antar
film. Ke `<slug>/public/models/` hanya disalin file yang benar-benar dipakai film itu.

## Model 3D (.glb/.gltf)
| Sumber | Lisensi | Isi | Catatan |
|---|---|---|---|
| kenney.nl/assets (kategori 3D) | CC0 | kit kota, alam, kastil, angkasa, bajak laut, makanan, furnitur, kendaraan | Unduh zip, ambil folder `Models/GLB format`. Nama material jelas → mudah diwarnai ulang lewat prop `warna` di `<Glb>` |
| quaternius.com | CC0 | alam stylized, hewan, bangunan, kendaraan, senjata abad pertengahan | gaya low-poly yang cocok dengan Kenney |
| poly.pizza | campuran CC0 / CC-BY | ribuan model low-poly (banyak dari Google Poly lama) | cek lisensi per model |
| polyhaven.com/models | CC0 | model realistis (furnitur, batu, tanaman) | biasanya terlalu realistis; pakai bila gaya "studio produk" |

## Tekstur, HDRI, latar
| Sumber | Lisensi | Isi |
|---|---|---|
| polyhaven.com (textures, hdris) | CC0 | HDRI untuk pantulan/langit, tekstur PBR |
| ambientcg.com | CC0 | tekstur PBR (kayu, batu, logam, plastik) |

## Suara & musik (opsional, dicampur pelan di bawah narasi)
| Sumber | Lisensi | Isi |
|---|---|---|
| kenney.nl (audio packs) | CC0 | SFX UI, impact, sci-fi, RPG |
| freesound.org | CC0 / CC-BY per file | SFX apa saja (filter lisensi CC0) |
| pixabay.com/music & /sound-effects | Pixabay Content License (boleh komersial, tanpa atribusi) | musik latar, SFX |
| YouTube Audio Library (Studio) | bebas untuk YouTube | musik; hanya bisa diunduh user dari YouTube Studio |

## Cara unduh dari terminal
- Banyak situs di atas memberi tautan zip langsung; unduh dengan `curl -L -o <file> <url>` ke `<kerja>/aset/<sumber>/`,
  ekstrak di sana, hapus zip-nya. Jangan unduh ke `public/` film (folder itu disalin Remotion setiap render).
- Kalau situs butuh klik/login atau unduhan gagal, minta user mengunduh dan menaruh filenya, sebutkan URL persisnya.
- Jangan mengambil aset dari situs yang lisensinya tidak jelas, atau aset berhak cipta (karakter terkenal, logo).
