import React from 'react';
import { motion, useReducedMotion, type Transition } from 'framer-motion';

export type QuestieMood = 'idle' | 'wave' | 'celebrating' | 'encouraging' | 'thinking' | 'running';

interface QuestieMascotProps {
  size?: number;
  mood?: QuestieMood;
  speech?: string;
  className?: string;
  onClick?: () => void;
}

/**
 * QuestieMascot: Full multi-part SVG character component.
 * - Supports states: idle, wave, celebrating, encouraging, thinking, running.
 * - Animates only transform and opacity.
 * - Honors prefers-reduced-motion.
 */
export const QuestieMascot: React.FC<QuestieMascotProps> = ({
  size = 300,
  mood = 'idle',
  speech,
  className = '',
  onClick
}) => {
  const prefersReduced = useReducedMotion();

  // Floating body animation for idle / wave
  const bodyFloat = prefersReduced
    ? {}
    : mood === 'celebrating'
    ? { y: [0, -24, 0], rotate: [0, -4, 4, 0] }
    : { y: [0, -8, 0] };

  const bodyTransition: Transition = mood === 'celebrating'
    ? { duration: 0.6, repeat: Infinity, ease: 'easeInOut' }
    : { duration: 4, repeat: Infinity, ease: 'easeInOut' };

  // Arm waving animation
  const isWaving = mood === 'wave' || mood === 'celebrating';

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`relative inline-flex flex-col items-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ width: size }}
    >
      {/* ─── SPEECH BUBBLE (Max 10 words, kid-friendly) ─── */}
      {speech && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative mb-3 px-4 py-2 bg-white text-indigo-950 font-heading font-black text-base sm:text-lg rounded-2xl border-3 border-sky-300 shadow-md text-center max-w-[260px] z-20"
        >
          <span>{speech}</span>
          {/* Speech bubble tail pointing down */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-3 border-b-3 border-sky-300 transform rotate-45" />
        </motion.div>
      )}

      {/* ─── MULTI-PART SVG CHARACTER RIG ─── */}
      <motion.div
        animate={bodyFloat}
        transition={bodyTransition}
        className="w-full flex items-center justify-center relative"
      >
        <svg
          viewBox="0 0 200 240"
          className="w-full h-auto drop-shadow-lg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground Soft Island Shadow */}
          <ellipse cx="100" cy="225" rx="55" ry="10" fill="#CBD5E1" opacity="0.6" />

          {/* 1. Adventurer Backpack (Behind Body) */}
          <rect x="52" y="105" width="96" height="80" rx="20" fill="#9A3412" stroke="#1E1B4B" strokeWidth="3.5" />
          <rect x="62" y="92" width="76" height="18" rx="8" fill="#FF7A59" stroke="#1E1B4B" strokeWidth="3" />
          {/* Rolled Math Parchment Map */}
          <rect x="135" y="100" width="22" height="48" rx="6" fill="#FEF3C7" stroke="#1E1B4B" strokeWidth="2.5" />
          <line x1="140" y1="112" x2="152" y2="112" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
          <line x1="140" y1="124" x2="152" y2="124" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />

          {/* 2. Expedition Boots */}
          <g id="boots">
            <rect x="62" y="200" width="28" height="26" rx="10" fill="#EA580C" stroke="#1E1B4B" strokeWidth="3" />
            <rect x="58" y="218" width="34" height="9" rx="4" fill="#9A3412" stroke="#1E1B4B" strokeWidth="2" />
            <circle cx="70" cy="210" r="2.5" fill="#FEF3C7" />
            <circle cx="80" cy="210" r="2.5" fill="#FEF3C7" />

            <rect x="110" y="200" width="28" height="26" rx="10" fill="#EA580C" stroke="#1E1B4B" strokeWidth="3" />
            <rect x="108" y="218" width="34" height="9" rx="4" fill="#9A3412" stroke="#1E1B4B" strokeWidth="2" />
            <circle cx="118" cy="210" r="2.5" fill="#FEF3C7" />
            <circle cx="128" cy="210" r="2.5" fill="#FEF3C7" />
          </g>

          {/* 3. Torso & Belly */}
          <ellipse cx="100" cy="155" rx="50" ry="46" fill="#38BDF8" stroke="#1E1B4B" strokeWidth="3.5" />
          <ellipse cx="100" cy="162" rx="32" ry="32" fill="#FEF3C7" stroke="#1E1B4B" strokeWidth="2.5" />
          
          {/* Subtle Math Feathers */}
          <path d="M92 152 L108 152 M100 144 L100 160" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M90 172 L110 172 M90 177 L110 177" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />

          {/* 4. Explorer Vest with Golden Compass Badge */}
          <path d="M60 135 C64 165 72 190 78 194 C82 170 78 140 74 135 Z" fill="#F59E0B" stroke="#1E1B4B" strokeWidth="3" />
          <path d="M140 135 C136 165 128 190 122 194 C118 170 122 140 126 135 Z" fill="#F59E0B" stroke="#1E1B4B" strokeWidth="3" />
          <circle cx="78" cy="152" r="7" fill="#FBBF24" stroke="#1E1B4B" strokeWidth="2" />
          <polygon points="78,148 81,152 78,156 75,152" fill="#EA580C" />

          {/* 5. Left Arm / Hand (Holds Magnifying Glass or Waves) */}
          <motion.g
            animate={
              isWaving && !prefersReduced
                ? { rotate: [0, 18, -8, 14, 0] }
                : {}
            }
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '52px 145px' }}
          >
            <path d="M52 145 C35 155 32 175 42 186 C50 180 55 165 54 148 Z" fill="#0284C7" stroke="#1E1B4B" strokeWidth="3" />
            <circle cx="34" cy="188" r="14" fill="#BAE6FD" stroke="#F59E0B" strokeWidth="3.5" opacity="0.85" />
            <line x1="42" y1="198" x2="52" y2="210" stroke="#9A3412" strokeWidth="4.5" strokeLinecap="round" />
          </motion.g>

          {/* 6. Right Arm (Waving Cheerfully) */}
          <motion.g
            animate={
              isWaving && !prefersReduced
                ? { rotate: [0, -22, 10, -18, 0] }
                : {}
            }
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            style={{ transformOrigin: '148px 145px' }}
          >
            <path d="M148 145 C165 130 178 120 172 105 C158 115 150 135 146 148 Z" fill="#0284C7" stroke="#1E1B4B" strokeWidth="3" />
            {/* Sparkle star in hand when waving */}
            {isWaving && (
              <polygon points="175,95 178,102 185,102 180,107 182,114 175,110 168,114 170,107 165,102 172,102" fill="#FBBF24" />
            )}
          </motion.g>

          {/* 7. Big Expressive Head (1.2 : 1 Proportions) */}
          <ellipse cx="100" cy="82" rx="54" ry="48" fill="#38BDF8" stroke="#1E1B4B" strokeWidth="4" />
          
          {/* Ear Tufts */}
          <polygon points="56,44 42,24 64,36" fill="#0284C7" stroke="#1E1B4B" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="144,44 158,24 136,36" fill="#0284C7" stroke="#1E1B4B" strokeWidth="3" strokeLinejoin="round" />

          {/* Explorer Hat */}
          <path d="M54 52 C60 30 140 30 146 52 C154 56 160 62 160 66 C150 68 50 68 40 66 C40 62 46 56 54 52 Z" fill="#1E1B4B" stroke="#1E1B4B" strokeWidth="3" />
          <rect x="52" y="48" width="96" height="8" fill="#F59E0B" />

          {/* Golden Goggles */}
          <rect x="66" y="34" width="28" height="20" rx="8" fill="#FBBF24" stroke="#1E1B4B" strokeWidth="3" />
          <circle cx="80" cy="44" r="8" fill="#E0F2FE" />
          <rect x="106" y="34" width="28" height="20" rx="8" fill="#FBBF24" stroke="#1E1B4B" strokeWidth="3" />
          <circle cx="120" cy="44" r="8" fill="#E0F2FE" />
          <line x1="94" y1="44" x2="106" y2="44" stroke="#F59E0B" strokeWidth="4" />

          {/* Eyes State Engine */}
          {mood === 'celebrating' ? (
            /* Star Eyes Eureka */
            <g>
              <circle cx="78" cy="86" r="19" fill="#FEF3C7" stroke="#1E1B4B" strokeWidth="3.5" />
              <polygon points="78,76 82,85 91,85 84,90 87,99 78,93 69,99 72,90 65,85 74,85" fill="#F59E0B" />
              <circle cx="122" cy="86" r="19" fill="#FEF3C7" stroke="#1E1B4B" strokeWidth="3.5" />
              <polygon points="122,76 126,85 135,85 128,90 131,99 122,93 113,99 116,90 109,85 118,85" fill="#F59E0B" />
            </g>
          ) : mood === 'encouraging' ? (
            /* Soft Encouraging Eyes */
            <g>
              <path d="M64 84 C70 76 84 76 90 84" stroke="#1E1B4B" strokeWidth="4" strokeLinecap="round" />
              <circle cx="78" cy="88" r="7" fill="#1E1B4B" />
              <circle cx="122" cy="86" r="18" fill="#FFFFFF" stroke="#1E1B4B" strokeWidth="3.5" />
              <circle cx="122" cy="86" r="10" fill="#1E1B4B" />
              <circle cx="125" cy="83" r="3.5" fill="#FFFFFF" />
            </g>
          ) : mood === 'thinking' ? (
            /* Looking Up Puzzled Eyes */
            <g>
              <circle cx="78" cy="86" r="19" fill="#FFFFFF" stroke="#1E1B4B" strokeWidth="3.5" />
              <circle cx="78" cy="78" r="9" fill="#1E1B4B" />
              <circle cx="122" cy="86" r="19" fill="#FFFFFF" stroke="#1E1B4B" strokeWidth="3.5" />
              <circle cx="122" cy="78" r="9" fill="#1E1B4B" />
              <circle cx="145" cy="40" r="12" fill="#FBBF24" stroke="#1E1B4B" strokeWidth="2.5" />
              <text x="141" y="45" fontSize="15" fontWeight="bold" fill="#1E1B4B">?</text>
            </g>
          ) : (
            /* Standard Warm Curious Eyes with Blink Keyframe */
            <g className="animate-[mascot-blink_4s_infinite]">
              <circle cx="78" cy="86" r="19" fill="#FFFFFF" stroke="#1E1B4B" strokeWidth="3.5" />
              <circle cx="82" cy="86" r="11" fill="#1E1B4B" />
              <circle cx="85" cy="82" r="4.5" fill="#FFFFFF" />
              <circle cx="79" cy="91" r="2" fill="#FFFFFF" />

              <circle cx="122" cy="86" r="19" fill="#FFFFFF" stroke="#1E1B4B" strokeWidth="3.5" />
              <circle cx="118" cy="86" r="11" fill="#1E1B4B" />
              <circle cx="121" cy="82" r="4.5" fill="#FFFFFF" />
              <circle cx="115" cy="91" r="2" fill="#FFFFFF" />
            </g>
          )}

          {/* Golden Beak */}
          {mood === 'celebrating' ? (
            <g>
              <polygon points="100,92 84,112 116,112" fill="#EA580C" stroke="#1E1B4B" strokeWidth="2.5" />
              <ellipse cx="100" cy="106" rx="8" ry="4" fill="#991B1B" />
            </g>
          ) : (
            <polygon points="100,94 88,108 112,108" fill="#EA580C" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
          )}

          {/* Rosy Cheeks */}
          <ellipse cx="60" cy="98" rx="8" ry="5" fill="#FF6FB5" opacity="0.45" />
          <ellipse cx="140" cy="98" rx="8" ry="5" fill="#FF6FB5" opacity="0.45" />
        </svg>
      </motion.div>
    </div>
  );
};
