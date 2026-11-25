import React, { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";
import type { V3 } from "./util";

// Memuat model .glb/.gltf dari folder public/ (mis. aset Kenney, Quaternius, Poly Pizza).
// Remotion menunggu (delayRender) sampai model termuat, jadi frame pertama tidak pernah kosong.
const cache = new Map<string, Promise<THREE.Group>>();
const load = (file: string) => {
  if (!cache.has(file)) cache.set(file, new GLTFLoader().loadAsync(staticFile(file)).then((g) => g.scene));
  return cache.get(file)!;
};

export const useGlb = (file: string) => {
  const [scene, setScene] = useState<THREE.Group | null>(null);
  const [handle] = useState(() => delayRender(`glb ${file}`));
  useEffect(() => {
    load(file).then((s) => { setScene(s); continueRender(handle); }).catch((e) => cancelRender(e));
  }, [file, handle]);
  return scene;
};

export type GlbProps = {
  file: string;
  position?: V3;
  rotation?: V3;
  skala?: number | V3;
  /** ganti warna per nama material, mis. { grass: "#7fcf6a" } (Kenney memakai nama material yang jelas) */
  warna?: Record<string, string>;
  bayangan?: boolean;
};

export const Glb: React.FC<GlbProps> = ({ file, position = [0, 0, 0], rotation = [0, 0, 0], skala = 1, warna, bayangan = true }) => {
  const scene = useGlb(file);
  const obj = useMemo(() => {
    if (!scene) return null;
    const c = scene.clone(true);
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.castShadow = bayangan; m.receiveShadow = true;
      if (warna) {
        const mats = Array.isArray(m.material) ? m.material : [m.material];
        m.material = mats.map((mt) => {
          const hit = Object.keys(warna).find((k) => mt.name.toLowerCase().includes(k.toLowerCase()));
          if (!hit) return mt;
          const n = (mt as THREE.MeshStandardMaterial).clone(); n.color = new THREE.Color(warna[hit]); return n;
        }) as any;
        if (mats.length === 1) m.material = (m.material as any)[0];
      }
    });
    return c;
  }, [scene, warna, bayangan]);
  if (!obj) return null;
  return <primitive object={obj} position={position} rotation={rotation} scale={skala} />;
};
