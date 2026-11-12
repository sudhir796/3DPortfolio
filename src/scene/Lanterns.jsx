import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PALETTE, TOON_RAMP, LIGHTING } from '../theme';

/**
 * Single Medieval Guild Lantern
 * hasLight: boolean whether this lantern hosts one of our budgeted real-time point lights.
 */
function Lantern({ position = [0, 0, 0], hasLight = false, lightIndex = 0 }) {
  const flameRef = useRef();
  const pointLightRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + lightIndex * 1.7;
    const flicker = Math.sin(t * 11) * 0.12 + Math.cos(t * 19) * 0.08;

    if (flameRef.current) {
      flameRef.current.scale.set(
        1 + flicker * 0.4,
        1 + flicker * 0.8,
        1 + flicker * 0.4
      );
    }

    if (hasLight && pointLightRef.current) {
      pointLightRef.current.intensity =
        LIGHTING.lanternLight.intensity + flicker * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Iron Chain hanging from ceiling beam */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 1.5, 6]} />
        <meshToonMaterial color={PALETTE.ironDark} gradientMap={TOON_RAMP} />
      </mesh>

      {/* Top Iron Cap / Hood */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.26, 0.2, 4]} rotation={[0, Math.PI / 4, 0]} />
        <meshToonMaterial color={PALETTE.ironDark} gradientMap={TOON_RAMP} />
      </mesh>

      {/* Top Hanging Ring */}
      <mesh position={[0, 0.14, 0]}>
        <torusGeometry args={[0.06, 0.015, 6, 12]} />
        <meshToonMaterial color={PALETTE.ironDark} gradientMap={TOON_RAMP} />
      </mesh>

      {/* 4 Corner Iron Struts */}
      {[-0.14, 0.14].map((sx) =>
        [-0.14, 0.14].map((sz) => (
          <mesh key={`strut-${sx}-${sz}`} position={[sx, -0.22, sz]}>
            <boxGeometry args={[0.025, 0.38, 0.025]} />
            <meshToonMaterial color={PALETTE.ironDark} gradientMap={TOON_RAMP} />
          </mesh>
        ))
      )}

      {/* Glass Enclosure (Translucent amber) */}
      <mesh position={[0, -0.22, 0]}>
        <boxGeometry args={[0.26, 0.34, 0.26]} />
        <meshStandardMaterial
          color={PALETTE.lanternAmber}
          roughness={0.2}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Bottom Iron Base Plate */}
      <mesh position={[0, -0.42, 0]}>
        <boxGeometry args={[0.3, 0.04, 0.3]} />
        <meshToonMaterial color={PALETTE.ironDark} gradientMap={TOON_RAMP} />
      </mesh>
      {/* Bottom Finial */}
      <mesh position={[0, -0.46, 0]}>
        <coneGeometry args={[0.05, 0.08, 4]} rotation={[Math.PI, 0, 0]} />
        <meshToonMaterial color={PALETTE.ironDark} gradientMap={TOON_RAMP} />
      </mesh>

      {/* Glowing Lantern Flame Core (Blooms nicely in postprocessing) */}
      <mesh ref={flameRef} position={[0, -0.22, 0]}>
        <sphereGeometry args={[0.075, 10, 10]} />
        <meshStandardMaterial
          color={PALETTE.lanternAmber}
          emissive={PALETTE.lanternAmber}
          emissiveIntensity={3.2}
          roughness={0.1}
        />
      </mesh>

      {/* Inner White-Hot Wick */}
      <mesh position={[0, -0.22, 0]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial
          color={PALETTE.lanternCore}
          emissive={PALETTE.lanternCore}
          emissiveIntensity={4.0}
        />
      </mesh>

      {/* Budgeted Real-Time Point Light */}
      {hasLight && (
        <pointLight
          ref={pointLightRef}
          position={[0, -0.22, 0]}
          color={LIGHTING.lanternLight.color}
          intensity={LIGHTING.lanternLight.intensity}
          distance={LIGHTING.lanternLight.distance}
          decay={LIGHTING.lanternLight.decay}
        />
      )}
    </group>
  );
}

/**
 * Lanterns component: 7 hanging lanterns throughout the guild hall.
 * Exactly 5 contain real-time PointLights (staying strictly within the max 8 lights total).
 */
export default function Lanterns() {
  const lanternList = [
    // Entrance / Front Hall
    { pos: [0, 4.8, 4.5], hasLight: true, id: 0 },
    // Quest Board Lantern
    { pos: [-6.0, 4.8, 1.0], hasLight: true, id: 1 },
    // Reception Desk Overhead Lantern
    { pos: [0, 5.0, -3.5], hasLight: true, id: 2 },
    // Magic Circle Dais Lantern
    { pos: [6.5, 5.0, -1.5], hasLight: true, id: 3 },
    // Tavern Dining Area Lantern
    { pos: [6.5, 4.8, 3.8], hasLight: true, id: 4 },
    // Supplementary decorative lanterns (emissive bloom only, no real-time light slot used)
    { pos: [-6.0, 4.8, -4.0], hasLight: false, id: 5 },
    { pos: [0, 5.0, 0.5], hasLight: false, id: 6 },
  ];

  return (
    <group name="GuildHall_Lanterns">
      {lanternList.map((item) => (
        <Lantern
          key={`lantern-${item.id}`}
          position={item.pos}
          hasLight={item.hasLight}
          lightIndex={item.id}
        />
      ))}
    </group>
  );
}
