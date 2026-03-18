// VeilTrader Extended Dashboard JavaScript

// Tab Navigation
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`${tab.dataset.tab}-content`).classList.add('active');
  });
});

// Copy API Key
function copyApiKey() {
  const apiKey = document.getElementById('user-api-key').value;
  navigator.clipboard.writeText(apiKey);
  alert('API Key copied to clipboard!');
}

// Fetch data periodically
async function refreshData() {
  try {
    // Status
    const statusRes = await fetch('/api/status');
    const status = await statusRes.json();
    document.getElementById('timestamp').textContent = new Date().toLocaleTimeString();
    document.getElementById('agent-count').textContent = status.connectedAgents || 0;
    document.getElementById('contract').textContent = status.contract.slice(0, 10) + '...' + status.contract.slice(-6);

    // Agents
    const agentsRes = await fetch('/api/agents');
    const agents = await agentsRes.json();
    updateConnectedList('agents-list', agents, 'agent');
    updateConnectedList('agents-list-full', agents, 'agent');
    document.getElementById('agents-count').textContent = `${agents.length} connected`;

    // Users
    const usersRes = await fetch('/api/users');
    const users = await usersRes.json();
    updateConnectedList('users-list', users, 'user');
    updateConnectedList('users-list-full', users, 'user');
    document.getElementById('users-count').textContent = `${users.length} connected`;

    // Logs
    const logsRes = await fetch('/api/logs');
    const logs = await logsRes.json();
    if (!logs.error) {
      updateLogs(logs);
      document.getElementById('log-count').textContent = `${logs.length} entries`;
    }

    // Portfolio
    const portfolioRes = await fetch('/api/portfolio');
    const portfolio = await portfolioRes.json();
    updatePortfolio(portfolio);

    // Trades
    const tradesRes = await fetch('/api/trades');
    const trades = await tradesRes.json();
    updateTradesTable(trades);

  } catch (e) {
    console.error('Error refreshing data:', e);
  }
}

function updateConnectedList(elementId, items, type) {
  const container = document.getElementById(elementId);
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div class="connected-item">
        <span>No ${type}s connected</span>
      </div>`;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="connected-item">
      <span>${type === 'agent' ? '🤖' : '👤'} ${item.name || item.id}</span>
      <span class="id">${item.id.slice(0, 12)}...</span>
    </div>
  `).join('');
}

function updateLogs(logs) {
  const container = document.getElementById('logs');
  container.innerHTML = logs.map(l => {
    const level = l.level || 'info';
    const msg = l.message || l;
    const time = l.timestamp ? new Date(l.timestamp).toLocaleTimeString() : '';
    return `<div class="log-entry">
      <span class="log-time">${time}</span>
      <span class="log-level ${level}">${level.toUpperCase()}</span>
      <span class="log-message">${msg}</span>
    </div>`;
  }).join('');
}

function updatePortfolio(portfolio) {
  document.getElementById('portfolio-value').textContent = `$${portfolio.totalValue.toFixed(2)}`;
  const assetsDiv = document.getElementById('portfolio-assets');
  assetsDiv.innerHTML = portfolio.assets.map(a => `
    <div class="status-item">
      <span class="status-item-label">${a.symbol}</span>
      <span class="status-item-value">${a.balance} ($${a.value.toFixed(2)})</span>
    </div>
  `).join('');
}

function updateTradesTable(trades) {
  const tbody = document.querySelector('#trades-table tbody');
  if (!tbody) return;

  tbody.innerHTML = trades.slice(-10).reverse().map(t => `
    <tr>
      <td>${new Date(t.timestamp).toLocaleTimeString()}</td>
      <td>${t.action}</td>
      <td>${t.amountIn || '-'}</td>
      <td class="status-${t.status || 'pending'}">${t.status || 'pending'}</td>
    </tr>
  `).join('');
}

// Trade Form
document.getElementById('trade-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const trade = {
    action: document.getElementById('trade-action').value,
    tokenIn: document.getElementById('token-in').value,
    tokenOut: document.getElementById('token-out').value,
    amountIn: parseFloat(document.getElementById('trade-amount').value)
  };

  const res = await fetch('/api/trade/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trade)
  });
  const data = await res.json();
  alert(`Trade submitted: ${data.tradeId}`);
});

// Agent Connect Form
document.getElementById('agent-connect-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const agent = {
    name: document.getElementById('agent-name').value,
    id: document.getElementById('agent-id').value || undefined,
    capabilities: document.getElementById('agent-capabilities').value.split(',').map(s => s.trim())
  };

  const res = await fetch('/api/connect/agent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(agent)
  });
  const data = await res.json();
  alert(`Agent connected: ${data.agentId}`);
});

// User Connect Form
document.getElementById('user-connect-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const user = {
    address: document.getElementById('user-address').value
  };

  const res = await fetch('/api/connect/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  const data = await res.json();
  alert(`User connected: ${data.userId}`);
});

// Agent Command Form
document.getElementById('agent-command-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const command = {
    agentId: document.getElementById('command-agent').value,
    type: document.getElementById('command-type').value,
    payload: document.getElementById('command-payload').value
  };

  const res = await fetch('/api/agent/command', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(command)
  });
  const data = await res.json();
  alert(`Command queued: ${data.commandId}`);
});

// Initial load and periodic refresh
refreshData();
setInterval(refreshData, 5000);

// Generate random API key for demo
document.getElementById('user-api-key').value = 'vt_live_' + Math.random().toString(36).substring(2, 22);
