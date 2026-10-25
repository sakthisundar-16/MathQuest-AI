import { Topic, DashboardData, QuizSummary, VideoLesson, AIExplanation, InfographicData, AnswerResult, Question } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const getStudentId = (): string => {
  let id = localStorage.getItem('mathquest_student_id');
  if (!id) {
    id = 'student_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('mathquest_student_id', id);
  }
  return id;
};

export const getStoredGrade = (): number => {
  const g = localStorage.getItem('mathquest_grade');
  return g ? parseInt(g, 10) : 5;
};

export const setStoredGrade = (grade: number): void => {
  localStorage.setItem('mathquest_grade', grade.toString());
};

export const api = {
  async getTopics(grade: number = 5): Promise<Topic[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/topics?grade=${grade}`);
      if (!res.ok) throw new Error('Failed to fetch topics');
      return await res.json();
    } catch (e) {
      console.warn('API error fetching topics, using verified fallback data', e);
      return [];
    }
  },

  async getTopic(topicId: string): Promise<Topic | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/topics/${topicId}`);
      if (!res.ok) throw new Error('Topic not found');
      return await res.json();
    } catch (e) {
      console.warn('API error fetching topic', e);
      return null;
    }
  },

  async getAIExplanation(topicId: string, grade: number = 5): Promise<AIExplanation> {
    const res = await fetch(`${API_BASE_URL}/ai/explanations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic_id: topicId, grade })
    });
    if (!res.ok) throw new Error('Failed to generate explanation');
    return await res.json();
  },

  async getInfographic(topicId: string, grade: number = 5): Promise<InfographicData> {
    const res = await fetch(`${API_BASE_URL}/ai/infographics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic_id: topicId, grade })
    });
    if (!res.ok) throw new Error('Failed to fetch infographic');
    return await res.json();
  },

  async getVideoLesson(topicId: string, grade: number = 5): Promise<VideoLesson> {
    const res = await fetch(`${API_BASE_URL}/lessons/${topicId}/video?grade=${grade}`);
    if (!res.ok) throw new Error('Failed to fetch video lesson');
    return await res.json();
  },

  async generateVideoLesson(topicId: string, grade: number = 5, customPrompt?: string): Promise<VideoLesson> {
    const res = await fetch(`${API_BASE_URL}/lessons/generate-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic_id: topicId, grade, custom_prompt: customPrompt })
    });
    if (!res.ok) throw new Error('Failed to generate AI video lesson');
    return await res.json();
  },

  async startQuiz(
    studentId: string,
    topicId: string,
    grade: number = 5,
    numQuestions: number = 4,
    difficulty?: string,
    isLockedTier?: boolean
  ) {
    const res = await fetch(`${API_BASE_URL}/quizzes/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentId,
        topic_id: topicId,
        grade,
        num_questions: numQuestions,
        difficulty: difficulty || null,
        is_locked_tier: !!isLockedTier
      })
    });
    if (!res.ok) throw new Error('Failed to start quiz');
    return await res.json();
  },

  async submitAnswer(attemptId: string, studentId: string, questionId: string, optionId: string): Promise<AnswerResult> {
    const res = await fetch(`${API_BASE_URL}/quizzes/${attemptId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentId,
        question_id: questionId,
        selected_option_id: optionId
      })
    });
    if (!res.ok) {
      let errorMsg = 'Failed to submit answer';
      try {
        const errorData = await res.json();
        errorMsg = errorData.detail || errorMsg;
      } catch {
        // use fallback message
      }
      throw new Error(errorMsg);
    }
    return await res.json();
  },

  async getNextQuestion(attemptId: string): Promise<{ has_next: boolean; question?: Question; question_number?: number; total_questions?: number; difficulty?: string }> {
    const res = await fetch(`${API_BASE_URL}/quizzes/${attemptId}/next`);
    if (!res.ok) throw new Error('Failed to get next question');
    return await res.json();
  },

  async completeQuiz(attemptId: string): Promise<QuizSummary> {
    const res = await fetch(`${API_BASE_URL}/quizzes/${attemptId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to complete quiz');
    return await res.json();
  },

  async getQuizResults(attemptId: string): Promise<QuizSummary> {
    const res = await fetch(`${API_BASE_URL}/quizzes/${attemptId}/results`);
    if (!res.ok) throw new Error('Failed to get quiz results');
    return await res.json();
  },

  async getDashboard(studentId: string, grade: number = 5): Promise<DashboardData> {
    const res = await fetch(`${API_BASE_URL}/students/${studentId}/dashboard?grade=${grade}`);
    if (!res.ok) throw new Error('Failed to get dashboard');
    return await res.json();
  },

  async getStudentBehaviorAnalysis(studentId: string, grade: number = 5) {
    try {
      const res = await fetch(`${API_BASE_URL}/students/${studentId}/behavior-analysis?grade=${grade}`);
      if (!res.ok) throw new Error('Failed to get behavior analysis');
      return await res.json();
    } catch (e) {
      console.warn('API error fetching behavior analysis', e);
      return null;
    }
  },

  async getAIHint(payload: {
    student_id: string;
    question_id: string;
    topic_id: string;
    grade: number;
    question_text: string;
    current_options: { id: string; text: string }[];
  }): Promise<{ hint: string; socratic_question: string; source: string }> {
    const res = await fetch(`${API_BASE_URL}/ai/hint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to generate hint');
    return await res.json();
  },

  async askTutor(payload: {
    student_id?: string;
    grade: number;
    topic_id: string;
    question: string;
  }): Promise<{ answer: string; worked_example?: string; encouragement: string; source: string }> {
    const res = await fetch(`${API_BASE_URL}/ai/ask-tutor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to get tutor response');
    return await res.json();
  }
};

