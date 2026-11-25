import React, { useMemo } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { V3 } from "./util";

/*
  BoxBot: robot kotak dari plastik mengilap, sudut membulat, wajah sederhana.
  Tinggi ±1.95 unit, kaki di y = 0, menghadap +Z.
  Semua gerak lewat prop `pose` & `wajah` yang dihitung dari waktu adegan.
*/

export type Wajah = "netral" | "senang" | "kaget" | "sedih" | "marah" | "kedip" | "bingung";

export type Pose = {
  kepalaYaw?: number;   // menoleh kiri/kanan (radian)
  kepalaPitch?: number; // mengangguk
  kepalaRoll?: number;  // memiringkan kepala
  lenganKiri?: number;  // ayun depan/belakang (radian, + = ke depan)
  lenganKanan?: number;
  angkatKiri?: number;  // angkat ke samping (radian)
  angkatKanan?: number;
  kakiKiri?: number;    // ayun kaki
  kakiKanan?: number;
  bob?: number;         // naik-turun badan (unit)
  condong?: number;     // badan condong ke depan (radian)
};

export type BoxBotProps = {
  warna: string;           // warna plastik utama
  aksen?: string;          // warna sendi/panel dada
  mata?: string;           // warna mata (default hitam mengilap)
  position?: V3;
  rotationY?: number;
  skala?: number;
  pose?: Pose;
  wajah?: Wajah;
  /** atribut tema (topi, kacamata, alat): dirender menempel di kepala, koordinat kepala (atas kepala y = 0.4) */
  aksesoriKepala?: React.ReactNode;
  /** benda di tangan kanan, koordinat ujung lengan */
  pegangKanan?: React.ReactNode;
};

const geoCache = new Map<string, THREE.BufferGeometry>();
const rbox = (w: number, h: number, d: number, r: number) => {
  const k = `${w}|${h}|${d}|${r}`;
  if (!geoCache.has(k)) geoCache.set(k, new RoundedBoxGeometry(w, h, d, 5, r));
  return geoCache.get(k)!;
};

/** Plastik berkilat: clearcoat tinggi, kekasaran rendah. Butuh scene.environment (lihat Stage). */
export const usePlastik = (warna: string, kasar = 0.22) =>
  useMemo(() => new THREE.MeshPhysicalMaterial({ color: warna, roughness: kasar, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.06, sheen: 0 }), [warna, kasar]);

const Mata: React.FC<{ x: number; wajah: Wajah; mat: THREE.Material }> = ({ x, wajah, mat }) => {
  const sy = wajah === "kedip" ? 0.12 : wajah === "kaget" ? 1.25 : wajah === "senang" ? 0.75 : 1;
  const s = wajah === "kaget" ? 1.2 : 1;
  return (
    <group position={[x, 0.04, 0.401]}>
      <mesh scale={[s, sy * s, 1]} rotation={[Math.PI / 2, 0, 0]} material={mat}>
        <cylinderGeometry args={[0.085, 0.085, 0.02, 32]} />
      </mesh>
      {wajah !== "kedip" && (
        <mesh position={[0.03 * s, 0.03 * sy * s, 0.03]}>
          <circleGeometry args={[0.024 * s, 16]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      )}
      {(wajah === "marah" || wajah === "sedih" || wajah === "bingung") && (
        <mesh position={[0, 0.14, 0.01]} rotation={[0, 0, (wajah === "marah" ? -0.45 : wajah === "sedih" ? 0.4 : x > 0 ? 0.35 : 0) * Math.sign(x)]} material={mat}>
          <boxGeometry args={[0.16, 0.03, 0.02]} />
        </mesh>
      )}
    </group>
  );
};

const Mulut: React.FC<{ wajah: Wajah; mat: THREE.Material }> = ({ wajah, mat }) => {
  if (wajah === "kaget")
    return <mesh position={[0, -0.17, 0.401]} rotation={[Math.PI / 2, 0, 0]} material={mat}><cylinderGeometry args={[0.055, 0.055, 0.02, 24]} /></mesh>;
  if (wajah === "senang" || wajah === "sedih") {
    const atas = wajah === "sedih";
    return (
      <mesh position={[0, atas ? -0.22 : -0.13, 0.401]} rotation={[0, 0, atas ? 0 : Math.PI]} material={mat}>
        <torusGeometry args={[0.09, 0.018, 8, 24, Math.PI]} />
      </mesh>
    );
  }
  return <mesh position={[0, -0.17, 0.401]} material={mat}><boxGeometry args={[wajah === "bingung" ? 0.08 : 0.12, 0.025, 0.02]} /></mesh>;
};

export const BoxBot: React.FC<BoxBotProps> = ({
  warna, aksen = "#3a3a46", mata = "#0d0d12", position = [0, 0, 0], rotationY = 0, skala = 1,
  pose = {}, wajah = "netral", aksesoriKepala, pegangKanan,
}) => {
  const badan = usePlastik(warna);
  const sendi = usePlastik(aksen, 0.3);
  const hitam = useMemo(() => new THREE.MeshPhysicalMaterial({ color: mata, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.02 }), [mata]);
  const p = pose;
  const part = (geo: THREE.BufferGeometry, mat: THREE.Material, pos: V3) => (
    <mesh geometry={geo} material={mat} position={pos} castShadow receiveShadow />
  );
  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={skala}>
      {/* kaki: pivot di pinggul (y 0.5) */}
      {([[-0.17, p.kakiKiri ?? 0], [0.17, p.kakiKanan ?? 0]] as const).map(([x, a], i) => (
        <group key={i} position={[x, 0.52, 0]} rotation={[a, 0, 0]}>
          {part(rbox(0.22, 0.5, 0.26, 0.06), badan, [0, -0.25, 0])}
          {part(rbox(0.24, 0.08, 0.32, 0.03), sendi, [0, -0.48, 0.03])}
        </group>
      ))}
      <group position={[0, p.bob ?? 0, 0]} rotation={[p.condong ?? 0, 0, 0]}>
        {/* badan */}
        {part(rbox(0.72, 0.72, 0.46, 0.08), badan, [0, 0.9, 0])}
        {part(rbox(0.3, 0.22, 0.04, 0.03), sendi, [0, 0.95, 0.23])}
        {/* lengan: pivot di bahu */}
        {([[-1, p.lenganKiri ?? 0, p.angkatKiri ?? 0], [1, p.lenganKanan ?? 0, p.angkatKanan ?? 0]] as const).map(([s, a, up], i) => (
          <group key={i} position={[0.45 * s, 1.18, 0]} rotation={[-a, 0, up * s]}>
            {part(rbox(0.17, 0.56, 0.2, 0.05), badan, [0.02 * s, -0.27, 0])}
            {part(rbox(0.19, 0.1, 0.22, 0.04), sendi, [0.02 * s, -0.56, 0])}
            {s > 0 && pegangKanan && <group position={[0.02, -0.62, 0.05]}>{pegangKanan}</group>}
          </group>
        ))}
        {/* leher + kepala: pivot di leher */}
        {part(rbox(0.22, 0.1, 0.22, 0.03), sendi, [0, 1.3, 0])}
        <group position={[0, 1.35, 0]} rotation={[p.kepalaPitch ?? 0, p.kepalaYaw ?? 0, p.kepalaRoll ?? 0]}>
          <group position={[0, 0.4, 0]}>
            {part(rbox(1.0, 0.8, 0.8, 0.12), badan, [0, 0, 0])}
            <Mata x={-0.2} wajah={wajah} mat={hitam} />
            <Mata x={0.2} wajah={wajah} mat={hitam} />
            <Mulut wajah={wajah} mat={hitam} />
            <group position={[0, 0.4, 0]}>{aksesoriKepala}</group>
          </group>
        </group>
      </group>
    </group>
  );
};

/** Pose berjalan siklik. t = detik, kecepatan = langkah per detik. */
export const jalan = (t: number, kecepatan = 1.8, ayun = 0.55): Pose => {
  const s = Math.sin(t * kecepatan * Math.PI);
  return { kakiKiri: s * ayun, kakiKanan: -s * ayun, lenganKiri: -s * ayun * 0.8, lenganKanan: s * ayun * 0.8, bob: Math.abs(Math.cos(t * kecepatan * Math.PI)) * 0.05, condong: 0.06 };
};

/** Diam bernapas (supaya tokoh tidak pernah benar-benar beku). */
export const diam = (t: number, seed = 0): Pose => ({
  bob: Math.sin(t * 2.2 + seed) * 0.012,
  kepalaRoll: Math.sin(t * 0.9 + seed) * 0.03,
  lenganKiri: Math.sin(t * 1.3 + seed) * 0.04,
  lenganKanan: -Math.sin(t * 1.3 + seed) * 0.04,
});

/** Wajah dengan kedipan otomatis tiap 2-4 detik. */
export const kedip = (t: number, dasar: Wajah = "netral", seed = 0): Wajah => {
  const per = 2.6 + (seed % 3) * 0.6;
  return (t + seed) % per < 0.12 ? "kedip" : dasar;
};
