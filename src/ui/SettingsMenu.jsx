import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../hooks/useSettings';
import { useQuality } from '../hooks/useQuality';
import { guildAudio } from '../audio/synth';

export default function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, updateSettings] = useSettings();
  const { tierId, isAuto } = useQuality();
  const modalRef = useRef(null);
  const triggerRef = useRef(null);

  // Keyboard accessibility: Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const toggleModal = () => {
    guildAudio.playClick();
    setIsOpen((prev) => !prev);
  };

  const handleTierChange = (tier) => {
    guildAudio.playClick();
    updateSettings({ tierPreference: tier });
  };

  return (
    <>
      {/* Gear Icon Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleModal}
        aria-label="Open Guild Configuration Settings"
        aria-expanded={isOpen}
        title="Settings & Quality Tiers"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: '6px',
          backgroundColor: isOpen ? 'rgba(94, 230, 255, 0.2)' : 'rgba(30, 22, 33, 0.85)',
          border: `1px solid ${isOpen ? 'rgba(94, 230, 255, 0.65)' : 'rgba(212, 175, 55, 0.35)'}`,
          color: isOpen ? '#5ee6ff' : '#f6eedb',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          transition: 'all 0.2s ease',
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      {/* Settings Modal */}
      <AnimatePresence>
        {isOpen && (
          <div
            role="presentation"
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1100,
              backgroundColor: 'rgba(10, 7, 12, 0.72)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="guild-settings-title"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 14 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: '100%',
                maxWidth: '460px',
                backgroundColor: 'rgba(24, 18, 27, 0.95)',
                border: '1.5px solid rgba(212, 175, 55, 0.55)',
                borderRadius: '12px',
                padding: '24px 28px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 25px rgba(255, 179, 71, 0.15)',
                color: '#f6eedb',
                fontFamily: '"Cinzel", "Georgia", serif',
                position: 'relative',
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
                  paddingBottom: '12px',
                }}
              >
                <div>
                  <h2
                    id="guild-settings-title"
                    style={{
                      margin: 0,
                      fontSize: '1.25rem',
                      color: '#f6eedb',
                      letterSpacing: '0.08em',
                    }}
                  >
                    Guild Settings
                  </h2>
                  <span style={{ fontSize: '0.78rem', color: '#ffb347', fontFamily: 'sans-serif' }}>
                    Visual fidelity & accessibility preferences
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close settings dialog"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#c2b69d',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    padding: '4px 8px',
                    borderRadius: '4px',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Quality Tiers */}
              <div style={{ marginBottom: '22px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#d4af37',
                    marginBottom: '8px',
                    letterSpacing: '0.06em',
                  }}
                >
                  RENDERING FIDELITY {isAuto && `(Auto-tuned: ${tierId.toUpperCase()})`}
                </label>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '6px',
                  }}
                >
                  {[
                    { id: 'auto', label: 'Auto' },
                    { id: 'high', label: 'High' },
                    { id: 'medium', label: 'Med' },
                    { id: 'low', label: 'Low' },
                  ].map((tier) => {
                    const isSelected = settings.tierPreference === tier.id;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => handleTierChange(tier.id)}
                        style={{
                          padding: '8px 4px',
                          borderRadius: '6px',
                          backgroundColor: isSelected ? 'rgba(94, 230, 255, 0.2)' : 'rgba(40, 30, 45, 0.5)',
                          border: `1px solid ${isSelected ? '#5ee6ff' : 'rgba(212, 175, 55, 0.25)'}`,
                          color: isSelected ? '#5ee6ff' : '#f6eedb',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {tier.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggles List */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontSize: '0.88rem',
                }}
              >
                {/* Magic Cursor Trail */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 500, color: '#f6eedb' }}>Magic Cursor & Neural Trail</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#a09485' }}>
                      Glowing teal orb and trailing particle nodes
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.cursorTrailEnabled}
                    onChange={(e) => {
                      guildAudio.playClick();
                      updateSettings({ cursorTrailEnabled: e.target.checked });
                    }}
                    style={{ width: '18px', height: '18px', accentColor: '#5ee6ff', cursor: 'pointer' }}
                  />
                </label>

                {/* Sound Synth */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 500, color: '#f6eedb' }}>Procedural Audio Synth</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#a09485' }}>
                      Fireplace crackle, room drone & UI chimes
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => {
                      guildAudio.playClick();
                      updateSettings({ soundEnabled: e.target.checked });
                    }}
                    style={{ width: '18px', height: '18px', accentColor: '#5ee6ff', cursor: 'pointer' }}
                  />
                </label>

                {/* Head Bob / Idle Sway */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 500, color: '#f6eedb' }}>Handheld Camera Sway</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#a09485' }}>
                      Subtle organic drift and mouse parallax
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.headBobEnabled}
                    onChange={(e) => {
                      guildAudio.playClick();
                      updateSettings({ headBobEnabled: e.target.checked });
                    }}
                    style={{ width: '18px', height: '18px', accentColor: '#5ee6ff', cursor: 'pointer' }}
                  />
                </label>

                {/* Reduced Motion */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 500, color: '#f6eedb' }}>Reduced Motion</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#a09485' }}>
                      Disables cinematics, trails, and heavy camera lerping
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.reducedMotion}
                    onChange={(e) => {
                      guildAudio.playClick();
                      updateSettings({ reducedMotion: e.target.checked });
                    }}
                    style={{ width: '18px', height: '18px', accentColor: '#5ee6ff', cursor: 'pointer' }}
                  />
                </label>
              </div>

              {/* Close Button Footer */}
              <div style={{ marginTop: '22px', textAlign: 'right' }}>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(168, 35, 40, 0.8)',
                    border: '1px solid rgba(212, 175, 55, 0.5)',
                    color: '#f6eedb',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: '"Cinzel", "Georgia", serif',
                  }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

