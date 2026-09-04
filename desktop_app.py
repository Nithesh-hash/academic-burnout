import sys
import os
import time
import threading
import webbrowser
import uvicorn

# Set up paths for both normal python run and PyInstaller bundle
if getattr(sys, "frozen", False):
    base_dir = getattr(sys, "_MEIPASS", os.path.dirname(sys.executable))
else:
    base_dir = os.path.dirname(os.path.abspath(__file__))

backend_dir = os.path.join(base_dir, "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
if base_dir not in sys.path:
    sys.path.insert(0, base_dir)

from app.main import app

def launch_browser():
    time.sleep(1.5)
    url = "http://127.0.0.1:8000"
    print("\n" + "=" * 65)
    print("  ★ Adaptive AI Academic Risk & Burnout Monitoring System ★")
    print(f"  Web application launched at: {url}")
    print("  Opening browser automatically...")
    print("  (Keep this window open while using the application)")
    print("=" * 65 + "\n")
    try:
        webbrowser.open(url)
    except Exception as e:
        print(f"Could not automatically open browser: {e}")

if __name__ == "__main__":
    # Start auto-open browser thread
    threading.Thread(target=launch_browser, daemon=True).start()
    
    # Run uvicorn server on localhost
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
