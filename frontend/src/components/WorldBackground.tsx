import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useGrade } from '../context/GradeContext';
import { Floating3DBackground } from './Floating3DBackground';

/**
 * WorldBackground: Animated "Math Island Adventure" 2D & 3D ambient environment.
 * - Grade 5: Morning-Bright Sky with soft puffy clouds, 3D rotating polyhedra, & emerald floating islands.
 * - Grade 6: Golden-Hour / Dusk Island Sky with warm peach, sunset pink & 3D math crystals.
 * - 60fps performance: Canvas 3D rendering + GPU transform keyframes.
 * - Respects prefers-reduced-motion & pauses offscreen.
 */
export const WorldBackground: React.FC = () => {
  const { grade } = useGrade();
  const prefersReduced = useReducedMotion();
  const [isTabVisible, setIsTabVisible] = useState(true);

  // Pause off-screen animations when document is hidden (battery/performance discipline)
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const isGrade6 = grade === 6;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none transition-colors duration-700"
    >
      {/* ─── ATMOSPHERIC SKY GRADIENT ─── */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isGrade6
            ? 'bg-gradient-to-b from-[#FDBA74] via-[#F472B6]/40 via-60% to-[#C084FC]/30'
            : 'bg-gradient-to-b from-[#7DD3FC]/80 via-[#BAE6FD]/40 to-[#F0F9FF]'
        }`}
      />

      {/* ─── 3D FLOATING MATHEMATICAL POLYHEDRA CANVAS ─── */}
      <Floating3DBackground isGrade6={isGrade6} />

      {/* ─── FLOATING SUN / DUSK ORB ─── */}
      <motion.div
        initial={false}
        animate={
          prefersReduced || !isTabVisible
            ? { y: 0 }
            : { y: [0, -12, 0] }
        }
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className={`absolute top-6 right-8 sm:top-12 sm:right-20 w-32 h-32 sm:w-44 sm:h-44 rounded-full transition-all duration-1000 ${
          isGrade6
            ? 'bg-gradient-to-tr from-[#F59E0B] to-[#F43F5E] shadow-[0_0_60px_rgba(244,63,94,0.45)]'
            : 'bg-gradient-to-tr from-[#FDE047] to-[#F59E0B] shadow-[0_0_60px_rgba(253,224,71,0.5)]'
        }`}
      >
        {/* Soft Sun Ray Rings */}
        <div
          className={`absolute -inset-4 rounded-full border-4 border-dashed transition-colors duration-1000 ${
            isGrade6 ? 'border-pink-300/30' : 'border-amber-200/40'
          } animate-spin-slow`}
        />
      </motion.div>

      {/* ─── 2D ANIMATED MATH HOT AIR BALLOON ─── */}
      <motion.div
        animate={
          prefersReduced || !isTabVisible
            ? { y: 0, x: 0 }
            : { y: [0, -22, 0], x: [0, 14, 0] }
        }
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-28 left-[12%] hidden md:block w-20 h-28 opacity-80 drop-shadow-md"
      >
        <svg viewBox="0 0 100 130" className="w-full h-full">
          {/* Balloon Envelope */}
          <path
            d="M50 10 C20 10 10 35 15 65 C20 85 40 100 45 105 L55 105 C60 100 80 85 85 65 C90 35 80 10 50 10 Z"
            fill={isGrade6 ? '#F43F5E' : '#3B82F6'}
          />
          {/* Decorative Balloon Stripes */}
          <path
            d="M50 10 C35 10 30 35 34 65 C38 85 45 105 45 105 L55 105 C55 105 62 85 66 65 C70 35 65 10 50 10 Z"
            fill={isGrade6 ? '#FDE047' : '#F59E0B'}
          />
          <path
            d="M50 10 C42 10 40 35 43 65 C45 85 48 105 48 105 L52 105 C52 105 55 85 57 65 C60 35 58 10 50 10 Z"
            fill="#FFFFFF"
          />
          {/* Math Symbol on Balloon */}
          <text x="50" y="60" textAnchor="middle" fill="#1E1B4B" fontSize="18" fontWeight="900" fontFamily="sans-serif">
            {isGrade6 ? 'x' : '∑'}
          </text>
          {/* Ropes */}
          <line x1="44" y1="105" x2="42" y2="118" stroke="#78350F" strokeWidth="1.5" />
          <line x1="56" y1="105" x2="58" y2="118" stroke="#78350F" strokeWidth="1.5" />
          {/* Wicker Basket */}
          <rect x="40" y="118" width="20" height="12" rx="3" fill="#B45309" stroke="#78350F" strokeWidth="1" />
        </svg>
      </motion.div>

      {/* ─── DRIFTING PUFFY 2D VECTOR CLOUDS (Transform only) ─── */}
      {/* Cloud Layer 1: High & Slow */}
      <div className="absolute top-16 left-[-10%] w-[120%] h-32 animate-cloud-drift-1">
        <svg
          viewBox="0 0 600 120"
          className={`w-96 sm:w-[500px] h-auto drop-shadow-sm transition-colors duration-1000 ${
            isGrade6 ? 'fill-rose-100/70' : 'fill-white/85'
          }`}
        >
          <path d="M50 80 Q70 40 120 50 Q160 20 220 40 Q280 10 340 45 Q390 30 430 60 Q480 50 510 80 Q530 110 50 110 Z" />
        </svg>
      </div>

      {/* Cloud Layer 2: Mid Drift */}
      <div className="absolute top-44 right-[-5%] w-[110%] h-32 animate-cloud-drift-2">
        <svg
          viewBox="0 0 500 100"
          className={`w-80 sm:w-[420px] h-auto ml-auto drop-shadow-sm transition-colors duration-1000 ${
            isGrade6 ? 'fill-sky-100/60' : 'fill-white/75'
          }`}
        >
          <path d="M40 70 Q60 30 110 40 Q150 15 200 35 Q250 10 300 40 Q350 25 390 55 Q440 60 460 80 Q470 100 40 100 Z" />
        </svg>
      </div>

      {/* ─── DISTANT FLOATING MATH ISLANDS ─── */}
      {/* Distant Island Left */}
      <motion.div
        animate={
          prefersReduced || !isTabVisible
            ? { y: 0 }
            : { y: [0, -10, 0] }
        }
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 -left-12 sm:left-4 w-44 sm:w-64 opacity-85"
      >
        <svg viewBox="0 0 200 120" className="w-full drop-shadow-md">
          {/* Earth Body */}
          <path
            d="M20 50 Q100 30 180 50 Q170 100 100 115 Q30 100 20 50 Z"
            fill={isGrade6 ? '#78350F' : '#854D0E'}
          />
          {/* Grassy Top */}
          <path
            d="M15 50 Q100 25 185 50 Q180 65 170 65 Q160 55 150 65 Q130 55 120 65 Q100 55 90 65 Q70 55 60 65 Q40 55 30 65 Q20 55 15 50 Z"
            fill={isGrade6 ? '#F59E0B' : '#4ADE80'}
          />
          {/* Floating Flag */}
          <polygon points="100,20 108,35 92,35" fill={isGrade6 ? '#F43F5E' : '#38BDF8'} />
        </svg>
      </motion.div>

      {/* Distant Island Right */}
      <motion.div
        animate={
          prefersReduced || !isTabVisible
            ? { y: 0 }
            : { y: [0, -14, 0] }
        }
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-1/2 -right-10 sm:right-6 w-48 sm:w-72 opacity-85"
      >
        <svg viewBox="0 0 200 120" className="w-full drop-shadow-md">
          <path
            d="M25 48 Q100 28 175 48 Q165 95 100 110 Q35 95 25 48 Z"
            fill={isGrade6 ? '#78350F' : '#854D0E'}
          />
          <path
            d="M20 48 Q100 22 180 48 Q175 62 165 62 Q155 52 145 62 Q125 52 115 62 Q95 52 85 62 Q65 52 55 62 Q35 52 25 62 Q20 52 20 48 Z"
            fill={isGrade6 ? '#F59E0B' : '#4ADE80'}
          />
          {/* Mini windmill / telescope */}
          <line x1="120" y1="20" x2="120" y2="40" stroke="#1E1B4B" strokeWidth="3" />
          <circle cx="120" cy="20" r="5" fill="#FFD23F" />
        </svg>
      </motion.div>

      {/* ─── FLOATING TRANSLUCENT MATH BUBBLES ─── */}
      <motion.div
        animate={
          prefersReduced || !isTabVisible
            ? { y: 0 }
            : { y: [0, -18, 0], rotate: [0, 5, 0] }
        }
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 hidden lg:flex items-center justify-center w-14 h-14 rounded-full bg-white/70 backdrop-blur-xs border-2 border-sky-300 shadow-sm text-sky-800 font-black text-xl font-heading"
      >
        {isGrade6 ? '3:2' : '½'}
      </motion.div>

      <motion.div
        animate={
          prefersReduced || !isTabVisible
            ? { y: 0 }
            : { y: [0, -15, 0], rotate: [0, -6, 0] }
        }
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-2/3 right-1/4 hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-white/70 backdrop-blur-xs border-2 border-amber-300 shadow-sm text-amber-800 font-black text-lg font-heading"
      >
        {isGrade6 ? '-5°' : '¾'}
      </motion.div>

      <motion.div
        animate={
          prefersReduced || !isTabVisible
            ? { y: 0 }
            : { y: [0, -12, 0] }
        }
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute bottom-20 left-1/3 hidden lg:flex items-center justify-center w-11 h-11 rounded-full bg-white/70 backdrop-blur-xs border-2 border-blue-300 shadow-sm text-blue-800 font-black text-base font-heading"
      >
        π
      </motion.div>
    </div>
  );
};

