import React from 'react';
import { QuestieMascot } from './QuestieMascot';
import { Sparkles } from 'lucide-react';

interface SuspenseLoaderProps {
  message?: string;
  minHeight?: string;
}

/**
 * SuspenseLoader: Kid-friendly animated loading state.
 * Replaces flat grey skeletons with Questie running on a floating island.
 */
export const SuspenseLoader: React.FC<SuspenseLoaderProps> = ({
  message = 'Loading your Math Island adventure...',
  minHeight = 'min-h-[60vh]',
}) => {
  return (
    <div
      className={`w-full ${minHeight} flex flex-col items-center justify-center p-6 select-none`}
      role="status"
      aria-live="polite"
    >
      <div className="relative flex flex-col items-center text-center space-y-5 max-w-md p-8 rounded-3xl bg-white/95 border-3 border-sky-200 shadow-xl backdrop-blur-md">
        
        {/* Animated Questie Mascot on Mini Floating Island */}
        <div className="relative">
          <QuestieMascot size={160} mood="thinking" />
        </div>

        {/* Loading Message & Sparkle */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[16px] font-heading font-black uppercase tracking-wider text-sky-800 bg-sky-50 px-4 py-1 rounded-full border-2 border-sky-200">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Math Island Adventure</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-heading font-black text-indigo-950">
            {message}
          </h3>
          <p className="text-[16px] font-body font-bold text-slate-600">
            Unpacking fun challenges and math relics...
          </p>
        </div>

        {/* Tactile Chunky Progress Indicator */}
        <div className="w-56 h-3.5 bg-sky-100 rounded-full overflow-hidden border-2 border-sky-200 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-pink-400 to-purple-500 rounded-full animate-pulse"
            style={{ width: '80%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default SuspenseLoader;
