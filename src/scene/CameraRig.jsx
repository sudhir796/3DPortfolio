import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { STATIONS, createStationCurves } from '../data/stations';
import { stationStore, usePrefersReducedMotion } from '../hooks/useStationProgress';
import { introStore } from '../ui/IntroCinematic';
import { useSettings } from '../hooks/useSettings';

// Static scratch vectors to eliminate GC memory allocations in useFrame
const _tempPos = new THREE.Vector3(0.0, 2.4, 7.2);
const _tempTarget = new THREE.Vector3(0.0, 2.1, -1.8);
const _dampedPos = new THREE.Vector3(0.0, 2.4, 7.2);
const _dampedTarget = new THREE.Vector3(0.0, 2.1, -1.8);
let _isInitialized = false;

/**
 * Maps raw scroll progress (0..1) to curve parameter (0..1)
 * with dedicated dwell windows (16-18% of scroll range) and smooth transitions.
 */
function mapScrollToCurve(p) {
  const clamped = Math.max(0, Math.min(1, p));

  // Station 0: Entrance dwell [0.00, 0.16] -> u = 0.00
  if (clamped <= 0.16) return 0.0;

  // Transition 0 -> 1: [0.16, 0.22]
  if (clamped < 0.22) {
    const t = (clamped - 0.16) / (0.22 - 0.16);
    const ease = t * t * (3 - 2 * t);
    return 0.0 + 0.25 * ease;
  }

  // Station 1: Quest Board dwell [0.22, 0.38] -> u = 0.25
  if (clamped <= 0.38) return 0.25;

  // Transition 1 -> 2: [0.38, 0.44]
  if (clamped < 0.44) {
    const t = (clamped - 0.38) / (0.44 - 0.38);
    const ease = t * t * (3 - 2 * t);
    return 0.25 + 0.25 * ease;
  }

  // Station 2: Magic Circle dwell [0.44, 0.60] -> u = 0.50
  if (clamped <= 0.60) return 0.50;

  // Transition 2 -> 3: [0.60, 0.66]
  if (clamped < 0.66) {
    const t = (clamped - 0.66) / (0.66 - 0.60);
    const ease = t * t * (3 - 2 * t);
    return 0.50 + 0.25 * ease;
  }

  // Station 3: Tavern dwell [0.66, 0.82] -> u = 0.75
  if (clamped <= 0.82) return 0.75;

  // Transition 3 -> 4: [0.82, 0.88]
  if (clamped < 0.88) {
    const t = (clamped - 0.82) / (0.88 - 0.82);
    const ease = t * t * (3 - 2 * t);
    return 0.75 + 0.25 * ease;
  }

  // Station 4: Reception Desk dwell [0.88, 1.00] -> u = 1.00
  return 1.0;
}

/**
 * CameraRig component:
 * - Scroll-driven 5-station journey through CatmullRom curves
 * - Dwell zones with smooth cubic transitions
 * - Handheld idle sway & mouse parallax (disabled with prefers-reduced-motion)
 * - Keyboard navigation (Arrows, PageUp/Down, Home/End)
 * - OrbitControls override when dev 'O' toggle is enabled
 */
export default function CameraRig({ isOrbitMode, setIsOrbitMode }) {
  const cameraRef = useRef();
  const controlsRef = useRef();
  const scroll = useScroll();
  const { mouse } = useThree();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Pre-generate smooth CatmullRom curves from station positions
  const { positionCurve, targetCurve } = useMemo(() => createStationCurves(), []);

  // Register scroll DOM container to store for click-to-scroll & keyboard
  useEffect(() => {
    if (scroll?.el) {
      stationStore.setScrollEl(scroll.el);
    }
  }, [scroll?.el]);

  // Keyboard navigation between stations
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle Orbit controls with 'O'
      if (e.key === 'o' || e.key === 'O') {
        setIsOrbitMode((prev) => !prev);
        return;
      }

      // Keyboard station travel
      if (['ArrowDown', 'PageDown'].includes(e.key)) {
        e.preventDefault();
        const currentIdx = stationStore.state.activeStationIndex;
        const nextIdx = Math.min(STATIONS.length - 1, currentIdx + 1);
        stationStore.scrollToStation(nextIdx, !prefersReducedMotion);
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        const currentIdx = stationStore.state.activeStationIndex;
        const prevIdx = Math.max(0, currentIdx - 1);
        stationStore.scrollToStation(prevIdx, !prefersReducedMotion);
      } else if (e.key === 'Home') {
        e.preventDefault();
        stationStore.scrollToStation(0, !prefersReducedMotion);
      } else if (e.key === 'End') {
        e.preventDefault();
        stationStore.scrollToStation(STATIONS.length - 1, !prefersReducedMotion);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsOrbitMode, prefersReducedMotion]);

  const [settings] = useSettings();
  const allowSway = !prefersReducedMotion && settings.headBobEnabled && !settings.reducedMotion;

  // Animation frame loop
  useFrame(({ clock }, delta) => {
    const rawOffset = scroll ? scroll.offset : 0;

    // Synchronize station progress store
    stationStore.updateProgress(rawOffset);

    // If Orbit inspection mode is active, let OrbitControls command the camera
    if (isOrbitMode) return;

    // Handle intro cinematic camera glide
    if (introStore.isPlaying) {
      const p = introStore.progress;
      _tempPos.set(0.0, 2.3, THREE.MathUtils.lerp(11.4, STATIONS[0].cameraPos[2], p));
      _tempTarget.set(STATIONS[0].lookAtTarget[0], STATIONS[0].lookAtTarget[1], STATIONS[0].lookAtTarget[2]);
    } else {
      // Compute curve parameter with easing and dwell
      const curveU = mapScrollToCurve(rawOffset);

      // Sample position and lookAt target from spline curves
      positionCurve.getPoint(curveU, _tempPos);
      targetCurve.getPoint(curveU, _tempTarget);
    }

    // Handheld camera sway and mouse parallax
    if (allowSway && !introStore.isPlaying) {
      const t = clock.getElapsedTime();
      const swayX = Math.sin(t * 0.6) * 0.035;
      const swayY = Math.cos(t * 0.8) * 0.025;

      const parallaxX = mouse.x * 0.22;
      const parallaxY = mouse.y * 0.12;

      _tempPos.x += swayX + parallaxX;
      _tempPos.y += swayY + parallaxY;

      _tempTarget.x += parallaxX * 0.4;
      _tempTarget.y += parallaxY * 0.3;
    }

    // Smooth damping
    if (!_isInitialized) {
      _dampedPos.copy(_tempPos);
      _dampedTarget.copy(_tempTarget);
      _isInitialized = true;
    } else {
      const lerpSpeed = prefersReducedMotion ? 6.0 : 3.2;
      _dampedPos.x = THREE.MathUtils.damp(_dampedPos.x, _tempPos.x, lerpSpeed, delta);
      _dampedPos.y = THREE.MathUtils.damp(_dampedPos.y, _tempPos.y, lerpSpeed, delta);
      _dampedPos.z = THREE.MathUtils.damp(_dampedPos.z, _tempPos.z, lerpSpeed, delta);

      _dampedTarget.x = THREE.MathUtils.damp(_dampedTarget.x, _tempTarget.x, lerpSpeed, delta);
      _dampedTarget.y = THREE.MathUtils.damp(_dampedTarget.y, _tempTarget.y, lerpSpeed, delta);
      _dampedTarget.z = THREE.MathUtils.damp(_dampedTarget.z, _tempTarget.z, lerpSpeed, delta);
    }

    if (cameraRef.current) {
      cameraRef.current.position.copy(_dampedPos);
      cameraRef.current.lookAt(_dampedTarget);
    }
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={48}
        near={0.1}
        far={120}
        position={STATIONS[0].cameraPos}
      />

      {isOrbitMode && (
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          minDistance={1.5}
          maxDistance={22}
          minPolarAngle={0.15}
          maxPolarAngle={Math.PI / 2 + 0.05}
          target={STATIONS[stationStore.state.activeStationIndex].lookAtTarget}
        />
      )}
    </>
  );
}
