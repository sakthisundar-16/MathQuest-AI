"""
MongoDB & In-Memory Persistence Bridge
Provides transparent persistence with MongoDB Atlas when MONGODB_URI is provided,
with full in-memory persistent storage fallback for instant local dev & resilient offline operation.
"""

from typing import Dict, List, Any, Optional
import os
import uuid
from datetime import datetime

class DatabaseManager:
    def __init__(self):
        self.is_connected = False
        self.client = None
        self.db = None
        self.uri = os.getenv("MONGODB_URI", "")
        
        # In-memory storage collections
        self.memory_students: Dict[str, Dict[str, Any]] = {}
        self.memory_quiz_attempts: Dict[str, Dict[str, Any]] = {}
        self.memory_learning_progress: Dict[str, Dict[str, Any]] = {}
        self.memory_achievements: Dict[str, List[Dict[str, Any]]] = {}
        self.memory_infographics_cache: Dict[str, Dict[str, Any]] = {}

    async def connect(self):
        """Attempts connection to MongoDB if URI is configured."""
        from app.core.config import settings
        self.uri = settings.MONGODB_URI or os.getenv("MONGODB_URI", "")
        if not self.uri:
            print("[DB] No MONGODB_URI configured. Running in high-reliability in-memory storage mode.")
            self.is_connected = False
            return

        try:
            from motor.motor_asyncio import AsyncIOMotorClient
            self.client = AsyncIOMotorClient(self.uri, serverSelectionTimeoutMS=2500)
            # Ping database to verify connection
            await self.client.admin.command('ping')
            db_name = settings.DATABASE_NAME or os.getenv("DATABASE_NAME", "mathquest_db")
            self.db = self.client[db_name]
            self.is_connected = True
            print(f"[DB] Successfully connected to MongoDB database ({self.uri}): {db_name}")
        except Exception as e:
            print(f"[DB] MongoDB connection error ({e}). Gracefully falling back to in-memory store.")
            self.is_connected = False

    async def get_or_create_student(self, student_id: Optional[str] = None, grade: int = 5) -> Dict[str, Any]:
        """Retrieves or creates a student session."""
        if not student_id:
            student_id = f"student_{uuid.uuid4().hex[:8]}"

        if self.is_connected and self.db is not None:
            existing = await self.db.students.find_one({"student_id": student_id})
            if existing:
                existing.pop("_id", None)
                return existing
            doc = {
                "student_id": student_id,
                "grade": grade,
                "display_name": f"Adventurer {student_id[-4:]}",
                "streak_days": 1,
                "last_active_date": datetime.utcnow().strftime("%Y-%m-%d"),
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
            await self.db.students.insert_one(doc.copy())
            return doc
        else:
            if student_id in self.memory_students:
                return self.memory_students[student_id]
            doc = {
                "student_id": student_id,
                "grade": grade,
                "display_name": f"Adventurer {student_id[-4:]}",
                "streak_days": 1,
                "last_active_date": datetime.utcnow().strftime("%Y-%m-%d"),
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
            self.memory_students[student_id] = doc
            return doc

    async def record_student_activity(self, student_id: str) -> int:
        """Updates and increments daily streak according to activity date."""
        today = datetime.utcnow().strftime("%Y-%m-%d")
        student = await self.get_or_create_student(student_id)
        last_date = student.get("last_active_date", "")
        current_streak = student.get("streak_days", 1)

        if last_date != today:
            # Check if active yesterday
            from datetime import timedelta
            yesterday = (datetime.utcnow() - timedelta(days=1)).strftime("%Y-%m-%d")
            if last_date == yesterday:
                current_streak += 1
            else:
                current_streak = 1
            
            update_data = {
                "streak_days": current_streak,
                "last_active_date": today,
                "updated_at": datetime.utcnow().isoformat()
            }
            if self.is_connected and self.db is not None:
                await self.db.students.update_one({"student_id": student_id}, {"$set": update_data})
            else:
                self.memory_students[student_id].update(update_data)

        return current_streak

    async def save_quiz_attempt(self, attempt_data: Dict[str, Any]) -> None:
        """Persists a completed quiz attempt."""
        attempt_id = attempt_data.get("attempt_id")
        if self.is_connected and self.db is not None:
            await self.db.quiz_attempts.replace_one(
                {"attempt_id": attempt_id},
                attempt_data,
                upsert=True
            )
        else:
            self.memory_quiz_attempts[attempt_id] = attempt_data

    async def get_quiz_attempt(self, attempt_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves quiz attempt details."""
        if self.is_connected and self.db is not None:
            doc = await self.db.quiz_attempts.find_one({"attempt_id": attempt_id})
            if doc:
                doc.pop("_id", None)
            return doc
        return self.memory_quiz_attempts.get(attempt_id)

    async def update_learning_progress(
        self,
        student_id: str,
        topic_id: str,
        is_correct: bool,
        points_earned: int,
        new_difficulty: str
    ) -> Dict[str, Any]:
        """Updates rolling progress records for a student on a specific topic."""
        key = f"{student_id}:{topic_id}"
        
        # Retrieve existing progress record
        progress = None
        if self.is_connected and self.db is not None:
            progress = await self.db.learning_progress.find_one({"student_id": student_id, "topic_id": topic_id})
            if progress:
                progress.pop("_id", None)
        else:
            progress = self.memory_learning_progress.get(key)

        if not progress:
            progress = {
                "student_id": student_id,
                "topic_id": topic_id,
                "recent_answers": [],
                "current_difficulty": "easy",
                "questions_answered": 0,
                "correct_count": 0,
                "accuracy": 0.0,
                "points": 0,
                "updated_at": datetime.utcnow().isoformat()
            }

        recent_answers = progress.get("recent_answers", [])
        recent_answers.append(is_correct)
        if len(recent_answers) > 10:
            recent_answers.pop(0)

        questions_answered = progress.get("questions_answered", 0) + 1
        correct_count = progress.get("correct_count", 0) + (1 if is_correct else 0)
        accuracy = round(correct_count / questions_answered, 3)
        total_points = progress.get("points", 0) + points_earned

        progress["recent_answers"] = recent_answers
        progress["current_difficulty"] = new_difficulty
        progress["questions_answered"] = questions_answered
        progress["correct_count"] = correct_count
        progress["accuracy"] = accuracy
        progress["points"] = total_points
        progress["updated_at"] = datetime.utcnow().isoformat()

        if self.is_connected and self.db is not None:
            await self.db.learning_progress.replace_one(
                {"student_id": student_id, "topic_id": topic_id},
                progress,
                upsert=True
            )
        else:
            self.memory_learning_progress[key] = progress

        return progress

    async def get_student_progress(self, student_id: str) -> List[Dict[str, Any]]:
        """Returns all topic progress entries for a student."""
        if self.is_connected and self.db is not None:
            cursor = self.db.learning_progress.find({"student_id": student_id})
            results = []
            async for doc in cursor:
                doc.pop("_id", None)
                results.append(doc)
            return results
        
        return [
            v for k, v in self.memory_learning_progress.items()
            if v.get("student_id") == student_id
        ]

    async def award_achievement(self, student_id: str, badge: Dict[str, Any]) -> None:
        """Stores a newly unlocked badge for a student."""
        doc = {
            "achievement_id": f"ach_{uuid.uuid4().hex[:8]}",
            "student_id": student_id,
            "badge_id": badge["badge_id"],
            "title": badge["title"],
            "description": badge["description"],
            "icon": badge.get("icon", "Award"),
            "points_awarded": badge.get("points_reward", 50),
            "awarded_at": datetime.utcnow().isoformat()
        }

        if self.is_connected and self.db is not None:
            await self.db.achievements.insert_one(doc.copy())
        else:
            if student_id not in self.memory_achievements:
                self.memory_achievements[student_id] = []
            self.memory_achievements[student_id].append(doc)

    async def get_student_achievements(self, student_id: str) -> List[Dict[str, Any]]:
        """Returns all badges earned by a student."""
        if self.is_connected and self.db is not None:
            cursor = self.db.achievements.find({"student_id": student_id})
            results = []
            async for doc in cursor:
                doc.pop("_id", None)
                results.append(doc)
            return results

        return self.memory_achievements.get(student_id, [])

    async def cache_infographic(self, topic_id: str, data: Dict[str, Any]) -> None:
        """Cache generated infographic to prevent wasteful regeneration."""
        if self.is_connected and self.db is not None:
            await self.db.infographics.replace_one({"topic_id": topic_id}, data, upsert=True)
        else:
            self.memory_infographics_cache[topic_id] = data

    async def get_cached_infographic(self, topic_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve cached infographic if available."""
        if self.is_connected and self.db is not None:
            doc = await self.db.infographics.find_one({"topic_id": topic_id})
            if doc:
                doc.pop("_id", None)
            return doc
        return self.memory_infographics_cache.get(topic_id)


db_manager = DatabaseManager()
