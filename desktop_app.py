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
import socket

def find_free_port(start_port=8000):
    for port in range(start_port, start_port + 100):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(('127.0.0.1', port))
                return port
            except OSError:
                continue
    return start_port

def launch_browser(port):
    time.sleep(1.5)
    url = f"http://127.0.0.1:{port}"
    print("\n" + "=" * 65)
    print("  * Adaptive AI Academic Risk & Burnout Monitoring System *")
    print(f"  Web application active at: {url}")
    print("  Opening browser automatically...")
    print("  (Keep this window open while using the application)")
    print("=" * 65 + "\n")
    try:
        webbrowser.open(url)
    except Exception as e:
        print(f"Could not automatically open browser: {e}")

if __name__ == "__main__":
    port = find_free_port(8000)
    # Start auto-open browser thread
    threading.Thread(target=launch_browser, args=(port,), daemon=True).start()
    
    # Run uvicorn server on dynamic port
    uvicorn.run(app, host="127.0.0.1", port=port, log_level="info")

