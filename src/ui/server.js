/**
 * VeilTrader Extended Web UI Server
 * Features for users and agents to connect and trade
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// In-memory store for connected agents and users
const connectedAgents = new Map();
const connectedUsers = new Map();
const tradeHistory = [];

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Serve static files
  if (url === '/' || url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(fs.readFileSync(path.join(process.cwd(), 'src/ui/index.html'), 'utf8'));
    return;
  }

  if (url === '/style.css') {
    res.writeHead(200, { 'Content-Type': 'text/css' });
    res.end(fs.readFileSync(path.join(process.cwd(), 'src/ui/style.css'), 'utf8'));
    return;
  }

  if (url === '/script.js') {
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end(fs.readFileSync(path.join(process.cwd(), 'src/ui/script.js'), 'utf8'));
    return;
  }

  // API Endpoints
  if (url.startsWith('/api/')) {
    handleAPI(req, res, url, method);
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

function handleAPI(req, res, url, method) {
  const body = [];

  req.on('data', chunk => body.push(chunk));
  req.on('end', () => {
    const data = body.length ? JSON.parse(Buffer.concat(body).toString()) : {};

    // GET endpoints
    if (method === 'GET') {
      if (url === '/api/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'running',
          contract: process.env.VEILTRADER_CONTRACT || '0x0c7435e863D3a3365FEbe06F34F95f4120f71114',
          network: 'Base Sepolia',
          timestamp: new Date().toISOString(),
          connectedAgents: connectedAgents.size,
          connectedUsers: connectedUsers.size
        }));
        return;
      }

      if (url === '/api/logs') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        try {
          const logsPath = path.join(process.cwd(), 'logs', 'combined.log');
          const logs = fs.readFileSync(logsPath, 'utf8')
            .split('\n')
            .filter(l => l)
            .slice(-30)
            .map(l => {
              try { return JSON.parse(l); } catch(e) { return { message: l }; }
            });
          res.end(JSON.stringify(logs));
        } catch (e) {
          res.end(JSON.stringify({ error: e.message }));
        }
        return;
      }

      if (url === '/api/agents') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify([...connectedAgents.entries()].map(([id, agent]) => ({
          id, 
          name: agent.name, 
          connectedAt: agent.connectedAt,
          lastSeen: agent.lastSeen
        }))));
        return;
      }

      if (url === '/api/users') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify([...connectedUsers.entries()].map(([id, user]) => ({
          id,
          address: user.address,
          connectedAt: user.connectedAt,
          trades: user.trades || 0
        }))));
        return;
      }

      if (url === '/api/trades') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tradeHistory.slice(-50)));
        return;
      }

      if (url === '/api/portfolio') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          totalValue: 974.86,
          assets: [
            { symbol: 'ETH', balance: 0.2, value: 600 },
            { symbol: 'WETH', balance: 0.12, value: 374.86 }
          ]
        }));
        return;
      }
    }

    // POST endpoints
    if (method === 'POST') {
      if (url === '/api/connect/agent') {
        const agentId = data.id || `agent-${Date.now()}`;
        connectedAgents.set(agentId, {
          id: agentId,
          name: data.name || 'Unknown Agent',
          connectedAt: new Date().toISOString(),
          lastSeen: new Date().toISOString(),
          capabilities: data.capabilities || []
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ agentId, status: 'connected' }));
        return;
      }

      if (url === '/api/connect/user') {
        const userId = data.address || `user-${Date.now()}`;
        connectedUsers.set(userId, {
          id: userId,
          address: data.address,
          connectedAt: new Date().toISOString(),
          lastSeen: new Date().toISOString(),
          trades: 0
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ userId, status: 'connected' }));
        return;
      }

      if (url === '/api/trade/execute') {
        const trade = {
          id: `trade-${Date.now()}`,
          user: data.user || 'anonymous',
          action: data.action,
          tokenIn: data.tokenIn,
          tokenOut: data.tokenOut,
          amountIn: data.amountIn,
          amountOut: data.amountOut,
          timestamp: new Date().toISOString(),
          status: 'pending'
        };
        tradeHistory.push(trade);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ tradeId: trade.id, status: 'submitted' }));
        return;
      }

      if (url === '/api/agent/command') {
        const command = {
          id: `cmd-${Date.now()}`,
          agent: data.agentId,
          type: data.type,
          payload: data.payload,
          timestamp: new Date().toISOString(),
          status: 'queued'
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ commandId: command.id, status: 'queued' }));
        return;
      }
    }

    // PUT endpoints (update)
    if (method === 'PUT') {
      if (url.startsWith('/api/agents/')) {
        const agentId = url.split('/')[3];
        if (connectedAgents.has(agentId)) {
          const agent = connectedAgents.get(agentId);
          agent.lastSeen = new Date().toISOString();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'updated' }));
          return;
        }
      }

      if (url.startsWith('/api/users/')) {
        const userId = url.split('/')[3];
        if (connectedUsers.has(userId)) {
          const user = connectedUsers.get(userId);
          user.lastSeen = new Date().toISOString();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'updated' }));
          return;
        }
      }
    }

    // DELETE endpoints
    if (method === 'DELETE') {
      if (url.startsWith('/api/agents/')) {
        const agentId = url.split('/')[3];
        connectedAgents.delete(agentId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'disconnected' }));
        return;
      }

      if (url.startsWith('/api/users/')) {
        const userId = url.split('/')[3];
        connectedUsers.delete(userId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'disconnected' }));
        return;
      }
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  });
}

server.listen(PORT, () => {
  console.log(`🌐 VeilTrader Dashboard: http://localhost:${PORT}`);
  console.log(`🔗 API available at: http://localhost:${PORT}/api/`);
});
