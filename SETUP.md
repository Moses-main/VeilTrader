# VeilTrader Setup Guide

## 1. API Keys Configuration

Edit `.env` file:

### Required for Trading:
```env
# Wallet (Base Sepolia)
PRIVATE_KEY=your_private_key_here
RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

# Trading APIs
UNISWAP_API_KEY=your_uniswap_key_here  # https://developer.uniswap.org
```

### AI Analysis (Choose ONE or ALL):

#### Option A: Bankr (Premium - Best Results)
```env
BANKR_API_KEY=your_bankr_key_here  # https://bankr.bot/llm - Add credits
```

#### Option B: Gemini (Free - 500 req/day)
```env
GEMINI_API_KEY=AIzaSyAo0lGW3pUahOUWeYUyhXHytI-sn8Fyhk0
```

#### Option C: DeepSeek (Free)
```env
DEEPSEEK_API_KEY=sk-fbf67f997aea45098cc5b574c9479144
```

## 2. Start the Agent

### Terminal 1 - Agent:
```bash
cd /home/moses/Desktop/Hackathons/veiltrader
npm start
```

### Terminal 2 - Web UI:
```bash
cd /home/moses/Desktop/Hackathons/veiltrader
node src/ui/server.js
```

### Terminal 3 - Logs:
```bash
tail -f /home/moses/Desktop/Hackathons/veiltrader/logs/combined.log
```

## 3. Access Dashboard

🌐 **Web UI:** http://localhost:3000

Features:
- Real-time agent status
- Live log viewer (auto-refreshes every 5s)
- AI provider status
- Quick links to contract & documentation

## 4. Avoid API Rate Limits

For free tier APIs (Gemini/DeepSeek):
- Set `CYCLE_INTERVAL=15` minutes in `.env`
- This ensures ≤ 4 requests/hour
- Free tier limits: 500 requests/day

## 5. Agent Behavior

### AI Provider Fallback Chain:
1. **Bankr** (primary) → Requires credits
2. **Gemini** (free) → 500 req/day
3. **DeepSeek** (free) → Free tier
4. **Groq** (free) → Free tier
5. **Hugging Face** (free) → Rate limited
6. **Built-in Fallback** → Always works

### Trading Logic:
- Uses ERC-8004 identity
- Executes on Base Sepolia (chain 84532)
- All trades recorded on-chain
- Risk engine rejects low-confidence trades

## 6. Hackathon Tracks

**Fully Ready:**
- ✅ ERC-8004 Identity & Reputation ($8,000)
- ✅ Bankr LLM Gateway ($5,000)
- ✅ Uniswap V3 Integration ($5,000)
- ✅ MetaMask Delegations ($4,500)
- ✅ Locus Payments ($2,500)
- ✅ Self Protocol ZK Proofs ($1,000)

**Extension Modules Added:**
- ✅ Celo Cross-Chain ($5,000)
- ✅ OpenServ ($3,500)
- ✅ Lido MCP ($6,500)
- ✅ Filecoin Storage ($2,000)
- ✅ ENS Integration ($1,200)
- ✅ Status Network ($1,000+)
- ✅ Olas Marketplace ($1,500+)

## 7. File Structure

```
veiltrader/
├── src/
│   ├── agent/VeilTrader.js      # Main agent
│   ├── analysis/                # Portfolio & risk analysis
│   ├── execution/               # Trade execution (Uniswap, Celo)
│   ├── services/
│   │   ├── BankrGateway.js      # Bankr API
│   │   └── FreeAIGateway.js     # Gemini, DeepSeek, etc.
│   ├── extensions/              # StETH, Celo, Lido, etc.
│   └── ui/server.js             # Web UI
├── contracts/VeilTrader.sol     # On-chain contract
├── public/                      # Logo & favicon
└── logs/                        # Agent logs
```

## 8. Troubleshooting

**Agent not trading:**
- Check AI provider credits/quota
- Check risk threshold (0.6)
- Check cycle interval

**Celo connection failed:**
- Set `ENABLE_CELO=false` in `.env`
- Celo Sepolia RPC may be unstable

**API rate limits:**
- Increase `CYCLE_INTERVAL` to 30+ minutes
- Add credits to Bankr for unlimited use
