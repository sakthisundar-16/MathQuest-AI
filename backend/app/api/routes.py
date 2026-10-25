"""
MathQuest AI API Routes
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
import uuid
from datetime import datetime

from app.core.curriculum import get_topics_for_grade, get_topic_by_id
from app.core.video_lessons import get_video_lesson
from app.core.config import settings
from app.services.ai_service import ai_service
from app.validators.math_validator import verify_question_data
from app.learning.adaptive_engine import AdaptiveEngine
from app.learning.gamification_engine import GamificationEngine, BADGE_DEFINITIONS
from app.database.db import db_manager
from app.schemas.api_schemas import (
    TopicResponse,
    QuestionResponse,
    StartQuizRequest,
    SubmitAnswerRequest,
    HintRequest,
    HintResponse,
    AnswerResultResponse,
    QuizSummaryResponse,
    ExplanationRequest,
    InfographicRequest,
    VideoLessonResponse,
    GenerateVideoLessonRequest,
    AskTutorRequest,
    AskTutorResponse
)

router = APIRouter()
adaptive_engine = AdaptiveEngine()

# Active in-memory quiz sessions store: attempt_id -> session dict
active_quiz_sessions: Dict[str, Dict[str, Any]] = {}


@router.get("/health")
async def health_check():
    """Health check endpoint providing status of services, DB, and AI."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": {
            "type": "mongodb_atlas" if db_manager.is_connected else "memory_store",
            "connected": db_manager.is_connected
        },
        "ai_service": {
            "gemini_api_configured": bool(settings.GEMINI_API_KEY),
            "model": settings.GEMINI_MODEL,
            "status": "operational"
        },
        "curriculum": "Georgia Standards of Excellence (GSE) Grades 5 & 6"
    }


@router.get("/topics", response_model=List[TopicResponse])
async def list_topics(grade: int = 5):
    """Retrieve curriculum topics for specified grade."""
    topics = get_topics_for_grade(grade)
    return topics


@router.get("/topics/{topic_id}", response_model=TopicResponse)
async def get_topic(topic_id: str):
    """Retrieve a single topic detail."""
    topic = get_topic_by_id(topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic


@router.post("/ai/explanations")
async def get_ai_explanation(req: ExplanationRequest):
    """Generates structured educational explanation for a topic."""
    result = await ai_service.generate_explanation(
        grade=req.grade,
        topic_id=req.topic_id,
        learning_objective=req.learning_objective or "Understand core topic concepts"
    )
    return result


@router.post("/ai/hint", response_model=HintResponse)
async def get_ai_hint(req: HintRequest):
    """
    Socratic AI Math Mentor Hint Endpoint.
    Generates a helpful, non-spoiling hint and leading question to guide Grade 5/6 students.
    """
    opts = [{"id": o.id, "text": o.text} for o in req.current_options]
    hint_data = await ai_service.generate_socratic_hint(
        grade=req.grade,
        topic_id=req.topic_id,
        question_text=req.question_text,
        options=opts
    )
    return HintResponse(
        hint=hint_data["hint"],
        socratic_question=hint_data["socratic_question"],
        source=hint_data["source"]
    )


@router.post("/ai/ask-tutor", response_model=AskTutorResponse)
async def ask_ai_tutor(req: AskTutorRequest):
    """
    Interactive Socratic AI Math Tutor endpoint.
    Answers Grade 5 & 6 student questions, gives intuitive analogies, and provides worked examples.
    """
    res = await ai_service.ask_tutor(
        grade=req.grade,
        topic_id=req.topic_id,
        question=req.question
    )
    return AskTutorResponse(
        answer=res["answer"],
        worked_example=res.get("worked_example"),
        encouragement=res["encouragement"],
        source=res.get("source", "ai_tutor")
    )


@router.post("/ai/infographics")
async def get_ai_infographic(req: InfographicRequest):
    """Retrieves or generates an educational infographic."""
    # Check cache first
    cached = await db_manager.get_cached_infographic(req.topic_id)
    if cached:
        return cached

    result = await ai_service.generate_infographic(
        grade=req.grade,
        topic_id=req.topic_id
    )
    await db_manager.cache_infographic(req.topic_id, result)
    return result


@router.get("/lessons/{topic_id}/video", response_model=VideoLessonResponse)
async def get_topic_video_lesson(topic_id: str, grade: int = 5):
    """Retrieves slide-based narrated video lesson aligned with Georgia standards."""
    lesson = get_video_lesson(topic_id)
    if not lesson:
        lesson = await ai_service.generate_video_lesson(topic_id, grade=grade)
    if not lesson:
        raise HTTPException(status_code=404, detail="Video lesson not found")
    return lesson


@router.post("/lessons/generate-video", response_model=VideoLessonResponse)
async def generate_dynamic_video_lesson(req: GenerateVideoLessonRequest):
    """
    Dynamically generates or regenerates an AI-powered narrated slide lesson
    for any Georgia math topic using Gemini LLM with instant pedagogical fallback.
    """
    lesson = await ai_service.generate_video_lesson(
        topic_id=req.topic_id,
        custom_prompt=req.custom_prompt,
        grade=req.grade
    )
    return lesson


@router.post("/quizzes/start")
async def start_quiz(req: StartQuizRequest):
    """
    Initializes an adaptive quiz practice session.
    Retrieves previous student mastery level to seed starting difficulty.
    Generates initial question.
    """
    await db_manager.get_or_create_student(req.student_id, req.grade)

    # Determine starting difficulty: explicit choice or from previous progress
    if req.difficulty and req.difficulty.lower() in ["easy", "medium", "hard"]:
        initial_diff = req.difficulty.lower()
    else:
        student_progress = await db_manager.get_student_progress(req.student_id)
        topic_prog = next((p for p in student_progress if p.get("topic_id") == req.topic_id), None)
        initial_diff = topic_prog.get("current_difficulty", "easy") if topic_prog else "easy"

    attempt_id = f"attempt_{uuid.uuid4().hex[:10]}"

    # Generate initial question
    q = await ai_service.generate_practice_question(
        grade=req.grade,
        topic_id=req.topic_id,
        difficulty=initial_diff
    )

    # Initialize server-side session state
    active_quiz_sessions[attempt_id] = {
        "attempt_id": attempt_id,
        "student_id": req.student_id,
        "topic_id": req.topic_id,
        "grade": req.grade,
        "current_difficulty": initial_diff,
        "is_locked_tier": bool(req.is_locked_tier),
        "target_questions": req.num_questions,
        "questions_delivered": [q],
        "answers_history": [],  # list of bools
        "results": [],
        "total_points_earned": 0,
        "is_completed": False,
        "started_at": datetime.utcnow().isoformat()
    }

    # Hide correct answer from student in the response
    safe_q = dict(q)
    safe_q.pop("correct_answer", None)
    safe_q.pop("explanation", None)

    return {
        "attempt_id": attempt_id,
        "student_id": req.student_id,
        "topic_id": req.topic_id,
        "initial_difficulty": initial_diff,
        "question_number": 1,
        "total_questions": req.num_questions,
        "current_question": safe_q
    }


@router.post("/quizzes/{attempt_id}/answer", response_model=AnswerResultResponse)
async def submit_quiz_answer(attempt_id: str, req: SubmitAnswerRequest):
    """
    Evaluates an answer server-side.
    Validates question, applies points, and runs the adaptive learning engine
    to determine difficulty adjustment.
    """
    session = active_quiz_sessions.get(attempt_id)
    if not session:
        raise HTTPException(status_code=404, detail="Active quiz session not found.")

    if session["is_completed"]:
        raise HTTPException(status_code=400, detail="Quiz session has already been completed.")

    # Find the current question being answered
    curr_q = next((q for q in session["questions_delivered"] if q["question_id"] == req.question_id), None)
    if not curr_q:
        raise HTTPException(status_code=400, detail="Question not found in this active attempt.")

    # Handle duplicate or already-answered submission idempotently instead of throwing 400
    existing_result = next((r for r in session["results"] if r["question_id"] == req.question_id), None)
    if existing_result:
        return AnswerResultResponse(
            is_correct=existing_result["is_correct"],
            correct_option_id=existing_result["correct_option_id"],
            explanation=curr_q.get("explanation", "Great job testing your math knowledge!"),
            points_awarded=existing_result["points_awarded"],
            next_difficulty=session["current_difficulty"],
            adaptive_reason="Answer already evaluated for this question.",
            recommended_action="proceed_to_next"
        )

    # Server-side validation of answer (supports option id "A" or option text)
    correct_opt = str(curr_q.get("correct_answer", "")).strip().upper()
    submitted_opt = str(req.selected_option_id).strip().upper()
    is_correct = (submitted_opt == correct_opt)

    # If submitted was full text or index instead of ID, match against option objects
    if not is_correct and "options" in curr_q:
        matched_option = next(
            (opt for opt in curr_q["options"] if opt.get("id", "").strip().upper() == submitted_opt or opt.get("text", "").strip().lower() == submitted_opt.lower()),
            None
        )
        if matched_option and matched_option.get("id", "").strip().upper() == correct_opt:
            is_correct = True

    # Points calculation
    points = GamificationEngine.calculate_question_points(is_correct, session["current_difficulty"])
    session["total_points_earned"] += points
    session["answers_history"].append(is_correct)

    # Adaptive Engine evaluation or Locked Tier maintenance
    if session.get("is_locked_tier"):
        next_diff = session["current_difficulty"]
        adaptive_result = {
            "next_difficulty": next_diff,
            "reason": f"Practicing specifically in {next_diff.capitalize()} tier category."
        }
    else:
        adaptive_result = adaptive_engine.calculate_next_difficulty(
            current_difficulty=session["current_difficulty"],
            recent_answers=session["answers_history"]
        )
        next_diff = adaptive_result["next_difficulty"]
        session["current_difficulty"] = next_diff

    # Record result
    result_entry = {
        "question_id": req.question_id,
        "selected_option_id": req.selected_option_id,
        "correct_option_id": correct_opt,
        "is_correct": is_correct,
        "points_awarded": points,
        "difficulty": curr_q.get("difficulty", session["current_difficulty"]),
        "timestamp": datetime.utcnow().isoformat()
    }
    session["results"].append(result_entry)

    # Update database progress asynchronously
    await db_manager.update_learning_progress(
        student_id=session["student_id"],
        topic_id=session["topic_id"],
        is_correct=is_correct,
        points_earned=points,
        new_difficulty=next_diff
    )

    return AnswerResultResponse(
        is_correct=is_correct,
        correct_option_id=correct_opt,
        explanation=curr_q.get("explanation", "Great job testing your math knowledge!"),
        points_awarded=points,
        next_difficulty=next_diff,
        adaptive_reason=adaptive_result["reason"],
        recommended_action=adaptive_result["recommended_action"]
    )


@router.get("/quizzes/{attempt_id}/next")
async def get_next_question(attempt_id: str):
    """
    Fetches the next adaptive question in the session based on updated difficulty.
    """
    session = active_quiz_sessions.get(attempt_id)
    if not session:
        raise HTTPException(status_code=404, detail="Quiz session not found.")

    current_idx = len(session["results"])
    if current_idx >= session["target_questions"]:
        return {
            "has_next": False,
            "message": "Quiz completed! Proceed to results."
        }

    # Generate next question with the current adaptive difficulty, excluding already delivered questions
    delivered_ids = [q["question_id"] for q in session["questions_delivered"]]
    next_q = await ai_service.generate_practice_question(
        grade=session["grade"],
        topic_id=session["topic_id"],
        difficulty=session["current_difficulty"],
        excluded_ids=delivered_ids
    )
    session["questions_delivered"].append(next_q)

    safe_q = dict(next_q)
    safe_q.pop("correct_answer", None)
    safe_q.pop("explanation", None)

    return {
        "has_next": True,
        "question_number": current_idx + 1,
        "total_questions": session["target_questions"],
        "difficulty": session["current_difficulty"],
        "question": safe_q
    }


@router.post("/quizzes/{attempt_id}/complete", response_model=QuizSummaryResponse)
async def complete_quiz(attempt_id: str):
    """
    Completes quiz attempt, evaluates achievements, awards bonus points, and persists final record.
    """
    session = active_quiz_sessions.get(attempt_id)
    if not session:
        # Check if already saved in db
        saved = await db_manager.get_quiz_attempt(attempt_id)
        if saved:
            return saved
        raise HTTPException(status_code=404, detail="Quiz session not found.")

    session["is_completed"] = True
    total_q = len(session["results"])
    correct_count = sum(1 for r in session["results"] if r["is_correct"])
    accuracy = round(correct_count / total_q, 2) if total_q > 0 else 0.0

    # Retrieve existing student badges to prevent duplicates
    existing_achievements = await db_manager.get_student_achievements(session["student_id"])
    existing_badge_ids = [a["badge_id"] for a in existing_achievements]

    bonus, new_badges, encouragement = GamificationEngine.evaluate_quiz_completion_rewards(
        total_questions=total_q,
        correct_count=correct_count,
        topic_id=session["topic_id"],
        current_total_points=session["total_points_earned"],
        existing_badges=existing_badge_ids
    )

    # Award unlocked badges
    for badge in new_badges:
        await db_manager.award_achievement(session["student_id"], badge)
        session["total_points_earned"] += badge.get("points_reward", 0)

    session["total_points_earned"] += bonus

    # Evaluate readiness
    readiness = adaptive_engine.evaluate_topic_readiness(
        questions_answered=total_q,
        accuracy=accuracy,
        current_difficulty=session["current_difficulty"]
    )

    summary_doc = {
        "attempt_id": attempt_id,
        "student_id": session["student_id"],
        "topic_id": session["topic_id"],
        "total_questions": total_q,
        "correct_count": correct_count,
        "accuracy": accuracy,
        "total_points_earned": session["total_points_earned"],
        "bonus_points": bonus,
        "encouraging_message": encouragement,
        "newly_unlocked_badges": new_badges,
        "recommendation": readiness["recommendation"],
        "completed_at": datetime.utcnow().isoformat()
    }

    # Save to database and update daily streak
    await db_manager.save_quiz_attempt(summary_doc)
    streak_count = await db_manager.record_student_activity(session["student_id"])
    summary_doc["streak_days"] = streak_count

    return summary_doc


@router.get("/quizzes/{attempt_id}/results")
async def get_quiz_results(attempt_id: str):
    """Retrieve completed quiz attempt details."""
    attempt = await db_manager.get_quiz_attempt(attempt_id)
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt results not found.")
    return attempt


@router.get("/students/{student_id}/dashboard")
async def get_student_dashboard(student_id: str, grade: int = 5):
    """Aggregates all student progress, achievements, points, and recommendations."""
    student = await db_manager.get_or_create_student(student_id, grade)
    progress_list = await db_manager.get_student_progress(student_id)
    achievements = await db_manager.get_student_achievements(student_id)

    total_points = sum(p.get("points", 0) for p in progress_list) + sum(a.get("points_awarded", 0) for a in achievements)
    total_questions = sum(p.get("questions_answered", 0) for p in progress_list)
    total_correct = sum(p.get("correct_count", 0) for p in progress_list)
    overall_accuracy = round(total_correct / total_questions, 2) if total_questions > 0 else 0.0

    return {
        "student": student,
        "grade": grade,
        "total_points": total_points,
        "total_questions_answered": total_questions,
        "overall_accuracy": overall_accuracy,
        "topic_progress": progress_list,
        "achievements": achievements,
        "all_badges": BADGE_DEFINITIONS
    }


@router.get("/students/{student_id}/progress")
async def get_student_progress_endpoint(student_id: str):
    """Returns learning progress by topic for a student."""
    return await db_manager.get_student_progress(student_id)


@router.get("/students/{student_id}/achievements")
async def get_student_achievements_endpoint(student_id: str):
    """Returns all badges and achievements earned by student."""
    return await db_manager.get_student_achievements(student_id)


from app.schemas.api_schemas import BehaviorAnalysisResponse

@router.get("/students/{student_id}/behavior-analysis", response_model=BehaviorAnalysisResponse)
async def get_student_behavior_analysis(student_id: str, grade: int = 5):
    """
    Reinforcement Learning (RL) Adaptive Student Analysis Endpoint.
    1. Compiles behavioral data across curriculum topics.
    2. Identifies Easy (Mastered), Moderate, and Tough (Needs Support) topics.
    3. Employs LLM to formulate encouraging metacognitive coaching feedback.
    """
    from app.learning.student_profiler import rl_profiler
    from app.core.curriculum import get_topics_for_grade

    progress_list = await db_manager.get_student_progress(student_id)
    all_topics = get_topics_for_grade(grade)

    # Compute RL Behavioral Profile
    rl_profile = rl_profiler.generate_student_rl_profile(student_id, progress_list, all_topics)

    # Generate LLM Metacognitive Mentor Coaching
    llm_analysis = await ai_service.generate_student_behavior_analysis(
        student_id=student_id,
        grade=grade,
        rl_profile=rl_profile
    )

    return {
        "status": "success",
        "student_id": student_id,
        "grade": grade,
        "rl_profile": rl_profile,
        "ai_coaching": llm_analysis
    }

