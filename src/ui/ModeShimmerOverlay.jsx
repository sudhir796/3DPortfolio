import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModeShimmerOverlay({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9500,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse at center, rgba(94, 230, 255, 0.28) 0%, rgba(255, 179, 71, 0.12) 45%, transparent 75%)',
            mixBlendMode: 'screen',
          }}
        />
      )}
    </AnimatePresence>
  );
}

