// src/components/MusicToggle.jsx
import { useState, useRef, useCallback } from 'react';

// A lightweight, looping ambient melody using Web Audio API
function createAmbientMusic(audioCtx) {
  const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88]; // C major
  const melody = [4, 5, 6, 5, 4, 2, 0, 2, 4, 4, 4]; // note indices
  const durations = [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.8, 0.4, 0.4, 0.4, 0.8];

  let time = audioCtx.currentTime + 0.1;
  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.5);
  gainNode.connect(audioCtx.destination);

  const reverb = audioCtx.createConvolver();
  gainNode.connect(reverb);
  reverb.connect(audioCtx.destination);

  function playNote(freq, startTime, duration) {
    const osc = audioCtx.createOscillator();
    const noteGain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    noteGain.gain.setValueAtTime(0, startTime);
    noteGain.gain.linearRampToValueAtTime(0.5, startTime + 0.05);
    noteGain.gain.linearRampToValueAtTime(0.3, startTime + duration * 0.5);
    noteGain.gain.linearRampToValueAtTime(0, startTime + duration - 0.05);

    osc.connect(noteGain);
    noteGain.connect(gainNode);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  function scheduleMelody() {
    let t = audioCtx.currentTime + 0.1;
    melody.forEach((noteIdx, i) => {
      playNote(notes[noteIdx], t, durations[i]);
      t += durations[i];
    });
    // Loop
    setTimeout(() => {
      if (!audioCtx.state || audioCtx.state !== 'closed') {
        scheduleMelody();
      }
    }, melody.reduce((a, _, i) => a + durations[i], 0) * 1000);
  }

  scheduleMelody();
  return gainNode;
}

export default function MusicToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const gainRef = useRef(null);

  const toggle = useCallback(() => {
    if (!isPlaying) {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        gainRef.current = createAmbientMusic(audioCtxRef.current);
      } else if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      setIsPlaying(true);
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.suspend();
      }
      setIsPlaying(false);
    }
  }, [isPlaying]);

  return (
    <button
      className="music-btn"
      onClick={toggle}
      aria-label={isPlaying ? 'Pause music' : 'Play music'}
      id="music-toggle-btn"
    >
      {isPlaying ? '🎵 Music ON' : '🎵 Music'}
    </button>
  );
}
