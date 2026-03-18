/**
 * VeilTrader Web UI Server
 * Simple HTTP server for viewing agent status and logs
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;
const LOG_DIR = path.join(__dirname, 'logs');

const server = http.createServer((req, res) => {
  const url = req.url;
  
  if (url === '/' || url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(getHomePage());
  } else if (url === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'running',
      contract: process.env.VEILTRADER_CONTRACT || '0x0c7435e863D3a3365FEbe06F34F95f4120f71114',
      network: 'Base Sepolia',
      timestamp: new Date().toISOString()
    }));
  } else if (url === '/api/logs') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    try {
      const logs = fs.readFileSync(path.join(LOG_DIR, 'combined.log'), 'utf8')
        .split('\n')
        .filter(l => l)
        .slice(-50)
        .map(l => {
          try {
            return JSON.parse(l);
          } catch (e) {
            return { message: l };
          }
        });
      res.end(JSON.stringify(logs));
    } catch (e) {
      res.end(JSON.stringify({ error: 'No logs found' }));
    }
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`🌐 VeilTrader Web UI running at http://localhost:${PORT}`);
});

function getHomePage() {
  const contract = process.env.VEILTRADER_CONTRACT || '0x0c7435e863D3a3365FEbe06F34F95f4120f71114';
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VeilTrader - AI Trading Agent</title>
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: #fff;
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            font-size: 2.5em;
            background: linear-gradient(90deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .header p {
            color: #888;
            margin-top: -10px;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
        }
        .status-card {
            background: rgba(255,255,255,0.05);
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 20px;
            border: 1px solid rgba(102, 126, 234, 0.3);
        }
        .status-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 10px 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .status-label { color: #888; }
        .status-value { color: #00d4aa; font-weight: bold; }
        .status-value.running { color: #00ff88; }
        .status-value.paused { color: #ffaa00; }
        .logs-container {
            background: rgba(0,0,0,0.3);
            border-radius: 10px;
            padding: 15px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            max-height: 300px;
            overflow-y: auto;
        }
        .log-entry {
            margin: 5px 0;
            padding: 5px;
            border-radius: 3px;
        }
        .log-info { color: #88ccff; }
        .log-warn { color: #ffaa00; }
        .log-error { color: #ff5555; }
        .log-success { color: #55ff88; }
        .badges {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin: 15px 0;
        }
        .badge {
            background: rgba(102, 126, 234, 0.3);
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
        }
        .badge.bankr { background: rgba(255, 100, 100, 0.3); }
        .badge.gemini { background: rgba(66, 133, 244, 0.3); }
        .badge.deepseek { background: rgba(255, 200, 100, 0.3); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 VeilTrader</h1>
            <p>Privacy-First Autonomous AI Trading Agent on Base</p>
        </div>

        <div class="status-card">
            <h3>📊 Agent Status</h3>
            <div class="status-row">
                <span class="status-label">Status</span>
                <span class="status-value running">● Running</span>
            </div>
            <div class="status-row">
                <span class="status-label">Contract</span>
                <span class="status-value">${contract.slice(0, 10)}...${contract.slice(-8)}</span>
            </div>
            <div class="status-row">
                <span class="status-label">Network</span>
                <span class="status-value">Base Sepolia</span>
            </div>
            <div class="status-row">
                <span class="status-label">Last Update</span>
                <span class="status-value" id="timestamp">Loading...</span>
            </div>
            
            <div class="badges">
                <span class="badge bankr">Bankr (Premium)</span>
                <span class="badge gemini">Gemini (Free)</span>
                <span class="badge deepseek">DeepSeek (Free)</span>
            </div>
        </div>

        <div class="status-card">
            <h3>📜 Recent Activity</h3>
            <div class="logs-container" id="logs">
                <div style="color: #666;">Loading logs...</div>
            </div>
        </div>

        <div class="status-card">
            <h3>🔗 Quick Links</h3>
            <div class="status-row">
                <span class="status-label">Contract on Basescan</span>
                <a href="https://sepolia.basescan.org/address/${contract}" target="_blank" style="color: #667eea;">View →</a>
            </div>
            <div class="status-row">
                <span class="status-label">GitHub Repository</span>
                <a href="https://github.com/veiltrader/veiltrader" target="_blank" style="color: #667eea;">View →</a>
            </div>
            <div class="status-row">
                <span class="status-label">Documentation</span>
                <a href="README.md" target="_blank" style="color: #667eea;">View →</a>
            </div>
        </div>

        <p style="text-align: center; color: #555; margin-top: 30px;">
            © 2026 VeilTrader | Built for The Synthesis Hackathon
        </p>
    </div>

    <script>
        async function refresh() {
            try {
                const res = await fetch('/api/logs');
                const logs = await res.json();
                const container = document.getElementById('logs');
                container.innerHTML = logs.map(l => {
                    const level = l.level || 'info';
                    const msg = l.message || l;
                    return '<div class="log-entry log-' + level + '">' + msg + '</div>';
                }).join('');
                document.getElementById('timestamp').textContent = new Date().toLocaleTimeString();
            } catch (e) {
                console.error('Error loading logs:', e);
            }
        }
        refresh();
        setInterval(refresh, 5000);
    </script>
</body>
</html>
  `;
}
