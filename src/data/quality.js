/**
 * Quality Tier Definitions and Configuration
 * High: all effects, film grain, outlines, contact shadows, full particles, dpr [1, 2]
 * Medium: bloom + vignette (no grain), fewer particles, dpr max 1.5, no outlines
 * Low: no postprocessing, minimal particles, dpr 1, no outlines, no contact shadows
 */

export const QUALITY_TIERS = {
  high: {
    id: 'high',
    label: 'High (Cinematic)',
    dpr: [1, 2],
    maxDpr: 2.0,
    enablePostprocessing: true,
    enableBloom: true,
    enableVignette: true,
    enableNoise: true,
    enableOutlines: true,
    enableContactShadows: true,
    particleCountRatio: 1.0,
    shadowMapSize: 1024,
    anisotropy: 4,
  },
  medium: {
    id: 'medium',
    label: 'Medium (Balanced)',
    dpr: [1, 1.5],
    maxDpr: 1.5,
    enablePostprocessing: true,
    enableBloom: true,
    enableVignette: true,
    enableNoise: false, // No film grain on medium
    enableOutlines: false, // No outlines on medium
    enableContactShadows: true,
    particleCountRatio: 0.6,
    shadowMapSize: 512,
    anisotropy: 2,
  },
  low: {
    id: 'low',
    label: 'Low (Performance)',
    dpr: [1, 1],
    maxDpr: 1.0,
    enablePostprocessing: false, // Disable postfx entirely
    enableBloom: false,
    enableVignette: false,
    enableNoise: false,
    enableOutlines: false,
    enableContactShadows: false,
    particleCountRatio: 0.3,
    shadowMapSize: 256,
    anisotropy: 1,
  },
};

