/**
 * Centralized Post-Processing Configuration
 * Fine-tune Bloom, Vignette, and Film Grain in one place.
 */

export const POSTFX_CONFIG = {
  bloom: {
    enabled: true,
    intensity: 0.85,
    luminanceThreshold: 0.38,
    luminanceSmoothing: 0.35,
    mipmapBlur: true,
  },
  vignette: {
    enabled: true,
    offset: 0.28,
    darkness: 0.65,
  },
  noise: {
    enabled: true,
    opacity: 0.028, // Very subtle anime film grain
  },
};

