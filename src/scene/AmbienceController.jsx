import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { STATIONS } from '../data/stations';
import { stationStore } from '../hooks/useStationProgress';

/**
 * AmbienceController: Gently shifts tavern lighting parameters, fog density,
 * and warmth based on which station the user is visiting.
 */
export default function AmbienceController({ ambientRef, dirLightRef, fogRef }) {
  const currentAmbientIntensity = useRef(0.65);
  const currentDirIntensity = useRef(1.4);
  const duskColorA = useRef(new THREE.Color('#ffb347'));
  const duskColorB = useRef(new THREE.Color('#fca068'));
  const blendedColor = useRef(new THREE.Color());

  useFrame(({ clock }, delta) => {
    const { activeStationIndex, dwellFactor } = stationStore.state;
    const currentStation = STATIONS[activeStationIndex];
    if (!currentStation) return;

    // Subtle 60-second day-to-dusk breathing cycle
    const t = clock.getElapsedTime();
    const cycle = (Math.sin((t * Math.PI * 2) / 60) + 1) * 0.5;
    const breathingOffset = (cycle - 0.5) * 0.08;

    const targetAmbient = currentStation.ambience.ambientIntensity + breathingOffset * 0.5;
    const targetDir = currentStation.ambience.duskIntensity + breathingOffset;

    // Smoothly lerp light values
    if (ambientRef?.current) {
      currentAmbientIntensity.current = THREE.MathUtils.damp(
        currentAmbientIntensity.current,
        targetAmbient,
        2.5,
        delta
      );
      ambientRef.current.intensity = currentAmbientIntensity.current;
    }

    if (dirLightRef?.current) {
      currentDirIntensity.current = THREE.MathUtils.damp(
        currentDirIntensity.current,
        targetDir,
        2.5,
        delta
      );
      dirLightRef.current.intensity = currentDirIntensity.current;

      // Subtle warm color shift over 60 seconds
      blendedColor.current.lerpColors(duskColorA.current, duskColorB.current, cycle);
      dirLightRef.current.color.copy(blendedColor.current);
    }
  });

  return null;
}
