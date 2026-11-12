import React, { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import SoundToggle from './SoundToggle';
import SettingsMenu from './SettingsMenu';

const GUILD_LOADING_TIPS = [
  'Polishing the quest notice board...',
  'Lighting the hanging amber lanterns...',
  'Calibrating the arcane appraisal dais...',
  'Tuning the hearth flames & ale tankards...',
  'Inscribing adventurer rank certificates...',
  'Opening the guild hall entrance gates...',
];

const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ'];

/**
 * LoadingScreen: Anime-fantasy loading overlay with SVG magic circle draw-in,
 * rotating runes, cycling guild loading messages, and seamless fade to the Intro Cinematic.
 */
export default function LoadingScreen({
  isOrbitMode,
  onToggleOrbit,
  showStats,
  onToggleStats,
  showDebugTour,
  onToggleDebugTour,
  onLoaded,
}) {
  const { progress, active } = useProgress();
  const [isLoaded, setIsLoaded] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  // Cycle tips every 1.5s
  useEffect(() => {
    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % GUILD_LOADING_TIPS.length);
    }, 1500);
    return () => clearInterval(tipTimer);
  }, []);

  useEffect(() => {
    if (progress >= 100 || !active) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
        if (onLoaded) onLoaded();
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [progress, active, onLoaded]);

  return (
    <>
      {/* ---------------- LOADING OVERLAY ---------------- */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="guild-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#120d14',
              color: '#f6eedb',
              fontFamily: '"Cinzel", "Georgia", serif',
              userSelect: 'none',
            }}
          >
            {/* Ambient Background Aura */}
            <div
              style={{
                position: 'absolute',
                width: 380,
                height: 380,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(94, 230, 255, 0.16) 0%, rgba(255, 179, 71, 0.08) 50%, transparent 70%)',
                filter: 'blur(35px)',
                pointerEvents: 'none',
              }}
            />

            {/* Glowing SVG Magic Circle Spinner Drawing Itself In */}
            <div
              style={{
                position: 'relative',
                width: 140,
                height: 140,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 28,
              }}
            >
              {/* Outer SVG Ring Drawing Path */}
              <svg
                width="140"
                height="140"
                viewBox="0 0 140 140"
                style={{ position: 'absolute', inset: 0 }}
              >
                <motion.circle
                  cx="70"
                  cy="70"
                  r="62"
                  fill="none"
                  stroke="rgba(94, 230, 255, 0.2)"
                  strokeWidth="2"
                />
                <motion.circle
                  cx="70"
                  cy="70"
                  r="62"
                  fill="none"
                  stroke="#5ee6ff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="390"
                  initial={{ strokeDashoffset: 390 }}
                  animate={{ strokeDashoffset: 390 - (390 * Math.max(15, progress)) / 100 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  style={{
                    filter: 'drop-shadow(0 0 8px #5ee6ff)',
                    transformOrigin: '70px 70px',
                    transform: 'rotate(-90deg)',
                  }}
                />
                <motion.circle
                  cx="70"
                  cy="70"
                  r="48"
                  fill="none"
                  stroke="rgba(255, 179, 71, 0.4)"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
                  style={{ transformOrigin: '70px 70px' }}
                />
              </svg>

              {/* Rotating Rune Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  width: 104,
                  height: 104,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {RUNES.map((rune, idx) => {
                  const angle = (idx / RUNES.length) * Math.PI * 2;
                  const rx = Math.cos(angle) * 44;
                  const ry = Math.sin(angle) * 44;
                  return (
                    <span
                      key={`rune-${idx}`}
                      style={{
                        position: 'absolute',
                        left: `calc(50% + ${rx}px - 6px)`,
                        top: `calc(50% + ${ry}px - 8px)`,
                        fontSize: '0.85rem',
                        color: idx % 2 === 0 ? '#5ee6ff' : '#ffb347',
                        textShadow: '0 0 6px currentColor',
                        transform: `rotate(${angle + Math.PI / 2}rad)`,
                        opacity: 0.85,
                      }}
                    >
                      {rune}
                    </span>
                  );
                })}
              </motion.div>

              {/* Center Core Floating Gem */}
              <motion.div
                animate={{ rotate: [45, 225, 405], scale: [0.9, 1.15, 0.9] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                style={{
                  width: 14,
                  height: 14,
                  backgroundColor: '#ffb347',
                  boxShadow: '0 0 16px #ffb347, 0 0 30px #5ee6ff',
                  borderRadius: 2,
                }}
              />
            </div>

            {/* Title Header */}
            <motion.div
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              style={{
                letterSpacing: '0.22em',
                fontSize: '1.2rem',
                textTransform: 'uppercase',
                color: '#ebdcb9',
                marginBottom: 10,
                textShadow: '0 2px 10px rgba(0,0,0,0.85)',
              }}
            >
              Adventurers' Guild
            </motion.div>

            {/* Rotating Guild Loading Tips */}
            <div style={{ height: 24, marginBottom: 20, overflow: 'hidden' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`tip-${tipIndex}`}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    fontSize: '0.82rem',
                    letterSpacing: '0.08em',
                    color: '#ffb347',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    textAlign: 'center',
                  }}
                >
                  {GUILD_LOADING_TIPS[tipIndex]}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress Bar Container */}
            <div
              style={{
                width: 260,
                height: 5,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.6)',
              }}
            >
              <motion.div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #5ee6ff, #ffb347)',
                  boxShadow: '0 0 12px #5ee6ff',
                  borderRadius: 4,
                }}
                animate={{ width: `${Math.max(8, Math.min(100, progress))}%` }}
                transition={{ ease: 'easeOut', duration: 0.25 }}
              />
            </div>

            {/* Percentage Display */}
            <div
              style={{
                marginTop: 10,
                fontSize: '0.78rem',
                color: '#8a8275',
                fontFamily: 'monospace',
                letterSpacing: '0.08em',
              }}
            >
              {Math.round(progress)}%
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- TOP LEFT GUILD BRANDING ---------------- */}
      <div
        style={{
          position: 'fixed',
          top: 24,
          left: 28,
          zIndex: 100,
          pointerEvents: 'none',
          userSelect: 'none',
          fontFamily: '"Cinzel", "Georgia", serif',
        }}
      >
        <div
          style={{
            fontSize: '1.2rem',
            letterSpacing: '0.18em',
            color: '#f6eedb',
            textTransform: 'uppercase',
            fontWeight: 700,
            textShadow: '0 2px 10px rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ color: '#d4af37' }}>⚔</span>
          <span>Adventurers' Guild</span>
        </div>
        <div
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            color: '#ffb347',
            marginTop: 3,
            textShadow: '0 1px 6px rgba(0,0,0,0.9)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          Interactive 3D Portfolio
        </div>
      </div>

      {/* ---------------- TOP RIGHT SETTINGS & SOUND CONTROLS ---------------- */}
      <div
        style={{
          position: 'fixed',
          top: 24,
          right: 28,
          zIndex: 100,
          display: 'flex',
          gap: 10,
          alignItems: 'center',
        }}
      >
        <SoundToggle />
        <SettingsMenu />
      </div>

      {/* ---------------- BOTTOM RIGHT DEV / INSPECT CONTROLS ---------------- */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 28,
          zIndex: 100,
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '0.75rem',
          userSelect: 'none',
        }}
      >
        <button
          type="button"
          onClick={onToggleDebugTour}
          title="Toggle Guided Tour 3D frustum & station line-of-sight diagnostic (Key: G)"
          style={{
            background: showDebugTour ? 'rgba(0, 229, 255, 0.25)' : 'rgba(20, 16, 22, 0.75)',
            border: showDebugTour ? '1px solid #00e5ff' : '1px solid rgba(255,255,255,0.15)',
            color: showDebugTour ? '#00e5ff' : '#ebdcb9',
            padding: '6px 12px',
            borderRadius: 6,
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <kbd
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              padding: '1px 5px',
              borderRadius: 3,
              fontSize: '0.7rem',
            }}
          >
            G
          </kbd>
          <span>Tour Debug: {showDebugTour ? 'ON' : 'OFF'}</span>
        </button>

        <button
          type="button"
          onClick={onToggleOrbit}
          title="Toggle 3D Orbit Controls inspection mode (Key: O)"
          style={{
            background: isOrbitMode ? 'rgba(94, 230, 255, 0.25)' : 'rgba(20, 16, 22, 0.75)',
            border: isOrbitMode ? '1px solid #5ee6ff' : '1px solid rgba(255,255,255,0.15)',
            color: isOrbitMode ? '#5ee6ff' : '#ebdcb9',
            padding: '6px 12px',
            borderRadius: 6,
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <kbd
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              padding: '1px 5px',
              borderRadius: 3,
              fontSize: '0.7rem',
            }}
          >
            O
          </kbd>
          <span>Orbit Mode: {isOrbitMode ? 'ON' : 'OFF'}</span>
        </button>

        <button
          type="button"
          onClick={onToggleStats}
          title="Toggle FPS/Memory statistics panel (Key: P)"
          style={{
            background: showStats ? 'rgba(255, 179, 71, 0.25)' : 'rgba(20, 16, 22, 0.75)',
            border: showStats ? '1px solid #ffb347' : '1px solid rgba(255,255,255,0.15)',
            color: showStats ? '#ffb347' : '#ebdcb9',
            padding: '6px 12px',
            borderRadius: 6,
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <kbd
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              padding: '1px 5px',
              borderRadius: 3,
              fontSize: '0.7rem',
            }}
          >
            P
          </kbd>
          <span>Stats: {showStats ? 'ON' : 'OFF'}</span>
        </button>
      </div>
    </>
  );
}
