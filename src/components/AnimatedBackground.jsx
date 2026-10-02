// src/components/AnimatedBackground.jsx
import { useEffect, useRef } from 'react';

const HEARTS = ['❤️', '💕', '💗', '💝', '💖', '🌸', '✨', '⭐', '💫'];
const NUM_PARTICLES = 18;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export default function AnimatedBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles = [];

    for (let i = 0; i < NUM_PARTICLES; i++) {
      const el = document.createElement('div');
      el.className = 'particle';
      el.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
      const size = randomBetween(12, 26);
      el.style.cssText = `
        left: ${randomBetween(0, 98)}%;
        font-size: ${size}px;
        animation-duration: ${randomBetween(8, 18)}s;
        animation-delay: ${randomBetween(0, 10)}s;
        opacity: 0;
        filter: blur(${Math.random() > 0.7 ? '1px' : '0px'});
      `;
      container.appendChild(el);
      particles.push(el);
    }

    return () => {
      particles.forEach(p => p.remove());
    };
  }, []);

  return (
    <div className="bg-romantic fixed inset-0 z-0">
      {/* Stars layer */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${randomBetween(4, 10)}px`,
              animationDuration: `${randomBetween(2, 5)}s`,
              animationDelay: `${randomBetween(0, 5)}s`,
            }}
          >
            ✦
          </div>
        ))}
      </div>
      {/* Floating particles */}
      <div ref={containerRef} className="particle-container" />
      {/* Gradient overlays for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(244,63,94,0.08) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 80% 100%, rgba(236,72,153,0.06) 0%, transparent 50%)',
        }}
      />
    </div>
  );
}
