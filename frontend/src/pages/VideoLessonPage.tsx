import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, Sparkles, ChevronRight, PlayCircle } from 'lucide-react';
import { api, getStoredGrade } from '../services/api';
import { VideoLesson, Topic } from '../types';
import { InteractiveMathWhiteboard } from '../components/InteractiveMathWhiteboard';
import { AskAITutorDrawer } from '../components/AskAITutorDrawer';
import { QuestieMascot } from '../components/QuestieMascot';
import { useSound } from '../context/SoundContext';

export const VideoLessonPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { playSound } = useSound();
  const [grade] = useState<number>(getStoredGrade());
  const [topic, setTopic] = useState<Topic | null>(null);
  const [lesson, setLesson] = useState<VideoLesson | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

  useEffect(() => {
    if (topicId) {
      loadData(topicId);
    }
  }, [topicId]);

  const loadData = async (tid: string) => {
    setLoading(true);
    try {
      const [lessonData, topicData] = await Promise.all([
        api.getVideoLesson(tid, grade),
        api.getTopic(tid)
      ]);
      setLesson(lessonData);
      setTopic(topicData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async (customPrompt?: string) => {
    if (!topicId) return;
    setIsRegenerating(true);
    try {
      const regenerated = await api.generateVideoLesson(topicId, topic?.grade || grade, customPrompt);
      setLesson(regenerated);
      playSound('celebrate');
    } catch (e) {
      console.error('Failed to regenerate video with AI:', e);
    } finally {
      setIsRegenerating(false);
    }
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
        <div className="h-96 bg-white/90 rounded-3xl border-3 border-sky-200 animate-pulse" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4 bg-white/95 rounded-3xl border-3 border-sky-200 shadow-xl p-6">
        <QuestieMascot mood="thinking" size={90} className="mx-auto" />
        <h2 className="text-2xl font-heading font-black text-indigo-950">Video Lesson Not Found</h2>
        <p className="text-[16px] text-slate-600">The lesson you are looking for is not currently available.</p>
        <Link to="/learn" className="btn-chunky-primary inline-flex items-center gap-2">
          <span>Return to Topics</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 px-2 sm:px-4">

      {/* ─── LEARNING FLOW STEPPER ─── */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border-3 border-sky-200 p-3 shadow-md flex items-center justify-between text-[15px] font-heading font-black text-slate-600 overflow-x-auto gap-2">
        <div className="flex items-center gap-2 text-white bg-blue-600 px-4 py-2 rounded-2xl shadow-sm border-b-3 border-blue-800 flex-shrink-0">
          <span className="w-6 h-6 rounded-xl bg-white/20 flex items-center justify-center text-xs font-black">1</span>
          <span>Whiteboard Video Lesson</span>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-300 flex-shrink-0" />
        <Link
          to={`/lesson/${topicId}`}
          className="flex items-center gap-2 hover:text-blue-600 px-4 py-2 rounded-2xl flex-shrink-0 transition-colors bg-sky-50 hover:bg-sky-100 border border-sky-200 text-indigo-950"
        >
          <span className="w-6 h-6 rounded-xl bg-sky-200 text-indigo-950 flex items-center justify-center text-xs font-black">2</span>
          <span>Concept &amp; Infographic</span>
        </Link>
        <ChevronRight className="w-5 h-5 text-slate-300 flex-shrink-0" />
        <Link
          to={`/quiz/${topicId}`}
          className="flex items-center gap-2 hover:text-blue-600 px-4 py-2 rounded-2xl flex-shrink-0 transition-colors bg-sky-50 hover:bg-sky-100 border border-sky-200 text-indigo-950"
        >
          <span className="w-6 h-6 rounded-xl bg-sky-200 text-indigo-950 flex items-center justify-center text-xs font-black">3</span>
          <span>Practice Arena Quest</span>
        </Link>
      </div>

      {/* ─── SUNNY HEADER BAR ─── */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border-3 border-sky-200 p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-heading font-black px-3 py-1 rounded-full bg-sky-100 text-indigo-950 uppercase tracking-wider border border-sky-200">
              Grade {topic?.grade || grade} GSE Math
            </span>
            <span className="text-xs font-heading font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 flex items-center gap-1">
              <PlayCircle className="w-3.5 h-3.5 text-emerald-700" />
              Whiteboard Studio
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-indigo-950 mt-2">
            {lesson.title}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              playSound('click');
              setIsTutorOpen(true);
            }}
            className="btn-chunky-accent py-2.5 px-4 text-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-800" />
            <span>Ask Tutor AI</span>
          </button>

          <Link
            to={`/lesson/${lesson.topic_id}`}
            className="btn-chunky-white py-2.5 px-4 text-xs flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>Read Concept</span>
          </Link>

          <Link
            to={`/quiz/${lesson.topic_id}`}
            className="btn-chunky-primary py-2.5 px-5 text-xs flex items-center gap-1.5"
          >
            <span>Practice</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ─── INTERACTIVE WHITEBOARD PLAYER ─── */}
      <InteractiveMathWhiteboard
        lesson={lesson}
        onJumpToPractice={() => navigate(`/quiz/${lesson.topic_id}`)}
        onRegenerateWithAI={handleRegenerate}
        isRegenerating={isRegenerating}
      />

      {/* Socratic AI Tutor Drawer */}
      <AskAITutorDrawer
        topicId={lesson.topic_id}
        topicTitle={lesson.title}
        grade={topic?.grade || grade}
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
      />

    </div>
  );
};
