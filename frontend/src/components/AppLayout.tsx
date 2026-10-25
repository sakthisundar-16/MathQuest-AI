import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass, BookOpen, Sparkles, BarChart2, Flame,
  Volume2, VolumeX, MapPin
} from 'lucide-react';
import { api, getStudentId } from '../services/api';
import type { DashboardData } from '../types';
import { useGrade } from '../context/GradeContext';
import { useSound } from '../context/SoundContext';
import { WorldBackground } from './WorldBackground';
import { CloudWipeTransition } from './CloudWipeTransition';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { grade, setGrade } = useGrade();
  const { isMuted, toggleMute, playSound } = useSound();
  const location = useLocation();

  const [streakDays, setStreakDays] = useState<number>(1);

  // Fetch real student streak from server (No invented data)
  useEffect(() => {
    const studentId = getStudentId();
    api.getDashboard(studentId, grade)
      .then((data: DashboardData) => {
        if (data?.student?.streak_days !== undefined) {
          setStreakDays(data.student.streak_days);
        }
      })
      .catch(() => {});
  }, [grade]);

  const handleGradeChange = (newGrade: number) => {
    if (newGrade === grade) return;
    playSound('whoosh');
    setGrade(newGrade);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Compass },
    { to: '/learn', label: 'Explore', icon: BookOpen },
    { to: '/dashboard', label: 'My Adventure', icon: Sparkles },
    { to: '/progress', label: 'Math Powers', icon: BarChart2 }
  ];

  return (
    <div
      data-grade={grade}
      className={`min-h-screen flex flex-col font-body transition-colors duration-700 relative text-[#1E1B4B]`}
    >
      {/* ─── UNIFIED 2D ISLAND WORLD BACKGROUND (G5 Morning vs G6 Dusk) ─── */}
      <WorldBackground />

      {/* ─── TOP NAVIGATION PILL BAR ─── */}
      <header className="sticky top-3 z-50 px-3 sm:px-6 max-w-7xl mx-auto w-full">
        <nav className="bg-white/95 backdrop-blur-md border-3 border-sky-200/90 rounded-3xl px-4 sm:px-6 py-2.5 shadow-md flex items-center justify-between gap-2 sm:gap-4 transition-all">
          
          {/* Brand Logo with Mini Questie Avatar */}
          <Link
            to="/"
            onClick={() => playSound('click')}
            className="flex items-center gap-2.5 group select-none flex-shrink-0"
          >
            {/* Questie Face Badge */}
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-sky-100 border-2 border-sky-300 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 100 100" className="w-10 h-10 drop-shadow-xs" fill="none">
                <ellipse cx="50" cy="52" rx="42" ry="38" fill="#38BDF8" />
                <path d="M15 32 C30 15 70 15 85 32 C90 38 80 44 50 44 C20 44 10 38 15 32 Z" fill="#1E1B4B" />
                <rect x="25" y="24" width="22" height="15" rx="6" fill="#FBBF24" stroke="#1E1B4B" strokeWidth="2.5" />
                <rect x="53" y="24" width="22" height="15" rx="6" fill="#FBBF24" stroke="#1E1B4B" strokeWidth="2.5" />
                <circle cx="36" cy="56" r="14" fill="#FFFFFF" stroke="#1E1B4B" strokeWidth="2.5" />
                <circle cx="38" cy="56" r="8" fill="#1E1B4B" />
                <circle cx="41" cy="53" r="3" fill="#FFFFFF" />
                <circle cx="64" cy="56" r="14" fill="#FFFFFF" stroke="#1E1B4B" strokeWidth="2.5" />
                <circle cx="62" cy="56" r="8" fill="#1E1B4B" />
                <circle cx="65" cy="53" r="3" fill="#FFFFFF" />
                <polygon points="50,62 44,72 56,72" fill="#EA580C" stroke="#1E1B4B" strokeWidth="2" />
              </svg>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
            </div>

            <div>
              <span className="font-heading font-black text-xl sm:text-2xl tracking-tight text-indigo-950 block leading-tight">
                MathQuest
              </span>
              <span className="text-[16px] font-extrabold text-sky-700 hidden sm:block leading-none">
                Island Adventure
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => playSound('click')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-[16px] font-heading font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md border-b-3 border-blue-800'
                      : 'text-slate-800 hover:text-indigo-950 hover:bg-sky-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                  <span className={`hidden xl:inline ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                  <span className={`xl:hidden inline ${isActive ? 'text-white' : ''}`}>{item.label.split(' ')[0]}</span>
                </Link>
              );
            })}

            {/* Character Sheet Review Link - only visible in DEV */}
            {import.meta.env.DEV && (
              <Link
                to="/character-sheet"
                onClick={() => playSound('click')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl text-[16px] font-heading font-extrabold border-2 whitespace-nowrap transition-all ${
                  location.pathname === '/character-sheet'
                    ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-sm'
                    : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                }`}
                title="Review Questie static character model sheet (DEV ONLY)"
              >
                <Compass className="w-4 h-4 text-amber-700" />
                <span className="hidden 2xl:inline">Sheet</span>
              </Link>
            )}
          </div>

          {/* Right Controls: Streak, Grade Toggle, Sound Mute */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            
            {/* Daily Streak Chip */}
            <div
              title={`Daily Study Streak! Keep solving challenges daily.`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-orange-50 border-2 border-orange-200 text-orange-950 text-[16px] font-heading font-black shadow-2xs select-none whitespace-nowrap"
            >
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />
              <span>{streakDays}d</span>
            </div>

            {/* Grade 5 / Grade 6 Tactile Toggle */}
            <div className="flex items-center p-1 rounded-2xl bg-sky-100/80 border-2 border-sky-200">
              <button
                type="button"
                onClick={() => handleGradeChange(5)}
                className={`px-3 py-1 rounded-xl text-[16px] font-heading font-black transition-all cursor-pointer whitespace-nowrap ${
                  grade === 5
                    ? 'bg-amber-400 text-amber-950 shadow-sm border-b-2 border-amber-600'
                    : 'text-sky-800 hover:text-sky-950'
                }`}
                title="Switch to Grade 5: Kingdom of Fractions & Decimals (Morning Sky)"
              >
                Grade 5
              </button>
              <button
                type="button"
                onClick={() => handleGradeChange(6)}
                className={`px-3 py-1 rounded-xl text-[16px] font-heading font-black transition-all cursor-pointer whitespace-nowrap ${
                  grade === 6
                    ? 'bg-amber-400 text-amber-950 shadow-sm border-b-2 border-amber-600'
                    : 'text-sky-800 hover:text-sky-950'
                }`}
                title="Switch to Grade 6: Dominion of Ratios & Integers (Golden-Hour / Dusk)"
              >
                Grade 6
              </button>
            </div>

            {/* Opt-In Sound Toggle (Default Muted) */}
            <button
              type="button"
              onClick={toggleMute}
              className={`touch-target-kid w-11 h-11 rounded-2xl border-2 flex items-center justify-center transition-all cursor-pointer ${
                isMuted
                  ? 'bg-slate-100 border-slate-300 text-slate-500 hover:text-slate-800'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs'
              }`}
              title={isMuted ? 'Sound is Muted (Click to enable audio)' : 'Sound is Active (Click to mute)'}
              aria-label={isMuted ? 'Turn Sound On' : 'Turn Sound Off'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
            </button>

          </div>

        </nav>
      </header>

      {/* ─── MAIN CONTENT WITH 350ms CLOUD WIPE TRANSITION ─── */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-28 md:pb-12 relative z-10">
        <CloudWipeTransition pageKey={`${location.pathname}-${grade}`}>
          {children}
        </CloudWipeTransition>
      </main>

      {/* ─── MOBILE BOTTOM TAB BAR (< 768px) ─── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t-3 border-sky-200 px-3 py-2 shadow-lg">
        <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => playSound('click')}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all ${
                  isActive
                    ? 'bg-blue-100 text-blue-900 font-black'
                    : 'text-slate-600 hover:text-indigo-950 font-bold'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-blue-700 stroke-[2.5]' : ''}`} />
                <span className="text-[16px] font-heading mt-0.5 tracking-tight">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
};
