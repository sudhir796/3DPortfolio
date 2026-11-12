import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RANK_CONFIG, isTODO } from '../data/content';
import { usePortfolioInteraction } from '../hooks/usePortfolioInteraction';
import { usePrefersReducedMotion } from '../hooks/useStationProgress';
import { guildAudio } from '../audio/synth';

export default function QuestScroll() {
  const { selectedQuest, setSelectedQuestId, nextQuest, prevQuest, filteredQuests } =
    usePortfolioInteraction();
  const prefersReducedMotion = usePrefersReducedMotion();
  const modalRef = useRef(null);
  const previouslyFocusedElement = useRef(null);

  // Keyboard navigation & focus trap
  useEffect(() => {
    if (!selectedQuest) return;

    guildAudio.playScrollOpen();
    previouslyFocusedElement.current = document.activeElement;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        guildAudio.playScrollClose();
        setSelectedQuestId(null);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        guildAudio.playClick();
        nextQuest();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        guildAudio.playClick();
        prevQuest();
      } else if (e.key === 'Tab') {
        // Focus trap
        if (!modalRef.current) return;
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Initial focus on close button or modal container
    const timer = setTimeout(() => {
      const closeBtn = modalRef.current?.querySelector('button[aria-label="Close quest scroll"]');
      closeBtn?.focus();
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
      if (previouslyFocusedElement.current?.focus) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [selectedQuest, setSelectedQuestId, nextQuest, prevQuest]);

  if (!selectedQuest) return null;

  const rankInfo = RANK_CONFIG[selectedQuest.rank] || RANK_CONFIG.C;
  const isCompleted = selectedQuest.status.toLowerCase().includes('completed');
  const currentIndex = filteredQuests.findIndex((q) => q.id === selectedQuest.id);
  const totalCount = filteredQuests.length;

  const hasGithub = !isTODO(selectedQuest.links?.github);
  const hasDemo = !isTODO(selectedQuest.links?.demo);

  return (
    <AnimatePresence>
      <div
        role="presentation"
        onClick={() => setSelectedQuestId(null)}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          backgroundColor: 'rgba(10, 7, 12, 0.78)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="quest-modal-title"
          onClick={(e) => e.stopPropagation()}
          initial={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.2, rotateX: 60, y: 140, filter: 'blur(8px)' }
          }
          animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0, filter: 'blur(0px)' }}
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.25, rotateX: -45, y: 80, filter: 'blur(6px)' }
          }
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'relative',
            transformOrigin: '50% 20%',
            perspective: '1200px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '88vh',
            overflowY: 'auto',
            backgroundColor: '#1c141d',
            backgroundImage:
              'radial-gradient(ellipse at top, rgba(255, 179, 71, 0.08) 0%, transparent 60%)',
            border: '2px solid rgba(212, 175, 55, 0.55)',
            borderRadius: '14px',
            padding: '32px 36px',
            boxShadow:
              '0 24px 60px rgba(0, 0, 0, 0.85), 0 0 30px rgba(212, 175, 55, 0.2)',
            color: '#f6eedb',
          }}
        >
          {/* Top Guild Seal Header */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, #d4af37 0%, ${rankInfo.color} 50%, #d4af37 100%)`,
              borderRadius: '14px 14px 0 0',
            }}
          />

          {/* Close Button */}
          <button
            type="button"
            aria-label="Close quest scroll"
            onClick={() => {
              guildAudio.playScrollClose();
              setSelectedQuestId(null);
            }}
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              backgroundColor: 'rgba(20, 16, 25, 0.75)',
              color: '#f6eedb',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            ✕
          </button>

          {/* Quest Badges Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px',
              flexWrap: 'wrap',
            }}
          >
            {/* Rank Badge */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '6px',
                backgroundColor: rankInfo.bg,
                border: `1px solid ${rankInfo.border}`,
                color: rankInfo.color,
                fontWeight: 700,
                fontSize: '0.8rem',
                letterSpacing: '0.08em',
                fontFamily: '"Cinzel", "Georgia", serif',
                boxShadow: `0 0 10px ${rankInfo.glow}`,
              }}
            >
              <span>⚔</span>
              <span>RANK {selectedQuest.rank}</span>
            </span>

            {/* Status Badge */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '6px',
                backgroundColor: isCompleted
                  ? 'rgba(46, 204, 113, 0.15)'
                  : 'rgba(255, 179, 71, 0.15)',
                border: isCompleted
                  ? '1px solid rgba(46, 204, 113, 0.5)'
                  : '1px solid rgba(255, 179, 71, 0.5)',
                color: isCompleted ? '#4cd97b' : '#ffb347',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: isCompleted ? '#4cd97b' : '#ffb347',
                }}
              />
              <span>
                {selectedQuest.status}
                {selectedQuest.statusNote ? ` (${selectedQuest.statusNote})` : ''}
              </span>
            </span>

            {/* Track Tag(s) */}
            {selectedQuest.track.map((tr) => (
              <span
                key={tr}
                style={{
                  padding: '3px 9px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ebdcb9',
                  fontSize: '0.72rem',
                  fontFamily: 'monospace',
                }}
              >
                {tr === 'AIML' ? 'AI / ML' : 'Full-Stack'}
              </span>
            ))}
          </div>

          {/* Title */}
          <h2
            id="quest-modal-title"
            style={{
              fontSize: '1.75rem',
              fontFamily: '"Cinzel", "Georgia", serif',
              color: '#f6eedb',
              fontWeight: 700,
              letterSpacing: '0.04em',
              margin: '0 0 16px 0',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            }}
          >
            {selectedQuest.title}
          </h2>

          {/* Quest Summary / Bounty Brief */}
          <div
            style={{
              backgroundColor: 'rgba(10, 7, 12, 0.45)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '8px',
              padding: '16px 20px',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#d4af37',
                marginBottom: '6px',
                fontFamily: '"Cinzel", "Georgia", serif',
              }}
            >
              📜 Quest Objective & Brief
            </div>
            <p
              style={{
                margin: 0,
                fontSize: '0.94rem',
                lineHeight: 1.65,
                color: '#ebdcb9',
              }}
            >
              {selectedQuest.summary}
            </p>
          </div>

          {/* Highlights (if any) */}
          {selectedQuest.highlights && selectedQuest.highlights.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  fontSize: '0.72rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#5ee6ff',
                  marginBottom: '10px',
                  fontFamily: '"Cinzel", "Georgia", serif',
                }}
              >
                ✦ Key Architectural Highlights
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                {selectedQuest.highlights.map((h, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: '0.88rem',
                      lineHeight: 1.5,
                      color: '#d9c49a',
                    }}
                  >
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack Runes */}
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#ffb347',
                marginBottom: '10px',
                fontFamily: '"Cinzel", "Georgia", serif',
              }}
            >
              🛡 Mastered Tools & Technologies
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {selectedQuest.tech.map((t) => (
                <span
                  key={t}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '5px',
                    backgroundColor: 'rgba(255, 179, 71, 0.1)',
                    border: '1px solid rgba(255, 179, 71, 0.3)',
                    color: '#ffb347',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Actions & Links */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '18px',
              borderTop: '1px solid rgba(212, 175, 55, 0.25)',
              flexWrap: 'wrap',
              gap: '14px',
            }}
          >
            {/* External Links (hidden if empty) */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {hasGithub && (
                <a
                  href={selectedQuest.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(94, 230, 255, 0.15)',
                    border: '1px solid #5ee6ff',
                    color: '#5ee6ff',
                    textDecoration: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>Repository ↗</span>
                </a>
              )}
              {hasDemo && (
                <a
                  href={selectedQuest.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(212, 175, 55, 0.2)',
                    border: '1px solid #d4af37',
                    color: '#f6eedb',
                    textDecoration: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>Live Demo ↗</span>
                </a>
              )}
            </div>

            {/* Pagination Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  fontSize: '0.78rem',
                  color: '#8a8275',
                  fontFamily: 'monospace',
                }}
              >
                {currentIndex + 1} of {totalCount}
              </span>
              <button
                type="button"
                onClick={prevQuest}
                aria-label="Previous quest"
                style={{
                  padding: '6px 12px',
                  borderRadius: '5px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#f6eedb',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
                ← Prev
              </button>
              <button
                type="button"
                onClick={nextQuest}
                aria-label="Next quest"
                style={{
                  padding: '6px 12px',
                  borderRadius: '5px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#f6eedb',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
                Next →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

