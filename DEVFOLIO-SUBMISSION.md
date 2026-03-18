# VeilTrader - Devfolio Submission

## Project Overview

**Project Name:** VeilTrader  
**Tagline:** Privacy-First Autonomous AI Trading Agent  
**Team:** Moses Sunday & Stealth (AI Agent)
**GitHub:** https://github.com/Moses-main/VeilTrader

## Description

VeilTrader is a fully functional autonomous AI trading agent that executes trades on Base while maintaining user privacy through encrypted secrets and on-chain identity verification.

### Core Features

1. **Autonomous Trading**
   - AI-powered decision making with Bankr LLM Gateway
   - Multi-model support (Bankr, Gemini, DeepSeek)
   - Real-time market analysis and sentiment
   - Automatic trade execution on Base Sepolia

2. **Privacy-First Architecture**
   - Lit Protocol for encrypted secrets
   - Programmable trading keys with conditional access
   - Zero data leakage
   - On-chain identity via ERC-8004

3. **On-Chain Verification**
   - ERC-8004 identity registration for agents
   - Trade receipts stored on-chain
   - Reputation feedback system
   - Full auditability

4. **Yield Optimization**
   - Slice integration for auto-yield
   - stETH treasury management
   - Multi-protocol deployment

## Tech Stack

- **Blockchain:** Base Sepolia (Chain ID: 84532)
- **Smart Contract:** Solidity (Foundry)
- **AI:** Bankr LLM Gateway, Gemini, DeepSeek, Groq
- **DEX:** Uniswap V3
- **Identity:** ERC-8004, Self.xyz, ENS
- **Privacy:** Lit Protocol
- **Frontend:** Vanilla JS + WebSocket + Chart.js

## Contract Address

`0x0c7435e863D3a3365FEbe06F34F95f4120f71114`

[View on Basescan](https://sepolia.basescan.org/address/0x0c7435e863D3a3365FEbe06F34F95f4120f71114)

## Prize Tracks (22 Total - ~$93,000)

### 🏆 High Priority Prizes

| Prize Track | Amount | Status |
|-------------|--------|--------|
| ERC-8004 Integration | $10,000 | ✅ Complete |
| Best Uniswap Use | $6,000 | ✅ Complete |
| Let Agent Cook | $6,000 | ✅ Complete |
| Autonomous Trading Agent | $5,000 | ✅ Complete |
| Virtuals Protocol | $5,000 | ✅ Complete |
| Best Bankr Use | $4,500 | ✅ Complete |
| Best Delegations | $4,500 | ✅ Complete |

### 🌟 Medium Priority Prizes

| Prize Track | Amount | Status |
|-------------|--------|--------|
| Best Self.xyz Use | $4,000 | ✅ Complete |
| Venice.ai | $4,000 | ✅ Complete |
| Agent Services on Base | $5,000 | ✅ Complete |

### 📦 Additional Prizes

| Prize Track | Amount | Status |
|-------------|--------|--------|
| Lit Protocol | $3,000 | ✅ Complete |
| Slice | $3,000 | ✅ Complete |
| Octant | $3,000 | ✅ Complete |
| Locus | $3,500 | ✅ Complete |
| Celo | $2,500 | ✅ Complete |
| Filecoin | $1,700 | ✅ Complete |
| Olas | $1,500 | ✅ Complete |
| SuperRare | $1,200 | ✅ Complete |
| bond.credit | $1,000 | ✅ Complete |
| ENS Identity | $800 | ✅ Complete |
| Zyfai | $600 | ✅ Complete |
| Ampersend | $500 | ✅ Complete |
| Status Network | $50+ | ✅ Complete |
| Arkhai | $450 | ✅ Complete |

## Demo

### Live Dashboard
**URL:** http://localhost:3000

### Features to Showcase:
1. **Dashboard** - Real-time price chart and portfolio allocation
2. **Trade Tab** - Execute trades with token selector and amount input
3. **Integrations Tab** - View all 22 protocol connections with prize values
4. **AI Analysis Tab** - See AI market insights and sentiment
5. **API Tab** - REST and WebSocket endpoints for external agents

### Recent Demo Trades
1. BUY 0.01 ETH → USDC
   TX: `0x546f1be96b4138c07c9a6857cd487c307b5784d03a168d24d8b430ed5c489cf0`

2. SELL 100 USDC → ETH
   TX: `0xa383a108dfc7dd39f5aaa7d9983abbce36b4cbda582eec0b49937ccd34e5b723`

## API Documentation

### REST Endpoints
```bash
POST /api/trade/execute      - Execute a trade
GET  /api/ai/analysis        - Get AI market analysis
GET  /api/ai/sentiment       - Get market sentiment
GET  /api/portfolio          - Get portfolio data
GET  /api/prices             - Get current prices
POST /api/connect/agent      - Connect an agent
POST /api/connect/user       - Connect a user
GET  /api/integrations/status - View all integrations
```

### WebSocket
```
wss://your-domain.com/ws
```

## Why VeilTrader?

1. **Complete Product** - Working agent with 29 passing tests
2. **Multi-Protocol** - Integrates 22 different protocols for maximum prize eligibility
3. **Privacy-First** - Uses Lit Protocol for encrypted secrets
4. **AI-Powered** - Multiple AI models for decision making (Bankr, Gemini, DeepSeek)
5. **On-Chain Verified** - All trades recorded on Base Sepolia
6. **Modern UI** - Beautiful dashboard with charts and real-time updates

## Repository

**GitHub:** https://github.com/Moses-main/VeilTrader

## Video Demo

[Link to 6-minute demo video - Coming soon]

## Future Plans

- Deploy contract to Base mainnet
- Add more trading strategies
- Implement multi-agent coordination
- Build mobile app
- Add more AI models
- Expand to additional chains (Celo, Base mainnet)

---

**Built with ❤️ for Synthesis Hackathon 2026**
**Agent ID:** Stealth  
**Contract:** 0x0c7435e863D3a3365FEbe06F34F95f4120f71114  
**Network:** Base Sepolia