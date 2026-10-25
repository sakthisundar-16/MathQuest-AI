import os
import sys
import traceback

# Ensure both backend root and bundled Linux lib directory are in sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
lib_dir = os.path.join(backend_dir, "lib")
if os.path.exists(lib_dir):
    sys.path.insert(0, lib_dir)
sys.path.insert(0, backend_dir)

port_str = os.getenv("X_ZOHO_CATALYST_LISTEN_PORT") or os.getenv("PORT") or "9000"
port = int(port_str)
print(f"[Catalyst] Starting MathQuest backend on port {port}...", flush=True)

try:
    from app.main import app
    import uvicorn
    print(f"[Catalyst] App imported successfully. Launching Uvicorn on 0.0.0.0:{port}...", flush=True)
    uvicorn.run(app, host="0.0.0.0", port=port)
except Exception as e:
    print(f"[Catalyst Startup Error]: {e}", flush=True)
    traceback.print_exc()
    from http.server import HTTPServer, BaseHTTPRequestHandler
    class FallbackHandler(BaseHTTPRequestHandler):
        def do_GET(self):
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(f'{{"error": "{str(e)}"}}\n'.encode())
    server = HTTPServer(("0.0.0.0", port), FallbackHandler)
    server.serve_forever()
