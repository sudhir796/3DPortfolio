import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Outlines } from '@react-three/drei';
import * as THREE from 'three';
import { PALETTE, TOON_RAMP, LIGHTING } from '../theme';
import { useQuality } from '../hooks/useQuality';

/**
 * Fireplace component: Massive stone hearth, chimney, firewood logs,
 * layered animated flickering anime flame cones, and a flickering warm PointLight.
 */
export default function Fireplace({ position = [11.4, 0, -4.5], rotation = [0, -Math.PI / 2, 0] }) {
  const { config } = useQuality();
  const flame1Ref = useRef();
  const flame2Ref = useRef();
  const flame3Ref = useRef();
  const flameLightRef = useRef();

  // Animate fire cones fluttering and point light flickering
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Chaotic natural flicker via trig sums
    const flicker1 = Math.sin(t * 14) * 0.15 + Math.cos(t * 22) * 0.1;
    const flicker2 = Math.cos(t * 18) * 0.18 + Math.sin(t * 28) * 0.12;

    if (flame1Ref.current) {
      flame1Ref.current.scale.set(
        1 + flicker1 * 0.5,
        1 + flicker1,
        1 + flicker2 * 0.4
      );
      flame1Ref.current.rotation.y = t * 2;
    }

    if (flame2Ref.current) {
      flame2Ref.current.scale.set(
        1 - flicker2 * 0.4,
        1 + flicker2 * 0.8,
        1 - flicker1 * 0.3
      );
      flame2Ref.current.rotation.y = -t * 2.5;
    }

    if (flame3Ref.current) {
      flame3Ref.current.scale.set(
        1 + flicker2 * 0.6,
        1 + flicker1 * 0.9,
        1 + flicker1 * 0.5
      );
    }

    // PointLight subtle intensity flicker
    if (flameLightRef.current) {
      flameLightRef.current.intensity =
        LIGHTING.fireLight.intensity + Math.sin(t * 12) * 0.35 + Math.cos(t * 25) * 0.2;
    }
  });

  return (
    <group name="GuildHall_Fireplace" position={position} rotation={rotation}>
      {/* ---------------- STONE HEARTH & MASONRY ---------------- */}
      {/* Raised stone hearth floor base */}
      <mesh position={[0, 0.12, 0.4]} receiveShadow>
        <boxGeometry args={[3.2, 0.24, 1.8]} />
        <meshToonMaterial color={PALETTE.stoneDark} gradientMap={TOON_RAMP} />
      </mesh>

      {/* Fireplace back wall cavity */}
      <mesh position={[0, 1.4, -0.4]} receiveShadow>
        <boxGeometry args={[2.2, 2.4, 0.3]} />
        <meshToonMaterial color={PALETTE.stoneDark} gradientMap={TOON_RAMP} />
      </mesh>

      {/* Left stone pillar */}
      <mesh position={[-1.15, 1.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 2.4, 0.9]} />
        <meshToonMaterial color={PALETTE.stoneNeutral} gradientMap={TOON_RAMP} />
      </mesh>

      {/* Right stone pillar */}
      <mesh position={[1.15, 1.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 2.4, 0.9]} />
        <meshToonMaterial color={PALETTE.stoneNeutral} gradientMap={TOON_RAMP} />
      </mesh>

      {/* Heavy stone arch / lintel across top of firebox */}
      <mesh position={[0, 2.4, 0.1]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.45, 0.9]} />
        <meshToonMaterial color={PALETTE.stoneNeutral} gradientMap={TOON_RAMP} />
        {config.enableOutlines && <Outlines thickness={0.025} color="#1f1816" opacity={0.65} transparent />}
      </mesh>

      {/* Thick wooden mantelpiece shelf */}
      <mesh position={[0, 2.7, 0.15]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.2, 1.1]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>

      {/* Tall stone chimney breast rising to ceiling */}
      <mesh position={[0, 4.8, -0.1]} receiveShadow>
        <boxGeometry args={[2.4, 4.2, 0.7]} />
        <meshToonMaterial color={PALETTE.stoneBeige} gradientMap={TOON_RAMP} />
      </mesh>

      {/* Iron fire grate */}
      <group position={[0, 0.25, 0]}>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[1.2, 0.06, 0.6]} />
          <meshToonMaterial color={PALETTE.ironDark} gradientMap={TOON_RAMP} />
        </mesh>
        {/* Grate legs */}
        {[-0.5, 0.5].map((gx) => (
          <mesh key={`grate-leg-${gx}`} position={[gx, -0.05, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.12, 6]} />
            <meshToonMaterial color={PALETTE.ironDark} gradientMap={TOON_RAMP} />
          </mesh>
        ))}
      </group>

      {/* Firewood logs */}
      <group position={[0, 0.38, 0]}>
        {/* Bottom log 1 */}
        <mesh position={[-0.25, 0, -0.1]} rotation={[0, 0.2, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.85, 8]} />
          <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
        </mesh>
        {/* Bottom log 2 */}
        <mesh position={[0.25, 0, 0.1]} rotation={[0, -0.15, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
          <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
        </mesh>
        {/* Cross top log */}
        <mesh position={[0, 0.12, 0]} rotation={[0.4, 0.9, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.075, 0.075, 0.75, 8]} />
          <meshToonMaterial color={PALETTE.woodMedium} gradientMap={TOON_RAMP} />
        </mesh>
      </group>

      {/* Glowing Ember Bed */}
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[0.9, 0.08, 0.5]} />
        <meshStandardMaterial
          color={PALETTE.fireRed}
          emissive={PALETTE.fireRed}
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* ---------------- ANIMATED LAYERED FLAMES ---------------- */}
      <group position={[0, 0.42, 0]}>
        {/* Outer Red/Orange Flame Cone */}
        <mesh ref={flame1Ref} position={[0, 0.3, 0]}>
          <coneGeometry args={[0.32, 0.8, 8]} />
          <meshStandardMaterial
            color={PALETTE.fireRed}
            emissive={PALETTE.fireOrange}
            emissiveIntensity={2.2}
            roughness={0.2}
          />
        </mesh>

        {/* Middle Bright Orange Flame Cone */}
        <mesh ref={flame2Ref} position={[0.05, 0.32, 0.04]}>
          <coneGeometry args={[0.24, 0.65, 8]} />
          <meshStandardMaterial
            color={PALETTE.fireOrange}
            emissive={PALETTE.fireBright}
            emissiveIntensity={2.8}
            roughness={0.2}
          />
        </mesh>

        {/* Inner White-Hot Flame Core */}
        <mesh ref={flame3Ref} position={[-0.04, 0.26, -0.03]}>
          <coneGeometry args={[0.15, 0.48, 8]} />
          <meshStandardMaterial
            color={PALETTE.magicCore}
            emissive={PALETTE.fireBright}
            emissiveIntensity={3.5}
            roughness={0.1}
          />
        </mesh>

        {/* Small rising ember spark sphere */}
        <mesh position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial
            color={PALETTE.fireBright}
            emissive={PALETTE.fireBright}
            emissiveIntensity={3.0}
          />
        </mesh>
      </group>

      {/* Real-time Fireplace Point Light (Part of the 8 max lights) */}
      <pointLight
        ref={flameLightRef}
        position={[0, 0.8, 0.6]}
        color={LIGHTING.fireLight.color}
        intensity={LIGHTING.fireLight.intensity}
        distance={LIGHTING.fireLight.distance}
        decay={LIGHTING.fireLight.decay}
      />
    </group>
  );
}
