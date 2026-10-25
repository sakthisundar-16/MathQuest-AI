import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Award, ArrowRight, Flame, Trophy,
  Edit2, Check, Star, BookOpen, Compass, Target,
  Lightbulb, Lock, CheckCircle2
} from 'lucide-react';
import { api, getStudentId } from '../services/api';
import { DashboardData, BehaviorAnalysis } from '../types';
import { useGrade } from '../context/GradeContext';
import { useSound } from '../context/SoundContext';
import { QuestieMascot } from '../components/QuestieMascot';
import { SuspenseLoader } from '../components/SuspenseLoader';

export const DashboardPage: React.FC = () => {
  const { grade } = useGrade();
  const { playSound } = useSound();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [behaviorAnalysis, setBehaviorAnalysis] = useState<BehaviorAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Kid Nickname persisted in localStorage
  const [nickname, setNickname] = useState<string>(() => {
    return localStorage.getItem('mathquest_nickname') || '';
  });
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>('');

  useEffect(() => {
    loadDashboard(grade);
  }, [grade]);

  const loadDashboard = async (g: number) => {
    setLoading(true);
    try {
      const studentId = getStudentId();
      const [data, rlData] = await Promise.all([
        api.getDashboard(studentId, g),
        api.getStudentBehaviorAnalysis(studentId, g)
      ]);
      setDashboard(data);
      setBehaviorAnalysis(rlData);
      if (!nickname && data.student.display_name) {
        setNickname(data.student.display_name);
      }
    } catch (e) {
      console.error('Error loading dashboard', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNickname = () => {
    if (tempName.trim()) {
      playSound('correct');
      setNickname(tempName.trim());
      localStorage.setItem('mathquest_nickname', tempName.trim());
    }
    setIsEditingName(false);
  };

  if (loading) {
    return <SuspenseLoader message="Entering your personal Math HQ..." minHeight="min-h-[50vh]" />;
  }

  if (!dashboard) {
    return (
      <div className="py-20 text-center space-y-4 bg-white rounded-3xl border-3 border-sky-200 p-8">
        <h2 className="text-2xl font-heading font-black text-slate-800">Adventure Hub could not be retrieved</h2>
        <Link to="/learn" className="btn-chunky btn-chunky-primary text-white">Go to Topics</Link>
      </div>
    );
  }

  // Real Data Computations (No invented data)
  const totalPoints = dashboard.total_points ?? 0;
  const currentLevel = Math.floor(totalPoints / 100) + 1;
  const xpIntoCurrentLevel = totalPoints % 100;
  const dailyStreak = dashboard.student.streak_days || 1;
  const questionsAnswered = dashboard.total_questions_answered;
  const totalCorrect = dashboard.topic_progress?.reduce((acc, tp) => acc + (tp.correct_count || 0), 0) ?? 0;

  // Daily Mission: target 5 problems per day
  const missionTarget = 5;
  const missionProgress = Math.min(questionsAnswered, missionTarget);
  const isMissionComplete = missionProgress >= missionTarget;

  const unlockedIds = new Set(dashboard.achievements.map((a) => a.badge_id));

  return (
    <div className="max-w-5xl mx-auto space-y-8 select-none pb-16">
      
      {/* ─── 1. PERSONAL HQ GREETING HERO (Cloud-White Card) ─── */}
      <div className="bg-white rounded-3xl border-3 border-sky-200 p-6 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left: Questie Character Greeting */}
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <QuestieMascot
            size={180}
            mood="wave"
            speech={`Welcome back, ${nickname || dashboard.student.display_name}! ⭐`}
          />

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-3.5 py-1 rounded-xl bg-amber-100 text-amber-950 font-heading font-black text-[16px] border border-amber-300">
                Grade {dashboard.grade} Explorer
              </span>
              
              {/* Nickname Editor */}
              {isEditingName ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Enter nickname"
                    className="px-3 py-1 rounded-xl border-2 border-purple-400 text-[16px] font-heading font-bold"
                    maxLength={16}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleSaveNickname}
                    className="p-1.5 rounded-xl bg-emerald-500 text-white"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setTempName(nickname || dashboard.student.display_name);
                    setIsEditingName(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-50 text-sky-800 text-[16px] font-heading font-bold hover:bg-sky-100 border border-sky-200"
                  title="Click to edit your explorer nickname"
                >
                  <span>{nickname || dashboard.student.display_name}</span>
                  <Edit2 className="w-3.5 h-3.5 text-sky-600" />
                </button>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-heading font-black text-indigo-950">
              {nickname || dashboard.student.display_name}'s Adventure Hub
            </h1>
            <p className="text-[17px] font-body font-bold text-slate-600 max-w-md">
              Level {currentLevel} Adventurer · Keep exploring and mastering new math powers!
            </p>
          </div>
        </div>

        {/* Right: Continue Quest CTA */}
        <div className="flex-shrink-0">
          <Link
            to="/learn"
            onClick={() => playSound('click')}
            className="btn-chunky btn-chunky-accent text-[#1E1B4B] gap-2.5 text-lg"
          >
            <Compass className="w-6 h-6 text-[#1E1B4B]" />
            <span>Continue Quest</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>

      </div>

      {/* ─── 2. LEVEL PROGRESS RING & XP COUNTER ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Level Ring Card */}
        <div className="p-6 rounded-3xl bg-white border-3 border-sky-200 shadow-md space-y-3">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-[16px] font-heading font-black uppercase tracking-wide">Level Progress</span>
            <Trophy className="w-6 h-6 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-heading font-black text-indigo-950">Level {currentLevel}</span>
            <span className="text-[16px] font-extrabold text-slate-500">({totalPoints} Total XP)</span>
          </div>
          {/* XP Progress Bar */}
          <div className="space-y-1">
            <div className="w-full h-4 bg-sky-100 rounded-full overflow-hidden border-2 border-sky-200">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${xpIntoCurrentLevel}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-heading font-extrabold text-slate-500">
              <span>{xpIntoCurrentLevel} XP</span>
              <span>100 XP to Level {currentLevel + 1}</span>
            </div>
          </div>
        </div>

        {/* Daily Streak Card */}
        <div className="p-6 rounded-3xl bg-white border-3 border-sky-200 shadow-md space-y-3">
          <div className="flex items-center justify-between text-orange-700">
            <span className="text-[16px] font-heading font-black uppercase tracking-wide">Daily Streak</span>
            <Flame className="w-6 h-6 text-orange-500 fill-orange-500 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-heading font-black text-orange-950">{dailyStreak} Days</span>
            <span className="text-[16px] font-extrabold text-orange-800">Active!</span>
          </div>
          <p className="text-[16px] font-body font-bold text-slate-600">
            Solve problems every day to keep your flame blazing!
          </p>
        </div>

        {/* Overall Accuracy Card */}
        <div className="p-6 rounded-3xl bg-white border-3 border-sky-200 shadow-md space-y-3">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-[16px] font-heading font-black uppercase tracking-wide">Math Accuracy</span>
            <Award className="w-6 h-6 text-emerald-500" />
          </div>
          <div className="text-4xl font-heading font-black text-emerald-950">
            {questionsAnswered > 0 ? `${Math.round(dashboard.overall_accuracy * 100)}%` : 'Ready!'}
          </div>
          <p className="text-[16px] font-body font-bold text-slate-600">
            {questionsAnswered > 0
              ? `${totalCorrect} of ${questionsAnswered} questions solved correctly`
              : 'Complete your first practice quiz today!'}
          </p>
        </div>

      </div>

      {/* ─── 3. TODAY'S DAILY MISSION ─── */}
      <div className="p-7 rounded-3xl bg-white border-3 border-amber-300 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-700 shadow-2xs flex-shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-black text-indigo-950">Today's Quest Mission</h2>
              <p className="text-[16px] font-body font-bold text-slate-600">Solve 5 math challenges to earn a streak bonus</p>
            </div>
          </div>
          {isMissionComplete ? (
            <span className="px-4 py-1.5 rounded-2xl bg-emerald-100 text-emerald-950 font-heading font-black text-[16px] border-2 border-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Completed!</span>
            </span>
          ) : (
            <span className="px-4 py-1.5 rounded-2xl bg-amber-100 text-amber-950 font-heading font-black text-[16px] border-2 border-amber-300">
              {missionProgress} / {missionTarget} Done
            </span>
          )}
        </div>

        {/* Mission Progress Bar */}
        <div className="w-full h-5 bg-amber-50 rounded-full overflow-hidden border-2 border-amber-200">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${(missionProgress / missionTarget) * 100}%` }}
          />
        </div>
      </div>

      {/* ─── 4. QUESTIE'S TIPS & STRATEGY (Renamed from AI Mentor Guidance) ─── */}
      {behaviorAnalysis?.ai_coaching && (
        <div className="p-7 rounded-3xl bg-white border-3 border-sky-200 shadow-md space-y-4">
          <div className="flex items-center gap-3 border-b-2 border-sky-100 pb-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 border-2 border-sky-300 flex items-center justify-center text-sky-700 shadow-2xs flex-shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-black text-indigo-950">Questie's Strategy Tips</h2>
              <p className="text-[16px] font-body font-bold text-slate-500">Personalized pointers to grow your math skills</p>
            </div>
          </div>

          <p className="text-lg font-body font-bold text-slate-700 leading-relaxed italic bg-sky-50/70 p-4 rounded-2xl border-2 border-sky-200">
            "{behaviorAnalysis.ai_coaching.mentor_message}"
          </p>

          {behaviorAnalysis.ai_coaching.action_tips?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {behaviorAnalysis.ai_coaching.action_tips.map((tip: string, idx: number) => (
                <div key={idx} className="p-3 rounded-2xl bg-amber-50 text-amber-950 border-2 border-amber-200 font-body font-bold text-[16px] flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── 5. STICKER ALBUM / BADGE SHOWCASE ─── */}
      <div className="p-7 rounded-3xl bg-white border-3 border-sky-200 shadow-md space-y-5">
        <div className="flex items-center justify-between border-b-2 border-sky-100 pb-3">
          <div>
            <h2 className="text-2xl font-heading font-black text-indigo-950">Your Adventure Stickers</h2>
            <p className="text-[16px] font-body font-bold text-slate-700">Earn badges by completing quests and challenges</p>
          </div>
          <span className="text-[16px] font-heading font-black text-amber-800">
            {dashboard.achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {dashboard.achievements.map((ach) => (
            <div
              key={ach.badge_id}
              className="p-5 rounded-3xl bg-amber-50 border-3 border-amber-300 text-center space-y-2 shadow-sm hover:scale-105 transition-transform flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-700 shadow-2xs">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-black text-[17px] text-indigo-950">{ach.title}</h3>
              <p className="text-xs font-bold text-slate-600">{ach.description}</p>
            </div>
          ))}

          {/* Locked Badge placeholders if fewer than 4 */}
          {dashboard.achievements.length < 4 && (
            <div className="p-5 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-300 text-center space-y-2 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-200/80 border-2 border-slate-300 flex items-center justify-center text-slate-500 shadow-2xs">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-black text-[17px] text-slate-800">Next Mystery Relic</h3>
              <p className="text-xs font-heading font-bold text-slate-700">Solve 3 problems in a row to reveal!</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
