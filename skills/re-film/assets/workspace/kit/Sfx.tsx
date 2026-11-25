// Efek suara (SFX) yang dijadwalkan per detik narasi. File ada di <slug>/public/sfx/.
import React from "react";
import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";

export type SfxEvent = {
  t: number;        // detik absolut di film (biasanya 0-3 frame SEBELUM kata pemicu)
  file: string;     // relatif public/, mis. "sfx/whoosh.wav"
  vol?: number;     // 0..1, default 0.35 (≈ −9 dB): SFX harus di bawah narasi
  rate?: number;    // kecepatan putar (variasi nada: 0.9–1.1 supaya SFX berulang tidak monoton)
  potong?: number;  // detik maksimum diputar (opsional)
};

/** Semua SFX film dalam satu komponen. Taruh di Film.tsx, setelah <Audio narasi>. */
export const Sfx: React.FC<{ daftar: SfxEvent[]; master?: number }> = ({ daftar, master = 1 }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {daftar.map((e, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(e.t * fps))} durationInFrames={e.potong ? Math.round(e.potong * fps) : undefined} layout="none">
          <Audio src={staticFile(e.file)} volume={(e.vol ?? 0.35) * master} playbackRate={e.rate ?? 1} />
        </Sequence>
      ))}
    </>
  );
};

/**
 * Waktu mulai kata ke-n yang cocok di transkrip (words.json), dikurangi `lebihAwal` detik.
 * Contoh: kata(words, "explodes") → 107.4 − 0.05. Lempar error kalau tidak ketemu supaya salah ketik ketahuan saat render.
 */
export function kata(words: { w: string; s: number }[], cari: string, ke = 1, lebihAwal = 0.05): number {
  const bersih = (x: string) => x.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  const hit = words.filter((w) => bersih(w.w) === bersih(cari));
  if (hit.length < ke) throw new Error(`Kata "${cari}" (ke-${ke}) tidak ada di words.json`);
  return Math.max(0, hit[ke - 1].s - lebihAwal);
}
