import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Award, CheckCircle2, RotateCcw, ArrowRight, Sparkles, BookOpen,
  Flame, TrendingUp, Star, Heart, Zap, Trophy, Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { QuizSummary } from '../types';
import { QuestieMascot } from '../components/QuestieMascot';
import { useSound } from '../context/SoundContext';

const PERFORMANCE_TIERS = [
  { min: 90, stars: 3, title: 'Math Legend!', subtitle: 'You completely mastered this quest!', badge: 'LEGEND' },
  { min: 70, stars: 3, title: 'Math Champion!', subtitle: 'Outstanding calculations! Island hero!', badge: 'CHAMPION' },
  { min: 50, stars: 2, title: 'Great Adventurer!', subtitle: 'Strong math muscles are building!', badge: 'ADVENTURER' },
  { min: 0, stars: 1, title: 'Curious Explorer!', subtitle: 'Every try makes you smarter & stronger!', badge: 'EXPLORER' },
];

export const ResultsPage: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const [summary, setSummary] = useState<QuizSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { playSound } = useSound();

  useEffect(() => {
    if (attemptId) loadResults(attemptId);
  }, [attemptId]);

  const loadResults = async (attId: string) => {
    setLoading(true);
    try {
      let data;
      try {
        data = await api.getQuizResults(attId);
      } catch {
        data = await api.completeQuiz(attId);
      }
      setSummary(data);

      const acc = data.accuracy * 100;
      playSound('celebrate');

      if (acc >= 90) {
        // Grand celebration fireworks
        const duration = 2200;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 35, spread: 360, ticks: 70, zIndex: 0 };
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
        const interval = window.setInterval(() => {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) return clearInterval(interval);
          const particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 220);
      } else if (acc >= 50) {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      } else {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 }, colors: ['#38bdf8', '#818cf8', '#c084fc'] });
      }
    } catch (e) {
      console.error('Error fetching quiz results', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 select-none p-4">
        <div className="h-56 bg-white/95 rounded-3xl border-3 border-sky-200 shadow-md flex items-center justify-center p-8">
          <div className="flex items-center gap-4">
            <QuestieMascot mood="celebrating" size={90} />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-sky-100 rounded-full animate-pulse" />
              <div className="h-4 w-64 bg-sky-50 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4 bg-white/95 rounded-3xl border-3 border-sky-200 shadow-xl p-6">
        <QuestieMascot mood="thinking" size={90} className="mx-auto" />
        <h2 className="text-2xl font-heading font-black text-indigo-950">Quest Results Not Found</h2>
        <p className="text-[16px] text-slate-600">Head back to the topic list to choose another adventure.</p>
        <Link to="/learn" className="btn-chunky-primary inline-flex items-center gap-2">
          <span>Return to Topics</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const accuracyPct = Math.round(summary.accuracy * 100);
  const tier = PERFORMANCE_TIERS.find((t) => accuracyPct >= t.min) || PERFORMANCE_TIERS[PERFORMANCE_TIERS.length - 1];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 px-2 sm:px-4">

      {/* ─── HERO CELEBRATION CARD ─── */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="bg-white/95 backdrop-blur-md rounded-3xl border-3 border-sky-200 p-6 sm:p-10 shadow-2xl text-center relative overflow-hidden space-y-6"
      >
        {/* Mascot + Stars row */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <QuestieMascot mood="celebrating" size={130} />

          {/* 3 Gold Stars */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {[1, 2, 3].map((starIdx) => {
              const isFilled = starIdx <= tier.stars;
              return (
                <motion.div
                  key={starIdx}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + starIdx * 0.15, type: 'spring', stiffness: 300 }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      isFilled
                        ? 'text-amber-400 fill-amber-400 drop-shadow-md'
                        : 'text-slate-200 fill-slate-100'
                    }`}
                  />
                </motion.div>
              );
            })}
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border-2 border-amber-300 text-amber-950 text-xs font-heading font-black uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span>{tier.badge} QUEST COMPLETED</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-heading font-black text-indigo-950 tracking-tight">
            {tier.title}
          </h1>
          <p className="text-[17px] text-slate-700 max-w-md mx-auto">
            {tier.subtitle}
          </p>

          {summary.encouraging_message && (
            <p className="text-[15px] font-heading font-bold text-indigo-950 bg-sky-50 border-2 border-sky-200 rounded-2xl px-5 py-2.5 max-w-lg mx-auto shadow-2xs">
              "{summary.encouraging_message}"
            </p>
          )}
        </div>

        {/* 3 Large Stat Pills */}
        <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg mx-auto">
          <div className="bg-sky-50 rounded-2xl p-4 border-2 border-sky-200 shadow-2xs">
            <span className="block text-2xl sm:text-3xl font-heading font-black text-indigo-950">
              {summary.correct_count}/{summary.total_questions}
            </span>
            <span className="text-xs font-heading font-bold text-slate-600">Correct Answers</span>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-4 border-2 border-emerald-200 shadow-2xs">
            <span className="block text-2xl sm:text-3xl font-heading font-black text-emerald-950">
              {accuracyPct}%
            </span>
            <span className="text-xs font-heading font-bold text-emerald-800">Accuracy</span>
          </div>

          <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200 shadow-2xs">
            <span className="block text-2xl sm:text-3xl font-heading font-black text-amber-950">
              +{summary.total_points_earned}
            </span>
            <span className="text-xs font-heading font-bold text-amber-800">XP Points</span>
          </div>
        </div>
      </motion.div>

      {/* ─── SKILL PROGRESS BAR ─── */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border-3 border-sky-200 p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-heading font-black text-indigo-950 text-base">
            <TrendingUp className="w-5 h-5 text-indigo-700" />
            <span>Mastery Progress</span>
          </div>
          <span className="text-xs font-heading font-black text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            {accuracyPct}% Level Charged
          </span>
        </div>

        <div className="w-full bg-white rounded-full h-4 p-0.5 border-2 border-sky-200 overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(accuracyPct, 5)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600"
          />
        </div>
        <div className="flex justify-between text-xs font-heading font-bold text-slate-600 pt-0.5">
          <span className="flex items-center gap-1"><Compass className="w-3.5 h-3.5 text-sky-600" /> Explorer</span>
          <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-600" /> Adventurer</span>
          <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5 text-emerald-600" /> Island Champion</span>
        </div>
      </div>

      {/* ─── NEWLY UNLOCKED BADGES ─── */}
      {summary.newly_unlocked_badges && summary.newly_unlocked_badges.length > 0 && (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border-3 border-amber-300 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-amber-950 font-heading font-black text-base uppercase tracking-wider">
            <Sparkles className="w-5 h-5 text-amber-600 fill-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
            <span>New Achievement Badges Unlocked!</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {summary.newly_unlocked_badges.map((badge) => (
              <div
                key={badge.badge_id}
                className="bg-amber-50/70 rounded-2xl p-4 border-2 border-amber-200 flex items-center space-x-3.5 shadow-2xs"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-800 flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <Award className="w-7 h-7 text-amber-700" />
                </div>
                <div>
                  <h4 className="font-heading font-black text-base text-indigo-950">{badge.title}</h4>
                  <p className="text-xs text-slate-600">{badge.description}</p>
                  <span className="text-xs font-heading font-black text-amber-800 flex items-center gap-1 mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                    +{badge.points_reward} bonus XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── WHAT YOUR BRAIN LEARNED TODAY ─── */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border-3 border-sky-200 p-6 shadow-xl space-y-4">
        <h3 className="font-heading font-black text-indigo-950 text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-700" />
          <span>What Your Brain Learned Today</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <Zap className="w-5 h-5 text-amber-600" />, label: 'Fast Thinking', value: summary.total_questions > 0 ? 'Unlocked' : '-' },
            { icon: <Heart className="w-5 h-5 text-rose-500" />, label: 'Perseverance', value: summary.correct_count < summary.total_questions ? 'Earned' : 'Perfect' },
            { icon: <Flame className="w-5 h-5 text-orange-600" />, label: 'Focus Streak', value: `${summary.correct_count} Qs` },
            { icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />, label: 'Accuracy Power', value: `${accuracyPct}%` },
          ].map((item, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-sky-50 border-2 border-sky-200 text-center space-y-1 shadow-2xs">
              <div className="flex justify-center">{item.icon}</div>
              <p className="text-xs font-heading font-bold text-slate-600">{item.label}</p>
              <p className="text-base font-heading font-black text-indigo-950">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── QUESTIE'S RECOMMENDATION ─── */}
      {summary.recommendation && (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border-3 border-sky-200 p-6 shadow-xl space-y-2">
          <h3 className="font-heading font-black text-indigo-950 text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span>Questie's Next Step Recommendation</span>
          </h3>
          <p className="text-[16px] text-slate-700 leading-relaxed font-medium">
            {summary.recommendation}
          </p>
        </div>
      )}

      {/* ─── ACTION BUTTONS (CHUNKY 3D BUTTONS) ─── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <Link
          to={`/quiz/${summary.topic_id}`}
          className="w-full sm:w-auto btn-chunky-white py-3.5 px-6 text-[16px] flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again &amp; Level Up</span>
        </Link>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            to="/progress"
            className="flex-1 sm:flex-none btn-chunky-accent py-3.5 px-6 text-[16px] flex items-center justify-center gap-1.5"
          >
            <TrendingUp className="w-4 h-4" />
            <span>My Powers</span>
          </Link>

          <Link
            to="/learn"
            className="flex-1 sm:flex-none btn-chunky-primary py-3.5 px-6 text-[16px] flex items-center justify-center gap-1.5"
          >
            <span>Next Quest</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
};
