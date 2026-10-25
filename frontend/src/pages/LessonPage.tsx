import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  BookOpen, Sparkles, ArrowRight, PlayCircle, Lightbulb, AlertCircle,
  CheckCircle2, ChevronRight, Volume2, ZoomIn, Eye, Compass, Zap, Flame, Shield, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, getStoredGrade } from '../services/api';
import { useGrade } from '../context/GradeContext';
import { Topic, AIExplanation, InfographicData, VideoLesson } from '../types';
import { InteractiveMathWhiteboard } from '../components/InteractiveMathWhiteboard';
import { AskAITutorDrawer } from '../components/AskAITutorDrawer';
import { QuestieMascot } from '../components/QuestieMascot';
import { useSound } from '../context/SoundContext';

export const LessonPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { grade } = useGrade();
  const { playSound } = useSound();

  const [topic, setTopic] = useState<Topic | null>(null);
  const [explanation, setExplanation] = useState<AIExplanation | null>(null);
  const [infographic, setInfographic] = useState<InfographicData | null>(null);
  const [videoLesson, setVideoLesson] = useState<VideoLesson | null>(null);
  const [activeTab, setActiveTab] = useState<'video' | 'concept'>('video');
  const [loading, setLoading] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [revealedSteps, setRevealedSteps] = useState<number>(1);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState<boolean>(false);
  const [isTutorDrawerOpen, setIsTutorDrawerOpen] = useState<boolean>(false);
  const [isRegeneratingVideo, setIsRegeneratingVideo] = useState<boolean>(false);

  useEffect(() => {
    if (topicId) {
      loadLessonContent(topicId, grade);
    }
  }, [topicId, grade]);

  const loadLessonContent = async (tid: string, g: number) => {
    setLoading(true);
    try {
      const topicData = await api.getTopic(tid);
      setTopic(topicData);

      const [expData, infoData, videoData] = await Promise.all([
        api.getAIExplanation(tid, g),
        api.getInfographic(tid, g),
        api.getVideoLesson(tid, g).catch(() => null)
      ]);
      setExplanation(expData);
      setInfographic(infoData);
      setVideoLesson(videoData);
    } catch (e) {
      console.error('Error loading lesson content', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateVideo = async (customPrompt?: string) => {
    if (!topicId) return;
    setIsRegeneratingVideo(true);
    try {
      const regenerated = await api.generateVideoLesson(topicId, topic?.grade || grade, customPrompt);
      setVideoLesson(regenerated);
      playSound('celebrate');
    } catch (e) {
      console.error('Failed to regenerate video with AI:', e);
    } finally {
      setIsRegeneratingVideo(false);
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 select-none p-4">
        <div className="h-44 bg-white/95 rounded-3xl border-3 border-sky-200 shadow-md flex items-center justify-center p-8">
          <div className="flex items-center gap-4">
            <QuestieMascot mood="thinking" size={90} />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-sky-100 rounded-full animate-pulse" />
              <div className="h-4 w-64 bg-sky-50 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
        <div className="h-72 bg-white/90 rounded-3xl border-3 border-sky-200 animate-pulse" />
      </div>
    );
  }

  if (!topic || !explanation) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4 bg-white/95 rounded-3xl border-3 border-sky-200 shadow-xl p-6">
        <QuestieMascot mood="thinking" size={90} className="mx-auto" />
        <h2 className="text-2xl font-heading font-black text-indigo-950">Lesson Topic Not Found</h2>
        <p className="text-[16px] text-slate-600">The topic you are looking for may have moved or doesn't exist.</p>
        <Link to="/learn" className="btn-chunky-primary inline-flex items-center gap-2">
          <span>Back to Topics</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const exp = explanation.data;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 px-2 sm:px-4">

      {/* ─── BREADCRUMB ROADMAP ─── */}
      <div className="flex items-center gap-2 text-[15px] font-heading font-bold text-slate-600">
        <Link to="/learn" className="hover:text-purple-700 transition-colors">Topics Catalogue</Link>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="text-indigo-950 font-black">{topic.title}</span>
      </div>

      {/* ─── 4-STEP LESSON FLOW NAVIGATION BAR ─── */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border-3 border-sky-200 p-2.5 sm:p-3 shadow-md flex items-center justify-between gap-2 overflow-x-auto">
        <button
          onClick={() => {
            playSound('click');
            setActiveTab('video');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[15px] font-heading font-black transition-all flex-shrink-0 ${
            activeTab === 'video'
              ? 'bg-blue-600 text-white shadow-md border-b-3 border-blue-800'
              : 'bg-sky-50 text-indigo-950 hover:bg-sky-100 border border-sky-200'
          }`}
        >
          <PlayCircle className={`w-4 h-4 ${activeTab === 'video' ? 'text-white' : 'text-indigo-950'}`} />
          <span className={activeTab === 'video' ? 'text-white' : 'text-indigo-950'}>1. Whiteboard Studio</span>
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveTab('concept');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[15px] font-heading font-black transition-all flex-shrink-0 ${
            activeTab === 'concept'
              ? 'bg-blue-600 text-white shadow-md border-b-3 border-blue-800'
              : 'bg-sky-50 text-indigo-950 hover:bg-sky-100 border border-sky-200'
          }`}
        >
          <BookOpen className={`w-4 h-4 ${activeTab === 'concept' ? 'text-white' : 'text-indigo-950'}`} />
          <span className={activeTab === 'concept' ? 'text-white' : 'text-indigo-950'}>2. Concept &amp; Infographic</span>
        </button>

        <button
          onClick={() => {
            playSound('click');
            setIsTutorDrawerOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[15px] font-heading font-black text-amber-950 bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 transition-colors flex-shrink-0 shadow-2xs"
        >
          <Sparkles className="w-4 h-4 text-amber-700" />
          <span>3. Ask AI Tutor</span>
        </button>

        <Link
          to={`/quiz/${topic.topic_id}`}
          className="btn-chunky-primary py-2 px-5 text-[15px] flex items-center gap-2 flex-shrink-0"
        >
          <span>4. Practice Arena</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ─── SUNNY LESSON HERO CARD (REPLACES DARK NAVY HERO) ─── */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border-3 border-sky-200 p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
            <span className="px-3.5 py-1 rounded-full bg-sky-100 text-indigo-950 border border-sky-200 text-xs font-heading font-black uppercase tracking-wider">
              Grade {topic.grade} Georgia GSE Math
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 text-xs font-heading font-black flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Standard Aligned
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-heading font-black text-indigo-950 tracking-tight">
            {topic.title}
          </h1>

          <p className="text-[17px] text-slate-700 leading-relaxed max-w-2xl font-medium">
            {topic.curriculum_reference} — {topic.description}
          </p>

          {/* Quick difficulty launch bar */}
          <div className="pt-2 flex flex-wrap items-center gap-2 justify-center md:justify-start">
            <span className="text-xs font-heading font-black uppercase text-slate-500 mr-1">
              Jump To Arena:
            </span>
            <Link
              to={`/quiz/${topic.topic_id}?tier=easy`}
              className="px-3 py-1.5 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border-2 border-emerald-300 text-xs font-heading font-black transition-transform active:scale-95 flex items-center gap-1 shadow-2xs"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Easy · 10 XP</span>
            </Link>
            <Link
              to={`/quiz/${topic.topic_id}?tier=medium`}
              className="px-3 py-1.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 border-2 border-amber-300 text-xs font-heading font-black transition-transform active:scale-95 flex items-center gap-1 shadow-2xs"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Medium · 20 XP</span>
            </Link>
            <Link
              to={`/quiz/${topic.topic_id}?tier=hard`}
              className="px-3 py-1.5 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-950 border-2 border-rose-300 text-xs font-heading font-black transition-transform active:scale-95 flex items-center gap-1 shadow-2xs"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Hard · 30 XP</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center flex-shrink-0">
          <QuestieMascot mood="wave" size={120} />
          <span className="text-xs font-heading font-bold text-indigo-900 bg-sky-100 px-3 py-1 rounded-full border border-sky-200 mt-1">
            Questie's Classroom
          </span>
        </div>
      </div>

      {/* ─── TAB 1: WHITEBOARD VIDEO STUDIO ─── */}
      {activeTab === 'video' && videoLesson && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-heading font-black text-indigo-950 flex items-center gap-2">
              <PlayCircle className="w-6 h-6 text-indigo-700" />
              <span>Interactive Whiteboard Studio</span>
            </h2>
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('concept');
              }}
              className="text-[15px] font-heading font-black text-blue-700 hover:text-blue-900 flex items-center gap-1 underline"
            >
              <span>Jump to Visual Infographic</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <InteractiveMathWhiteboard
            lesson={videoLesson}
            onJumpToPractice={() => navigate(`/quiz/${topic.topic_id}`)}
            onRegenerateWithAI={handleRegenerateVideo}
            isRegenerating={isRegeneratingVideo}
          />

          <div className="p-5 rounded-3xl bg-white/95 border-3 border-sky-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[16px] text-indigo-950 font-heading font-bold text-center sm:text-left">
              Finished the video? Deepen your understanding with our visual infographic &amp; worked examples!
            </span>
            <button
              onClick={() => {
                playSound('whoosh');
                setActiveTab('concept');
              }}
              className="btn-chunky-accent py-2.5 px-5 text-[15px] flex items-center gap-2 flex-shrink-0"
            >
              <span>Next: Concept Deep Dive</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─── TAB 2: CONCEPT BREAKDOWN & VISUAL INFOGRAPHIC ─── */}
      {activeTab === 'concept' && (
        <div className="space-y-8">
          {/* Visual Infographic Card */}
          {infographic && (
            <div className="bg-white/95 backdrop-blur-md rounded-3xl border-3 border-sky-200 p-6 sm:p-8 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-sky-100 pb-4">
                <div>
                  <h2 className="font-heading font-black text-2xl text-indigo-950 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-amber-500 fill-amber-400" />
                    <span>Visual Infographic: {infographic.title}</span>
                  </h2>
                  <p className="text-[16px] text-slate-600 mt-1">{infographic.caption}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-heading font-bold px-3 py-1 bg-sky-100 text-indigo-900 rounded-full border border-sky-200">
                    Source: {infographic.source}
                  </span>
                  <button
                    onClick={() => {
                      playSound('click');
                      setIsZoomModalOpen(true);
                    }}
                    className="btn-chunky-white py-2 px-3.5 text-xs flex items-center gap-1.5"
                  >
                    <ZoomIn className="w-4 h-4" />
                    <span>Zoom In</span>
                  </button>
                </div>
              </div>

              <div
                onClick={() => {
                  playSound('click');
                  setIsZoomModalOpen(true);
                }}
                className="w-full flex items-center justify-center bg-sky-50/50 rounded-2xl overflow-hidden border-2 border-sky-100 p-4 cursor-zoom-in hover:bg-sky-50 transition-colors"
              >
                <img
                  src={infographic.image_url}
                  alt={infographic.title}
                  className="max-h-[460px] w-auto object-contain rounded-2xl shadow-md"
                />
              </div>
            </div>
          )}

          {/* 2-Column: Concept & Step-by-Step Worked Example */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Core Concept Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl border-3 border-sky-200 p-6 sm:p-8 shadow-xl space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b-2 border-sky-100 pb-3">
                  <div className="flex items-center gap-2 text-indigo-950 font-heading font-black text-xl">
                    <BookOpen className="w-5 h-5 text-indigo-700" />
                    <h3>Concept Breakdown</h3>
                  </div>
                  <button
                    onClick={() => speakText(`${exp.concept_title}. ${exp.simple_explanation}`)}
                    className="btn-chunky-white py-1.5 px-3 text-xs flex items-center gap-1.5"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isSpeaking ? 'Stop Reading' : 'Read Aloud'}</span>
                  </button>
                </div>

                <p className="text-slate-800 leading-relaxed text-[17px] whitespace-pre-line font-medium">
                  {exp.simple_explanation}
                </p>
              </div>

              {/* Quick Practice Tip */}
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 text-amber-950 font-heading font-black text-xs uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-500" />
                  <span>Questie's Pro Tip</span>
                </div>
                <p className="text-[15px] text-amber-950 leading-relaxed font-semibold">
                  {exp.quick_practice_tip}
                </p>
              </div>
            </div>

            {/* Worked Example with Step Reveal */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl border-3 border-sky-200 p-6 sm:p-8 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b-2 border-sky-100 pb-3">
                <div className="flex items-center gap-2 text-purple-950 font-heading font-black text-xl">
                  <Sparkles className="w-5 h-5 text-purple-700" />
                  <h3>Worked Example</h3>
                </div>
                <span className="text-xs font-heading font-bold text-slate-500 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                  Step {revealedSteps} of {exp.worked_example.step_by_step_solution.length}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/80 border-2 border-blue-200 text-[16px] font-heading font-bold text-indigo-950 shadow-2xs">
                {exp.worked_example.problem_statement}
              </div>

              <div className="space-y-3">
                <span className="text-xs font-heading font-black text-slate-500 uppercase tracking-wider block">
                  Step-by-Step Reasoning:
                </span>
                <div className="space-y-2.5">
                  {exp.worked_example.step_by_step_solution.slice(0, revealedSteps).map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-3 text-[16px] text-slate-800 bg-sky-50/70 p-3.5 rounded-2xl border-2 border-sky-100"
                    >
                      <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-800 font-heading font-black flex items-center justify-center flex-shrink-0 text-xs border border-blue-300">
                        {idx + 1}
                      </span>
                      <span className="font-medium pt-0.5">{step}</span>
                    </motion.div>
                  ))}
                </div>

                {revealedSteps < exp.worked_example.step_by_step_solution.length && (
                  <button
                    onClick={() => {
                      playSound('click');
                      setRevealedSteps((prev) => prev + 1);
                    }}
                    className="w-full btn-chunky-white py-2.5 text-[15px] flex items-center justify-center gap-1.5"
                  >
                    <span>Reveal Next Step</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {revealedSteps >= exp.worked_example.step_by_step_solution.length && (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center justify-between text-[16px] font-heading font-bold text-emerald-950 shadow-2xs">
                  <span>Final Verified Answer:</span>
                  <span className="text-emerald-800 font-black text-lg">{exp.worked_example.final_answer}</span>
                </div>
              )}

              {/* Common Mistake Alert */}
              <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 space-y-1 shadow-2xs">
                <div className="flex items-center gap-2 text-rose-900 font-heading font-black text-xs uppercase tracking-wide">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Avoid This Common Mistake:</span>
                </div>
                <p className="text-[15px] text-rose-950 leading-relaxed font-medium">
                  {exp.common_mistake}
                </p>
              </div>
            </div>

          </div>

          {/* Practice Arena Banner */}
          <div className="p-8 rounded-3xl bg-white/95 backdrop-blur-md border-3 border-sky-200 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <QuestieMascot mood="celebrating" size={80} className="flex-shrink-0 hidden sm:block" />
              <div className="space-y-1">
                <h3 className="text-2xl font-heading font-black text-indigo-950">Ready to test your math mastery?</h3>
                <p className="text-[16px] text-slate-700 max-w-md">
                  Jump into the Arena! The adaptive engine picks questions matched to your skills and unlocks XP.
                </p>
              </div>
            </div>

            <Link
              to={`/quiz/${topic.topic_id}`}
              className="btn-chunky-primary py-4 px-8 text-[18px] flex items-center gap-2 flex-shrink-0"
            >
              <span>Launch Arena Quest</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}

      {/* Fullscreen Zoom Modal for Infographic */}
      <AnimatePresence>
        {isZoomModalOpen && infographic && (
          <div
            onClick={() => setIsZoomModalOpen(false)}
            className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out animate-fadeIn"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-4xl max-h-[90vh] overflow-auto shadow-2xl border-3 border-sky-200 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b-2 border-sky-100 pb-3">
                <h3 className="font-heading font-black text-indigo-950 text-xl">{infographic.title}</h3>
                <button
                  onClick={() => setIsZoomModalOpen(false)}
                  className="p-1.5 rounded-2xl hover:bg-slate-100 text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <img
                src={infographic.image_url}
                alt={infographic.title}
                className="w-full h-auto rounded-2xl object-contain max-h-[75vh]"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Socratic AI Tutor Drawer */}
      <AskAITutorDrawer
        topicId={topic.topic_id}
        topicTitle={topic.title}
        grade={topic.grade}
        isOpen={isTutorDrawerOpen}
        onClose={() => setIsTutorDrawerOpen(false)}
      />

    </div>
  );
};
