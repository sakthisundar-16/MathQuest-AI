import pytest
from app.learning.student_profiler import StudentRLBehaviorProfiler, rl_profiler

def test_rl_reward_calculation():
    profiler = StudentRLBehaviorProfiler()
    # Correct hard answer with fast response (<12s)
    r1 = profiler.calculate_reward(is_correct=True, difficulty="hard", speed_seconds=8.0)
    assert r1 == 17.0  # 15 base + 2 bonus

    # Correct easy answer
    r2 = profiler.calculate_reward(is_correct=True, difficulty="easy", speed_seconds=15.0)
    assert r2 == 5.0

    # Incorrect answer
    r3 = profiler.calculate_reward(is_correct=False, difficulty="medium", speed_seconds=10.0)
    assert r3 == -4.0

def test_evaluate_topic_mastery_mastered():
    profiler = StudentRLBehaviorProfiler()
    progress = {
        "topic_id": "g5-fractions",
        "questions_answered": 5,
        "correct_count": 5,
        "current_difficulty": "hard",
        "recent_answers": [True, True, True, True, True]
    }
    result = profiler.evaluate_topic_mastery(progress)
    assert result["category"] == "easy_mastered"
    assert result["mastery_score"] >= 80.0
    assert result["color"] == "emerald"

def test_evaluate_topic_mastery_tough():
    profiler = StudentRLBehaviorProfiler()
    progress = {
        "topic_id": "g5-decimals",
        "questions_answered": 4,
        "correct_count": 1,
        "current_difficulty": "easy",
        "recent_answers": [False, False, True, False]
    }
    result = profiler.evaluate_topic_mastery(progress)
    assert result["category"] == "tough_needs_support"
    assert result["color"] == "rose"
    assert "video lesson" in result["recommendation"].lower()

def test_full_rl_profile_and_next_action():
    profiler = StudentRLBehaviorProfiler()
    topics = [
        {"topic_id": "g5-fractions", "title": "Fractions"},
        {"topic_id": "g5-decimals", "title": "Decimals"},
        {"topic_id": "g5-geometry", "title": "Geometry"}
    ]
    progresses = [
        {
            "topic_id": "g5-fractions",
            "questions_answered": 4,
            "correct_count": 4,
            "current_difficulty": "medium",
            "recent_answers": [True, True, True, True],
            "points": 50
        },
        {
            "topic_id": "g5-decimals",
            "questions_answered": 4,
            "correct_count": 1,
            "current_difficulty": "easy",
            "recent_answers": [False, False, False, True],
            "points": 10
        }
    ]

    profile = profiler.generate_student_rl_profile("test_student", progresses, topics)
    assert len(profile["mastered_topics"]) == 1
    assert profile["mastered_topics"][0]["topic_id"] == "g5-fractions"
    assert len(profile["tough_topics"]) == 1
    assert profile["tough_topics"][0]["topic_id"] == "g5-decimals"

    # Action policy should prioritize remediation for the tough topic
    assert profile["next_recommended_action"]["action"] == "remediation_boost"
    assert profile["next_recommended_action"]["recommended_topic"]["topic_id"] == "g5-decimals"
