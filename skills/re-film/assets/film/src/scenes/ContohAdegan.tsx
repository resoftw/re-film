import React from "react";
import { Stage, Lantai } from "../../../kit/Stage";
import { BoxBot, jalan, diam, kedip } from "../../../kit/BoxBot";
import { camAt, lin, smooth, pop } from "../../../kit/util";
import type { AdeganProps } from "../Film";

// Contoh adegan: hapus/ganti untuk film sungguhan. Menunjukkan pola dasar:
// kamera dari kunci waktu, tokoh berjalan lalu berhenti, tokoh kedua "pop" muncul dan kaget.
export const ContohAdegan: React.FC<AdeganProps> = ({ t }) => {
  const cam = camAt([
    { t: 0, pos: [0, 2.2, 9], look: [0, 1.3, 0], fov: 38 },
    { t: 6, pos: [3.5, 1.6, 5.5], look: [0, 1.2, 0], fov: 34 },
    { t: 12, pos: [-2.5, 1.4, 4.2], look: [0.3, 1.3, 0], fov: 30 },
  ], t);
  const jalanSelesai = smooth(0, 4, t);
  // Format vertikal: lebar pandang horizontal sempit (±1.7 unit di jarak 9), jadi tokoh jangan jauh dari x = 0.
  const x = -1.4 + 1.0 * jalanSelesai;
  const pose = t < 4 ? jalan(t) : diam(t);
  const s2 = pop(4.2, t);
  return (
    <Stage cam={cam} cahaya="siang" latar="linear-gradient(#2b6fd6 0%, #9fd0ff 60%, #d9f0ff 100%)" kabut={{ warna: "#d9f0ff", dekat: 25, jauh: 90 }}>
      <Lantai warna="#5fb347" />
      <BoxBot warna="#ff7a3d" position={[x, 0, 0]} rotationY={t < 4 ? Math.PI / 2 : 0.35} pose={pose} wajah={kedip(t, t > 4.4 ? "kaget" : "senang")} />
      {s2 > 0 && (
        <BoxBot warna="#3db8ff" aksen="#22306a" position={[1.4, 0, -0.6]} rotationY={-0.5} skala={0.85 * s2}
          pose={{ ...diam(t, 2), angkatKanan: 2.2 * lin(5, 5.6, t) }} wajah={kedip(t, "senang", 1)} />
      )}
    </Stage>
  );
};
