# Architecture Guide

Detailed system architecture for VeilTrader.

## System Overview

VeilTrader is built as a modular, event-driven autonomous agent with clear separation of concerns.

## Design Principles

1. **Privacy First**: No sensitive data leaves the system
2. **Autonomy**: Minimal human intervention after setup
3. **Verifiability**: All actions provable on-chain
4. **Modularity**: Easy to extend and modify
5. **Safety**: Multiple layers of risk protection

## Component Details

### 1. VeilTrader (Core Agent)

**Responsibilities:**
- Orchestrate the trading loop
- Manage component lifecycle
- Handle errors and recovery
- Coordinate between modules

**Key Methods:**
- `initialize()` - Setup all components
- `start()` - Begin autonomous loop
- `runCycle()` - Execute one trading cycle
- `stop()` - Graceful shutdown

### 2. Portfolio Analyzer

**Responsibilities:**
- Fetch token balances
- Calculate portfolio value
- Track asset allocation
- Monitor gas prices

**Data Sources:**
- On-chain balances (ERC20)
- Native ETH balance
- Price oracles (simplified in MVP)

### 3. Bankr Gateway

**Responsibilities:**
- Privacy-preserving LLM inference
- Portfolio analysis
- Trading recommendations
- Cost tracking

**Privacy Features:**
- No data retention
- Ephemeral processing
- Encrypted communication

### 4. Decision Engine

**Responsibilities:**
- Parse AI recommendations
- Calculate trade amounts
- Apply risk constraints
- Generate final decisions

**Decision Flow:**
1. Receive AI analysis
2. Calculate position size
3. Apply risk limits
4. Return decision object

### 5. Risk Engine

**Responsibilities:**
- Evaluate trade risk
- Check position limits
- Assess confidence thresholds
- Approve/reject trades

**Risk Factors:**
- Position size vs portfolio
- Confidence level
- Market conditions
- Gas costs

### 6. Uniswap Executor

**Responsibilities:**
- Execute trades on Uniswap V3
- Handle approvals
- Manage slippage
- Track transactions

**Integration Points:**
- Uniswap V3 Router
- Token contracts (ERC20)
- Base network

### 7. Identity Registry

**Responsibilities:**
- ERC-8004 identity management
- On-chain action logging
- Reputation tracking
- History storage

**Smart Contract:**
- Stores trade history
- Emits events for indexing
- Updates reputation scores

## Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Start     │────▶│  Analyze    │────▶│    AI       │
│   Cycle     │     │  Portfolio  │     │  Analysis   │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                                 │
┌─────────────┐     ┌─────────────┐     ┌──────▼──────┐
│   Update    │◀────│  Execute    │◀────│   Decide    │
│   Identity  │     │   Trade     │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │
       ▼
┌─────────────┐
│    Wait     │
│  5 Minutes  │
└─────────────┘
```

## Security Architecture

### Threat Model

| Threat | Mitigation |
|--------|-----------|
| Key exposure | Environment variables, never committed |
| API key theft | Rate limiting, testnet only |
| Smart contract bugs | Minimal logic, tested patterns |
| Front-running | Private mempool, testnet |
| Price manipulation | Use oracles, slippage protection |

### Safety Mechanisms

1. **Risk Limits**: Max position sizes, confidence thresholds
2. **Circuit Breakers**: Stop on repeated failures
3. **Testnet First**: All testing on Base Sepolia
4. **Manual Override**: Can stop agent anytime

## Scalability Considerations

### Current Limitations

- Single wallet operation
- Fixed trading pairs
- Simple risk model
- No persistence layer

### Future Improvements

- Multi-wallet support
- Dynamic pair selection
- ML-based risk models
- Database for history
- Web dashboard
- Mobile notifications

## Integration Points

### External Services

| Service | Purpose | Status |
|---------|---------|--------|
| Bankr | LLM inference | Required |
| Uniswap | DEX execution | Required |
| Base | Blockchain | Required |
| Etherscan | Verification | Optional |

### Smart Contracts

| Contract | Purpose | Network |
|----------|---------|---------|
| VeilTrader.sol | Trade history | Base Sepolia |
| ERC-8004 | Identity registry | Base Mainnet |
| Uniswap V3 | DEX | Base |

## Deployment Architecture

```
┌─────────────────────────────────────┐
│           User Machine              │
│  ┌───────────────────────────────┐  │
│  │      VeilTrader Agent        │  │
│  │  ┌─────┐ ┌─────┐ ┌─────┐   │  │
│  │  │Core │ │Risk │ │Exec │   │  │
│  │  └─────┘ └─────┘ └─────┘   │  │
│  └───────────────────────────────┘  │
│              │                      │
│              ▼                      │
│  ┌───────────────────────────────┐  │
│  │         .env file             │  │
│  │  (API keys, private key)      │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│         External Services         │
│  ┌─────────┐  ┌───────────────┐   │
│  │  Bankr  │  │   Uniswap     │   │
│  │ Gateway │  │     API       │   │
│  └────┬────┘  └───────┬───────┘   │
│       │               │           │
│       ▼               ▼           │
│  ┌─────────────────────────────┐   │
│  │      Base Network         │   │
│  │  ┌─────┐    ┌─────────┐   │   │
│  │  │Veil │◀──▶│Uniswap │   │   │
│  │  │Trad │    │   V3   │   │   │
│  │  └─────┘    └─────────┘   │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

## Event-Driven Design

The agent uses events for loose coupling:

```javascript
// Trade executed event
agent.on('trade', (trade) => {
  console.log(`Trade: ${trade.action} ${trade.amount}`);
});

// Error event
agent.on('error', (error) => {
  console.error('Agent error:', error);
});

// Cycle complete event
agent.on('cycle', (result) => {
  console.log('Cycle complete:', result);
});
```

## State Management

### Runtime State

- Portfolio snapshot
- Current positions
- Pending transactions
- Agent status

### Persistent State

- Trade history (on-chain)
- Identity data (on-chain)
- Configuration (.env)
- Logs (files)

## Error Handling Strategy

### Levels

1. **Component Level**: Individual module errors
2. **Cycle Level**: Trading cycle failures
3. **Agent Level**: Fatal errors requiring restart

### Recovery

- Automatic retry with backoff
- Graceful degradation
- Circuit breaker pattern
- Manual intervention option

## Monitoring

### Metrics

- Portfolio value over time
- Trade success rate
- Gas costs
- API latency
- Error rates

### Alerts

- Large trades executed
- Repeated failures
- Unusual gas prices
- API quota warnings

---

*For implementation details, see source code in `/src`*
