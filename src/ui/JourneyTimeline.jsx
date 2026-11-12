import React from 'react';
import { journey } from '../data/content';

export default function JourneyTimeline() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '360px',
        overflowY: 'auto',
        paddingRight: '8px',
      }}
    >
      <div
        style={{
          position: 'relative',
          paddingLeft: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Continuous vertical timeline rope/line */}
        <div
          style={{
            position: 'absolute',
            left: '7px',
            top: '8px',
            bottom: '8px',
            width: '2px',
            background:
              'linear-gradient(180deg, #d4af37 0%, rgba(212, 175, 55, 0.4) 80%, transparent 100%)',
          }}
        />

        {journey.map((item) => (
          <div key={item.id} style={{ position: 'relative' }}>
            {/* Timeline node icon */}
            <div
              style={{
                position: 'absolute',
                left: '-24px',
                top: '2px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: '#1c141d',
                border: '2px solid #d4af37',
                boxShadow: '0 0 8px rgba(212, 175, 55, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#ffb347',
                }}
              />
            </div>

            {/* Date Badge */}
            <div
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                color: '#ffb347',
                fontSize: '0.72rem',
                fontFamily: 'monospace',
                fontWeight: 600,
                marginBottom: '4px',
              }}
            >
              {item.date}
            </div>

            {/* Event Title */}
            <h3
              style={{
                margin: '2px 0 4px 0',
                fontSize: '0.98rem',
                fontFamily: '"Cinzel", "Georgia", serif',
                color: '#f6eedb',
                fontWeight: 700,
                letterSpacing: '0.03em',
              }}
            >
              {item.title}
            </h3>

            {/* Role & Organization (if present) */}
            {(item.role || item.organization) && (
              <div
                style={{
                  fontSize: '0.78rem',
                  color: '#5ee6ff',
                  fontWeight: 500,
                  marginBottom: '4px',
                }}
              >
                {item.role && <span>{item.role}</span>}
                {item.role && item.organization && <span> • </span>}
                {item.organization && <span>{item.organization}</span>}
              </div>
            )}

            {/* Description */}
            <p
              style={{
                margin: 0,
                fontSize: '0.86rem',
                lineHeight: 1.5,
                color: '#d9c49a',
              }}
            >
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

