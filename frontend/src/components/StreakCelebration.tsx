/**
 * StreakCelebration.tsx
 * Animated milestone celebration component shown after quiz completion.
 * Research finding: Non-punishing positive reinforcement drives retention (Duolingo study, 2024).
 */
import React, { useEffect, useState } from 'react';
import { Flame, Star, Zap, Trophy, Sparkles, LucideIcon } from 'lucide-react';

interface Props {
  streakDays: number;
  pointsEarned: number;
  accuracy: number;
}

export const StreakCelebration: React.FC<Props> = ({ streakDays, pointsEarned, accuracy }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible || accuracy < 0.5) return null;

  const getMessage = (): { icon: LucideIcon; text: string; color: string } => {
    if (accuracy >= 0.9) return { icon: Trophy, text: 'Genius Level Unlocked!', color: 'from-amber-400 to-orange-500' };
    if (accuracy >= 0.7) return { icon: Sparkles, text: 'Math Champion!', color: 'from-indigo-500 to-blue-600' };
    return { icon: Zap, text: 'Keep Going, Superstar!', color: 'from-emerald-400 to-teal-500' };
  };

  const { icon: StatusIcon, text, color } = getMessage();

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none`}>
      <div
        className={`pointer-events-auto bg-gradient-to-br ${color} text-white rounded-3xl shadow-2xl p-8 max-w-sm mx-4 text-center space-y-4 
          animate-bounce-in border-4 border-white/30`}
        style={{ animation: 'bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
      >
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center shadow-lg">
            <StatusIcon className="w-10 h-10 text-white fill-white/80" />
          </div>
        </div>
        <h2 className="text-2xl font-black">{text}</h2>
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-1.5">
            <Flame className="w-5 h-5 text-orange-200 fill-orange-300" />
            <span className="font-bold text-lg">{streakDays} Day Streak!</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-5 h-5 text-yellow-200 fill-yellow-300" />
            <span className="font-bold text-lg">+{pointsEarned} pts</span>
          </div>
        </div>
        <p className="text-sm text-white/90">Come back tomorrow to keep your streak alive!</p>
      </div>
    </div>
  );
};
