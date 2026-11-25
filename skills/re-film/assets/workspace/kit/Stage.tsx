import React, { useLayoutEffect, useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { AbsoluteFill, useVideoConfig } from "remotion";
import type { V3 } from "./util";

// Preset cahaya. Pilih sesuai suasana adegan; boleh tambah preset baru per film.
export const CAHAYA = {
  siang:  { amb: ["#dfefff", "#6a5a40", 0.55], sun: ["#fff4e0", 2.0], sunDir: [6, 10, 5],  env: 0.7 },
  senja:  { amb: ["#ffb98a", "#3a2a55", 0.7], sun: ["#ffa050", 2.4], sunDir: [-8, 3, 4],  env: 0.7 },
  malam:  { amb: ["#5070c0", "#101020", 0.45], sun: ["#9fb8ff", 1.0], sunDir: [4, 8, -3], env: 0.35 },
  studio: { amb: ["#ffffff", "#808080", 0.8], sun: ["#ffffff", 2.0], sunDir: [3, 6, 6],   env: 1.2 },
} as const;
export type Cahaya = keyof typeof CAHAYA;

/** Pantulan lingkungan: inilah yang membuat plastik BoxBot berkilat. Tanpa ini plastik terlihat kusam. */
const Env: React.FC<{ intensity: number }> = ({ intensity }) => {
  const { gl, scene } = useThree();
  const tex = useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const t = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    pm.dispose();
    return t;
  }, [gl]);
  useLayoutEffect(() => {
    scene.environment = tex;
    (scene as any).environmentIntensity = intensity;
  }, [scene, tex, intensity]);
  return null;
};

const CamRig: React.FC<{ pos: V3; look: V3; fov: number; roll: number }> = ({ pos, look, fov, roll }) => {
  const { camera } = useThree();
  const cam = camera as THREE.PerspectiveCamera;
  cam.position.set(...pos);
  cam.up.set(Math.sin(roll), Math.cos(roll), 0);
  cam.lookAt(...look);
  if (cam.fov !== fov) { cam.fov = fov; cam.updateProjectionMatrix(); }
  return null;
};

export type StageProps = {
  /** posisi kamera, titik yang dilihat, fov (derajat), roll (radian) — hitung per frame dari waktu adegan */
  cam: { pos: V3; look: V3; fov?: number; roll?: number };
  cahaya?: Cahaya;
  /** latar CSS di belakang kanvas (gradien langit dll.) */
  latar?: string;
  /** kabut: warna = warna cakrawala latar supaya menyatu */
  kabut?: { warna: string; dekat: number; jauh: number };
  children: React.ReactNode;
};

export const Stage: React.FC<StageProps> = ({ cam, cahaya = "siang", latar = "linear-gradient(#2b6fd6, #bfe3ff)", kabut, children }) => {
  const c = CAHAYA[cahaya];
  const { width: W, height: H } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: latar }}>
      <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true }} camera={{ fov: cam.fov ?? 40, near: 0.1, far: 400 }}
        onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 0.9; }}>
        <CamRig pos={cam.pos} look={cam.look} fov={cam.fov ?? 40} roll={cam.roll ?? 0} />
        <Env intensity={c.env} />
        {kabut && <fog attach="fog" args={[kabut.warna, kabut.dekat, kabut.jauh]} />}
        <hemisphereLight args={[c.amb[0], c.amb[1], c.amb[2]]} />
        <directionalLight position={c.sunDir as unknown as V3} color={c.sun[0]} intensity={c.sun[1]} castShadow
          shadow-mapSize={[2048, 2048]} shadow-camera-left={-15} shadow-camera-right={15} shadow-camera-top={15}
          shadow-camera-bottom={-15} shadow-bias={-0.0004} />
        {children}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

/** Lantai sederhana yang menerima bayangan. Ganti dengan set/aset tema bila perlu. */
export const Lantai: React.FC<{ warna: string; ukuran?: number }> = ({ warna, ukuran = 200 }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
    <planeGeometry args={[ukuran, ukuran]} />
    <meshStandardMaterial color={warna} roughness={0.9} />
  </mesh>
);
