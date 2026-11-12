import React, { useMemo } from 'react';
import * as THREE from 'three';
import { PALETTE, TOON_RAMP } from '../theme';
import { createSkyTexture } from '../utils/canvasTextures';

/**
 * Windows component: 3 stylized gothic arched windows along the left wall (X = -12)
 * with warm dusk sky plane and soft atmospheric light shafts.
 */
export default function Windows() {
  const windowZPositions = [-4, 0, 4];
  const windowX = -11.95;
  const windowY = 3.6;

  const skyTexture = useMemo(() => createSkyTexture(), []);

  return (
    <group name="GuildHall_Windows">
      {/* Dusk Sky Plane outside the windows (at X = -14.0) with sunset gradient, clouds & stars */}
      <mesh position={[-14.0, 4.0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[20, 10]} />
        <meshBasicMaterial
          map={skyTexture}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Deep dusk gradient backdrop layer */}
      <mesh position={[-14.5, 4.0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[24, 12]} />
        <meshBasicMaterial
          color={PALETTE.duskSkyDeep}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3 Arched Windows along left wall */}
      {windowZPositions.map((z, idx) => (
        <group key={`guild-window-${idx}`} position={[windowX, windowY, z]} rotation={[0, Math.PI / 2, 0]}>
          {/* Heavy Stone Sill */}
          <mesh position={[0, -1.35, 0]}>
            <boxGeometry args={[1.9, 0.22, 0.45]} />
            <meshToonMaterial color={PALETTE.stoneDark} gradientMap={TOON_RAMP} />
          </mesh>

          {/* Window Timber Frame - Left / Right */}
          <mesh position={[-0.85, 0.1, 0]}>
            <boxGeometry args={[0.15, 2.5, 0.25]} />
            <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
          </mesh>
          <mesh position={[0.85, 0.1, 0]}>
            <boxGeometry args={[0.15, 2.5, 0.25]} />
            <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
          </mesh>

          {/* Arch Keystone & Top header */}
          <mesh position={[0, 1.45, 0]}>
            <boxGeometry args={[1.9, 0.25, 0.3]} />
            <meshToonMaterial color={PALETTE.stoneDark} gradientMap={TOON_RAMP} />
          </mesh>
          {/* Semi-circular decorative arch top */}
          <mesh position={[0, 1.3, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.85, 0.85, 0.2, 16, 1, false, 0, Math.PI]} />
            <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
          </mesh>

          {/* Glass Pane - Glowing warm amber dusk light */}
          <mesh position={[0, 0.1, 0.02]}>
            <planeGeometry args={[1.55, 2.4]} />
            <meshBasicMaterial
              color={PALETTE.windowLight}
              transparent
              opacity={0.88}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Internal muntin grid (lead/iron anime window lattice) */}
          {/* Center vertical mullion */}
          <mesh position={[0, 0.1, 0.05]}>
            <boxGeometry args={[0.06, 2.38, 0.08]} />
            <meshToonMaterial color={PALETTE.ironDark} gradientMap={TOON_RAMP} />
          </mesh>
          {/* Horizontal cross-bars */}
          {[-0.6, 0.0, 0.6].map((barY) => (
            <mesh key={`muntin-${barY}`} position={[0, barY, 0.05]}>
              <boxGeometry args={[1.55, 0.05, 0.08]} />
              <meshToonMaterial color={PALETTE.ironDark} gradientMap={TOON_RAMP} />
            </mesh>
          ))}

          {/* Subtle god-ray / atmospheric light shaft angling into the tavern */}
          <mesh
            position={[0.0, -0.6, 2.2]}
            rotation={[0.35, 0, 0]}
          >
            <planeGeometry args={[1.5, 3.8]} />
            <meshBasicMaterial
              color={PALETTE.lanternAmber}
              transparent
              opacity={0.07}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
