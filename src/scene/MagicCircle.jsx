import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PALETTE, TOON_RAMP } from '../theme';
import { stationStore } from '../hooks/useStationProgress';
import { abilities } from '../data/content';
import { usePortfolioInteraction } from '../hooks/usePortfolioInteraction';
import { createTextTexture } from '../utils/canvasTextures';
import { GUILD_LAYOUT } from '../data/layout';
import { Outlines } from '@react-three/drei';
import { useQuality } from '../hooks/useQuality';

/**
 * Single Orbiting Skill Crystal
 */
function SkillCrystal({ group, index, total, radius }) {
  const crystalRef = useRef();
  const { activeSkillGroupId, hoveredSkillGroupId, setActiveSkillGroupId, setHoveredSkillGroupId } =
    usePortfolioInteraction();

  const isHighlighted =
    hoveredSkillGroupId === group.id || (activeSkillGroupId === group.id && !hoveredSkillGroupId);

  const angle = (index / total) * Math.PI * 2;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = 0.15 * Math.sin(index * 1.5);

  useFrame(({ clock }, delta) => {
    if (!crystalRef.current) return;
    const t = clock.getElapsedTime();

    // Bobbing
    const bob = Math.sin(t * 2 + index * 1.2) * 0.08;
    crystalRef.current.position.y = y + bob;

    // Self-spin
    const spinSpeed = isHighlighted ? 2.5 : 0.8;
    crystalRef.current.rotation.y += delta * spinSpeed;
    crystalRef.current.rotation.x = Math.sin(t + index) * 0.2;

    // Scale damp
    const targetScale = isHighlighted ? 1.45 : 1.0;
    crystalRef.current.scale.setScalar(
      THREE.MathUtils.damp(crystalRef.current.scale.x, targetScale, 8, delta)
    );
  });

  const labelTexture = useMemo(() => {
    return createTextTexture({
      text: group.badge || group.name,
      width: 256,
      height: 96,
      font: 'bold 44px "Cinzel", "Georgia", serif',
      color: '#5ee6ff',
      backgroundColor: 'transparent',
    });
  }, [group.badge, group.name]);

  return (
    <group
      position={[x, 0, z]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredSkillGroupId(group.id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredSkillGroupId(null);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        setActiveSkillGroupId(group.id);
      }}
    >
      <group ref={crystalRef}>
        <mesh castShadow>
          <octahedronGeometry args={[0.13, 0]} />
          <meshStandardMaterial
            color={isHighlighted ? '#ffffff' : PALETTE.magicCyan}
            emissive={isHighlighted ? '#5ee6ff' : PALETTE.magicTeal}
            emissiveIntensity={isHighlighted ? 4.5 : 2.0}
            roughness={0.1}
            metalness={0.2}
          />
        </mesh>
      </group>

      {/* Floating skill group badge label via CanvasTexture */}
      <mesh position={[0, 0.28, 0]}>
        <planeGeometry args={[0.42, 0.16]} />
        <meshBasicMaterial map={labelTexture} transparent side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/**
 * MagicCircle component: Stat/Skill appraisal dais with animated concentric rune rings,
 * teal/cyan anime glow, and 5 floating polyhedral crystals orbiting above for each skill group.
 */
export default function MagicCircle({
  position = GUILD_LAYOUT.magicCircle.position,
  rotation = GUILD_LAYOUT.magicCircle.rotation,
}) {
  const { config } = useQuality();
  const outerRingRef = useRef();
  const innerRingRef = useRef();
  const runesRef = useRef();
  const crystalGroupRef = useRef();
  const centerCrystalRef = useRef();

  // 12 rune marks array
  const runeMarks = useMemo(() => {
    const list = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 1.35;
      list.push({
        id: `rune-${i}`,
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        rotY: -angle,
        isMajor: i % 3 === 0,
      });
    }
    return list;
  }, []);

  // Animate rotating magic rings and orbiting crystals
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const { activeStationIndex, dwellFactor } = stationStore.state;
    const isAtDais = activeStationIndex === 2;
    const speedBoost = isAtDais ? 1.0 + dwellFactor * 0.6 : 1.0;

    // Heartbeat pulse synchronized across rings
    const heartbeat = 1.0 + Math.sin(t * 2.2) * 0.035 + Math.pow(Math.max(0, Math.sin(t * 2.2)), 6) * 0.065;

    if (outerRingRef.current) {
      outerRingRef.current.rotation.y = t * 0.18 * speedBoost;
      outerRingRef.current.scale.set(heartbeat, 1, heartbeat);
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.y = -t * 0.32 * speedBoost;
      innerRingRef.current.scale.set(1.02 / heartbeat, 1, 1.02 / heartbeat);
    }
    if (runesRef.current) {
      runesRef.current.rotation.y = t * 0.08 * speedBoost;
    }

    // Orbiting crystal group
    if (crystalGroupRef.current) {
      crystalGroupRef.current.rotation.y = t * 0.35 * speedBoost;
    }

    // Center focal crystal floating & spinning
    if (centerCrystalRef.current) {
      const bobAmp = isAtDais ? 0.18 : 0.12;
      centerCrystalRef.current.position.y = 1.8 + Math.sin(t * (1.6 * speedBoost)) * bobAmp;
      centerCrystalRef.current.rotation.y = t * 0.8 * speedBoost;
      centerCrystalRef.current.rotation.x = Math.sin(t * 0.6) * 0.2;
    }
  });

  return (
    <group name="GuildHall_MagicCircle" position={position} rotation={rotation}>
      {/* ---------------- STONE PEDESTAL / DAIS ---------------- */}
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <cylinderGeometry args={[2.5, 2.7, 0.16, 8]} />
        <meshToonMaterial color={PALETTE.stoneDark} gradientMap={TOON_RAMP} />
        {config.enableOutlines && <Outlines thickness={0.025} color="#1b1220" opacity={0.65} transparent />}
      </mesh>
      <mesh position={[0, 0.22, 0]} receiveShadow>
        <cylinderGeometry args={[2.1, 2.3, 0.14, 8]} />
        <meshToonMaterial color={PALETTE.stoneNeutral} gradientMap={TOON_RAMP} />
      </mesh>
      <mesh position={[0, 0.45, 0]} receiveShadow>
        <cylinderGeometry args={[0.55, 0.7, 0.35, 8]} />
        <meshToonMaterial color={PALETTE.stoneDark} gradientMap={TOON_RAMP} />
      </mesh>

      {/* ---------------- GLOWING MAGIC CIRCLE RINGS ---------------- */}
      {/* Outer Glow Disc Plane on the dais: sits 0.02m above platform at y=0.31 to eliminate z-fighting */}
      <mesh position={[0, 0.31, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 2.05, 48]} />
        <meshBasicMaterial
          color={PALETTE.magicTeal}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer Ring */}
      <group ref={outerRingRef} position={[0, 0.32, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.9, 0.038, 12, 64]} />
          <meshStandardMaterial
            color={PALETTE.magicCyan}
            emissive={PALETTE.magicCyan}
            emissiveIntensity={3.5}
            roughness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.65, 0.028, 12, 64]} />
          <meshStandardMaterial
            color={PALETTE.magicTeal}
            emissive={PALETTE.magicTeal}
            emissiveIntensity={2.8}
            roughness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Inner Counter-Rotating Ring */}
      <group ref={innerRingRef} position={[0, 0.33, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.15, 0.032, 12, 48]} />
          <meshStandardMaterial
            color={PALETTE.magicCyanGlow}
            emissive={PALETTE.magicCyan}
            emissiveIntensity={3.6}
            roughness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, 0.028, 12, 32]} />
          <meshStandardMaterial
            color={PALETTE.magicCyan}
            emissive={PALETTE.magicCyan}
            emissiveIntensity={3.8}
            roughness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Rune Marks Layer */}
      <group ref={runesRef} position={[0, 0.335, 0]}>
        {runeMarks.map((rune) => (
          <group
            key={rune.id}
            position={[rune.x, 0, rune.z]}
            rotation={[0, rune.rotY, 0]}
          >
            <mesh rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
              <planeGeometry args={[rune.isMajor ? 0.16 : 0.1, rune.isMajor ? 0.16 : 0.1]} />
              <meshBasicMaterial
                color={PALETTE.magicCyanGlow}
                side={THREE.DoubleSide}
                transparent
                opacity={0.9}
              />
            </mesh>
            <mesh position={[0, 0, -0.09]}>
              <boxGeometry args={[0.025, 0.01, 0.1]} />
              <meshBasicMaterial color={PALETTE.magicCyan} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ---------------- FLOATING ORBITING CRYSTALS ---------------- */}
      {/* Central Large Mana Core */}
      <mesh ref={centerCrystalRef} position={[0, 1.8, 0]} castShadow>
        <octahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial
          color={PALETTE.magicCyan}
          emissive={PALETTE.magicCyan}
          emissiveIntensity={3.4}
          roughness={0.08}
          metalness={0.2}
        />
      </mesh>

      {/* 5 Orbiting Skill Group Crystals (Languages, Frameworks, AI/ML, Data, Tools) */}
      <group ref={crystalGroupRef} position={[0, 1.7, 0]}>
        {abilities.groups.map((group, idx) => (
          <SkillCrystal
            key={group.id}
            group={group}
            index={idx}
            total={abilities.groups.length}
            radius={1.25}
          />
        ))}
      </group>
    </group>
  );
}
