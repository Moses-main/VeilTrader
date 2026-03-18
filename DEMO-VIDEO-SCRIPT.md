# VeilTrader Demo Video Script

## Overview
**Duration:** 6 minutes (360 seconds)
**Format:** Screen recording with voiceover
**Tools Needed:** OBS Studio, microphone, screen recorder
**Demo URL:** http://localhost:3000

---

## Production Notes

### Recording Setup
- **Resolution:** 1920x1080 (Full HD)
- **Frame Rate:** 30fps
- **Microphone:** Clear voice recording
- **Background:** Clean workspace, no distractions
- **Browser:** Chrome with Developer Tools closed

### Before Recording
1. Start server: `cd veiltrader && node src/ui/server.js`
2. Clear browser cache
3. Open DevTools (F12) and set device to 1920x1080
4. Have test wallet ready with test ETH
5. Record in quiet environment

---

## Script Timeline

### **0:00 - 0:15 (15s) - INTRODUCTION**

**[VISUAL]**
- Open browser to http://localhost:3000
- Dashboard loads with charts animating
- Show full screen with sidebar visible

**[VOICEOVER]**
"Hi! I'm Moses, and I'm excited to show you VeilTrader — a privacy-first autonomous AI trading agent built for the Synthesis Hackathon 2026."

**[VISUAL]**
- Hover over logo
- Show contract address in sidebar footer

**[VOICEOVER]**
"VeilTrader executes trades on Base Sepolia using AI-powered decisions while maintaining complete privacy through encrypted secrets."

---

### **0:15 - 0:45 (30s) - DASHBOARD OVERVIEW**

**[VISUAL]**
- Point to stats cards (Total Trades, Portfolio, Win Rate, Active Agents)
- Show real-time updates

**[VOICEOVER]**
"Let's start with the Dashboard. Here you can see live statistics: total trades executed, portfolio value, win rate, and active agents. All data updates in real-time."

**[VISUAL]**
- Scroll down to Price Chart
- Click "1H", "24H", "7D" buttons

**[VOICEOVER]**
"Here we have the ETH/USDC price chart with multiple timeframes. This is powered by real market data and updates continuously."

**[VISUAL]**
- Show Portfolio Allocation doughnut chart
- Point to legend items

**[VOICEOVER]**
"The portfolio allocation chart shows asset distribution across ETH, USDC, and WETH. This helps visualize your risk exposure."

**[VISUAL]**
- Show Recent Activity feed
- Highlight the Live indicator

**[VOICEOVER]**
"The activity feed shows all recent trades and AI analysis updates in real-time."

---

### **0:45 - 1:30 (45s) - AI MARKET INSIGHT**

**[VISUAL]**
- Point to AI Market Insight panel
- Show current AI recommendation (BUY/HOLD/SELL)
- Display confidence percentage

**[VOICEOVER]**
"Here's the AI Market Insight panel. VeilTrader uses multiple AI models — Bankr, Gemini, and DeepSeek — to analyze market conditions and generate trading signals."

**[VISUAL]**
- Show ETH Price, Trend, and Risk metrics
- Show AI analysis details

**[VOICEOVER]**
"The AI displays current ETH price, market trend, and risk level. All decisions are based on real-time analysis with confidence scores."

**[VISUAL]**
- Show AI models in sidebar (Bankr active, Gemini standby)

**[VOICEOVER]**
"Bankr LLM Gateway is the primary model, with Gemini and DeepSeek as fallback options for redundancy and accuracy."

---

### **1:30 - 2:30 (60s) - QUICK TRADE & WALLET CONNECTION**

**[VISUAL]**
- Click "Connect" button in header
- Show wallet modal with MetaMask option
- Select MetaMask and connect

**[VOICEOVER]**
"Now let's connect a wallet. Click 'Connect' and select MetaMask. For this demo, I'm using a test wallet on Base Sepolia."

**[VISUAL]**
- Show wallet address after connecting (0x...1234)
- Demonstrate disconnect button

**[VOICEOVER]**
"Once connected, you'll see your wallet address. You can disconnect anytime using the X button."

**[VISUAL]**
- Fill in Quick Trade form
  - From: ETH
  - Amount: 0.01
  - To: USDC
- Click swap button to exchange tokens
- Click "Execute Trade"

**[VOICEOVER]**
"Now let's execute a trade. I'll swap 0.01 ETH to USDC. Click the swap button to exchange the selected tokens, then click 'Execute Trade'."

**[VISUAL]**
- Show trade executing (spinner animation)
- Show toast notification "Trade executed!"
- Show transaction hash

**[VOICEOVER]**
"The trade executes instantly on Base Sepolia. You'll see a confirmation toast and transaction hash. All trades are recorded on-chain for full auditability."

**[VISUAL]**
- Check activity feed for the new trade

**[VOICEOVER]**
"The trade appears in the activity feed with timestamp and status."

---

### **2:30 - 3:30 (60s) - TRADE TAB & FULL EXECUTION**

**[VISUAL]**
- Click "Trade" tab in sidebar
- Show full trade form with more options

**[VOICEOVER]**
"Now let's look at the full Trade tab. Here you have more control over trade execution."

**[VISUAL]**
- Set Action: SELL
- Token In: USDC
- Token Out: ETH
- Amount: 100
- Show trade details (price impact, gas estimate, expected output)

**[VOICEOVER]**
"Select SELL to exchange USDC to ETH. The form shows price impact, gas estimate, and expected output before you execute."

**[VISUAL]**
- Scroll to Trade History section
- Show previous trades from history

**[VOICEOVER]**
"The Trade History section shows all executed trades with transaction details and status. This provides a complete audit trail."

**[VISUAL]**
- Click "Execute Trade" button

**[VOICEOVER]**
"With all parameters set, click 'Execute Trade' to submit the transaction to the blockchain."

---

### **3:30 - 4:30 (60s) - INTEGRATIONS TAB**

**[VISUAL]**
- Click "Integrations" tab
- Scroll through integration cards

**[VOICEOVER]**
"Now let's explore the Integrations tab. VeilTrader integrates with 22 different protocols for the Synthesis Hackathon prize tracks."

**[VISUAL]**
- Point to Uniswap card ($6,000 prize)
- Point to ERC-8004 card ($10,000 prize)
- Point to Virtuals card ($5,000 prize)

**[VOICEOVER]**
"Key integrations include Uniswap V3 for trading, ERC-8004 for on-chain identity, and Virtuals Protocol for agent tokenization. Each offers prize eligibility."

**[VISUAL]**
- Scroll to AI & Analysis section
- Show Venice.ai, Bankr cards

**[VOICEOVER]**
"AI integrations include Venice.ai for market signals and Bankr LLM Gateway for autonomous decision-making."

**[VISUAL]**
- Scroll to Identity & Security section
- Show Lit Protocol, Self.xyz, ENS cards

**[VOICEOVER]**
"Privacy integrations include Lit Protocol for encrypted secrets, Self.xyz for sovereign identity, and ENS for agent naming."

**[VISUAL]**
- Show integration status indicators (Active, Ready, Optimizing)

**[VOICEOVER]**
"All integrations are configured and ready to use. Each connection increases your prize eligibility across the 22 tracks."

---

### **4:30 - 5:15 (45s) - AI ANALYSIS TAB**

**[VISUAL]**
- Click "AI Analysis" tab
- Show full market analysis

**[VOICEOVER]**
"The AI Analysis tab provides detailed market insights and model status."

**[VISUAL]**
- Show market analysis with Action, Reason, Risk
- Show AI Models list with statuses

**[VOICEOVER]**
"Here you can see the complete AI analysis with action recommendations, reasoning, and risk assessment. The Models list shows which AI services are active."

**[VISUAL]**
- Show sentiment gauge
- Move to show bullish/bearish

**[VOICEOVER]**
"The sentiment gauge shows overall market sentiment, helping inform trading decisions."

**[VISUAL]**
- Point to Bankr, Gemini, DeepSeek models

**[VOICEOVER]**
"Multiple AI models work together: Bankr for primary signals, Gemini for sentiment, and DeepSeek for technical analysis."

---

### **5:15 - 5:45 (30s) - API TAB & CONNECTIVITY**

**[VISUAL]**
- Click "API" tab
- Show REST endpoints

**[VOICEOVER]**
"The API tab shows VeilTrader's REST endpoints for external agent integration."

**[VISUAL]**
- Show WebSocket connection info
- Show contract address

**[VOICEOVER]**
"You can connect external agents via WebSocket for real-time updates, or use the REST API for programmatic access."

**[VISUAL]**
- Highlight contract address
- Click "View on Explorer" link

**[VOICEOVER]**
"The contract is verified on Basescan. All trades, identity registrations, and receipts are publicly verifiable on-chain."

---

### **5:45 - 6:00 (15s) - CONCLUSION**

**[VISUAL]**
- Return to Dashboard
- Show all features together

**[VOICEOVER]**
"VeilTrader is a complete autonomous trading agent with AI-powered decisions, privacy-first architecture, and full on-chain verification."

**[VISUAL]**
- Show GitHub repo link
- Show Devfolio submission link

**[VOICEOVER]**
"Built for Synthesis Hackathon 2026 with 22 prize track integrations. Check out the GitHub repo and submit your own agent today!"

**[VISUAL]**
- Final screen with logo and "VeilTrader" text
- Fade out

**[VOICEOVER]**
"Thanks for watching!"

---

## Post-Production Checklist

### Editing
- [ ] Trim silence at start and end
- [ ] Add title card (0:00 - 0:05)
- [ ] Add transition effects between sections
- [ ] Add captions for accessibility
- [ ] Add background music (optional)

### Export Settings
- **Format:** MP4
- **Resolution:** 1920x1080
- **Bitrate:** 5000 kbps
- **Audio:** AAC 192kbps

### Upload
- [ ] Upload to YouTube
- [ ] Set visibility to Unlisted
- [ ] Add description with links:
  - GitHub: https://github.com/Moses-main/VeilTrader
  - Contract: 0x0c7435e863D3a3365FEbe06F34F95f4120f71114
  - Dashboard: http://localhost:3000 (or public URL if deployed)
- [ ] Update DEVFOLIO-SUBMISSION.md with video link

---

## Quick Reference Commands

```bash
# Start server
cd veiltrader
node src/ui/server.js

# Check if running
curl http://localhost:3000/

# Stop server
pkill -f "node src/ui/server.js"
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Server not starting | Check port 3000 not in use, check logs in /tmp/server.log |
| Wallet not connecting | Ensure MetaMask is installed and Base Sepolia network added |
| Charts not loading | Check internet connection, Chart.js CDN accessible |
| Trade failing | Ensure sufficient test ETH in wallet |
| WebSocket errors | Server provides fallback, works without WS |

---

## Assets Needed

- [ ] Screen recording software (OBS Studio)
- [ ] Microphone for voiceover
- [ ] Test wallet with Base Sepolia ETH
- [ ] Browser with cache cleared
- [ ] Quiet recording environment
- [ ] Script printed or visible during recording

---

## Voiceover Tips

1. **Speak clearly** and at moderate pace
2. **Pause briefly** between sections
3. **Emphasize key numbers** (prize amounts, contract addresses)
4. **Show excitement** for the product
5. **Practice the script** before recording

---

## After Recording

1. Edit video to 6 minutes exactly
2. Add intro/outro cards
3. Export to MP4
4. Upload to video hosting
5. Update DEVFOLIO-SUBMISSION.md
6. Create GitHub PR with final submission
