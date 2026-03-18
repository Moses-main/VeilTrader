#!/bin/bash

# VeilTrader Demo Script
# This script demonstrates all features of VeilTrader

echo "🚀 VeilTrader Demo"
echo "=================="
echo ""

# Check if server is running
if ! curl -s http://localhost:3000/api/status > /dev/null 2>&1; then
  echo "❌ Server not running. Starting server..."
  node src/ui/server.js > /dev/null 2>&1 &
  sleep 3
fi

echo "✅ Server is running"
echo ""

# Demo 1: Get Agent Status
echo "📊 Demo 1: Agent Status"
curl -s http://localhost:3000/api/status | jq '{status, network, contract}'
echo ""

# Demo 2: AI Analysis
echo "🤖 Demo 2: AI Trading Analysis"
curl -s http://localhost:3000/api/ai/analysis | jq '{action, confidence, reason, risk}'
echo ""

# Demo 3: Get Prices
echo "💰 Demo 3: Live Prices"
curl -s "http://localhost:3000/api/prices?in=ETH&out=USDC" | jq '{tokenIn, tokenOut, price}'
echo ""

# Demo 4: Connect User
echo "👤 Demo 4: Connect User"
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"address":"0x742d35Cc6634C0532925a3b844Bc9e7595f5bCd5"}' \
  http://localhost:3000/api/connect/user | jq '{userId, status}'
echo ""

# Demo 5: Execute Trade
echo "📈 Demo 5: Execute Trade"
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"action":"BUY","tokenIn":"ETH","tokenOut":"USDC","amountIn":0.1}' \
  http://localhost:3000/api/trade/execute | jq '{tradeId, status, message}'
echo ""

# Demo 6: Get Trades
echo "📜 Demo 6: Trade History"
curl -s http://localhost:3000/api/trades | jq 'length'
echo ""

# Demo 7: User Configuration
echo "⚙️ Demo 7: Trading Configuration"
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"amount":500,"slippage":1.0,"pairs":["ETH/USDC"],"mode":"auto"}' \
  http://localhost:3000/api/user/config | jq '{status, config}'
echo ""

echo "✅ Demo Complete!"
echo ""
echo "🌐 Open http://localhost:3000 to see the dashboard"
