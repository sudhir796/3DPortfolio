import * as THREE from 'three';

// Cache generated textures so they are created only once
const textureCache = new Map();

/**
 * Creates a crisp procedural 2D canvas texture with text and optional borders/decorations.
 * Completely synchronous, 0 network requests, never suspends.
 */
export function createTextTexture({
  text,
  subtext = '',
  width = 256,
  height = 128,
  font = 'bold 56px "Cinzel", "Georgia", serif',
  subfont = '22px "Inter", sans-serif',
  color = '#ffffff',
  subcolor = '#ffb347',
  backgroundColor = 'transparent',
  borderColor = null,
  borderWidth = 0,
  borderRadius = 0,
}) {
  const cacheKey = `${text}_${subtext}_${width}_${height}_${color}_${backgroundColor}_${borderColor}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (backgroundColor && backgroundColor !== 'transparent') {
    ctx.fillStyle = backgroundColor;
    if (borderRadius > 0) {
      roundRect(ctx, 0, 0, width, height, borderRadius);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, width, height);
    }
  }

  if (borderColor && borderWidth > 0) {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    if (borderRadius > 0) {
      roundRect(ctx, borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth, borderRadius);
      ctx.stroke();
    } else {
      ctx.strokeRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth);
    }
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const centerY = subtext ? height * 0.42 : height * 0.5;

  ctx.font = font;
  ctx.fillStyle = color;
  ctx.fillText(text, width / 2, centerY);

  if (subtext) {
    ctx.font = subfont;
    ctx.fillStyle = subcolor;
    ctx.fillText(subtext, width / 2, height * 0.76);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  textureCache.set(cacheKey, texture);
  return texture;
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Creates a procedural anime fantasy twilight sky texture with dusk gradients,
 * soft atmospheric cloud bands, and twinkling evening stars.
 */
export function createSkyTexture() {
  const cacheKey = 'guild_twilight_sky_texture_v1';
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // 1. Vertical dusk twilight gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0.0, '#100a1c'); // Night indigo zenith
  grad.addColorStop(0.4, '#241438'); // Deep dusk purple
  grad.addColorStop(0.7, '#6b2b4e'); // Twilight magenta
  grad.addColorStop(0.88, '#db6b42'); // Sunset vermilion
  grad.addColorStop(1.0, '#ffb86c'); // Warm golden horizon
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // 2. Soft horizontal cloud streaks
  ctx.save();
  const clouds = [
    { y: 310, h: 42, color: 'rgba(219, 107, 66, 0.35)', x: 120, w: 480 },
    { y: 360, h: 32, color: 'rgba(255, 184, 108, 0.45)', x: 400, w: 550 },
    { y: 260, h: 28, color: 'rgba(107, 43, 78, 0.25)', x: 50, w: 380 },
  ];
  for (const c of clouds) {
    const cGrad = ctx.createLinearGradient(c.x, c.y, c.x + c.w, c.y);
    cGrad.addColorStop(0, 'transparent');
    cGrad.addColorStop(0.5, c.color);
    cGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = cGrad;
    ctx.beginPath();
    ctx.ellipse(c.x + c.w / 2, c.y, c.w / 2, c.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 3. Procedural evening stars in upper night sky
  ctx.save();
  const starPositions = [
    [120, 45], [260, 75], [410, 32], [580, 85], [720, 50], [860, 38], [940, 90],
    [180, 110], [330, 140], [640, 120], [790, 130], [510, 60]
  ];
  for (const [sx, sy] of starPositions) {
    ctx.fillStyle = 'rgba(255, 245, 220, 0.85)';
    ctx.beginPath();
    ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 235, 180, 0.35)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(sx - 4, sy);
    ctx.lineTo(sx + 4, sy);
    ctx.moveTo(sx, sy - 4);
    ctx.lineTo(sx, sy + 4);
    ctx.stroke();
  }
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;

  textureCache.set(cacheKey, texture);
  return texture;
}

