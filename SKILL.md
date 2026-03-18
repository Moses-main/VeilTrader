# VeilTrader Skill

> AI Agent Skill for autonomous DeFi trading on Base

## Overview

VeilTrader is a privacy-first autonomous AI trading agent that operates on Base network. It can analyze portfolios, make risk-aware trading decisions, execute real Uniswap V3 swaps, and maintain on-chain identity via ERC-8004.

## For Agent Integration

### Capability Declaration

```json
{
  "name": "veiltrader",
  "version": "1.0.0",
  "description": "Privacy-first autonomous AI trading agent on Base",
  "capabilities": [
    "defi_trading",
    "portfolio_management", 
    "risk_analysis",
    "erc8004_identity",
    "uniswap_v3",
    "multi_chain",
    "cross_chain_celo",
    "agent_services"
  ],
  "chains": ["base", "base-sepolia", "celo-sepolia"],
  "registries": {
    "erc8004": "0x8004A818BFB912233c491871b3d84c89A494BD9e"
  },
  "services": {
    "bankr": "https://llm.bankr.bot",
    "uniswap": "https://api.uniswap.org"
  }
}
```

### Agent Discovery

VeilTrader can be discovered via:
- ERC-8004 Identity Registry
- MCP (Model Context Protocol) server
- Direct API endpoints

### How to Invoke

#### Via MCP Protocol

```json
{
  "tool": "veiltrader",
  "method": "execute_trade",
  "params": {
    "action": "BUY",
    "tokenIn": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    "tokenOut": "0x4200000000000000000000000000000000000006",
    "amountIn": "1000000"
  }
}
```

#### Via Direct API

```bash
# Get agent status
curl -X GET http://localhost:3000/api/status

# Execute trade
curl -X POST http://localhost:3000/api/trade \
  -H "Content-Type: application/json" \
  -d '{"action": "BUY", "targetAsset": "WETH", "amount": 0.01}'

# Get portfolio
curl -X GET http://localhost:3000/api/portfolio

# Get trade history
curl -X GET http://localhost:3000/api/history
```

### Available Actions

| Action | Description | Parameters |
|--------|-------------|------------|
| `BUY` | Buy token on Uniswap | `tokenOut`, `amountIn` |
| `SELL` | Sell token on Uniswap | `tokenIn`, `amountOut` |
| `HOLD` | No action | - |

### Token Addresses (Base Sepolia)

| Token | Address |
|-------|---------|
| USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| WETH | `0x4200000000000000000000000000000000000006` |

### Risk Parameters

The agent uses these risk parameters:
- `maxSlippage`: 0.5% (configurable)
- `minProfitThreshold`: 1% (configurable)
- `riskTolerance`: low | medium | high

### Trust Signals

VeilTrader maintains reputation via:
- ERC-8004 identity (on-chain)
- Every trade logged to blockchain
- Reputation feedback system
- Self Protocol ZK proofs

### Payment Model

VeilTrader is a self-sustaining agent:
- Pays for own LLM inference (via Bankr)
- Funds gas from wallet
- Can receive Locus payments for services

## For Humans

See [README.md](README.md) for human-facing documentation.

## Contract Address

**Base Sepolia**: `0x0c7435e863D3a3365FEbe06F34F95f4120f71114`

[View on Basescan](https://sepolia.basescan.org/address/0x0c7435e863D3a3365FEbe06F34F95f4120f71114)

## Support

- GitHub: [github.com/veiltrader](https://github.com/veiltrader)
- ERC-8004 Registry: `0x8004A818BFB912233c491871b3d84c89A494BD9e`
