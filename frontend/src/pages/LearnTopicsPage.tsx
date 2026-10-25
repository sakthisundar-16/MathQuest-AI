import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, CheckCircle, ArrowRight, Sparkles,
  PieChart, Coins, Shapes, Scale, Divide, Box, Hash, Layers, Ruler, BarChart3,
  HelpCircle, Star, Compass, Castle, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { Topic } from '../types';
import { useGrade } from '../context/GradeContext';
import { useSound } from '../context/SoundContext';
import { SuspenseLoader } from '../components/SuspenseLoader';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  PieChart,
  Coins,
  Shapes,
  Scale,
  Divide,
  Box,
  Hash,
  Layers,
  Ruler,
  BarChart3
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Fractions: { bg: 'bg-amber-100', text: 'text-amber-950', border: 'border-amber-300' },
  Decimals: { bg: 'bg-emerald-100', text: 'text-emerald-950', border: 'border-emerald-300' },
  Geometry: { bg: 'bg-purple-100', text: 'text-purple-950', border: 'border-purple-300' },
  Ratios: { bg: 'bg-blue-100', text: 'text-blue-950', border: 'border-blue-300' },
  Integers: { bg: 'bg-cyan-100', text: 'text-cyan-950', border: 'border-cyan-300' },
  Algebra: { bg: 'bg-rose-100', text: 'text-rose-950', border: 'border-rose-300' },
  Default: { bg: 'bg-sky-100', text: 'text-sky-950', border: 'border-sky-300' }
};

export const LearnTopicsPage: React.FC = () => {
  const { grade, setGrade } = useGrade();
  const { playSound } = useSound();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedStandards, setExpandedStandards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadTopics(grade);
  }, [grade]);

  const loadTopics = async (g: number) => {
    setLoading(true);
    try {
      const data = await api.getTopics(g);
      setTopics(data);
    } catch (e) {
      console.error('Error fetching topics', e);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = (newGrade: number) => {
    if (newGrade === grade) return;
    playSound('whoosh');
    setGrade(newGrade);
    setSelectedCategory('All');
  };

  const toggleStandards = (topicId: string) => {
    playSound('click');
    setExpandedStandards((prev) => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(topics.map((t) => t.category || 'General')))];
  }, [topics]);

  const filteredTopics = useMemo(() => {
    return selectedCategory === 'All' ? topics : topics.filter((t) => t.category === selectedCategory);
  }, [topics, selectedCategory]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 select-none">
      
      {/* ─── PAGE HEADER & TACTILE GRADE SWITCHER ─── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border-3 border-sky-200 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-100 text-sky-950 text-[16px] font-heading font-black border-2 border-sky-200">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Curriculum Quest Catalogue</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-indigo-950 tracking-tight">
            Grade {grade} Math Topics
          </h1>
          <p className="text-[17px] font-body font-bold text-slate-600">
            Pick a topic to start lessons, watch animated whiteboard videos, and play quests!
          </p>
        </div>

        {/* 3D Tactile Grade Toggle */}
        <div className="flex items-center p-1.5 rounded-2xl bg-sky-50 border-2 border-sky-200 self-start sm:self-auto shadow-inner">
          <button
            type="button"
            onClick={() => handleGradeChange(5)}
            className={`px-4 py-2.5 rounded-xl text-[16px] font-heading font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              grade === 5
                ? 'bg-[#FFD23F] text-[#1E1B4B] shadow-sm border-b-3 border-[#C49405]'
                : 'text-sky-800 hover:text-sky-950'
            }`}
          >
            <Castle className="w-4 h-4 text-amber-800" />
            <span>Grade 5</span>
          </button>
          <button
            type="button"
            onClick={() => handleGradeChange(6)}
            className={`px-4 py-2.5 rounded-xl text-[16px] font-heading font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              grade === 6
                ? 'bg-[#FFD23F] text-[#1E1B4B] shadow-sm border-b-3 border-[#C49405]'
                : 'text-sky-800 hover:text-sky-950'
            }`}
          >
            <Zap className="w-4 h-4 text-indigo-800" />
            <span>Grade 6</span>
          </button>
        </div>
      </div>

      {/* ─── CATEGORY FILTER PILLS ─── */}
      {!loading && categories.length > 2 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  playSound('click');
                  setSelectedCategory(cat);
                }}
                className={`px-4 py-2.5 rounded-2xl text-[16px] font-heading font-black whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-800 text-white shadow-md border-b-4 border-purple-950'
                    : 'bg-white text-slate-800 border-2 border-sky-200 border-b-4 border-slate-300 hover:bg-sky-50'
                }`}
              >
                <span className={isSelected ? 'text-white' : 'text-slate-800'}>{cat}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ─── LOADING STATE ─── */}
      {loading && (
        <SuspenseLoader message="Fetching exciting math topics..." minHeight="min-h-[45vh]" />
      )}

      {/* ─── TOPICS CLOUD-WHITE GRID ─── */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {filteredTopics.map((t) => {
            const IconComponent = ICON_MAP[t.icon] || BookOpen;
            const catColors = CATEGORY_COLORS[t.category] || CATEGORY_COLORS.Default;
            const isExpanded = !!expandedStandards[t.topic_id];

            return (
              <motion.div
                key={t.topic_id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-3xl border-3 border-sky-200 hover:border-amber-400 p-7 flex flex-col justify-between shadow-md hover:shadow-xl transition-all"
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-800 border-2 border-amber-200 flex items-center justify-center shadow-xs">
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <span className={`text-[16px] font-heading font-black px-3.5 py-1 rounded-xl ${catColors.bg} ${catColors.text} border-2 ${catColors.border}`}>
                      {t.category || `Grade ${t.grade}`}
                    </span>
                  </div>

                  {/* Title & 1-line description */}
                  <div>
                    <h2 className="text-2xl font-heading font-black text-indigo-950 mb-1.5">
                      {t.title}
                    </h2>
                    <p className="text-[17px] font-body font-bold text-slate-600 leading-relaxed">
                      {t.description}
                    </p>
                  </div>

                  {/* Collapsible Teacher & Standards Drawer */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => toggleStandards(t.topic_id)}
                      className="inline-flex items-center gap-1.5 text-[16px] font-heading font-bold text-sky-800 hover:text-sky-950 cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4 text-sky-600" />
                      <span>{isExpanded ? 'Hide Teacher Benchmarks' : 'For Teachers (GSE Benchmarks)'}</span>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mt-2 p-3.5 rounded-2xl bg-sky-50 border-2 border-sky-200 text-slate-700 text-[16px] space-y-1.5"
                        >
                          <span className="font-extrabold text-indigo-950 block">{t.curriculum_reference}</span>
                          <ul className="space-y-1">
                            {t.learning_objectives.map((obj, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <span>{obj}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Difficulty Tier Chips (1, 2, 3 Stars) & Play Buttons */}
                <div className="space-y-3 pt-5 mt-4 border-t-2 border-sky-100">
                  <div className="flex items-center justify-between text-[16px] font-heading font-black text-slate-500 uppercase tracking-wide">
                    <span>Practice Level:</span>
                    <span className="text-amber-800 font-bold">+XP Rewards</span>
                  </div>
                  
                  {/* 3 Tier Star Chips */}
                  <div className="grid grid-cols-3 gap-2">
                    <Link
                      to={`/quiz/${t.topic_id}?tier=easy`}
                      onClick={() => playSound('click')}
                      className="py-2.5 px-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-heading font-black text-[16px] text-center border-2 border-emerald-300 shadow-2xs flex flex-col items-center gap-0.5"
                    >
                      <span className="flex text-amber-500">⭐</span>
                      <span>Easy · 10XP</span>
                    </Link>
                    <Link
                      to={`/quiz/${t.topic_id}?tier=medium`}
                      onClick={() => playSound('click')}
                      className="py-2.5 px-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-heading font-black text-[16px] text-center border-2 border-amber-300 shadow-2xs flex flex-col items-center gap-0.5"
                    >
                      <span className="flex text-amber-500">⭐⭐</span>
                      <span>Med · 20XP</span>
                    </Link>
                    <Link
                      to={`/quiz/${t.topic_id}?tier=hard`}
                      onClick={() => playSound('click')}
                      className="py-2.5 px-2 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-950 font-heading font-black text-[16px] text-center border-2 border-purple-300 shadow-2xs flex flex-col items-center gap-0.5"
                    >
                      <span className="flex text-amber-500">⭐⭐⭐</span>
                      <span>Hard · 30XP</span>
                    </Link>
                  </div>

                  {/* Primary Play Quest Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link
                      to={`/lesson/${t.topic_id}`}
                      onClick={() => playSound('click')}
                      className="py-3 px-4 rounded-2xl bg-sky-50 hover:bg-sky-100 text-indigo-950 font-heading font-black text-[16px] text-center border-2 border-sky-200 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <BookOpen className="w-5 h-5 text-sky-700" />
                      <span>Learn Topic</span>
                    </Link>

                    <Link
                      to={`/quiz/${t.topic_id}`}
                      onClick={() => playSound('click')}
                      className="btn-chunky btn-chunky-primary text-white text-[16px] !min-h-[48px] !py-2.5 gap-2"
                    >
                      <span>Play Quest</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default LearnTopicsPage;
