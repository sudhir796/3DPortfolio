import React, { useEffect, useRef } from 'react';
import { useSettings } from '../hooks/useSettings';
import { guildAudio } from '../audio/synth';

const TRAIL_LENGTH = 10;
const SPARKLE_POOL_SIZE = 24;

export default function MagicCursor() {
  const [settings] = useSettings();
  const canvasRef = useRef(null);

  const isEnabled =
    settings.cursorTrailEnabled &&
    !settings.reducedMotion;

  useEffect(() => {
    if (!isEnabled) return;

    // Disable on touch screens
    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;

    if (isTouch) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Hide default cursor while magic cursor is active
    document.documentElement.classList.add('hide-default-cursor');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Reused state objects to prevent GC churn
    const mouse = { x: width / 2, y: height / 2, active: false };
    const head = { x: width / 2, y: height / 2 };
    let isHovering = false;
    let hoverScale = 1.0;

    const nodes = Array.from({ length: TRAIL_LENGTH }, () => ({
      x: width / 2,
      y: height / 2,
    }));

    const sparkles = Array.from({ length: SPARKLE_POOL_SIZE }, () => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      alpha: 0,
      size: 0,
      active: false,
    }));

    const emitSparkles = (x, y) => {
      let spawned = 0;
      for (const sp of sparkles) {
        if (!sp.active && spawned < 10) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.5 + Math.random() * 3.5;
          sp.x = x;
          sp.y = y;
          sp.vx = Math.cos(angle) * speed;
          sp.vy = Math.sin(angle) * speed;
          sp.alpha = 1.0;
          sp.size = 2 + Math.random() * 2.5;
          sp.active = true;
          spawned++;
        }
      }
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      // Detect interactive elements underneath cursor
      const target = e.target;
      const interactive = target?.closest(
        'button, a, input, select, textarea, [role="button"], [data-interactive="true"], canvas'
      );
      const isActuallyInteractive =
        interactive &&
        interactive.tagName !== 'CANVAS'; // 3D canvas handles its own raycast hover

      if (isActuallyInteractive && !isHovering) {
        guildAudio.playHover();
      }
      isHovering = !!isActuallyInteractive;
    };

    const handleMouseDown = (e) => {
      emitSparkles(e.clientX, e.clientY);
      guildAudio.playClick();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);

    let rafId = null;
    let lastTime = performance.now();

    const render = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      if (mouse.active) {
        // Smooth head lag
        head.x += (mouse.x - head.x) * 0.45;
        head.y += (mouse.y - head.y) * 0.45;

        // Smooth hover scale animation
        const targetScale = isHovering ? 1.6 : 1.0;
        hoverScale += (targetScale - hoverScale) * 0.2;

        // Update trail nodes
        let prevX = head.x;
        let prevY = head.y;
        for (let i = 0; i < TRAIL_LENGTH; i++) {
          const n = nodes[i];
          const ease = 0.4 - i * 0.025;
          n.x += (prevX - n.x) * ease;
          n.y += (prevY - n.y) * ease;
          prevX = n.x;
          prevY = n.y;
        }

        // 1. Draw trailing lines connecting nodes
        ctx.beginPath();
        ctx.moveTo(head.x, head.y);
        for (let i = 0; i < TRAIL_LENGTH; i++) {
          ctx.lineTo(nodes[i].x, nodes[i].y);
        }
        ctx.strokeStyle = isHovering
          ? 'rgba(94, 230, 255, 0.45)'
          : 'rgba(94, 230, 255, 0.25)';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // 2. Draw node points
        for (let i = 0; i < TRAIL_LENGTH; i++) {
          const n = nodes[i];
          const ratio = 1 - i / TRAIL_LENGTH;
          const nodeRadius = (1.5 + ratio * 2.2) * (isHovering ? 1.2 : 1.0);
          const alpha = (0.2 + ratio * 0.6) * (isHovering ? 1.2 : 0.8);

          ctx.beginPath();
          ctx.arc(n.x, n.y, Math.max(0.5, nodeRadius), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(94, 230, 255, ${Math.min(1, alpha)})`;
          ctx.shadowColor = '#5ee6ff';
          ctx.shadowBlur = 6 * ratio;
          ctx.fill();
        }

        // 3. Draw Main Magic Orb / Ring
        ctx.shadowColor = '#5ee6ff';
        ctx.shadowBlur = isHovering ? 16 : 10;

        if (isHovering) {
          // Hover ring mode
          ctx.beginPath();
          ctx.arc(head.x, head.y, 14 * hoverScale, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(94, 230, 255, 0.9)';
          ctx.lineWidth = 2.0;
          ctx.stroke();

          // Small central point
          ctx.beginPath();
          ctx.arc(head.x, head.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#ffb347'; // Amber center dot
          ctx.shadowColor = '#ffb347';
          ctx.shadowBlur = 8;
          ctx.fill();
        } else {
          // Standard glowing orb
          ctx.beginPath();
          ctx.arc(head.x, head.y, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = '#5ee6ff';
          ctx.fill();

          // Outer delicate halo
          ctx.beginPath();
          ctx.arc(head.x, head.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(94, 230, 255, 0.2)';
          ctx.fill();
        }
        ctx.shadowBlur = 0;

        // 4. Update and render click sparkles
        for (const sp of sparkles) {
          if (sp.active) {
            sp.x += sp.vx;
            sp.y += sp.vy;
            sp.vx *= 0.92;
            sp.vy *= 0.92;
            sp.alpha -= dt * 2.2;

            if (sp.alpha <= 0.01) {
              sp.active = false;
            } else {
              ctx.save();
              ctx.translate(sp.x, sp.y);
              ctx.rotate(time * 0.005);
              ctx.fillStyle = `rgba(255, 220, 120, ${sp.alpha})`;
              ctx.shadowColor = '#ffb347';
              ctx.shadowBlur = 6;
              // Star spark shape
              const s = sp.size;
              ctx.beginPath();
              ctx.moveTo(0, -s);
              ctx.lineTo(s * 0.3, -s * 0.3);
              ctx.lineTo(s, 0);
              ctx.lineTo(s * 0.3, s * 0.3);
              ctx.lineTo(0, s);
              ctx.lineTo(-s * 0.3, s * 0.3);
              ctx.lineTo(-s, 0);
              ctx.lineTo(-s * 0.3, -s * 0.3);
              ctx.closePath();
              ctx.fill();
              ctx.restore();
            }
          }
        }
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      document.documentElement.classList.remove('hide-default-cursor');
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9990,
        pointerEvents: 'none',
        width: '100vw',
        height: '100vh',
      }}
    />
  );
}

