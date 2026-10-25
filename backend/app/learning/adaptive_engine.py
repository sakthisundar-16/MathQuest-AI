"""
Adaptive Learning Engine
Maintains student mastery profiles, calculates rolling difficulty adjustments,
and isolates topic-level mastery to recommend personalized next steps.
"""

from typing import Dict, List, Any, Optional

DIFFICULTY_LEVELS = ["easy", "medium", "hard"]


class AdaptiveEngine:
    def __init__(self, rolling_window_size: int = 3):
        self.window_size = rolling_window_size

    def calculate_next_difficulty(
        self,
        current_difficulty: str,
        recent_answers: List[bool]
    ) -> Dict[str, Any]:
        """
        Calculates the next recommended difficulty based on a rolling window of recent answers.
        
        Engineering Policy:
        - 0 or 1 correct out of last 3: lower difficulty (if not already easy) & recommend worked example.
        - 2 correct out of last 3: maintain current difficulty.
        - 3 correct out of last 3: increase difficulty (if not already hard).
        - If fewer than 2 data points, keep current difficulty.
        """
        curr = current_difficulty.lower()
        if curr not in DIFFICULTY_LEVELS:
            curr = "easy"

        curr_idx = DIFFICULTY_LEVELS.index(curr)

        # Look at the most recent answers up to window_size
        window = recent_answers[-self.window_size:] if len(recent_answers) > 0 else []
        total_in_window = len(window)

        if total_in_window < 2:
            return {
                "next_difficulty": curr,
                "reason": "Gathering initial student responses",
                "recommended_action": "continue_practice",
                "accuracy_in_window": sum(window) / total_in_window if total_in_window > 0 else 1.0,
                "needs_support": False
            }

        correct_count = sum(1 for ans in window if ans is True)
        accuracy = correct_count / total_in_window

        if correct_count <= 1 and total_in_window >= 2:
            next_idx = max(0, curr_idx - 1)
            next_diff = DIFFICULTY_LEVELS[next_idx]
            needs_support = True
            reason = (
                f"Student scored {correct_count}/{total_in_window} in recent questions. "
                "Stepping down difficulty and recommending a worked example."
            )
            action = "review_worked_example" if next_idx < curr_idx else "encourage_guided_practice"

        elif correct_count == total_in_window:
            next_idx = min(len(DIFFICULTY_LEVELS) - 1, curr_idx + 1)
            next_diff = DIFFICULTY_LEVELS[next_idx]
            needs_support = False
            if next_idx > curr_idx:
                reason = (
                    f"Excellent streak ({correct_count}/{total_in_window})! "
                    "Leveling up to more challenging questions."
                )
                action = "level_up_challenge"
            else:
                reason = "Consistent mastery at highest difficulty tier! Keep reinforcing."
                action = "maintain_challenge"

        else:
            next_diff = curr
            needs_support = False
            reason = (
                f"Solid progress with {correct_count}/{total_in_window} correct. "
                "Maintaining current difficulty to build steady mastery."
            )
            action = "continue_practice"

        return {
            "next_difficulty": next_diff,
            "reason": reason,
            "recommended_action": action,
            "accuracy_in_window": accuracy,
            "needs_support": needs_support
        }

    def evaluate_topic_readiness(
        self,
        questions_answered: int,
        accuracy: float,
        current_difficulty: str
    ) -> Dict[str, Any]:
        """
        Assesses overall topic mastery readiness.
        """
        if questions_answered == 0:
            status = "not_started"
            recommendation = "Begin lesson walkthrough and initial practice."
        elif questions_answered < 3:
            status = "in_progress"
            recommendation = "Complete more questions to calibrate topic mastery."
        elif accuracy >= 0.8 and current_difficulty in ["medium", "hard"]:
            status = "mastered"
            recommendation = "Topic mastered! Ready for advanced challenges or the next topic."
        elif accuracy >= 0.5:
            status = "developing"
            recommendation = "Good foundational progress. Practice additional medium difficulty questions."
        else:
            status = "needs_reinforcement"
            recommendation = "Potential learning gap detected. Review visual explanation and worked examples."

        return {
            "status": status,
            "recommendation": recommendation,
            "mastery_score": round(accuracy * 100, 1)
        }
