// src/pages/Admin.jsx
import { useState, useEffect } from 'react';
import { fetchDateResponses, deleteDateResponse } from '../lib/dateResponseService';

function formatDate(val) {
  if (!val) return '—';
  try {
    return new Date(val + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch {
    return val;
  }
}

function formatTime(val) {
  if (!val) return '—';
  try {
    const [h, m] = val.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const display = hour % 12 === 0 ? 12 : hour % 12;
    return `${display}:${m} ${ampm}`;
  } catch {
    return val;
  }
}

function formatCreatedAt(val) {
  if (!val) return '';
  try {
    return new Date(val).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
    });
  } catch {
    return '';
  }
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sourceNote, setSourceNote] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setSourceNote('');
    try {
      const { data, error: sbError } = await fetchDateResponses();
      if (!sbError && Array.isArray(data) && data.length > 0) {
        setResponses(data);
        setSourceNote('🟢 Connected to Supabase (Live Database)');
      } else {
        // Check localStorage backup
        const local = JSON.parse(localStorage.getItem('local_date_responses') || '[]');
        if (local.length > 0) {
          setResponses(local);
          setSourceNote('💾 Showing responses saved in Local Storage');
        } else if (sbError) {
          setSourceNote(`⚠️ Supabase notice: ${sbError.message || 'Table not ready yet'}. Run supabase_schema.sql in Supabase SQL editor.`);
          setResponses([]);
        } else {
          setResponses([]);
          setSourceNote('✨ Connected to Supabase! No responses submitted yet.');
        }
      }
    } catch (err) {
      const local = JSON.parse(localStorage.getItem('local_date_responses') || '[]');
      if (local.length > 0) {
        setResponses(local);
        setSourceNote('💾 Showing local backup responses');
      } else {
        setSourceNote('⚠️ Could not connect to Supabase: ' + (err.message || 'network error'));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      loadData();
    }
  }, [authenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'date2024') {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Wrong password 😌');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this response?')) return;
    setDeletingId(id);
    try {
      if (String(id).startsWith('local-')) {
        const local = JSON.parse(localStorage.getItem('local_date_responses') || '[]');
        const updated = local.filter(r => r.id !== id);
        localStorage.setItem('local_date_responses', JSON.stringify(updated));
        setResponses(prev => prev.filter(r => r.id !== id));
      } else {
        await deleteDateResponse(id);
        setResponses(prev => prev.filter(r => r.id !== id));
      }
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
        <div className="glass-card p-8 max-w-sm w-full space-y-6 page-enter text-center">
          <div className="text-4xl animate-pulse-heart">🔐</div>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Admin Access
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter password…"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1.5px solid rgba(255,255,255,0.15)',
                borderRadius: '16px',
                color: 'white',
                padding: '14px 18px',
                fontSize: '15px',
                outline: 'none',
                width: '100%',
                fontFamily: "'Inter', sans-serif",
              }}
              id="admin-password"
              aria-label="Admin password"
            />
            {error && <p className="text-rose-400 text-sm">{error}</p>}
            <button
              type="submit"
              className="continue-btn w-full py-3 text-sm font-semibold"
              id="admin-login-btn"
            >
              Enter ❤️
            </button>
          </form>
          <p className="text-white/30 text-xs">Password: date2024</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start relative z-10 px-4 py-10">
      <div className="max-w-2xl w-full space-y-6 page-enter">
        {/* Top Header Card */}
        <div className="glass-card p-6 md:p-8 text-center space-y-3">
          <div className="text-3xl">💕</div>
          <h1 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Date Invitation Responses
          </h1>
          <p className="text-white/50 text-sm">
            {responses.length === 1 ? '1 response recorded' : `${responses.length} responses recorded`}
          </p>

          {sourceNote && (
            <div className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-rose-300 inline-block border border-rose-500/20 max-w-full truncate">
              {sourceNote}
            </div>
          )}

          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-1.5"
            >
              🔄 {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={() => setAuthenticated(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Responses List */}
        {responses.length === 0 ? (
          <div className="glass-card p-8 text-center space-y-3 text-white/50">
            <div className="text-3xl">💌</div>
            <p className="text-white/80 font-medium">No responses yet</p>
            <p className="text-xs text-white/40">
              When your date answers the invitation and clicks "Confirm Date", their choices will appear here in real time!
            </p>
          </div>
        ) : (
          responses.map((item, idx) => (
            <div key={item.id || idx} className="glass-card p-6 md:p-8 space-y-5 border border-rose-500/20">
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💖</span>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {item.name ? `${item.name}'s Response` : 'Date Response'}
                    </h2>
                    {item.created_at && (
                      <p className="text-white/40 text-xs">{formatCreatedAt(item.created_at)}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ✅ Said YES! ❤️
                  </span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="p-1.5 text-xs text-white/30 hover:text-rose-400 rounded-lg hover:bg-white/5 transition-all"
                    title="Delete response"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Answers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="summary-item">
                  <p className="text-white/40 text-xs uppercase tracking-wider">📅 Free Day</p>
                  <p className="text-white font-semibold mt-0.5">{item.free_day || item.freeDay || '—'}</p>
                </div>

                <div className="summary-item">
                  <p className="text-white/40 text-xs uppercase tracking-wider">✨ Vibe</p>
                  <p className="text-white font-semibold mt-0.5">{item.vibe || '—'}</p>
                </div>

                <div className="summary-item">
                  <p className="text-white/40 text-xs uppercase tracking-wider">🍴 Food</p>
                  <p className="text-white font-semibold mt-0.5">{item.food || '—'}</p>
                </div>

                <div className="summary-item">
                  <p className="text-white/40 text-xs uppercase tracking-wider">❤️ Perfect Date</p>
                  <p className="text-white font-semibold mt-0.5">{item.perfect_date || item.perfectDate || '—'}</p>
                </div>

                <div className="summary-item">
                  <p className="text-white/40 text-xs uppercase tracking-wider">🗓️ Date</p>
                  <p className="text-white font-semibold mt-0.5">{formatDate(item.date)}</p>
                </div>

                <div className="summary-item">
                  <p className="text-white/40 text-xs uppercase tracking-wider">⏰ Time</p>
                  <p className="text-white font-semibold mt-0.5">{formatTime(item.time)}</p>
                </div>
              </div>

              {/* Location */}
              <div className="summary-item">
                <p className="text-white/40 text-xs uppercase tracking-wider">📍 Location</p>
                <p className="text-white font-semibold mt-0.5">{item.location || '—'}</p>
              </div>

              {/* Sweet Message */}
              {item.message && (
                <div className="summary-item bg-rose-500/10 border-rose-500/20">
                  <p className="text-rose-300 text-xs uppercase tracking-wider font-semibold mb-1">
                    💬 Note from them:
                  </p>
                  <p className="text-white/90 text-sm italic">"{item.message}"</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
