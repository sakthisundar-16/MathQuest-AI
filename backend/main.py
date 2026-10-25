import os
import sys

# Ensure backend directory is in python module search path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import uvicorn
from app.main import app

if __name__ == "__main__":
    port_str = os.getenv("X_ZOHO_CATALYST_LISTEN_PORT") or os.getenv("PORT") or "9000"
    port = int(port_str)
    print(f"[Catalyst] Starting MathQuest AI server on host 0.0.0.0 port {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)
