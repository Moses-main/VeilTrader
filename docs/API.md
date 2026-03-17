# API Reference

Complete API documentation for VeilTrader.

## Table of Contents

- [Core Agent API](#core-agent-api)
- [Analysis Module](#analysis-module)
- [Execution Module](#execution-module)
- [Identity Module](#identity-module)
- [Service Module](#service-module)

---

## Core Agent API

### VeilTrader

Main agent class that orchestrates all components.

#### Constructor

```javascript
const agent = new VeilTrader(config);
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `bankrApiKey` | string | Yes | Bankr LLM Gateway API key |
| `uniswapApiKey` | string | Yes | Uniswap Developer API key |
| `privateKey` | string | Yes | Wallet private key |
| `rpcUrl` | string | Yes | RPC endpoint URL |
| `agentId` | string | Yes | ERC-8004 agent ID |
| `teamId` | string | Yes | Synthesis team ID |

#### Methods

##### `initialize()`

Sets up all components and connections.

```javascript
await agent.initialize();
```

**Returns:** `Promise<void>`

**Throws:**
- `Error` - If initialization fails

---

##### `start()`

Begins the autonomous trading loop.

```javascript
await agent.start();
```

**Returns:** `Promise<void>`

**Note:** Runs indefinitely until `stop()` is called.

---

##### `stop()`

Stops the trading loop gracefully.

```javascript
agent.stop();
```

**Returns:** `void`

---

##### `runCycle()`

Executes a single trading cycle.

```javascript
await agent.runCycle();
```

**Returns:** `Promise<void>`

---

## Analysis Module

### PortfolioAnalyzer

Analyzes DeFi portfolio positions.

#### Methods

##### `analyze()`

Fetches and analyzes current portfolio.

```javascript
const portfolio = await analyzer.analyze();
```

**Returns:** `Portfolio`

```typescript
interface Portfolio {
  address: string;
  totalValue: number;
  assets: Asset[];
  allocation: Record<string, number>;
  gasPrice: string;
  timestamp: number;
}

interface Asset {
  symbol: string;
  address: string | null;
  balance: number;
  value: number;
  price: number;
}
```

---

### RiskEngine

Evaluates risk for trading decisions.

#### Methods

##### `evaluate(decision, portfolio)`

Assesses risk of a proposed trade.

```javascript
const assessment = riskEngine.evaluate(decision, portfolio);
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `decision` | Decision | Trade decision to evaluate |
| `portfolio` | Portfolio | Current portfolio state |

**Returns:** `RiskAssessment`

```typescript
interface RiskAssessment {
  approved: boolean;
  risks: string[];
  riskScore: number;
  maxPositionSize: number;
  recommendedAction: 'PROCEED' | 'REJECT';
}
```

---

### DecisionEngine

Makes trading decisions based on AI analysis.

#### Methods

##### `decide(portfolio, analysis)`

Generates trading decision.

```javascript
const decision = await decisionEngine.decide(portfolio, analysis);
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `portfolio` | Portfolio | Current portfolio |
| `analysis` | AIAnalysis | AI recommendation |

**Returns:** `Decision`

```typescript
interface Decision {
  action: 'HOLD' | 'BUY' | 'SELL';
  confidence: number;
  reasoning: string;
  riskLevel: 'low' | 'medium' | 'high';
  targetAsset?: string;
  targetAmount?: number;
  timestamp: number;
}

interface AIAnalysis {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  recommendation: 'HOLD' | 'BUY' | 'SELL';
  confidence: number;
  reasoning: string;
  targetAsset?: string;
  targetAmount?: string;
  riskLevel: 'low' | 'medium' | 'high';
}
```

---

## Execution Module

### UniswapExecutor

Executes trades on Uniswap V3.

#### Methods

##### `execute(decision)`

Executes a trade decision.

```javascript
const result = await executor.execute(decision);
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `decision` | Decision | Trade to execute |

**Returns:** `ExecutionResult`

```typescript
interface ExecutionResult {
  txHash: string;
  action: 'BUY' | 'SELL';
  tokenIn: string;
  tokenOut: string;
  amountIn: number;
  amountOut: string;
  gasUsed: string;
}
```

**Throws:**
- `Error` - If trade execution fails

---

##### `getQuote(tokenIn, tokenOut, amountIn)`

Gets price quote from Uniswap.

```javascript
const quote = await executor.getQuote(tokenIn, tokenOut, amountIn);
```

**Returns:** `Quote`

```typescript
interface Quote {
  expectedOutput: string;
  amountOutMinimum: string;
}
```

---

## Identity Module

### IdentityRegistry

Manages ERC-8004 on-chain identity.

#### Methods

##### `register()`

Registers agent on-chain.

```javascript
await identityRegistry.register();
```

**Returns:** `Promise<void>`

---

##### `logAction(actionType, metadata)`

Logs an action to on-chain registry.

```javascript
const result = await identityRegistry.logAction('BUY', {
  token: 'WETH',
  amount: 0.5,
  txHash: '0x...'
});
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `actionType` | string | Type of action |
| `metadata` | object | Action details |

**Returns:** `ActionLog`

```typescript
interface ActionLog {
  txHash?: string;
  actionHash: string;
  timestamp: number;
  offChain?: boolean;
}
```

---

##### `getReputation()`

Gets agent reputation score.

```javascript
const reputation = await identityRegistry.getReputation();
```

**Returns:** `Reputation`

```typescript
interface Reputation {
  score: string;
  actionCount: string;
}
```

---

## Service Module

### BankrGateway

Privacy-preserving LLM inference.

#### Methods

##### `analyzePortfolio(portfolio)`

Gets AI analysis of portfolio.

```javascript
const analysis = await bankrGateway.analyzePortfolio(portfolio);
```

**Returns:** `AIAnalysis`

---

##### `getBalance()`

Checks Bankr wallet balance.

```javascript
const balance = await bankrGateway.getBalance();
```

**Returns:** `Balance | null`

---

## Smart Contract API

### VeilTrader.sol

#### Functions

##### `executeTrade`

```solidity
function executeTrade(
  string memory _actionType,
  address _tokenIn,
  address _tokenOut,
  uint256 _amountIn,
  uint256 _amountOut,
  string memory _metadata
) external onlyOwner returns (bytes32 actionHash)
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `_actionType` | string | "BUY", "SELL", or "HOLD" |
| `_tokenIn` | address | Input token address |
| `_tokenOut` | address | Output token address |
| `_amountIn` | uint256 | Input amount |
| `_amountOut` | uint256 | Output amount |
| `_metadata` | string | JSON metadata |

**Returns:** `bytes32` - Action hash

---

##### `getTrade`

```solidity
function getTrade(bytes32 _actionHash) external view returns (Trade memory)
```

**Returns:**

```solidity
struct Trade {
  bytes32 actionHash;
  string actionType;
  address tokenIn;
  address tokenOut;
  uint256 amountIn;
  uint256 amountOut;
  uint256 timestamp;
  string metadata;
}
```

---

## Events

### TradeExecuted

```solidity
event TradeExecuted(
  bytes32 indexed actionHash,
  string actionType,
  address tokenIn,
  address tokenOut,
  uint256 amountIn,
  uint256 amountOut,
  uint256 timestamp
);
```

### IdentityUpdated

```solidity
event IdentityUpdated(bytes32 indexed agentId, string metadata);
```

---

## Error Codes

| Code | Description | Resolution |
|------|-------------|------------|
| `E001` | Initialization failed | Check API keys and RPC URL |
| `E002` | Trade execution failed | Check gas and token approvals |
| `E003` | Risk check failed | Adjust risk parameters |
| `E004` | API rate limit | Wait and retry |
| `E005` | Insufficient funds | Get testnet ETH |

---

## Rate Limits

| Service | Limit | Window |
|---------|-------|--------|
| Bankr Gateway | 100 | per minute |
| Uniswap API | 1000 | per hour |
| Base RPC | 100000 | per day |

---

*For more details, see source code and inline documentation.*
