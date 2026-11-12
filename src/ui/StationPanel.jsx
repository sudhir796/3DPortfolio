import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStationProgress, usePrefersReducedMotion } from '../hooks/useStationProgress';
import { profile } from '../data/content';
import TrackFilter from './TrackFilter';
import SkillTree from './SkillTree';
import JourneyTimeline from './JourneyTimeline';
import ContactPanel from './ContactPanel';
import GuildCardOverlay from './GuildCardOverlay';
import { usePortfolioInteraction } from '../hooks/usePortfolioInteraction';
import { guildAudio } from '../audio/synth';

/**
 * StationPanel: Phase 3 Dynamic Content Overlay.
 * Renders real portfolio content according to the active station:
 * - Station 0: Entrance (Hero Profile)
 * - Station 1: Quest Board (Track Filter & Quest List)
 * - Station 2: Magic Circle (Skill Tree with crystal tab resonance)
 * - Station 3: Tavern (Chronicle Logbook Timeline)
 * - Station 4: Reception Desk (Guild Card & Contact Commissioning)
 */
export default function StationPanel() {
  const { activeStation, isDwelling, activeStationIndex } = useStationProgress();
  const { filteredQuests, setSelectedQuestId, selectedQuestId } = usePortfolioInteraction();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Play subtle quest log arrival sound when dwelling at a station
  useEffect(() => {
    if (isDwelling && activeStation) {
      guildAudio.playStationArrival();
    }
  }, [isDwelling, activeStation?.id]);

  if (!activeStation) return null;

  const isLeft = activeStation.panelSide === 'left';

  const containerStyle = {
    position: 'fixed',
    top: '50%',
    transform: 'translateY(-50%)',
    [isLeft ? 'left' : 'right']: '3.5%',
    zIndex: 90,
    pointerEvents: 'none',
    maxWidth: '480px',
    width: 'calc(100% - 32px)',
  };

  const slideDistance = prefersReducedMotion ? 0 : isLeft ? -24 : 24;
  const transitionConfig = prefersReducedMotion
    ? { duration: 0.2 }
    : { duration: 0.45, ease: [0.16, 1, 0.3, 1] };

  return (
    <div className="station-panel-wrapper" style={containerStyle}>
      <AnimatePresence mode="wait">
        {isDwelling && (
          <motion.div
            key={`station-${activeStation.id}`}
            className="station-panel-card"
            initial={{ opacity: 0, x: slideDistance, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: slideDistance * 0.7, scale: 0.98 }}
            transition={transitionConfig}
            style={{
              pointerEvents: 'auto',
              backgroundColor: 'rgba(22, 16, 25, 0.88)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '14px',
              padding: '24px 26px',
              boxShadow:
                '0 18px 45px rgba(0, 0, 0, 0.75), 0 0 24px rgba(255, 179, 71, 0.12)',
              position: 'relative',
              overflow: 'hidden',
              maxHeight: '82vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Corner Decorative Filigree */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 14,
                height: 14,
                borderTop: '2px solid #d4af37',
                borderLeft: '2px solid #d4af37',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 14,
                height: 14,
                borderTop: '2px solid #d4af37',
                borderRight: '2px solid #d4af37',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: 14,
                height: 14,
                borderBottom: '2px solid #d4af37',
                borderLeft: '2px solid #d4af37',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 14,
                height: 14,
                borderBottom: '2px solid #d4af37',
                borderRight: '2px solid #d4af37',
              }}
            />

            {/* Top Station Badge & Section Counter */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(168, 35, 40, 0.65)',
                  border: '1px solid rgba(212, 175, 55, 0.5)',
                  color: '#f6eedb',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontFamily: '"Cinzel", "Georgia", serif',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#ffb347',
                    boxShadow: '0 0 6px #ffb347',
                  }}
                />
                {activeStation.badge}
              </span>

              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#8a8275',
                  fontFamily: 'monospace',
                  letterSpacing: '0.1em',
                }}
              >
                0{activeStationIndex + 1} / 05
              </span>
            </div>

            {/* Header Titles with Quest Log Flourish */}
            <div style={{ marginBottom: '12px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
              <motion.div
                initial={prefersReducedMotion ? false : { x: '-100%', opacity: 0 }}
                animate={{ x: '100%', opacity: [0, 0.8, 0] }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '60%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 179, 71, 0.45), transparent)',
                  pointerEvents: 'none',
                  zIndex: 2,
                }}
              />
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontFamily: '"Cinzel", "Georgia", serif',
                  color: '#f6eedb',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  margin: '0 0 4px 0',
                  textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                }}
              >
                {activeStation.id === 'entrance' ? `Welcome, ${profile.name}` : activeStation.label}
              </h2>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: '#ffb347',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                {activeStation.category}
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                height: 1,
                background:
                  'linear-gradient(90deg, rgba(212,175,55,0.6) 0%, rgba(94,230,255,0.3) 50%, transparent 100%)',
                marginBottom: '14px',
                flexShrink: 0,
              }}
            />

            {/* Station-Specific Interactive Body */}
            <div style={{ overflowY: 'auto', paddingRight: '4px' }}>
              {/* STATION 0: ENTRANCE */}
              {activeStation.id === 'entrance' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.94rem',
                      lineHeight: 1.6,
                      color: '#ebdcb9',
                    }}
                  >
                    {profile.tagline}
                  </p>

                  <div
                    style={{
                      backgroundColor: 'rgba(10, 7, 12, 0.45)',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      borderRadius: '8px',
                      padding: '14px 16px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.68rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#d4af37',
                        marginBottom: '6px',
                        fontFamily: '"Cinzel", serif',
                      }}
                    >
                      Adventurer Classes
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      {profile.classes.map((cls) => (
                        <span
                          key={cls}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(94, 230, 255, 0.12)',
                            border: '1px solid rgba(94, 230, 255, 0.4)',
                            color: '#5ee6ff',
                            fontSize: '0.74rem',
                            fontFamily: 'monospace',
                          }}
                        >
                          {cls}
                        </span>
                      ))}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#8a8275' }}>
                      {profile.education}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#ffb347',
                      fontSize: '0.78rem',
                      fontFamily: '"Cinzel", serif',
                      letterSpacing: '0.08em',
                    }}
                  >
                    <span>✦</span>
                    <span>Scroll down or use the navigation dots to explore projects & abilities</span>
                  </div>
                </div>
              )}

              {/* STATION 1: QUEST BOARD */}
              {activeStation.id === 'quest-board' && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '0.82rem', color: '#ebdcb9', marginBottom: '12px' }}>
                    Select any pinned parchment note on the 3D board, or choose a quest below to view full architectural details:
                  </div>

                  <TrackFilter />

                  {/* Compact Clickable Quests Roster */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      maxHeight: '230px',
                      overflowY: 'auto',
                      paddingRight: '4px',
                    }}
                  >
                    {filteredQuests.map((q) => {
                      const isSelected = selectedQuestId === q.id;
                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => setSelectedQuestId(q.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            backgroundColor: isSelected
                              ? 'rgba(212, 175, 55, 0.25)'
                              : 'rgba(255, 255, 255, 0.04)',
                            border: isSelected
                              ? '1px solid #d4af37'
                              : '1px solid rgba(255, 255, 255, 0.08)',
                            color: '#f6eedb',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                padding: '1px 5px',
                                borderRadius: '3px',
                                backgroundColor:
                                  q.rank === 'A'
                                    ? 'rgba(255, 77, 79, 0.25)'
                                    : q.rank === 'B'
                                    ? 'rgba(94, 230, 255, 0.2)'
                                    : 'rgba(255, 179, 71, 0.2)',
                                color:
                                  q.rank === 'A'
                                    ? '#ff4d4f'
                                    : q.rank === 'B'
                                    ? '#5ee6ff'
                                    : '#ffb347',
                                fontWeight: 700,
                                fontFamily: 'monospace',
                              }}
                            >
                              {q.rank}
                            </span>
                            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{q.title}</span>
                          </div>
                          <span style={{ fontSize: '0.72rem', color: '#8a8275' }}>Inspect ↗</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STATION 2: MAGIC CIRCLE / ABILITIES */}
              {activeStation.id === 'magic-circle' && <SkillTree />}

              {/* STATION 3: TAVERN / JOURNEY */}
              {activeStation.id === 'tavern' && <JourneyTimeline />}

              {/* STATION 4: RECEPTION DESK / CONTACT */}
              {activeStation.id === 'reception' && (
                <div>
                  <GuildCardOverlay />
                  <ContactPanel />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
