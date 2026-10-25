import React from 'react';
import { X, Sparkles, Zap, Flame, Compass, ArrowRight } from 'lucide-react';
import { useSound } from '../context/SoundContext';

export interface DifficultyTierModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicTitle: string;
  grade: number;
  onSelectTier: (tier: 'easy' | 'medium' | 'hard' | 'adaptive') => void;
}

export const DifficultyTierModal: React.FC<DifficultyTierModalProps> = ({
  isOpen,
  onClose,
  topicTitle,
  grade,
  onSelectTier
}) => {
  const { playSound } = useSound();
  if (!isOpen) return null;

  const TIERS = [
    {
      id: 'easy' as const,
      name: 'Easy Explorer Tier',
      badge: `Grade ${grade} Foundations`,
      description: 'Single-step calculations, visual concept models, and friendly numbers.',
      xp: '+10 XP per question',
      icon: Compass,
      color: 'border-emerald-300 bg-emerald-50/70 hover:border-emerald-500 hover:bg-emerald-50 text-emerald-950',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      iconColor: 'bg-emerald-600 text-white'
    },
    {
      id: 'medium' as const,
      name: 'Medium Adventurer Tier',
      badge: 'GSE Standard Level',
      description: 'Applied word problems, standard computations, and multi-step reasoning.',
      xp: '+20 XP per question',
      icon: Zap,
      color: 'border-amber-300 bg-amber-50/70 hover:border-amber-500 hover:bg-amber-50 text-amber-950',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      iconColor: 'bg-amber-500 text-white'
    },
    {
      id: 'hard' as const,
      name: 'Hard Champion Tier',
      badge: 'Advanced Mastery',
      description: 'Challenging multi-step problems, deeper conceptual traps, and higher-order logic.',
      xp: '+30 XP per question',
      icon: Flame,
      color: 'border-purple-300 bg-purple-50/70 hover:border-purple-500 hover:bg-purple-50 text-purple-950',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
      iconColor: 'bg-purple-700 text-white'
    },
    {
      id: 'adaptive' as const,
      name: 'Adaptive Dynamic Arena (Recommended)',
      badge: 'AI Powered',
      description: 'Starts at your current skill and automatically adjusts as you succeed!',
      xp: 'Dynamic Multiplier XP',
      icon: Sparkles,
      color: 'border-sky-300 bg-sky-50/80 hover:border-sky-500 hover:bg-sky-100 text-indigo-950 ring-2 ring-sky-200',
      badgeColor: 'bg-purple-700 text-white',
      iconColor: 'bg-purple-700 text-white'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-3 border-sky-200 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-heading font-black px-3 py-1 rounded-full bg-sky-100 text-indigo-950 border border-sky-200 uppercase tracking-wider">
                Grade {grade} Arena Lobby
              </span>
            </div>
            <h3 className="text-2xl font-heading font-black text-indigo-950 mt-1.5">
              Select Practice Difficulty
            </h3>
            <p className="text-xs font-heading font-bold text-slate-500 mt-0.5">
              Topic: {topicTitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tier Cards List */}
        <div className="space-y-3.5">
          {TIERS.map((tier) => {
            const IconComp = tier.icon;
            return (
              <button
                key={tier.id}
                onClick={() => {
                  playSound('click');
                  onSelectTier(tier.id);
                  onClose();
                }}
                className={`w-full text-left p-4 sm:p-5 rounded-3xl border-3 transition-all flex items-center justify-between gap-4 group cursor-pointer shadow-2xs hover:shadow-md active:scale-98 ${tier.color}`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xs ${tier.iconColor}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-heading font-black text-base leading-snug">{tier.name}</span>
                      <span className={`text-xs font-heading font-black px-2.5 py-0.5 rounded-full border ${tier.badgeColor}`}>
                        {tier.badge}
                      </span>
                    </div>
                    <p className="text-[14px] text-slate-700 mt-1 leading-relaxed font-medium">
                      {tier.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="text-xs font-heading font-black text-amber-950 bg-amber-100 px-2.5 py-1 rounded-xl border border-amber-300 whitespace-nowrap">
                    {tier.xp}
                  </span>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-700 group-hover:translate-x-1 transition-all mt-1" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="p-3.5 bg-sky-50 rounded-2xl border-2 border-sky-100 text-center text-xs text-slate-700 font-heading font-bold">
          You can change your difficulty tier anytime during your quest to practice basics or power up!
        </div>

      </div>
    </div>
  );
};
