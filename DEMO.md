# VeilTrader Demo Guide

## 🚀 Quick Start

```bash
# Start the dashboard
node src/ui/server.js

# Open in browser
open http://localhost:3000
```

## 📊 Dashboard Overview

The VeilTrader dashboard provides a comprehensive view of the autonomous trading agent:

### Main Features

#### 1. Dashboard Tab
- **Total Trades**: Live count of executed trades
- **Portfolio Value**: Current portfolio holdings
- **Active Agents**: Connected AI agents
- **Connected Users**: Users interacting with the agent
- **Activity Feed**: Real-time trade updates

#### 2. Trade Tab
Execute trades directly from the UI:
```
Action: BUY/SELL
Token In: ETH, USDC, WETH
Token Out: ETH, USDC, WETH
Amount: 0.01
```

#### 3. Agents Tab
- View connected AI agents
- Agent capabilities and status
- Performance metrics

#### 4. Users Tab
- Connected user addresses
- User configurations
- Trade history per user

#### 5. API Tab
Interactive API documentation with:
- Endpoint descriptions
- Request/response examples
- Try-it-out functionality

## 🔗 API Endpoints

### Core Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/status` | GET | Agent status |
| `/api/trades` | GET | Trade history |
| `/api/trade/execute` | POST | Execute trade |
| `/api/ai/analysis` | GET | AI trading analysis |

### Integration Endpoints
| Endpoint | Description |
|----------|-------------|
| `/api/integrations/venice/sentiment` | Market sentiment |
| `/api/integrations/slice/yield` | Yield opportunities |
| `/api/integrations/virtuals/tokenomics` | Agent tokenomics |
| `/api/integrations/lit/secrets` | Encrypted storage |
| `/api/integrations/self/identity` | Agent DID |
| `/api/integrations/octant/grant` | Grant applications |

## 💰 Live Demo Trades

Recent successful trades on Base Sepolia:

### Trade #1: ETH → USDC
```
Action: BUY
Token In: ETH
Token Out: USDC
Amount: 0.01
TX Hash: 0x546f1be96b4138c07c9a6857cd487c307b5784d03a168d24d8b430ed5c489cf0
Status: ✅ Confirmed
Block: 39043809
```

### Trade #2: USDC → ETH
```
Action: SELL
Token In: USDC
Token Out: ETH
Amount: 100
TX Hash: 0xa383a108dfc7dd39f5aaa7d9983abbce36b4cbda582eec0b49937ccd34e5b723
Status: ✅ Confirmed
```

## 🤖 AI Analysis

The AI provides real-time market analysis:

```json
{
  "action": "SELL",
  "confidence": 64,
  "reason": "Resistance at $3,600 breaking down",
  "marketData": {
    "ethPrice": 3408.18,
    "volume24h": 9705154,
    "volatility": 98.27,
    "trend": "BEARISH"
  },
  "risk": "LOW",
  "riskDetails": "Market conditions are stable with low volatility"
}
```

## 🔐 Security Features

### ERC-8004 Identity
- Agent registered on ERC-8004 Identity Registry
- Trade receipts stored on-chain
- Reputation feedback system

### Delegation Framework
- MetaMask delegation support
- Permission-based access control
- Intent-based transactions

### Encryption
- Lit Protocol for encrypted secrets
- Programmable trading keys
- Conditional access grants

## 📈 Integration Map

```
┌─────────────────────────────────────────────────────────┐
│                    VeilTrader                          │
├─────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │
│  │Venice.ai│  │Uniswap │  │  Bankr  │  │ Virtuals│   │
│  │Sentiment│  │   V3   │  │  LLM    │  │Protocol │   │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘   │
│       │            │            │            │         │
│  ┌────┴────┐  ┌────┴────┐  ┌────┴────┐  ┌────┴────┐ │
│  │  Slice  │  │   Celo  │  │  Lido   │  │  Self   │ │
│  │  Yield  │  │ Cross   │  │  stETH  │  │   DID   │ │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘ │
│                          │                              │
│              ┌───────────┴───────────┐                  │
│              │    Base Sepolia      │                  │
│              │  0x0c7435e...f71114  │                  │
│              └───────────────────────┘                  │
└─────────────────────────────────────────────────────────┘
```

## 🏆 Prize Tracks Summary

| Track | Value | Status |
|-------|-------|--------|
| Autonomous Trading Agent | $5,000 | ✅ |
| ERC-8004 Integration | $10,000 | ✅ |
| Best Uniswap Use | $6,000 | ✅ |
| Best Bankr Use | $4,500 | ✅ |
| Let Agent Cook | $6,000 | ✅ |
| Best Delegations | $4,500 | ✅ |
| Best Locus Use | $3,500 | ✅ |
| stETH Treasury | $3,000 | ✅ |
| Agent Services | $5,000 | ✅ |
| Venice.ai | $4,000 | ✅ |
| Virtuals Protocol | $5,000 | ✅ |
| Lit Protocol | $3,000 | ✅ |
| Slice | $3,000 | ✅ |
| Self.xyz | $4,000 | ✅ |
| Octant | $3,000 | ✅ |
| **TOTAL** | **~$70,000** | **15/15** |

## 📱 Contract Details

**Network**: Base Sepolia  
**Contract**: `0x0c7435e863D3a3365FEbe06F34F95f4120f71114`  
**Explorer**: https://sepolia.basescan.org/address/0x0c7435e863D3a3365FEbe06F34F95f4120f71114

## 🎥 Demo Video Script

1. **Intro** (0:00-0:30) - "VeilTrader: Privacy-first AI Trading Agent"
2. **Dashboard** (0:30-1:30) - Show UI, live stats, activity feed
3. **AI Analysis** (1:30-2:30) - Demonstrate market analysis
4. **Trade Execution** (2:30-3:30) - Execute a real trade
5. **Integrations** (3:30-4:30) - Show Venice, Slice, Virtuals
6. **Smart Contract** (4:30-5:30) - Show on-chain verification
7. **Conclusion** (5:30-6:00) - Prize tracks, future plans

## 📞 Support

- **GitHub**: https://github.com/your-repo/veiltrader
- **Dashboard**: http://localhost:3000
- **Contract**: Base Sepolia at 0x0c7435e...

---

**Built with ❤️ for Synthesis Hackathon 2026**
**Agent: Stealth**
