import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass, ShieldCheck, ArrowRight, Zap, Trophy, Volume2, VolumeX, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuestieMascot, QuestieMood } from './QuestieMascot';
import { useSound } from '../context/SoundContext';

interface GrandEntryLoaderProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

const STAGES = [
  { progress: 25, message: 'Charting Math Island Coordinates...', icon: Compass, soundMilestone: 'click' as const },
  { progress: 55, message: 'Awakening 3D Platonic Polyhedra...', icon: Zap, soundMilestone: 'click' as const },
  { progress: 85, message: 'Aligning Georgia GSE Standards...', icon: ShieldCheck, soundMilestone: 'correct' as const },
  { progress: 100, message: 'Math Island Adventure Activated!', icon: Trophy, soundMilestone: 'celebrate' as const }
];

const MATH_GLYPHS = [
  { symbol: 'π', left: '8%', top: '22%', size: 'text-3xl sm:text-4xl', delay: 0 },
  { symbol: '½', left: '86%', top: '18%', size: 'text-2xl sm:text-3xl', delay: 0.6 },
  { symbol: '∑', left: '12%', top: '72%', size: 'text-3xl sm:text-4xl', delay: 1.2 },
  { symbol: '√x', left: '84%', top: '68%', size: 'text-2xl sm:text-3xl', delay: 1.8 },
  { symbol: '+', left: '22%', top: '35%', size: 'text-2xl', delay: 0.4 },
  { symbol: '×', left: '78%', top: '36%', size: 'text-2xl', delay: 1.0 },
  { symbol: '÷', left: '16%', top: '52%', size: 'text-3xl', delay: 1.5 },
  { symbol: '100%', left: '82%', top: '50%', size: 'text-xl font-black', delay: 2.0 },
  { symbol: '∞', left: '26%', top: '82%', size: 'text-3xl', delay: 0.8 },
  { symbol: '=', left: '72%', top: '84%', size: 'text-2xl', delay: 2.2 }
];

export const GrandEntryLoader: React.FC<GrandEntryLoaderProps> = ({
  onComplete,
  forceShow = false
}) => {
  const { playSound, isMuted, toggleMute } = useSound();
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (forceShow) return true;
    if (typeof window === 'undefined') return false;
    if (window.location.search.includes('intro=true') || window.location.search.includes('loader=true')) {
      return true;
    }
    return !sessionStorage.getItem('mathquest_entry_seen');
  });

  const [progress, setProgress] = useState<number>(0);
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [questieSpeech, setQuestieSpeech] = useState<string>("Ready to explore?");
  const [questieMood, setQuestieMood] = useState<QuestieMood>('wave');
  const [isExiting, setIsExiting] = useState<boolean>(false);

  const prevStageRef = useRef<number>(0);

  useEffect(() => {
    if (!isVisible) return;

    // Smooth progressive energy charging
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const step = Math.floor(Math.random() * 7) + 5;
        const next = Math.min(100, prev + step);

        let stage = 0;
        if (next >= 100) stage = 3;
        else if (next >= 85) stage = 2;
        else if (next >= 55) stage = 1;
        else stage = 0;

        setCurrentStageIdx(stage);
        return next;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [isVisible]);

  // Audio chimes on stage changes
  useEffect(() => {
    if (currentStageIdx !== prevStageRef.current) {
      prevStageRef.current = currentStageIdx;
      if (currentStageIdx < 3) {
        playSound('click');
      }
    }
  }, [currentStageIdx, playSound]);

  // Grand celebration trigger at 100%
  useEffect(() => {
    if (progress >= 100 && !isReady) {
      setIsReady(true);
      setQuestieMood('celebrating');
      setQuestieSpeech("Portal is open! Let's go!");
      playSound('celebrate');

      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#FFD23F', '#38BDF8', '#34D399', '#FB7185', '#F59E0B']
      });

      // Extra burst for grand feel
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0.2, y: 0.6 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 0.8, y: 0.6 }
        });
      }, 350);
    }
  }, [progress, isReady, playSound]);

  const handleEnter = () => {
    if (isExiting) return;
    setIsExiting(true);
    playSound('whoosh');
    sessionStorage.setItem('mathquest_entry_seen', 'true');

    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 600);
  };

  const handleQuestieClick = () => {
    playSound('correct');
    setQuestieMood('celebrating');
    setQuestieSpeech("I'm so excited to do math with you!");
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.5 } });
    setTimeout(() => {
      setQuestieMood(isReady ? 'celebrating' : 'wave');
      setQuestieSpeech(isReady ? "Portal open! Let's go!" : "Charging our math powers!");
    }, 2500);
  };

  if (!isVisible) return null;

  const currentStage = STAGES[currentStageIdx];
  const StageIcon = currentStage.icon;

  return (
    <AnimatePresence>
      <motion.div
        key="grand-loader"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.08 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[9999] flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none bg-gradient-to-b from-[#0284C7] via-[#38BDF8] to-[#E0F2FE]"
      >
        {/* ─── LAYER 1: ROTATING SUNBURST LIGHT RAYS ─── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-25">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
            className="w-[200vw] h-[200vw] max-w-[1800px] max-h-[1800px] flex-shrink-0"
            style={{
              background: `repeating-conic-gradient(
                from 0deg,
                rgba(255, 255, 255, 0.45) 0deg 15deg,
                transparent 15deg 30deg
              )`
            }}
          />
        </div>

        {/* ─── LAYER 2: WARM CELESTIAL GLOW ORBS ─── */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-amber-300/35 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-emerald-300/25 blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-sky-200/40 blur-3xl pointer-events-none" />

        {/* ─── LAYER 3: FLOATING MATHEMATICAL GLYPHS ─── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {MATH_GLYPHS.map((glyph, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 0, opacity: 0.2 }}
              animate={{
                y: [-12, 12, -12],
                rotate: [-8, 8, -8],
                opacity: [0.35, 0.7, 0.35]
              }}
              transition={{
                duration: 4.5 + (idx % 3),
                repeat: Infinity,
                delay: glyph.delay,
                ease: 'easeInOut'
              }}
              style={{ left: glyph.left, top: glyph.top }}
              className={`absolute font-heading font-black text-white/80 drop-shadow-md select-none ${glyph.size}`}
            >
              {glyph.symbol}
            </motion.div>
          ))}
        </div>

        {/* ─── TOP CONTROL BAR ─── */}
        <header className="relative z-20 flex items-center justify-between w-full max-w-6xl mx-auto">
          {/* Audio toggle button */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 hover:bg-white text-indigo-950 font-heading font-black text-xs sm:text-sm border-2 border-white/80 shadow-md backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">Sound: Off</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span className="hidden sm:inline">Sound: On</span>
              </>
            )}
          </button>

          {/* Quick Skip Button */}
          <button
            type="button"
            onClick={handleEnter}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/90 hover:bg-white text-indigo-950 font-heading font-black text-xs sm:text-sm border-2 border-white/80 shadow-md backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          >
            <span>Skip Intro</span>
            <ArrowRight className="w-4 h-4 text-indigo-900" />
          </button>
        </header>

        {/* ─── CENTER COMPOSITION: MASCOT + TITLE + POWER CONSOLE ─── */}
        <main className="relative z-10 flex flex-col items-center justify-center my-auto w-full max-w-md mx-auto text-center space-y-2 sm:space-y-2.5">
          
          {/* Floating Island Pedestal & Questie Mascot */}
          <div className="relative flex flex-col items-center">
            
            {/* Pulsing Energy Rings behind Questie */}
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.05, 1] }}
              transition={{
                rotate: { duration: 16, repeat: Infinity, ease: 'linear' },
                scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
              }}
              className="absolute -top-4 w-36 h-36 sm:w-44 sm:h-44 rounded-full border-3 sm:border-4 border-dashed border-amber-300/80 pointer-events-none"
            />
            <div className="absolute -top-2 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white/40 blur-xl pointer-events-none" />

            {/* Questie Mascot with Bobbing Float Motion */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 cursor-pointer"
              onClick={handleQuestieClick}
              title="Click Questie!"
            >
              <QuestieMascot
                size={105}
                mood={questieMood}
                speech={questieSpeech}
              />
            </motion.div>

            {/* Custom Grassy Floating Island Base */}
            <div className="relative -mt-7 sm:-mt-8 z-0">
              <svg viewBox="0 0 320 110" className="w-44 sm:w-52 h-auto drop-shadow-xl">
                {/* Underground Rocky Layers */}
                <path
                  d="M20,35 Q160,115 300,35 Q230,15 160,28 Q90,15 20,35 Z"
                  fill="#854D0E"
                />
                <path
                  d="M45,46 Q160,100 275,46 Q220,38 160,45 Q100,38 45,46 Z"
                  fill="#713F12"
                  opacity="0.55"
                />
                {/* Hanging Island Roots */}
                <path d="M120,68 Q125,92 118,102" stroke="#713F12" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M160,76 Q166,104 158,112" stroke="#713F12" strokeWidth="5" strokeLinecap="round" fill="none" />
                <path d="M200,68 Q194,94 202,105" stroke="#713F12" strokeWidth="4" strokeLinecap="round" fill="none" />
                
                {/* Lush Cartoon Grass Top */}
                <path
                  d="M10,32 C35,18 120,12 160,14 C200,12 285,18 310,32 C285,44 265,40 240,46 C215,40 195,48 160,42 C125,48 105,40 80,46 C55,40 35,44 10,32 Z"
                  fill="#22C55E"
                />
                <path
                  d="M18,30 C48,18 125,14 160,16 C195,14 272,18 302,30 C280,38 260,34 238,40 C216,34 196,40 160,36 C124,40 104,34 82,40 C60,34 40,38 18,30 Z"
                  fill="#4ADE80"
                />
                {/* Little Island Wildflower Dots */}
                <circle cx="75" cy="26" r="3.5" fill="#FDE047" />
                <circle cx="140" cy="23" r="3" fill="#F472B6" />
                <circle cx="245" cy="26" r="3.5" fill="#38BDF8" />
              </svg>
            </div>
          </div>

          {/* ─── 3D ARCADE GAME TITLE BANNER ─── */}
          <div className="flex flex-col items-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] sm:text-xs font-heading font-black uppercase tracking-wider shadow-sm border border-white/80">
              <Sparkles className="w-3 h-3 fill-amber-950 text-amber-950 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Georgia Standards of Excellence · Grades 5 &amp; 6</span>
            </div>

            {/* Radiant Golden 3D Arcade Title: 100% visible and bright */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-heading font-black tracking-wide leading-none select-none my-0.5"
              style={{
                color: '#FFE144',
                WebkitTextStroke: '2px #1E1B4B',
                textShadow: '0 4px 0 #B45309, 0 7px 0 #78350F, 0 10px 20px rgba(0,0,0,0.3)',
                filter: 'drop-shadow(0 2px 4px rgba(255,225,68,0.4))'
              }}
            >
              MATHQUEST
            </h1>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white font-heading font-black text-[11px] sm:text-xs tracking-widest uppercase shadow-sm border border-amber-300">
              <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200" />
              <span>THE ISLAND ADVENTURE</span>
              <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200" />
            </div>
          </div>

          {/* ─── ARCADE ENERGY CHARGING CONSOLE & ACTION BUTTON ─── */}
          <div className="w-full bg-white/95 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border-2 sm:border-3 border-sky-300 shadow-xl backdrop-blur-md space-y-2">
            
            {/* Stage Status & Percentage Readout */}
            <div className="flex items-center justify-between text-xs font-heading font-black text-indigo-950 px-1">
              <div className="flex items-center gap-2 text-slate-800 text-left min-w-0">
                <div className="w-5 h-5 rounded-md bg-sky-100 border border-sky-300 flex items-center justify-center text-blue-700 shadow-2xs flex-shrink-0">
                  <StageIcon className="w-3 h-3 animate-bounce" />
                </div>
                <span className="truncate">{currentStage.message}</span>
              </div>
              <div className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300 font-extrabold text-xs flex-shrink-0 ml-2">
                {progress}%
              </div>
            </div>

            {/* 3D Liquid Candy Progress Tube */}
            <div className="w-full h-4 sm:h-5 bg-sky-100 rounded-full p-0.5 border border-sky-300 overflow-hidden shadow-inner relative">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-sky-400 to-emerald-400 relative overflow-hidden shadow-sm"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.15 }}
              >
                {/* Shiny diagonal candy stripe sheen */}
                <div className="absolute inset-0 opacity-25 bg-[linear-gradient(45deg,rgba(255,255,255,0.7)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.7)_50%,rgba(255,255,255,0.7)_75%,transparent_75%,transparent)] bg-[length:16px_16px] animate-[moveStripe_1s_linear_infinite]" />
              </motion.div>
            </div>

            {/* 4 Step Milestones */}
            <div className="grid grid-cols-4 gap-1 pt-0.5 text-[10px] font-heading font-black">
              {STAGES.map((s, idx) => {
                const isPassed = progress >= s.progress;
                return (
                  <div key={idx} className="flex flex-col items-center text-center space-y-0.5">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                        isPassed
                          ? 'bg-emerald-500 border-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 border-slate-300 text-slate-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-2.5 h-2.5" /> : <div className="w-1 h-1 rounded-full bg-slate-300" />}
                    </div>
                    <span className={`text-[9px] sm:text-[10px] leading-tight ${isPassed ? 'text-indigo-950 font-bold' : 'text-slate-400'}`}>
                      {idx === 0 ? 'Islands' : idx === 1 ? '3D Gems' : idx === 2 ? 'Standards' : 'Ready!'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── ACTION BUTTON OR PULSING READY STATE (PERFECTLY CENTERED & WITHIN VIEW) ─── */}
          <div className="w-full flex items-center justify-center pt-0.5">
            {isReady ? (
              <motion.button
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: [1, 1.03, 1], opacity: 1 }}
                transition={{
                  scale: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEnter}
                className="w-full py-3 px-8 rounded-2xl bg-[#FFD23F] hover:bg-[#FACC15] text-[#1E1B4B] font-heading font-black text-base sm:text-lg shadow-[0_5px_0_#C49405] hover:shadow-[0_2px_0_#C49405] hover:translate-y-[3px] border-2 border-[#1E1B4B] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>ENTER ADVENTURE</span>
                <ArrowRight className="w-5 h-5 text-[#1E1B4B] stroke-[3]" />
              </motion.button>
            ) : (
              <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur-md text-indigo-950 text-xs font-heading font-black border border-white/90 shadow-xs w-full">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                <span>Powering up interactive mathematical worlds...</span>
              </div>
            )}
          </div>

        </main>

        {/* ─── FOOTER CREDITS ─── */}
        <footer className="relative z-10 text-center text-xs font-heading font-bold text-white/80 py-1 drop-shadow-xs">
          Built for Grade 5 &amp; 6 Learners · Georgia Standards of Excellence (GSE)
        </footer>

        {/* ─── CURTAIN REVEAL WIPE PANELS (WHEN CLICKING ENTER) ─── */}
        <AnimatePresence>
          {isExiting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 pointer-events-none flex"
            >
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: '-100%' }}
                transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
                className="w-1/2 h-full bg-[#0284C7] border-r-4 border-amber-300"
              />
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: '100%' }}
                transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
                className="w-1/2 h-full bg-[#0284C7] border-l-4 border-amber-300"
              />
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </AnimatePresence>
  );
};

export default GrandEntryLoader;
