import React from 'react';
import { quests } from '../data/content';
import { usePortfolioInteraction } from '../hooks/usePortfolioInteraction';

export default function TrackFilter() {
  const { activeTrackFilter, setActiveTrackFilter } = usePortfolioInteraction();

  const allCount = quests.length;
  const aimlCount = quests.filter((q) => q.track.includes('AIML')).length;
  const fullstackCount = quests.filter((q) => q.track.includes('FULLSTACK')).length;

  const filters = [
    { id: 'ALL', label: 'All Quests', count: allCount },
    { id: 'AIML', label: 'AI / ML', count: aimlCount },
    { id: 'FULLSTACK', label: 'Full-Stack', count: fullstackCount },
  ];

  return (
    <div
      role="group"
      aria-label="Filter quests by track"
      style={{
        display: 'flex',
        gap: '6px',
        marginBottom: '14px',
        flexWrap: 'wrap',
      }}
    >
      {filters.map((f) => {
        const isActive = activeTrackFilter === f.id;
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => setActiveTrackFilter(f.id)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: isActive
                ? '1px solid #d4af37'
                : '1px solid rgba(255, 255, 255, 0.12)',
              backgroundColor: isActive
                ? 'rgba(212, 175, 55, 0.22)'
                : 'rgba(20, 16, 25, 0.6)',
              color: isActive ? '#f6eedb' : '#ebdcb9',
              fontSize: '0.75rem',
              fontWeight: 600,
              fontFamily: '"Cinzel", "Georgia", serif',
              letterSpacing: '0.06em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? '0 0 10px rgba(212, 175, 55, 0.3)' : 'none',
            }}
          >
            <span>{f.label}</span>
            <span
              style={{
                fontSize: '0.7rem',
                padding: '1px 5px',
                borderRadius: '4px',
                backgroundColor: isActive ? 'rgba(212, 175, 55, 0.4)' : 'rgba(255, 255, 255, 0.08)',
                color: isActive ? '#fff' : '#8a8275',
                fontFamily: 'monospace',
              }}
            >
              {f.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

