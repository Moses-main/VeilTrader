# VeilTrader 🤖💰

<p align="center">
  <img src="public/VeilTrader_with_text.png" alt="VeilTrader Logo" width="400"/>
</p>

> **Privacy-first autonomous AI trading agent for Synthesis Hackathon 2026**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Base Sepolia](https://img.shields.io/badge/Base-Sepolia-blue)](https://base.org)
[![ERC-8004](https://img.shields.io/badge/ERC--8004-Compliant-green)](https://eips.ethereum.org/EIPS/eip-8004)
[![Tests](https://img.shields.io/badge/Tests-29%2F29%20Passing-success)]()

**VeilTrader** is a fully autonomous, privacy-first AI trading agent that:
- 🤖 Makes AI-powered trading decisions (Bankr + Gemini + DeepSeek)
- ⛓️ Executes real swaps on Uniswap V3 (Base Sepolia)
- 🔐 Maintains ERC-8004 identity and reputation on-chain
- 📊 Provides real-time dashboard with WebSocket updates
- 💰 Operates self-sustainably (trading fees fund AI costs)

## 🏆 Hackathon Submission

**Event:** [The Synthesis Hackathon 2026](https://synthesis.devfolio.co)  
**Network:** Base Sepolia (Chain ID: 84532)  
**Contract:** [0x0c7435e863D3a3365FEbe06F34F95f4120f71114](https://sepolia.basescan.org/address/0x0c7435e863D3a3365FEbe06F34F95f4120f71114)

### 🎯 Prize Tracks Targeted

| Prize Track | Amount | Status | Implementation |
|-------------|--------|--------|---------------|
| **Autonomous Trading Agent** (Base) | $5,000 | ✅ Complete | AI trading, dashboard, WebSocket |
| **Agents With Receipts — ERC-8004** | $10,000 | ✅ Complete | Full ERC-8004 identity |
| **Best Agentic Finance** (Uniswap) | $6,000 | ✅ Complete | Uniswap V3 integration |
| **Best Bankr LLM Gateway** | $4,500 | ✅ Complete | Multi-model AI, self-sustaining |
| **Let the Agent Cook** | $6,000 | ✅ Complete | Full autonomy loop |
| **Best Use of Delegations** (MetaMask) | $4,500 | ✅ Complete | Delegation framework |
| **Best Use of Locus** | $3,500 | ✅ Complete | Agent-native payments |
| **stETH Agent Treasury** (Lido) | $3,000 | ✅ Complete | Yield-only spending |
| **Agent Services on Base** | $5,000 | ✅ Complete | x402 payments |

**Total Prize Value: $47,500**

📖 **[View Complete Prize Strategy →](PRIZES.md)**

## ✨ Features

### 🤖 AI-Powered Trading
- **Multi-model AI**: Bankr (premium), Gemini (free), DeepSeek (free)
- **Confidence scoring**: Actions execute only when confidence ≥ 70%
- **Real-time analysis**: Market conditions, trends, volatility

### ⛓️ On-Chain Execution
- **Uniswap V3**: Direct DEX swaps on Base Sepolia
- **Smart contract**: Trade history, identity, reputation
- **Verified receipts**: Every action is on-chain verifiable

### 🔐 Privacy-First
- **No data retention**: Bankr ensures LLM calls don't persist
- **Private reasoning**: AI analysis stays confidential
- **ZK-ready**: Architecture supports future ZK proofs

### 📊 Modern Dashboard
- **Real-time updates**: WebSocket broadcasting
- **Live portfolio tracking**: On-chain balances
- **AI insights panel**: Recommendations, confidence, risk
- **Automated trading**: Toggle auto-trade with configurable parameters

### 💰 Self-Sustaining Economics
- **Revenue**: 0.3% trading fee
- **Costs**: AI inference, gas
- **ROI**: Sustainability score 85/100

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- Base Sepolia ETH ([faucet](https://www.base.org/faucet))
- MetaMask wallet

### Installation

```bash
# Clone repository
git clone <repo-url>
cd veiltrader

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### Configuration

```env
# Wallet (Base Sepolia testnet)
PRIVATE_KEY=your_private_key_here
RPC_URL=https://sepolia.base.org

# Contract (already deployed)
VEILTRADER_CONTRACT=0x0c7435e863D3a3365FEbe06F34F95f4120f71114

# AI Providers (optional - free tier available)
BANKR_API_KEY=your_bankr_key_here
GEMINI_API_KEY=your_gemini_key_here
```

### Run the Dashboard

```bash
# Start the web UI
node src/ui/server.js

# Open browser
open http://localhost:3000
```

### Run Demo Scripts

```bash
# Autonomous trading demo
node prizes/autonomous-trading-demo.js

# ERC-8004 verification
node prizes/erc8004-verifiability.js

# Self-sustaining economics
node prizes/bankr-economics.js
```

## 🏗️ Architecture

### System Flow

```
┌─────────────┐
│   USER      │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│   DASHBOARD      │ ◄── Real-time UI (localhost:3000)
│   WebSocket      │
└──────┬──────────┘
       │
       ▼
┌──────────────────┐
│   AI AGENT       │ ◄── Decision making
│   Decision Engine │
└──────┬──────────┘
       │
       ├──────────┬──────────┬──────────┐
       ▼          ▼          ▼          ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Portfolio│ │  Risk   │ │  Bankr   │ │ Gemini/  │
│ Analyzer │ │ Engine  │ │ Gateway  │ │ DeepSeek │
└────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
     │            │            │            │
     └────────────┼────────────┘            │
                  │                         │
                  ▼                         ▼
         ┌──────────────────┐    ┌──────────────────┐
         │   UNISWAP V3     │    │   AI ANALYSIS    │
         │   (Base Sepolia) │    │   (Recommendations)│
         └────────┬─────────┘    └────────┬─────────┘
                  │                        │
                  ▼                        │
         ┌──────────────────┐             │
         │   SMART CONTRACT │ ◄────────────┘
         │   (ERC-8004)    │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │   ON-CHAIN       │
         │   Verification   │
         └──────────────────┘
```

### Tech Stack

- **Frontend**: Vanilla JS, Modern CSS, WebSocket
- **Backend**: Node.js, Express
- **Blockchain**: Base Sepolia, Foundry, Solidity
- **AI**: Bankr, Gemini, DeepSeek
- **DEX**: Uniswap V3
- **Identity**: ERC-8004

## 📁 Project Structure

```
veiltrader/
├── src/
│   ├── ui/                    # Web dashboard
│   │   ├── server.js          # Express server + WebSocket
│   │   ├── index.html         # UI
│   │   ├── style.css          # Styling
│   │   ├── script.js          # Frontend logic
│   │   ├── ai-analyzer.js     # AI analysis module
│   │   ├── price-feed.js      # Live prices
│   │   ├── trade-executor.js  # Trade execution
│   │   └── portfolio-tracker.js
│   ├── agent/                 # Core agent
│   │   └── VeilTrader.js
│   ├── analysis/              # Analysis modules
│   │   ├── PortfolioAnalyzer.js
│   │   ├── RiskEngine.js
│   │   └── DecisionEngine.js
│   ├── execution/             # Execution modules
│   │   ├── UniswapExecutor.js
│   │   └── VeilTraderContract.js
│   ├── identity/             # Identity layer
│   │   └── IdentityRegistry.js
│   └── services/             # External services
│       ├── BankrGateway.js
│       └── FreeAIGateway.js
├── contracts/                 # Smart contracts
│   └── VeilTrader.sol        # Main contract
├── prizes/                    # Prize-specific implementations
│   ├── autonomous-trading-demo.js
│   ├── erc8004-verifiability.js
│   ├── uniswap-integration.js
│   ├── bankr-economics.js
│   ├── metamask-delegation.js
│   ├── agent-cook-documentation.md
│   ├── locus-integration.js
│   ├── steth-treasury.js
│   └── agent-services-x402.js
├── test/                      # Contract tests
│   └── VeilTrader.t.sol
└── PRIZES.md                 # Prize targeting strategy
```

## 🤖 For AI Agents

VeilTrader exposes a REST API for agent-to-agent communication:

```javascript
// Get agent status
const status = await fetch('http://localhost:3000/api/status');

// Get AI analysis
const analysis = await fetch('http://localhost:3000/api/ai/analysis');

// Execute trade
const trade = await fetch('http://localhost:3000/api/trade/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'BUY',
    tokenIn: 'ETH',
    tokenOut: 'USDC',
    amountIn: 0.1
  })
});

// Get portfolio
const portfolio = await fetch('http://localhost:3000/api/portfolio');
```

### WebSocket Events

Connect to `ws://localhost:3000/ws` for real-time updates:

```javascript
const ws = new WebSocket('ws://localhost:3000/ws');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  if (message.type === 'trade') {
    console.log('New trade:', message.data);
  }
  
  if (message.type === 'portfolio') {
    console.log('Portfolio update:', message.data);
  }
};
```

## 📊 Dashboard Features

The web UI includes:

1. **AI Insights Panel**
   - Market analysis
   - Trading recommendations (BUY/SELL/HOLD)
   - Confidence scores
   - Risk assessment

2. **Automated Trading Controls**
   - Enable/disable auto-trading
   - Minimum confidence threshold
   - Max trades per day
   - Stop loss percentage

3. **Portfolio Tracking**
   - Real-time balances
   - Token values
   - Total portfolio value

4. **Trade Execution**
   - Manual trade form
   - Token selection
   - Amount input

5. **Activity Logs**
   - Real-time activity
   - Trade history
   - AI recommendations

## 🔒 Security

- **No private keys stored** in code
- **Environment variables** for sensitive data
- **Simulation mode** for testing without real funds
- **Circuit breakers** for risk management
- **Input validation** on all endpoints

## 📈 Performance

- **29/29** smart contract tests passing
- **<3s** average trade execution time
- **WebSocket** real-time updates
- **85/100** sustainability score

## 🧪 Testing

```bash
# Run smart contract tests
npm run test

# Run coverage
npm run test:coverage

# Build contracts
npm run build
```

## 📚 Documentation

- [Prize Targeting Strategy](PRIZES.md) - Complete prize breakdown
- [Agent Cook Documentation](prizes/agent-cook-documentation.md) - Autonomy details
- [Deployment Guide](DEPLOYMENT.md) - Production deployment
- [SETUP.md](docs/SETUP.md) - Setup instructions
- [SKILL.md](docs/SKILL.md) - Agent skill file

## 🏅 Team

**Moses Sunday** - Human Developer  
**Stealth (AI Agent)** - ERC-8004 Identity

## 📜 License

MIT License - see [LICENSE](LICENSE)

---

<p align="center">
  <strong>Built for Synthesis Hackathon 2026</strong>
</p>

<p align="center">
  Privacy-first • Autonomous • On-chain Verifiable
</p>
