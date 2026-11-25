# SFX: efek suara gratis supaya film lebih dramatis

SFX membuat gambar terasa "berat" dan memberi tanda ke penonton: muncul (pop), pindah adegan (whoosh), kejutan
(boom), angka/fakta penting (ding). Aturannya: **narasi selalu menang**. SFX menegaskan, tidak menutupi suara.

## Dua jalur bahan
1. **Sintesis sendiri** (selalu ada, tanpa internet, tanpa urusan lisensi):
   `python <skill>/scripts/sfx.py pustaka <kerja>/aset/sfx/sintesis` (sekali saja, dipakai ulang semua film).
   Jenis: `whoosh` (transisi), `swoosh_naik` (ketegangan naik sebelum twist), `pop` (benda/tokoh muncul), `klik`,
   `tik` (penghitung angka), `ding` (fakta/angka penting), `boom` (ledakan/kejutan besar), `dentum` (benda jatuh,
   palu), `retak` (retakan menjalar), `kaca_pecah`, `kilau` (sesuatu menyala/ajaib), `glitch` (teknologi/rusak),
   `detak` (tegang, jantung). Variasi: `--dur`, `--nada` (Hz) untuk pop/tik/ding/dentum.
2. **Dari internet** (untuk suara nyata yang sulit disintesis: hewan, mesin, air, keramaian, alat tertentu):
   `python <skill>/scripts/sfx.py cari "<kueri Inggris>"` lalu `... unduh <url> <kerja>/aset/sfx/<sumber>/`.

| Sumber | Lisensi | Catatan |
|---|---|---|
| Wikimedia Commons (audio) | per file: PD / CC0 / CC BY / CC BY-SA | ada di skrip, tanpa kunci; cek kolom lisensi |
| Freesound.org | **filter CC0 saja** di skrip | butuh `FREESOUND_API_KEY` gratis; unduhan = preview HQ mp3 (cukup untuk SFX) |
| Pixabay Sound Effects | Pixabay Content License (bebas komersial) | tanpa API audio: user unduh manual dari pixabay.com/sound-effects |
| Mixkit SFX | Mixkit Free License (bebas dipakai di video) | unduh manual dari mixkit.co/free-sound-effects |
| Kenney audio packs | CC0 | unduh manual (tautan bertanda tangan) |
**Hindari**: BBC Sound Effects (lisensi RemArc non-komersial), lisensi NC/ND, dan "free" tanpa lisensi tertulis.
Semua SFX internet dicatat di `<slug>/CREDITS.md`, dan yang CC BY/BY-SA juga masuk deskripsi YouTube.

## Cara pasang (kit `Sfx.tsx`)
1. Salin hanya SFX yang dipakai ke `<slug>/public/sfx/`.
2. Di `Film.tsx`, buat daftar yang waktunya diambil dari kata di transkrip, bukan ditebak:
   ```tsx
   import { Sfx, kata, type SfxEvent } from "../../kit/Sfx";
   const W = words as { w: string; s: number }[];
   const SFX: SfxEvent[] = [
     { t: kata(W, "explodes"), file: "sfx/kaca_pecah.wav", vol: 0.5 },
     { t: 21.0, file: "sfx/whoosh.wav" },                       // transisi adegan (detik pindah adegan − 0.2)
     { t: kata(W, "372") - 0.6, file: "sfx/swoosh_naik.wav", vol: 0.25 },
   ];
   // ... di dalam Film: <Sfx daftar={SFX} />
   ```
3. Pakai `rate` 0.9–1.1 untuk SFX yang berulang (pop, tik) supaya tidak terdengar seperti tempelan.

## Mixing (supaya tetap enak didengar)
- Volume awal: transisi/whoosh 0.25–0.35, pop/tik/klik 0.3, ding 0.35, boom/kaca pecah 0.5–0.6 (momen puncak saja).
- Kepadatan: rata-rata **satu SFX per 2-4 detik**. Biarkan ada ruang hening, karena hening sebelum twist itu dramatis.
- Jangan menaruh SFX keras tepat di atas kata penting. Geser ke jeda napas sebelum/sesudahnya.
- Cek hasil akhir: `ffmpeg -i <slug>.mp4 -af volumedetect -f null -` → `max_volume` harus < −1 dB (tidak pecah).
  Kalau pecah, turunkan `master` di `<Sfx master={0.8} />`.
- Hook butuh SFX di 1 detik pertama (pop/whoosh/boom) karena membantu menghentikan jempol.
