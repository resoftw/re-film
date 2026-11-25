import React, { useMemo } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import type { Tema } from "./util";

/*
  Subtitle, dua mode:
  - `kata`: bahasa subtitle = bahasa narasi. Pakai public/words.json (waktu per kata dari transcribe.py);
    dipotong 2-3 kata (vertikal) / ±6 kata (horizontal), kata yang sedang diucapkan diwarnai aksen.
  - `kalimat`: bahasa subtitle ≠ bahasa narasi (mis. suara Inggris, subtitle Indonesia). Pakai
    public/subtitle.json = [{ s, e, text }] per kalimat: waktu dari public/segments.json, teks terjemahan.
  Kata yang salah dengar diperbaiki lewat `perbaikan`, bukan dengan mengubah words.json.
*/
export type Kata = { w: string; s: number; e: number };
export type Baris = { s: number; e: number; text: string };

type Potong = { s: number; e: number; kata: Kata[] };

function potongKata(list: Kata[], max: number, perbaikan: Record<string, string>): Potong[] {
  const out: Potong[] = [];
  let cur: Kata[] = [];
  list.forEach((k, i) => {
    cur.push({ ...k, w: perbaikan[k.w.toLowerCase()] ?? k.w });
    const next = list[i + 1];
    const jeda = next ? next.s - k.e > 0.35 : true;
    if (cur.length >= max || /[.,!?]$/.test(k.w) || jeda) {
      out.push({ s: cur[0].s, e: Math.max(k.e, cur[0].s + 0.4), kata: cur });
      cur = [];
    }
  });
  return out;
}

/** Baris terjemahan panjang dipecah jadi potongan ≤ maxChar, waktunya dibagi sebanding panjang teks. */
function potongBaris(list: Baris[], maxChar: number): Potong[] {
  const out: Potong[] = [];
  for (const b of list) {
    const parts: string[] = [];
    let cur = "";
    for (const w of b.text.split(/\s+/)) {
      if ((cur + " " + w).trim().length > maxChar && cur) { parts.push(cur); cur = w; } else cur = (cur + " " + w).trim();
    }
    if (cur) parts.push(cur);
    const total = parts.reduce((s, p) => s + p.length, 0);
    let t = b.s;
    for (const p of parts) {
      const d = ((b.e - b.s) * p.length) / total;
      out.push({ s: t, e: t + d, kata: [{ w: p, s: t, e: t }] });
      t += d;
    }
  }
  return out;
}

export const Captions: React.FC<{
  t: number;
  tema: Tema;
  kata?: Kata[];
  kalimat?: Baris[];
  perbaikan?: Record<string, string>;
}> = ({ t, tema, kata, kalimat, perbaikan = {} }) => {
  const { width, height } = useVideoConfig();
  const vertikal = height > width;
  const perKata = !kalimat?.length;
  const chunks = useMemo(
    () => (perKata ? potongKata(kata ?? [], vertikal ? 3 : 6, perbaikan) : potongBaris(kalimat!, vertikal ? 26 : 48)),
    [kata, kalimat, perbaikan, vertikal, perKata],
  );
  const c = chunks.find((p) => t >= p.s - 0.05 && t < p.e + 0.15);
  if (!c) return null;
  // Vertikal: di atas area tombol/judul Shorts. Horizontal: dekat bawah.
  return (
    <AbsoluteFill style={{ alignItems: "center", pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: vertikal ? "64%" : "80%", width: "86%", textAlign: "center", fontFamily: tema.font,
        fontWeight: 800, fontSize: vertikal ? (perKata ? 74 : 62) : 58, lineHeight: 1.15, color: tema.teks,
        WebkitTextStroke: `10px ${tema.teksGaris}`, paintOrder: "stroke fill" as any }}>
        {c.kata.map((k, i) => (
          <span key={i} style={{ color: perKata && t >= k.s ? tema.aksen : tema.teks }}>{perKata ? k.w.replace(/[.,]$/, "") : k.w} </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
