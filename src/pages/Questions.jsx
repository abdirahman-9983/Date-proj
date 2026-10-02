// src/pages/Questions.jsx
import { useState, useEffect } from 'react';
import ProgressBar from '../components/ProgressBar';
import OptionCard from '../components/OptionCard';
import { questions } from '../data/questions';

const TODAY = new Date().toISOString().split('T')[0];

function formatTime(val) {
  if (!val) return '';
  const [h, m] = val.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${m} ${ampm}`;
}

export default function Questions({ datePlan, setDatePlan, onComplete }) {
  const [step, setStep] = useState(0);
  const [localInput, setLocalInput] = useState('');
  const [validationMsg, setValidationMsg] = useState('');
  const [animKey, setAnimKey] = useState(0);

  const q = questions[step];
  const totalSteps = questions.length;

  useEffect(() => {
    // Sync local input state when navigating
    const currentVal = datePlan[q.key];
    if (q.type === 'date' || q.type === 'time') {
      setLocalInput(currentVal || '');
    }
    setValidationMsg('');
    setAnimKey(k => k + 1);
  }, [step]);

  const currentAnswer = datePlan[q.key];

  const handleSelect = (value) => {
    setDatePlan(prev => ({ ...prev, [q.key]: value }));
    setValidationMsg('');
  };

  const handleNext = () => {
    if (q.required && !currentAnswer) {
      setValidationMsg('Pick one first 😌❤️');
      return;
    }
    if (step < totalSteps - 1) {
      setStep(s => s + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const renderQuestion = () => {
    switch (q.type) {
      case 'single':
        return (
          <div className={`grid gap-3 ${q.options.length <= 3 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {q.options.map(opt => (
              <OptionCard
                key={opt.value}
                option={opt}
                selected={currentAnswer === opt.value}
                onClick={handleSelect}
                layout={q.options.some(o => o.description) ? 'grid' : 'list'}
              />
            ))}
          </div>
        );

      case 'date':
        return (
          <div className="space-y-4">
            <input
              type="date"
              value={datePlan.date || ''}
              min={TODAY}
              onChange={e => {
                setDatePlan(prev => ({ ...prev, date: e.target.value }));
                setValidationMsg('');
              }}
              id="date-picker"
              aria-label="Select date"
            />
            {datePlan.date && (
              <div
                className="glass-card p-4 text-center"
                style={{ background: 'rgba(244,63,94,0.08)', borderColor: 'rgba(244,63,94,0.25)' }}
              >
                <p className="text-white/50 text-xs mb-1">Selected</p>
                <p className="text-white font-semibold text-lg">
                  📅 {new Date(datePlan.date + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>
        );

      case 'time':
        return (
          <div className="space-y-4">
            {/* Quick time slots */}
            <div className="grid grid-cols-3 gap-3">
              {q.timeSlots.map(slot => (
                <button
                  key={slot.value}
                  className={`option-card p-3 text-center transition-all ${
                    datePlan.time === slot.value ? 'selected' : ''
                  }`}
                  onClick={() => {
                    setDatePlan(prev => ({ ...prev, time: slot.value }));
                    setLocalInput(slot.value);
                    setValidationMsg('');
                  }}
                  id={`time-${slot.label.toLowerCase()}`}
                  aria-label={slot.label}
                >
                  <div className="text-2xl mb-1">{slot.emoji}</div>
                  <div className="text-xs font-semibold text-white/80">{slot.label}</div>
                  <div className="text-xs text-white/40 mt-0.5">{slot.sub}</div>
                </button>
              ))}
            </div>

            {/* Custom time */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-white/30 text-xs">or pick a time</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <input
              type="time"
              value={datePlan.time || ''}
              onChange={e => {
                setDatePlan(prev => ({ ...prev, time: e.target.value }));
                setLocalInput(e.target.value);
                setValidationMsg('');
              }}
              id="time-picker"
              aria-label="Custom time picker"
            />
            {datePlan.time && (
              <div
                className="glass-card p-3 text-center"
                style={{ background: 'rgba(244,63,94,0.08)', borderColor: 'rgba(244,63,94,0.25)' }}
              >
                <p className="text-white font-semibold">⏰ {formatTime(datePlan.time)}</p>
              </div>
            )}
          </div>
        );

      case 'location':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {q.options.map(opt => (
                <OptionCard
                  key={opt.value}
                  option={opt}
                  selected={currentAnswer === opt.value}
                  onClick={(val) => {
                    handleSelect(val);
                    if (val !== 'Other') {
                      setDatePlan(prev => ({ ...prev, customLocation: '' }));
                    }
                  }}
                  layout="list"
                />
              ))}
            </div>
            {currentAnswer === 'Other' && (
              <div className="page-enter">
                <input
                  type="text"
                  placeholder="Enter location…"
                  value={datePlan.customLocation || ''}
                  onChange={e => setDatePlan(prev => ({ ...prev, customLocation: e.target.value }))}
                  className="w-full"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1.5px solid rgba(255,255,255,0.15)',
                    borderRadius: '16px',
                    color: 'white',
                    padding: '14px 18px',
                    fontSize: '15px',
                    outline: 'none',
                    fontFamily: "'Inter', sans-serif",
                    transition: 'all 0.25s',
                  }}
                  id="custom-location-input"
                  aria-label="Enter custom location"
                />
              </div>
            )}
          </div>
        );

      case 'message':
        return (
          <div className="space-y-3">
            <textarea
              placeholder="Write something… (optional) ❤️"
              value={datePlan.message || ''}
              onChange={e => setDatePlan(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
              id="personal-message"
              aria-label="Optional personal message"
            />
            <p className="text-white/30 text-xs text-right">{(datePlan.message || '').length}/200</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4 py-8">
      <div
        key={animKey}
        className="glass-card p-6 md:p-10 max-w-lg w-full space-y-6 page-enter"
      >
        {/* Progress */}
        <ProgressBar current={step + 1} total={totalSteps} />

        {/* Question */}
        <div className="space-y-1 pt-2">
          <h2
            className="text-xl md:text-2xl font-bold text-white leading-snug"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {q.question}
          </h2>
          {!q.required && (
            <p className="text-white/30 text-xs">This one is optional 😊</p>
          )}
        </div>

        {/* Validation message */}
        {validationMsg && (
          <div
            className="page-enter text-sm font-medium text-rose-300 flex items-center gap-2"
            role="alert"
          >
            <span>✨</span> {validationMsg}
          </div>
        )}

        {/* Question content */}
        <div>{renderQuestion()}</div>

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          {step > 0 && (
            <button
              className="back-btn px-5 py-3 text-sm flex-shrink-0"
              onClick={handleBack}
              id="back-btn"
              aria-label="Go back"
            >
              ← Back
            </button>
          )}
          <button
            className={`continue-btn px-6 py-3 text-sm font-semibold flex-1 ${
              q.required && !currentAnswer ? 'opacity-40 cursor-not-allowed' : ''
            }`}
            onClick={handleNext}
            id="continue-btn"
            aria-label={step === totalSteps - 1 ? 'See date plan' : 'Continue to next question'}
          >
            {step === totalSteps - 1 ? 'See My Date Plan ❤️' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  );
}
