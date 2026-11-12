import React, { Suspense, lazy } from 'react';
import Guild2DExperience from './ui/Guild2DExperience';
import ThreeErrorBoundary from './ui/ThreeErrorBoundary';
import LoadingScreen from './ui/LoadingScreen';
import { useGuildMode } from './hooks/useGuildMode';

// Code-split 3D bundle: three.js, R3F, drei & postprocessing are only downloaded in 3D mode!
const ThreeGuildExperience = lazy(() => import('./scene/ThreeGuildExperience'));

export default function App() {
  const { mode, setMode, reason, triggerFallback } = useGuildMode();

  if (mode === '2d') {
    return (
      <Guild2DExperience
        onEnter3D={() => setMode('3d', true)}
        fallbackReason={reason}
      />
    );
  }

  return (
    <ThreeErrorBoundary
      onCrash={(err) => triggerFallback(`3D renderer error: ${err}`)}
      onFallback={() => triggerFallback('3D scene fell back to 2D.')}
    >
      <Suspense fallback={<LoadingScreen />}>
        <ThreeGuildExperience
          onSwitchTo2D={(r) => setMode('2d', true)}
          onContextLost={(r) => triggerFallback(r)}
        />
      </Suspense>
    </ThreeErrorBoundary>
  );
}
