"""
Pydantic Request & Response Schemas for MathQuest AI
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class OptionSchema(BaseModel):
    id: str
    text: str

class QuestionResponse(BaseModel):
    question_id: str
    topic_id: str
    grade: int
    difficulty: str
    question_text: str
    options: List[OptionSchema]
    explanation: Optional[str] = None
    learning_objective: Optional[str] = None
    verification_status: Optional[str] = "verified"

class StartQuizRequest(BaseModel):
    student_id: str
    topic_id: str
    grade: int = 5
    num_questions: int = 4
    difficulty: Optional[str] = None
    is_locked_tier: Optional[bool] = False

class SubmitAnswerRequest(BaseModel):
    student_id: str
    question_id: str
    selected_option_id: str
    time_spent_seconds: Optional[int] = 0

class HintRequest(BaseModel):
    student_id: str
    question_id: str
    topic_id: str
    grade: int = 5
    question_text: str
    current_options: List[OptionSchema]

class HintResponse(BaseModel):
    hint: str
    socratic_question: str
    source: str = "ai-mentor"

class AskTutorRequest(BaseModel):
    student_id: Optional[str] = "student_default"
    grade: int = 5
    topic_id: str
    question: str

class AskTutorResponse(BaseModel):
    answer: str
    worked_example: Optional[str] = None
    encouragement: str
    source: str = "ai_tutor"

class AnswerResultResponse(BaseModel):
    is_correct: bool
    correct_option_id: str
    explanation: str
    points_awarded: int
    next_difficulty: str
    adaptive_reason: str
    recommended_action: str

class CompleteQuizRequest(BaseModel):
    student_id: str

class QuizSummaryResponse(BaseModel):
    attempt_id: str
    student_id: str
    topic_id: str
    total_questions: int
    correct_count: int
    accuracy: float
    total_points_earned: int
    bonus_points: int
    encouraging_message: str
    newly_unlocked_badges: List[Dict[str, Any]]
    recommendation: str

class TopicResponse(BaseModel):
    topic_id: str
    grade: int
    title: str
    category: str
    curriculum_reference: str
    description: str
    icon: str
    learning_objectives: List[str]
    default_difficulty: str

class ExplanationRequest(BaseModel):
    grade: int = 5
    topic_id: str
    learning_objective: Optional[str] = None

class InfographicRequest(BaseModel):
    grade: int = 5
    topic_id: str

class VideoLessonSlide(BaseModel):
    slide_id: int
    title: str
    visual_concept: str
    narration_text: str
    key_takeaway: str
    interactive_check: Optional[Dict[str, Any]] = None

class VideoLessonResponse(BaseModel):
    topic_id: str
    title: str
    total_slides: int
    slides: List[VideoLessonSlide]
    source: Optional[str] = "verified-curriculum"

class GenerateVideoLessonRequest(BaseModel):
    topic_id: str
    grade: int = 5
    custom_prompt: Optional[str] = None

class TopicMasteryDetail(BaseModel):
    topic_id: str
    title: str
    category: str
    category_classification: str = Field(..., alias="category")
    label: str
    mastered: bool = False
    mastery_score: float
    accuracy: float
    total_questions: int
    current_difficulty: str
    color: str
    recommendation: str

class NextRecommendedAction(BaseModel):
    action: str
    recommended_topic: Optional[Dict[str, Any]] = None
    message: str

class RLProfileResponse(BaseModel):
    student_id: str
    overall_accuracy: float
    total_questions_answered: int
    total_points: int
    mastered_topics: List[Dict[str, Any]]
    tough_topics: List[Dict[str, Any]]
    in_progress_topics: List[Dict[str, Any]]
    unattempted_count: int
    next_recommended_action: NextRecommendedAction

class AICoachingResponse(BaseModel):
    status: str
    source: str
    mentor_message: str
    action_tips: List[str]

class BehaviorAnalysisResponse(BaseModel):
    status: str
    student_id: str
    grade: int
    rl_profile: Dict[str, Any]
    ai_coaching: AICoachingResponse

