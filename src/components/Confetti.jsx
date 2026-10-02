// src/components/Confetti.jsx
import { useEffect, useRef } from 'react';

const COLORS = ['#f43f5e', '#ec4899', '#fb7185', '#fda4af', '#f9a8d4', '#fce7f3', '#fff', '#ffd700'];
const SHAPES = ['❤️', '💕', '🌸', '✨', '💖', '⭐'];

export default function Confetti({ active }) {
  const containerRef = useRef(null);
  const piecesRef = useRef([]);

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    // Clear any existing
    piecesRef.current.forEach(p => p.remove());
    piecesRef.current = [];

    const total = 80;

    for (let i = 0; i < total; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        const isEmoji = Math.random() > 0.5;
        const x = Math.random() * window.innerWidth;

        if (isEmoji) {
          el.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: -30px;
            font-size: ${Math.random() * 20 + 14}px;
            pointer-events: none;
            z-index: 9999;
            animation: confettiFall ${Math.random() * 2 + 2}s ease-in forwards;
          `;
          el.textContent = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        } else {
          const size = Math.random() * 10 + 6;
          const isRect = Math.random() > 0.5;
          el.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: -20px;
            width: ${size}px;
            height: ${isRect ? size * 0.5 : size}px;
            background: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
            border-radius: ${isRect ? '2px' : '50%'};
            pointer-events: none;
            z-index: 9999;
            opacity: 1;
            animation: confettiFall ${Math.random() * 2.5 + 1.5}s ease-in forwards;
          `;
        }

        document.body.appendChild(el);
        piecesRef.current.push(el);

        setTimeout(() => {
          el.remove();
        }, 5000);
      }, Math.random() * 1500);
    }

    return () => {
      piecesRef.current.forEach(p => {
        try { p.remove(); } catch {}
      });
    };
  }, [active]);

  return <div ref={containerRef} aria-hidden="true" />;
}
