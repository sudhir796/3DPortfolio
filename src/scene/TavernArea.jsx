import React from 'react';
import { PALETTE, TOON_RAMP } from '../theme';

/**
 * Single Table with 3-4 Stools and Drink Mugs
 */
function TavernTable({ position = [0, 0, 0], mugCount = 2, stoolCount = 4 }) {
  const tableHeight = 0.9;
  const tableRadius = 0.95;

  // Stool angle offsets around table
  const stools = [];
  for (let i = 0; i < stoolCount; i++) {
    const angle = (i / stoolCount) * Math.PI * 2 + 0.3;
    const dist = 1.35;
    stools.push({
      x: Math.cos(angle) * dist,
      z: Math.sin(angle) * dist,
    });
  }

  // Mugs on table
  const mugs = [];
  for (let m = 0; m < mugCount; m++) {
    const angle = (m / mugCount) * Math.PI * 2 + 0.5;
    const dist = 0.45;
    mugs.push({
      x: Math.cos(angle) * dist,
      z: Math.sin(angle) * dist,
      rotY: angle,
    });
  }

  return (
    <group position={position}>
      {/* Soft Contact Shadow under Table & Stools */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.65, 20]} />
        <meshBasicMaterial color="#08040a" transparent opacity={0.42} depthWrite={false} />
      </mesh>

      {/* ---------------- TABLE ---------------- */}
      {/* Table Top (Heavy wood disc) */}
      <mesh position={[0, tableHeight, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[tableRadius, tableRadius, 0.1, 16]} />
        <meshToonMaterial color={PALETTE.woodWarm} gradientMap={TOON_RAMP} />
      </mesh>
      {/* Table Top Rim Trim */}
      <mesh position={[0, tableHeight - 0.04, 0]}>
        <cylinderGeometry args={[tableRadius * 0.94, tableRadius * 0.94, 0.05, 16]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>
      {/* Central Pillar Leg */}
      <mesh position={[0, tableHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.16, 0.22, tableHeight, 10]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>
      {/* Table Cross Base Footing */}
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[1.3, 0.1, 0.25]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>
      <mesh position={[0, 0.06, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[1.3, 0.1, 0.25]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>

      {/* ---------------- STOOLS ---------------- */}
      {stools.map((s, idx) => (
        <group key={`stool-${idx}`} position={[s.x, 0, s.z]}>
          {/* Stool Seat */}
          <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.08, 12]} />
            <meshToonMaterial color={PALETTE.woodMedium} gradientMap={TOON_RAMP} />
          </mesh>
          {/* 3 Stool Legs */}
          {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((legAngle, lIdx) => (
            <mesh
              key={`leg-${lIdx}`}
              position={[Math.cos(legAngle) * 0.16, 0.25, Math.sin(legAngle) * 0.16]}
              rotation={[Math.sin(legAngle) * 0.1, 0, -Math.cos(legAngle) * 0.1]}
              castShadow
            >
              <cylinderGeometry args={[0.035, 0.04, 0.5, 6]} />
              <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ---------------- ALE MUGS ON TABLE ---------------- */}
      {mugs.map((m, idx) => (
        <group
          key={`mug-${idx}`}
          position={[m.x, tableHeight + 0.05, m.z]}
          rotation={[0, m.rotY, 0]}
        >
          {/* Mug Wooden Tankard Body */}
          <mesh position={[0, 0.1, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.085, 0.2, 10]} />
            <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
          </mesh>
          {/* Iron Hoops around tankard */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.086, 0.086, 0.02, 10]} />
            <meshToonMaterial color={PALETTE.ironDark} gradientMap={TOON_RAMP} />
          </mesh>
          <mesh position={[0, 0.16, 0]}>
            <cylinderGeometry args={[0.078, 0.078, 0.02, 10]} />
            <meshToonMaterial color={PALETTE.ironDark} gradientMap={TOON_RAMP} />
          </mesh>
          {/* Tankard Handle */}
          <mesh position={[0.09, 0.1, 0]}>
            <torusGeometry args={[0.05, 0.016, 6, 12, Math.PI * 1.2]} />
            <meshToonMaterial color={PALETTE.ironDark} gradientMap={TOON_RAMP} />
          </mesh>
          {/* Foamy Drink Rim */}
          <mesh position={[0, 0.201, 0]}>
            <circleGeometry args={[0.07, 8]} />
            <meshBasicMaterial color={PALETTE.parchmentLight} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Wooden Barrel with iron rings
 */
function Barrel({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Soft Contact Shadow */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 14]} />
        <meshBasicMaterial color="#08040a" transparent opacity={0.48} depthWrite={false} />
      </mesh>

      {/* Barrel Belly (Cylinder with slight bulging via layered segments) */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.42, 1.2, 12]} />
        <meshToonMaterial color={PALETTE.woodMedium} gradientMap={TOON_RAMP} />
      </mesh>
      {/* Barrel Middle Bulge band */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.48, 0.48, 0.45, 12]} />
        <meshToonMaterial color={PALETTE.woodWarm} gradientMap={TOON_RAMP} />
      </mesh>
      {/* Iron Hoop Top */}
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.44, 0.44, 0.06, 12]} />
        <meshToonMaterial color={PALETTE.ironDark} gradientMap={TOON_RAMP} />
      </mesh>
      {/* Iron Hoop Bottom */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.44, 0.44, 0.06, 12]} />
        <meshToonMaterial color={PALETTE.ironDark} gradientMap={TOON_RAMP} />
      </mesh>
    </group>
  );
}

/**
 * Wooden Supply Crate
 */
function Crate({ position = [0, 0, 0], rotation = [0, 0, 0], size = [0.8, 0.8, 0.8] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Main crate body */}
      <mesh position={[0, size[1] / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshToonMaterial color={PALETTE.woodWarm} gradientMap={TOON_RAMP} />
      </mesh>
      {/* Outer corner timber braces */}
      <mesh position={[0, size[1] / 2, 0]}>
        <boxGeometry args={[size[0] * 1.02, size[1] * 0.98, size[2] * 0.15]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>
      <mesh position={[0, size[1] / 2, 0]}>
        <boxGeometry args={[size[0] * 0.15, size[1] * 0.98, size[2] * 1.02]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>
    </group>
  );
}

/**
 * TavernArea component: 3 tavern dining tables with stools, ale mugs,
 * and stacked wooden storage barrels and cargo crates in corners.
 */
export default function TavernArea() {
  return (
    <group name="GuildHall_TavernArea">
      {/* 3 Round Tables positioned strategically on the right side */}
      <TavernTable position={[6.5, 0, 3.8]} mugCount={3} stoolCount={4} />
      <TavernTable position={[9.2, 0, 2.0]} mugCount={2} stoolCount={3} />
      <TavernTable position={[8.8, 0, 5.5]} mugCount={2} stoolCount={4} />

      {/* Corner Stack of Barrels & Crates (Rear-right corner near entrance/walls) */}
      <group position={[10.5, 0, 6.5]}>
        {/* Standing barrels */}
        <Barrel position={[0, 0, 0]} scale={0.9} />
        <Barrel position={[0.75, 0, -0.2]} scale={0.85} />
        <Barrel position={[-0.3, 0, -0.7]} scale={0.8} />

        {/* Stacked lying barrel on top */}
        <Barrel
          position={[0.35, 1.25, -0.1]}
          rotation={[Math.PI / 2, 0, 0.4]}
          scale={0.78}
        />

        {/* Stacked wooden cargo crates */}
        <Crate position={[-1.0, 0, 0.1]} size={[0.85, 0.85, 0.85]} rotation={[0, 0.15, 0]} />
        <Crate position={[-1.0, 0.85, 0.1]} size={[0.7, 0.7, 0.7]} rotation={[0, -0.2, 0]} />
        <Crate position={[-0.8, 0, -0.9]} size={[0.65, 0.65, 0.65]} rotation={[0, 0.4, 0]} />
      </group>

      {/* Left-rear corner crate stack */}
      <group position={[-10.5, 0, 6.2]}>
        <Crate position={[0, 0, 0]} size={[0.9, 0.9, 0.9]} rotation={[0, 0.1, 0]} />
        <Crate position={[0, 0.9, 0]} size={[0.75, 0.75, 0.75]} rotation={[0, -0.25, 0]} />
        <Barrel position={[0.9, 0, 0]} scale={0.9} />
        <Barrel position={[-0.1, 0, -0.9]} scale={0.8} />
      </group>
    </group>
  );
}
