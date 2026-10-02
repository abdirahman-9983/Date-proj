// src/components/ProgressBar.jsx
export default function ProgressBar({ current, total }) {
  return (
    <div className="w-full space-y-3">
      {/* Text indicator */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/40 uppercase tracking-widest">
          Question {current} of {total}
        </span>
        <span className="text-xs font-semibold text-rose-400">
          {Math.round((current / total) * 100)}%
        </span>
      </div>

      {/* Heart indicators */}
      <div className="flex items-center gap-1.5 justify-center flex-wrap">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`transition-all duration-300 ${
              i < current
                ? 'text-rose-400 text-lg drop-shadow-[0_0_6px_rgba(244,63,94,0.8)]'
                : 'text-white/15 text-base'
            }`}
            style={{
              transform: i < current ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.4s ease',
            }}
          >
            {i < current ? '❤️' : '🤍'}
          </span>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="progress-bar-fill h-full rounded-full"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
