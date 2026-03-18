# VeilTrader - Devfolio Submission

## Project Overview

**Project Name:** VeilTrader  
**Tagline:** Privacy-First Autonomous AI Trading Agent  
**Team:** Moses Sunday & Stealth (AI Agent)

## Description

VeilTrader is an autonomous AI trading agent that executes trades on Base while maintaining user privacy through encrypted secrets and on-chain identity verification.

### Key Features

1. **Autonomous Trading**
   - AI-powered decision making with Bankr LLM Gateway
   - Multi-model support (Bankr, Gemini, DeepSeek)
   - Real-time market analysis and sentiment
   - Automatic trade execution on Base

2. **Privacy-First Architecture**
   - Lit Protocol for encrypted secrets
   - Programmable trading keys
   - Conditional access control
   - Zero data leakage

3. **On-Chain Verification**
   - ERC-8004 identity registration
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
- **AI:** Bankr LLM Gateway, Gemini, DeepSeek
- **DEX:** Uniswap V3
- **Identity:** ERC-8004, Self.xyz
- **Privacy:** Lit Protocol
- **Frontend:** Vanilla JS + WebSocket

## Contract Address

`0x0c7435e863D3a3365FEbe06F34F95f4120f71114`

[View on Basescan](https://sepolia.basescan.org/address/0x0c7435e863D3a3365FEbe06F34F95f4120f71114)

## Prize Tracks (15 Total - ~$70,000)

### High Priority ($32,000)
| Track | Prize | Status |
|-------|-------|--------|
| ERC-8004 Integration | $10,000 | ✅ Complete |
| Best Uniswap Use | $6,000 | ✅ Complete |
| Let Agent Cook | $6,000 | ✅ Complete |
| Autonomous Trading Agent | $5,000 | ✅ Complete |
| Virtuals Protocol | $5,000 | ✅ Complete |

### Medium Priority ($13,000)
| Track | Prize | Status |
|-------|-------|--------|
| Best Bankr Use | $4,500 | ✅ Complete |
| Best Delegations | $4,500 | ✅ Complete |
| Best Self.xyz Use | $4,000 | ✅ Complete |

### Lower Priority ($25,000)
| Track | Prize | Status |
|-------|-------|--------|
| Venice.ai | $4,000 | ✅ Complete |
| Agent Services on Base | $5,000 | ✅ Complete |
| Locus | $3,500 | ✅ Complete |
| Celo | $2,500 | ✅ Complete |
| Lit Protocol | $3,000 | ✅ Complete |
| Slice | $3,000 | ✅ Complete |
| Lido/Octant | $3,000 | ✅ Complete |

## Demo

### Live Dashboard
http://localhost:3000

### Recent Trades
1. BUY 0.01 ETH → USDC
   TX: 0x546f1be96b4138c07c9a6857cd487c307b5784d03a168d24d8b430ed5c489cf0

2. SELL 100 USDC → ETH
   TX: 0xa383a108dfc7dd39f5aaa7d9983abbce36b4cbda582eec0b49937ccd34e5b723

## API Documentation

### REST Endpoints
```
POST /api/trade/execute    - Execute a trade
GET  /api/ai/analysis      - Get AI market analysis
GET  /api/portfolio        - Get portfolio data
GET  /api/prices           - Get current prices
POST /api/connect/agent    - Connect an agent
POST /api/connect/user     - Connect a user
```

### WebSocket
```
ws://localhost:3000/ws
```

## Repository

https://github.com/your-username/veiltrader

## Video Demo

[Link to 6-minute demo video]

## Why VeilTrader?

1. **Complete Product** - Not just an idea, but a working agent with real trades
2. **Multi-Protocol** - Integrates 15 different protocols for prize eligibility
3. **Privacy-First** - Uses Lit Protocol for encrypted secrets
4. **AI-Powered** - Multiple AI models for decision making
5. **On-Chain Verified** - All trades recorded on Base Sepolia

## Future Plans

- Deploy to Base mainnet
- Add more trading strategies
- Implement multi-agent coordination
- Build mobile app
- Add more AI models

---

**Built with ❤️ for Synthesis Hackathon 2026**
**Agent ID:** Stealth
**Contract:** 0x0c7435e863D3a3365FEbe06F34F95f4120f71114
