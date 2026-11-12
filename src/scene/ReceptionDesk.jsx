import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PALETTE, TOON_RAMP } from '../theme';
import { stationStore } from '../hooks/useStationProgress';
import { profile, isTODO } from '../data/content';
import { createTextTexture } from '../utils/canvasTextures';
import { Outlines } from '@react-three/drei';
import { useQuality } from '../hooks/useQuality';

/**
 * ReceptionDesk component: Guild registrar counter, floating bobbing guild card,
 * inkwell & feather quill, and hanging overhead guild crest sign.
 */
export default function ReceptionDesk({ position = [0, 0, -5.2], rotation = [0, 0, 0] }) {
  const { config } = useQuality();
  const cardRef = useRef();
  const cardAuraRef = useRef();

  // Animate floating Guild Card: slow 360 rotation; faces camera at Contact station
  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const { activeStationIndex, dwellFactor } = stationStore.state;
    const isAtDesk = activeStationIndex === 4;

    if (cardRef.current) {
      const bobHeight = isAtDesk ? 0.07 : 0.05;
      cardRef.current.position.y = 1.6 + Math.sin(t * 2.0) * bobHeight;

      if (isAtDesk) {
        // Smoothly face front towards the viewer when at Contact station
        cardRef.current.rotation.y = THREE.MathUtils.damp(cardRef.current.rotation.y, 0, 4.5, delta);
        cardRef.current.rotation.x = THREE.MathUtils.damp(cardRef.current.rotation.x, -0.06, 4.5, delta);
        cardRef.current.rotation.z = THREE.MathUtils.damp(cardRef.current.rotation.z, 0, 4.5, delta);
      } else {
        // Slow continuous 360 float rotation
        cardRef.current.rotation.y += delta * 0.55;
        cardRef.current.rotation.x = Math.sin(t * 1.1) * 0.08;
        cardRef.current.rotation.z = Math.cos(t * 0.9) * 0.05;
      }
    }
    if (cardAuraRef.current) {
      const auraScale = isAtDesk ? 1.15 + dwellFactor * 0.25 : 1.0;
      const pulse = 1 + Math.sin(t * 3.5) * 0.12;
      const s = auraScale * pulse;
      cardAuraRef.current.scale.set(s, s, s);
    }
  });

  // Procedural 3D Guild Card texture
  const cardTexture = useMemo(() => {
    const rankPart = !isTODO(profile.rank) ? ` • RANK ${profile.rank}` : '';
    return createTextTexture({
      text: profile.name,
      subtext: `${profile.guildTitle}${rankPart}`,
      width: 512,
      height: 280,
      font: 'bold 64px "Cinzel", "Georgia", serif',
      subfont: 'bold 28px "Cinzel", sans-serif',
      color: PALETTE.woodDark,
      subcolor: PALETTE.guildRedBright,
    });
  }, []);

  return (
    <group name="GuildHall_ReceptionDesk" position={position} rotation={rotation}>
      {/* ---------------- MAIN COUNTER ---------------- */}
      {/* Heavy wooden counter top with beveled edge */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.2, 0.14, 1.4]} />
        <meshToonMaterial color={PALETTE.woodWarm} gradientMap={TOON_RAMP} />
        {config.enableOutlines && <Outlines thickness={0.025} color="#231410" opacity={0.65} transparent />}
      </mesh>

      {/* Main counter front body */}
      <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.9, 1.04, 1.2]} />
        <meshToonMaterial color={PALETTE.woodMedium} gradientMap={TOON_RAMP} />
      </mesh>

      {/* Front decorative wood panels (3 panels) */}
      {[-1.5, 0, 1.5].map((px) => (
        <group key={`panel-${px}`} position={[px, 0.52, 0.61]}>
          <mesh>
            <boxGeometry args={[1.2, 0.8, 0.04]} />
            <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <boxGeometry args={[1.05, 0.65, 0.02]} />
            <meshToonMaterial color={PALETTE.woodWarm} gradientMap={TOON_RAMP} />
          </mesh>
        </group>
      ))}

      {/* Counter plinth base */}
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[5.1, 0.12, 1.3]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>

      {/* Back shelf / desk storage behind counter */}
      <mesh position={[0, 0.5, -0.4]}>
        <boxGeometry args={[4.6, 0.9, 0.3]} />
        <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
      </mesh>

      {/* ---------------- COUNTER PROPS ---------------- */}
      {/* Service Bell (Brass dome + base) */}
      <group position={[1.4, 1.2, 0.1]}>
        <mesh position={[0, -0.02, 0]}>
          <cylinderGeometry args={[0.08, 0.09, 0.04, 12]} />
          <meshToonMaterial color={PALETTE.ironDark} gradientMap={TOON_RAMP} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <sphereGeometry args={[0.07, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshToonMaterial color={PALETTE.brassWarm} gradientMap={TOON_RAMP} />
        </mesh>
        <mesh position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.05, 8]} />
          <meshToonMaterial color={PALETTE.brassWarm} gradientMap={TOON_RAMP} />
        </mesh>
      </group>

      {/* Open Guild Registry Ledger Book */}
      <group position={[-1.2, 1.18, 0.05]} rotation={[0, 0.1, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.56, 0.04, 0.4]} />
          <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
        </mesh>
        <mesh position={[-0.13, 0.03, 0]} rotation={[0, 0, 0.06]}>
          <boxGeometry args={[0.24, 0.02, 0.36]} />
          <meshToonMaterial color={PALETTE.parchmentLight} gradientMap={TOON_RAMP} />
        </mesh>
        <mesh position={[0.13, 0.03, 0]} rotation={[0, 0, -0.06]}>
          <boxGeometry args={[0.24, 0.02, 0.36]} />
          <meshToonMaterial color={PALETTE.parchmentMedium} gradientMap={TOON_RAMP} />
        </mesh>
      </group>

      {/* Inkwell and Quill */}
      <group position={[-0.75, 1.18, 0.15]}>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.045, 0.065, 0.08, 10]} />
          <meshToonMaterial color={PALETTE.ironDark} gradientMap={TOON_RAMP} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <circleGeometry args={[0.038, 10]} />
          <meshBasicMaterial color={PALETTE.inkDark} />
        </mesh>
        <group position={[0, 0.08, 0]} rotation={[0.4, 0.2, 0.3]}>
          <mesh position={[0, 0.16, 0]}>
            <cylinderGeometry args={[0.005, 0.01, 0.32, 6]} />
            <meshToonMaterial color={PALETTE.parchmentLight} gradientMap={TOON_RAMP} />
          </mesh>
          <mesh position={[0.02, 0.22, 0]} rotation={[0, 0, 0.15]}>
            <boxGeometry args={[0.04, 0.2, 0.005]} />
            <meshToonMaterial color={PALETTE.guildRedBright} gradientMap={TOON_RAMP} />
          </mesh>
        </group>
      </group>

      {/* ---------------- FLOATING GUILD CARD (Centerpiece) ---------------- */}
      <group ref={cardRef} position={[0, 1.6, 0.15]}>
        <mesh castShadow>
          <boxGeometry args={[0.65, 0.42, 0.015]} />
          <meshStandardMaterial
            color={PALETTE.parchmentLight}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>

        {/* Card Gold Trim Border */}
        <mesh position={[0, 0, 0.009]}>
          <boxGeometry args={[0.61, 0.38, 0.005]} />
          <meshStandardMaterial
            color={PALETTE.guildGold}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>

        {/* Guild Crest Gem on Card */}
        <mesh position={[0, 0.12, 0.014]}>
          <octahedronGeometry args={[0.04, 0]} />
          <meshStandardMaterial
            color={PALETTE.magicCyan}
            emissive={PALETTE.magicCyan}
            emissiveIntensity={2.2}
            roughness={0.1}
          />
        </mesh>

        {/* Printed Adventurer Details via CanvasTexture */}
        <mesh position={[0, -0.04, 0.013]}>
          <planeGeometry args={[0.54, 0.26]} />
          <meshBasicMaterial map={cardTexture} transparent />
        </mesh>

        {/* Soft glowing aura plane behind card */}
        <mesh ref={cardAuraRef} position={[0, 0, -0.01]}>
          <planeGeometry args={[0.85, 0.6]} />
          <meshBasicMaterial
            color={PALETTE.magicCyanGlow}
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* ---------------- HANGING GUILD SIGN OVERHEAD ---------------- */}
      <group position={[0, 4.4, 0]}>
        <mesh position={[-1.2, 0.55, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.1, 6]} />
          <meshToonMaterial color={PALETTE.ironDark} gradientMap={TOON_RAMP} />
        </mesh>
        <mesh position={[1.2, 0.55, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.1, 6]} />
          <meshToonMaterial color={PALETTE.ironDark} gradientMap={TOON_RAMP} />
        </mesh>

        <mesh castShadow>
          <boxGeometry args={[3.2, 0.85, 0.12]} />
          <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
        </mesh>
        <mesh position={[0, 0, 0.065]}>
          <boxGeometry args={[2.95, 0.65, 0.02]} />
          <meshToonMaterial color={PALETTE.woodPlankB} gradientMap={TOON_RAMP} />
        </mesh>
        <mesh position={[0, 0, 0.075]}>
          <boxGeometry args={[2.8, 0.52, 0.01]} />
          <meshToonMaterial color={PALETTE.guildGold} gradientMap={TOON_RAMP} />
        </mesh>
        <group position={[0, 0, 0.09]}>
          <mesh rotation={[0, 0, 0.78]}>
            <boxGeometry args={[0.05, 0.35, 0.02]} />
            <meshToonMaterial color={PALETTE.ironDark} gradientMap={TOON_RAMP} />
          </mesh>
          <mesh rotation={[0, 0, -0.78]}>
            <boxGeometry args={[0.05, 0.35, 0.02]} />
            <meshToonMaterial color={PALETTE.ironDark} gradientMap={TOON_RAMP} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <coneGeometry args={[0.09, 0.15, 3]} rotation={[0, 0, Math.PI]} />
            <meshToonMaterial color={PALETTE.guildRed} gradientMap={TOON_RAMP} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
