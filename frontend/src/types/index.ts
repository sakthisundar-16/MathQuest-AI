export interface Topic {
  topic_id: string;
  grade: number;
  title: string;
  category: string;
  curriculum_reference: string;
  description: string;
  icon: string;
  learning_objectives: string[];
  default_difficulty: string;
}

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  question_id: string;
  topic_id: string;
  grade: number;
  difficulty: string;
  question_text: string;
  options: Option[];
  explanation?: string;
  learning_objective?: string;
  verification_status?: string;
}

export interface AnswerResult {
  is_correct: boolean;
  correct_option_id: string;
  explanation: string;
  points_awarded: number;
  next_difficulty: string;
  adaptive_reason: string;
  recommended_action: string;
}

export interface Badge {
  badge_id: string;
  title: string;
  description: string;
  icon: string;
  points_reward: number;
  awarded_at?: string;
}

export interface TopicProgress {
  topic_id: string;
  current_difficulty: string;
  questions_answered: number;
  correct_count: number;
  accuracy: number;
  points: number;
  updated_at: string;
}

export interface DashboardData {
  student: {
    student_id: string;
    grade: number;
    display_name: string;
    streak_days?: number;
  };
  grade: number;
  total_points: number;
  total_questions_answered: number;
  overall_accuracy: number;
  topic_progress: TopicProgress[];
  achievements: Badge[];
  all_badges: Badge[];
}

export interface QuizSummary {
  attempt_id: string;
  student_id: string;
  topic_id: string;
  total_questions: number;
  correct_count: number;
  accuracy: number;
  total_points_earned: number;
  bonus_points: number;
  encouraging_message: string;
  newly_unlocked_badges: Badge[];
  recommendation: string;
  completed_at: string;
}

export interface VideoLessonSlide {
  slide_id: number;
  title: string;
  visual_concept: string;
  narration_text: string;
  key_takeaway: string;
  interactive_check?: {
    question: string;
    options: string[];
    correct: string;
  };
}

export interface VideoLesson {
  topic_id: string;
  title: string;
  total_slides: number;
  slides: VideoLessonSlide[];
  source?: string;
}

export interface AIExplanation {
  source: string;
  data: {
    concept_title: string;
    simple_explanation: string;
    worked_example: {
      problem_statement: string;
      step_by_step_solution: string[];
      final_answer: string;
    };
    common_mistake: string;
    quick_practice_tip: string;
  };
}

export interface InfographicData {
  status: string;
  source: string;
  topic_id: string;
  image_url: string;
  title: string;
  caption: string;
}

export interface AskTutorResponse {
  answer: string;
  worked_example?: string;
  encouragement: string;
  source: string;
}

export interface BehaviorAnalysis {
  status: string;
  student_id: string;
  grade: number;
  rl_profile?: {
    overall_accuracy?: number;
    total_questions_answered?: number;
    total_points?: number;
    mastered_topics?: Array<{ topic_id: string; title?: string; accuracy?: number }>;
    tough_topics?: Array<{ topic_id: string; title?: string; accuracy?: number }>;
    in_progress_topics?: Array<{ topic_id: string; title?: string; accuracy?: number }>;
    unattempted_count?: number;
    next_recommended_action?: {
      action: string;
      message: string;
      recommended_topic?: { topic_id: string; title?: string } | null;
    };
  };
  ai_coaching?: {
    mentor_message: string;
    action_tips: string[];
  };
}

