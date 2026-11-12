import React, { useMemo } from 'react';
import { PALETTE, TOON_RAMP } from '../theme';

/**
 * Single Bookshelf unit with 4 shelf tiers and varied books
 */
function BookshelfUnit({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const shelfWidth = 2.4;
  const shelfHeight = 3.6;
  const shelfDepth = 0.55;
  const tierHeights = [0.4, 1.2, 2.0, 2.8];

  // Procedurally generate books for the 4 shelves
  const books = useMemo(() => {
    const list = [];
    const bookColors = [
      PALETTE.guildRed,
      '#2a4d69', // arcane navy blue
      '#4b7754', // herbalist emerald green
      PALETTE.woodDark,
      PALETTE.guildGold,
      PALETTE.parchmentDark,
      '#633d59', // sorcerer purple
    ];

    tierHeights.forEach((tierY, tierIdx) => {
      let currentX = -shelfWidth / 2 + 0.15;
      const maxX = shelfWidth / 2 - 0.15;
      let bookIdx = 0;

      while (currentX < maxX - 0.1) {
        const thickness = 0.05 + ((bookIdx * 3) % 4) * 0.02; // 0.05 to 0.11m
        const height = 0.45 + ((bookIdx * 5) % 6) * 0.04;    // 0.45 to 0.65m
        const depth = 0.32 + ((bookIdx * 7) % 3) * 0.03;
        const color = bookColors[(tierIdx * 7 + bookIdx) % bookColors.length];
        
        // Occasional tilted book
        const isTilted = bookIdx % 7 === 5 && currentX < maxX - 0.25;
        const tiltAngle = isTilted ? 0.22 : 0;

        list.push({
          id: `book-${tierIdx}-${bookIdx}`,
          x: currentX + thickness / 2,
          y: tierY + height / 2 + 0.02,
          z: 0.02,
          args: [thickness, height, depth],
          color,
          rotZ: tiltAngle,
        });

        currentX += thickness + (isTilted ? 0.12 : 0.02);
        bookIdx++;
      }
    });

    return list;
  }, []);

  return (
    <group position={position} rotation={rotation}>
      {/* ---------------- SHELF FRAMEWORK ---------------- */}
      {/* Backboard */}
      <mesh position={[0, shelfHeight / 2, -shelfDepth / 2 + 0.02]} receiveShadow>
        <boxGeometry args={[shelfWidth, shelfHeight, 0.04]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>

      {/* Left upright panel */}
      <mesh position={[-shelfWidth / 2 + 0.04, shelfHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.08, shelfHeight, shelfDepth]} />
        <meshToonMaterial color={PALETTE.woodMedium} gradientMap={TOON_RAMP} />
      </mesh>

      {/* Right upright panel */}
      <mesh position={[shelfWidth / 2 - 0.04, shelfHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.08, shelfHeight, shelfDepth]} />
        <meshToonMaterial color={PALETTE.woodMedium} gradientMap={TOON_RAMP} />
      </mesh>

      {/* Top cornice header */}
      <mesh position={[0, shelfHeight - 0.05, 0.02]} castShadow>
        <boxGeometry args={[shelfWidth + 0.12, 0.14, shelfDepth + 0.06]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>

      {/* Bottom plinth base */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[shelfWidth + 0.06, 0.16, shelfDepth + 0.04]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>

      {/* Horizontal Shelves */}
      {tierHeights.map((tierY, idx) => (
        <mesh key={`shelf-plank-${idx}`} position={[0, tierY, 0]} receiveShadow>
          <boxGeometry args={[shelfWidth - 0.08, 0.04, shelfDepth - 0.02]} />
          <meshToonMaterial color={PALETTE.woodMedium} gradientMap={TOON_RAMP} />
        </mesh>
      ))}

      {/* ---------------- BOOKS ---------------- */}
      {books.map((b) => (
        <mesh
          key={b.id}
          position={[b.x, b.y, b.z]}
          rotation={[0, 0, b.rotZ]}
          castShadow
        >
          <boxGeometry args={b.args} />
          <meshToonMaterial color={b.color} gradientMap={TOON_RAMP} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Bookshelves component: Stately guild archive shelves along walls.
 */
export default function Bookshelves() {
  return (
    <group name="GuildHall_Bookshelves">
      {/* Back Wall left of reception desk */}
      <BookshelfUnit position={[-6.8, 0, -7.5]} rotation={[0, 0, 0]} />
      {/* Back Wall right of reception desk */}
      <BookshelfUnit position={[6.8, 0, -7.5]} rotation={[0, 0, 0]} />
      {/* Right Wall archive section */}
      <BookshelfUnit position={[11.5, 0, -1.2]} rotation={[0, -Math.PI / 2, 0]} />
    </group>
  );
}
