import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStationProgress, usePrefersReducedMotion } from '../hooks/useStationProgress';

/**
 * DotNav: Vertical 5-station journey progress indicator on the right viewport edge.
 * Shows active lantern amber glow and interactive hover labels.
 */
export default function DotNav() {
  const { stations, activeStationIndex, scrollToStation } = useStationProgress();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <nav
      className="dot-nav-wrapper"
      aria-label="Guild Hall Stations Navigation"
      style={{
        position: 'fixed',
        right: 24,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 95,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        alignItems: 'flex-end',
      }}
    >
      {stations.map((station, index) => {
        const isActive = activeStationIndex === index;
        const isHovered = hoveredIndex === index;

        return (
          <div
            key={station.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => scrollToStation(index, !prefersReducedMotion)}
          >
            {/* Station Tooltip / Hover Label */}
            {(isHovered || isActive) && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
                style={{
                  padding: '4px 10px',
                  borderRadius: 4,
                  backgroundColor: isActive ? 'rgba(255, 179, 71, 0.2)' : 'rgba(20, 16, 25, 0.85)',
                  border: isActive ? '1px solid #ffb347' : '1px solid rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(8px)',
                  color: isActive ? '#ffb347' : '#ebdcb9',
                  fontSize: '0.75rem',
                  fontFamily: '"Cinzel", "Georgia", serif',
                  letterSpacing: '0.08em',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 0 12px rgba(255, 179, 71, 0.3)' : '0 2px 8px rgba(0,0,0,0.5)',
                  pointerEvents: 'none',
                }}
              >
                {station.label}
              </motion.div>
            )}

            {/* Dot Node Button */}
            <button
              type="button"
              aria-label={`Go to ${station.label}`}
              aria-current={isActive ? 'step' : undefined}
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                padding: 0,
                border: isActive
                  ? '2px solid #ffb347'
                  : isHovered
                  ? '1.5px solid #5ee6ff'
                  : '1.5px solid rgba(255, 255, 255, 0.3)',
                backgroundColor: isActive
                  ? '#ffb347'
                  : isHovered
                  ? '#5ee6ff'
                  : 'rgba(20, 16, 25, 0.6)',
                boxShadow: isActive
                  ? '0 0 10px #ffb347, 0 0 20px rgba(255, 179, 71, 0.6)'
                  : isHovered
                  ? '0 0 8px #5ee6ff'
                  : 'none',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                position: 'relative',
              }}
            >
              {/* Outer pulsing ring for active dot */}
              {isActive && (
                <motion.span
                  animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    inset: -4,
                    borderRadius: '50%',
                    border: '1px solid #ffb347',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </button>
          </div>
        );
      })}
    </nav>
  );
}
