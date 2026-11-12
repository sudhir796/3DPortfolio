import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { GUILD_LAYOUT } from '../data/layout';
import { STATIONS } from '../data/stations';
import { stationStore } from '../hooks/useStationProgress';

/**
 * DebugTourView: Dev-only diagnostic overlay (toggled with 'G').
 * - Renders 3D markers for all stations (camera pose & lookAt target)
 * - Renders line-of-sight rays and axes helpers at target objects
 * - Performs THREE.Frustum bounding-box checks and logs full diagnostic data to the console
 */
export default function DebugTourView({ enabled = false }) {
  const { activeStationIndex } = stationStore.state;

  // Run comprehensive console diagnostic whenever debug view is toggled
  useEffect(() => {
    if (!enabled) return;

    const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 120);
    const diagnosticData = [];

    STATIONS.forEach((station) => {
      const layout = GUILD_LAYOUT[station.layoutKey];
      if (!layout) return;

      const camPos = new THREE.Vector3(...station.cameraPos);
      const target = new THREE.Vector3(...station.lookAtTarget);

      camera.position.copy(camPos);
      camera.lookAt(target);
      camera.updateMatrixWorld(true);
      camera.updateProjectionMatrix();

      const projScreenMatrix = new THREE.Matrix4();
      projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);

      const frustum = new THREE.Frustum();
      frustum.setFromProjectionMatrix(projScreenMatrix);

      const box = new THREE.Box3(layout.boundingBox.min, layout.boundingBox.max);
      const inFrustum = frustum.intersectsBox(box);
      const distanceToTarget = camPos.distanceTo(target);

      diagnosticData.push({
        'Station ID': station.id,
        'Station Name': station.label,
        'Camera Pose': `[${station.cameraPos.map((n) => n.toFixed(2)).join(', ')}]`,
        'LookAt Target': `[${station.lookAtTarget.map((n) => n.toFixed(2)).join(', ')}]`,
        'Object World Pos': `[${layout.position.map((n) => n.toFixed(2)).join(', ')}]`,
        'Distance (m)': `${distanceToTarget.toFixed(2)}m`,
        'In Frustum': inFrustum ? '✓ YES' : '✗ NO',
        'Panel Side': station.panelSide,
      });
    });

    console.group('%c⚔ [GUIDED TOUR CAMERA DIAGNOSTIC] ⚔', 'color: #ffb347; font-weight: bold; font-size: 13px;');
    console.table(diagnosticData);
    console.log('%cPress "G" again to hide tour debug view. Press "O" to toggle free Orbit mode.', 'color: #5ee6ff;');
    console.groupEnd();
  }, [enabled]);

  // Construct line segments connecting each camera to its target
  const lineGeometries = useMemo(() => {
    return STATIONS.map((station) => {
      const pts = [
        new THREE.Vector3(...station.cameraPos),
        new THREE.Vector3(...station.lookAtTarget),
      ];
      return new THREE.BufferGeometry().setFromPoints(pts);
    });
  }, []);

  if (!enabled) return null;

  return (
    <group name="Tour_Debug_Gizmos">
      {/* Station Camera & Target Visual Markers */}
      {STATIONS.map((station, idx) => {
        const isActive = activeStationIndex === idx;
        const camPos = station.cameraPos;
        const targetPos = station.lookAtTarget;

        return (
          <group key={`debug-station-${station.id}`}>
            {/* Camera Pose Marker (Amber sphere) */}
            <mesh position={camPos}>
              <sphereGeometry args={[isActive ? 0.18 : 0.12, 12, 12]} />
              <meshBasicMaterial color={isActive ? '#ffea00' : '#ffb347'} wireframe={!isActive} />
            </mesh>

            {/* LookAt Target Marker (Cyan sphere) */}
            <mesh position={targetPos}>
              <sphereGeometry args={[isActive ? 0.16 : 0.1, 12, 12]} />
              <meshBasicMaterial color={isActive ? '#00e5ff' : '#5ee6ff'} />
            </mesh>

            {/* Connecting Sight Line */}
            <primitive
              object={
                new THREE.Line(
                  lineGeometries[idx],
                  new THREE.LineBasicMaterial({
                    color: isActive ? '#00e5ff' : '#888888',
                    linewidth: isActive ? 2 : 1,
                    transparent: true,
                    opacity: isActive ? 0.9 : 0.4,
                  })
                )
              }
            />
          </group>
        );
      })}

      {/* World Coordinate Axes at Each Object Position */}
      {Object.values(GUILD_LAYOUT).map((layout) => (
        <group key={`axes-${layout.id}`} position={layout.position}>
          <axesHelper args={[1.5]} />
        </group>
      ))}
    </group>
  );
}

