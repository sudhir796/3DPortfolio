import React from 'react';
import { abilities } from '../data/content';
import { usePortfolioInteraction } from '../hooks/usePortfolioInteraction';

export default function SkillTree() {
  const {
    activeSkillGroupId,
    setActiveSkillGroupId,
    setHoveredSkillGroupId,
  } = usePortfolioInteraction();

  const activeGroup =
    abilities.groups.find((g) => g.id === activeSkillGroupId) || abilities.groups[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Skill Category Tabs */}
      <div
        role="tablist"
        aria-label="Skill categories"
        style={{
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap',
          borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
          paddingBottom: '10px',
        }}
      >
        {abilities.groups.map((group) => {
          const isActive = group.id === activeGroup.id;
          return (
            <button
              key={group.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`skill-tabpanel-${group.id}`}
              id={`skill-tab-${group.id}`}
              type="button"
              onClick={() => setActiveSkillGroupId(group.id)}
              onMouseEnter={() => setHoveredSkillGroupId(group.id)}
              onMouseLeave={() => setHoveredSkillGroupId(null)}
              onFocus={() => setHoveredSkillGroupId(group.id)}
              onBlur={() => setHoveredSkillGroupId(null)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: isActive
                  ? '1px solid #5ee6ff'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: isActive
                  ? 'rgba(94, 230, 255, 0.18)'
                  : 'rgba(20, 16, 25, 0.5)',
                color: isActive ? '#5ee6ff' : '#d9c49a',
                fontSize: '0.78rem',
                fontWeight: 600,
                fontFamily: '"Cinzel", "Georgia", serif',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 0 10px rgba(94, 230, 255, 0.3)' : 'none',
              }}
            >
              <span>{group.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Group Skills Grid */}
      <div
        id={`skill-tabpanel-${activeGroup.id}`}
        role="tabpanel"
        aria-labelledby={`skill-tab-${activeGroup.id}`}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          minHeight: '80px',
          alignContent: 'flex-start',
        }}
      >
        {activeGroup.items.map((skill) => (
          <span
            key={skill}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              color: '#f6eedb',
              fontSize: '0.84rem',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
            }}
          >
            <span style={{ color: '#5ee6ff', fontSize: '0.7rem' }}>✦</span>
            <span>{skill}</span>
          </span>
        ))}
      </div>

      {/* Medals & Honors Section */}
      <div style={{ marginTop: '6px', borderTop: '1px solid rgba(212, 175, 55, 0.15)', paddingTop: '12px' }}>
        <div
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#d4af37',
            marginBottom: '8px',
            fontFamily: '"Cinzel", "Georgia", serif',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>🎖 Guild Medals & Hackathon Finalist Honors</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {abilities.medals.map((m, idx) => (
            <span
              key={idx}
              style={{
                padding: '4px 10px',
                borderRadius: '5px',
                backgroundColor: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                color: '#ebdcb9',
                fontSize: '0.76rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>🏅</span>
              <span>{m.title}</span>
              <span style={{ color: '#ffb347', fontSize: '0.7rem' }}>({m.year})</span>
            </span>
          ))}
        </div>
      </div>

      {/* Certifications Section */}
      <div style={{ marginTop: '2px', borderTop: '1px solid rgba(212, 175, 55, 0.15)', paddingTop: '12px' }}>
        <div
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#5ee6ff',
            marginBottom: '8px',
            fontFamily: '"Cinzel", "Georgia", serif',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>📜 Certified Adventurer Attestations</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {abilities.certifications.map((c, idx) => (
            <span
              key={idx}
              style={{
                padding: '4px 10px',
                borderRadius: '5px',
                backgroundColor: 'rgba(94, 230, 255, 0.08)',
                border: '1px solid rgba(94, 230, 255, 0.3)',
                color: '#ebdcb9',
                fontSize: '0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{ color: '#5ee6ff' }}>✓</span>
              <span>{c.name}</span>
              <span style={{ color: '#8a8275', fontSize: '0.7rem' }}>• {c.issuer} ({c.year})</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

