// src/components/OptionCard.jsx
export default function OptionCard({ option, selected, onClick, layout = 'grid' }) {
  const isGrid = layout === 'grid';

  return (
    <button
      className={`option-card w-full text-left transition-all duration-250 ${
        selected ? 'selected' : ''
      } ${isGrid ? 'p-4' : 'p-4 flex items-center gap-4'}`}
      onClick={() => onClick(option.value)}
      aria-pressed={selected}
      aria-label={option.label}
      id={`option-${option.value.replace(/\s+/g, '-').toLowerCase()}`}
    >
      {isGrid ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl">{option.emoji}</span>
            {selected && (
              <div className="checkmark animate-fade-in">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <p className={`font-semibold text-sm leading-tight ${selected ? 'text-white' : 'text-white/80'}`}>
              {option.label}
            </p>
            {option.description && (
              <p className="text-xs text-white/40 mt-0.5 leading-tight">{option.description}</p>
            )}
          </div>
        </div>
      ) : (
        <>
          <span className="text-2xl flex-shrink-0">{option.emoji}</span>
          <div className="flex-1">
            <p className={`font-semibold text-sm ${selected ? 'text-white' : 'text-white/80'}`}>
              {option.label}
            </p>
            {option.description && (
              <p className="text-xs text-white/40 mt-0.5">{option.description}</p>
            )}
          </div>
          {selected && (
            <div className="checkmark flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </>
      )}
    </button>
  );
}
