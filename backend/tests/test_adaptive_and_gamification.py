import pytest
from app.learning.adaptive_engine import AdaptiveEngine
from app.learning.gamification_engine import GamificationEngine


def test_adaptive_initial_state():
    engine = AdaptiveEngine()
    result = engine.calculate_next_difficulty("easy", [True])
    assert result["next_difficulty"] == "easy"
    assert result["needs_support"] is False


def test_adaptive_difficulty_increase():
    engine = AdaptiveEngine()
    # 3 correct in a row -> level up
    result = engine.calculate_next_difficulty("easy", [True, True, True])
    assert result["next_difficulty"] == "medium"
    assert result["recommended_action"] == "level_up_challenge"

    # From medium -> hard
    result = engine.calculate_next_difficulty("medium", [True, True, True])
    assert result["next_difficulty"] == "hard"


def test_adaptive_difficulty_decrease():
    engine = AdaptiveEngine()
    # 0 or 1 correct out of 3 -> step down
    result = engine.calculate_next_difficulty("medium", [False, False, True])
    assert result["next_difficulty"] == "easy"
    assert result["needs_support"] is True
    assert result["recommended_action"] == "review_worked_example"


def test_adaptive_difficulty_maintain():
    engine = AdaptiveEngine()
    # 2 correct out of 3 -> maintain
    result = engine.calculate_next_difficulty("medium", [True, False, True])
    assert result["next_difficulty"] == "medium"
    assert result["recommended_action"] == "continue_practice"


def test_gamification_points_and_badges():
    # Easy correct: 10 points
    assert GamificationEngine.calculate_question_points(True, "easy") == 10
    # Hard correct: 30 points
    assert GamificationEngine.calculate_question_points(True, "hard") == 30
    # Incorrect: 0 points
    assert GamificationEngine.calculate_question_points(False, "hard") == 0

    # Completion evaluation
    bonus, new_badges, encouragement = GamificationEngine.evaluate_quiz_completion_rewards(
        total_questions=3,
        correct_count=3,
        topic_id="g5-fractions",
        current_total_points=50,
        existing_badges=[]
    )
    assert bonus == 50  # Perfect score bonus
    badge_ids = [b["badge_id"] for b in new_badges]
    assert "first-step" in badge_ids
    assert "fraction-friend" in badge_ids
