import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  Sparkles, CheckCircle2, XCircle, ArrowRight, Award, AlertCircle,
  RefreshCw, Lightbulb, Flame, Shield, BookOpen,
  Compass, Zap, PenTool, Gamepad2, Heart,
  PieChart, Coins, Ruler, Hash, Box, BarChart3,
  Scale, Thermometer, Divide, Shapes, TrendingUp, LucideIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { api, getStudentId, getStoredGrade } from '../services/api';
import { Question, AnswerResult } from '../types';
import { AskAITutorDrawer } from '../components/AskAITutorDrawer';
import { InteractiveMathGameCanvas } from '../components/InteractiveMathGameCanvas';
import { QuestieMascot } from '../components/QuestieMascot';
import { useSound } from '../context/SoundContext';

// Contextual math mission framing per topic
const QUEST_CONTEXTS: Record<string, { scenario: string; character: string; mission: string; badgeIcon: LucideIcon }> = {
  'g5-fractions': {
    character: 'Chef Marco',
    mission: 'Recipe Sizing Quest',
    scenario: 'Calculate exact fraction portions and common denominators for the culinary feast!',
    badgeIcon: PieChart
  },
  'g5-decimals': {
    character: 'Manager Priya',
    mission: 'Island Currency Audit',
    scenario: 'Compute prices and market coins with precision down to hundredths!',
    badgeIcon: Coins
  },
  'g5-geometry': {
    character: 'Architect Ben',
    mission: 'Perimeter Blueprinting',
    scenario: 'Determine geometric boundary lengths and polygon perimeters for playground builds.',
    badgeIcon: Ruler
  },
  'g5-place-value': {
    character: 'Data Analyst Zara',
    mission: 'Number Scale Journey',
    scenario: 'Analyze number representations across Lakhs and Millions systems.',
    badgeIcon: Hash
  },
  'g5-factors-multiples': {
    character: 'Scientist Mia',
    mission: 'Factor Grid Matrix',
    scenario: 'Find common factors and LCM arrays to power the island lab gear.',
    badgeIcon: Sparkles
  },
  'g5-measurement-area': {
    character: 'Designer Leo',
    mission: 'Island Area Mapping',
    scenario: 'Compute surface dimensions and square unit coverage for town facilities.',
    badgeIcon: Ruler
  },
  'g5-volume-powers': {
    character: 'Logistics Lead Sam',
    mission: '3D Volume Routing',
    scenario: 'Determine cubic container capacity and powers of ten for shipping routes.',
    badgeIcon: Box
  },
  'g5-data-handling': {
    character: 'Analyst Aisha',
    mission: 'Data Chart Detective',
    scenario: 'Interpret bar representations and frequency distributions for regional charts.',
    badgeIcon: BarChart3
  },
  'g6-ratios': {
    character: 'Formulator Raj',
    mission: 'Proportion Mixing',
    scenario: 'Balance chemical and beverage proportions using scale multipliers.',
    badgeIcon: Scale
  },
  'g6-integers': {
    character: 'Dr. Ana',
    mission: 'Signed Number Line',
    scenario: 'Track signed quantities above and below zero on elevation gauges.',
    badgeIcon: Thermometer
  },
  'g6-algebra': {
    character: 'Lead Developer Kai',
    mission: 'Equation Modeling',
    scenario: 'Construct algebraic expressions and solve equations to unlock secret gates.',
    badgeIcon: Compass
  },
  'g6-fractions-division': {
    character: 'Baker Emma',
    mission: 'Reciprocal Division',
    scenario: 'Divide fractional quantities evenly using inverse multiplication rules.',
    badgeIcon: Divide
  },
  'g6-decimals-play': {
    character: 'Economist Sofia',
    mission: 'Multi-Step Decimals',
    scenario: 'Calculate multi-currency conversions and decimal quotients with speed.',
    badgeIcon: Coins
  },
  'g6-lines-angles': {
    character: 'Engineer Omar',
    mission: 'Truss Angle Survey',
    scenario: 'Identify acute, obtuse, and complementary angles in suspension bridges.',
    badgeIcon: Compass
  },
  'g6-geometry-area': {
    character: 'Director Torres',
    mission: 'Composite Polygon Map',
    scenario: 'Decompose complex polygons into triangles and rectangles to find total area.',
    badgeIcon: Shapes
  },
  'g6-data-handling': {
    character: 'Statistician Nina',
    mission: 'Mean & Median Explorer',
    scenario: 'Compute mean, median, and range values across experimental datasets.',
    badgeIcon: TrendingUp
  }
};

const ENCOURAGEMENT_WRONG = [
  "Great thinking! Every mistake helps build deeper insight. Here is the step-by-step reasoning:",
  "Almost there! Let's examine the mathematical principle together:",
  "Good effort! Here is the standard way to approach this calculation:",
  "Keep persevering! Analyzing this step will strengthen your math superpower:",
  "Constructive try! Review the visual deduction below to lock in the method:"
];

const ENCOURAGEMENT_CORRECT = [
  "Brilliant! You calculated that with exact mathematical precision!",
  "Lightning-fast deduction! That is precisely right!",
  "Outstanding reasoning! Concept fully verified!",
  "Masterful solution! Your logical approach is top-tier!",
  "Superb work! You unlocked full XP on this problem!"
];

export const QuizPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { playSound } = useSound();

  const initialTierParam = searchParams.get('tier') || 'adaptive';

  const [activeTier, setActiveTier] = useState<string>(initialTierParam);
  const [attemptId, setAttemptId] = useState<string>('');
  const [question, setQuestion] = useState<Question | null>(null);
  const [qNumber, setQNumber] = useState<number>(1);
  const [totalQuestions, setTotalQuestions] = useState<number>(4);
  const [difficulty, setDifficulty] = useState<string>('easy');
  const [correctStreak, setCorrectStreak] = useState<number>(0);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<AnswerResult | null>(null);
  const [sessionPoints, setSessionPoints] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [lives, setLives] = useState<number>(3);
  const [encouragementMsg, setEncouragementMsg] = useState<string>('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hintData, setHintData] = useState<{ hint: string; socratic_question: string; source: string } | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState<boolean>(false);
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);
  const [showScratchpad, setShowScratchpad] = useState<boolean>(false);

  const questContext = topicId ? QUEST_CONTEXTS[topicId] : null;

  const initQuiz = useCallback(async (tid: string, tier: string = 'adaptive') => {
    setLoading(true);
    setLives(3);
    setCorrectStreak(0);
    setSessionPoints(0);
    setHintData(null);
    setSelectedOption(null);
    setFeedback(null);
    setErrorMsg(null);

    try {
      const studentId = getStudentId();
      const grade = getStoredGrade();
      const isLocked = tier !== 'adaptive';
      const chosenDiff = isLocked ? tier : undefined;

      const session = await api.startQuiz(studentId, tid, grade, 4, chosenDiff, isLocked);
      setAttemptId(session.attempt_id);
      setQuestion(session.current_question);
      setQNumber(session.question_number);
      setTotalQuestions(session.total_questions);
      setDifficulty(session.initial_difficulty);
    } catch (e) {
      console.error('Failed to start quiz session', e);
      setErrorMsg('Failed to load challenge. Please retry.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (topicId) initQuiz(topicId, activeTier);
  }, [topicId, activeTier, initQuiz]);

  const handleSwitchTier = (tier: string) => {
    playSound('click');
    setActiveTier(tier);
    if (topicId) initQuiz(topicId, tier);
  };

  const handleRequestHint = async () => {
    if (!question || isLoadingHint || hintData) return;
    playSound('click');
    setIsLoadingHint(true);
    try {
      const studentId = getStudentId();
      const grade = getStoredGrade();
      const res = await api.getAIHint({
        student_id: studentId,
        question_id: question.question_id,
        topic_id: question.topic_id,
        grade,
        question_text: question.question_text,
        current_options: question.options
      });
      setHintData(res);
      playSound('whoosh');
    } catch (e) {
      console.error('Failed to get hint', e);
    } finally {
      setIsLoadingHint(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedOption || !question || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const studentId = getStudentId();
      const res = await api.submitAnswer(attemptId, studentId, question.question_id, selectedOption);
      setFeedback(res);

      if (res.is_correct) {
        const nextStreak = correctStreak + 1;
        setCorrectStreak(nextStreak);
        setSessionPoints((prev) => prev + res.points_awarded);
        const msg = ENCOURAGEMENT_CORRECT[Math.floor(Math.random() * ENCOURAGEMENT_CORRECT.length)];
        setEncouragementMsg(msg);

        if (nextStreak >= 3) {
          playSound('celebrate');
        } else {
          playSound('correct');
        }

        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        playSound('wrong');
        setCorrectStreak(0);
        setLives((l) => Math.max(0, l - 1));
        const msg = ENCOURAGEMENT_WRONG[Math.floor(Math.random() * ENCOURAGEMENT_WRONG.length)];
        setEncouragementMsg(msg);
      }
    } catch (e) {
      console.error('Error submitting answer', e);
      setErrorMsg('Network issue submitting answer. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    playSound('whoosh');
    setLoading(true);
    setSelectedOption(null);
    setFeedback(null);
    setHintData(null);

    try {
      const nextData = await api.getNextQuestion(attemptId);
      if (nextData.has_next && nextData.question) {
        setQuestion(nextData.question);
        setQNumber(nextData.question_number || qNumber + 1);
        setDifficulty(nextData.difficulty || difficulty);
      } else {
        try {
          await api.completeQuiz(attemptId);
        } catch (compErr) {
          console.warn('Quiz already completed or error completing', compErr);
        }
        navigate(`/results/${attemptId}`);
      }
    } catch (e) {
      console.error('Error getting next question', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 select-none p-4">
        <div className="h-44 bg-white/95 rounded-3xl border-3 border-sky-200 shadow-md flex items-center justify-center p-8">
          <div className="flex items-center gap-4">
            <QuestieMascot mood="thinking" size={90} />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-sky-100 rounded-full animate-pulse" />
              <div className="h-4 w-64 bg-sky-50 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
        <div className="h-64 bg-white/90 rounded-3xl border-3 border-sky-200 animate-pulse" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4 bg-white/95 rounded-3xl border-3 border-sky-200 shadow-xl p-6">
        <QuestieMascot mood="thinking" size={90} className="mx-auto" />
        <h2 className="text-2xl font-heading font-black text-indigo-950">Quiz Arena Needs a Quick Recharge</h2>
        <p className="text-[16px] text-slate-600">We could not load the challenge session.</p>
        <button
          onClick={() => topicId && initQuiz(topicId, activeTier)}
          className="btn-chunky-primary inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Arena</span>
        </button>
      </div>
    );
  }

  const difficultyConfig: Record<string, { label: string; xp: number; icon: React.FC<{ className?: string }> }> = {
    easy: { label: 'Explorer', xp: 10, icon: Compass },
    medium: { label: 'Adventurer', xp: 20, icon: Zap },
    hard: { label: 'Champion', xp: 30, icon: Flame }
  };
  const diff = difficultyConfig[difficulty] || difficultyConfig.easy;
  const DiffIcon = diff.icon;
  const progressPct = Math.round(((qNumber - 1 + (feedback ? 1 : 0)) / totalQuestions) * 100);

  // Questie mood logic
  const questieMood = feedback
    ? (feedback.is_correct ? 'celebrating' : 'encouraging')
    : isSubmitting
    ? 'thinking'
    : 'idle';

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-20 px-2 sm:px-4">

      {/* ─── DIFFICULTY TIER SELECTION TABS ─── */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-2.5 shadow-md border-3 border-sky-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 pl-2">
          <Gamepad2 className="w-5 h-5 text-indigo-700" />
          <span className="text-xs font-heading font-black uppercase text-indigo-950 tracking-wider">
            Practice Tier:
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {(['easy', 'medium', 'hard', 'adaptive'] as const).map((tierKey) => {
            const isActive = activeTier === tierKey;
            const labels: Record<string, string> = {
              easy: 'Easy (10 XP)',
              medium: 'Med (20 XP)',
              hard: 'Hard (30 XP)',
              adaptive: 'Adaptive'
            };
            return (
              <button
                key={tierKey}
                onClick={() => handleSwitchTier(tierKey)}
                className={`px-3 py-1.5 rounded-2xl text-xs font-heading font-black transition-transform active:scale-95 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md border-b-3 border-blue-800'
                    : 'bg-sky-50 text-indigo-950 hover:bg-sky-100 border border-sky-200'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-indigo-950'}>{labels[tierKey]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── SUNNY QUEST CONTEXT HEADER (REPLACES OLD DARK NAVY BANNER) ─── */}
      {questContext && (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-lg border-3 border-sky-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-700 flex-shrink-0 shadow-2xs">
              <questContext.badgeIcon className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[13px] font-heading font-black uppercase px-2.5 py-0.5 rounded-full bg-sky-100 text-indigo-900 border border-sky-200">
                  {questContext.mission}
                </span>
                <span className="text-[14px] font-heading font-bold text-amber-800">
                  Guide: {questContext.character}
                </span>
              </div>
              <p className="text-[15px] text-slate-700 mt-1 leading-snug line-clamp-2">
                {questContext.scenario}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playSound('click');
              setShowScratchpad(!showScratchpad);
            }}
            aria-label={showScratchpad ? 'Close Scratchpad' : 'Open Scratchpad'}
            className={`px-3 py-2 rounded-2xl font-heading font-black text-xs flex items-center gap-1.5 transition-transform active:scale-95 flex-shrink-0 border-2 ${
              showScratchpad
                ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm'
                : 'bg-white text-indigo-950 hover:bg-sky-50 border-sky-200 shadow-2xs'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span className="hidden sm:inline">{showScratchpad ? 'Close Pad' : 'Scratchpad'}</span>
          </button>
        </div>
      )}

      {/* ─── TOP GAMING HUD (CHALLENGE / DIFFICULTY / LIVES / COMBO / XP) ─── */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border-3 border-sky-200 p-3 sm:p-4 shadow-md flex items-center justify-between gap-3 flex-wrap">
        {/* Challenge counter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-heading font-black text-slate-500 uppercase tracking-wider">Quest</span>
          <span className="font-heading font-black text-indigo-950 text-xl">{qNumber}</span>
          <span className="text-xs font-bold text-slate-400">/ {totalQuestions}</span>
        </div>

        {/* Difficulty Tier */}
        <span className="px-3 py-1 rounded-full text-xs font-heading font-black border-2 border-sky-200 bg-sky-50 text-indigo-950 flex items-center gap-1 shadow-2xs">
          <DiffIcon className="w-3.5 h-3.5 text-blue-700" />
          <span>{diff.label} · +{diff.xp} XP</span>
        </span>

        {/* 3 Heart Shields */}
        <div className="flex items-center gap-1" role="status" aria-label={`${lives} hearts remaining`}>
          {[0, 1, 2].map((i) => (
            <Heart
              key={i}
              className={`w-5 h-5 transition-transform duration-300 ${
                i < lives
                  ? 'text-rose-500 fill-rose-500 scale-100'
                  : 'text-slate-200 fill-slate-200 scale-90'
              }`}
            />
          ))}
        </div>

        {/* Points Display */}
        <div className="flex items-center gap-1 text-amber-950 font-heading font-black text-[15px] bg-amber-100 px-3 py-1 rounded-full border-2 border-amber-300 shadow-2xs">
          <Award className="w-4 h-4 text-amber-600 fill-amber-500" />
          <span>{sessionPoints} XP</span>
        </div>
      </div>

      {/* ─── COMBO STREAK FLAME BANNER (IF STREAK >= 2) ─── */}
      <AnimatePresence>
        {correctStreak >= 2 && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 18 }}
            className="rounded-2xl p-3 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 border-3 border-amber-600 text-slate-950 font-heading font-black text-center shadow-lg flex items-center justify-center gap-2"
          >
            <Flame className="w-6 h-6 text-red-600 fill-red-500 animate-bounce" />
            <span className="text-[17px] tracking-wide">
              {correctStreak}X COMBO FRENZY! YOU ARE UNSTOPPABLE!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── PROGRESS BAR ─── */}
      <div className="relative w-full bg-white/90 rounded-full h-4 p-0.5 border-2 border-sky-200 overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(progressPct, 5)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600"
        />
      </div>

      {/* ─── OPTIONAL 2D INTERACTIVE SCRATCHPAD ─── */}
      {showScratchpad && (
        <InteractiveMathGameCanvas
          topicId={topicId}
          difficulty={difficulty}
          streakCount={correctStreak}
          isOpen={showScratchpad}
        />
      )}

      {/* ─── QUESTION CARD (MOBILE-SAFE: QUESTION & ANSWERS COME FIRST) ─── */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border-3 border-sky-200 p-6 sm:p-8 shadow-xl space-y-6">

        {/* Top Header of Question Card: Socratic controls + mini Questie corner badge */}
        <div className="flex items-center justify-between gap-3 flex-wrap border-b-2 border-sky-100 pb-4">
          <div className="flex items-center gap-3">
            {/* Small Questie Corner Badge (Compact on mobile <480px, perfectly contained) */}
            <div className="w-12 h-12 rounded-2xl bg-sky-100 border-2 border-sky-200 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-2xs">
              <QuestieMascot mood={questieMood} size={44} />
            </div>

            <div>
              <div className="text-xs font-heading font-bold text-indigo-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{question.learning_objective || 'Core Standard Practice'}</span>
              </div>
              <span className="text-[14px] font-heading font-black text-indigo-950">
                Question {qNumber} of {totalQuestions}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Review Lesson */}
            <Link
              to={`/lesson/${topicId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-2xl text-xs font-heading font-black text-indigo-950 bg-sky-50 hover:bg-sky-100 border-2 border-sky-200 transition-colors shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-700" />
              <span>Lesson</span>
            </Link>

            {/* Ask AI Tutor */}
            <button
              type="button"
              onClick={() => {
                playSound('click');
                setIsTutorOpen(true);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-2xl text-xs font-heading font-black text-amber-950 bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Ask Tutor</span>
            </button>

            {/* Socratic Hint */}
            {!feedback && (
              <button
                type="button"
                onClick={handleRequestHint}
                disabled={isLoadingHint || hintData !== null}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-2xl text-xs font-heading font-black text-amber-950 bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 transition-colors shadow-2xs disabled:opacity-50"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>{isLoadingHint ? 'Thinking...' : hintData ? 'Hint Active' : 'Get Hint'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Question Text */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-heading font-black text-indigo-950 leading-snug">
            {question.question_text}
          </h2>
        </div>

        {/* Socratic Hint Card */}
        {hintData && !feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-3xl bg-amber-50/90 border-3 border-amber-300 text-amber-950 space-y-2"
          >
            <p className="text-[16px] font-medium leading-relaxed">
              <strong className="font-heading font-black text-amber-900">Questie's Clue:</strong> {hintData.hint}
            </p>
            <div className="bg-amber-100/90 p-3 rounded-2xl border border-amber-200">
              <p className="text-[15px] text-amber-950 font-heading font-bold">
                <span>Think about this:</span> {hintData.socratic_question}
              </p>
            </div>
          </motion.div>
        )}

        {/* ─── 4 CHUNKY ANSWER TILES (MIN 58PX TOUCH TARGET) ─── */}
        <div className="space-y-3.5">
          {question.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            let optionStyles = 'border-sky-200 bg-white hover:border-blue-300 hover:bg-sky-50/50 text-indigo-950 shadow-sm cursor-pointer';

            if (feedback) {
              if (opt.id === feedback.correct_option_id) {
                // Correct mint answer state
                optionStyles = 'border-emerald-500 bg-emerald-100/90 text-emerald-950 font-bold ring-4 ring-emerald-200 shadow-md';
              } else if (isSelected && !feedback.is_correct) {
                // Soft rose wrong state with gentle feedback
                optionStyles = 'border-rose-400 bg-rose-50 text-rose-950 font-bold opacity-90';
              } else {
                optionStyles = 'border-slate-200 bg-slate-50 text-slate-400 opacity-50';
              }
            } else if (isSelected) {
              optionStyles = 'border-blue-600 bg-blue-50 text-blue-950 font-black shadow-md ring-4 ring-blue-200';
            }

            return (
              <motion.button
                key={opt.id}
                type="button"
                disabled={feedback !== null || isSubmitting}
                onClick={() => {
                  playSound('click');
                  setSelectedOption(opt.id);
                }}
                animate={
                  feedback && isSelected && !feedback.is_correct
                    ? { x: [-4, 4, -4, 4, 0] }
                    : {}
                }
                transition={{ duration: 0.3 }}
                className={`w-full min-h-[58px] text-left p-4 sm:p-5 rounded-3xl border-3 transition-all flex items-center justify-between gap-3 ${optionStyles}`}
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <span className={`w-9 h-9 rounded-2xl flex items-center justify-center font-heading font-black text-base flex-shrink-0 shadow-2xs border-2 ${
                    isSelected && !feedback
                      ? 'bg-blue-600 text-white border-blue-700'
                      : feedback && opt.id === feedback.correct_option_id
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-sky-100 text-indigo-950 border-sky-200'
                  }`}>
                    {opt.id}
                  </span>
                  <span className="text-[17px] font-heading font-bold leading-normal break-words">
                    {opt.text}
                  </span>
                </div>

                {feedback && opt.id === feedback.correct_option_id && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-700 flex-shrink-0" />
                )}
                {feedback && isSelected && !feedback.is_correct && (
                  <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-4 rounded-3xl bg-rose-50 border-2 border-rose-200 text-rose-900 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span className="font-medium">{errorMsg}</span>
            </div>
            <button
              onClick={() => topicId && initQuiz(topicId, activeTier)}
              className="text-xs font-heading font-bold text-rose-700 underline hover:text-rose-900"
            >
              Retry
            </button>
          </div>
        )}

        {/* ─── ACTION BUTTON ─── */}
        {!feedback ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedOption || isSubmitting}
            className="w-full btn-chunky-primary py-4 text-[18px] flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Checking Your Math...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Lock In Answer</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full btn-chunky-mint py-4 text-[18px] flex items-center justify-center gap-2"
          >
            <span>{qNumber >= totalQuestions ? 'See Quest Victory!' : 'Next Challenge'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ─── FEEDBACK PANEL (CELEBRATORY / ENCOURAGING WORKED HINT) ─── */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl p-6 border-3 space-y-4 shadow-xl ${
            feedback.is_correct
              ? 'bg-emerald-50/95 border-emerald-300'
              : 'bg-white/95 border-sky-200'
          }`}
        >
          {/* Encouragement Message with Questie Reaction */}
          <div className="flex items-start gap-4">
            <QuestieMascot
              mood={feedback.is_correct ? 'celebrating' : 'encouraging'}
              size={64}
              className="flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="font-heading font-black text-lg text-indigo-950">
                {encouragementMsg}
              </p>
              {feedback.is_correct && correctStreak >= 2 && (
                <p className="text-xs font-heading font-black text-amber-800 mt-1 flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-600" />
                  <span>{correctStreak} in a row streak active!</span>
                </p>
              )}
            </div>
          </div>

          {/* Explanation */}
          <div className={`p-4 rounded-2xl text-[16px] leading-relaxed border-2 ${
            feedback.is_correct
              ? 'bg-white/80 border-emerald-200 text-emerald-950'
              : 'bg-sky-50/80 border-sky-200 text-slate-800'
          }`}>
            <p className="font-heading font-black text-xs uppercase tracking-wide text-slate-600 mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Step-by-step mathematical reasoning:</span>
            </p>
            <p className="whitespace-pre-line font-medium">{feedback.explanation}</p>
          </div>

          {/* Points earned */}
          <div className="flex items-center justify-between pt-1">
            <div className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <span>Adaptive Engine: {feedback.adaptive_reason}</span>
            </div>
            {feedback.points_awarded > 0 && (
              <span className="text-sm font-heading font-black text-amber-950 bg-amber-200 px-3.5 py-1 rounded-full border-2 border-amber-400 shadow-2xs">
                +{feedback.points_awarded} XP Earned!
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Socratic AI Tutor Drawer */}
      <AskAITutorDrawer
        topicId={topicId || 'g5-fractions'}
        topicTitle={questContext ? questContext.mission : 'Math Quest Practice'}
        grade={getStoredGrade()}
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
      />

    </div>
  );
};
