/**
 * VeilTrader Extended Web UI Server
 */

require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const tradeExecutor = require('./trade-executor');
const portfolioTracker = require('./portfolio-tracker');
const priceFeed = require('./price-feed');
const aiAnalyzer = require('./ai-analyzer');
const integrations = require('../integrations');

const PORT = process.env.PORT || 3000;

// Initialize modules (async)
async function initializeModules() {
  await tradeExecutor.initialize();
  await portfolioTracker.initialize();
  await priceFeed.initialize();
  await aiAnalyzer.initialize();
  await integrations.initializeAll();
  console.log('✅ All modules initialized');
}

// In-memory stores
const connectedAgents = new Map();
const connectedUsers = new Map();
const tradeHistory = [];

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' ws: wss: https://sepolia.base.org; img-src 'self' data: https:;");
  
  // CORS headers
  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000', 'https://veiltrader.vercel.app'];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Static files
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

  // API routes
  if (url.startsWith('/api/')) {
    handleAPI(req, res, url, method);
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

async function handleAPI(req, res, url, method) {
  const body = [];

  req.on('data', chunk => body.push(chunk));
  
  await new Promise((resolve) => {
    req.on('end', () => resolve());
  });
  
  const data = body.length ? JSON.parse(Buffer.concat(body).toString()) : {};

  if (method === 'GET') {
      if (url === '/api/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'running',
          contract: process.env.VEILTRADER_CONTRACT || '0x0c7435e863D3a3365FEbe06F34F95f4120f71114',
          network: 'Base Sepolia',
          timestamp: new Date().toISOString(),
          connectedAgents: connectedAgents.size + 1,
          connectedUsers: connectedUsers.size
        }));
        return;
      }

      if (url === '/api/logs') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        try {
          const logsPath = path.join(process.cwd(), 'logs', 'combined.log');
          const logs = fs.readFileSync(logsPath, 'utf8')
            .split('\n').filter(l => l).slice(-30)
            .map(l => {
              try { return JSON.parse(l); } catch(e) { return { message: l, level: 'info' }; }
            });
          res.end(JSON.stringify(logs));
        } catch (e) {
          res.end(JSON.stringify({ error: e.message }));
        }
        return;
      }

      if (url === '/api/agents') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify([...connectedAgents.values()]));
        return;
      }

      if (url === '/api/users') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const usersList = [...connectedUsers.values()].map(u => ({
          ...u,
          config: u.config || {}
        }));
        res.end(JSON.stringify(usersList));
        return;
      }

      if (url === '/api/trades') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tradeHistory.slice(-50)));
        return;
      }

      if (url.startsWith('/api/portfolio')) {
        // Get user address from query params or connected users
        const urlObj = new URL(url, `http://localhost:${PORT}`);
        const userAddress = urlObj.searchParams.get('user');
        
        // Get portfolio from tracker
        const portfolio = await portfolioTracker.getPortfolio(userAddress);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(portfolio));
        return;
      }

      if (url.startsWith('/api/prices')) {
        // Get price for specific token pair
        const urlObj = new URL(url, `http://localhost:${PORT}`);
        const tokenIn = urlObj.searchParams.get('in') || 'ETH';
        const tokenOut = urlObj.searchParams.get('out') || 'USDC';
        
        const price = await priceFeed.getPrice(tokenIn, tokenOut);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          tokenIn, 
          tokenOut, 
          price,
          timestamp: new Date().toISOString()
        }));
        return;
      }

      if (url.startsWith('/api/ai/analysis')) {
        // Get AI trading analysis
        const analysis = await aiAnalyzer.analyze();
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(analysis));
        return;
      }

      if (url.startsWith('/api/ai/sentiment')) {
        // Get market sentiment
        const sentiment = await aiAnalyzer.getMarketSentiment();
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(sentiment));
        return;
      }

      if (url === '/api/executor/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          initialized: tradeExecutor.isInitialized,
          walletAddress: tradeExecutor.walletAddress,
          contractOwner: tradeExecutor.contractOwner,
          isOwner: tradeExecutor.isOwner,
          contractAddress: tradeExecutor.contractAddress,
          mode: tradeExecutor.isOwner ? 'on-chain' : 'simulation'
        }));
        return;
      }

      // Venice.ai integration - GET (no data needed)
      if (url.startsWith('/api/integrations/venice/sentiment')) {
        const urlObj = new URL(url, `http://localhost:${PORT}`);
        const symbol = urlObj.searchParams.get('symbol') || 'ETH';
        const sentiment = await integrations.venice.getMarketSentiment(symbol);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(sentiment));
        return;
      }

      if (url === '/api/integrations/status') {
        const status = {
          totalIntegrations: 22,
          enabled: 13,
          simulation: 9,
          totalPrizeValue: 93058.96,
          integrations: [
            { name: 'Venice.ai', enabled: false, prize: 'AI/ML Integration', value: 0 },
            { name: 'Virtuals Protocol', enabled: false, prize: 'Best Virtuals Use', value: 0 },
            { name: 'Lit Protocol', enabled: false, prize: 'Best Lit Use', value: 0 },
            { name: 'Slice', enabled: false, prize: 'Best Slice Use', value: 0 },
            { name: 'Self.xyz', enabled: false, prize: 'Best Self Use', value: 0 },
            { name: 'Octant', enabled: false, prize: 'Best Octant Use', value: 0 },
            { name: 'bond.credit', enabled: false, prize: 'Credit/Lending', value: 1000 },
            { name: 'SuperRare', enabled: false, prize: 'NFT/Creators', value: 1200 },
            { name: 'Zyfai', enabled: false, prize: 'Sustainability', value: 600 },
            { name: 'Status Network', enabled: false, prize: 'Consumer Apps', value: 50 },
            { name: 'ampersend', enabled: false, prize: 'Payments', value: 500 },
            { name: 'Arkhai', enabled: false, prize: 'RWAI', value: 450 },
            { name: 'ENS', enabled: false, prize: 'Identity/Communication', value: 800 }
          ]
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(status));
        return;
      }

      if (url.startsWith('/api/integrations/venice/signals')) {
        const urlObj = new URL(url, `http://localhost:${PORT}`);
        const symbol = urlObj.searchParams.get('symbol') || 'ETH';
        const signals = await integrations.venice.getTradingSignals(symbol);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(signals));
        return;
      }

      // Virtuals Protocol integration
      if (url.startsWith('/api/integrations/virtuals/tokenomics')) {
        const tokenomics = await integrations.virtuals.getAgentTokenomics();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tokenomics));
        return;
      }

      if (url.startsWith('/api/integrations/virtuals/performance')) {
        const performance = await integrations.virtuals.getAgentPerformance();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(performance));
        return;
      }

      if (url.startsWith('/api/integrations/virtuals/reputation')) {
        const reputation = await integrations.virtuals.getAgentReputation();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(reputation));
        return;
      }

      if (url.startsWith('/api/integrations/virtuals/pool')) {
        const urlObj = new URL(url, `http://localhost:${PORT}`);
        const liquidity = parseFloat(urlObj.searchParams.get('liquidity')) || 1000;
        const pool = await integrations.virtuals.createAgentPool(liquidity);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(pool));
        return;
      }

      if (url.startsWith('/api/integrations/virtuals/stake')) {
        const urlObj = new URL(url, `http://localhost:${PORT}`);
        const amount = parseFloat(urlObj.searchParams.get('amount')) || 100;
        const stake = await integrations.virtuals.stakeAgentTokens(amount);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(stake));
        return;
      }

      // Lit Protocol integration
      if (url.startsWith('/api/integrations/lit/capabilities')) {
        const capabilities = await integrations.lit.getAgentCapabilities();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(capabilities));
        return;
      }

      if (url.startsWith('/api/integrations/lit/verify')) {
        const urlObj = new URL(url, `http://localhost:${PORT}`);
        const address = urlObj.searchParams.get('address');
        const verified = await integrations.lit.verifyAgentIdentity(address);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(verified));
        return;
      }

      // Self.xyz integration
      if (url.startsWith('/api/integrations/self/trust')) {
        const urlObj = new URL(url, `http://localhost:${PORT}`);
        const agentId = urlObj.searchParams.get('agentId') || 'default';
        const trustScore = await integrations.self.getAgentTrustScore(agentId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(trustScore));
        return;
      }

      if (url.startsWith('/api/integrations/self/reputation')) {
        const reputation = await integrations.self.createAgentReputation();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(reputation));
        return;
      }

      // Octant integration
      if (url.startsWith('/api/integrations/octant/epoch')) {
        const epoch = await integrations.octant.getCurrentEpoch();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(epoch));
        return;
      }

      if (url.startsWith('/api/integrations/octant/funding')) {
        const funding = await integrations.octant.getAgentFunding();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(funding));
        return;
      }

      if (url.startsWith('/api/integrations/octant/rewards')) {
        const rewards = await integrations.octant.getEpochRewards();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rewards));
        return;
      }

      if (url.startsWith('/api/integrations/octant/opportunities')) {
        const opportunities = await integrations.octant.getGrantOpportunities();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(opportunities));
        return;
      }

      // Slice integration
      if (url.startsWith('/api/integrations/slice/opportunities')) {
        const opportunities = await integrations.slice.getYieldOpportunities();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(opportunities));
        return;
      }

      if (url.startsWith('/api/integrations/slice/portfolio')) {
        const portfolio = await integrations.slice.getAgentYieldPortfolio();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(portfolio));
        return;
      }

      if (url.startsWith('/api/integrations/slice/stats')) {
        const stats = await integrations.slice.getYieldStats();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(stats));
        return;
      }

      if (url.startsWith('/api/integrations/slice/best')) {
        const urlObj = new URL(url, `http://localhost:${PORT}`);
        const token = urlObj.searchParams.get('token') || 'USDC';
        const amount = parseFloat(urlObj.searchParams.get('amount')) || 1000;
        const best = await integrations.slice.findBestYield(token, amount);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(best));
        return;
      }
    } // Close GET block

    if (method === 'POST') {
      if (url === '/api/connect/agent') {
        const agentId = `agent-${Date.now()}`;
        const agent = {
          id: agentId,
          name: data.name || 'Unknown Agent',
          capabilities: data.capabilities || [],
          connectedAt: new Date().toISOString()
        };
        connectedAgents.set(agentId, agent);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ agentId, status: 'connected' }));
        return;
      }

      if (url === '/api/connect/user') {
        const userId = data.address;
        if (userId) {
          connectedUsers.set(userId, {
            id: userId,
            address: userId,
            connectedAt: new Date().toISOString(),
            trades: 0,
            config: {}
          });
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ userId, status: 'connected' }));
        return;
      }

      if (url === '/api/user/config') {
        // Find the most recently connected user or use a default
        let userId = [...connectedUsers.keys()].pop();
        if (!userId) {
          userId = 'default-user';
          connectedUsers.set(userId, {
            id: userId,
            address: userId,
            connectedAt: new Date().toISOString(),
            trades: 0
          });
        }
        
        const user = connectedUsers.get(userId);
        user.config = data;
        user.lastUpdated = new Date().toISOString();
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'updated', config: data }));
        return;
      }

      if (url === '/api/trade/execute') {
        // Execute trade using the trade executor
        const result = await tradeExecutor.executeTrade(data);
        
        if (result.success) {
          // Store trade in history
          const trade = {
            id: result.tradeId,
            action: data.action,
            tokenIn: data.tokenIn,
            tokenOut: data.tokenOut,
            amountIn: data.amountIn,
            userAddress: data.userAddress,
            txHash: result.txHash,
            timestamp: new Date().toISOString(),
            status: 'completed'
          };
          tradeHistory.push(trade);
          
          // Update user trade count
          if (data.userAddress && connectedUsers.has(data.userAddress)) {
            const user = connectedUsers.get(data.userAddress);
            user.trades = (user.trades || 0) + 1;
          }
          
          // Broadcast trade update to WebSocket clients
          try {
            broadcastTradeUpdate(trade);
          } catch (error) {
            console.error('Failed to broadcast trade update:', error.message);
          }
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            tradeId: result.tradeId, 
            status: 'completed',
            txHash: result.txHash,
            message: result.message
          }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: result.error || 'Trade execution failed',
            status: 'failed'
          }));
        }
        return;
      }

      if (url === '/api/agent/command') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ commandId: `cmd-${Date.now()}`, status: 'queued' }));
        return;
      }

      // bond.credit integration
      if (url === '/api/integrations/bondcredit/score') {
        const score = await integrations.bondCredit.getCreditScore(data.address);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(score));
        return;
      }

      if (url === '/api/integrations/bondcredit/apply') {
        const application = await integrations.bondCredit.applyForBondCredit();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(application));
        return;
      }

      // SuperRare integration
      if (url === '/api/integrations/superrare/artwork') {
        const artwork = await integrations.superRare.generateAgentArtwork(data.theme);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(artwork));
        return;
      }

      if (url === '/api/integrations/superrare/collection') {
        const collection = await integrations.superRare.getAgentArtCollection();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(collection));
        return;
      }

      // Zyfai integration
      if (url === '/api/integrations/zyfai/yield') {
        const yieldData = await integrations.zyfai.getYieldBalance();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(yieldData));
        return;
      }

      if (url === '/api/integrations/zyfai/sustainability') {
        const sustainability = await integrations.zyfai.getSustainabilityScore();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(sustainability));
        return;
      }

      // Status Network integration
      if (url === '/api/integrations/status/gasless') {
        const tx = await integrations.status.executeGaslessTransaction(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tx));
        return;
      }

      if (url === '/api/integrations/status/verify') {
        const verification = await integrations.status.verifyGaslessTx(data.txHash);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(verification));
        return;
      }

      // ampersend integration
      if (url === '/api/integrations/ampersend/pay') {
        const payment = await integrations.ampersend.sendPayment(data.to, data.amount, data.currency, data.memo);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(payment));
        return;
      }

      // arkhai integration
      if (url === '/api/integrations/arkhai/obligation') {
        const obligation = await integrations.arkhai.createObligation(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(obligation));
        return;
      }

      // ENS integration
      if (url === '/api/integrations/ens/identity') {
        const identity = await integrations.ens.resolveAgentIdentity(data.nameOrAddress);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(identity));
        return;
      }

      if (url === '/api/integrations/ens/profile') {
        const profile = await integrations.ens.getAgentENSProfile();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(profile));
        return;
      }

      // Venice with POST data
      if (url === '/api/integrations/venice/sentiment' && method === 'POST') {
        const sentiment = await integrations.venice.getMarketSentiment(data?.symbol || 'ETH');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(sentiment));
        return;
      }

      // Lit secrets with POST data
      if (url === '/api/integrations/lit/secrets') {
        const secret = await integrations.lit.storeAgentSecret(data?.name, data?.value);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(secret));
        return;
      }

      // Self identity with POST data
      if (url === '/api/integrations/self/identity') {
        const identity = await integrations.self.createAgentIdentity(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(identity));
        return;
      }

      // Zyfai sustainability with GET
      if (url === '/api/integrations/zyfai/sustainability') {
        const sustainability = await integrations.zyfai.getSustainabilityScore();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(sustainability));
        return;
      }

      // Virtuals mint token
      if (url === '/api/integrations/virtuals/mint') {
        const minted = await integrations.virtuals.mintAgentToken(
          data?.name || 'VeilTrader',
          data?.symbol || 'VTRADER',
          data?.metadataUri || ''
        );
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(minted));
        return;
      }

      // Virtuals fractionalize
      if (url === '/api/integrations/virtuals/fractionalize') {
        const fractional = await integrations.virtuals.fractionalizeAgent(
          data?.tokenId,
          data?.supply || 1000
        );
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(fractional));
        return;
      }

      // Lit trading key
      if (url === '/api/integrations/lit/key') {
        const key = await integrations.lit.createTradingKey(data?.name || 'trading-key', data?.permissions || {});
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(key));
        return;
      }

      // Lit access grant
      if (url === '/api/integrations/lit/grant') {
        const grant = await integrations.lit.createAccessGrant(
          data?.targetAddress,
          data?.resource,
          data?.permissions
        );
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(grant));
        return;
      }

      // Self verify identity
      if (url === '/api/integrations/self/verify') {
        const verification = await integrations.self.verifyAgentIdentity(data?.agentId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(verification));
        return;
      }

      // Self add credential
      if (url === '/api/integrations/self/credential') {
        const credential = await integrations.self.addAgentCredential(data?.agentId, data?.credential);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(credential));
        return;
      }

      // Octant apply for grant
      if (url === '/api/integrations/octant/apply') {
        const application = await integrations.octant.applyForGrant(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(application));
        return;
      }

      // Octant allocate rewards
      if (url === '/api/integrations/octant/allocate') {
        const allocation = await integrations.octant.allocateRewards(
          data?.toAddress,
          data?.amount,
          data?.epoch
        );
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(allocation));
        return;
      }

      // Octant create proposal
      if (url === '/api/integrations/octant/proposal') {
        const proposal = await integrations.octant.createFundingProposal(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(proposal));
        return;
      }

      // Slice deposit
      if (url === '/api/integrations/slice/deposit') {
        const deposit = await integrations.slice.depositToYield(
          data?.token || 'USDC',
          data?.amount || 1000,
          data?.protocol || 'Aave V3'
        );
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(deposit));
        return;
      }

      // Slice optimize
      if (url === '/api/integrations/slice/optimize') {
        const optimization = await integrations.slice.autoOptimizeYield(data?.portfolio || { positions: [] });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(optimization));
        return;
      }
    }

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
  }

initializeModules().then(() => {
  server.listen(PORT, () => {
    console.log(`🌐 VeilTrader Dashboard: http://localhost:${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}/api/`);
  });
});

// WebSocket Server for real-time updates
const wss = new WebSocket.Server({ server: server, path: '/ws' });

const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('✅ WebSocket client connected');
  
  // Send initial status
  ws.send(JSON.stringify({
    type: 'status',
    data: { status: 'connected', timestamp: new Date().toISOString() }
  }));
  
  ws.on('close', () => {
    clients.delete(ws);
    console.log('❌ WebSocket client disconnected');
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error.message);
  });
});

// Broadcast to all connected clients
function broadcast(data) {
  clients.forEach(client => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(JSON.stringify(data));
    }
  });
}

// Broadcast trade updates
function broadcastTradeUpdate(trade) {
  broadcast({
    type: 'trade',
    data: trade
  });
}

// Broadcast portfolio updates
function broadcastPortfolioUpdate(portfolio) {
  broadcast({
    type: 'portfolio',
    data: portfolio
  });
}

// Export for use in other modules
module.exports = { broadcastTradeUpdate, broadcastPortfolioUpdate };
