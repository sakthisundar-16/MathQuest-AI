"""
Gamification Engine
Handles deterministic points, streak calculations, badge unlocks, and encouraging feedback.
Scores and awards are calculated and verified server-side only.
"""

from typing import Dict, List, Any, Tuple
from datetime import datetime

BADGE_DEFINITIONS = [
    {
        "badge_id": "first-step",
        "title": "First Step Explorer",
        "description": "Answered your very first mathematics question!",
        "icon": "Compass",
        "points_reward": 50
    },
    {
        "badge_id": "fraction-friend",
        "title": "Fraction Friend",
        "description": "Scored 100% on a Fractions practice session!",
        "icon": "PieChart",
        "points_reward": 100
    },
    {
        "badge_id": "perseverance-star",
        "title": "Perseverance Star",
        "description": "Completed a practice session and learned from mistakes!",
        "icon": "Sparkles",
        "points_reward": 75
    },
    {
        "badge_id": "math-wizard",
        "title": "Math Wizard",
        "description": "Accumulated over 300 MathQuest adventure points!",
        "icon": "Award",
        "points_reward": 150
    },
    {
        "badge_id": "streak-master",
        "title": "3-Question Streak",
        "description": "Answered 3 questions correctly in a row!",
        "icon": "Flame",
        "points_reward": 60
    }
]


class GamificationEngine:
    # Points by difficulty
    POINTS_MAP = {
        "easy": 10,
        "medium": 20,
        "hard": 30
    }

    @classmethod
    def calculate_question_points(cls, is_correct: bool, difficulty: str) -> int:
        """Deterministic point reward for an individual question answer."""
        if not is_correct:
            return 0
        diff = difficulty.lower()
        return cls.POINTS_MAP.get(diff, 10)

    @classmethod
    def evaluate_quiz_completion_rewards(
        cls,
        total_questions: int,
        correct_count: int,
        topic_id: str,
        current_total_points: int,
        existing_badges: List[str]
    ) -> Tuple[int, List[Dict[str, Any]], str]:
        """
        Calculates completion bonus, evaluates newly unlocked badges,
        and generates an encouraging message.
        """
        accuracy = (correct_count / total_questions) if total_questions > 0 else 0.0
        bonus_points = 0
        new_badges: List[Dict[str, Any]] = []

        # Completion bonus
        if accuracy == 1.0:
            bonus_points = 50
        elif accuracy >= 0.7:
            bonus_points = 25
        else:
            bonus_points = 10

        new_total_points = current_total_points + bonus_points

        # Badge checks
        if "first-step" not in existing_badges and total_questions > 0:
            b = next(b for b in BADGE_DEFINITIONS if b["badge_id"] == "first-step")
            new_badges.append(b)

        if "fraction-friend" not in existing_badges and "fraction" in topic_id.lower() and accuracy == 1.0:
            b = next(b for b in BADGE_DEFINITIONS if b["badge_id"] == "fraction-friend")
            new_badges.append(b)

        if "perseverance-star" not in existing_badges and total_questions >= 3 and correct_count < total_questions:
            b = next(b for b in BADGE_DEFINITIONS if b["badge_id"] == "perseverance-star")
            new_badges.append(b)

        if "math-wizard" not in existing_badges and new_total_points >= 300:
            b = next(b for b in BADGE_DEFINITIONS if b["badge_id"] == "math-wizard")
            new_badges.append(b)

        # Encouraging tone
        if accuracy == 1.0:
            encouragement = "Incredible job! Perfect score on this practice session. You are truly mastering this concept!"
        elif accuracy >= 0.7:
            encouragement = "Awesome effort! You solved most questions correctly. A quick review of any mistakes and you'll be unstoppable!"
        elif accuracy >= 0.4:
            encouragement = "Great persistence! Making mistakes is how our brains grow stronger. Check out the step-by-step explanations!"
        else:
            encouragement = "Thank you for practicing today! Every try makes you better. Let's look at the worked examples together."

        return bonus_points, new_badges, encouragement
