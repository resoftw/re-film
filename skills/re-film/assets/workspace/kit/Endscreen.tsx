import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { easeOut, lin, type Tema } from "./util";

/*
  Placeholder end screen YouTube (20 detik terakhir video non-Shorts).
  Kotak-kotak ini hanya penanda tempat; elemen aslinya (video/playlist/subscribe) dipasang di YouTube Studio
  di atas kotak tersebut. `latar` boleh diisi adegan 3D tema film yang bergerak pelan (lebih hidup), asal
  area kotak tetap bersih dari teks/tokoh penting. `judul` mengikuti bahasa video ("Tonton juga" / "Watch next").
*/
export const Endscreen: React.FC<{ t: number; tema: Tema; judul?: string; latar?: React.ReactNode }> = ({ t, tema, judul = "Tonton juga", latar }) => {
  const { width: W, height: H } = useVideoConfig();
  const a = easeOut(lin(0, 0.8, t));
  const kotak = (x: number, y: number, w: number, h: number, delay: number) => (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 18,
      border: `6px dashed ${tema.teks}`, background: "rgba(0,0,0,0.25)", opacity: easeOut(lin(delay, delay + 0.6, t)) }} />
  );
  const bulat = (cx: number, cy: number, r: number, delay: number) => (
    <div style={{ position: "absolute", left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: "50%",
      border: `6px dashed ${tema.aksen}`, background: "rgba(0,0,0,0.25)", opacity: easeOut(lin(delay, delay + 0.6, t)) }} />
  );
  const teks = (top: number, size: number) => (
    <div style={{ position: "absolute", top, width: "100%", textAlign: "center", fontFamily: tema.font, fontWeight: 800,
      fontSize: size, color: tema.teks, WebkitTextStroke: `8px ${tema.teksGaris}`, paintOrder: "stroke fill" as any,
      opacity: a, transform: `translateY(${(1 - a) * 30}px)` }}>{judul}</div>
  );
  return (
    <AbsoluteFill style={{ background: latar ? undefined : `linear-gradient(${tema.langitAtas}, ${tema.langitBawah})` }}>
      {latar}
      {W > H ? (
        <>
          {teks(90, 80)}
          {kotak(140, 300, 720, 405, 0.3)}
          {kotak(W - 140 - 720, 300, 720, 405, 0.5)}
          {bulat(W / 2, 880, 110, 0.7)}
        </>
      ) : (
        <>
          {teks(220, 90)}
          {kotak(90, 420, W - 180, (W - 180) * 9 / 16, 0.3)}
          {kotak(90, 420 + (W - 180) * 9 / 16 + 60, W - 180, (W - 180) * 9 / 16, 0.5)}
          {bulat(W / 2, H - 420, 120, 0.7)}
        </>
      )}
    </AbsoluteFill>
  );
};
