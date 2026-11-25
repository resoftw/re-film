// Fungsi kecil untuk animasi berbasis waktu (detik). Semua gerak harus dihitung dari waktu, bukan state.
/** Palet & font satu film (didefinisikan di <film>/src/config.ts, dikirim ke Captions/Endscreen). */
export type Tema = { langitAtas: string; langitBawah: string; tanah: string; aksen: string; teks: string; teksGaris: string; font: string };

export const clamp =(x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
/** 0→1 linear antara detik a dan b */
export const lin = (a: number, b: number, t: number) => clamp((t - a) / (b - a));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeOut = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
export const easeInOut = (x: number) => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
/** 0→1 halus (smootherstep) antara detik a dan b */
export const smooth = (a: number, b: number, t: number) => { const x = lin(a, b, t); return x * x * x * (x * (x * 6 - 15) + 10); };
/** pantulan kecil saat muncul (pop): 0 → lewat 1 → 1 */
export const pop = (a: number, t: number, dur = 0.35) => { const x = lin(a, a + dur, t); if (x <= 0) return 0; const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
export const hash = (i: number, s = 0) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };
export type V3 = [number, number, number];
export const mix3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

/** Kunci kamera: pada detik t kamera berada di pos, melihat look. Antar-kunci dihaluskan. */
export type CamKey = { t: number; pos: V3; look: V3; fov?: number };
export function camAt(keys: CamKey[], t: number) {
  if (t <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t <= b.t) {
      const k = smooth(a.t, b.t, t);
      return { t, pos: mix3(a.pos, b.pos, k), look: mix3(a.look, b.look, k), fov: lerp(a.fov ?? 40, b.fov ?? 40, k) };
    }
  }
  return keys[keys.length - 1];
}
