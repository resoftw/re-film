// Menampilkan footage nyata (gambar/video gratis dari internet) di dalam film, tanpa merusak gaya 3D plastiknya.
// File ada di <slug>/public/footage/ (salin dari <kerja>/aset/footage/), dipanggil dengan path relatif public.
import React, { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, delayRender, continueRender, cancelRender, useVideoConfig } from "remotion";
import { pop, lin, easeOut, type Tema, type V3 } from "./util";

const isVideo = (f: string) => /\.(mp4|webm|mov)$/i.test(f);

/**
 * Footage 2D berbingkai yang "pop" masuk: gaya `polaroid` (foto arsip), `tv` (layar tua), `kartu` (sudut membulat).
 * Video diputar mulai `mulaiVideo` detik. `geser` = gerak Ken Burns pelan (zoom 1 → 1+geser) supaya tidak diam.
 */
export const FotoBingkai: React.FC<{
  file: string; t: number; t0: number; t1?: number; gaya?: "polaroid" | "tv" | "kartu"; tema: Tema;
  lebar?: number; x?: number; y?: number; miring?: number; keterangan?: string; geser?: number; mulaiVideo?: number;
}> = ({ file, t, t0, t1 = 1e9, gaya = "kartu", tema, lebar, x, y, miring = -3, keterangan, geser = 0.08, mulaiVideo = 0 }) => {
  const { width, height } = useVideoConfig();
  const s = pop(t0, t) * (1 - easeOut(lin(t1, t1 + 0.3, t)));
  if (s <= 0.001) return null;
  const w = lebar ?? Math.min(width, height) * 0.62;
  const h = w * (gaya === "tv" ? 0.75 : 0.66);
  const zoom = 1 + geser * lin(t0, Math.min(t1, t0 + 8), t);
  const isi = isVideo(file)
    ? <OffthreadVideo src={staticFile(file)} startFrom={Math.round(mulaiVideo * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }} />
    : <Img src={staticFile(file)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }} />;
  const bingkai: React.CSSProperties =
    gaya === "polaroid" ? { background: "#fbf8f1", padding: `${w * 0.04}px ${w * 0.04}px ${w * 0.16}px`, borderRadius: 6 }
      : gaya === "tv" ? { background: "#2b2d42", padding: w * 0.06, borderRadius: w * 0.08, border: `6px solid ${tema.teksGaris}` }
        : { background: "#ffffff", padding: 10, borderRadius: 28 };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: (x ?? width / 2) - w / 2, top: (y ?? height * 0.3) - h / 2,
        transform: `scale(${s}) rotate(${miring}deg)`, boxShadow: "0 24px 60px rgba(0,0,0,0.35)", ...bingkai }}>
        <div style={{ width: w, height: h, overflow: "hidden", borderRadius: gaya === "kartu" ? 20 : gaya === "tv" ? w * 0.05 : 2,
          filter: gaya === "tv" ? "contrast(1.1) saturate(0.85)" : undefined }}>{isi}</div>
        {keterangan && gaya === "polaroid" && (
          <div style={{ position: "absolute", bottom: w * 0.035, left: 0, right: 0, textAlign: "center", fontFamily: tema.font,
            fontSize: w * 0.055, color: "#3a3226" }}>{keterangan}</div>
        )}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Hook tekstur dari gambar di public/, dipakai DI DALAM Stage/ThreeCanvas.
 * Penting: ThreeCanvas Remotion hanya menggambar ulang saat frame berganti. Jadi setelah tekstur siap kita paksa
 * satu gambar ulang (`advance`) dulu, baru lepas delayRender, kalau tidak still/frame pertama tampil tanpa gambar.
 */
export const useTekstur = (file: string) => {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  const [h] = useState(() => delayRender(`tekstur ${file}`));
  const { advance } = useThree();
  useEffect(() => {
    new THREE.TextureLoader().loadAsync(staticFile(file))
      .then((tx) => { tx.colorSpace = THREE.SRGBColorSpace; setTex(tx); })
      .catch((e) => cancelRender(e));
  }, [file]);
  useEffect(() => {
    if (!tex) return;
    const id = requestAnimationFrame(() => { advance(performance.now()); continueRender(h); });
    return () => cancelAnimationFrame(id);
  }, [tex, h, advance]);
  return tex;
};

/**
 * Papan gambar di dunia 3D (layar TV di bengkel, foto di dinding, papan di tangan BoxBot).
 * Untuk VIDEO di dunia 3D: render dulu klipnya sebagai rangkaian gambar, atau lebih sederhana pakai FotoBingkai 2D.
 */
export const PapanFoto: React.FC<{ file: string; lebar?: number; tinggi?: number; position?: V3; rotation?: V3; menyala?: number }> = ({
  file, lebar = 1.6, tinggi = 0.9, position = [0, 0, 0], rotation = [0, 0, 0], menyala = 0.6,
}) => {
  const tex = useTekstur(file);
  const mat = useMemo(() => (tex ? new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: "#ffffff", emissiveIntensity: menyala, roughness: 0.4 }) : null), [tex, menyala]);
  if (!mat) return null;
  return <mesh position={position} rotation={rotation} material={mat}><planeGeometry args={[lebar, tinggi]} /></mesh>;
};
