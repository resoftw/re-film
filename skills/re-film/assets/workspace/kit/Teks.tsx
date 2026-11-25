// Teks informasi & transisi 2D yang dipakai banyak film. Tulisan selalu dalam BAHASA SUARA film.
import React from "react";
import { AbsoluteFill } from "remotion";
import { pop, lin, easeOut, type Tema } from "./util";

export const gayaTeks = (tema: Tema, size: number, warna?: string): React.CSSProperties => ({
  fontFamily: tema.font, fontWeight: 700, fontSize: size, color: warna ?? tema.teks, lineHeight: 1.05,
  WebkitTextStroke: `${Math.round(size / 7)}px ${tema.teksGaris}`, paintOrder: "stroke fill" as any, textAlign: "center",
});

/** Teks yang "pop" masuk pada detik t0 dan menyusut keluar pada t1. `kiri` (px) untuk teks di samping, default tengah. */
export const Label: React.FC<{
  t: number; t0: number; t1?: number; tema: Tema; top?: number; size?: number; warna?: string; kiri?: number; lebar?: number; children: React.ReactNode;
}> = ({ t, t0, t1 = 1e9, tema, top = 120, size = 100, warna, kiri, lebar, children }) => {
  const s = pop(t0, t) * (1 - easeOut(lin(t1, t1 + 0.25, t)));
  if (s <= 0.001) return null;
  const posisi: React.CSSProperties = kiri === undefined
    ? { left: 0, right: 0, margin: "0 auto", width: lebar ?? "90%" }
    : { left: kiri, width: lebar ?? 700 };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top, ...posisi, transform: `scale(${s})`, ...gayaTeks(tema, size, warna) }}>{children}</div>
    </AbsoluteFill>
  );
};

/** Kilat warna (default putih) untuk transisi atau ledakan. */
export const Kilat: React.FC<{ t: number; t0: number; dur?: number; warna?: string }> = ({ t, t0, dur = 0.45, warna = "#fff" }) => {
  const x = lin(t0, t0 + dur, t);
  if (x <= 0 || x >= 1) return null;
  return <AbsoluteFill style={{ background: warna, opacity: Math.sin(x * Math.PI) }} />;
};

/** Sapuan cahaya diagonal (transisi ala iklan produk). */
export const Sapuan: React.FC<{ t: number; t0: number; dur?: number }> = ({ t, t0, dur = 0.5 }) => {
  const x = lin(t0, t0 + dur, t);
  if (x <= 0 || x >= 1) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-50%", height: "200%", width: "35%", left: `${-40 + x * 150}%`,
        transform: "rotate(18deg)", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)" }} />
    </AbsoluteFill>
  );
};
