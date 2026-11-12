import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PALETTE, TOON_RAMP } from '../theme';
import { introStore } from '../ui/IntroCinematic';

/**
 * Entrance component: Massive adventurer guild double doors,
 * stone archway, flanking pillars, and iron ring handles.
 * Animated hinged doors that swing open during the intro cinematic.
 */
export default function Entrance() {
  const leftDoorHingeRef = useRef();
  const rightDoorHingeRef = useRef();

  const doorZ = 7.85;
  const doorWidth = 1.4;
  const doorHeight = 4.2;
  const doorThickness = 0.18;

  useFrame(() => {
    const angle = introStore.doorAngle;
    if (leftDoorHingeRef.current) {
      // Left door swings inward/backwards
      leftDoorHingeRef.current.rotation.y = -angle;
    }
    if (rightDoorHingeRef.current) {
      // Right door swings opposite
      rightDoorHingeRef.current.rotation.y = angle;
    }
  });

  return (
    <group name="GuildHall_Entrance" position={[0, 0, doorZ]}>
      {/* Stone Threshold Step */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[4.2, 0.16, 0.8]} />
        <meshToonMaterial color={PALETTE.stoneDark} gradientMap={TOON_RAMP} />
      </mesh>

      {/* Flanking Stone Pillar - Left */}
      <group position={[-1.9, 2.2, 0]}>
        <mesh position={[0, -2.05, 0]}>
          <boxGeometry args={[0.9, 0.35, 0.9]} />
          <meshToonMaterial color={PALETTE.stoneDark} gradientMap={TOON_RAMP} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.32, 0.36, 3.8, 12]} />
          <meshToonMaterial color={PALETTE.stoneNeutral} gradientMap={TOON_RAMP} />
        </mesh>
        <mesh position={[0, 2.05, 0]}>
          <boxGeometry args={[0.85, 0.35, 0.85]} />
          <meshToonMaterial color={PALETTE.stoneDark} gradientMap={TOON_RAMP} />
        </mesh>
      </group>

      {/* Flanking Stone Pillar - Right */}
      <group position={[1.9, 2.2, 0]}>
        <mesh position={[0, -2.05, 0]}>
          <boxGeometry args={[0.9, 0.35, 0.9]} />
          <meshToonMaterial color={PALETTE.stoneDark} gradientMap={TOON_RAMP} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.32, 0.36, 3.8, 12]} />
          <meshToonMaterial color={PALETTE.stoneNeutral} gradientMap={TOON_RAMP} />
        </mesh>
        <mesh position={[0, 2.05, 0]}>
          <boxGeometry args={[0.85, 0.35, 0.85]} />
          <meshToonMaterial color={PALETTE.stoneDark} gradientMap={TOON_RAMP} />
        </mesh>
      </group>

      {/* Stone Arch Beam over Doors */}
      <mesh position={[0, 4.45, 0]}>
        <boxGeometry args={[3.8, 0.45, 0.6]} />
        <meshToonMaterial color={PALETTE.stoneDark} gradientMap={TOON_RAMP} />
      </mesh>
      {/* Arch Keystone accent */}
      <mesh position={[0, 4.6, -0.05]}>
        <boxGeometry args={[0.6, 0.65, 0.65]} />
        <meshToonMaterial color={PALETTE.stoneBeige} gradientMap={TOON_RAMP} />
      </mesh>

      {/* Left Door Hinge & Leaf */}
      <group ref={leftDoorHingeRef} position={[-doorWidth - 0.02, 0, 0]}>
        <group position={[doorWidth / 2, doorHeight / 2 + 0.16, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[doorWidth, doorHeight, doorThickness]} />
            <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
          </mesh>
          {/* Vertical plank ridges */}
          {[-0.45, -0.15, 0.15, 0.45].map((px) => (
            <mesh key={`plank-left-${px}`} position={[px, 0, -0.01]}>
              <boxGeometry args={[0.02, doorHeight - 0.1, doorThickness + 0.02]} />
              <meshToonMaterial color={PALETTE.woodMedium} gradientMap={TOON_RAMP} />
            </mesh>
          ))}
          {/* Iron Strap Hinges */}
          {[1.2, 0.0, -1.2].map((hy) => (
            <mesh key={`hinge-left-${hy}`} position={[0.1, hy, -doorThickness / 2 - 0.02]}>
              <boxGeometry args={[doorWidth * 0.75, 0.12, 0.04]} />
              <meshToonMaterial color={PALETTE.ironDark} gradientMap={TOON_RAMP} />
            </mesh>
          ))}
          {/* Iron Ring Door Handle */}
          <mesh position={[doorWidth / 2 - 0.25, -0.2, -doorThickness / 2 - 0.06]}>
            <torusGeometry args={[0.1, 0.025, 8, 16]} />
            <meshToonMaterial color={PALETTE.brassWarm} gradientMap={TOON_RAMP} />
          </mesh>
        </group>
      </group>

      {/* Right Door Hinge & Leaf */}
      <group ref={rightDoorHingeRef} position={[doorWidth + 0.02, 0, 0]}>
        <group position={[-doorWidth / 2, doorHeight / 2 + 0.16, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[doorWidth, doorHeight, doorThickness]} />
            <meshToonMaterial color={PALETTE.woodDark} gradientMap={TOON_RAMP} />
          </mesh>
          {/* Vertical plank ridges */}
          {[-0.45, -0.15, 0.15, 0.45].map((px) => (
            <mesh key={`plank-right-${px}`} position={[px, 0, -0.01]}>
              <boxGeometry args={[0.02, doorHeight - 0.1, doorThickness + 0.02]} />
              <meshToonMaterial color={PALETTE.woodMedium} gradientMap={TOON_RAMP} />
            </mesh>
          ))}
          {/* Iron Strap Hinges */}
          {[1.2, 0.0, -1.2].map((hy) => (
            <mesh key={`hinge-right-${hy}`} position={[-0.1, hy, -doorThickness / 2 - 0.02]}>
              <boxGeometry args={[doorWidth * 0.75, 0.12, 0.04]} />
              <meshToonMaterial color={PALETTE.ironDark} gradientMap={TOON_RAMP} />
            </mesh>
          ))}
          {/* Iron Ring Door Handle */}
          <mesh position={[-doorWidth / 2 + 0.25, -0.2, -doorThickness / 2 - 0.06]}>
            <torusGeometry args={[0.1, 0.025, 8, 16]} />
            <meshToonMaterial color={PALETTE.brassWarm} gradientMap={TOON_RAMP} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
