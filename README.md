# VeilTrader 🤖💰

> **Privacy-first autonomous AI trading agent on Base**

VeilTrader is a fully autonomous, privacy-first AI trading agent that lives on Ethereum (Base). It privately analyzes DeFi portfolios using a no-data-retention LLM, makes risk-aware trade decisions, executes real Uniswap V3 swaps on-chain, and publishes verifiable transaction proofs.

## 🏆 Hackathon Tracks

- **Agents With Receipts — ERC-8004** ($4,000)
- **Let the Agent Cook — No Humans Required** ($4,000)
- **Best Bankr LLM Gateway Use** ($3,000)
- **Agentic Finance (Uniswap API)** ($2,500)
- **Agents that pay** ($1,000)

## ✨ Features

- 🔒 **Privacy-first**: No data retention LLM for portfolio analysis
- 🤖 **Fully autonomous**: End-to-end decision loop (analyze → decide → execute → verify)
- ⛓️ **On-chain identity**: ERC-8004 compliant reputation registry
- 💳 **Self-paying**: Uses Bankr gateway for inference costs
- 🔄 **Real execution**: Uniswap V3 swaps on Base
- 🧾 **Verifiable proofs**: Every action published on-chain

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    VeilTrader Agent                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Portfolio  │  │    Risk      │  │   Decision   │     │
│  │   Analyzer   │→ │   Engine     │→ │   Engine     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         ↓                  ↓                  ↓              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Bankr     │  │   Uniswap    │  │   ERC-8004   │     │
│  │    Gateway   │  │   Executor   │  │   Registry   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- Base testnet ETH
- Bankr API key
- Uniswap API key

### Installation

```bash
npm install
```

### Configuration

Create `.env` file:

```env
BANKR_API_KEY=your_bankr_key
UNISWAP_API_KEY=your_uniswap_key
PRIVATE_KEY=your_wallet_private_key
RPC_URL=https://sepolia.base.org
```

### Run the Agent

```bash
npm run start
```

## 📁 Project Structure

```
veiltrader/
├── src/
│   ├── agent/           # Core agent logic
│   ├── analysis/        # Portfolio analysis
│   ├── execution/       # Trade execution
│   └── identity/        # ERC-8004 identity
├── contracts/           # Smart contracts
├── scripts/             # Deployment & utility scripts
└── docs/                # Documentation
```

## 🔐 Security

- All private keys stored in environment variables
- No data retention in LLM calls
- On-chain verification for all actions
- Reputation scoring via ERC-8004

## 📜 License

MIT

## 🤝 Team

- **Human**: Moses Sunday (@Techboy1999)
- **Agent**: Stealth (ERC-8004: 587a0768c387481aa3eee090644cbe77)

Built for The Synthesis Hackathon 2026
