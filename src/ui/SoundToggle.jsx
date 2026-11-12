import React, { useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import { guildAudio } from '../audio/synth';

export default function SoundToggle() {
  const [settings, updateSettings] = useSettings();
  const isEnabled = settings.soundEnabled;

  useEffect(() => {
    guildAudio.setMuted(!isEnabled);
  }, [isEnabled]);

  const toggleSound = () => {
    const nextState = !isEnabled;
    guildAudio.setMuted(!nextState);
    if (nextState) {
      guildAudio.playClick();
    }
    updateSettings({ soundEnabled: nextState });
  };

  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-label={isEnabled ? 'Mute guild ambient sound' : 'Unmute guild ambient sound'}
      aria-pressed={isEnabled}
      title={isEnabled ? 'Sound: Enabled (Click to mute)' : 'Sound: Muted (Click to enable audio synth)'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '6px',
        backgroundColor: isEnabled ? 'rgba(94, 230, 255, 0.16)' : 'rgba(30, 22, 33, 0.85)',
        border: `1px solid ${isEnabled ? 'rgba(94, 230, 255, 0.65)' : 'rgba(212, 175, 55, 0.35)'}`,
        color: isEnabled ? '#5ee6ff' : '#f6eedb',
        fontSize: '0.78rem',
        fontWeight: 600,
        fontFamily: '"Cinzel", "Georgia", serif',
        cursor: 'pointer',
        boxShadow: isEnabled ? '0 0 14px rgba(94, 230, 255, 0.25)' : '0 2px 8px rgba(0,0,0,0.4)',
        transition: 'all 0.2s ease',
      }}
    >
      {/* SVG Speaker Icon */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        {isEnabled ? (
          <>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </>
        ) : (
          <>
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </>
        )}
      </svg>
      <span>{isEnabled ? 'Sound: ON' : 'Sound: OFF'}</span>
    </button>
  );
}

