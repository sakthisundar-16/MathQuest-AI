import React, { useState } from 'react';
import { Sparkles, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, getStudentId } from '../services/api';
import { QuestieMascot } from './QuestieMascot';

interface AskAITutorDrawerProps {
  topicId: string;
  topicTitle: string;
  grade: number;
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_PROMPTS = [
  "Why don't we add denominators in fractions?",
  "Can you explain with an easy real-world story?",
  "Show me a step-by-step worked example calculation.",
  "What is the most common mistake to watch out for?"
];

export const AskAITutorDrawer: React.FC<AskAITutorDrawerProps> = ({
  topicId,
  topicTitle,
  grade,
  isOpen,
  onClose
}) => {
  const [question, setQuestion] = useState<string>('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'tutor'; text: string; example?: string; encouragement?: string }>>([
    {
      sender: 'tutor',
      text: `Hey explorer! I'm Questie, your Grade ${grade} AI math partner! Ask me any question about ${topicTitle} — no question is too simple!`,
      encouragement: "Let's explore math together!"
    }
  ]);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleAsk = async (queryText?: string) => {
    const q = queryText || question;
    if (!q.trim() || loading) return;

    const studentId = getStudentId();
    setMessages((prev) => [...prev, { sender: 'user', text: q }]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await api.askTutor({
        student_id: studentId,
        grade,
        topic_id: topicId,
        question: q
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: 'tutor',
          text: res.answer,
          example: res.worked_example,
          encouragement: res.encouragement
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'tutor',
          text: "When solving this, remember to look at the denominator or place values first! Drawing a quick picture can make it crystal clear.",
          encouragement: "Keep going, you've got this!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l-3 border-sky-200">

        {/* ─── SUNNY DRAWER HEADER ─── */}
        <div className="p-4 sm:p-5 border-b-2 border-sky-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 border-2 border-sky-200 flex items-center justify-center shadow-2xs overflow-hidden flex-shrink-0">
              <QuestieMascot mood={loading ? 'thinking' : 'wave'} size={44} />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-indigo-950 flex items-center gap-1.5">
                <span>Ask Questie AI</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-sky-100 text-indigo-950 font-heading font-black border border-sky-200">
                  Grade {grade}
                </span>
              </h3>
              <p className="text-xs font-heading font-bold text-slate-500 truncate max-w-[210px]">
                {topicTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* ─── CHAT MESSAGES ─── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-sky-50/40">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] p-4 rounded-3xl text-[16px] leading-relaxed shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border-2 border-sky-100 rounded-bl-none'
                }`}
              >
                <p className="font-medium">{m.text}</p>

                {m.example && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-950 text-[15px]">
                    <span className="font-heading font-black block text-amber-800 text-xs uppercase tracking-wider mb-1">
                      Worked Step:
                    </span>
                    <p className="font-medium">{m.example}</p>
                  </div>
                )}

                {m.encouragement && (
                  <div className="mt-2.5 text-xs font-heading font-black text-purple-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span>{m.encouragement}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-[15px] font-heading font-bold text-slate-600 bg-white p-3.5 rounded-2xl border-2 border-sky-100 max-w-[240px] shadow-sm">
              <div className="w-4 h-4 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <span>Questie is thinking...</span>
            </div>
          )}
        </div>

        {/* ─── QUICK SUGGESTION CHIPS ─── */}
        <div className="p-3 bg-white border-t-2 border-sky-100 space-y-2">
          <span className="text-xs font-heading font-black text-slate-500 uppercase tracking-wider block">
            Ask Questie Quickly:
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleAsk(prompt)}
                disabled={loading}
                className="text-xs font-heading font-bold bg-sky-50 hover:bg-sky-100 text-indigo-950 px-3 py-1.5 rounded-xl border border-sky-200 transition-colors text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* ─── INPUT BAR ─── */}
        <div className="p-3.5 bg-white border-t-2 border-sky-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask Questie any math doubt..."
              className="flex-1 bg-sky-50 border-2 border-sky-200 rounded-2xl px-4 py-3 text-[16px] text-slate-900 focus:outline-none focus:ring-3 focus:ring-blue-300 focus:bg-white font-medium"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!question.trim() || loading}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-2xl shadow-md transition-all active:scale-95 flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
