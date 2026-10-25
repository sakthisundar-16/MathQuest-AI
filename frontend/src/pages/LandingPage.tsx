import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass, ArrowRight, Flame, Trophy,
  BookOpen, Check, Milestone, HelpCircle,
  Sparkles, CheckCircle2, UtensilsCrossed, Store,
  Building2, FlaskConical, Thermometer, PieChart,
  Coins, Ruler, Scale, Castle, Zap, MapPin, Lightbulb,
  Sun, LucideIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { api, getStudentId } from '../services/api';
import { useGrade } from '../context/GradeContext';
import { useSound } from '../context/SoundContext';
import { QuestieMascot, QuestieMood } from '../components/QuestieMascot';
import { InteractiveFractionPizza } from '../components/InteractiveFractionPizza';
import type { DashboardData } from '../types';

// ─── 1. REAL-WORLD QUEST STORIES ──────────────────────────────────────────────
interface QuestStory {
  id: string;
  icon: LucideIcon;
  character: string;
  role: string;
  story: string;
  challenge: string;
  topic: string;
  grade: 5 | 6;
  standard: string;
  xpReward: number;
  badge: string;
}

const QUEST_STORIES: QuestStory[] = [
  {
    id: 'pizza-fractions',
    icon: UtensilsCrossed,
    character: 'Chef Marco',
    role: 'Artisan Pizzeria Master',
    story: 'Marco needs to split 3 whole artisan pizzas equally among 8 hungry birthday guests without dropping a single crumb!',
    challenge: 'Calculate exact fractional portions and common denominators.',
    topic: 'g5-fractions',
    grade: 5,
    standard: 'GSE 5.NF.1',
    xpReward: 150,
    badge: 'Fraction Kingdom'
  },
  {
    id: 'market-decimals',
    icon: Store,
    character: 'Manager Priya',
    role: 'Supermarket Inventory Lead',
    story: 'Priya is reconciling cash register receipts down to hundredths of a dollar during the weekend morning rush.',
    challenge: 'Align place-value columns and compute multi-item decimal totals.',
    topic: 'g5-decimals',
    grade: 5,
    standard: 'GSE 5.NBT.7',
    xpReward: 120,
    badge: 'Decimal Dunes'
  },
  {
    id: 'blueprint-geometry',
    icon: Building2,
    character: 'Architect Ben',
    role: 'Urban Playground Designer',
    story: 'Ben is laying synthetic turf around an L-shaped adventure playground and needs the exact perimeter and total square meterage.',
    challenge: 'Decompose composite rectilinear shapes to solve perimeter and area.',
    topic: 'g5-geometry',
    grade: 5,
    standard: 'GSE 5.G.2',
    xpReward: 130,
    badge: 'Geometry Grove'
  },
  {
    id: 'juice-ratios',
    icon: FlaskConical,
    character: 'Alchemist Raj',
    role: 'Flavor Chemistry Formulator',
    story: 'Raj is crafting a top-secret tropical mango punch with a precise 3:2 fruit-to-sparkling-water ratio for 100 sports fans.',
    challenge: 'Multiply scale factors and solve proportional rate tables.',
    topic: 'g6-ratios',
    grade: 6,
    standard: 'GSE 6.RP.1',
    xpReward: 160,
    badge: 'Ratio Rapids'
  },
  {
    id: 'weather-integers',
    icon: Thermometer,
    character: 'Dr. Ana',
    role: 'Arctic Meteorologist',
    story: 'Dr. Ana is measuring blizzard temperatures dropping from +4°C down by 11 degrees at the Polar Weather Base.',
    challenge: 'Navigate positive and negative numbers on the vertical number line.',
    topic: 'g6-integers',
    grade: 6,
    standard: 'GSE 6.NS.5',
    xpReward: 140,
    badge: 'Integer Icefields'
  }
];

// ─── 2. QUICK BRAIN WARMUP QUESTIONS ──────────────────────────────────────────
interface WarmupQuestion {
  question: string;
  grade: number;
  options: string[];
  correct: string;
  hint: string;
  topicTitle: string;
}

const WARMUP_QUESTIONS: WarmupQuestion[] = [
  {
    question: 'Chef Marco has 3/8 of a pizza, and adds another 4/8. How much pizza does he have?',
    grade: 5,
    options: ['7/16', '7/8', '12/8', '1 whole'],
    correct: '7/8',
    hint: 'When denominators match, just add the numerators: 3 + 4 = 7!',
    topicTitle: 'Grade 5 Fractions'
  },
  {
    question: 'Which decimal is strictly GREATER: 0.7 or 0.25?',
    grade: 5,
    options: ['0.25', '0.7', 'They are equal', 'Neither'],
    correct: '0.7',
    hint: 'Think tenths! 0.7 is 0.70 (70 hundredths), which is bigger than 25 hundredths (0.25).',
    topicTitle: 'Grade 5 Decimals'
  },
  {
    question: 'A juice recipe uses 2 cups of lemon for every 6 cups of water. What is the simplified ratio?',
    grade: 6,
    options: ['2:6', '1:3', '1:2', '3:1'],
    correct: '1:3',
    hint: 'Divide both parts by their greatest common factor (2): 2÷2 = 1 and 6÷2 = 3!',
    topicTitle: 'Grade 6 Ratios'
  },
  {
    question: 'The temperature starts at 3°C and drops by 7°C. What is the new temperature?',
    grade: 6,
    options: ['-4°C', '+4°C', '-10°C', '0°C'],
    correct: '-4°C',
    hint: 'Start at +3 on the number line and jump 7 steps left: 3 - 7 = -4!',
    topicTitle: 'Grade 6 Integers'
  }
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { grade, setGrade } = useGrade();
  const { playSound } = useSound();

  // Questie Mascot State
  const [mascotMood, setMascotMood] = useState<QuestieMood>('wave');
  const [questieSpeech, setQuestieSpeech] = useState<string>("Let's explore Math Island together!");

  // Mini Brain Warmup State
  const [warmupIdx, setWarmupIdx] = useState<number>(() => {
    const idx = WARMUP_QUESTIONS.findIndex(q => q.grade === grade);
    return idx !== -1 ? idx : 0;
  });
  const [warmupSelected, setWarmupSelected] = useState<string | null>(null);
  const [warmupStatus, setWarmupStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [earnedBonusXP, setEarnedBonusXP] = useState<number>(0);

  // Teacher / Parent Standards Drawer
  const [showTeacherInfo, setShowTeacherInfo] = useState<boolean>(false);

  // Real Dashboard Data (No invented metrics)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const studentId = getStudentId();
    api.getDashboard(studentId, grade)
      .then((data) => setDashboardData(data))
      .catch(() => {});
  }, [grade]);

  // Handle grade change reactively
  const handleGradeSwitch = useCallback((newGrade: number) => {
    if (newGrade === grade) return;
    playSound('whoosh');
    setGrade(newGrade);
    const newWarmupIdx = WARMUP_QUESTIONS.findIndex(q => q.grade === newGrade);
    if (newWarmupIdx !== -1) {
      setWarmupIdx(newWarmupIdx);
      setWarmupSelected(null);
      setWarmupStatus('idle');
    }
  }, [grade, playSound, setGrade]);

  // Warmup question check
  const handleWarmupAnswer = useCallback((option: string) => {
    if (warmupStatus === 'correct') return;
    const currentQ = WARMUP_QUESTIONS[warmupIdx];
    setWarmupSelected(option);

    if (option === currentQ.correct) {
      playSound('correct');
      setWarmupStatus('correct');
      setEarnedBonusXP((xp) => xp + 25);
      setMascotMood('celebrating');
      setQuestieSpeech('Woohoo! Outstanding math thinking!');
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 }
      });
      setTimeout(() => setMascotMood('wave'), 3000);
    } else {
      playSound('wrong');
      setWarmupStatus('wrong');
      setMascotMood('encouraging');
      setQuestieSpeech("Great try! Let's check the hint together!");
      setTimeout(() => setMascotMood('wave'), 3500);
    }
  }, [warmupIdx, warmupStatus, playSound]);

  const currentWarmup = WARMUP_QUESTIONS[warmupIdx];

  // Filter stories for adventure map
  const gradeStories = useMemo(() => {
    return QUEST_STORIES.filter(s => s.grade === grade);
  }, [grade]);

  return (
    <div className="relative w-full bg-transparent text-[#1E1B4B] space-y-16 sm:space-y-24">

      {/* ──────────────────────────────────────────────────────────────────────────
          1. SUNNY HERO SECTION (Transparent over WorldBackground)
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex flex-col justify-center pt-4 pb-12">
        
        {/* Central Adventure Composition */}
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column (7 cols): Kid-Friendly Headline, Realm Chooser & Chunky CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Kicker Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border-2 border-sky-200 text-sky-900 text-[16px] font-heading font-black shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span>Your next adventure starts here!</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight leading-[1.08] text-[#1E1B4B]">
              Ready for a Math{' '}
              <span className="relative inline-block text-[#FFD23F] drop-shadow-[0_4px_0_#C49405] [text-shadow:_2px_2px_0_#1E1B4B,_-2px_-2px_0_#1E1B4B,_2px_-2px_0_#1E1B4B,_-2px_2px_0_#1E1B4B]">
                Adventure?
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-slate-700 text-lg sm:text-xl font-body font-bold max-w-xl leading-relaxed">
              Explore magical floating islands, solve fun puzzles with Chef Marco and Dr. Ana, and level up your math powers!
            </p>

            {/* ─── REALM CHOOSER (Two Large Chunky Buttons) ─── */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white/95 border-3 border-sky-200 shadow-md max-w-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[16px] font-heading font-black text-indigo-950 uppercase tracking-wide">
                  Choose Your Island Realm:
                </span>
                <span className="text-[16px] font-extrabold text-sky-700 flex items-center gap-1.5">
                  {grade === 5 ? (
                    <>
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span>Morning Sky</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-pink-500" />
                      <span>Golden-Hour Dusk</span>
                    </>
                  )}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Grade 5 Realm Button */}
                <button
                  type="button"
                  onClick={() => handleGradeSwitch(5)}
                  className={`p-3.5 rounded-2xl font-heading font-black text-[16px] flex items-center justify-between transition-all cursor-pointer ${
                    grade === 5
                      ? 'bg-[#FFD23F] text-[#1E1B4B] border-b-5 border-[#C49405] shadow-md ring-3 ring-amber-300'
                      : 'bg-white text-[#1E1B4B] border-2 border-sky-200 border-b-5 border-slate-300 hover:bg-sky-50'
                  }`}
                >
                  <div className="text-left">
                    <span className="block text-[17px] flex items-center gap-1.5">
                      <Castle className="w-4 h-4 text-amber-700" />
                      <span>Grade 5 Realm</span>
                    </span>
                    <span className="text-xs font-bold opacity-80">Fractions &amp; Decimals</span>
                  </div>
                  {grade === 5 && <Check className="w-5 h-5 text-[#1E1B4B] stroke-[3]" />}
                </button>

                {/* Grade 6 Realm Button */}
                <button
                  type="button"
                  onClick={() => handleGradeSwitch(6)}
                  className={`p-3.5 rounded-2xl font-heading font-black text-[16px] flex items-center justify-between transition-all cursor-pointer ${
                    grade === 6
                      ? 'bg-[#FFD23F] text-[#1E1B4B] border-b-5 border-[#C49405] shadow-md ring-3 ring-amber-300'
                      : 'bg-white text-[#1E1B4B] border-2 border-sky-200 border-b-5 border-slate-300 hover:bg-sky-50'
                  }`}
                >
                  <div className="text-left">
                    <span className="block text-[17px] flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-indigo-700" />
                      <span>Grade 6 Realm</span>
                    </span>
                    <span className="text-xs font-bold opacity-80">Ratios &amp; Integers</span>
                  </div>
                  {grade === 6 && <Check className="w-5 h-5 text-[#1E1B4B] stroke-[3]" />}
                </button>
              </div>
            </div>

            {/* ─── PRIMARY ACTION BUTTONS ─── */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                to="/learn"
                onClick={() => playSound('click')}
                className="btn-chunky btn-chunky-accent text-[#1E1B4B] gap-2.5 text-lg"
              >
                <Compass className="w-6 h-6 text-[#1E1B4B]" />
                <span>Start Your Adventure</span>
                <ArrowRight className="w-6 h-6" />
              </Link>

              <a
                href="#adventure-trail"
                onClick={() => playSound('click')}
                className="btn-chunky btn-chunky-white text-[#1E1B4B] gap-2 text-lg"
              >
                <Milestone className="w-5 h-5 text-amber-500" />
                <span>Explore Learning Worlds</span>
              </a>
            </div>

            {/* ─── COLLAPSIBLE "FOR TEACHERS & PARENTS" DRAWER ─── */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowTeacherInfo(!showTeacherInfo)}
                className="inline-flex items-center gap-2 text-[16px] font-heading font-bold text-sky-800 hover:text-sky-950 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-sky-600" />
                <span>{showTeacherInfo ? 'Hide Standards Info' : 'For Teachers & Parents (Georgia Standards)'}</span>
              </button>

              <AnimatePresence>
                {showTeacherInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-2 p-4 rounded-2xl bg-white/95 border-2 border-sky-200 text-slate-700 text-[16px] space-y-1 shadow-xs"
                  >
                    <p className="font-bold text-indigo-950">
                      Curriculum Alignment: Georgia Standards of Excellence (GSE)
                    </p>
                    <p>• <strong>Grade 5:</strong> Fractions (5.NF.1–7), Place Value &amp; Decimals (5.NBT.1–7), Geometry &amp; Volume (5.G.1–2, 5.MD.3–5).</p>
                    <p>• <strong>Grade 6:</strong> Ratios &amp; Proportions (6.RP.1–3), Number Systems &amp; Negative Integers (6.NS.1–8), Algebraic Expressions (6.EE.1–9).</p>
                    <p className="text-xs text-slate-500 pt-1">All answers and difficulty progression computed deterministically via Python backend.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Right Column (5 cols): 300px Waving Questie & Interactive Fraction Pizza */}
          <div className="lg:col-span-5 flex flex-col items-center space-y-6">
            
            {/* Questie on Floating Island (No tiny avatar card) */}
            <div className="relative flex flex-col items-center">
              <QuestieMascot
                size={290}
                mood={mascotMood}
                speech={questieSpeech}
                onClick={() => {
                  playSound('celebrate');
                  setMascotMood('celebrating');
                  setQuestieSpeech("You clicked me! Let's solve math!");
                  confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
                  setTimeout(() => setMascotMood('wave'), 2500);
                }}
              />
            </div>

            {/* Chef Marco's Interactive Fraction Pizza (Replaces 3D Gem) */}
            <InteractiveFractionPizza
              onSliceClick={(fraction) => {
                setQuestieSpeech(`Yum! That's ${fraction} of Chef Marco's pizza!`);
              }}
            />

          </div>

        </div>

      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          2. QUICK BRAIN WARMUP (Cloud-White Card with Treasure Border)
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="relative max-w-4xl mx-auto w-full px-2 sm:px-4">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-3 border-amber-300 shadow-xl space-y-5">
          
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-amber-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600 shadow-2xs">
                <Sparkles className="w-4 h-4 fill-amber-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-black text-indigo-950">
                Quick Brain Warmup
              </h2>
            </div>
            <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-heading font-black text-[16px]">
              {currentWarmup.topicTitle}
            </div>
          </div>

          <p className="font-body font-bold text-[20px] sm:text-[22px] text-[#1E1B4B] leading-snug">
            {currentWarmup.question}
          </p>

          {/* 2x2 Big Answer Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentWarmup.options.map((option) => {
              const isSelected = warmupSelected === option;
              const isCorrect = option === currentWarmup.correct;

              let btnClass = 'bg-white text-[#1E1B4B] border-2 border-sky-200 border-b-4 border-slate-300 hover:border-amber-400 hover:bg-amber-50/50';
              if (isSelected && warmupStatus === 'correct') {
                btnClass = 'bg-[#3DDC97] text-[#064E3B] border-2 border-[#1FA86A] border-b-4 border-[#1FA86A] shadow-md';
              } else if (isSelected && warmupStatus === 'wrong') {
                btnClass = 'bg-[#FF6FB5]/20 text-[#1E1B4B] border-2 border-rose-300 border-b-4 border-rose-400';
              }

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleWarmupAnswer(option)}
                  className={`min-h-[58px] p-3.5 rounded-2xl font-heading font-black text-[18px] sm:text-[20px] transition-all cursor-pointer flex items-center justify-between ${btnClass}`}
                >
                  <span>{option}</span>
                  {isSelected && isCorrect && <Check className="w-6 h-6 text-[#064E3B] stroke-[3]" />}
                </button>
              );
            })}
          </div>

          {/* Correct feedback */}
          {warmupStatus === 'correct' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 font-heading font-bold text-[17px] flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-emerald-600" />
                <span>Spot on! +25 Warmup XP Unlocked!</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setWarmupIdx((prev) => (prev + 1) % WARMUP_QUESTIONS.length);
                  setWarmupSelected(null);
                  setWarmupStatus('idle');
                }}
                className="text-amber-800 hover:text-amber-950 underline font-black cursor-pointer"
              >
                Next Challenge →
              </button>
            </motion.div>
          )}

          {/* Hint feedback (No harsh red) */}
          {warmupStatus === 'wrong' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-[16px] leading-relaxed flex items-start gap-2"
            >
              <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Coach Tip:</span> {currentWarmup.hint}
              </div>
            </motion.div>
          )}

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          3. REALM DESTINATIONS (Cloud-White Cards)
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="learning-worlds" className="relative max-w-7xl mx-auto space-y-8 scroll-mt-24">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-2 border-sky-200 text-sky-900 text-[16px] font-heading font-black shadow-xs">
            <Milestone className="w-4 h-4 text-amber-500" />
            <span>Curriculum Destinations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-indigo-950 tracking-tight">
            Two Island Realms of Discovery
          </h2>
          <p className="text-slate-600 text-lg font-medium leading-relaxed">
            Step through an island portal tailored to your curriculum standards.
          </p>
        </div>

        {/* Grand Realm Portals Grid (Cloud-White Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Realm 1: Grade 5 Kingdom */}
          <div className={`p-8 rounded-3xl bg-white border-3 transition-all flex flex-col justify-between shadow-lg ${
            grade === 5 ? 'border-amber-400 ring-4 ring-amber-300/40' : 'border-sky-200 hover:border-sky-300'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-xl bg-amber-100 text-amber-950 font-heading font-black text-[16px] flex items-center gap-1.5">
                  <Castle className="w-4 h-4 text-amber-700" />
                  <span>Grade 5 Realm</span>
                </span>
                <span className="text-[16px] font-heading font-black text-emerald-700 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Morning Sky
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-heading font-black text-indigo-950">
                  The Kingdom of Fractions &amp; Decimals
                </h3>
                <p className="text-slate-600 text-[17px] mt-2 leading-relaxed font-medium">
                  Join Chef Marco and Manager Priya in balancing pizza bakeries, currency registers, and playground blueprints.
                </p>
              </div>

              {/* Featured Quests */}
              <div className="space-y-2 pt-2">
                <span className="text-[16px] font-heading font-black text-slate-500 uppercase tracking-wide">Featured Quests:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-3 rounded-xl bg-sky-50 border-2 border-sky-100 text-[16px] font-bold text-indigo-950 flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Fraction Slicing</span>
                  </div>
                  <div className="p-3 rounded-xl bg-sky-50 border-2 border-sky-100 text-[16px] font-bold text-indigo-950 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    <span>Currency Decimals</span>
                  </div>
                  <div className="p-3 rounded-xl bg-sky-50 border-2 border-sky-100 text-[16px] font-bold text-indigo-950 flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span>2D Perimeter Grids</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => {
                  handleGradeSwitch(5);
                  navigate('/learn');
                }}
                className="w-full btn-chunky btn-chunky-accent text-[#1E1B4B] gap-2 text-base"
              >
                <span>Enter Grade 5 Realm</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Realm 2: Grade 6 Dominion */}
          <div className={`p-8 rounded-3xl bg-white border-3 transition-all flex flex-col justify-between shadow-lg ${
            grade === 6 ? 'border-amber-400 ring-4 ring-amber-300/40' : 'border-sky-200 hover:border-sky-300'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-xl bg-indigo-100 text-indigo-950 font-heading font-black text-[16px] flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-indigo-700" />
                  <span>Grade 6 Realm</span>
                </span>
                <span className="text-[16px] font-heading font-black text-pink-700 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-pink-600" />
                  Golden-Hour Dusk
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-heading font-black text-indigo-950">
                  The Dominion of Ratios &amp; Integers
                </h3>
                <p className="text-slate-600 text-[17px] mt-2 leading-relaxed font-medium">
                  Join Alchemist Raj and Dr. Ana on high-altitude expeditions. Master unit rate scaling, negative temperatures, and equation balance citadels.
                </p>
              </div>

              {/* Featured Quests */}
              <div className="space-y-2 pt-2">
                <span className="text-[16px] font-heading font-black text-slate-500 uppercase tracking-wide">Featured Quests:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-3 rounded-xl bg-amber-50 border-2 border-amber-100 text-[16px] font-bold text-indigo-950 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Unit Rate Ratios</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border-2 border-amber-100 text-[16px] font-bold text-indigo-950 flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Sub-Zero Integers</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border-2 border-amber-100 text-[16px] font-bold text-indigo-950 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span>Variable Citadel</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => {
                  handleGradeSwitch(6);
                  navigate('/learn');
                }}
                className="w-full btn-chunky btn-chunky-primary text-white gap-2 text-base"
              >
                <span>Enter Grade 6 Realm</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          4. ADVENTURE TRAIL MAP (Duolingo-style Winding Level Nodes)
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="adventure-trail" className="relative max-w-7xl mx-auto space-y-8 scroll-mt-24">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border-2 border-sky-200 text-sky-900 text-[16px] font-heading font-black">
              <MapPin className="w-4 h-4 text-sky-700" />
              <span>Interactive Quest Trail</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-indigo-950 tracking-tight mt-1">
              Grade {grade} Mathematics Quest Map
            </h2>
            <p className="text-slate-600 text-lg font-medium mt-1">
              Follow the winding path of discovery. Each milestone features scaffolded lessons and practice.
            </p>
          </div>
        </div>

        {/* Trail Milestones Grid (Cloud-White Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gradeStories.map((story, idx) => {
            const StoryIcon = story.icon;
            return (
              <div
                key={story.id}
                className="p-6 rounded-3xl bg-white border-3 border-sky-200 hover:border-amber-400 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 font-heading font-black text-sm flex items-center justify-center border-2 border-blue-300">
                        {idx + 1}
                      </span>
                      <div className="p-2 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-700">
                        <StoryIcon className="w-6 h-6" />
                      </div>
                    </div>
                    <span className="text-[16px] font-heading font-black text-amber-700 flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      +{story.xpReward} XP
                    </span>
                  </div>

                  <div>
                    <div className="text-[16px] font-heading font-black text-sky-800">
                      {story.role}
                    </div>
                    <h3 className="text-xl font-heading font-black text-indigo-950 mt-0.5">
                      {story.character}: {story.badge}
                    </h3>
                    <p className="text-[16px] text-slate-600 mt-2 leading-relaxed font-medium">
                      {story.story}
                    </p>
                  </div>
                </div>

                {/* Dual Actions */}
                <div className="pt-6 grid grid-cols-2 gap-3">
                  <Link
                    to={`/lesson/${story.topic}`}
                    onClick={() => playSound('click')}
                    className="py-3 px-4 rounded-2xl bg-sky-50 hover:bg-sky-100 text-indigo-950 font-heading font-black text-[16px] text-center flex items-center justify-center gap-1.5 border-2 border-sky-200 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-sky-700" />
                    <span>Lesson</span>
                  </Link>

                  <Link
                    to={`/quiz/${story.topic}`}
                    onClick={() => playSound('click')}
                    className="btn-chunky btn-chunky-primary text-white text-[16px] !min-h-[46px] !py-2.5"
                  >
                    <span>Practice</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          5. STUDENT PROGRESS OVERVIEW (Cloud-White Card)
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border-3 border-sky-200 shadow-xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-sky-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[16px] font-heading font-black text-amber-800">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Your Adventure Progress</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-indigo-950">
                Milestones &amp; Badges
              </h2>
            </div>

            <Link
              to="/dashboard"
              onClick={() => playSound('click')}
              className="btn-chunky btn-chunky-accent text-[#1E1B4B] text-[16px] !min-h-[48px] !py-2.5 self-start sm:self-auto"
            >
              <span>Go to My Adventure</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Metric Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-orange-50 border-2 border-orange-200 space-y-1">
              <div className="text-[16px] font-heading font-bold text-orange-800">Daily Streak</div>
              <div className="text-3xl font-heading font-black text-orange-950 flex items-center gap-1.5">
                <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
                <span>{dashboardData?.student?.streak_days || 1}d</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 space-y-1">
              <div className="text-[16px] font-heading font-bold text-emerald-800">Total XP Points</div>
              <div className="text-3xl font-heading font-black text-emerald-950">
                {(dashboardData?.total_points ?? 0) + earnedBonusXP} XP
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-sky-50 border-2 border-sky-200 space-y-1">
              <div className="text-[16px] font-heading font-bold text-sky-800">Topics Explored</div>
              <div className="text-3xl font-heading font-black text-indigo-950">
                {dashboardData?.topic_progress?.length || 0}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-50 border-2 border-indigo-200 space-y-1">
              <div className="text-[16px] font-heading font-bold text-indigo-800">Current Realm</div>
              <div className="text-3xl font-heading font-black text-indigo-950">
                Grade {grade}
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default LandingPage;
