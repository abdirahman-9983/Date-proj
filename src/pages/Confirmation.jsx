// src/pages/Confirmation.jsx
import { useEffect, useState } from 'react';
import Confetti from '../components/Confetti';

export default function Confirmation({ onRestart }) {
  const [confettiActive, setConfettiActive] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setConfettiActive(true), 100);
    const t2 = setTimeout(() => setVisible(true), 200);
    const t3 = setTimeout(() => setConfettiActive(false), 5000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4 py-8">
      <Confetti active={confettiActive} />

      <div
        className={`glass-card p-8 md:p-12 max-w-lg w-full text-center space-y-6 transition-all duration-700 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{ background: 'rgba(244,63,94,0.08)', borderColor: 'rgba(244,63,94,0.25)' }}
      >
        {/* Big heart */}
        <div className="flex justify-center">
          <span
            className="final-heart"
            style={{ fontSize: '90px', display: 'inline-block' }}
            aria-hidden="true"
          >
            ❤️
          </span>
        </div>

        {/* Floating emoji row */}
        <div className="flex justify-center gap-3 text-3xl">
          {['🎉', '❤️', '🎉', '❤️', '🎉'].map((e, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                animation: `bounceGentle ${1 + i * 0.15}s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {e}
            </span>
          ))}
        </div>

        {/* Heading */}
        <div>
          <h1
            className="text-4xl md:text-5xl font-bold text-glow"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              background: 'linear-gradient(135deg, #fda4af, #f43f5e, #fda4af)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            IT'S A DATE!
          </h1>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          <p className="text-white/70 text-lg font-medium">
            Glad you didn't say no 😌❤️
          </p>
          <div
            className="glass-card p-4 space-y-3"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <p className="text-white/80 text-base">
              Be ready. I'll pick you up. ❤️
            </p>
            <p className="text-rose-300 font-semibold text-base">
              I can't wait to see you. 💕
            </p>
          </div>
        </div>

        {/* Floating hearts */}
        <div className="flex justify-center gap-2 text-2xl">
          {['❤️', '💕', '💖', '💝', '💕', '❤️'].map((h, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                animation: 'float 3s ease-in-out infinite',
                animationDelay: `${i * 0.4}s`,
              }}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Restart */}
        <button
          className="back-btn w-full py-3 text-sm"
          onClick={onRestart}
          id="start-over-btn"
          aria-label="Start over"
        >
          Start Over ❤️
        </button>
      </div>
    </div>
  );
}
