# VeilTrader 🤖💰

<p align="center">
  <img src="public/VeilTrader_with_text.png" alt="VeilTrader Logo" width="400"/>
</p>

> **Privacy-first autonomous AI trading agent on Base**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Base](https://img.shields.io/badge/Base-Sepolia-blue)](https://base.org)
[![ERC-8004](https://img.shields.io/badge/ERC--8004-Compliant-green)](https://eips.ethereum.org/EIPS/eip-8004)

VeilTrader is a fully autonomous, privacy-first AI trading agent that lives on Ethereum (Base). It privately analyzes DeFi portfolios using a no-data-retention LLM, makes risk-aware trade decisions, executes real Uniswap V3 swaps on-chain, and publishes verifiable transaction proofs.

## 🏆 Hackathon Submission

**Event:** The Synthesis Hackathon 2026  
**Team:** Moses Sunday + Stealth (AI Agent)  
**Registration:** [View on BaseScan](https://basescan.org/tx/0x507666986454a08edf2dbdcb621aa622b5f9484e54f23b16941cdbe30465f039)

### Tracks Submitted

| Track | Prize Pool | Fit |
|-------|-----------|-----|
| **Agents With Receipts — ERC-8004** | $4,000 | ✅ On-chain identity & reputation |
| **Let the Agent Cook** | $4,000 | ✅ Fully autonomous end-to-end |
| **Best Bankr LLM Gateway** | $3,000 | ✅ Self-paying inference |
| **Agentic Finance (Uniswap)** | $2,500 | ✅ Real DEX execution |
| **Agents that pay** | $1,000 | ✅ Creditworthy autonomous agent |

## 📋 Table of Contents

- [Architecture](#-architecture)
- [System Flow](#-system-flow)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

## 🏗️ Architecture

### High-Level System Architecture

```mermaid
flowchart TB
    subgraph External["🌐 External Services"]
        BG["🤖 Bankr LLM<br/>llm.bankr.bot"]
        UNI["💱 Uniswap V3<br/>api.uniswap.org"]
        ST["📦 OpenServ<br/>openserv.ai"]
        OL["🏪 Olas<br/>olas.network"]
    end

    subgraph BaseNet["⛓️ Base Sepolia (Chain 84532)"]
        direction TB
        subgraph Contracts["📜 Smart Contracts"]
            VC["🔐 VeilTrader<br/>0x0c7435..."]
            ERC8["📋 ERC-8004<br/>0x8004A8..."]
            ERC8R["⭐ Reputation<br/>0x8004B6..."]
        end
        subgraph Storage["💾 On-Chain Storage"]
            TH["📊 Trade History"]
            ID["🆔 Identity"]
            REP["🏅 Reputation"]
        end
    end

    subgraph CeloNet["🌉 Celo Sepolia (Chain 44787)"]
        CC["🤖 Celo Contract"]
        CELO["💰 CELO/cUSD"]
    end

    subgraph Agent["🤖 VeilTrader Agent"]
        direction TB
        subgraph Analysis["📊 Analysis Layer"]
            PA["💼 Portfolio Analyzer"]
            RE["⚖️ Risk Engine"]
            DE["🎯 Decision Engine"]
        end

        subgraph Execution["⚡ Execution Layer"]
            UE["💱 Uniswap Executor"]
            CE["🔄 Celo Executor"]
            STX["📦 Storage Executor"]
        end

        subgraph Identity["🔑 Identity Layer"]
            IR["📋 Identity Registry"]
            PROOF["🔐 ZK Proofs"]
        end
    end

    subgraph Storage["📦 Decentralized Storage"]
        STORACHA["🗄️ Storacha<br/>z6MkrVM..."]
        IPFS["🪐 IPFS/Filecoin"]
    end

    %% External to Agent
    BG <-->|"AI Analysis"| DE
    UNI <-->|"Quotes & Swaps"| UE

    %% Agent to Base
    UE <-->|"Execute & Log"| VC
    IR <-->|"Register & Update"| ERC8
    IR <-->|"Reputation"| ERC8R

    %% Contract internals
    VC --> TH
    VC --> ID
    ERC8 --> REP

    %% Celo integration
    CE <-->|"Cross-Chain"| CeloNet
    CC <-->|"CELO Trading"| CELO

    %% Storage
    STX <-->|"Trade History"| STORACHA
    STX <-->|"Metadata"| IPFS

    %% OpenServ
    ST <-->|"Agent Services"| Agent

    %% Style
    style Agent fill:#1a1a2e,color:#fff
    style BaseNet fill:#0044cc,color:#fff
    style External fill:#ff6b35,color:#fff
    style CeloNet fill:#fbcc33,color:#000
    style Storage fill:#00d4aa,color:#000
```

### Complete Trading Decision Flow

```mermaid
sequenceDiagram
    autonumber
    participant User as 👤 User
    participant Agent as 🤖 VeilTrader
    participant PA as 📊 Portfolio<br/>Analyzer
    participant BG as 🤖 Bankr LLM
    participant DE as 🎯 Decision<br/>Engine
    participant RE as ⚖️ Risk<br/>Engine
    participant UE as 💱 Uniswap<br/>Executor
    participant VC as 🔐 VeilTrader<br/>Contract
    participant ERC8 as 📋 ERC-8004<br/>Registry

    rect rgb(30, 30, 50)
        Note over User,ERC8: 🔄 TRADING CYCLE (Every 5 minutes)
        
        Agent->>PA: 1. Analyze Portfolio
        PA->>Agent: Portfolio Data
        
        Agent->>BG: 2. Request AI Analysis
        BG->>Agent: Trading Recommendation
        
        Agent->>DE: 3. Make Decision
        DE->>DE: Evaluate Options
        
        alt ✅ Trade Recommended
            Agent->>RE: 4. Risk Assessment
            RE->>Agent: Risk Report
            
            alt ✅ Risk Approved
                Agent->>UE: 5. Execute Trade
                UE->>VC: Submit Transaction
                VC-->>UE: Tx Receipt
                UE-->>Agent: Execution Result
                
                Agent->>VC: 6. Log Trade On-Chain
                Agent->>ERC8: 7. Update Identity
                
                Note over Agent,ERC8: ✅ Trade Complete
            else ❌ Risk Rejected
                Agent->>Agent: Switch to HOLD
                Note over Agent: 🛡️ Risk Guard Activated
            end
        else ⏸️ No Trade
            Agent->>VC: Log HOLD Decision
            Note over Agent: ⏸️ No Action Taken
        end
    end

    rect rgb(50, 20, 20)
        Note over User,ERC8: 📈 EXTENSION CYCLE
        Agent->>Agent: Check Celo Opportunities
        Agent->>Agent: Check OpenServ Services
        Agent->>Agent: Update Filecoin Storage
    end
```

### Cross-Chain Architecture

```mermaid
flowchart LR
    subgraph Base["⛓️ Base Sepolia"]
        direction TB
        B1["💰 ETH/USDC"]
        B2["🔐 VeilTrader Contract"]
        B3["📋 ERC-8004 Identity"]
        B4["⭐ Reputation System"]
    end

    subgraph Celo["🌉 Celo Sepolia"]
        direction TB
        C1["💰 CELO/cUSD"]
        C2["🤖 Celo Executor"]
        C3["🌉 Mento Bridge"]
    end

    subgraph Storage["📦 Decentralized"]
        direction TB
        S1["🗄️ Storacha"]
        S2["🪐 IPFS/Filecoin"]
    end

    subgraph Services["🔗 External"]
        direction TB
        SV1["🤖 Bankr LLM"]
        SV2["💱 Uniswap V3"]
        SV3["📦 OpenServ"]
    end

    B1 <-->|"Bridge"| C1
    B2 <-->|"Log Trades"| B3
    B3 <-->|"Build Reputation"| B4
    
    C2 -->|"Execute"| C1
    C2 -->|"Bridge Back"| B1
    
    B2 -->|"Store History"| S1
    B2 -->|"IPFS Metadata"| S2
    
    SV1 -->|"AI Analysis"| B2
    SV2 -->|"DEX Swaps"| B2
    SV3 -->|"Discover Services"| B2

    style Base fill:#0044cc,color:#fff
    style Celo fill:#fbcc33,color:#000
    style Storage fill:#00d4aa,color:#000
    style Services fill:#ff6b35,color:#fff
```

### Component Architecture

```mermaid
flowchart TB
    subgraph VeilTrader["🤖 VeilTrader Agent"]
        direction TB
        
        subgraph Core["⚙️ Core Engine"]
            VT["🎛️ VeilTrader.js<br/>Main Orchestrator"]
            CFG["⚙️ Configuration<br/>.env loader"]
        end

        subgraph AnalysisLayer["📊 Analysis Layer"]
            PA["💼 Portfolio Analyzer<br/>Fetches balances & values"]
            RE["⚖️ Risk Engine<br/>Evaluates risk level"]
            DE["🎯 Decision Engine<br/>Makes trading decisions"]
        end

        subgraph ExecutionLayer["⚡ Execution Layer"]
            UE["💱 Uniswap Executor<br/>Executes V3 swaps"]
            CE["🌉 Celo Executor<br/>Cross-chain trades"]
            STX["📦 Storage Executor<br/>Filecoin/Storacha"]
        end

        subgraph IdentityLayer["🔑 Identity Layer"]
            IR["📋 Identity Registry<br/>ERC-8004 integration"]
            PROOF["🔐 ZK Proofs<br/>Self Protocol"]
            Locus["💸 Locus Payments<br/>Agent-native payments"]
        end

        subgraph ServiceLayer["🌐 External Services"]
            BG["🤖 Bankr Gateway<br/>LLM inference"]
            META["🛡️ MetaMask<br/>Delegations"]
            OPENSERV["📦 OpenServ<br/>x402 services"]
        end
    end

    VT --> CFG
    VT --> AnalysisLayer
    VT --> ExecutionLayer
    VT --> IdentityLayer
    VT --> ServiceLayer

    AnalysisLayer -->|"Analysis"| DE
    DE -->|"Decision"| RE
    RE -->|"Approved"| UE
    UE -->|"Swap"| META

    style VeilTrader fill:#1a1a2e,color:#fff
    style Core fill:#16213e,color:#fff
    style AnalysisLayer fill:#0f3460,color:#fff
    style ExecutionLayer fill:#533483,color:#fff
    style IdentityLayer fill:#e94560,color:#fff
    style ServiceLayer fill:#ff6b35,color:#fff
```

### Agent-to-Agent Communication

```mermaid
flowchart TB
    subgraph OtherAgents["🤖 Other AI Agents"]
        OA1["DeFi Agent A"]
        OA2["Trading Agent B"]
        OA3["Research Agent C"]
    end

    subgraph VeilTraderAPI["🔌 VeilTrader API"]
        API1["GET /status"]
        API2["POST /trade"]
        API3["GET /portfolio"]
        API4["GET /history"]
    end

    subgraph MCP["📡 MCP Server"]
        MCP1["get_status"]
        MCP2["execute_trade"]
        MCP3["get_portfolio"]
        MCP4["get_trade_history"]
    end

    subgraph Contracts["⛓️ On-Chain Discovery"]
        ERC8004["📋 ERC-8004<br/>Identity Registry"]
        OLAS["🏪 Olas<br/>Agent Marketplace"]
    end

    OA1 -->|"REST API"| API1
    OA2 -->|"MCP Protocol"| MCP2
    OA3 -->|"Query"| API3

    API1 --> MCP1
    API2 --> MCP2
    API3 --> MCP3

    VeilTraderAPI --> ERC8004
    MCP --> ERC8004

    OLAS -->|"Discover"| VeilTraderAPI

    style VeilTraderAPI fill:#0044cc,color:#fff
    style MCP fill:#00d4aa,color:#000
    style OtherAgents fill:#ff6b35,color:#fff
    style Contracts fill:#533483,color:#fff
```

## 🔄 System Flow

### Autonomous Trading Loop

```mermaid
sequenceDiagram
    autonumber
    participant User as 👤 User
    participant Agent as 🤖 VeilTrader
    participant PA as 📊 Portfolio<br/>Analyzer
    participant BG as 🤖 Bankr LLM
    participant DE as 🎯 Decision<br/>Engine
    participant RE as ⚖️ Risk<br/>Engine
    participant UE as 💱 Uniswap<br/>V3
    participant VC as 🔐 VeilTrader<br/>Contract
    participant ERC8 as 📋 ERC-8004<br/>Registry

    loop Every 5 Minutes (Configurable)
        Agent->>PA: 1. Analyze Portfolio
        PA-->>Agent: Portfolio Data
        
        Agent->>BG: 2. Get AI Analysis
        BG-->>Agent: Trading Signal
        
        Agent->>DE: 3. Make Decision
        DE-->>Agent: Action: BUY/SELL/HOLD
        
        alt Action = BUY or SELL
            Agent->>RE: 4. Risk Check
            RE-->>Agent: Risk Assessment
            
            alt Risk = APPROVED
                Agent->>UE: 5. Execute Swap
                UE-->>Agent: Tx Receipt
                
                Agent->>VC: 6. Log Trade
                VC-->>Agent: Confirmed
                
                Agent->>ERC8: 7. Update Reputation
                ERC8-->>Agent: Reputation Updated
            else Risk = REJECTED
                Agent->>Agent: Switch to HOLD
            end
        else Action = HOLD
            Agent->>VC: Log HOLD Decision
        end
        
        Note over Agent: ✅ Cycle Complete
    end
```

### Decision Flow (Detailed)

```mermaid
flowchart TD
    START([🚀 Start Cycle]) --> ANALYZE[📊 Analyze Portfolio]
    
    ANALYZE --> AI[🤖 Get AI Analysis<br/>from Bankr]
    
    AI --> DECIDE{Decision?}
    
    DECIDE -->|HOLD| HOLD_LOG[📝 Log HOLD<br/>to Contract]
    HOLD_LOG --> END
    
    DECIDE -->|BUY/SELL| CALC[📐 Calculate<br/>Trade Amount]
    
    CALC --> RISK{⚖️ Risk Check}
    
    RISK -->|LOW RISK| EXEC[⚡ Execute Trade]
    RISK -->|HIGH RISK| REJECT[🛡️ Reject Trade]
    
    REJECT --> HOLD[⏸️ Switch to HOLD]
    HOLD --> HOLD_LOG2[📝 Log HOLD]
    HOLD_LOG2 --> END
    
    EXEC --> UNISWAP[💱 Submit to Uniswap]
    UNISWAP --> CONFIRM{✅ Confirmed?}
    
    CONFIRM -->|YES| ONCHAIN[⛓️ Log to Contract]
    CONFIRM -->|NO| RETRY[🔄 Retry?<br/>Max 3]
    
    RETRY -->|YES| EXEC
    RETRY -->|NO| FAIL[❌ Log Failure]
    FAIL --> END
    
    ONCHAIN --> ERC8004[📋 Update ERC-8004]
    ERC8004 --> CELO{🌉 Celo<br/>Enabled?}
    
    CELO -->|YES| CELO_CHECK[🔍 Check Celo<br/>Opportunities]
    CELO_CHECK --> CELO_EXEC[🌉 Execute Celo<br/>Trade]
    CELO_EXEC --> STORAGE[📦 Store History]
    
    CELO -->|NO| STORAGE
    
    STORAGE --> END([✅ Cycle Complete])
    
    STORAGE --> WAIT[⏳ Wait 5 min]
    WAIT --> START
    
    %% Styling
    style START fill:#00d4aa,color:#000
    style END fill:#00d4aa,color:#000
    style EXEC fill:#0044cc,color:#fff
    style HOLD fill:#fbcc33,color:#000
    style REJECT fill:#e94560,color:#fff
    style CELO fill:#fbcc33,color:#000
```

### Cross-Chain Flow

```mermaid
flowchart TB
    subgraph Base["⛓️ Base Sepolia"]
        B_START[📊 Start Cycle]
        B_ANALYZE[🤖 AI Analysis]
        B_DECIDE[🎯 Make Decision]
        B_TRADE[💱 Execute Uniswap]
        B_LOG[⛓️ Log to Contract]
    end

    subgraph ERC8004["📋 ERC-8004 Identity"]
        E_REGISTER[🆔 Register Identity]
        E_UPDATE[⭐ Update Reputation]
        E_PROOF[🔐 Submit ZK Proof]
    end

    subgraph Celo["🌉 Celo Sepolia"]
        C_CHECK{🌉 Check Celo<br/>Opportunities?}
        C_BALANCE[💰 Check CELO<br/>Balance]
        C_TRADE[💱 Swap CELO<br/>→ cUSD]
        C_BRIDGE[🌉 Bridge to<br/>Base]
    end

    subgraph Storage["📦 Decentralized Storage"]
        S_STORACHA[🗄️ Storacha<br/>Trade History]
        S_IPFS[🪐 IPFS<br/>Metadata]
    end

    B_START --> B_ANALYZE
    B_ANALYZE --> B_DECIDE
    B_DECIDE --> B_TRADE
    B_TRADE --> B_LOG
    B_LOG --> E_REGISTER
    E_REGISTER --> E_UPDATE
    E_UPDATE --> E_PROOF
    E_PROOF --> C_CHECK
    C_CHECK -->|Yes| C_BALANCE
    C_BALANCE --> C_TRADE
    C_TRADE --> C_BRIDGE
    C_BRIDGE --> S_STORACHA
    C_CHECK -->|No| S_STORACHA
    S_STORACHA --> S_IPFS
    
    style Base fill:#0044cc,color:#fff
    style ERC8004 fill:#e94560,color:#fff
    style Celo fill:#fbcc33,color:#000
    style Storage fill:#00d4aa,color:#000
```

## ✨ Features

### 🔒 Privacy-First Design
- **No data retention**: Bankr Gateway ensures LLM calls don't persist data
- **Private reasoning**: All AI analysis stays confidential
- **Verifiable outputs**: Only transaction proofs are published

### 🤖 Full Autonomy
- **End-to-end loop**: Analyze → Decide → Execute → Verify
- **No human intervention**: Runs 24/7 after initial setup
- **Self-paying**: Agent funds its own inference costs

### ⛓️ On-Chain Identity
- **ERC-8004 compliant**: Standardized agent identity
- **Reputation tracking**: Every action builds on-chain history
- **Verifiable proofs**: All trades cryptographically provable

### 💱 Real Execution
- **Uniswap V3**: Direct DEX integration
- **Base Network**: Low-cost, fast finality
- **Testnet ready**: Safe testing environment

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- Base Sepolia ETH ([faucet](https://www.base.org/faucet))
- Bankr API key ([get one](https://bankr.bot))
- Uniswap API key ([get one](https://developer.uniswap.org))

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd veiltrader

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your keys
nano .env
```

### Configuration

Edit `.env`:

```env
# Required API Keys
BANKR_API_KEY=your_bankr_key_here           # https://llm.bankr.bot (add credits!)
UNISWAP_API_KEY=your_uniswap_key_here        # https://developer.uniswap.org

# Wallet (Base Sepolia testnet)
PRIVATE_KEY=your_private_key_here
RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
CHAIN_ID=84532

# Agent Identity (from Synthesis registration)
AGENT_ID=587a0768c387481aa3eee090644cbe77
TEAM_ID=b384a9348bf944a684deae5dcc2a0f28

# Contract Addresses
VEILTRADER_CONTRACT=0x0c7435e863D3a3365FEbe06F34F95f4120f71114

# Risk Parameters
MAX_SLIPPAGE=0.005
MIN_PROFIT_THRESHOLD=0.01
RISK_TOLERANCE=medium

# Extensions (enable by setting to true)
ENABLE_CELO=true
ENABLE_STETH=false
ENABLE_STATUS_NETWORK=false
ENABLE_LIDO_MCP=false
ENABLE_ENS=false

# Celo Configuration
CELO_RPC_URL=https://celo-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
CELO_AUTO_EXECUTE=true
```

### Deploy Smart Contract

```bash
# Install Foundry dependencies
forge install foundry-rs/forge-std

# Deploy to Base Sepolia (requires PRIVATE_KEY and AGENT_ID in .env)
forge script script/Deploy.s.sol --rpc-url baseSepolia --broadcast --verify

# Update .env with deployed contract address
VEILTRADER_CONTRACT=0x0c7435e863D3a3365FEbe06F34F95f4120f71114
```

### Run the Agent

```bash
# Start the autonomous agent
npm start

# Or run in development mode with auto-reload
npm run dev
```

---

## 🤖 For AI Agents

VeilTrader can be controlled by other AI agents via its API. Here's how to use it:

### Agent-to-Agent Communication

```javascript
// Example: Call VeilTrader from another agent
const response = await fetch('http://localhost:3000/api/status');
const status = await response.json();

// Execute a trade request
const tradeResult = await fetch('http://localhost:3000/api/trade', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'BUY',
    targetAsset: 'WETH',
    amount: 0.01
  })
});
```

### MCP Server

VeilTrader exposes an MCP (Model Context Protocol) server for seamless agent integration:

```json
{
  "name": "veiltrader",
  "description": "Privacy-first autonomous trading agent",
  "tools": [
    {
      "name": "get_status",
      "description": "Get VeilTrader agent status",
      "input_schema": { "type": "object", "properties": {} }
    },
    {
      "name": "execute_trade",
      "description": "Request a trade execution",
      "input_schema": {
        "type": "object",
        "properties": {
          "action": { "type": "string", "enum": ["BUY", "SELL"] },
          "targetAsset": { "type": "string" },
          "amount": { "type": "number" }
        },
        "required": ["action", "targetAsset", "amount"]
      }
    },
    {
      "name": "get_portfolio",
      "description": "Get current portfolio analysis",
      "input_schema": { "type": "object", "properties": {} }
    },
    {
      "name": "get_trade_history",
      "description": "Get on-chain trade history",
      "input_schema": { "type": "object", "properties": {} }
    }
  ]
}
```

### Skill File

VeilTrader can be used as a skill by other AI agents. Include in your agent's skill file:

```yaml
name: veiltrader
description: Privacy-first autonomous AI trading agent on Base
capabilities:
  - defi_trading
  - portfolio_management
  - risk_analysis
  - erc8004_identity
endpoints:
  status: /api/status
  trade: /api/trade
  portfolio: /api/portfolio
```

---

## 👤 For Humans

### Monitoring Your Agent

```bash
# View real-time logs
tail -f logs/combined.log

# View error logs
tail -f logs/error.log

# Check agent status
curl http://localhost:3000/api/status
```

### Managing Trades

1. **Check Portfolio**: Visit the agent's dashboard or call `/api/portfolio`
2. **Review Trades**: All trades are recorded on-chain at `VEILTRADER_CONTRACT`
3. **Withdraw Funds**: Access your wallet directly - the agent doesn't hold funds

### Risk Management

The agent uses configurable risk parameters:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `MAX_SLIPPAGE` | 0.5% | Maximum slippage tolerance |
| `MIN_PROFIT_THRESHOLD` | 1% | Minimum profit before execution |
| `RISK_TOLERANCE` | medium | low, medium, or high |

### Stopping the Agent

```bash
# Stop the agent
pkill -f "node src/index.js"

# Or use the API
curl -X POST http://localhost:3000/api/stop
```

---

## 📁 Project Structure

```
veiltrader/
├── 📄 README.md                 # This file
├── 📄 LICENSE                   # MIT License
├── 📄 CONTRIBUTING.md           # Contribution guidelines
├── 📄 SUPPORT.md                # Support & troubleshooting
├── 📄 SKILL.md                  # Agent skill file
│
├── 📁 src/                      # Source code
│   ├── 📁 agent/                # Core agent
│   │   └── VeilTrader.js        # Main orchestrator
│   ├── 📁 analysis/             # Analysis modules
│   │   ├── PortfolioAnalyzer.js # Portfolio analysis
│   │   ├── RiskEngine.js        # Risk assessment
│   │   └── DecisionEngine.js     # Trading decisions
│   ├── 📁 execution/            # Trade execution
│   │   ├── UniswapExecutor.js   # Uniswap V3 integration
│   │   └── VeilTraderContract.js # Contract interface
│   ├── 📁 identity/             # On-chain identity
│   │   └── IdentityRegistry.js   # ERC-8004 registry
│   ├── 📁 services/             # External services
│   │   └── BankrGateway.js      # Bankr LLM integration
│   ├── 📁 extensions/            # Extension modules
│   │   ├── StETHTreasury.js     # stETH yield management
│   │   ├── StatusNetwork.js     # Gasless transactions
│   │   ├── OlasMarketplace.js   # Olas integration
│   │   ├── LidoMCP.js          # Lido MCP server
│   │   ├── OpenServ.js          # OpenServ x402
│   │   ├── FilecoinStorage.js   # IPFS storage
│   │   ├── ENSIntegration.js   # ENS identity
│   │   └── CeloIntegration.js   # Celo network
│   ├── 📁 utils/                # Utilities
│   │   └── logger.js            # Logging
│   └── index.js                 # Entry point
│
├── 📁 contracts/                # Smart contracts (Foundry)
│   └── VeilTrader.sol           # Trade history + ERC-8004 + Delegations + Locus + Self ID
│
├── 📁 script/                   # Foundry deployment scripts
│   └── Deploy.s.sol              # Contract deployment
│
├── 📁 test/                     # Foundry tests
│   └── VeilTrader.t.sol          # 29 contract tests
│
├── 📁 docs/                     # Additional documentation
│   ├── ARCHITECTURE.md          # Detailed architecture
│   ├── API.md                   # API reference
│   └── SECURITY.md              # Security considerations
│
├── ⚙️ foundry.toml            # Foundry configuration
├── 📦 package.json              # Dependencies
└── 🔒 .env                     # Environment variables
```
veiltrader/
├── 📄 README.md                 # This file
├── 📄 LICENSE                   # MIT License
├── 📄 CONTRIBUTING.md           # Contribution guidelines
├── 📄 SUPPORT.md                # Support & troubleshooting
│
├── 📁 src/                      # Source code
│   ├── 📁 agent/                # Core agent
│   │   └── VeilTrader.js        # Main orchestrator
│   ├── 📁 analysis/             # Analysis modules
│   │   ├── PortfolioAnalyzer.js # Portfolio analysis
│   │   ├── RiskEngine.js        # Risk assessment
│   │   └── DecisionEngine.js    # Trading decisions
│   ├── 📁 execution/            # Trade execution
│   │   └── UniswapExecutor.js   # Uniswap V3 integration
│   ├── 📁 identity/             # On-chain identity
│   │   └── IdentityRegistry.js  # ERC-8004 registry
│   ├── 📁 services/             # External services
│   │   └── BankrGateway.js      # Bankr LLM integration
│   ├── 📁 utils/                # Utilities
│   │   └── logger.js            # Logging
│   └── index.js                 # Entry point
│
├── 📁 contracts/                # Smart contracts (Foundry)
│   └── VeilTrader.sol           # Trade history contract
│
├── 📁 script/                   # Foundry deployment scripts
│   └── Deploy.s.sol             # Contract deployment
│
├── 📁 test/                     # Foundry tests
│   └── VeilTrader.t.sol          # Contract tests
│
├── 📁 docs/                     # Additional documentation
│   ├── ARCHITECTURE.md          # Detailed architecture
│   ├── API.md                   # API reference
│   └── SECURITY.md              # Security considerations
│
├── ⚙️ foundry.toml            # Foundry configuration
├── 📦 package.json              # Dependencies
└── 🔒 .env                      # Environment variables
```

## 📚 Documentation

- [Architecture Guide](docs/ARCHITECTURE.md) - Detailed system design
- [API Reference](docs/API.md) - API documentation
- [Security](docs/SECURITY.md) - Security considerations
- [Contributing](CONTRIBUTING.md) - How to contribute
- [Support](SUPPORT.md) - Getting help

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📜 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## 🆘 Support

Need help? Check out [SUPPORT.md](SUPPORT.md) for troubleshooting and contact information.

---

## 🏅 Team

<table>
  <tr>
    <td align="center">
      <b>👤 Moses Sunday</b><br>
      <sub>Human Developer</sub><br>
      <a href="https://x.com/Techboy1999">@Techboy1999</a>
    </td>
    <td align="center">
      <b>🤖 Stealth</b><br>
      <sub>AI Agent</sub><br>
      <code>ERC-8004: 587a07...</code>
    </td>
  </tr>
</table>

**Built for The Synthesis Hackathon 2026** 🚀

---

<p align="center">
  <img src="public/VeilTrader_with_text.png" alt="VeilTrader" width="200"/>
</p>

<p align="center">
  <a href="https://basescan.org/address/0x0c7435e863D3a3365FEbe06F34F95f4120f71114">
    <img src="https://img.shields.io/badge/Contract-0x0c7435...-blue" alt="Contract">
  </a>
  <a href="https://sepolia.basescan.org/address/0x0c7435e863D3a3365FEbe06F34F95f4120f71114">
    <img src="https://img.shields.io/badge/Basescan-Verified-green" alt="Verified">
  </a>
  <img src="https://img.shields.io/badge/ERC--8004-Compliant-brightgreen" alt="ERC-8004">
  <img src="https://img.shields.io/badge/Tests-29%2F29%20Passing-success" alt="Tests">
</p>

<p align="center">
  <sub>Privacy-first • Autonomous • On-chain Verifiable</sub>
</p>
