import os
from dotenv import load_dotenv

# Load .env file automatically
load_dotenv()

class Settings:
    PROJECT_NAME: str = "MathQuest AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    GEMINI_IMAGE_MODEL: str = os.getenv("GEMINI_IMAGE_MODEL", "imagen-3.0-generate-002")
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "mathquest_db")
    PORT: int = int(os.getenv("PORT", 8000))
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://mathquest-ai.vercel.app",
        "https://mathquest-ai.onslate.in",
        "https://mathquest-backend-50047156997.development.catalystappsail.in",
    ]

settings = Settings()
