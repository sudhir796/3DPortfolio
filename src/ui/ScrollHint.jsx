import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStationProgress } from '../hooks/useStationProgress';

/**
 * ScrollHint: Subtle animated prompt encouraging user to scroll into the guild hall.
 * Disappears smoothly once the user begins scrolling.
 */
export default function ScrollHint() {
  const { hasScrolled } = useStationProgress();

  return (
    <AnimatePresence>
      {!hasScrolled && (
        <motion.div
          key="scroll-hint-prompt"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.8 }}
          style={{
            position: 'fixed',
            bottom: 36,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 90,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {/* Scroll mouse pill indicator */}
          <div
            style={{
              width: 22,
              height: 36,
              borderRadius: 12,
              border: '2px solid rgba(255, 179, 71, 0.7)',
              boxShadow: '0 0 12px rgba(255, 179, 71, 0.3)',
              backgroundColor: 'rgba(20, 16, 25, 0.6)',
              display: 'flex',
              justifyContent: 'center',
              paddingTop: 6,
            }}
          >
            {/* Animated wheel dot */}
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              style={{
                width: 4,
                height: 7,
                borderRadius: 2,
                backgroundColor: '#ffb347',
              }}
            />
          </div>

          {/* Text Prompt */}
          <span
            style={{
              fontFamily: '"Cinzel", "Georgia", serif',
              fontSize: '0.8rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#ebdcb9',
              textShadow: '0 2px 8px rgba(0,0,0,0.9)',
            }}
          >
            Scroll to Explore
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
