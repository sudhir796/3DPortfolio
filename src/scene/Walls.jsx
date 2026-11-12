import React, { useMemo } from 'react';
import { PALETTE, HALL_DIMS, TOON_RAMP } from '../theme';

/**
 * Walls component: Sturdy medieval anime guild hall stone walls
 * with decorative dark timber posts, cross-framing, and archways.
 */
export default function Walls() {
  const halfW = HALL_DIMS.width / 2;   // 12
  const halfD = HALL_DIMS.depth / 2;   // 8
  const h = HALL_DIMS.height;          // 7
  const midY = h / 2;                  // 3.5

  // Timber post positions along the perimeter
  const timberPosts = useMemo(() => {
    const posts = [];
    // 4 Corner Posts
    posts.push([-halfW, midY, -halfD]);
    posts.push([halfW, midY, -halfD]);
    posts.push([-halfW, midY, halfD]);
    posts.push([halfW, midY, halfD]);

    // Along back wall (Z = -halfD)
    posts.push([-6, midY, -halfD]);
    posts.push([0, midY, -halfD]);
    posts.push([6, midY, -halfD]);

    // Along front wall (Z = halfD) - framing the entrance
    posts.push([-6, midY, halfD]);
    posts.push([6, midY, halfD]);

    // Along left wall (X = -halfW) - between windows
    posts.push([-halfW, midY, -6]);
    posts.push([-halfW, midY, -2]);
    posts.push([-halfW, midY, 2]);
    posts.push([-halfW, midY, 6]);

    // Along right wall (X = halfW)
    posts.push([halfW, midY, -4]);
    posts.push([halfW, midY, 0]);
    posts.push([halfW, midY, 4]);

    return posts;
  }, [halfW, halfD, midY]);

  return (
    <group name="GuildHall_Walls">
      {/* ---------------- BACK WALL (Z = -8) ---------------- */}
      {/* Lower stone masonry */}
      <mesh position={[0, 2, -halfD]} receiveShadow>
        <boxGeometry args={[HALL_DIMS.width, 4, 0.4]} />
        <meshToonMaterial color={PALETTE.stoneNeutral} gradientMap={TOON_RAMP} />
      </mesh>
      {/* Upper plaster / lighter stone */}
      <mesh position={[0, 5.5, -halfD]} receiveShadow>
        <boxGeometry args={[HALL_DIMS.width, 3, 0.38]} />
        <meshToonMaterial color={PALETTE.stoneBeige} gradientMap={TOON_RAMP} />
      </mesh>
      {/* Horizontal mid-rail timber beam */}
      <mesh position={[0, 4, -halfD + 0.15]}>
        <boxGeometry args={[HALL_DIMS.width, 0.35, 0.35]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>
      {/* Top cornice timber beam */}
      <mesh position={[0, h - 0.15, -halfD + 0.15]}>
        <boxGeometry args={[HALL_DIMS.width, 0.3, 0.35]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>

      {/* ---------------- FRONT WALL (Z = +8) ---------------- */}
      {/* Flanking left section */}
      <mesh position={[-6.75, midY, halfD]} receiveShadow>
        <boxGeometry args={[halfW - 1.5, h, 0.4]} />
        <meshToonMaterial color={PALETTE.stoneNeutral} gradientMap={TOON_RAMP} />
      </mesh>
      {/* Flanking right section */}
      <mesh position={[6.75, midY, halfD]} receiveShadow>
        <boxGeometry args={[halfW - 1.5, h, 0.4]} />
        <meshToonMaterial color={PALETTE.stoneNeutral} gradientMap={TOON_RAMP} />
      </mesh>
      {/* Top wall section above double door entrance */}
      <mesh position={[0, 5.75, halfD]} receiveShadow>
        <boxGeometry args={[4.5, 2.5, 0.4]} />
        <meshToonMaterial color={PALETTE.stoneNeutral} gradientMap={TOON_RAMP} />
      </mesh>
      {/* Top cornice timber beam front */}
      <mesh position={[0, h - 0.15, halfD - 0.15]}>
        <boxGeometry args={[HALL_DIMS.width, 0.3, 0.35]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>

      {/* ---------------- LEFT WALL (X = -12, with window openings) ---------------- */}
      {/* Bottom wall under windows */}
      <mesh position={[-halfW, 1.2, 0]} receiveShadow>
        <boxGeometry args={[0.4, 2.4, HALL_DIMS.depth]} />
        <meshToonMaterial color={PALETTE.stoneNeutral} gradientMap={TOON_RAMP} />
      </mesh>
      {/* Top wall above windows */}
      <mesh position={[-halfW, 6.0, 0]} receiveShadow>
        <boxGeometry args={[0.4, 2.0, HALL_DIMS.depth]} />
        <meshToonMaterial color={PALETTE.stoneBeige} gradientMap={TOON_RAMP} />
      </mesh>
      {/* Solid wall piers between windows */}
      <mesh position={[-halfW, 3.7, -6]} receiveShadow>
        <boxGeometry args={[0.4, 2.6, 2.0]} />
        <meshToonMaterial color={PALETTE.stoneNeutral} gradientMap={TOON_RAMP} />
      </mesh>
      <mesh position={[-halfW, 3.7, -2]} receiveShadow>
        <boxGeometry args={[0.4, 2.6, 2.0]} />
        <meshToonMaterial color={PALETTE.stoneNeutral} gradientMap={TOON_RAMP} />
      </mesh>
      <mesh position={[-halfW, 3.7, 2]} receiveShadow>
        <boxGeometry args={[0.4, 2.6, 2.0]} />
        <meshToonMaterial color={PALETTE.stoneNeutral} gradientMap={TOON_RAMP} />
      </mesh>
      <mesh position={[-halfW, 3.7, 6]} receiveShadow>
        <boxGeometry args={[0.4, 2.6, 2.0]} />
        <meshToonMaterial color={PALETTE.stoneNeutral} gradientMap={TOON_RAMP} />
      </mesh>
      {/* Top cornice beam left */}
      <mesh position={[-halfW + 0.15, h - 0.15, 0]}>
        <boxGeometry args={[0.35, 0.3, HALL_DIMS.depth]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>

      {/* ---------------- RIGHT WALL (X = +12) ---------------- */}
      {/* Lower stone masonry */}
      <mesh position={[halfW, 2.2, 0]} receiveShadow>
        <boxGeometry args={[0.4, 4.4, HALL_DIMS.depth]} />
        <meshToonMaterial color={PALETTE.stoneNeutral} gradientMap={TOON_RAMP} />
      </mesh>
      {/* Upper wall */}
      <mesh position={[halfW, 5.7, 0]} receiveShadow>
        <boxGeometry args={[0.38, 2.6, HALL_DIMS.depth]} />
        <meshToonMaterial color={PALETTE.stoneBeige} gradientMap={TOON_RAMP} />
      </mesh>
      {/* Horizontal mid-rail beam right */}
      <mesh position={[halfW - 0.15, 4.4, 0]}>
        <boxGeometry args={[0.35, 0.35, HALL_DIMS.depth]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>
      {/* Top cornice beam right */}
      <mesh position={[halfW - 0.15, h - 0.15, 0]}>
        <boxGeometry args={[0.35, 0.3, HALL_DIMS.depth]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>

      {/* ---------------- VERTICAL TIMBER POSTS ---------------- */}
      {timberPosts.map(([px, py, pz], idx) => (
        <mesh key={`timber-post-${idx}`} position={[px, py, pz]} castShadow receiveShadow>
          <boxGeometry args={[0.42, h, 0.42]} />
          <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
        </mesh>
      ))}
    </group>
  );
}
