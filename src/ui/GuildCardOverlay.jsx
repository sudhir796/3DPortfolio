import React from 'react';
import { profile, isTODO } from '../data/content';

export default function GuildCardOverlay() {
  const hasRank = !isTODO(profile.rank);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '340px',
        backgroundColor: '#1e1622',
        borderRadius: '12px',
        border: '2px solid #d4af37',
        padding: '20px 22px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(94, 230, 255, 0.2)',
        color: '#f6eedb',
        fontFamily: '"Cinzel", "Georgia", serif',
        marginBottom: '16px',
        overflow: 'hidden',
      }}
    >
      {/* Background Magic Glow Arc */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(94,230,255,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
          paddingBottom: '8px',
          marginBottom: '12px',
        }}
      >
        <span style={{ fontSize: '0.7rem', letterSpacing: '0.14em', color: '#d4af37' }}>
          ADVENTURER PASS
        </span>
        {hasRank && (
          <span
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              color: '#ff4d4f',
              backgroundColor: 'rgba(255, 77, 79, 0.15)',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 77, 79, 0.4)',
            }}
          >
            RANK {profile.rank}
          </span>
        )}
      </div>

      {/* Adventurer Identity */}
      <div style={{ marginBottom: '10px' }}>
        <h3
          style={{
            margin: '0 0 2px 0',
            fontSize: '1.4rem',
            color: '#f6eedb',
            letterSpacing: '0.04em',
          }}
        >
          {profile.name}
        </h3>
        <div style={{ fontSize: '0.78rem', color: '#ffb347', letterSpacing: '0.06em' }}>
          {profile.guildTitle}
        </div>
      </div>

      {/* Classes */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '0.65rem', color: '#8a8275', letterSpacing: '0.1em', marginBottom: '4px' }}>
          REGISTERED CLASSES
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {profile.classes.map((c) => (
            <span
              key={c}
              style={{
                fontSize: '0.7rem',
                fontFamily: 'monospace',
                backgroundColor: 'rgba(94, 230, 255, 0.1)',
                border: '1px solid rgba(94, 230, 255, 0.3)',
                color: '#5ee6ff',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Education Line */}
      <div
        style={{
          borderTop: '1px solid rgba(212, 175, 55, 0.2)',
          paddingTop: '8px',
          fontSize: '0.72rem',
          color: '#ebdcb9',
          fontFamily: 'system-ui, sans-serif',
          lineHeight: 1.4,
        }}
      >
        {profile.education}
      </div>
    </div>
  );
}

