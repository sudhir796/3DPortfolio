import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Stats, PerformanceMonitor } from '@react-three/drei';

import GuildHall from './GuildHall';
import CameraRig from './CameraRig';
import LoadingScreen from '../ui/LoadingScreen';
import StationPanel from '../ui/StationPanel';
import DotNav from '../ui/DotNav';
import ScrollHint from '../ui/ScrollHint';
import QuestScroll from '../ui/QuestScroll';
import A11yOutline from '../ui/A11yOutline';
import DebugTourView from './DebugTourView';
import MagicCursor from '../ui/MagicCursor';
import IntroCinematic from '../ui/IntroCinematic';
import ModeShimmerOverlay from '../ui/ModeShimmerOverlay';
import { useQuality } from '../hooks/useQuality';
import { guildAudio } from '../audio/synth';

export default function ThreeGuildExperience({ onSwitchTo2D, onContextLost }) {
  const [isOrbitMode, setIsOrbitMode] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showDebugTour, setShowDebugTour] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isShimmering, setIsShimmering] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const { tierId, config, isAuto, setAutoTier } = useQuality();
  const lowTierTimerRef = useRef(null);

  // 1. Pause render loop when browser tab is inactive/hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabHidden(document.visibilityState === 'hidden');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // 2. Throttled window resize detector: temporarily lower DPR during rapid resizing
  useEffect(() => {
    let resizeTimer = null;
    const handleResize = () => {
      setIsResizing(true);
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setIsResizing(false);
      }, 250);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, []);

  // 3. Fallback trigger: if adaptive quality stays on 'low' tier for 10+ seconds, offer/trigger 2D fallback
  useEffect(() => {
    if (tierId === 'low') {
      lowTierTimerRef.current = setTimeout(() => {
        console.warn('Low tier sustained for 10s. Suggesting high-speed 2D fallback.');
        if (onSwitchTo2D) {
          onSwitchTo2D('Performance: Sustained low framerate in 3D mode.');
        }
      }, 10000);
    } else {
      if (lowTierTimerRef.current) clearTimeout(lowTierTimerRef.current);
    }
    return () => {
      if (lowTierTimerRef.current) clearTimeout(lowTierTimerRef.current);
    };
  }, [tierId, onSwitchTo2D]);

  const toggleOrbitMode = () => {
    setIsOrbitMode((prev) => {
      const next = !prev;
      guildAudio.playModeSwitch();
      setIsShimmering(true);
      setTimeout(() => setIsShimmering(false), 450);
      return next;
    });
  };

  // Keyboard shortcut listener for 'P' (Stats), 'G' (Debug Tour), 'O' (Orbit)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'p' || e.key === 'P') {
        setShowStats((prev) => !prev);
      } else if (e.key === 'g' || e.key === 'G') {
        setShowDebugTour((prev) => !prev);
      } else if (e.key === 'o' || e.key === 'O') {
        toggleOrbitMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Active DPR: drop to 1 during window resizing to preserve smoothness
  const activeDpr = isResizing ? [1, 1] : config.dpr;

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#120d14',
      }}
    >
      {/* Magic Cursor with 10-node neural trail */}
      <MagicCursor />

      {/* Mode Switch Magic Shimmer */}
      <ModeShimmerOverlay active={isShimmering} />

      {/* Intro Cinematic Overlay & Skip Manager */}
      <IntroCinematic isLoaded={isLoaded} />

      {/* Top Banner Button to Switch to 2D Mode */}
      <div
        style={{
          position: 'fixed',
          top: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
        }}
      >
        <button
          type="button"
          onClick={() => onSwitchTo2D && onSwitchTo2D('User selected 2D version.')}
          style={{
            padding: '6px 14px',
            borderRadius: '20px',
            backgroundColor: 'rgba(24, 18, 27, 0.85)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            color: '#ebdcb9',
            fontSize: '0.76rem',
            fontFamily: '"Cinzel", "Georgia", serif',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#d4af37';
            e.currentTarget.style.color = '#ffb347';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
            e.currentTarget.style.color = '#ebdcb9';
          }}
        >
          <span>📜</span>
          <span>View 2D Chronicle</span>
        </button>
      </div>

      {/* 2D Themed Loading Screen & Corner Controls */}
      <LoadingScreen
        isOrbitMode={isOrbitMode}
        onToggleOrbit={toggleOrbitMode}
        showStats={showStats}
        onToggleStats={() => setShowStats((prev) => !prev)}
        showDebugTour={showDebugTour}
        onToggleDebugTour={() => setShowDebugTour((prev) => !prev)}
        onLoaded={() => setIsLoaded(true)}
      />

      {/* Semantic outline for accessibility and SEO */}
      <A11yOutline />

      {/* HTML Overlay Panels & Controls (Phase 2 & 3) */}
      <StationPanel />
      <DotNav />
      <ScrollHint />
      <QuestScroll />

      {/* 3D Guild Hall Canvas with Adaptive Performance & Context Lost recovery */}
      <Canvas
        shadows={config.enableContactShadows}
        dpr={activeDpr}
        frameloop={isTabHidden ? 'never' : 'always'}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        onCreated={({ gl }) => {
          const dom = gl.domElement;
          dom.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            console.error('WebGL Context Lost.');
            if (onContextLost) onContextLost('WebGL context lost by graphics driver.');
          });
          dom.addEventListener('webglcontextrestored', () => {
            console.log('WebGL Context Restored.');
          });
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Adaptive Performance Monitor: auto-switches tiers on FPS drops */}
        {isAuto && (
          <PerformanceMonitor
            onDecline={() => {
              if (tierId === 'high') setAutoTier('medium');
              else if (tierId === 'medium') setAutoTier('low');
            }}
            onIncline={() => {
              if (tierId === 'low') setAutoTier('medium');
              else if (tierId === 'medium') setAutoTier('high');
            }}
          />
        )}

        <ScrollControls
          pages={5.5}
          damping={0.25}
          distance={1}
          infinite={false}
        >
          <CameraRig
            isOrbitMode={isOrbitMode}
            setIsOrbitMode={setIsOrbitMode}
          />
          <DebugTourView enabled={showDebugTour} />
          <Suspense fallback={null}>
            <GuildHall />
          </Suspense>
        </ScrollControls>

        {showStats && <Stats className="stats-panel" />}
      </Canvas>
    </div>
  );
}

