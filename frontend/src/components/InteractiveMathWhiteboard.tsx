import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Award,
  RotateCcw,
  Clock,
  Wand2,
  Lightbulb,
  Check,
  MousePointerClick,
  Snowflake,
  Sun,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VideoLesson, VideoLessonSlide } from '../types';
import { QuestieMascot } from './QuestieMascot';
import { useSound } from '../context/SoundContext';

interface InteractiveMathWhiteboardProps {
  lesson: VideoLesson;
  onComplete?: () => void;
  onJumpToPractice?: () => void;
  onRegenerateWithAI?: (customPrompt?: string) => Promise<void>;
  isRegenerating?: boolean;
}

// Web Audio API Synthesizer for rich audio feedback without external MP3 dependencies
class MathSoundFx {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // AudioContext not allowed or unsupported
    }
  }

  playSuccess() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.15, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } catch {
      // AudioContext not allowed or unsupported
    }
  }
}

const soundFx = new MathSoundFx();

// Kid-friendly real world analogies for Grades 5 and 6 topics
const TOPIC_STORIES: Record<string, { title: string; story: string; moral: string }> = {
  'g5-fractions': {
    title: 'The Great Pizza Party',
    story: 'Maya brings 2 warm slices of pizza, and Leo brings 3 slices of pizza from the same 8-slice box. When you put them together on the table, you have 2 + 3 = 5 slices in total! The pizza box is STILL cut into 8 equal parts, which is why the denominator stays 8!',
    moral: 'Rule: When denominators are the same, just add the numerators (the slices)! 2/8 + 3/8 = 5/8'
  },
  'g6-fractions-division': {
    title: 'The Party Sharing Riddle',
    story: 'Imagine you have 2 whole pizzas and each person eats 1/2 of a pizza. How many people can eat? Since each pizza has 2 halves, 2 pizzas have 4 halves! So 2 ÷ 1/2 = 4! Dividing by a fraction gives a BIGGER answer because small pieces fit more times into the whole!',
    moral: 'Rule: Keep the first fraction, Change ÷ to ×, and Flip the second fraction upside down!'
  },
  'g6-integers': {
    title: 'The Submarine & The Hot Air Balloon',
    story: 'Zero is the ocean surface where the sun shines. A submarine dives 3 meters underwater (-3). Then it turns on its powerful water thrusters and ascends 5 meters (+5). Where is it now? -3 + 5 = +2 meters up in the warm tropical breeze!',
    moral: 'Rule: Moving right on the number line adds positive value. Moving left subtracts value into the negatives!'
  },
  'g6-algebra': {
    title: 'The Island Seesaw & Mystery Treasure Chest',
    story: 'Questie finds a locked mystery chest marked x. On a seesaw scale, the chest plus 4 shiny gold coins exactly balances 10 gold coins on the other side! To find out the chest’s weight, Questie scoops away 4 coins from BOTH sides. The seesaw stays perfectly flat, revealing x = 6!',
    moral: 'The Golden Rule of Algebra: Whatever you do to one side of the equal sign, you MUST do to the other side!'
  },
  'g5-decimals': {
    title: 'The 100-Penny Dollar Bill',
    story: 'Imagine 1 dollar is split into 100 shiny copper pennies. 75 pennies is 0.75 of a dollar, and 25 pennies is 0.25 of a dollar. When you combine them, 75 + 25 = 100 pennies = 1 whole dollar (1.00)!',
    moral: 'Rule: Line up the decimal points like buttons on a shirt before you add!'
  },
  'g5-geometry': {
    title: 'The Puppy Garden Fence',
    story: 'Your playful puppy needs a wooden fence around a rectangular lawn of length 8 meters and width 4 meters. To find out how much wood to buy, walk along the entire edge: 8 + 4 + 8 + 4 = 24 meters of fence!',
    moral: 'Rule: Perimeter is the total distance around the outside boundary of any shape!'
  },
  'g6-lines-angles': {
    title: 'The Clock Hands Journey',
    story: 'Watch the clock hands! At 3:00, the hands make a sharp square corner of 90° (Right angle). When hands close together like 2:00, it is sharp and acute (<90°). Wide open like 4:00 is obtuse (>90°)!',
    moral: 'Rule: Acute is small (<90°), Right is exact square (90°), Obtuse is wide (>90°), Straight is flat (180°)!'
  },
  'g5-place-value': {
    title: 'The World Currency Vault',
    story: 'In India, 25,40,000 is read as 25 Lakhs, 40 Thousand because commas group by 3, then by 2. Internationally, 2,540,000 is 2 Million 540 Thousand with commas every 3 digits. Both represent the exact same fortune!',
    moral: 'Rule: Commas organize place value columns so large numbers are effortless to read!'
  },
  'g6-data-handling': {
    title: 'The Fair-Share Cookie Jar',
    story: 'Three friends have 4 cookies, 6 cookies, and 8 cookies. To be completely fair, they put all 18 cookies into one big bowl (4 + 6 + 8 = 18) and divide them equally among 3 friends: 18 ÷ 3 = 6 cookies each! 6 is the Mean (Average)!',
    moral: 'Rule: Mean = Sum of all numbers divided by the count of items!'
  }
};

export const InteractiveMathWhiteboard: React.FC<InteractiveMathWhiteboardProps> = ({
  lesson,
  onComplete,
  onJumpToPractice,
  onRegenerateWithAI,
  isRegenerating = false
}) => {
  const { playSound } = useSound();
  const [currentSlideIdx, setCurrentSlideIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [selectedCheckAnswer, setSelectedCheckAnswer] = useState<string | null>(null);
  const [checkPassed, setCheckPassed] = useState<boolean | null>(null);
  const [showXpBanner, setShowXpBanner] = useState<boolean>(false);

  // Slide Timer & Progress Bar State
  const [slideProgress, setSlideProgress] = useState<number>(0); // 0 to 100%
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [customAiPrompt, setCustomAiPrompt] = useState<string>('');

  // Topic specific interactive simulation states
  const [pizzaHoverSlice, setPizzaHoverSlice] = useState<number | null>(null);
  const [pizzaPartA, setPizzaPartA] = useState<number>(2); // 2/8 (amber)
  const [pizzaPartB, setPizzaPartB] = useState<number>(3); // 3/8 (emerald)
  const [eatenSlices, setEatenSlices] = useState<number[]>([]);
  const [showDenomWhy, setShowDenomWhy] = useState<boolean>(false);
  const [showStoryMode, setShowStoryMode] = useState<boolean>(false);
  const [ratioMultiplier, setRatioMultiplier] = useState<number>(2);
  const [integerStep, setIntegerStep] = useState<number>(2);
  const [algebraBalanced, setAlgebraBalanced] = useState<boolean>(false);
  const [algebraTilt, setAlgebraTilt] = useState<number>(0);
  const [keepChangeFlipped, setKeepChangeFlipped] = useState<boolean>(false);
  const [placeValueSystem, setPlaceValueSystem] = useState<'indian' | 'international'>('indian');
  const [angleDegrees, setAngleDegrees] = useState<number>(90);

  const currentSlide: VideoLessonSlide | undefined = lesson.slides[currentSlideIdx];
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Compute estimated duration in seconds for current slide
  const getSlideDurationSec = (slide?: VideoLessonSlide): number => {
    if (!slide) return 10;
    const wordCount = slide.narration_text.split(/\s+/).length;
    const baseDuration = Math.max(8, Math.min(22, Math.round(wordCount / 2.2)));
    return Math.max(5, Math.round(baseDuration / playbackSpeed));
  };

  const slideDurationSec = getSlideDurationSec(currentSlide);

  // Stop speech when unmounting
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Reset interactive check state on slide change
  useEffect(() => {
    setSelectedCheckAnswer(null);
    setCheckPassed(null);
    setSlideProgress(0);
    setElapsedSeconds(0);
  }, [currentSlideIdx, lesson]);

  // Handle slide advance
  const advanceSlide = () => {
    if (currentSlideIdx < lesson.slides.length - 1) {
      setCurrentSlideIdx((prev) => prev + 1);
      soundFx.playChime();
    } else {
      setIsPlaying(false);
      soundFx.playSuccess();
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      if (onComplete) onComplete();
    }
  };

  // Robust Auto-Progression Engine (runs whether voice is enabled or muted!)
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (!isPlaying || !currentSlide) return;

    // If waiting for interactive checkpoint, do not advance automatically
    if (currentSlide.interactive_check && !checkPassed) {
      return;
    }

    const intervalMs = 100;
    const totalSteps = (slideDurationSec * 1000) / intervalMs;
    let currentStep = 0;

    timerRef.current = setInterval(() => {
      currentStep++;
      const pct = Math.min(100, Math.round((currentStep / totalSteps) * 100));
      setSlideProgress(pct);
      setElapsedSeconds(Math.round((currentStep * intervalMs) / 1000));

      if (pct >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        advanceSlide();
      }
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentSlideIdx, slideDurationSec, checkPassed, currentSlide]);

  // Voice narration effect (Web Speech API)
  useEffect(() => {
    if (!currentSlide || !voiceEnabled || !isPlaying) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      // Pause speech if on checkpoint
      if (currentSlide.interactive_check && !checkPassed) {
        return;
      }

      const utterance = new SpeechSynthesisUtterance(currentSlide.narration_text);
      utterance.rate = 0.95 * playbackSpeed;
      utterance.pitch = 1.05;

      utterance.onerror = (e) => {
        console.warn('Speech synthesis notice:', e);
      };

      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  }, [currentSlideIdx, isPlaying, voiceEnabled, playbackSpeed, checkPassed]);

  const togglePlay = () => {
    if (isPlaying) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      soundFx.playChime();
    }
  };

  const handlePrev = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setCurrentSlideIdx((prev) => Math.max(0, prev - 1));
    soundFx.playChime();
  };

  const handleNext = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (currentSlideIdx < lesson.slides.length - 1) {
      setCurrentSlideIdx((prev) => prev + 1);
      soundFx.playChime();
    }
  };

  const handleCheckAnswer = (option: string) => {
    setSelectedCheckAnswer(option);
    if (!currentSlide?.interactive_check) return;
    const isCorrect = option === currentSlide.interactive_check.correct;
    setCheckPassed(isCorrect);

    if (isCorrect) {
      soundFx.playSuccess();
      playSound('celebrate');
      setShowXpBanner(true);
      confetti({
        particleCount: 60,
        spread: 65,
        origin: { y: 0.7 }
      });

      // Resume playback after celebratory fanfare
      setTimeout(() => {
        setShowXpBanner(false);
        if (currentSlideIdx < lesson.slides.length - 1) {
          setCurrentSlideIdx((prev) => prev + 1);
          soundFx.playChime();
          setIsPlaying(true);
        }
      }, 1800);
    } else {
      playSound('wrong');
    }
  };

  const handleTriggerAiRegenerate = async () => {
    if (!onRegenerateWithAI) return;
    setIsAiModalOpen(false);
    await onRegenerateWithAI(customAiPrompt);
    setCurrentSlideIdx(0);
    setIsPlaying(true);
  };

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Render Topic-Specific Animated Math Whiteboard Simulation (Bright, High-Contrast Classroom Style!)
  const renderTopicVisualSimulation = () => {
    const tid = lesson.topic_id.toLowerCase();
    const slideNum = currentSlide?.slide_id || 1;

    // 1. Fractions Simulation (Fractions addition & Fraction Division)
    if (tid.includes('fraction')) {
      if (tid.includes('division')) {
        return (
          <div className="flex flex-col md:flex-row items-center justify-around gap-6 p-6 rounded-3xl bg-white border-2 border-sky-200 shadow-md">
            <div className="text-center space-y-4 w-full max-w-md">
              <span className="text-xs font-heading font-black text-sky-800 uppercase tracking-wider block bg-sky-50 py-1 px-3 rounded-full border border-sky-200 inline-block">
                The Keep-Change-Flip Reciprocal Rule
              </span>

              <div className="flex items-center justify-center gap-3 text-xl font-black">
                {/* KEEP CARD */}
                <div className="px-5 py-4 rounded-2xl bg-sky-100 border-2 border-sky-300 text-indigo-950 shadow-sm transition-transform hover:scale-105">
                  <span className="text-[11px] text-sky-800 block font-heading font-bold">1. KEEP</span>
                  2/5
                </div>

                {/* CHANGE CARD */}
                <div className={`px-5 py-4 rounded-2xl border-2 transition-all shadow-sm ${
                  keepChangeFlipped ? 'bg-emerald-100 border-emerald-400 text-emerald-950 scale-105' : 'bg-slate-50 border-slate-300 text-slate-700'
                }`}>
                  <span className="text-[11px] text-emerald-800 block font-heading font-bold">2. CHANGE</span>
                  <span className="text-2xl font-black">{keepChangeFlipped ? '×' : '÷'}</span>
                </div>

                {/* FLIP CARD */}
                <div className={`px-5 py-4 rounded-2xl border-2 transition-all shadow-sm ${
                  keepChangeFlipped ? 'bg-amber-100 border-amber-400 text-amber-950 scale-105 rotate-y-180' : 'bg-slate-50 border-slate-300 text-slate-700'
                }`}>
                  <span className="text-[11px] text-amber-800 block font-heading font-bold">3. FLIP (Reciprocal)</span>
                  <span className="text-2xl font-black">{keepChangeFlipped ? '2/1' : '1/2'}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => {
                    setKeepChangeFlipped(!keepChangeFlipped);
                    soundFx.playChime();
                  }}
                  className="btn-chunky-accent py-2.5 px-5 text-xs flex items-center gap-1.5 mx-auto"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{keepChangeFlipped ? 'Reset Cards' : 'Flip Cards (Apply Rule!)'}</span>
                </button>
              </div>

              <div className="text-base font-heading font-black text-indigo-950 bg-amber-50 py-3 px-4 rounded-2xl border border-amber-200 shadow-sm">
                Formula Result: <span className="text-emerald-700 font-extrabold text-xl">2/5 × 2/1 = 4/5</span>
                <p className="text-xs text-slate-600 font-medium mt-1 flex items-start gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Why flip? Dividing by 1/2 asks "how many halves fit in 2/5?". Each whole has 2 halves, so we multiply by 2!</span>
                </p>
              </div>
            </div>
          </div>
        );
      }

      // Grade 5 Fractions Addition / Subtraction Interactive Pizza Model
      const totalSelected = eatenSlices.length > 0 ? (8 - eatenSlices.length) : (pizzaPartA + pizzaPartB);

      return (
        <div className="flex flex-col md:flex-row items-center justify-around gap-6 p-6 rounded-3xl bg-white border-2 border-sky-200 shadow-md">
          {/* Animated SVG Pizza Model with Clickable Slices */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-heading font-black text-amber-800 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Interactive 8-Slice Pizza Model
              </span>
              <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200 inline-flex items-center gap-1">
                <MousePointerClick className="w-3 h-3 text-sky-600" />
                <span>Click any slice to eat or restore</span>
              </span>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-full border-3 border-amber-200 shadow-sm relative">
              <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-md">
                <circle cx="100" cy="100" r="95" fill="#fef3c7" stroke="#b45309" strokeWidth="6" />
                <circle cx="100" cy="100" r="82" fill="#dc2626" />
                <circle cx="100" cy="100" r="76" fill="#fef08a" />
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                  const angle = (i * 45 * Math.PI) / 180;
                  const nextAngle = ((i + 1) * 45 * Math.PI) / 180;
                  const midAngle = (angle + nextAngle) / 2;

                  const isEaten = eatenSlices.includes(i);
                  const isPartA = i < pizzaPartA;
                  const isPartB = i >= pizzaPartA && i < (pizzaPartA + pizzaPartB);

                  // Exploded slice offset if hovered or selected
                  const explodeOffset = (pizzaHoverSlice === i) ? 8 : (isPartA || isPartB) ? 3 : 0;
                  const cxOffset = explodeOffset * Math.cos(midAngle);
                  const cyOffset = explodeOffset * Math.sin(midAngle);

                  const x1 = 100 + cxOffset + 76 * Math.cos(angle);
                  const y1 = 100 + cyOffset + 76 * Math.sin(angle);
                  const x2 = 100 + cxOffset + 76 * Math.cos(nextAngle);
                  const y2 = 100 + cyOffset + 76 * Math.sin(nextAngle);
                  const centerPointX = 100 + cxOffset;
                  const centerPointY = 100 + cyOffset;

                  let fillColor = '#fde047';
                  if (isEaten) {
                    fillColor = '#f1f5f9'; // Eaten/empty plate
                  } else if (isPartA) {
                    fillColor = '#f59e0b'; // Amber Portion A
                  } else if (isPartB) {
                    fillColor = '#10b981'; // Emerald Portion B
                  }

                  return (
                    <g
                      key={i}
                      onClick={() => {
                        soundFx.playChime();
                        setEatenSlices((prev) =>
                          prev.includes(i) ? prev.filter((s) => s !== i) : [...prev, i]
                        );
                      }}
                      onMouseEnter={() => setPizzaHoverSlice(i)}
                      onMouseLeave={() => setPizzaHoverSlice(null)}
                      className="cursor-pointer transition-all duration-150"
                    >
                      <path
                        d={`M ${centerPointX} ${centerPointY} L ${x1} ${y1} A 76 76 0 0 1 ${x2} ${y2} Z`}
                        fill={pizzaHoverSlice === i ? '#38bdf8' : fillColor}
                        opacity={isEaten ? 0.35 : 0.95}
                        stroke={isEaten ? '#94a3b8' : '#78350f'}
                        strokeWidth={isEaten ? 1.5 : 2.5}
                        strokeDasharray={isEaten ? '4 2' : 'none'}
                      />
                      {!isEaten && (
                        <circle
                          cx={centerPointX + 45 * Math.cos(midAngle)}
                          cy={centerPointY + 45 * Math.sin(midAngle)}
                          r="5"
                          fill="#991b1b"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Interactive Slice Portion Controls */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-amber-50 border border-amber-300 text-xs font-heading font-black text-amber-950">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span>Portion A: {pizzaPartA}/8</span>
                <button
                  onClick={() => {
                    soundFx.playChime();
                    setPizzaPartA((p) => Math.max(1, p - 1));
                    setEatenSlices([]);
                  }}
                  className="w-5 h-5 rounded-full bg-white border border-amber-300 text-amber-900 font-bold flex items-center justify-center hover:bg-amber-100"
                >
                  -
                </button>
                <button
                  onClick={() => {
                    soundFx.playChime();
                    setPizzaPartA((p) => Math.min(7 - pizzaPartB, p + 1));
                    setEatenSlices([]);
                  }}
                  className="w-5 h-5 rounded-full bg-white border border-amber-300 text-amber-900 font-bold flex items-center justify-center hover:bg-amber-100"
                >
                  +
                </button>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs font-heading font-black text-emerald-950">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>Portion B: {pizzaPartB}/8</span>
                <button
                  onClick={() => {
                    soundFx.playChime();
                    setPizzaPartB((p) => Math.max(1, p - 1));
                    setEatenSlices([]);
                  }}
                  className="w-5 h-5 rounded-full bg-white border border-emerald-300 text-emerald-900 font-bold flex items-center justify-center hover:bg-emerald-100"
                >
                  -
                </button>
                <button
                  onClick={() => {
                    soundFx.playChime();
                    setPizzaPartB((p) => Math.min(8 - pizzaPartA, p + 1));
                    setEatenSlices([]);
                  }}
                  className="w-5 h-5 rounded-full bg-white border border-emerald-300 text-emerald-900 font-bold flex items-center justify-center hover:bg-emerald-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Fraction Bar Equation & Why Rule */}
          <div className="flex flex-col items-center space-y-4 max-w-sm w-full">
            <span className="text-xs font-heading font-black text-indigo-950 uppercase tracking-wider bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Step-by-Step Fraction Bar
            </span>

            <div className="w-full h-12 bg-slate-100 rounded-2xl p-1 flex border-2 border-sky-300 shadow-inner">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
                const isPartA = idx < pizzaPartA;
                const isPartB = idx >= pizzaPartA && idx < (pizzaPartA + pizzaPartB);
                const isEaten = eatenSlices.includes(idx);

                let color = 'bg-slate-200 text-slate-500 font-bold';
                if (isEaten) {
                  color = 'bg-slate-100 text-slate-400 line-through';
                } else if (isPartA) {
                  color = 'bg-amber-400 text-slate-950 font-black';
                } else if (isPartB) {
                  color = 'bg-emerald-400 text-emerald-950 font-black';
                }

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      soundFx.playChime();
                      setEatenSlices((prev) =>
                        prev.includes(idx) ? prev.filter((s) => s !== idx) : [...prev, idx]
                      );
                    }}
                    className={`flex-1 ${color} border-r-2 last:border-r-0 border-white flex items-center justify-center text-[12px] font-heading transition-all first:rounded-l-xl last:rounded-r-xl cursor-pointer hover:opacity-80`}
                  >
                    1/8
                  </div>
                );
              })}
            </div>

            <div className="bg-sky-50/80 p-4 rounded-2xl border-2 border-sky-200 text-center w-full shadow-sm space-y-2">
              <div className="text-xl font-heading font-black text-indigo-950 tracking-wide flex items-center justify-center gap-2">
                <span className="text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-300 font-black">{pizzaPartA}/8</span>
                <span className="text-slate-500 font-black">+</span>
                <span className="text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-lg border border-emerald-300 font-black">{pizzaPartB}/8</span>
                <span className="text-slate-500 font-black">=</span>
                <span className="text-indigo-950 bg-white px-3.5 py-0.5 rounded-lg border-2 border-sky-400 shadow-sm font-extrabold underline decoration-emerald-500">{pizzaPartA + pizzaPartB}/8</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                Keep the denominator <strong className="text-indigo-950 font-black">8</strong>. Add numerators <strong className="text-indigo-950 font-black">{pizzaPartA} + {pizzaPartB} = {pizzaPartA + pizzaPartB}</strong>!
              </p>

              {/* Intuitive Why Callout Toggle */}
              <button
                onClick={() => setShowDenomWhy(!showDenomWhy)}
                className="text-[11px] font-heading font-black text-blue-700 hover:text-blue-900 underline flex items-center gap-1 mx-auto mt-1"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>{showDenomWhy ? 'Hide Why Rule' : 'Why don’t we add 8 + 8 = 16?'}</span>
              </button>

              {showDenomWhy && (
                <div className="text-left text-xs bg-white p-3 rounded-xl border border-sky-200 text-slate-700 space-y-1 animate-fadeIn">
                  <p className="font-bold text-indigo-950">Think of a pizza party:</p>
                  <p>The whole pizza was divided into <strong className="text-indigo-950">8 equal pieces</strong>. Putting slices together on your plate gives you more slices (5), but does NOT chop each slice into tiny sixteenths!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // 2. Integers Simulation (Sidewalk Number Line & Questie Hop)
    if (tid.includes('integer')) {
      const numbers = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
      return (
        <div className="flex flex-col items-center gap-5 p-6 rounded-3xl bg-white border-2 border-sky-200 shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-xs font-heading font-black text-sky-800 uppercase tracking-wider block bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Interactive Sidewalk Number Line: -3 + 5 = +2
            </span>
            <span className="text-[11px] font-bold text-slate-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-flex items-center gap-1.5">
              <Snowflake className="w-3.5 h-3.5 text-blue-500" />
              <span>Left = Sub-Zero (Loss)</span>
              <span className="text-slate-300">|</span>
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Right = Warm (Gain)</span>
            </span>
          </div>

          <div className="w-full max-w-lg bg-sky-50/60 p-5 rounded-2xl border-2 border-sky-200 space-y-4">
            <div className="relative pt-6 pb-2">
              <div className="h-3 w-full bg-slate-300 rounded-full relative">
                {/* Zero center indicator */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-blue-600 ring-4 ring-sky-200 shadow-md flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>

              {/* Number line ticks */}
              <div className="flex justify-between items-center mt-2 px-1">
                {numbers.map((n) => {
                  const isCurrent = n === integerStep;
                  const isStart = n === -3;
                  return (
                    <div
                      key={n}
                      onClick={() => {
                        soundFx.playChime();
                        setIntegerStep(n);
                      }}
                      className="cursor-pointer flex flex-col items-center group"
                    >
                      <div className={`w-1 rounded-full mb-1 transition-all ${isCurrent ? 'bg-amber-500 h-6 w-1.5' : n === 0 ? 'bg-blue-600 h-4' : 'bg-slate-400 h-3'}`} />
                      <span className={`text-[12px] font-heading font-black transition-all ${
                        isCurrent
                          ? 'text-amber-800 scale-125 font-black bg-amber-100 px-1 rounded-md'
                          : isStart
                          ? 'text-rose-700 font-black'
                          : n < 0
                          ? 'text-blue-800'
                          : n > 0
                          ? 'text-emerald-800'
                          : 'text-indigo-950'
                      }`}>
                        {n > 0 ? `+${n}` : n}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Jump Demonstration Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  soundFx.playChime();
                  setIntegerStep((s) => Math.max(-5, s - 1));
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-heading font-black hover:bg-blue-100 transition-colors"
              >
                ← Step -1 (West)
              </button>
              <button
                onClick={() => {
                  soundFx.playChime();
                  setIntegerStep(-3);
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-100 border border-rose-300 text-rose-900 text-xs font-heading font-black hover:bg-rose-200 transition-colors"
              >
                Start at -3
              </button>
              <button
                onClick={() => {
                  soundFx.playSuccess();
                  setIntegerStep(2);
                }}
                className="btn-chunky-accent py-1.5 px-3.5 text-xs flex items-center gap-1"
              >
                <span>Jump +5 to +2!</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  soundFx.playChime();
                  setIntegerStep((s) => Math.min(5, s + 1));
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-heading font-black hover:bg-emerald-100 transition-colors"
              >
                Step +1 (East) →
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-50 border-2 border-sky-200 text-center max-w-sm shadow-sm">
            <span className="text-xs text-slate-600 font-heading font-bold block">Current Position on Number Line:</span>
            <span className="text-3xl font-heading font-black text-indigo-950 mt-0.5 block">{integerStep > 0 ? `+${integerStep}` : integerStep}</span>
            <p className="text-xs text-slate-700 mt-1 font-medium">
              {integerStep === 2 ? (
                <span className="text-emerald-800 font-bold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Started at -3 and walked 5 steps right to land on positive 2!</span>
                </span>
              ) : (
                `Interactive: Click points or step buttons to explore sub-zero and positive numbers!`
              )}
            </p>
          </div>
        </div>
      );
    }

    // 3. Algebra Simulation (Equation Seesaw Balance Scale)
    if (tid.includes('algebra')) {
      return (
        <div className="flex flex-col items-center gap-5 p-6 rounded-3xl bg-white border-2 border-sky-200 shadow-md">
          <span className="text-xs font-heading font-black text-sky-800 uppercase tracking-wider block bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
            The Golden Rule of Algebra: Balanced Seesaw
          </span>

          <div className="w-full max-w-md flex flex-col items-center">
            {/* Tilting Seesaw Beam */}
            <div
              style={{ transform: `rotate(${algebraTilt}deg)` }}
              className="flex items-center justify-between w-full px-4 mb-2 transition-transform duration-300"
            >
              {/* Left Pan */}
              <div className="flex flex-col items-center bg-sky-50 border-2 border-sky-300 p-3.5 rounded-2xl shadow-sm min-w-[130px]">
                <span className="text-[11px] text-sky-900 font-heading font-bold block mb-1">Left Pan</span>
                <div className="flex items-center gap-2">
                  <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-heading font-black text-sm flex items-center justify-center shadow-md">
                    x
                  </span>
                  {!algebraBalanced && (
                    <>
                      <span className="text-slate-500 font-black">+</span>
                      <span className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-heading font-black text-sm flex items-center justify-center shadow-md">
                        4
                      </span>
                    </>
                  )}
                </div>
              </div>

              <span className="text-3xl font-heading font-black text-indigo-950">=</span>

              {/* Right Pan */}
              <div className="flex flex-col items-center bg-emerald-50 border-2 border-emerald-300 p-3.5 rounded-2xl shadow-sm min-w-[130px]">
                <span className="text-[11px] text-emerald-900 font-heading font-bold block mb-1">Right Pan</span>
                <div className="flex items-center gap-2">
                  <span className="w-11 h-9 rounded-xl bg-emerald-600 text-white font-heading font-black text-sm flex items-center justify-center shadow-md">
                    {algebraBalanced ? '6' : '10'}
                  </span>
                </div>
              </div>
            </div>

            {/* Fulcrum base */}
            <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-blue-600 mt-1" />
          </div>

          {/* Interactive Balance Demonstration Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => {
                setAlgebraBalanced(true);
                setAlgebraTilt(0);
                soundFx.playSuccess();
                playSound('celebrate');
                confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
              }}
              className="btn-chunky-accent py-2 px-4 text-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-800" />
              <span>Subtract 4 from BOTH sides!</span>
            </button>

            <button
              onClick={() => {
                setAlgebraBalanced(false);
                setAlgebraTilt(-14);
                playSound('wrong');
              }}
              className="px-3.5 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-900 border-2 border-rose-200 text-xs font-heading font-black transition-colors flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Subtract from Left ONLY</span>
            </button>

            <button
              onClick={() => {
                setAlgebraBalanced(false);
                setAlgebraTilt(0);
                soundFx.playChime();
              }}
              className="btn-chunky-white py-2 px-3.5 text-xs font-bold"
            >
              <span>Reset (x + 4 = 10)</span>
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-50 border-2 border-sky-200 text-center text-xs text-indigo-950 max-w-sm">
            {algebraTilt !== 0 ? (
              <span className="font-heading font-bold text-rose-700 text-sm flex items-center justify-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>The seesaw tilted! You removed 4 from the left, but NOT the right! In an equation, both sides must remain equal!</span>
              </span>
            ) : algebraBalanced ? (
              <span className="font-heading font-bold text-emerald-800 text-sm flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Balanced! Both sides had 4 subtracted, isolating <span className="font-black text-blue-900 underline">x = 6</span>!</span>
              </span>
            ) : (
              <span className="font-medium text-slate-700">The Golden Rule: Whatever operation you do to one side of the scale, you MUST do to the other side!</span>
            )}
          </div>
        </div>
      );
    }

    // 4. Decimals Simulation (Tenths / Hundredths Grid & Vertical Alignment)
    if (tid.includes('decimal')) {
      return (
        <div className="flex flex-col md:flex-row items-center justify-around gap-6 p-6 rounded-3xl bg-white border-2 border-sky-200 shadow-md">
          {/* Visual Place Value Stack */}
          <div className="bg-sky-50 p-4 rounded-2xl border-2 border-sky-200 space-y-2 text-center font-mono">
            <span className="text-xs font-heading font-black text-indigo-950 block tracking-wider uppercase font-sans">
              Vertical Decimal Alignment
            </span>
            <div className="text-2xl font-bold tracking-widest text-slate-800">
              <div className="text-amber-800">&nbsp;&nbsp;4<span className="text-rose-600 font-black">.</span>7 5</div>
              <div className="text-emerald-800">+ 1<span className="text-rose-600 font-black">.</span>2 5</div>
              <div className="border-t-2 border-slate-400 my-1"></div>
              <div className="text-indigo-950 font-black">&nbsp;&nbsp;6<span className="text-rose-600 font-black">.</span>0 0</div>
            </div>
            <span className="text-xs text-slate-600 block font-sans font-medium">
              Notice the red decimal points lined up vertically like buttons!
            </span>
          </div>

          {/* 10x10 Base Ten Visualizer */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-heading font-black text-amber-800 uppercase tracking-wider mb-2 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Hundredths Grid Model (0.75 + 0.25 = 1.00)
            </span>
            <div className="grid grid-cols-10 gap-0.5 p-2 bg-slate-100 rounded-2xl border-2 border-slate-300 w-48 h-48 shadow-inner">
              {Array.from({ length: 100 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-full h-full rounded-[1px] transition-colors ${
                    i < 75 ? 'bg-emerald-500' : 'bg-amber-400'
                  }`}
                  title={`Square ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-3 text-xs font-bold mt-2">
              <span className="text-emerald-800 font-heading">75 hundredths (0.75)</span>
              <span className="text-amber-800 font-heading">25 hundredths (0.25)</span>
            </div>
          </div>
        </div>
      );
    }

    // 5. Ratios Simulation (Scale Multiplier)
    if (tid.includes('ratio')) {
      return (
        <div className="flex flex-col md:flex-row items-center justify-around gap-6 p-6 rounded-3xl bg-white border-2 border-sky-200 shadow-md">
          <div className="space-y-4 text-center w-full">
            <span className="text-xs font-heading font-black text-sky-800 uppercase tracking-wider block bg-sky-50 px-3 py-1 rounded-full border border-sky-200 inline-block">
              Scale Multiplier Interactive Explorer
            </span>
            <div className="flex items-center justify-center gap-3">
              {[1, 2, 3, 4].map((mult) => (
                <button
                  key={mult}
                  onClick={() => setRatioMultiplier(mult)}
                  className={`px-3.5 py-1.5 rounded-xl font-heading font-black text-xs transition-all ${
                    ratioMultiplier === mult
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-sky-50 text-indigo-950 border border-sky-200 hover:bg-sky-100'
                  }`}
                >
                  ×{mult} Scale
                </button>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-200 text-indigo-950 font-bold text-base flex items-center justify-center gap-6 shadow-sm">
              <div className="text-center">
                <div className="w-9 h-9 rounded-xl bg-rose-600 text-white font-heading font-black text-xs flex items-center justify-center mx-auto mb-1 shadow-md">
                  A
                </div>
                <span className="text-amber-900 text-sm font-heading font-black">{2 * ratioMultiplier} Red Units</span>
              </div>
              <span className="text-2xl text-blue-700 font-black">:</span>
              <div className="text-center">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-heading font-black text-xs flex items-center justify-center mx-auto mb-1 shadow-md">
                  B
                </div>
                <span className="text-emerald-900 text-sm font-heading font-black">{3 * ratioMultiplier} Green Units</span>
              </div>
            </div>
            <span className="text-xs text-slate-600 font-medium block">
              Equivalent Ratio: <strong className="text-indigo-950 font-black">2:3 = {2 * ratioMultiplier}:{3 * ratioMultiplier}</strong>
            </span>
          </div>
        </div>
      );
    }

    // 6. Geometry & Lines/Angles Simulation
    if (tid.includes('geometry') || tid.includes('angle') || tid.includes('line')) {
      if (tid.includes('angle') || tid.includes('lines')) {
        return (
          <div className="flex flex-col md:flex-row items-center justify-around gap-6 p-6 rounded-3xl bg-white border-2 border-sky-200 shadow-md">
            <div className="flex flex-col items-center">
              <span className="text-xs font-heading font-black text-cyan-800 uppercase tracking-wider mb-2 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
                Angle Classifier ({angleDegrees}°)
              </span>
              <svg viewBox="0 0 160 120" className="w-48 h-36 bg-sky-50 rounded-2xl p-2 border border-sky-200">
                <line x1="20" y1="100" x2="140" y2="100" stroke="#64748b" strokeWidth="4" />
                <line
                  x1="80"
                  y1="100"
                  x2={80 + 55 * Math.cos(((180 - angleDegrees) * Math.PI) / 180)}
                  y2={100 - 55 * Math.sin(((180 - angleDegrees) * Math.PI) / 180)}
                  stroke="#0284c7"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <circle cx="80" cy="100" r="6" fill="#f59e0b" />
              </svg>
              <div className="flex items-center gap-2 mt-3">
                {[45, 90, 120, 180].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => setAngleDegrees(deg)}
                    className={`px-3 py-1 rounded-xl text-xs font-heading font-black transition-all ${
                      angleDegrees === deg ? 'bg-cyan-700 text-white shadow-md' : 'bg-sky-50 text-indigo-950 border border-sky-200'
                    }`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-200 text-center space-y-1 max-w-xs shadow-sm">
              <span className="text-xs text-sky-800 font-heading font-bold uppercase">Classification</span>
              <div className="text-xl font-heading font-black text-indigo-950">
                {angleDegrees < 90 ? 'Acute Angle (< 90°)' : angleDegrees === 90 ? 'Right Angle (90°)' : angleDegrees === 180 ? 'Straight Line (180°)' : 'Obtuse Angle (> 90°)'}
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {angleDegrees === 90 ? 'Forms a crisp square corner like a window frame!' : angleDegrees < 90 ? 'Sharp angle smaller than a square corner.' : 'Wider angle opening greater than a right angle.'}
              </p>
            </div>
          </div>
        );
      }

      // Perimeter Walker Simulation
      return (
        <div className="flex flex-col md:flex-row items-center justify-around gap-6 p-6 rounded-3xl bg-white border-2 border-sky-200 shadow-md">
          <div className="flex flex-col items-center">
            <span className="text-xs font-heading font-black text-cyan-800 uppercase tracking-wider mb-2 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
              Perimeter = Boundary Distance
            </span>
            <div className="p-3 bg-sky-50 rounded-2xl border-2 border-sky-200">
              <svg viewBox="0 0 200 140" className="w-52 h-36">
                <rect x="20" y="20" width="160" height="90" fill="none" stroke="#0284c7" strokeWidth="4" rx="4" />
                <text x="100" y="15" fill="#0f172a" fontSize="12" fontWeight="bold" textAnchor="middle">Length = 8 cm</text>
                <text x="100" y="125" fill="#0f172a" fontSize="12" fontWeight="bold" textAnchor="middle">Length = 8 cm</text>
                <text x="10" y="70" fill="#047857" fontSize="12" fontWeight="bold" textAnchor="middle">4 cm</text>
                <text x="190" y="70" fill="#047857" fontSize="12" fontWeight="bold" textAnchor="middle">4 cm</text>
              </svg>
            </div>
          </div>
          <div className="bg-sky-50 p-4 rounded-2xl border-2 border-sky-200 text-center space-y-2 max-w-xs shadow-sm">
            <span className="text-xs font-heading font-bold text-sky-800 uppercase tracking-wider block">
              Formula Breakdown
            </span>
            <div className="text-xl font-heading font-black text-indigo-950">
              P = 8 + 4 + 8 + 4 = <span className="text-emerald-700 underline font-black">24 cm</span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Sum of all 4 sides around the boundary fence!
            </p>
          </div>
        </div>
      );
    }

    // 7. Place Value Simulation (Indian vs International Switcher)
    if (tid.includes('place')) {
      return (
        <div className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-white border-2 border-sky-200 shadow-md">
          <span className="text-xs font-heading font-black text-amber-800 uppercase tracking-wider block bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Global Comma Grouping Explorer
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPlaceValueSystem('indian')}
              className={`px-3.5 py-1.5 rounded-xl font-heading font-bold text-xs transition-all ${
                placeValueSystem === 'indian' ? 'bg-amber-400 text-slate-950 font-black shadow-sm' : 'bg-sky-50 text-indigo-950 border border-sky-200'
              }`}
            >
              Indian System (Lakhs &amp; Crores)
            </button>
            <button
              onClick={() => setPlaceValueSystem('international')}
              className={`px-3.5 py-1.5 rounded-xl font-heading font-bold text-xs transition-all ${
                placeValueSystem === 'international' ? 'bg-emerald-600 text-white font-black shadow-sm' : 'bg-sky-50 text-indigo-950 border border-sky-200'
              }`}
            >
              International System (Millions)
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-sky-50 border-2 border-sky-200 text-center space-y-1 shadow-sm">
            <div className="text-3xl font-heading font-black text-indigo-950 tracking-wider">
              {placeValueSystem === 'indian' ? '25,40,000' : '2,540,000'}
            </div>
            <div className="text-xs font-medium text-slate-600">
              {placeValueSystem === 'indian'
                ? 'Read as: 25 Lakhs, 40 Thousand (Commas: 3 digits, then 2 by 2)'
                : 'Read as: 2 Million 540 Thousand (Commas: every 3 digits)'}
            </div>
          </div>
        </div>
      );
    }

    // 8. Data Handling & Statistics Simulation
    if (tid.includes('data') || tid.includes('stat')) {
      return (
        <div className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-white border-2 border-sky-200 shadow-md">
          <span className="text-xs font-heading font-black text-teal-800 uppercase tracking-wider block bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Smart Bar Chart &amp; Central Mean Line
          </span>
          <div className="flex items-end justify-center gap-6 h-40 w-72 bg-sky-50 p-4 rounded-2xl border-2 border-sky-200 relative shadow-inner">
            <div className="absolute left-0 right-0 top-1/2 border-t-2 border-dashed border-rose-500">
              <span className="absolute right-2 -top-4 text-[11px] text-rose-700 font-bold bg-white px-1.5 py-0.5 rounded border border-rose-200">Mean = 6</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-9 h-16 bg-blue-500 rounded-t-xl transition-all shadow-sm" />
              <span className="text-[11px] text-slate-700 font-heading font-bold">4</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-9 h-24 bg-emerald-500 rounded-t-xl transition-all shadow-sm" />
              <span className="text-[11px] text-slate-700 font-heading font-bold">6</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-9 h-32 bg-amber-500 rounded-t-xl transition-all shadow-sm" />
              <span className="text-[11px] text-slate-700 font-heading font-bold">8</span>
            </div>
          </div>
          <span className="text-xs text-slate-700 font-medium text-center">
            Mean = (4 + 6 + 8) ÷ 3 = <strong className="font-heading font-black text-indigo-950 text-sm">6 (Fair Share Average)</strong>
          </span>
        </div>
      );
    }

    // Default concept board
    return (
      <div className="p-8 rounded-3xl bg-white border-2 border-sky-200 text-center space-y-3 shadow-md">
        <Sparkles className="w-8 h-8 text-amber-500 mx-auto animate-bounce" />
        <p className="text-base text-slate-800 font-heading font-bold leading-relaxed max-w-lg mx-auto">
          {currentSlide?.visual_concept}
        </p>
      </div>
    );
  };

  if (!currentSlide) return null;

  return (
    <div className="relative rounded-3xl bg-white/95 backdrop-blur-md text-slate-900 shadow-xl border-4 border-sky-300 flex flex-col justify-between p-4 sm:p-6 md:p-8 space-y-6">

      {/* Top Header: Tutor Avatar, Lesson Info & Media Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-sky-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center shadow-md border-2 border-sky-200 overflow-hidden">
              <QuestieMascot mood={isPlaying ? 'wave' : 'idle'} size={40} />
            </div>
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-heading font-black text-indigo-950 block">
                Questie's Whiteboard Studio
              </span>
              {lesson.source === 'gemini-ai' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-950 border border-sky-300 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-sky-700" />
                  Gemini AI
                </span>
              )}
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              Slide {currentSlideIdx + 1} of {lesson.total_slides}: {currentSlide.title}
            </span>
          </div>
        </div>

        {/* Speed, Audio & AI Options */}
        <div className="flex items-center gap-2">
          {onRegenerateWithAI && (
            <button
              onClick={() => setIsAiModalOpen(true)}
              disabled={isRegenerating}
              aria-label="Generate custom AI video lesson with Gemini"
              className="btn-chunky-accent py-1.5 px-3.5 text-xs flex items-center gap-1.5"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-900" />
              <span>{isRegenerating ? 'Generating...' : 'AI Remix'}</span>
            </button>
          )}

          {/* Speed Toggle */}
          <div className="flex items-center bg-sky-50 border border-sky-200 rounded-xl p-1 text-xs font-heading font-black">
            {[0.75, 1.0, 1.25].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                aria-label={`Playback speed ${spd}x`}
                className={`px-2.5 py-0.5 rounded-lg transition-colors ${
                  playbackSpeed === spd ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-indigo-950'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            aria-label={voiceEnabled ? 'Mute voice narration' : 'Enable voice narration'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-slate-800 border border-sky-200 transition-colors text-xs font-heading font-bold"
          >
            {voiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline">{voiceEnabled ? 'Voice On' : 'Muted'}</span>
          </button>
        </div>
      </div>

      {/* Main Slide Title & Concept Pill */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-heading font-black text-indigo-950 tracking-tight">
          {currentSlide.title}
        </h2>
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 text-amber-950 border-2 border-amber-300 font-heading font-bold text-xs sm:text-sm shadow-sm">
          <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>{currentSlide.key_takeaway}</span>
        </div>
      </div>

      {/* Interactive Whiteboard Canvas Area with Non-blocking Floating Play Badge */}
      <div className="w-full relative group bg-gradient-to-b from-sky-50/60 to-white rounded-3xl border-3 border-sky-200 p-4 sm:p-6 shadow-inner">
        {renderTopicVisualSimulation()}

        {/* Floating Play Action Button in top right */}
        {!isPlaying && (
          <div className="absolute top-3 right-3 z-10 pointer-events-auto">
            <button
              onClick={togglePlay}
              aria-label="Play whiteboard audio lesson"
              className="btn-chunky-accent py-1.5 px-3.5 text-xs flex items-center gap-1.5 shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Play Lesson</span>
            </button>
          </div>
        )}
      </div>

      {/* In-Video Interactive Checkpoint (Slide 4/5) */}
      {currentSlide.interactive_check && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-3 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600 animate-spin" />
              <span className="text-xs font-heading font-black uppercase tracking-wider text-amber-900">
                Interactive Checkpoint (+15 XP)
              </span>
            </div>
            {checkPassed === null && (
              <span className="text-[11px] font-heading font-bold text-amber-950 bg-amber-200/70 px-2.5 py-0.5 rounded-full border border-amber-300">
                Solve to Continue
              </span>
            )}
          </div>

          <p className="text-base sm:text-lg font-heading font-black text-indigo-950">
            {currentSlide.interactive_check.question}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {currentSlide.interactive_check.options.map((opt) => {
              const isSelected = selectedCheckAnswer === opt;
              const isCorrect = opt === currentSlide.interactive_check?.correct;
              let btnClass = 'bg-white hover:bg-sky-50 text-indigo-950 border-2 border-sky-200 shadow-sm';
              if (isSelected) {
                btnClass = isCorrect
                  ? 'bg-emerald-600 text-white border-2 border-emerald-700 shadow-md ring-2 ring-emerald-300'
                  : 'bg-rose-600 text-white border-2 border-rose-700 shadow-md';
              }
              return (
                <button
                  key={opt}
                  onClick={() => handleCheckAnswer(opt)}
                  className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-heading font-black transition-all transform active:scale-95 flex items-center justify-center gap-1.5 ${btnClass}`}
                >
                  {isSelected && isCorrect && <Check className="w-4 h-4 text-white" />}
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {showXpBanner && (
            <div className="flex items-center justify-center gap-2 text-sm font-heading font-black text-amber-950 bg-amber-200 p-3 rounded-2xl border-2 border-amber-400 animate-bounce shadow-sm">
              <Award className="w-5 h-5 text-amber-700" />
              <span>+15 Quest XP Unlocked! Great Job!</span>
            </div>
          )}

          {checkPassed === true && !showXpBanner && (
            <div className="flex items-center gap-2 text-xs font-heading font-bold text-emerald-900 bg-emerald-100 p-2.5 rounded-2xl border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Brilliant! Exactly right! Advancing to the next step...</span>
            </div>
          )}

          {checkPassed === false && (
            <div className="text-xs font-semibold text-rose-900 bg-rose-100 p-2.5 rounded-2xl border border-rose-300">
              Almost! Review the visual diagram above and try again.
            </div>
          )}
        </div>
      )}

      {/* Subtitle & Narration Speech Bubble */}
      <div className="bg-sky-50/90 border-2 border-sky-200 rounded-2xl p-4 shadow-sm flex items-start gap-3">
        <QuestieMascot mood={isPlaying ? 'wave' : 'idle'} size={38} className="flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          {isPlaying && voiceEnabled && (
            <div className="flex items-center gap-1 h-3 mb-1">
              <span className="w-1 bg-amber-500 h-full animate-bounce rounded-full"></span>
              <span className="w-1 bg-blue-500 h-2/3 animate-pulse rounded-full"></span>
              <span className="w-1 bg-emerald-500 h-full animate-bounce rounded-full"></span>
              <span className="w-1 bg-rose-400 h-1/2 animate-pulse rounded-full"></span>
              <span className="w-1 bg-amber-500 h-3/4 animate-bounce rounded-full"></span>
            </div>
          )}
          <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
            "{currentSlide.narration_text}"
          </p>

          {/* Fun Story Mode Toggle */}
          <div className="pt-2">
            <button
              onClick={() => {
                soundFx.playChime();
                setShowStoryMode(!showStoryMode);
              }}
              className="text-xs font-heading font-black px-3 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
              <span>{showStoryMode ? 'Hide Story Analogy' : 'Explain with Fun Story!'}</span>
            </button>

            {showStoryMode && (
              <div className="mt-2 p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-300 text-slate-800 space-y-2 animate-fadeIn shadow-xs">
                <div className="flex items-center gap-2 font-heading font-black text-sm text-amber-950">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Questie's Story Analogy: {TOPIC_STORIES[lesson.topic_id]?.title || 'Everyday Math Adventure'}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {TOPIC_STORIES[lesson.topic_id]?.story || currentSlide.visual_concept}
                </p>
                <div className="text-xs font-heading font-black text-emerald-900 bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-300">
                  {TOPIC_STORIES[lesson.topic_id]?.moral || currentSlide.key_takeaway}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Progress Bar & Navigation Controls */}
      <div className="space-y-3 pt-2 border-t-2 border-sky-100">

        {/* Slide Progress Scrubber Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono font-bold">
            <span>Slide {currentSlideIdx + 1} of {lesson.total_slides}</span>
            <div className="flex items-center gap-1.5 text-indigo-950">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{formatTime(elapsedSeconds)} / {formatTime(slideDurationSec)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            {lesson.slides.map((s, idx) => {
              const isCurrent = idx === currentSlideIdx;
              const isPast = idx < currentSlideIdx;
              return (
                <div
                  key={s.slide_id}
                  onClick={() => {
                    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                    setCurrentSlideIdx(idx);
                    soundFx.playChime();
                  }}
                  className="h-2.5 flex-1 bg-slate-200 rounded-full overflow-hidden cursor-pointer relative shadow-inner"
                  title={`Slide ${idx + 1}: ${s.title}`}
                >
                  {isPast && <div className="h-full w-full bg-emerald-500" />}
                  {isCurrent && (
                    <div
                      className="h-full bg-amber-400 transition-all duration-100 ease-linear rounded-full"
                      style={{ width: `${slideProgress}%` }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Video Control Buttons Deck */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={handlePrev}
            disabled={currentSlideIdx === 0}
            aria-label="Previous slide"
            className="btn-chunky-white p-3 disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-5 h-5 text-indigo-950" />
          </button>

          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause video narration' : 'Play video narration'}
            className="btn-chunky-accent py-3 px-8 text-sm sm:text-base font-heading font-black flex items-center gap-2"
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 fill-slate-950" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                <span>{slideProgress > 0 ? 'Resume' : 'Play Narration'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={currentSlideIdx === lesson.slides.length - 1}
            aria-label="Next slide"
            className="btn-chunky-white p-3 disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight className="w-5 h-5 text-indigo-950" />
          </button>
        </div>
      </div>

      {/* Completion Banner */}
      {currentSlideIdx === lesson.slides.length - 1 && onJumpToPractice && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 border-3 border-emerald-300 text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <Award className="w-6 h-6 text-emerald-700" />
            <span className="text-sm sm:text-base font-heading font-black text-emerald-950">
              Whiteboard Video Complete! Ready to earn badges in Adaptive Practice?
            </span>
          </div>
          <button
            onClick={onJumpToPractice}
            className="btn-chunky-primary py-2.5 px-5 text-xs font-black flex items-center gap-1.5 flex-shrink-0"
          >
            <span>Start Practice Quest</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* AI Custom Video Remix Modal (Clean Sunny Look) */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-3 border-sky-300 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl text-slate-900">
            <div className="flex items-center gap-2 text-indigo-950">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <h3 className="text-xl font-heading font-black">Generate AI Video Lesson</h3>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Use Gemini AI to generate a brand new customized slide video explanation for <strong className="text-indigo-950 font-black">{lesson.title}</strong>!
            </p>

            <div className="space-y-2">
              <label className="text-xs font-heading font-black text-indigo-950">Special Teaching Angle (Optional):</label>
              <textarea
                value={customAiPrompt}
                onChange={(e) => setCustomAiPrompt(e.target.value)}
                placeholder="e.g. Explain like a space adventure, or give 3 pizza analogies..."
                className="w-full h-24 p-3 rounded-2xl bg-sky-50 border-2 border-sky-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 resize-none font-medium"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="btn-chunky-white py-2 px-4 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleTriggerAiRegenerate}
                disabled={isRegenerating}
                className="btn-chunky-accent py-2 px-5 text-xs flex items-center gap-1.5"
              >
                <Wand2 className="w-4 h-4 text-amber-900" />
                <span>{isRegenerating ? 'Generating...' : 'Generate with Gemini'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
