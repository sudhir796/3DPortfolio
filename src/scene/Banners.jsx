import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PALETTE, TOON_RAMP } from '../theme';

/**
 * Single Guild Banner with animated waving cloth vertices
 */
function GuildBanner({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], offset = 0 }) {
  const meshRef = useRef();

  // Create plane geometry with enough segments along height for smooth waving
  const geom = useMemo(() => {
    return new THREE.PlaneGeometry(1.2, 2.8, 12, 24);
  }, []);

  // Animate gentle cloth wave in useFrame
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * 1.5 + offset;
    const pos = meshRef.current.geometry.attributes.position;
    
    // Wave increases towards bottom of banner
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i); // between +1.4 and -1.4
      const factor = (1.4 - y) / 2.8; // 0 at top, 1 at bottom
      const wave = Math.sin(t + factor * 4.0) * (0.12 * factor);
      const waveZ = Math.cos(t * 0.8 + factor * 3.0) * (0.05 * factor);
      pos.setZ(i, wave + waveZ);
    }
    pos.needsUpdate = true;
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Horizontal Hanging Timber/Iron Rod */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.45, 8]} rotation={[0, 0, Math.PI / 2]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>
      {/* Rod End Finials (Gold spheres) */}
      <mesh position={[-0.75, 1.45, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshToonMaterial color={PALETTE.guildGold} gradientMap={TOON_RAMP} />
      </mesh>
      <mesh position={[0.75, 1.45, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshToonMaterial color={PALETTE.guildGold} gradientMap={TOON_RAMP} />
      </mesh>

      {/* Hanging Cords connecting to ceiling */}
      <mesh position={[-0.55, 1.75, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.6, 6]} />
        <meshToonMaterial color={PALETTE.guildGold} gradientMap={TOON_RAMP} />
      </mesh>
      <mesh position={[0.55, 1.75, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.6, 6]} />
        <meshToonMaterial color={PALETTE.guildGold} gradientMap={TOON_RAMP} />
      </mesh>

      {/* Main Animated Cloth Banner */}
      <mesh ref={meshRef} geometry={geom} castShadow receiveShadow>
        <meshToonMaterial
          color={PALETTE.guildRed}
          gradientMap={TOON_RAMP}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Guild Crest on Banner (Swords / Crest geometry attached near upper portion) */}
      <group position={[0, 0.45, 0.04]}>
        {/* Gold Diamond Emblem */}
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[0.42, 0.42]} />
          <meshToonMaterial color={PALETTE.guildGold} gradientMap={TOON_RAMP} side={THREE.DoubleSide} />
        </mesh>
        {/* Inner Crest Core */}
        <mesh position={[0, 0, 0.01]}>
          <circleGeometry args={[0.14, 16]} />
          <meshToonMaterial color={PALETTE.guildRedBright} gradientMap={TOON_RAMP} />
        </mesh>
      </group>

      {/* Gold Trim Bottom Band */}
      <mesh position={[0, -1.35, 0.02]}>
        <planeGeometry args={[1.2, 0.1]} />
        <meshToonMaterial color={PALETTE.guildGold} gradientMap={TOON_RAMP} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/**
 * Banners component: 4 hanging guild red banners positioned along ceiling cross-beams
 */
export default function Banners() {
  return (
    <group name="GuildHall_Banners">
      {/* Front Hall Banners (Framing the view) */}
      <GuildBanner position={[-4.5, 4.6, 3.0]} rotation={[0, 0.15, 0]} offset={0} />
      <GuildBanner position={[4.5, 4.6, 3.0]} rotation={[0, -0.15, 0]} offset={1.5} />

      {/* Rear Hall Banners (Framing the Reception Desk & Wall) */}
      <GuildBanner position={[-4.2, 4.6, -4.5]} rotation={[0, 0.1, 0]} offset={3.0} />
      <GuildBanner position={[4.2, 4.6, -4.5]} rotation={[0, -0.1, 0]} offset={4.5} />
    </group>
  );
}
