import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Award, ArrowRight, Zap, Trophy,
  Compass, ChevronDown, ChevronUp, Lock, CheckCircle2,
  TrendingUp, Star, Lightbulb, BookOpen, HeartHandshake,
  PieChart, Coins, Ruler, Hash, Box, BarChart3,
  Scale, Thermometer, Divide, Shapes, LucideIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api, getStudentId } from '../services/api';
import { DashboardData, BehaviorAnalysis } from '../types';
import { useGrade } from '../context/GradeContext';
import { QuestieMascot } from '../components/QuestieMascot';

// Topic friendly display titles and theme colors
const TOPIC_POWER_META: Record<string, { title: string; icon: LucideIcon; color: string; barColor: string }> = {
  'g5-fractions': { title: 'Fraction Power', icon: PieChart, color: 'border-amber-200 bg-amber-50/60', barColor: 'from-amber-400 to-amber-500' },
  'g5-decimals': { title: 'Decimal Precision', icon: Coins, color: 'border-emerald-200 bg-emerald-50/60', barColor: 'from-emerald-400 to-emerald-500' },
  'g5-geometry': { title: 'Shape & Perimeter', icon: Ruler, color: 'border-blue-200 bg-blue-50/60', barColor: 'from-blue-400 to-blue-500' },
  'g5-place-value': { title: 'Number Sense', icon: Hash, color: 'border-sky-200 bg-sky-50/60', barColor: 'from-sky-400 to-sky-500' },
  'g5-factors-multiples': { title: 'Factor Magic', icon: Sparkles, color: 'border-teal-200 bg-teal-50/60', barColor: 'from-teal-400 to-teal-500' },
  'g5-measurement-area': { title: 'Area & Dimensions', icon: Ruler, color: 'border-rose-200 bg-rose-50/60', barColor: 'from-rose-400 to-rose-500' },
  'g5-volume-powers': { title: '3D Volume & Space', icon: Box, color: 'border-indigo-200 bg-indigo-50/60', barColor: 'from-indigo-400 to-indigo-500' },
  'g5-data-handling': { title: 'Chart & Data Spy', icon: BarChart3, color: 'border-cyan-200 bg-cyan-50/60', barColor: 'from-cyan-400 to-cyan-500' },
  'g6-ratios': { title: 'Ratio Balance', icon: Scale, color: 'border-amber-200 bg-amber-50/60', barColor: 'from-amber-400 to-amber-500' },
  'g6-integers': { title: 'Signed Integers', icon: Thermometer, color: 'border-blue-200 bg-blue-50/60', barColor: 'from-blue-400 to-blue-500' },
  'g6-algebra': { title: 'Algebra Equations', icon: Compass, color: 'border-purple-200 bg-purple-50/60', barColor: 'from-purple-400 to-purple-500' },
  'g6-fractions-division': { title: 'Fraction Division', icon: Divide, color: 'border-pink-200 bg-pink-50/60', barColor: 'from-pink-400 to-pink-500' },
  'g6-decimals-play': { title: 'Multi-Step Decimals', icon: Coins, color: 'border-emerald-200 bg-emerald-50/60', barColor: 'from-emerald-400 to-emerald-500' },
  'g6-lines-angles': { title: 'Angle Geometrics', icon: Compass, color: 'border-orange-200 bg-orange-50/60', barColor: 'from-orange-400 to-orange-500' },
  'g6-geometry-area': { title: 'Composite Area', icon: Shapes, color: 'border-teal-200 bg-teal-50/60', barColor: 'from-teal-400 to-teal-500' },
  'g6-data-handling': { title: 'Stats & Mean/Median', icon: TrendingUp, color: 'border-indigo-200 bg-indigo-50/60', barColor: 'from-indigo-400 to-indigo-500' }
};

export const ProgressPage: React.FC = () => {
  const { grade } = useGrade();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [behaviorAnalysis, setBehaviorAnalysis] = useState<BehaviorAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showTeacherTable, setShowTeacherTable] = useState<boolean>(false);

  useEffect(() => {
    loadData(grade);
  }, [grade]);

  const loadData = async (g: number) => {
    setLoading(true);
    try {
      const sid = getStudentId();
      const [data, rlData] = await Promise.all([
        api.getDashboard(sid, g),
        api.getStudentBehaviorAnalysis(sid, g)
      ]);
      setDashboard(data);
      setBehaviorAnalysis(rlData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 select-none p-4">
        <div className="h-44 bg-white/90 backdrop-blur-md rounded-3xl border-3 border-sky-200 shadow-md flex items-center justify-center p-8">
          <div className="flex items-center gap-4">
            <QuestieMascot mood="thinking" size={90} />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-sky-100 rounded-full animate-pulse" />
              <div className="h-4 w-72 bg-sky-50 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-white/80 rounded-3xl border-2 border-sky-100 animate-pulse" />
          ))}
        </div>
        <div className="h-72 bg-white/80 rounded-3xl border-2 border-sky-100 animate-pulse" />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 p-6 bg-white/95 rounded-3xl border-3 border-sky-200 shadow-xl space-y-4">
        <QuestieMascot mood="thinking" size={100} className="mx-auto" />
        <h2 className="text-2xl font-heading font-black text-indigo-950">No Math Adventures Recorded Yet!</h2>
        <p className="text-[17px] text-slate-700">
          Pick your first math challenge on the island to see your superpowers grow.
        </p>
        <Link to="/learn" className="btn-chunky-primary inline-flex items-center gap-2">
          <span>Explore Topics</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  const accuracyPct = Math.round(dashboard.overall_accuracy * 100);
  const masteredCount = behaviorAnalysis?.rl_profile?.mastered_topics?.length || 0;
  const inProgressCount = behaviorAnalysis?.rl_profile?.in_progress_topics?.length || 0;
  const toughCount = behaviorAnalysis?.rl_profile?.tough_topics?.length || 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 px-2 sm:px-4">

      {/* ─── HERO HEADER BANNER ─── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white/95 backdrop-blur-md rounded-3xl border-3 border-sky-200 shadow-xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 justify-between relative overflow-hidden"
      >
        <div className="flex-1 space-y-2 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border-2 border-amber-300 text-amber-950 text-[15px] font-heading font-black">
            <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span>Grade {grade} Power Station</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-indigo-950 tracking-tight flex items-center gap-2">
            <span>Your Math Superpowers!</span>
            <Zap className="w-8 h-8 text-amber-500 fill-amber-400" />
          </h1>
          <p className="text-[17px] text-slate-700 leading-relaxed max-w-xl">
            Every problem you solve strengthens your math muscles! Watch your power bars charge up as you explore the island realms.
          </p>
        </div>

        <div className="flex flex-col items-center flex-shrink-0 z-10">
          <QuestieMascot
            mood={accuracyPct >= 70 ? 'celebrating' : accuracyPct >= 40 ? 'wave' : 'encouraging'}
            size={130}
          />
          <span className="text-xs font-heading font-bold text-indigo-900 bg-sky-100 px-3 py-1 rounded-full border border-sky-200 mt-1">
            Questie is cheering you on!
          </span>
        </div>
      </motion.div>

      {/* ─── 4 HIGHLIGHT POWER TILES ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl border-3 border-sky-200 p-5 shadow-md flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-700 flex items-center justify-center mb-2 shadow-2xs">
            <Award className="w-6 h-6" />
          </div>
          <span className="text-[15px] font-bold text-slate-600">Total Points</span>
          <span className="text-2xl sm:text-3xl font-heading font-black text-indigo-950 mt-0.5">
            {dashboard.total_points} <span className="text-sm text-amber-600">XP</span>
          </span>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl border-3 border-emerald-200 p-5 shadow-md flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-emerald-700 flex items-center justify-center mb-2 shadow-2xs">
            <Trophy className="w-6 h-6" />
          </div>
          <span className="text-[15px] font-bold text-slate-600">Accuracy</span>
          <span className="text-2xl sm:text-3xl font-heading font-black text-indigo-950 mt-0.5">
            {accuracyPct}%
          </span>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl border-3 border-blue-200 p-5 shadow-md flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 border-2 border-blue-300 text-blue-700 flex items-center justify-center mb-2 shadow-2xs">
            <Zap className="w-6 h-6" />
          </div>
          <span className="text-[15px] font-bold text-slate-600">Problems Solved</span>
          <span className="text-2xl sm:text-3xl font-heading font-black text-indigo-950 mt-0.5">
            {dashboard.total_questions_answered}
          </span>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl border-3 border-sky-200 p-5 shadow-md flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 border-2 border-sky-300 text-sky-700 flex items-center justify-center mb-2 shadow-2xs">
            <Compass className="w-6 h-6" />
          </div>
          <span className="text-[15px] font-bold text-slate-600">Topics Explored</span>
          <span className="text-2xl sm:text-3xl font-heading font-black text-indigo-950 mt-0.5">
            {dashboard.topic_progress.length}
          </span>
        </div>
      </div>

      {/* ─── TOPIC SUPERPOWERS (POWER CHARGING BARS) ─── */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border-3 border-sky-200 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-sky-100 pb-4">
          <div>
            <h2 className="text-2xl font-heading font-black text-indigo-950 flex items-center gap-2">
              <span>Topic Power Meters</span>
              <Sparkles className="w-6 h-6 text-amber-500 fill-amber-400" />
            </h2>
            <p className="text-[16px] text-slate-600 mt-1">
              Click any power to practice in the arena and charge it higher!
            </p>
          </div>
          <Link
            to="/learn"
            className="btn-chunky-accent text-[15px] self-start sm:self-auto inline-flex items-center gap-1.5"
          >
            <span>Explore All Topics</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {dashboard.topic_progress.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboard.topic_progress.map((tp) => {
              const meta = TOPIC_POWER_META[tp.topic_id] || {
                title: tp.topic_id.replace('g5-', '').replace('g6-', '').toUpperCase(),
                icon: Sparkles,
                color: 'border-sky-200 bg-sky-50/60',
                barColor: 'from-indigo-400 to-indigo-600'
              };
              const TopicIcon = meta.icon;
              const accuracy = Math.round(tp.accuracy * 100);
              const isUntouched = tp.questions_answered === 0;

              return (
                <div
                  key={tp.topic_id}
                  className={`rounded-3xl border-3 ${meta.color} p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-indigo-700 shadow-2xs">
                          <TopicIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-heading font-black text-lg text-indigo-950">
                            {meta.title}
                          </h3>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Level: {tp.current_difficulty} Tier
                          </span>
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-full text-xs font-heading font-black bg-white border border-slate-200 text-indigo-900 shadow-2xs">
                        {tp.questions_answered} Solved
                      </span>
                    </div>

                    {/* Animated Charge Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-heading font-black text-slate-700">
                        <span>{isUntouched ? 'Ready to Charge!' : 'Superpower Charge:'}</span>
                        <span className={isUntouched ? 'text-slate-500' : 'text-emerald-700'}>
                          {isUntouched ? '0%' : `${accuracy}% Mastery`}
                        </span>
                      </div>
                      <div className="w-full bg-white/90 rounded-full h-4 p-0.5 border-2 border-slate-200 overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(isUntouched ? 5 : accuracy, 5)}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full rounded-full bg-gradient-to-r ${meta.barColor}`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                      {isUntouched ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Start fresh!</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{tp.correct_count} correct answers</span>
                        </>
                      )}
                    </span>
                    <Link
                      to={`/quiz/${tp.topic_id}`}
                      className="btn-chunky-primary py-2 px-4 text-xs inline-flex items-center gap-1"
                    >
                      <span>Power Up</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 space-y-3">
            <p className="text-[17px] text-slate-600 font-medium">No power records yet. Let's start exploring!</p>
            <Link to="/learn" className="btn-chunky-primary inline-block">
              Choose a Topic to Begin
            </Link>
          </div>
        )}
      </div>

      {/* ─── QUESTIE'S STRATEGY GUIDE (KID ADAPTIVE CLASSIFICATION) ─── */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border-3 border-sky-200 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-700 flex items-center justify-center shadow-2xs flex-shrink-0">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-black text-indigo-950">
              Questie's Strategy Guide
            </h2>
            <p className="text-[16px] text-slate-600">
              Questie studies how you solve math to recommend the best next steps!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mastered */}
          <div className="p-5 rounded-3xl bg-emerald-50/80 border-3 border-emerald-300 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-black text-emerald-900 uppercase tracking-wide">
                  Mastered Powers
                </span>
                <Trophy className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl font-heading font-black text-emerald-950 mt-1">
                {masteredCount}
              </div>
              <p className="text-[15px] text-emerald-800 mt-1 font-medium">
                You solve these with top speed and accuracy! High-tier mastery achieved.
              </p>
            </div>
            {behaviorAnalysis?.rl_profile?.mastered_topics && behaviorAnalysis.rl_profile.mastered_topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {behaviorAnalysis.rl_profile.mastered_topics.map((t, idx) => {
                  const id = typeof t === 'string' ? t : t.topic_id;
                  const label = (typeof t === 'string' ? t : (t.title || t.topic_id)).replace('g5-', '').replace('g6-', '').toUpperCase();
                  return (
                    <span key={id || idx} className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                      {label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* In Progress */}
          <div className="p-5 rounded-3xl bg-amber-50/80 border-3 border-amber-300 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-black text-amber-900 uppercase tracking-wide">
                  Growing Superpowers
                </span>
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-3xl font-heading font-black text-amber-950 mt-1">
                {inProgressCount}
              </div>
              <p className="text-[15px] text-amber-900 mt-1 font-medium">
                You're making great progress here! Keep practicing to push these to Mastered.
              </p>
            </div>
            {behaviorAnalysis?.rl_profile?.in_progress_topics && behaviorAnalysis.rl_profile.in_progress_topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {behaviorAnalysis.rl_profile.in_progress_topics.map((t, idx) => {
                  const id = typeof t === 'string' ? t : t.topic_id;
                  const label = (typeof t === 'string' ? t : (t.title || t.topic_id)).replace('g5-', '').replace('g6-', '').toUpperCase();
                  return (
                    <span key={id || idx} className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      {label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Training Ground */}
          <div className="p-5 rounded-3xl bg-sky-50/80 border-3 border-sky-300 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-black text-sky-900 uppercase tracking-wide">
                  Secret Training Ground
                </span>
                <Lightbulb className="w-5 h-5 text-sky-600" />
              </div>
              <div className="text-3xl font-heading font-black text-sky-950 mt-1">
                {toughCount}
              </div>
              <p className="text-[15px] text-sky-900 mt-1 font-medium">
                Topics where hints and visual whiteboard lessons give you an instant boost!
              </p>
            </div>
            {behaviorAnalysis?.rl_profile?.tough_topics && behaviorAnalysis.rl_profile.tough_topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {behaviorAnalysis.rl_profile.tough_topics.map((t, idx) => {
                  const id = typeof t === 'string' ? t : t.topic_id;
                  const label = (typeof t === 'string' ? t : (t.title || t.topic_id)).replace('g5-', '').replace('g6-', '').toUpperCase();
                  return (
                    <span key={id || idx} className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-300">
                      {label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── COLLAPSIBLE TEACHER & PARENT STANDARDS REPORT ─── */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border-3 border-sky-200 shadow-lg overflow-hidden">
        <button
          onClick={() => setShowTeacherTable(!showTeacherTable)}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-sky-50/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-indigo-700" />
            <div>
              <h3 className="font-heading font-black text-lg text-indigo-950">
                For Teachers &amp; Parents: Georgia GSE Standards Records
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Click to expand raw curriculum accuracy logs and Q-learning metrics
              </p>
            </div>
          </div>
          {showTeacherTable ? (
            <ChevronUp className="w-6 h-6 text-slate-500" />
          ) : (
            <ChevronDown className="w-6 h-6 text-slate-500" />
          )}
        </button>

        {showTeacherTable && (
          <div className="p-6 border-t-2 border-sky-100 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-sky-50 text-xs font-heading font-bold uppercase text-indigo-900 border-b border-sky-200">
                  <tr>
                    <th className="py-3 px-4">Standard / Topic</th>
                    <th className="py-3 px-4">Current Difficulty</th>
                    <th className="py-3 px-4">Questions Attempted</th>
                    <th className="py-3 px-4">Correct</th>
                    <th className="py-3 px-4">Calculated Accuracy</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dashboard.topic_progress.map((tp) => (
                    <tr key={tp.topic_id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-indigo-950">
                        {tp.topic_id.toUpperCase()}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-indigo-700">
                        {tp.current_difficulty.toUpperCase()}
                      </td>
                      <td className="py-3.5 px-4">{tp.questions_answered}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600">{tp.correct_count}</td>
                      <td className="py-3.5 px-4 font-extrabold">{Math.round(tp.accuracy * 100)}%</td>
                      <td className="py-3.5 px-4">
                        <Link
                          to={`/quiz/${tp.topic_id}`}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline"
                        >
                          Launch Arena
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Privacy note */}
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-indigo-950">Student Privacy Transparency:</strong> Anonymous local session IDs only. All adaptive difficulty calculations and mathematical validations execute deterministically on the server without tracking or personal profile storage.
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
