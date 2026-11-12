import React, { useState, useEffect } from 'react';
import { profile, quests, RANK_CONFIG, isTODO } from '../data/content';
import TrackFilter from './TrackFilter';
import SkillTree from './SkillTree';
import JourneyTimeline from './JourneyTimeline';
import ContactPanel from './ContactPanel';
import QuestScroll from './QuestScroll';
import SoundToggle from './SoundToggle';
import { usePortfolioInteraction } from '../hooks/usePortfolioInteraction';
import { guildAudio } from '../audio/synth';

export default function Guild2DExperience({ onEnter3D, fallbackReason }) {
  const { filteredQuests, setSelectedQuestId } = usePortfolioInteraction();
  const [hasResumePdf, setHasResumePdf] = useState(false);
  const [showNotice, setShowNotice] = useState(Boolean(fallbackReason));

  // Check if public/resume.pdf exists
  useEffect(() => {
    fetch('/resume.pdf', { method: 'HEAD' })
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('pdf')) {
          setHasResumePdf(true);
        } else if (res.ok) {
          setHasResumePdf(true);
        }
      })
      .catch(() => setHasResumePdf(false));
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#120d14',
        backgroundImage:
          'radial-gradient(circle at 50% 0%, rgba(255, 179, 71, 0.06) 0%, transparent 40%), radial-gradient(circle at 90% 40%, rgba(94, 230, 255, 0.04) 0%, transparent 30%)',
        color: '#f6eedb',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        lineHeight: 1.6,
        paddingBottom: '80px',
      }}
    >
      {/* Skip Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="skip-link"
        style={{
          position: 'absolute',
          top: '-60px',
          left: '20px',
          padding: '10px 18px',
          backgroundColor: '#ffb347',
          color: '#120d14',
          fontWeight: 700,
          borderRadius: '4px',
          zIndex: 99999,
          transition: 'top 0.2s ease',
          fontFamily: '"Cinzel", "Georgia", serif',
          textDecoration: 'none',
        }}
        onFocus={(e) => {
          e.currentTarget.style.top = '16px';
        }}
        onBlur={(e) => {
          e.currentTarget.style.top = '-60px';
        }}
      >
        Skip to main content
      </a>

      {/* Sticky Guild Header Navigation */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 500,
          backgroundColor: 'rgba(18, 13, 20, 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
          padding: '12px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          {/* Guild Crest Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#d4af37', fontSize: '1.25rem' }}>⚔</span>
            <div>
              <div
                style={{
                  fontFamily: '"Cinzel", "Georgia", serif',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  letterSpacing: '0.12em',
                  color: '#f6eedb',
                }}
              >
                Adventurers' Guild
              </div>
              <div style={{ fontSize: '0.72rem', color: '#ffb347' }}>
                Chronicle of {profile.name}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav
            aria-label="Chronicle sections"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              fontFamily: '"Cinzel", "Georgia", serif',
              fontSize: '0.84rem',
              letterSpacing: '0.06em',
            }}
          >
            {[
              { href: '#hero', label: 'Overview' },
              { href: '#quests', label: 'Quests' },
              { href: '#abilities', label: 'Abilities' },
              { href: '#journey', label: 'Journey' },
              { href: '#contact', label: 'Contact' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => guildAudio.playClick()}
                style={{
                  color: '#c9beab',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                  padding: '4px 6px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffb347')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#c9beab')}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Sound & 3D Mode Toggle CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <SoundToggle />
            <button
              type="button"
              onClick={() => {
                guildAudio.playModeSwitch();
                if (onEnter3D) onEnter3D();
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 16px',
                borderRadius: '6px',
                backgroundColor: 'rgba(94, 230, 255, 0.14)',
                border: '1.5px solid #5ee6ff',
                color: '#5ee6ff',
                fontFamily: '"Cinzel", "Georgia", serif',
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                boxShadow: '0 0 14px rgba(94, 230, 255, 0.25)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(94, 230, 255, 0.28)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(94, 230, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(94, 230, 255, 0.14)';
                e.currentTarget.style.boxShadow = '0 0 14px rgba(94, 230, 255, 0.25)';
              }}
            >
              <span>✦</span>
              <span>Enter 3D Guild</span>
            </button>
          </div>
        </div>
      </header>

      {/* Fallback Notice Banner (if triggered automatically) */}
      {showNotice && fallbackReason && (
        <div
          style={{
            backgroundColor: 'rgba(255, 179, 71, 0.12)',
            borderBottom: '1px solid rgba(255, 179, 71, 0.35)',
            padding: '10px 24px',
            fontSize: '0.82rem',
            color: '#ffb347',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <div>
            <strong>Viewing 2D Chronicle:</strong> {fallbackReason} You can attempt entering the full
            3D Guild Hall at any time using the button above.
          </div>
          <button
            type="button"
            onClick={() => setShowNotice(false)}
            aria-label="Dismiss notice"
            style={{
              background: 'none',
              border: 'none',
              color: '#ffb347',
              cursor: 'pointer',
              fontSize: '1rem',
              padding: '0 6px',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Sections */}
      <main id="main-content" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        {/* ================= HERO SECTION ================= */}
        <section
          id="hero"
          style={{
            padding: '70px 0 50px',
            borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '4px',
              backgroundColor: 'rgba(168, 35, 40, 0.7)',
              border: '1px solid rgba(212, 175, 55, 0.5)',
              color: '#f6eedb',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontFamily: '"Cinzel", serif',
              marginBottom: '18px',
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
            Guild Adventurer Card
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontFamily: '"Cinzel", "Georgia", serif',
              fontWeight: 900,
              letterSpacing: '0.04em',
              color: '#f6eedb',
              margin: '0 0 12px',
              textShadow: '0 2px 14px rgba(0,0,0,0.85)',
            }}
          >
            {profile.name}
          </h1>

          {/* Classes Line */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              marginBottom: '16px',
            }}
          >
            {profile.classes.map((cls) => (
              <span
                key={cls}
                style={{
                  padding: '4px 12px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(94, 230, 255, 0.12)',
                  border: '1px solid rgba(94, 230, 255, 0.45)',
                  color: '#5ee6ff',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  fontFamily: 'monospace',
                }}
              >
                {cls}
              </span>
            ))}
          </div>

          <p
            style={{
              fontSize: '1.15rem',
              color: '#ebdcb9',
              maxWidth: '720px',
              lineHeight: 1.6,
              marginBottom: '14px',
            }}
          >
            {profile.tagline}
          </p>

          <div
            style={{
              fontSize: '0.88rem',
              color: '#a09485',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '28px',
            }}
          >
            <span style={{ color: '#d4af37' }}>🎓</span>
            <span>{profile.education}</span>
          </div>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <a
              href="#quests"
              onClick={() => guildAudio.playClick()}
              style={{
                padding: '10px 22px',
                borderRadius: '6px',
                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                border: '1px solid #d4af37',
                color: '#f6eedb',
                fontFamily: '"Cinzel", serif',
                fontWeight: 700,
                fontSize: '0.88rem',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                transition: 'all 0.15s ease',
              }}
            >
              Inspect Active Quests ↓
            </a>

            <a
              href="#contact"
              onClick={() => guildAudio.playClick()}
              style={{
                padding: '10px 22px',
                borderRadius: '6px',
                backgroundColor: 'rgba(30, 22, 33, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ebdcb9',
                fontFamily: '"Cinzel", serif',
                fontWeight: 600,
                fontSize: '0.88rem',
                textDecoration: 'none',
              }}
            >
              Commission / Contact
            </a>

            {/* Resume download button: only visible if public/resume.pdf exists */}
            {hasResumePdf && (
              <a
                href="/resume.pdf"
                download="Sudhir_Resume.pdf"
                onClick={() => guildAudio.playClick()}
                style={{
                  padding: '10px 22px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(94, 230, 255, 0.12)',
                  border: '1px solid rgba(94, 230, 255, 0.5)',
                  color: '#5ee6ff',
                  fontFamily: '"Cinzel", serif',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                }}
              >
                📄 Download Resume (PDF)
              </a>
            )}
          </div>
        </section>

        {/* ================= QUESTS SECTION ================= */}
        <section
          id="quests"
          style={{
            padding: '60px 0',
            borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <span
              style={{
                fontSize: '0.78rem',
                letterSpacing: '0.12em',
                color: '#ffb347',
                textTransform: 'uppercase',
                fontFamily: '"Cinzel", serif',
              }}
            >
              Notice Board
            </span>
            <h2
              style={{
                fontSize: '2rem',
                fontFamily: '"Cinzel", "Georgia", serif',
                color: '#f6eedb',
                margin: '4px 0 10px',
              }}
            >
              Active Quests & Commissions
            </h2>
            <p style={{ color: '#c9beab', fontSize: '0.94rem' }}>
              Select any quest card below to examine full architectural highlights and technical specifications.
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <TrackFilter />
          </div>

          {/* Quests Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmin(320px, 1fr))',
              gap: '20px',
            }}
          >
            {filteredQuests.map((quest) => {
              const rankInfo = RANK_CONFIG[quest.rank] || RANK_CONFIG.C;
              const hasGithub = !isTODO(quest.links?.github);
              const hasDemo = !isTODO(quest.links?.demo);

              return (
                <article
                  key={quest.id}
                  style={{
                    backgroundColor: 'rgba(28, 20, 29, 0.85)',
                    border: '1.5px solid rgba(212, 175, 55, 0.35)',
                    borderRadius: '10px',
                    padding: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Top Seal Accent Bar */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      backgroundColor: rankInfo.color,
                    }}
                  />

                  <div>
                    {/* Header Badges */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        marginBottom: '12px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: `${rankInfo.color}25`,
                          border: `1px solid ${rankInfo.color}`,
                          color: rankInfo.color,
                          fontWeight: 700,
                          fontFamily: '"Cinzel", serif',
                        }}
                      >
                        RANK {quest.rank}
                      </span>

                      <span
                        style={{
                          fontSize: '0.7rem',
                          color: '#a09485',
                          fontFamily: 'monospace',
                        }}
                      >
                        {quest.status}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontSize: '1.25rem',
                        fontFamily: '"Cinzel", "Georgia", serif',
                        color: '#f6eedb',
                        margin: '0 0 10px',
                      }}
                    >
                      {quest.title}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.88rem',
                        color: '#ebdcb9',
                        lineHeight: 1.5,
                        marginBottom: '16px',
                      }}
                    >
                      {quest.summary}
                    </p>

                    {/* Tech Badges */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        marginBottom: '18px',
                      }}
                    >
                      {quest.tech.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: '0.72rem',
                            padding: '2px 8px',
                            borderRadius: '3px',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#d4af37',
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div
                    style={{
                      borderTop: '1px solid rgba(212, 175, 55, 0.2)',
                      paddingTop: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        guildAudio.playScrollOpen();
                        setSelectedQuestId(quest.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#5ee6ff',
                        fontFamily: '"Cinzel", serif',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      Inspect Scroll ↗
                    </button>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {hasGithub && (
                        <a
                          href={quest.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '0.76rem',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(255, 255, 255, 0.06)',
                            color: '#ebdcb9',
                            textDecoration: 'none',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                          }}
                        >
                          GitHub
                        </a>
                      )}
                      {hasDemo && (
                        <a
                          href={quest.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '0.76rem',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(94, 230, 255, 0.12)',
                            color: '#5ee6ff',
                            textDecoration: 'none',
                            border: '1px solid rgba(94, 230, 255, 0.35)',
                          }}
                        >
                          Demo ↗
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ================= ABILITIES SECTION ================= */}
        <section
          id="abilities"
          style={{
            padding: '60px 0',
            borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <span
              style={{
                fontSize: '0.78rem',
                letterSpacing: '0.12em',
                color: '#5ee6ff',
                textTransform: 'uppercase',
                fontFamily: '"Cinzel", serif',
              }}
            >
              Appraisal Dais
            </span>
            <h2
              style={{
                fontSize: '2rem',
                fontFamily: '"Cinzel", "Georgia", serif',
                color: '#f6eedb',
                margin: '4px 0 10px',
              }}
            >
              Abilities & Arcane Knowledge
            </h2>
            <p style={{ color: '#c9beab', fontSize: '0.94rem' }}>
              Mastered languages, modern architectural frameworks, artificial intelligence paradigms, and verified certifications.
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(28, 20, 29, 0.85)',
              border: '1.5px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '12px',
              padding: '28px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            }}
          >
            <SkillTree />
          </div>
        </section>

        {/* ================= JOURNEY SECTION ================= */}
        <section
          id="journey"
          style={{
            padding: '60px 0',
            borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <span
              style={{
                fontSize: '0.78rem',
                letterSpacing: '0.12em',
                color: '#ffb347',
                textTransform: 'uppercase',
                fontFamily: '"Cinzel", serif',
              }}
            >
              Guild Archives
            </span>
            <h2
              style={{
                fontSize: '2rem',
                fontFamily: '"Cinzel", "Georgia", serif',
                color: '#f6eedb',
                margin: '4px 0 10px',
              }}
            >
              The Adventurer's Journey So Far
            </h2>
            <p style={{ color: '#c9beab', fontSize: '0.94rem' }}>
              Historical chronicle of academic milestones, hackathons, and software engineering ventures.
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(28, 20, 29, 0.85)',
              border: '1.5px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '12px',
              padding: '28px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            }}
          >
            <JourneyTimeline />
          </div>
        </section>

        {/* ================= CONTACT SECTION ================= */}
        <section
          id="contact"
          style={{
            padding: '60px 0',
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <span
              style={{
                fontSize: '0.78rem',
                letterSpacing: '0.12em',
                color: '#d4af37',
                textTransform: 'uppercase',
                fontFamily: '"Cinzel", serif',
              }}
            >
              Registrar Counter
            </span>
            <h2
              style={{
                fontSize: '2rem',
                fontFamily: '"Cinzel", "Georgia", serif',
                color: '#f6eedb',
                margin: '4px 0 10px',
              }}
            >
              Commission an Adventure
            </h2>
            <p style={{ color: '#c9beab', fontSize: '0.94rem' }}>
              Inquire about technical collaborations, hackathons, and software engineering opportunities.
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(28, 20, 29, 0.85)',
              border: '1.5px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '12px',
              padding: '28px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            }}
          >
            <ContactPanel />
          </div>
        </section>
      </main>

      {/* Quest Detail Scroll Modal */}
      <QuestScroll />

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(212, 175, 55, 0.2)',
          marginTop: '60px',
          padding: '30px 24px',
          textAlign: 'center',
          fontSize: '0.82rem',
          color: '#8a8275',
          fontFamily: '"Cinzel", "Georgia", serif',
        }}
      >
        <div style={{ marginBottom: '8px' }}>
          ⚔ Adventurers' Guild • Crafted with Procedural Magic for {profile.name}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '12px' }}>
          <button
            type="button"
            onClick={() => {
              guildAudio.playModeSwitch();
              if (onEnter3D) onEnter3D();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#5ee6ff',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.82rem',
              textDecoration: 'underline',
            }}
          >
            Switch to 3D Experience
          </button>
        </div>
      </footer>
    </div>
  );
}

