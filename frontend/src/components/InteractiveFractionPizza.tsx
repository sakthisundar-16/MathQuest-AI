import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { PieChart } from 'lucide-react';
import { useSound } from '../context/SoundContext';

type FractionMode = 1 | 2 | 4 | 8;

interface InteractiveFractionPizzaProps {
  onSliceClick?: (fractionText: string) => void;
}

/**
 * InteractiveFractionPizza: Educational, tactile math toy for the hero scene.
 * Replaces the generic 3D gem.
 * - Slices split into 1/2, 1/4, 1/8 and snap back.
 * - Clicking slices pulls them out with spring physics and shows clear fraction labels.
 * - Fully accessible and kid-friendly.
 */
export const InteractiveFractionPizza: React.FC<InteractiveFractionPizzaProps> = ({ onSliceClick }) => {
  const [splitMode, setSplitMode] = useState<FractionMode>(4); // default 4 slices (quarters)
  const [activeSlice, setActiveSlice] = useState<number | null>(null);
  const [slicesEaten, setSlicesEaten] = useState<number[]>([]);
  const prefersReduced = useReducedMotion();
  const { playSound } = useSound();

  const handleModeChange = (mode: FractionMode) => {
    playSound('whoosh');
    setSplitMode(mode);
    setActiveSlice(null);
    setSlicesEaten([]);
  };

  const handleSliceClick = (index: number) => {
    playSound('click');
    if (activeSlice === index) {
      setActiveSlice(null);
    } else {
      setActiveSlice(index);
      const fractionLabel = `1/${splitMode}`;
      if (onSliceClick) onSliceClick(fractionLabel);
    }
  };

  const resetPizza = () => {
    playSound('correct');
    setActiveSlice(null);
    setSlicesEaten([]);
  };

  // Generate SVG path for an arc slice from angleA to angleB
  const getSlicePath = (index: number, total: number, radius = 90, cx = 110, cy = 110) => {
    if (total === 1) {
      return `M ${cx} ${cy - radius} A ${radius} ${radius} 0 1 1 ${cx} ${cy + radius} A ${radius} ${radius} 0 1 1 ${cx} ${cy - radius}`;
    }
    const angleStep = 360 / total;
    const startAngle = index * angleStep - 90;
    const endAngle = startAngle + angleStep;

    const rad = (deg: number) => (deg * Math.PI) / 180;
    const x1 = cx + radius * Math.cos(rad(startAngle));
    const y1 = cy + radius * Math.sin(rad(startAngle));
    const x2 = cx + radius * Math.cos(rad(endAngle));
    const y2 = cy + radius * Math.sin(rad(endAngle));

    const largeArc = angleStep > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  // Compute pull-out translation vector for active slice
  const getSliceOffset = (index: number, total: number, distance = 14) => {
    if (activeSlice !== index || total === 1) return { x: 0, y: 0 };
    const angleStep = 360 / total;
    const midAngle = (index + 0.5) * angleStep - 90;
    const rad = (midAngle * Math.PI) / 180;
    return {
      x: Math.cos(rad) * distance,
      y: Math.sin(rad) * distance
    };
  };

  return (
    <div className="relative flex flex-col items-center select-none w-full max-w-[340px] sm:max-w-[380px] mx-auto">
      
      {/* Floating Wooden Island Platter */}
      <div className="relative p-5 sm:p-6 rounded-3xl bg-white/95 border-3 border-sky-200 shadow-xl backdrop-blur-md flex flex-col items-center w-full">
        
        {/* Header / Fraction Banner */}
        <div className="w-full flex items-center justify-between gap-2 pb-3 border-b-2 border-sky-100 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shadow-2xs">
              <PieChart className="w-4 h-4" />
            </div>
            <span className="font-heading font-black text-base sm:text-lg text-indigo-950">
              Chef Marco's Fraction Pizza
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-heading font-black text-sm border border-amber-300">
            {activeSlice !== null ? `1/${splitMode} Slice` : `${splitMode}/${splitMode} Whole`}
          </span>
        </div>

        {/* Interactive Pizza SVG Canvas */}
        <div className="relative my-2 w-[220px] h-[220px] sm:w-[240px] sm:h-[240px]">
          <svg viewBox="0 0 220 220" className="w-full h-full drop-shadow-md">
            
            {/* Wooden Cutting Board Base */}
            <circle cx="110" cy="110" r="105" fill="#FDE68A" stroke="#D97706" strokeWidth="4" />
            <circle cx="110" cy="110" r="98" fill="#F59E0B" opacity="0.25" />

            {/* Pizza Crust Edge */}
            <circle cx="110" cy="110" r="92" fill="#D97706" stroke="#92400E" strokeWidth="3" />
            
            {/* Tomato Sauce Layer */}
            <circle cx="110" cy="110" r="84" fill="#DC2626" />

            {/* Melted Golden Cheese Base */}
            <circle cx="110" cy="110" r="80" fill="#FDE047" stroke="#EA580C" strokeWidth="1.5" />

            {/* Interactive Pizza Slices */}
            {Array.from({ length: splitMode }).map((_, idx) => {
              const offset = getSliceOffset(idx, splitMode);
              const isSelected = activeSlice === idx;

              return (
                <motion.g
                  key={`${splitMode}-${idx}`}
                  animate={
                    prefersReduced
                      ? { opacity: 1 }
                      : { x: offset.x, y: offset.y }
                  }
                  transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                  onClick={() => handleSliceClick(idx)}
                  className="cursor-pointer group"
                  tabIndex={0}
                  role="button"
                  aria-label={`Pizza slice ${idx + 1} of ${splitMode}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSliceClick(idx);
                    }
                  }}
                >
                  {/* Slice Wedge */}
                  <path
                    d={getSlicePath(idx, splitMode, 80)}
                    fill={isSelected ? '#FEF08A' : '#FDE047'}
                    stroke="#D97706"
                    strokeWidth={isSelected ? '3.5' : '2'}
                    className="transition-colors group-hover:brightness-105"
                  />

                  {/* Toppings (Pepperoni & Basil Leaves) positioned proportionally */}
                  {(() => {
                    const angleStep = 360 / splitMode;
                    const midAngle = (idx + 0.5) * angleStep - 90;
                    const rad = (midAngle * Math.PI) / 180;
                    const px = 110 + 48 * Math.cos(rad);
                    const py = 110 + 48 * Math.sin(rad);
                    const bx = 110 + 26 * Math.cos(rad + 0.25);
                    const by = 110 + 26 * Math.sin(rad + 0.25);

                    return (
                      <g className="pointer-events-none">
                        {/* Pepperoni Slice */}
                        <circle cx={px} cy={py} r="8.5" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="1.5" />
                        <circle cx={px - 2} cy={py - 2} r="2" fill="#EF4444" opacity="0.6" />
                        {/* Basil Leaf */}
                        <ellipse cx={bx} cy={by} rx="5" ry="3" fill="#15803D" transform={`rotate(${midAngle + 45}, ${bx}, ${by})`} />
                      </g>
                    );
                  })()}
                </motion.g>
              );
            })}

            {/* Center Cut Marks / Crust Hub */}
            <circle cx="110" cy="110" r="6" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
          </svg>

          {/* Floating Tap Prompt / Fraction Callout */}
          {activeSlice !== null && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-400 text-amber-950 font-heading font-black text-sm rounded-full shadow-lg border-2 border-amber-500 whitespace-nowrap"
            >
              ⭐ 1/{splitMode} of the pizza!
            </motion.div>
          )}
        </div>

        {/* Slice Selector Chunky Buttons (1/2, 1/4, 1/8) */}
        <div className="w-full mt-2 pt-3 border-t-2 border-sky-100 flex items-center justify-between gap-1.5">
          <span className="text-xs font-heading font-extrabold text-slate-500">Split into:</span>
          
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleModeChange(1)}
              className={`px-2.5 py-1 rounded-xl font-heading font-extrabold text-sm transition-all cursor-pointer ${
                splitMode === 1
                  ? 'bg-amber-400 text-amber-950 border-b-2 border-amber-600 shadow-xs'
                  : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
              }`}
            >
              1 Whole
            </button>
            <button
              type="button"
              onClick={() => handleModeChange(2)}
              className={`px-2.5 py-1 rounded-xl font-heading font-extrabold text-sm transition-all cursor-pointer ${
                splitMode === 2
                  ? 'bg-amber-400 text-amber-950 border-b-2 border-amber-600 shadow-xs'
                  : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
              }`}
            >
              ½ Halves
            </button>
            <button
              type="button"
              onClick={() => handleModeChange(4)}
              className={`px-2.5 py-1 rounded-xl font-heading font-extrabold text-sm transition-all cursor-pointer ${
                splitMode === 4
                  ? 'bg-amber-400 text-amber-950 border-b-2 border-amber-600 shadow-xs'
                  : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
              }`}
            >
              ¼ Quarters
            </button>
            <button
              type="button"
              onClick={() => handleModeChange(8)}
              className={`px-2.5 py-1 rounded-xl font-heading font-extrabold text-sm transition-all cursor-pointer ${
                splitMode === 8
                  ? 'bg-amber-400 text-amber-950 border-b-2 border-amber-600 shadow-xs'
                  : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
              }`}
            >
              ⅛ Eighths
            </button>
          </div>
        </div>

        {/* Snap Back Button */}
        {activeSlice !== null && (
          <button
            type="button"
            onClick={resetPizza}
            className="mt-3 text-xs font-heading font-black text-sky-700 hover:text-sky-950 underline cursor-pointer"
          >
            Snap slices back together
          </button>
        )}

      </div>
    </div>
  );
};
