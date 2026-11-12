import React, { useMemo } from 'react';
import * as THREE from 'three';
import { PALETTE, HALL_DIMS, TOON_RAMP } from '../theme';

/**
 * Floor component: Tavern-style wooden plank floor with alternating tones
 * and perimeter stone skirting.
 */
export default function Floor() {
  const plankCountX = 32;
  const plankWidth = HALL_DIMS.width / plankCountX; // ~0.75m each
  const plankLength = HALL_DIMS.depth;

  const planks = useMemo(() => {
    const list = [];
    const colors = [
      PALETTE.woodPlankA,
      PALETTE.woodPlankB,
      PALETTE.woodPlankC,
      PALETTE.woodWarm,
      PALETTE.woodDark,
    ];

    for (let i = 0; i < plankCountX; i++) {
      const x = -HALL_DIMS.width / 2 + plankWidth * (i + 0.5);
      // Slight pseudo-random seed based on index
      const color = colors[(i * 3 + 1) % colors.length];
      const slightYOffset = ((i % 5) * 0.003) - 0.006;
      list.push({
        id: `plank-${i}`,
        x,
        y: slightYOffset,
        color,
        width: plankWidth * 0.98, // small gap between planks
      });
    }
    return list;
  }, [plankWidth]);

  return (
    <group name="GuildHall_Floor">
      {/* Subfloor / foundation slab */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[HALL_DIMS.width + 0.6, 0.2, HALL_DIMS.depth + 0.6]} />
        <meshToonMaterial
          color={PALETTE.stoneDark}
          gradientMap={TOON_RAMP}
        />
      </mesh>

      {/* Individual wooden floor planks */}
      {planks.map((plank) => (
        <mesh
          key={plank.id}
          position={[plank.x, plank.y, 0]}
          receiveShadow
        >
          <boxGeometry args={[plank.width, 0.08, plankLength]} />
          <meshToonMaterial
            color={plank.color}
            gradientMap={TOON_RAMP}
          />
        </mesh>
      ))}

      {/* Perimeter stone/wood skirting baseboards */}
      {/* North skirting (back wall) */}
      <mesh position={[0, 0.12, -HALL_DIMS.depth / 2 + 0.08]}>
        <boxGeometry args={[HALL_DIMS.width, 0.24, 0.16]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>
      {/* South skirting (front wall) */}
      <mesh position={[0, 0.12, HALL_DIMS.depth / 2 - 0.08]}>
        <boxGeometry args={[HALL_DIMS.width, 0.24, 0.16]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>
      {/* West skirting (left wall) */}
      <mesh position={[-HALL_DIMS.width / 2 + 0.08, 0.12, 0]}>
        <boxGeometry args={[0.16, 0.24, HALL_DIMS.depth]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>
      {/* East skirting (right wall) */}
      <mesh position={[HALL_DIMS.width / 2 - 0.08, 0.12, 0]}>
        <boxGeometry args={[0.16, 0.24, HALL_DIMS.depth]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>
    </group>
  );
}
