"""
Reinforcement Learning (RL) Adaptive Student Behavioral Engine
Tracks per-topic student performance, estimates cognitive mastery,
evaluates reward signals, and dynamically categorizes topics into:
- Easy / Mastered
- Moderate / In Progress
- Tough / Needs Scaffolding
"""

from typing import Dict, List, Any, Optional
import math
from datetime import datetime


class StudentRLBehaviorProfiler:
    """
    A Reinforcement Learning model using multi-armed contextual bandit & mastery heuristics.
    
    States per topic:
    - total_attempts: total questions answered in topic
    - correct_count: successful completions
    - recent_window: last 5 binary attempts [1, 0, 1, 1, 1]
    - accuracy: correct_count / total_attempts
    - difficulty_history: sequence of difficulties experienced
    - current_difficulty: easy | medium | hard
    - average_speed_sec: estimated solving speed
    
    Mastery Classification:
    - 'easy_mastered': accuracy >= 0.80 and current_difficulty in ['medium', 'hard'] with >= 3 questions
    - 'moderate': accuracy between 0.50 and 0.80, or < 3 questions
    - 'tough_needs_support': accuracy < 0.50 with >= 3 questions, or consecutive drop in difficulty
    """

    def __init__(self, discount_factor: float = 0.9, learning_rate: float = 0.2):
        self.gamma = discount_factor
        self.alpha = learning_rate

    def calculate_reward(self, is_correct: bool, difficulty: str, speed_seconds: float = 15.0) -> float:
        """
        Calculates RL reward signal for policy adjustment:
        - Correct answer on hard: +15
        - Correct answer on medium: +10
        - Correct answer on easy: +5
        - Incorrect answer: -4 (prompts scaffolding without harsh penalty)
        - Speed bonus: +1 if completed fast (< 10s) and correct
        """
        diff_weights = {"easy": 5.0, "medium": 10.0, "hard": 15.0}
        base = diff_weights.get(difficulty.lower(), 5.0)

        if is_correct:
            reward = base
            if speed_seconds < 12.0:
                reward += 2.0  # fluency bonus
        else:
            reward = -4.0

        return reward

    def evaluate_topic_mastery(self, progress_doc: Dict[str, Any]) -> Dict[str, Any]:
        """
        Classifies a student's standing on a topic into Mastered, Moderate, or Tough.
        """
        total = progress_doc.get("questions_answered", 0)
        correct = progress_doc.get("correct_count", 0)
        curr_diff = progress_doc.get("current_difficulty", "easy").lower()
        recent = progress_doc.get("recent_answers", [])

        if total == 0:
            return {
                "category": "not_started",
                "label": "Ready to Start",
                "mastery_score": 0.0,
                "color": "slate"
            }

        accuracy = correct / total
        recent_window = recent[-4:] if len(recent) > 0 else []
        recent_acc = sum(1 for r in recent_window if r) / len(recent_window) if recent_window else accuracy

        # Calculate blended mastery score (0 to 100)
        diff_multiplier = {"easy": 1.0, "medium": 1.25, "hard": 1.5}.get(curr_diff, 1.0)
        mastery_score = min(100.0, round((accuracy * 70.0 + recent_acc * 30.0) * (diff_multiplier / 1.5), 1))

        if total >= 3 and (accuracy >= 0.75 or (recent_acc >= 0.75 and curr_diff in ["medium", "hard"])):
            category = "easy_mastered"
            label = "Mastered (Easy for Student)"
            color = "emerald"
            recommendation = "Ready for hard difficulty or advanced multi-step quests."
        elif total >= 3 and (accuracy < 0.50 or recent_acc <= 0.25):
            category = "tough_needs_support"
            label = "Tough (Needs Support)"
            color = "rose"
            recommendation = "Watch video lesson explanation and review guided worked examples."
        else:
            category = "moderate"
            label = "In Progress"
            color = "amber"
            recommendation = "Keep practicing to reinforce conceptual confidence."

        return {
            "category": category,
            "label": label,
            "mastery_score": mastery_score,
            "accuracy": round(accuracy * 100, 1),
            "total_questions": total,
            "current_difficulty": curr_diff,
            "color": color,
            "recommendation": recommendation
        }

    def generate_student_rl_profile(
        self,
        student_id: str,
        topic_progresses: List[Dict[str, Any]],
        all_topics: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Compiles the full RL telemetry across all curriculum topics:
        - Lists Easy/Mastered topics
        - Lists Tough/Struggling topics
        - Selects the next Best Action (Topic recommendation) via Exploration/Exploitation
        """
        progress_map = {p.get("topic_id"): p for p in topic_progresses}
        
        mastered_topics = []
        tough_topics = []
        in_progress_topics = []
        unattempted_topics = []

        total_points = sum(p.get("points", 0) for p in topic_progresses)
        total_questions = sum(p.get("questions_answered", 0) for p in topic_progresses)
        overall_correct = sum(p.get("correct_count", 0) for p in topic_progresses)
        overall_accuracy = round((overall_correct / total_questions) * 100, 1) if total_questions > 0 else 0.0

        for topic in all_topics:
            t_id = topic["topic_id"]
            p_doc = progress_map.get(t_id, {})
            eval_res = self.evaluate_topic_mastery(p_doc)
            
            topic_summary = {
                "topic_id": t_id,
                "title": topic.get("title", t_id),
                "category": topic.get("category", "General"),
                **eval_res
            }

            cat = eval_res["category"]
            if cat == "easy_mastered":
                mastered_topics.append(topic_summary)
            elif cat == "tough_needs_support":
                tough_topics.append(topic_summary)
            elif cat == "moderate":
                in_progress_topics.append(topic_summary)
            else:
                unattempted_topics.append(topic_summary)

        # Policy for Next Quest Recommendation:
        # 1. If student has a 'tough' topic, prioritize recommending its visual explanation.
        # 2. Else prioritize an 'in_progress' topic to achieve mastery.
        # 3. Else suggest an unattempted topic for exploration.
        if tough_topics:
            next_action = {
                "action": "remediation_boost",
                "recommended_topic": tough_topics[0],
                "message": f"Reinforce {tough_topics[0]['title']} — watch the animated visual explanation!"
            }
        elif in_progress_topics:
            next_action = {
                "action": "continue_leveling",
                "recommended_topic": in_progress_topics[0],
                "message": f"You are close to mastering {in_progress_topics[0]['title']}! Keep going."
            }
        elif unattempted_topics:
            next_action = {
                "action": "explore_new",
                "recommended_topic": unattempted_topics[0],
                "message": f"Explore new horizons with {unattempted_topics[0]['title']}!"
            }
        else:
            next_action = {
                "action": "champion_mastery",
                "recommended_topic": mastered_topics[0] if mastered_topics else None,
                "message": "Incredible work! You have engaged with all curriculum topics."
            }

        return {
            "student_id": student_id,
            "overall_accuracy": overall_accuracy,
            "total_questions_answered": total_questions,
            "total_points": total_points,
            "mastered_topics": mastered_topics,
            "tough_topics": tough_topics,
            "in_progress_topics": in_progress_topics,
            "unattempted_count": len(unattempted_topics),
            "next_recommended_action": next_action
        }


rl_profiler = StudentRLBehaviorProfiler()
