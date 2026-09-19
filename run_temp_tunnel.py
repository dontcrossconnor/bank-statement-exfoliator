import http.server
import socketserver
import threading
import subprocess
import time
import os
import re
import shutil

BASE_DIR = r'e:\StatementGen'
PUB_DIR = os.path.join(BASE_DIR, 'public_download')
os.makedirs(PUB_DIR, exist_ok=True)

# Copy PDFs
shutil.copyfile(os.path.join(BASE_DIR, 'US_1364_FCU_Statement_July_2026_Aziz_Berjis.pdf'), os.path.join(PUB_DIR, 'US_1364_FCU_Statement_July_2026_Aziz_Berjis.pdf'))
shutil.copyfile(os.path.join(BASE_DIR, 'US_1364_FCU_Statement_August_2026_Aziz_Berjis.pdf'), os.path.join(PUB_DIR, 'US_1364_FCU_Statement_August_2026_Aziz_Berjis.pdf'))

# Create nice mobile-friendly HTML
html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aziz Berjis - Statement Downloads</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
        .card { background: #1e293b; border-radius: 16px; padding: 32px; max-width: 500px; width: 100%; box-shadow: 0 10px 25px rgba(0,0,0,0.5); text-align: center; border: 1px solid #334155; }
        h1 { font-size: 22px; margin-bottom: 8px; color: #38bdf8; }
        p { font-size: 14px; color: #94a3b8; margin-bottom: 24px; line-height: 1.5; }
        .btn-group { display: flex; flex-direction: column; gap: 14px; }
        .btn { display: block; background: #2563eb; color: white; text-decoration: none; padding: 16px 20px; border-radius: 10px; font-weight: 600; font-size: 15px; transition: background 0.2s; box-shadow: 0 4px 12px rgba(37,99,235,0.3); }
        .btn:hover { background: #1d4ed8; }
        .btn-aug { background: #059669; box-shadow: 0 4px 12px rgba(5,150,105,0.3); }
        .btn-aug:hover { background: #047857; }
        .badge { display: inline-block; background: #334155; color: #cbd5e1; font-size: 11px; padding: 4px 10px; border-radius: 20px; margin-bottom: 16px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; }
    </style>
</head>
<body>
    <div class="card">
        <span class="badge">US 1364 Federal Credit Union</span>
        <h1>Aziz Berjis Statements</h1>
        <p>15729 SUTTON ST, ENCINO, CA 91436-3406<br>1:1 ULURO Core Banking Statements</p>
        <div class="btn-group">
            <a class="btn" href="US_1364_FCU_Statement_July_2026_Aziz_Berjis.pdf" download>📥 Download July 2026 Statement (PDF)</a>
            <a class="btn btn-aug" href="US_1364_FCU_Statement_August_2026_Aziz_Berjis.pdf" download>📥 Download August 2026 Statement (PDF)</a>
        </div>
    </div>
</body>
</html>"""

with open(os.path.join(PUB_DIR, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(html)

PORT = 8912

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUB_DIR, **kwargs)

def start_http():
    with socketserver.TCPServer(('0.0.0.0', PORT), Handler) as httpd:
        print(f"Serving HTTP on port {PORT}...")
        httpd.serve_forever()

t = threading.Thread(target=start_http, daemon=True)
t.start()

time.sleep(1)

# Start pinggy tunnel (temporary, anonymous - NOT using persistent alias or token)
cmd = [
    'ssh',
    '-p', '443',
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'ServerAliveInterval=30',
    '-o', 'ServerAliveCountMax=3',
    f'-R0:localhost:{PORT}',
    'a.pinggy.io'
]

print("Launching temporary Pinggy tunnel...")
proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1)

url_file = os.path.join(BASE_DIR, 'temp_tunnel_url.txt')
found_url = None

for line in proc.stdout:
    clean_line = line.strip()
    match = re.search(r'https://[a-zA-Z0-9\-\.]+\.pinggy\.(?:link|net)', clean_line)
    if match:
        url = match.group(0)
        if 'dashboard' not in url:
            found_url = url
            print(f"ACTIVE TEMPORARY URL: {found_url}")
            with open(url_file, 'w') as uf:
                uf.write(found_url)
            # Do not exit; keep running so tunnel stays up!
