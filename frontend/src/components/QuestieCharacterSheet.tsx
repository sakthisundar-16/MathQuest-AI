import React from 'react';
import { Compass } from 'lucide-react';

/**
 * Static Character Sheet for Questie the Math Explorer
 * Shows colors, proportions, facial expressions, and explorer outfit before animation rig.
 */
export const QuestieCharacterSheet: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 sm:p-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border-3 border-sky-200 p-8 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-sm font-extrabold mb-2">
              <Compass className="w-4 h-4 text-amber-800" />
              <span>Character Design Specification</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 text-amber-950">Draft v1.0</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-indigo-950 tracking-tight">
              Questie the Math Explorer
            </h1>
            <p className="text-lg text-slate-600 mt-2 max-w-2xl">
              Official character model sheet for 10–12 year olds (Grades 5 &amp; 6). Designed for high empathy, positive reinforcement, and clear 2D silhouette readability.
            </p>
          </div>
          <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 text-center">
            <span className="block text-xs uppercase font-extrabold text-sky-800">Target Proportions</span>
            <span className="text-2xl font-black text-indigo-950">1.2 : 1</span>
            <span className="block text-xs text-sky-700 font-semibold">Head to Torso (Chibi)</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Poses & Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Full-Body Turnaround (Front & 3/4 View) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border-3 border-sky-200 p-8 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl font-black text-indigo-950">Full-Body Model Sheet</h2>
              <p className="text-base text-slate-500 font-medium">Front Orthographic Stance &amp; Three-Quarter Explorer Pose</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-purple-100 text-purple-900 text-xs font-black">
              Vector SVG Rig Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center justify-items-center py-4">
            
            {/* Front View */}
            <div className="flex flex-col items-center space-y-3 p-4 bg-sky-50/70 rounded-2xl border-2 border-sky-100 w-full">
              <span className="text-sm font-extrabold text-sky-900 bg-white px-3 py-0.5 rounded-full shadow-xs">
                A. Front Stance
              </span>
              <svg viewBox="0 0 200 240" className="w-56 h-64 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background Shadow */}
                <ellipse cx="100" cy="225" rx="55" ry="10" fill="#CBD5E1" opacity="0.6" />

                {/* Backpack (Peeking behind body) */}
                <rect x="52" y="105" width="96" height="80" rx="20" fill="#9A3412" stroke="#1E1B4B" strokeWidth="3.5" />
                <rect x="62" y="92" width="76" height="18" rx="8" fill="#FF7A59" stroke="#1E1B4B" strokeWidth="3" />
                {/* Rolled Math Parchment Map */}
                <rect x="135" y="100" width="22" height="48" rx="6" fill="#FEF3C7" stroke="#1E1B4B" strokeWidth="2.5" />
                <line x1="140" y1="112" x2="152" y2="112" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
                <line x1="140" y1="124" x2="152" y2="124" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />

                {/* Sturdy Expedition Boots */}
                <g id="boots">
                  {/* Left Boot */}
                  <rect x="62" y="200" width="28" height="26" rx="10" fill="#EA580C" stroke="#1E1B4B" strokeWidth="3" />
                  <rect x="58" y="218" width="34" height="9" rx="4" fill="#9A3412" stroke="#1E1B4B" strokeWidth="2" />
                  <circle cx="70" cy="210" r="2.5" fill="#FEF3C7" />
                  <circle cx="80" cy="210" r="2.5" fill="#FEF3C7" />

                  {/* Right Boot */}
                  <rect x="110" y="200" width="28" height="26" rx="10" fill="#EA580C" stroke="#1E1B4B" strokeWidth="3" />
                  <rect x="108" y="218" width="34" height="9" rx="4" fill="#9A3412" stroke="#1E1B4B" strokeWidth="2" />
                  <circle cx="118" cy="210" r="2.5" fill="#FEF3C7" />
                  <circle cx="128" cy="210" r="2.5" fill="#FEF3C7" />
                </g>

                {/* Torso & Wings */}
                <ellipse cx="100" cy="155" rx="50" ry="46" fill="#38BDF8" stroke="#1E1B4B" strokeWidth="3.5" />
                
                {/* Buttercream Belly with Math Symbols */}
                <ellipse cx="100" cy="162" rx="32" ry="32" fill="#FEF3C7" stroke="#1E1B4B" strokeWidth="2.5" />
                {/* Subtle feather math runes */}
                <path d="M92 152 L108 152 M100 144 L100 160" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M90 172 L110 172 M90 177 L110 177" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />

                {/* Explorer Vest */}
                <path d="M60 135 C64 165 72 190 78 194 C82 170 78 140 74 135 Z" fill="#F59E0B" stroke="#1E1B4B" strokeWidth="3" />
                <path d="M140 135 C136 165 128 190 122 194 C118 170 122 140 126 135 Z" fill="#F59E0B" stroke="#1E1B4B" strokeWidth="3" />
                {/* Golden Brass Compass Badge on Vest */}
                <circle cx="78" cy="152" r="7" fill="#FBBF24" stroke="#1E1B4B" strokeWidth="2" />
                <polygon points="78,148 81,152 78,156 75,152" fill="#EA580C" />

                {/* Articulated Wings/Arms */}
                {/* Left Arm holding magnifying glass */}
                <path d="M52 145 C35 155 32 175 42 186 C50 180 55 165 54 148 Z" fill="#0284C7" stroke="#1E1B4B" strokeWidth="3" />
                {/* Brass Magnifying Glass */}
                <circle cx="34" cy="188" r="14" fill="#BAE6FD" stroke="#F59E0B" strokeWidth="3.5" opacity="0.85" />
                <line x1="42" y1="198" x2="52" y2="210" stroke="#9A3412" strokeWidth="4.5" strokeLinecap="round" />

                {/* Right Arm resting ready */}
                <path d="M148 145 C165 155 168 175 158 186 C150 180 145 165 146 148 Z" fill="#0284C7" stroke="#1E1B4B" strokeWidth="3" />

                {/* Big Expressive Head */}
                <ellipse cx="100" cy="82" rx="54" ry="48" fill="#38BDF8" stroke="#1E1B4B" strokeWidth="4" />
                
                {/* Ear Feather Tufts */}
                <polygon points="56,44 42,24 64,36" fill="#0284C7" stroke="#1E1B4B" strokeWidth="3" strokeLinejoin="round" />
                <polygon points="144,44 158,24 136,36" fill="#0284C7" stroke="#1E1B4B" strokeWidth="3" strokeLinejoin="round" />

                {/* Explorer Cap */}
                <path d="M54 52 C60 30 140 30 146 52 C154 56 160 62 160 66 C150 68 50 68 40 66 C40 62 46 56 54 52 Z" fill="#1E1B4B" stroke="#1E1B4B" strokeWidth="3" />
                <rect x="52" y="48" width="96" height="8" fill="#F59E0B" />

                {/* Explorer Goggles on Cap */}
                <rect x="66" y="34" width="28" height="20" rx="8" fill="#FBBF24" stroke="#1E1B4B" strokeWidth="3" />
                <circle cx="80" cy="44" r="8" fill="#E0F2FE" />
                <rect x="106" y="34" width="28" height="20" rx="8" fill="#FBBF24" stroke="#1E1B4B" strokeWidth="3" />
                <circle cx="120" cy="44" r="8" fill="#E0F2FE" />
                <line x1="94" y1="44" x2="106" y2="44" stroke="#F59E0B" strokeWidth="4" />

                {/* Large Round Friendly Eyes */}
                {/* Left Eye */}
                <circle cx="78" cy="86" r="19" fill="#FFFFFF" stroke="#1E1B4B" strokeWidth="3.5" />
                <circle cx="82" cy="86" r="11" fill="#1E1B4B" />
                <circle cx="85" cy="82" r="4.5" fill="#FFFFFF" />
                <circle cx="79" cy="91" r="2" fill="#FFFFFF" />

                {/* Right Eye */}
                <circle cx="122" cy="86" r="19" fill="#FFFFFF" stroke="#1E1B4B" strokeWidth="3.5" />
                <circle cx="118" cy="86" r="11" fill="#1E1B4B" />
                <circle cx="121" cy="82" r="4.5" fill="#FFFFFF" />
                <circle cx="115" cy="91" r="2" fill="#FFFFFF" />

                {/* Cheerful Golden Beak */}
                <polygon points="100,94 88,108 112,108" fill="#EA580C" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
                {/* Rosy Cheeks */}
                <ellipse cx="60" cy="98" rx="8" ry="5" fill="#FF6FB5" opacity="0.45" />
                <ellipse cx="140" cy="98" rx="8" ry="5" fill="#FF6FB5" opacity="0.45" />
              </svg>
              <span className="text-xs text-slate-500 font-bold">Front: 1.2:1 Chibi proportions</span>
            </div>

            {/* 3/4 Adventure Pose */}
            <div className="flex flex-col items-center space-y-3 p-4 bg-sky-50/70 rounded-2xl border-2 border-sky-100 w-full">
              <span className="text-sm font-extrabold text-sky-900 bg-white px-3 py-0.5 rounded-full shadow-xs">
                B. Three-Quarter View
              </span>
              <svg viewBox="0 0 200 240" className="w-56 h-64 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background Shadow */}
                <ellipse cx="95" cy="225" rx="55" ry="10" fill="#CBD5E1" opacity="0.6" />

                {/* Heavy Adventure Backpack profile */}
                <rect x="25" y="105" width="55" height="85" rx="16" fill="#9A3412" stroke="#1E1B4B" strokeWidth="3.5" />
                <circle cx="45" cy="130" r="6" fill="#FF7A59" stroke="#1E1B4B" strokeWidth="2" />
                {/* Backpack Bedroll Top */}
                <rect x="22" y="90" width="58" height="18" rx="8" fill="#FF7A59" stroke="#1E1B4B" strokeWidth="3" />
                
                {/* Boots in step */}
                <rect x="58" y="202" width="28" height="24" rx="10" fill="#EA580C" stroke="#1E1B4B" strokeWidth="3" />
                <rect x="108" y="198" width="30" height="25" rx="10" fill="#EA580C" stroke="#1E1B4B" strokeWidth="3" />

                {/* Torso */}
                <ellipse cx="102" cy="155" rx="46" ry="46" fill="#38BDF8" stroke="#1E1B4B" strokeWidth="3.5" />
                <path d="M85 130 C105 130 135 150 132 188 C105 195 85 175 85 130 Z" fill="#FEF3C7" stroke="#1E1B4B" strokeWidth="2.5" />
                
                {/* Vest with Brass Buckle */}
                <path d="M72 135 L88 190 L98 188 L85 135 Z" fill="#F59E0B" stroke="#1E1B4B" strokeWidth="3" />
                <circle cx="85" cy="158" r="4" fill="#FBBF24" stroke="#1E1B4B" strokeWidth="2" />

                {/* Head 3/4 turn */}
                <ellipse cx="106" cy="82" rx="52" ry="46" fill="#38BDF8" stroke="#1E1B4B" strokeWidth="4" />
                
                {/* Cap & Goggles angled */}
                <path d="M62 48 C75 28 145 32 152 56 C158 60 162 66 158 68 C145 70 55 68 52 64 Z" fill="#1E1B4B" stroke="#1E1B4B" strokeWidth="3" />
                <rect x="80" y="36" width="26" height="18" rx="7" fill="#FBBF24" stroke="#1E1B4B" strokeWidth="3" />
                <rect x="114" y="38" width="24" height="18" rx="7" fill="#FBBF24" stroke="#1E1B4B" strokeWidth="3" />

                {/* Eyes in 3/4 perspective */}
                <circle cx="86" cy="86" r="17" fill="#FFFFFF" stroke="#1E1B4B" strokeWidth="3.5" />
                <circle cx="90" cy="86" r="10" fill="#1E1B4B" />
                <circle cx="93" cy="82" r="4" fill="#FFFFFF" />

                <circle cx="126" cy="86" r="18" fill="#FFFFFF" stroke="#1E1B4B" strokeWidth="3.5" />
                <circle cx="128" cy="86" r="10.5" fill="#1E1B4B" />
                <circle cx="131" cy="82" r="4" fill="#FFFFFF" />

                {/* Beak side-facing */}
                <polygon points="106,94 98,106 122,104" fill="#EA580C" stroke="#1E1B4B" strokeWidth="2.5" />

                {/* Arm holding Compass */}
                <path d="M125 145 C145 150 152 165 142 178 C135 174 128 160 125 145 Z" fill="#0284C7" stroke="#1E1B4B" strokeWidth="3" />
                <circle cx="144" cy="182" r="10" fill="#FBBF24" stroke="#1E1B4B" strokeWidth="2.5" />
              </svg>
              <span className="text-xs text-slate-500 font-bold">3/4 View: Shows gear &amp; backpack</span>
            </div>

          </div>

          {/* Construction Notes */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-amber-950 space-y-1">
            <span className="font-extrabold uppercase text-amber-900 block">Design System Verification:</span>
            <p>• <strong>Line weight:</strong> 3.5px primary strokes, 2.5px inner strokes with rounded joins to avoid harsh edges.</p>
            <p>• <strong>Color harmony:</strong> Uses high contrast Sky Blue (`#38BDF8`) &amp; Buttercream (`#FEF3C7`) against Ink (`#1E1B4B`) for optimal WCAG AA visibility.</p>
          </div>
        </div>

        {/* Right Column: Facial Expression Sheet & Palette */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Facial Expression Sheet */}
          <div className="bg-white rounded-3xl border-3 border-sky-200 p-8 shadow-md space-y-6">
            <div className="border-b-2 border-slate-100 pb-3">
              <h2 className="text-2xl font-black text-indigo-950">Expression Rig</h2>
              <p className="text-sm text-slate-500 font-medium">4 Core Reactions for Live In-Game State Engine</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              
              {/* 1. Happy / Arrival */}
              <div className="p-4 bg-sky-50 rounded-2xl border-2 border-sky-200 text-center space-y-2">
                <svg viewBox="0 0 100 90" className="w-20 h-20 mx-auto" fill="none">
                  <ellipse cx="50" cy="45" rx="42" ry="38" fill="#38BDF8" stroke="#1E1B4B" strokeWidth="3" />
                  <circle cx="34" cy="42" r="14" fill="#FFFFFF" stroke="#1E1B4B" strokeWidth="2.5" />
                  <circle cx="36" cy="42" r="8" fill="#1E1B4B" />
                  <circle cx="39" cy="39" r="3" fill="#FFFFFF" />
                  <circle cx="66" cy="42" r="14" fill="#FFFFFF" stroke="#1E1B4B" strokeWidth="2.5" />
                  <circle cx="64" cy="42" r="8" fill="#1E1B4B" />
                  <circle cx="67" cy="39" r="3" fill="#FFFFFF" />
                  <polygon points="50,50 42,60 58,60" fill="#EA580C" stroke="#1E1B4B" strokeWidth="2" />
                  <ellipse cx="24" cy="52" rx="6" ry="3.5" fill="#FF6FB5" opacity="0.5" />
                  <ellipse cx="76" cy="52" rx="6" ry="3.5" fill="#FF6FB5" opacity="0.5" />
                </svg>
                <div className="text-sm font-extrabold text-indigo-950">1. Cheerful Wave</div>
                <div className="text-xs text-slate-500">Landing, Realm select</div>
              </div>

              {/* 2. Eureka / Correct Answer */}
              <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-200 text-center space-y-2">
                <svg viewBox="0 0 100 90" className="w-20 h-20 mx-auto" fill="none">
                  <ellipse cx="50" cy="45" rx="42" ry="38" fill="#38BDF8" stroke="#1E1B4B" strokeWidth="3" />
                  {/* Star Eyes */}
                  <circle cx="34" cy="42" r="14" fill="#FEF3C7" stroke="#1E1B4B" strokeWidth="2.5" />
                  <polygon points="34,35 37,42 44,42 38,46 41,53 34,48 27,53 30,46 24,42 31,42" fill="#F59E0B" />
                  <circle cx="66" cy="42" r="14" fill="#FEF3C7" stroke="#1E1B4B" strokeWidth="2.5" />
                  <polygon points="66,35 69,42 76,42 70,46 73,53 66,48 59,53 62,46 56,42 63,42" fill="#F59E0B" />
                  {/* Open Beak Cheer */}
                  <polygon points="50,48 38,62 62,62" fill="#EA580C" stroke="#1E1B4B" strokeWidth="2" />
                  <ellipse cx="50" cy="57" rx="6" ry="3" fill="#991B1B" />
                </svg>
                <div className="text-sm font-extrabold text-emerald-950">2. Eureka! Cheer</div>
                <div className="text-xs text-emerald-700">Correct (+10 XP)</div>
              </div>

              {/* 3. Friendly Reassurance / Encouraging */}
              <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-200 text-center space-y-2">
                <svg viewBox="0 0 100 90" className="w-20 h-20 mx-auto" fill="none">
                  <g transform="rotate(6, 50, 45)">
                    <ellipse cx="50" cy="45" rx="42" ry="38" fill="#38BDF8" stroke="#1E1B4B" strokeWidth="3" />
                    {/* Kind soft eyes */}
                    <path d="M22 40 C28 32 40 32 46 40" stroke="#1E1B4B" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="34" cy="44" r="6" fill="#1E1B4B" />
                    <circle cx="66" cy="42" r="13" fill="#FFFFFF" stroke="#1E1B4B" strokeWidth="2.5" />
                    <circle cx="66" cy="42" r="7" fill="#1E1B4B" />
                    <circle cx="69" cy="40" r="2.5" fill="#FFFFFF" />
                    <polygon points="50,52 44,60 56,60" fill="#EA580C" stroke="#1E1B4B" strokeWidth="2" />
                  </g>
                </svg>
                <div className="text-sm font-extrabold text-amber-950">3. Kind "Oops"</div>
                <div className="text-xs text-amber-800">Warm hint &amp; no shame</div>
              </div>

              {/* 4. Thinking / Problem Solving */}
              <div className="p-4 bg-purple-50 rounded-2xl border-2 border-purple-200 text-center space-y-2">
                <svg viewBox="0 0 100 90" className="w-20 h-20 mx-auto" fill="none">
                  <ellipse cx="50" cy="45" rx="42" ry="38" fill="#38BDF8" stroke="#1E1B4B" strokeWidth="3" />
                  {/* Looking Up Eyes */}
                  <circle cx="34" cy="42" r="14" fill="#FFFFFF" stroke="#1E1B4B" strokeWidth="2.5" />
                  <circle cx="34" cy="36" r="7" fill="#1E1B4B" />
                  <circle cx="66" cy="42" r="14" fill="#FFFFFF" stroke="#1E1B4B" strokeWidth="2.5" />
                  <circle cx="66" cy="36" r="7" fill="#1E1B4B" />
                  <polygon points="50,50 45,58 55,58" fill="#EA580C" stroke="#1E1B4B" strokeWidth="2" />
                  {/* Floating Question Bulb */}
                  <circle cx="82" cy="18" r="8" fill="#FBBF24" stroke="#1E1B4B" strokeWidth="2" />
                  <text x="80" y="22" fontSize="11" fontWeight="bold" fill="#1E1B4B">?</text>
                </svg>
                <div className="text-sm font-extrabold text-purple-950">4. Thinking Pose</div>
                <div className="text-xs text-purple-700">Waiting on user input</div>
              </div>

            </div>
          </div>

          {/* Color Palette Swatches */}
          <div className="bg-white rounded-3xl border-3 border-sky-200 p-8 shadow-md space-y-4">
            <h2 className="text-2xl font-black text-indigo-950 border-b-2 border-slate-100 pb-2">
              Character Palette Swatches
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl border-2 border-sky-200 bg-sky-50 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#38BDF8] border-2 border-sky-400 shadow-xs" />
                <div>
                  <span className="block text-xs font-black text-slate-800">Sky Blue</span>
                  <span className="text-[11px] text-slate-500 font-mono">#38BDF8</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl border-2 border-amber-200 bg-amber-50 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] border-2 border-amber-300 shadow-xs" />
                <div>
                  <span className="block text-xs font-black text-slate-800">Buttercream</span>
                  <span className="text-[11px] text-slate-500 font-mono">#FEF3C7</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl border-2 border-orange-200 bg-orange-50 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F59E0B] border-2 border-orange-400 shadow-xs" />
                <div>
                  <span className="block text-xs font-black text-slate-800">Explorer Gold</span>
                  <span className="text-[11px] text-slate-500 font-mono">#F59E0B</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl border-2 border-red-200 bg-red-50 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EA580C] border-2 border-red-400 shadow-xs" />
                <div>
                  <span className="block text-xs font-black text-slate-800">Tangerine</span>
                  <span className="text-[11px] text-slate-500 font-mono">#EA580C</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl border-2 border-amber-900/20 bg-amber-50/50 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#9A3412] border-2 border-amber-950 shadow-xs" />
                <div>
                  <span className="block text-xs font-black text-slate-800">Chestnut Gear</span>
                  <span className="text-[11px] text-slate-500 font-mono">#9A3412</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl border-2 border-indigo-200 bg-indigo-50 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1E1B4B] border-2 border-indigo-950 shadow-xs" />
                <div>
                  <span className="block text-xs font-black text-slate-800">Ink Linework</span>
                  <span className="text-[11px] text-slate-500 font-mono">#1E1B4B</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
