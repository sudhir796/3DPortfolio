import * as THREE from 'three';

// ----------------------------------------------------
// Color Palette (Anime Fantasy Adventurers' Guild)
// ----------------------------------------------------
export const PALETTE = {
  // Wood tones
  woodDark: '#2c1810',
  woodMedium: '#4a2e1b',
  woodWarm: '#6b4226',
  woodLight: '#8d5b36',
  woodHighlight: '#a77045',
  woodPlankA: '#462b1a',
  woodPlankB: '#583620',
  woodPlankC: '#3c2415',

  // Stone & masonry
  stoneDark: '#2f2d2b',
  stoneNeutral: '#4d4a46',
  stoneLight: '#78736d',
  stoneBeige: '#8a8275',
  stonePaving: '#5c564f',

  // Parchment, Paper & Accents
  parchmentLight: '#f6eedb',
  parchmentMedium: '#ebdcb9',
  parchmentDark: '#d9c49a',
  inkDark: '#1a1815',

  // Anime Guild Accents & Metals
  guildRed: '#a82328',
  guildRedBright: '#c92a31',
  guildGold: '#d4af37',
  ironDark: '#232528',
  brassWarm: '#b08a38',

  // Magical & Atmospheric Lighting
  lanternAmber: '#ffb347',
  lanternCore: '#fff2cc',
  fireBright: '#ff7b1c',
  fireOrange: '#ff9838',
  fireRed: '#d63012',
  magicCyan: '#5ee6ff',
  magicTeal: '#2de2e6',
  magicCyanGlow: '#a6f7ff',
  magicCore: '#ffffff',

  // Environment & Atmosphere
  duskSky: '#ff7e5f',
  duskSkyDeep: '#654062',
  windowLight: '#ffa366',
  fogColor: '#1d171e',
  ambientLight: '#302435',
};

// ----------------------------------------------------
// Dimensions & Spatial Layout Constants
// ----------------------------------------------------
export const HALL_DIMS = {
  width: 24,   // X-axis (-12 to 12)
  depth: 16,   // Z-axis (-8 to 8, entrance near +8, counter near -7)
  height: 7,   // Y-axis (0 to 7)
};

// ----------------------------------------------------
// Lighting Constants (Strict max 8 real-time lights)
// 1 Ambient + 1 Directional Dusk + 1 Fireplace + 5 Lanterns = 8 lights
// ----------------------------------------------------
export const LIGHTING = {
  ambient: {
    color: '#3d2b38',
    intensity: 0.6,
  },
  duskDirectional: {
    color: '#ff9450',
    intensity: 1.4,
    position: [-14, 5.5, 2], // Angled in from side windows
  },
  fireLight: {
    color: '#ff8833',
    intensity: 2.2,
    distance: 9,
    decay: 2,
  },
  lanternLight: {
    color: '#ffae42',
    intensity: 1.5,
    distance: 8.5,
    decay: 2,
  },
};

// ----------------------------------------------------
// Helper: Procedural 4-step Cel-Shading Ramp Texture
// ----------------------------------------------------
export function createToonRampTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  
  // 4 discrete stepped shading bands
  const colors = ['#404040', '#777777', '#b5b5b5', '#ffffff'];
  colors.forEach((col, idx) => {
    ctx.fillStyle = col;
    ctx.fillRect(idx, 0, 1, 1);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  return texture;
}

// Cached singleton ramp texture
export const TOON_RAMP = typeof document !== 'undefined' ? createToonRampTexture() : null;
