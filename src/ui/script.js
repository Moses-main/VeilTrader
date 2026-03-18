// VeilTrader UI Script
class VeilTraderUI {
  constructor() {
    this.apiBase = '';
    this.ws = null;
    this.tradeCount = 0;
    this.agents = [];
    this.users = [];
    this.trades = [];
    this.init();
  }

  async init() {
    this.setupTabs();
    this.setupTradeForm();
    this.setupWebSocket();
    await this.loadData();
    this.startPolling();
    this.updateTimestamp();
  }

  setupTabs() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = item.dataset.tab;
        
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(`${tabId}-content`).classList.add('active');
        
        const titles = {
          dashboard: { title: 'Dashboard', subtitle: 'Privacy-first autonomous trading' },
          trade: { title: 'Trade', subtitle: 'Execute swaps on Base' },
          integrations: { title: 'Integrations', subtitle: '15 protocol connections' },
          ai: { title: 'AI Analysis', subtitle: 'Market insights powered by AI' },
          prizes: { title: 'Prize Tracks', subtitle: '~$70,000 targeted' },
          api: { title: 'API', subtitle: 'Connect external services' }
        };
        
        const titles2 = titles[tabId] || titles.dashboard;
        document.getElementById('page-title').textContent = titles2.title;
        document.getElementById('page-subtitle').textContent = titles2.subtitle;
      });
    });
  }

  setupTradeForm() {
    const quickForm = document.getElementById('quick-trade-form');
    if (quickForm) {
      quickForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.executeTrade();
      });
    }

    const fullForm = document.getElementById('trade-form');
    if (fullForm) {
      fullForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.executeTrade(true);
      });
    }
  }

  async executeTrade(full = false) {
    const from = full ? document.getElementById('token-in').value : document.getElementById('trade-from').value;
    const to = full ? document.getElementById('token-out').value : document.getElementById('trade-to').value;
    const amount = full ? document.getElementById('trade-amount-full').value : document.getElementById('trade-amount').value;
    const action = full ? document.getElementById('trade-action').value : (from === 'ETH' || from === 'WETH' ? 'BUY' : 'SELL');

    if (!amount || parseFloat(amount) <= 0) {
      this.showNotification('Please enter a valid amount', 'error');
      return;
    }

    const btn = full ? fullForm?.querySelector('button[type="submit"]') : quickForm?.querySelector('button[type="submit"]');
    if (btn) {
      btn.textContent = 'Executing...';
      btn.disabled = true;
    }

    try {
      const response = await fetch('/api/trade/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          tokenIn: from,
          tokenOut: to,
          amountIn: amount,
          userAddress: '0xe81e8078f2D284C92D6d97B5d4769af81e0cA11C'
        })
      });

      const result = await response.json();

      if (result.status === 'completed') {
        this.tradeCount++;
        this.updateStats();
        this.addActivity(`Trade ${action} ${amount} ${from} → ${to}`, 'success');
        this.showNotification(`Trade executed! TX: ${result.txHash?.slice(0, 10)}...`, 'success');
        this.addTradeToHistory(result, action, from, to, amount);
      } else {
        this.showNotification(result.error || 'Trade failed', 'error');
      }
    } catch (error) {
      this.showNotification('Trade execution failed', 'error');
    }

    if (btn) {
      btn.textContent = 'Execute Trade';
      btn.disabled = false;
    }
  }

  addTradeToHistory(result, action, from, to, amount) {
    const history = document.getElementById('trade-history');
    if (!history) return;

    if (history.querySelector('.empty-state')) {
      history.innerHTML = '';
    }

    const tradeEl = document.createElement('div');
    tradeEl.className = 'trade-item';
    tradeEl.innerHTML = `
      <div class="trade-item-header">
        <span class="trade-action">${action} ${amount} ${from} → ${to}</span>
        <span class="trade-status">Confirmed</span>
      </div>
      <div class="trade-tx">${result.txHash || result.tradeId}</div>
    `;
    history.prepend(tradeEl);
  }

  setupWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    try {
      this.ws = new WebSocket(wsUrl);
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.updateStatus('Connected');
      };
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleWSMessage(data);
      };
      this.ws.onclose = () => {
        this.updateStatus('Disconnected');
        setTimeout(() => this.setupWebSocket(), 5000);
      };
    } catch (error) {
      console.log('WebSocket not available');
    }
  }

  handleWSMessage(data) {
    if (data.type === 'trade') {
      this.addActivity(`Trade executed: ${data.data.action}`, 'trade');
    }
  }

  async loadData() {
    try {
      const [statusRes, tradesRes, agentsRes, usersRes, aiRes] = await Promise.all([
        fetch('/api/status'),
        fetch('/api/trades'),
        fetch('/api/agents'),
        fetch('/api/users'),
        fetch('/api/ai/analysis')
      ]);

      const status = await statusRes.json();
      const trades = await tradesRes.json();
      const agents = await agentsRes.json();
      const users = await usersRes.json();
      const ai = await aiRes.json();

      this.updateStatus('Running');
      this.updateStats(status, trades.length, agents.length, users.length);
      this.updateAI(ai);
      this.updateActivity(trades);

      document.getElementById('contract-short').textContent = 
        (status.contract || '0x0c7435e...').slice(0, 10) + '...';

    } catch (error) {
      console.error('Failed to load data:', error);
      this.updateStatus('Error');
    }
  }

  updateStatus(status) {
    const el = document.getElementById('sidebar-status');
    if (el) el.textContent = status;
  }

  updateStats(status = {}, trades = 0, agents = 1, users = 0) {
    this.tradeCount = trades;
    this.agents = agents;
    this.users = users;

    document.getElementById('stat-trades').textContent = trades;
    document.getElementById('stat-portfolio').textContent = '$12,450';
    document.getElementById('stat-winrate').textContent = '72%';
    document.getElementById('stat-agents').textContent = agents;
    document.getElementById('agents-count').textContent = agents;
    document.getElementById('users-count').textContent = users;
  }

  updateAI(ai) {
    if (!ai) return;

    const actionEl = document.getElementById('ai-action');
    const reasonEl = document.getElementById('ai-reason');
    const confidenceEl = document.getElementById('ai-confidence');
    const ethPriceEl = document.getElementById('eth-price');
    const trendEl = document.getElementById('market-trend');
    const riskEl = document.getElementById('risk-level');

    if (actionEl) actionEl.textContent = ai.action || 'HOLD';
    if (reasonEl) reasonEl.textContent = ai.reason || ai.riskDetails || 'Analyzing...';
    if (confidenceEl) confidenceEl.textContent = ai.confidence ? `${ai.confidence}%` : '—';
    if (ethPriceEl) ethPriceEl.textContent = ai.marketData?.ethPrice ? `$${ai.marketData.ethPrice.toFixed(2)}` : '—';
    if (trendEl) trendEl.textContent = ai.marketData?.trend || '—';
    if (riskEl) riskEl.textContent = ai.risk || '—';

    // Update AI Analysis tab
    const fullAnalysis = document.getElementById('ai-analysis-full');
    if (fullAnalysis && ai) {
      fullAnalysis.innerHTML = `
        <div class="analysis-content">
          <div class="analysis-section">
            <strong>Action:</strong> ${ai.action || 'HOLD'} (${ai.confidence || 0}% confidence)
          </div>
          <div class="analysis-section">
            <strong>Reason:</strong> ${ai.reason || 'Analyzing market conditions'}
          </div>
          <div class="analysis-section">
            <strong>Risk:</strong> ${ai.risk || 'Unknown'}
          </div>
          ${ai.marketData ? `
          <div class="analysis-section">
            <strong>Market Data:</strong><br>
            ETH: $${ai.marketData.ethPrice?.toFixed(2) || '—'}<br>
            Volume 24h: $${(ai.marketData.volume24h / 1000000).toFixed(2)}M<br>
            Volatility: ${ai.marketData.volatility?.toFixed(2) || '—'}<br>
            Trend: ${ai.marketData.trend || '—'}
          </div>
          ` : ''}
        </div>
      `;
    }
  }

  updateActivity(trades) {
    const feed = document.getElementById('activity-feed');
    if (!feed || !trades.length) return;

    feed.innerHTML = trades.slice(-5).reverse().map(trade => `
      <div class="activity-item">
        <div class="activity-icon">💱</div>
        <div class="activity-content">
          <div class="activity-title">${trade.action} ${trade.amountIn} ${trade.tokenIn} → ${trade.tokenOut}</div>
          <div class="activity-time">${new Date(trade.timestamp).toLocaleTimeString()}</div>
        </div>
      </div>
    `).join('');
  }

  addActivity(message, type = 'info') {
    const feed = document.getElementById('activity-feed');
    if (!feed) return;

    const icons = { success: '✅', error: '❌', trade: '💱', info: 'ℹ️' };
    
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.innerHTML = `
      <div class="activity-icon">${icons[type] || icons.info}</div>
      <div class="activity-content">
        <div class="activity-title">${message}</div>
        <div class="activity-time">${new Date().toLocaleTimeString()}</div>
      </div>
    `;
    
    feed.prepend(item);
    
    while (feed.children.length > 10) {
      feed.removeChild(feed.lastChild);
    }
  }

  showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
  }

  startPolling() {
    setInterval(async () => {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        document.getElementById('stat-agents').textContent = data.connectedAgents || 1;
      } catch (e) {}
    }, 30000);
  }

  updateTimestamp() {
    setInterval(() => {
      const el = document.getElementById('timestamp');
      if (el) el.textContent = new Date().toLocaleTimeString();
    }, 1000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.veilTrader = new VeilTraderUI();
});
