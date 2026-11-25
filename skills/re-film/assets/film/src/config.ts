// Pengaturan satu film. Ubah nilai di sini dulu, baru adegan.
import type { Tema } from "../../kit/util";

export const FORMAT: "vertikal" | "horizontal" = "vertikal";
export const W = FORMAT === "vertikal" ? 1080 : 1920;
export const H = FORMAT === "vertikal" ? 1920 : 1080;
export const FPS = 30;

export const BAHASA_NARASI: "id" | "en" = "id";
// null = tanpa subtitle. Sama dengan narasi → subtitle per kata (words.json).
// Beda dengan narasi → subtitle terjemahan per kalimat (subtitle.json).
export const BAHASA_SUBTITLE: "id" | "en" | null = "id";

// Panjang narasi.wav dalam detik (ffprobe), bukan perkiraan.
export const NARASI_SEC = 12;
// 20 untuk video non-Shorts ≥ 3 menit (ruang end screen YouTube); 0 untuk Shorts.
export const ENDSCREEN_SEC = 0;
// Jeda kecil setelah kata terakhir sebelum end screen / akhir video.
export const TAIL_SEC = 0.8;
export const TOTAL_SEC = NARASI_SEC + TAIL_SEC + ENDSCREEN_SEC;

// Palet & font tema film ini. Ganti per film (lihat references/gaya.md), jangan pakai palet yang sama terus.
export const TEMA: Tema = {
  langitAtas: "#2b6fd6",
  langitBawah: "#bfe3ff",
  tanah: "#7fcf6a",
  aksen: "#ffcc33",
  teks: "#ffffff",
  teksGaris: "#1a1a2e",
  // Font tema: muat dengan @remotion/google-fonts di Film.tsx, lalu tulis namanya di depan.
  font: "'Segoe UI Black', 'Arial Black', Arial, sans-serif",
};
