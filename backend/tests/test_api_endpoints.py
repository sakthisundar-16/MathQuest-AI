import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.anyio
async def test_health_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "curriculum" in data


@pytest.mark.anyio
async def test_topics_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/topics?grade=5")
        assert response.status_code == 200
        topics = response.json()
        assert len(topics) >= 3
        assert any(t["topic_id"] == "g5-fractions" for t in topics)


@pytest.mark.anyio
async def test_start_quiz_and_answer_workflow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Start a quiz
        start_payload = {
            "student_id": "test_student_unit",
            "topic_id": "g5-fractions",
            "grade": 5,
            "num_questions": 3
        }
        res_start = await ac.post("/api/quizzes/start", json=start_payload)
        assert res_start.status_code == 200
        quiz_data = res_start.json()
        attempt_id = quiz_data["attempt_id"]
        q = quiz_data["current_question"]
        q_id = q["question_id"]
        
        # Verify correct answer is NOT leaked to student
        assert "correct_answer" not in q

        # Submit an answer choice
        ans_payload = {
            "student_id": "test_student_unit",
            "question_id": q_id,
            "selected_option_id": "B"
        }
        res_ans = await ac.post(f"/api/quizzes/{attempt_id}/answer", json=ans_payload)
        assert res_ans.status_code == 200
        ans_data = res_ans.json()
        assert "is_correct" in ans_data
        assert "points_awarded" in ans_data
        assert "next_difficulty" in ans_data

        # Test duplicate submission idempotency (returns cached evaluation cleanly instead of crashing UI)
        res_dup = await ac.post(f"/api/quizzes/{attempt_id}/answer", json=ans_payload)
        assert res_dup.status_code == 200
        assert res_dup.json()["points_awarded"] == ans_data["points_awarded"]
