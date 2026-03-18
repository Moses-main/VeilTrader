# VeilTrader Deployment Guide

## Overview

VeilTrader is a privacy-first autonomous AI trading agent with a modern web dashboard. This guide covers deployment options and configuration.

## Quick Start

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the UI server**
   ```bash
   node src/ui/server.js
   ```

3. **Access the dashboard**
   Open http://localhost:3000 in your browser

### Environment Variables

Create a `.env` file in the root directory:

```env
# Smart Contract
VEILTRADER_CONTRACT=0x0c7435e863D3a3365FEbe06F34F95f4120f71114

# RPC Provider (Base Sepolia)
RPC_URL=https://sepolia.base.org

# Wallet Private Key (optional - for on-chain execution)
PRIVATE_KEY=your_private_key_here

# Allowed Origins for CORS
ALLOWED_ORIGINS=http://localhost:3000,https://veiltrader.vercel.app

# Port (default: 3000)
PORT=3000
```

## Deployment Options

### 1. Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   ./deploy-vercel.sh
   ```

### 2. Docker

1. **Build the image**
   ```bash
   docker build -t veiltrader .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 --env-file .env veiltrader
   ```

### 3. Self-Hosted

1. **Install Node.js 20+**
2. **Clone the repository**
3. **Install dependencies**
4. **Start the server**
   ```bash
   npm start
   ```

## Features

### Real-Time Updates

- **WebSocket**: Live trade updates and portfolio changes
- **Price Feeds**: Live prices from Uniswap V3 on Base
- **Activity Logs**: Real-time logging of all trading activity

### Trading Features

- **Wallet Connection**: MetaMask integration
- **Trade Execution**: On-chain or simulation mode
- **Portfolio Tracking**: Real-time balance updates
- **Configuration**: User-specific trading parameters

### Security

- **CORS**: Configurable allowed origins
- **Security Headers**: CSP, XSS protection, HSTS
- **API Keys**: Persistent API key generation

## API Endpoints

### GET /api/status
Returns agent status and network information

### GET /api/prices?in=ETH&out=USDC
Get current price for token pair

### POST /api/connect/user
Connect a wallet address

### POST /api/trade/execute
Execute a trade

### GET /api/portfolio?user=0x...
Get portfolio for specific user

### GET /api/trades
Get trade history

### GET /api/logs
Get activity logs

## WebSocket Events

### Connection
```
ws://localhost:3000/ws
```

### Message Types

**Trade Update**
```json
{
  "type": "trade",
  "data": {
    "id": "sim-123",
    "action": "BUY",
    "tokenIn": "ETH",
    "tokenOut": "USDC",
    "amountIn": 0.1,
    "timestamp": "2026-03-18T16:24:47.931Z",
    "status": "completed"
  }
}
```

**Portfolio Update**
```json
{
  "type": "portfolio",
  "data": {
    "totalValue": 1234.56,
    "assets": [
      {"symbol": "ETH", "balance": 0.5, "value": 1750.00}
    ]
  }
}
```

## Network Configuration

### Base Sepolia (Testnet)
- **RPC**: https://sepolia.base.org
- **Chain ID**: 84532
- **VeilTrader Contract**: 0x0c7435e863D3a3365FEbe06F34F95f4120f71114

### Supported Tokens
- ETH (Native)
- WETH: 0x4200000000000000000000000000000000000006
- USDC: 0x036CbD53842c5426634e7929541eC2318f3dCF7e
- USDbC: 0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA
- DAI: 0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### WebSocket Connection Issues
- Ensure the server is running
- Check firewall settings
- Verify WebSocket path: `/ws`

### Private Key Not Set
- Add `PRIVATE_KEY` to `.env` file
- Ensure the key has sufficient ETH for gas fees

### Contract Not Initialized
- Verify `VEILTRADER_CONTRACT` address
- Check RPC URL connectivity

## Development

### Running Tests
```bash
npm run test
```

### Code Style
- Follow existing patterns
- Use async/await for API calls
- Add comments for complex logic

## Support

For issues or questions:
- GitHub Issues: https://github.com/yourusername/veiltrader/issues
- Documentation: https://veiltrader.vercel.app/docs
