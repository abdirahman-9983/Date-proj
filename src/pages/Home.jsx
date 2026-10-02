// src/pages/Home.jsx
import { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import NoEscapeButton from '../components/NoEscapeButton';

export default function Home({ onYes }) {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') || '';
  const yesBtnRef = useRef(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleYes = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onYes();
      }, 500);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4 py-8">
      {/* Main Card */}
      <div
        className={`glass-card p-8 md:p-12 max-w-lg w-full text-center space-y-6 ${
          isExiting ? 'page-exit' : 'page-enter'
        }`}
      >
        {/* Floating heart illustration */}
        <div className="flex justify-center mb-2">
          <div
            className="heart-main"
            style={{ fontSize: '80px', lineHeight: 1 }}
            aria-hidden="true"
          >
            ❤️
          </div>
        </div>

        {/* Small intro text */}
        <p className="text-white/50 text-sm font-medium tracking-wider uppercase">
          I have one little question for you…
        </p>

        {/* Main heading */}
        <div>
          <h1
            className="font-display text-3xl md:text-4xl font-bold text-white leading-tight"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              textShadow: '0 0 30px rgba(251,113,133,0.3)',
            }}
          >
            {name ? (
              <>
                <span className="text-rose-300">{name}</span>
                {', '}will you go on a date with me?
              </>
            ) : (
              'Will you go on a date with me?'
            )}
          </h1>
          <span className="text-3xl">❤️</span>
        </div>

        {/* Subtitle */}
        <p className="text-white/40 text-sm">Think carefully… 👀</p>

        {/* Success message */}
        {showSuccess && (
          <div
            className="page-enter glass-card p-4 border border-rose-500/30"
            style={{ background: 'rgba(244,63,94,0.12)' }}
          >
            <p className="text-rose-300 font-semibold text-lg">
              Yay! I knew you had good taste 😌❤️
            </p>
            <div className="flex justify-center gap-2 mt-2 text-2xl animate-bounce">
              ❤️ 💕 ❤️
            </div>
          </div>
        )}

        {/* Buttons */}
        {!showSuccess && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            {/* YES Button */}
            <button
              ref={yesBtnRef}
              className="yes-btn px-10 py-4 text-lg w-full sm:w-auto min-w-[140px]"
              onClick={handleYes}
              id="yes-btn"
              aria-label="Yes, I'll go on a date"
            >
              YES ❤️
            </button>

            {/* Placeholder for NO button layout — the actual NO button is fixed-positioned */}
            <div
              className="w-full sm:w-auto"
              style={{ minWidth: '130px', height: '52px' }}
              aria-hidden="true"
            />
          </div>
        )}

        {/* Hint text */}
        {!showSuccess && (
          <p className="text-white/20 text-xs mt-2">
            (There's really only one right answer 😌)
          </p>
        )}
      </div>

      {/* NO Escape Button - rendered globally / fixed */}
      {!showSuccess && <NoEscapeButton yesBtnRef={yesBtnRef} />}
    </div>
  );
}
