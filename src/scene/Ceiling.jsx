import React, { useMemo } from 'react';
import { PALETTE, HALL_DIMS, TOON_RAMP } from '../theme';

/**
 * Ceiling component: Exposed timber rafters, longitudinal ridge beams,
 * cross-ties, and dark wood ceiling planking.
 */
export default function Ceiling() {
  const h = HALL_DIMS.height; // 7

  // Cross-beams running across the width of the hall (X direction)
  const crossBeamZs = [-6, -3, 0, 3, 6];

  // Longitudinal purlin beams running along the depth (Z direction)
  const purlinXs = [-7, -3.5, 0, 3.5, 7];

  return (
    <group name="GuildHall_Ceiling">
      {/* Upper ceiling wooden deck */}
      <mesh position={[0, h, 0]}>
        <boxGeometry args={[HALL_DIMS.width, 0.15, HALL_DIMS.depth]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>

      {/* Main heavy cross-beams (spanning X: -12 to 12) */}
      {crossBeamZs.map((z) => (
        <group key={`cross-beam-${z}`} position={[0, h - 0.25, z]}>
          {/* Main horizontal beam */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[HALL_DIMS.width, 0.45, 0.4]} />
            <meshToonMaterial color={PALETTE.woodWarm} gradientMap={TOON_RAMP} />
          </mesh>

          {/* Left wall diagonal knee-brace */}
          <mesh position={[-HALL_DIMS.width / 2 + 1.0, -0.6, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[1.5, 0.25, 0.25]} />
            <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
          </mesh>

          {/* Right wall diagonal knee-brace */}
          <mesh position={[HALL_DIMS.width / 2 - 1.0, -0.6, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[1.5, 0.25, 0.25]} />
            <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
          </mesh>
        </group>
      ))}

      {/* Longitudinal purlins and center ridge beam (spanning Z: -8 to 8) */}
      {purlinXs.map((x) => (
        <mesh key={`purlin-${x}`} position={[x, h - 0.45, 0]}>
          <boxGeometry args={[0.3, 0.35, HALL_DIMS.depth]} />
          <meshToonMaterial color={x === 0 ? PALETTE.woodMedium : PALETTE.woodDark} gradientMap={TOON_RAMP} />
        </mesh>
      ))}

      {/* Decorative hanging brackets for central guild chandeliers/lanterns */}
      {[-4, 0, 4].map((z) => (
        <mesh key={`bracket-${z}`} position={[0, h - 0.65, z]}>
          <cylinderGeometry args={[0.15, 0.15, 0.4, 8]} />
          <meshToonMaterial color={PALETTE.ironDark} gradientMap={TOON_RAMP} />
        </mesh>
      ))}
    </group>
  );
}
