import React from 'react';

export default class ThreeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D Guild Hall Scene crashed:', error, errorInfo);
    if (this.props.onCrash) {
      this.props.onCrash(error?.message || 'WebGL / 3D Scene Error');
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#120d14',
            color: '#f6eedb',
            padding: '24px',
            textAlign: 'center',
            zIndex: 10000,
            fontFamily: '"Cinzel", "Georgia", serif',
          }}
        >
          <div
            style={{
              maxWidth: '500px',
              backgroundColor: 'rgba(28, 20, 29, 0.95)',
              border: '1.5px solid rgba(212, 175, 55, 0.5)',
              borderRadius: '12px',
              padding: '28px',
              boxShadow: '0 16px 40px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ fontSize: '1.6rem', color: '#ffb347', marginBottom: '12px' }}>
              ⚔ The Guild Hall Falters
            </div>
            <p
              style={{
                fontSize: '0.88rem',
                color: '#ebdcb9',
                lineHeight: 1.6,
                fontFamily: 'sans-serif',
                marginBottom: '20px',
              }}
            >
              The 3D WebGL renderer encountered an unexpected illusion fault. We have preserved all
              scrolls and chronicles in the high-speed 2D archives.
            </p>
            <button
              type="button"
              onClick={() => {
                if (this.props.onFallback) {
                  this.props.onFallback();
                } else {
                  window.location.href = '?mode=2d';
                }
              }}
              style={{
                padding: '10px 22px',
                borderRadius: '6px',
                backgroundColor: 'rgba(168, 35, 40, 0.85)',
                border: '1px solid rgba(212, 175, 55, 0.6)',
                color: '#f6eedb',
                fontFamily: '"Cinzel", "Georgia", serif',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Continue to 2D Guild Archive
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

