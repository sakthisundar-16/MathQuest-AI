import React, { createContext, useContext, useState, useEffect } from 'react';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (type: 'click' | 'correct' | 'wrong' | 'celebrate' | 'whoosh') => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sound is opt-in, OFF / MUTED by default
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const saved = localStorage.getItem('mathquest_sound_enabled');
    return saved !== 'true'; // Default is muted (true)
  });

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem('mathquest_sound_enabled', (!next).toString());
      if (prev) {
        // Just unmuted, play a quick friendly cheerful confirmation chime
        playTone(523.25, 0.12, 'sine'); // C5
        setTimeout(() => playTone(659.25, 0.15, 'sine'), 100); // E5
      }
      return next;
    });
  };

  // Lightweight Web Audio API synthesizer for clean, instant chimes with zero external file dependencies
  const playTone = (freq: number, duration: number, type: OscillatorType = 'sine', gainVal = 0.15) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context might be restricted before first gesture; silently ignore
    }
  };

  const playSound = (type: 'click' | 'correct' | 'wrong' | 'celebrate' | 'whoosh') => {
    if (isMuted) return;

    switch (type) {
      case 'click':
        playTone(600, 0.05, 'triangle', 0.08);
        break;
      case 'correct':
        // Two-note joyful chime (G5 -> C6)
        playTone(783.99, 0.12, 'sine', 0.15);
        setTimeout(() => playTone(1046.50, 0.22, 'sine', 0.18), 120);
        break;
      case 'wrong':
        // Gentle soft bonk (no harsh buzzer)
        playTone(280, 0.18, 'triangle', 0.1);
        setTimeout(() => playTone(240, 0.22, 'triangle', 0.08), 120);
        break;
      case 'celebrate':
        // 4-note ascending fanfare
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          setTimeout(() => playTone(freq, 0.18, 'sine', 0.18), idx * 110);
        });
        break;
      case 'whoosh':
        playTone(350, 0.15, 'sine', 0.06);
        break;
    }
  };

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    return {
      isMuted: true,
      toggleMute: () => {},
      playSound: () => {}
    };
  }
  return context;
};
