import React, { useState } from 'react';
import { profile, contact, isTODO } from '../data/content';

export default function ContactPanel() {
  const [copied, setCopied] = useState(false);

  const hasGithub = !isTODO(contact.github);
  const hasLinkedin = !isTODO(contact.linkedin);
  const hasEmail = !isTODO(contact.email);
  const hasResume = !isTODO(contact.resume);

  const handlePostQuest = () => {
    if (hasEmail) {
      window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
        'Adventurer Guild Commission / Quest Inquiry'
      )}`;
    } else if (hasGithub) {
      window.open(contact.github, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Adventurer Identity Card Summary */}
      <div
        style={{
          backgroundColor: 'rgba(10, 7, 12, 0.45)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: '8px',
          padding: '16px 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ fontSize: '1.25rem', fontFamily: '"Cinzel", "Georgia", serif', color: '#f6eedb', fontWeight: 700 }}>
            {profile.name}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#ffb347', fontFamily: '"Cinzel", serif', letterSpacing: '0.08em' }}>
            {profile.guildTitle}
          </div>
        </div>

        {/* Classes line */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {profile.classes.map((cls) => (
            <span
              key={cls}
              style={{
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: 'rgba(94, 230, 255, 0.1)',
                border: '1px solid rgba(94, 230, 255, 0.35)',
                color: '#5ee6ff',
                fontFamily: 'monospace',
              }}
            >
              {cls}
            </span>
          ))}
        </div>

        {/* Education */}
        <div style={{ fontSize: '0.8rem', color: '#d9c49a', lineHeight: 1.45 }}>
          <span style={{ color: '#d4af37' }}>🏛 </span>
          <span>{profile.education}</span>
        </div>
      </div>

      {/* Styled Contact Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Main CTA: Post a Quest */}
        <button
          type="button"
          onClick={handlePostQuest}
          style={{
            padding: '12px 20px',
            borderRadius: '8px',
            border: '1px solid #d4af37',
            backgroundColor: 'rgba(168, 35, 40, 0.75)',
            backgroundImage: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, transparent 100%)',
            color: '#f6eedb',
            fontSize: '0.92rem',
            fontWeight: 700,
            fontFamily: '"Cinzel", "Georgia", serif',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(168, 35, 40, 0.5), 0 0 12px rgba(212, 175, 55, 0.3)',
            transition: 'all 0.2s ease',
          }}
        >
          <span>⚔</span>
          <span>{contact.ctaText || 'Post a Quest'}</span>
        </button>

        {/* Channel Links Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {/* GitHub Button */}
          {hasGithub && (
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: '1 1 auto',
                padding: '9px 14px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#ebdcb9',
                fontSize: '0.82rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <span>GitHub ↗</span>
            </a>
          )}

          {/* LinkedIn Button (hidden if empty/TODO) */}
          {hasLinkedin && (
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: '1 1 auto',
                padding: '9px 14px',
                borderRadius: '6px',
                border: '1px solid rgba(94, 230, 255, 0.3)',
                backgroundColor: 'rgba(94, 230, 255, 0.08)',
                color: '#5ee6ff',
                fontSize: '0.82rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <span>LinkedIn ↗</span>
            </a>
          )}

          {/* Email Button (hidden if empty/TODO) */}
          {hasEmail && (
            <a
              href={`mailto:${contact.email}`}
              style={{
                flex: '1 1 auto',
                padding: '9px 14px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 179, 71, 0.3)',
                backgroundColor: 'rgba(255, 179, 71, 0.08)',
                color: '#ffb347',
                fontSize: '0.82rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <span>Email ↗</span>
            </a>
          )}

          {/* Resume Button (hidden if empty/TODO) */}
          {hasResume && (
            <a
              href={contact.resume}
              download
              style={{
                flex: '1 1 auto',
                padding: '9px 14px',
                borderRadius: '6px',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                backgroundColor: 'rgba(212, 175, 55, 0.08)',
                color: '#f6eedb',
                fontSize: '0.82rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <span>📜 Download Resume</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

