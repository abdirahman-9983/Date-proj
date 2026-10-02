// src/pages/Review.jsx
import { questions } from '../data/questions';

function formatTime(val) {
  if (!val) return '—';
  const [h, m] = val.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${m} ${ampm}`;
}

function formatDate(val) {
  if (!val) return '—';
  return new Date(val + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getVibeEmoji(vibe) {
  const map = { Dinner: '🍽️', Movie: '🎬', Football: '⚽', Chill: '☕', Walk: '🚶' };
  return map[vibe] || '✨';
}
function getFoodEmoji(food) {
  const map = { 'Fast Food': '🍔', Pizza: '🍕', Chicken: '🍗', Restaurant: '🍝', Coffee: '☕', 'You choose': '🤷' };
  return map[food] || '🍴';
}
function getPerfectEmoji(p) {
  const map = {
    'Good food': '🍕',
    'Good conversation': '💬',
    Music: '🎵',
    'Lots of laughs': '😂',
    'A surprise': '👀',
    'Just spending time together': '❤️',
  };
  return map[p] || '❤️';
}
function getLocationDisplay(datePlan) {
  if (datePlan.location === 'Other' && datePlan.customLocation) {
    return `📍 ${datePlan.customLocation}`;
  }
  const map = {
    'You choose': '💝 You choose',
    "I'll choose": "🗺️ I'll choose",
    Restaurant: '🍽️ Restaurant',
    Café: '☕ Café',
    Mall: '🛍️ Mall',
  };
  return map[datePlan.location] || datePlan.location || '—';
}

export default function Review({ datePlan, onConfirm, onBack, isSaving }) {
  const summaryItems = [
    {
      label: 'Free Day',
      value: datePlan.freeDay || '—',
      emoji: '📅',
    },
    {
      label: 'Vibe',
      value: datePlan.vibe ? `${datePlan.vibe} ${getVibeEmoji(datePlan.vibe)}` : '—',
      emoji: '😌',
    },
    {
      label: 'Food',
      value: datePlan.food ? `${datePlan.food} ${getFoodEmoji(datePlan.food)}` : '—',
      emoji: '🍴',
    },
    {
      label: 'Perfect Date',
      value: datePlan.perfectDate ? `${datePlan.perfectDate} ${getPerfectEmoji(datePlan.perfectDate)}` : '—',
      emoji: '❤️',
    },
    {
      label: 'Date',
      value: formatDate(datePlan.date),
      emoji: '🗓️',
    },
    {
      label: 'Time',
      value: formatTime(datePlan.time),
      emoji: '⏰',
    },
    {
      label: 'Location',
      value: getLocationDisplay(datePlan),
      emoji: '📍',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4 py-8">
      <div className="glass-card p-6 md:p-10 max-w-lg w-full space-y-6 page-enter">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-4xl animate-pulse-heart">❤️</div>
          <h1
            className="text-2xl md:text-3xl font-bold text-white"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Your Date Plan
          </h1>
          <p className="text-white/40 text-sm">Here's everything you chose…</p>
        </div>

        {/* Summary items */}
        <div className="space-y-3">
          {summaryItems.map((item, i) => (
            <div key={i} className="summary-item flex items-center gap-4">
              <div className="text-xl flex-shrink-0">{item.emoji}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white/40 text-xs uppercase tracking-wider">{item.label}</p>
                <p className="text-white font-semibold text-sm mt-0.5 truncate">{item.value}</p>
              </div>
            </div>
          ))}

          {/* Optional message */}
          {datePlan.message && (
            <div className="summary-item">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">💬 Your Message</p>
              <p className="text-white/80 text-sm leading-relaxed italic">"{datePlan.message}"</p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            className={`confirm-btn py-4 px-6 text-base font-bold w-full ${isSaving ? 'opacity-80 cursor-wait' : ''}`}
            onClick={onConfirm}
            disabled={isSaving}
            id="confirm-date-btn"
            aria-label="Confirm date plan"
          >
            {isSaving ? 'Locking it in... 💕' : 'Confirm Date ❤️'}
          </button>
          <button
            className="back-btn py-3 px-6 text-sm w-full text-center"
            onClick={onBack}
            disabled={isSaving}
            id="change-answers-btn"
            aria-label="Go back and change answers"
          >
            ← Change something
          </button>
        </div>
      </div>
    </div>
  );
}
