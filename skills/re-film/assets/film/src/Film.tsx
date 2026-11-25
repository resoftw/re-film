import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { FPS, NARASI_SEC, TAIL_SEC, ENDSCREEN_SEC, BAHASA_NARASI, BAHASA_SUBTITLE, TEMA } from "./config";
import { Captions, type Kata, type Baris } from "../../kit/Captions";
import { Endscreen } from "../../kit/Endscreen";
import { lin } from "../../kit/util";
import words from "../public/words.json";
import subtitle from "../public/subtitle.json";
import { ContohAdegan } from "./scenes/ContohAdegan";

// Kata yang salah dengar di transkrip: { "salahdengar": "benar" }.
const PERBAIKAN: Record<string, string> = {};

/*
  Daftar adegan: waktu mulai/selesai (detik) diambil dari transkrip narasi (public/words.json),
  bukan dari perkiraan di naskah. Tiap adegan menerima t = detik sejak adegan mulai, dur = panjang adegan.
*/
export type AdeganProps = { t: number; dur: number };
const ADEGAN: { mulai: number; selesai: number; C: React.FC<AdeganProps> }[] = [
  { mulai: 0, selesai: NARASI_SEC + TAIL_SEC, C: ContohAdegan },
];

export const Film: React.FC = () => {
  const frame = useCurrentFrame();
  const T = frame / FPS;
  const akhirCerita = NARASI_SEC + TAIL_SEC;
  const terjemahan = BAHASA_SUBTITLE !== null && BAHASA_SUBTITLE !== BAHASA_NARASI;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("narasi.wav")} />
      {/* Musik latar (opsional): <Audio src={staticFile("musik.mp3")} volume={0.12} /> — narasi harus tetap jelas */}
      {ADEGAN.map(({ mulai, selesai, C }, i) => (
        <Sequence key={i} from={Math.round(mulai * FPS)} durationInFrames={Math.max(1, Math.round((selesai - mulai) * FPS))}>
          <C t={T - mulai} dur={selesai - mulai} />
        </Sequence>
      ))}
      {BAHASA_SUBTITLE && T < akhirCerita && (
        <Captions t={T} tema={TEMA} perbaikan={PERBAIKAN}
          kata={terjemahan ? undefined : (words as Kata[])} kalimat={terjemahan ? (subtitle as Baris[]) : undefined} />
      )}
      {ENDSCREEN_SEC > 0 && T >= akhirCerita && (
        <AbsoluteFill style={{ opacity: lin(akhirCerita, akhirCerita + 0.5, T) }}>
          <Endscreen t={T - akhirCerita} tema={TEMA} judul={BAHASA_NARASI === "en" ? "Watch next" : "Tonton juga"} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
