import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { PALETTE } from '../theme';
import { GUILD_LAYOUT } from '../data/layout';
import { stationStore } from '../hooks/useStationProgress';
import { useQuality } from '../hooks/useQuality';

/**
 * Custom Mana Swarm: Floating cyan arcane spores around the Appraisal Dais.
 * Built with procedural Points, additive blending, depthWrite={false}, and glowing anime teal color.
 */
function ManaSwarm({ position = [6.5, 1.4, -1.8], count = 75 }) {
  const pointsRef = useRef();

  const [positions, phases, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    const sp = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Cylinder distribution around dais: radius 0.4 to 2.2m, height 0.3 to 2.6m
      const radius = 0.4 + Math.random() * 1.8;
      const angle = Math.random() * Math.PI * 2;
      const y = 0.35 + Math.random() * 2.2;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      ph[i] = Math.random() * Math.PI * 2;
      sp[i] = 0.4 + Math.random() * 0.8;
    }
    return [pos, ph, sp];
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position;
    const arr = posAttr.array;

    // React when Abilities station is active
    const isAtAbilities = stationStore.state.activeStationIndex === 2;
    const speedMultiplier = isAtAbilities ? 2.4 : 1.0;

    if (pointsRef.current.material) {
      pointsRef.current.material.opacity = isAtAbilities ? 1.0 : 0.85;
      pointsRef.current.material.size = isAtAbilities ? 0.22 : 0.16;
    }

    for (let i = 0; i < count; i++) {
      // Gentle spiral upwards and loop back down
      const i3 = i * 3;
      arr[i3 + 1] += (Math.sin(t * speeds[i] * speedMultiplier + phases[i]) * 0.005 + 0.004) * speedMultiplier;
      if (arr[i3 + 1] > 2.7) {
        arr[i3 + 1] = 0.35;
      }
      // Orbital swirl
      const currentX = arr[i3];
      const currentZ = arr[i3 + 2];
      const angleDelta = 0.006 * speeds[i] * speedMultiplier;
      const cosA = Math.cos(angleDelta);
      const sinA = Math.sin(angleDelta);
      arr[i3] = currentX * cosA - currentZ * sinA;
      arr[i3 + 2] = currentX * sinA + currentZ * cosA;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <group position={position}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          color={PALETTE.magicCyan}
          transparent
          opacity={0.92}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

/**
 * Particles component: Ambient floating tavern dust motes,
 * glowing cyan mana particles at the magic circle, and fireplace embers.
 */
export default function Particles() {
  const magicCirclePos = GUILD_LAYOUT.magicCircle.position;
  const { config } = useQuality();
  const ratio = config.particleCountRatio;

  const dustCount = Math.max(15, Math.round(60 * ratio));
  const manaCount = Math.max(25, Math.round(80 * ratio));
  const circleSparkles = Math.max(12, Math.round(45 * ratio));
  const fireSparkles = Math.max(8, Math.round(24 * ratio));

  return (
    <group name="GuildHall_Particles">
      {/* Warm Golden Dust Motes floating across the hall */}
      <Sparkles
        count={dustCount}
        scale={[20, 6, 14]}
        position={[0, 3.2, 0]}
        size={2.4}
        speed={0.35}
        opacity={0.45}
        color={PALETTE.lanternAmber}
      />

      {/* Magical Cyan Mana Swarm centered directly around the Magic Circle */}
      <ManaSwarm position={[magicCirclePos[0], 0, magicCirclePos[2]]} count={manaCount} />

      {/* Additional ambient Sparkles around magic circle */}
      <Sparkles
        count={circleSparkles}
        scale={[4.4, 3.2, 4.4]}
        position={[magicCirclePos[0], 1.6, magicCirclePos[2]]}
        size={4.2}
        speed={0.7}
        opacity={0.88}
        color="#5ee6ff"
      />

      {/* Fireplace Ember Sparks */}
      <Sparkles
        count={fireSparkles}
        scale={[1.8, 3.5, 1.8]}
        position={[11.2, 2.2, -4.5]}
        size={2.8}
        speed={0.9}
        opacity={0.85}
        color={PALETTE.fireBright}
      />
    </group>
  );
}
