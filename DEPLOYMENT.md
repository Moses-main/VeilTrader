# VeilTrader Deployment Guide

This guide covers deploying VeilTrader to **Vercel** (frontend) and **Render** (backend).

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     VERCEL (Frontend)                       │
│  • Vite + Tailwind CSS build                                 │
│  • Static deployment                                         │
│  • URL: veiltrader.vercel.app                                │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     BASE SEPOLIA (Chain)                    │
│  • Contract: 0x0c7435e863D3a3365FEbe06F34F95f4120f71114      │
│  • All trades on-chain with ERC-8004 identity                │
└─────────────────────────────────────────────────────────────┘
```

---

## Frontend Deployment (Vercel)

### Step 1: Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Select **"Import Git Repository"**
5. Choose `Moses-main/VeilTrader`

### Step 2: Configure Project

```
Project Name: veiltrader
Framework Preset: Vite
Build Command: cd ui && npm run build
Output Directory: ui/dist
Install Command: cd ui && npm install
```

### Step 3: Environment Variables

Add these to **Project Settings → Environment Variables**:

```
# Core Settings
RPC_URL=https://sepolia.base.org
CHAIN_ID=84532
VEILTRADER_CONTRACT=0x0c7435e863D3a3365FEbe06F34F95f4120f71114
ERC8004_REGISTRY=0x8004A818BFB912233c491871b3d84c89A494BD9e
ERC8004_REPUTATION_REGISTRY=0x8004B663056A597Dffe9eCcC1965A193B7388713

# AI APIs (Free Options)
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here

# Trading API
UNISWAP_API_KEY=your_uniswap_api_key_here

# Risk Parameters
MAX_SLIPPAGE=0.005
MIN_PROFIT_THRESHOLD=0.01
RISK_TOLERANCE=low
MIN_CONFIDENCE=0.5
```

### Step 4: Deploy

Click **"Deploy"** and wait for deployment to complete.

---

## Environment Variables

### For Vercel (Frontend)

| Variable | Value | Required |
|----------|-------|----------|
| RPC_URL | `https://sepolia.base.org` | ✅ Yes |
| CHAIN_ID | `84532` | ✅ Yes |
| VEILTRADER_CONTRACT | `0x0c7435e863D3a3365FEbe06F34F95f4120f71114` | ✅ Yes |
| GEMINI_API_KEY | `your_gemini_key` | Optional |
| GROQ_API_KEY | `your_groq_key` | Optional |
| UNISWAP_API_KEY | `your_uniswap_key` | Optional |
| MAX_SLIPPAGE | `0.005` | ✅ Yes |
| MIN_CONFIDENCE | `0.5` | ✅ Yes |

### For Render (Backend - Optional)

| Variable | Value | Required |
|----------|-------|----------|
| PORT | `10000` | ✅ Yes |
| NODE_ENV | `production` | ✅ Yes |
| RPC_URL | `https://sepolia.base.org` | ✅ Yes |
| CHAIN_ID | `84532` | ✅ Yes |
| GEMINI_API_KEY | `your_gemini_key` | Optional |
| UNISWAP_API_KEY | `your_uniswap_key` | Optional |

---

## Building Locally

```bash
# Install dependencies
cd ui
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
veiltrader/
├── ui/                      # Vite + Tailwind frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.cjs
│   ├── src/
│   │   ├── main.js         # Main application
│   │   └── style.css       # Tailwind imports
│   └── dist/               # Built files (production)
├── src/
│   ├── ui/
│   │   ├── server.js       # Static file server
│   │   └── index.html      # Built frontend
│   └── ...                 # Backend integration
├── contracts/              # Smart contracts
├── vercel.json             # Vercel config
└── render.yaml             # Render config
```

---

## Features

### UI Features
- **Dashboard**: Real-time stats, price charts, portfolio allocation
- **Trade**: Full trade execution with token selection
- **Integrations**: View all 22 protocol connections
- **AI Analysis**: Multi-model AI insights with confidence scores
- **API**: REST endpoints for external integration

### Design System
- **Dark theme** with glassmorphism effects
- **Tailwind CSS** for utility-first styling
- **Inter font** for clean typography
- **Custom animations** for smooth interactions

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Ensure Node.js 18+ installed |
| Tailwind not applying | Check content paths in tailwind.config.js |
| Wallet not connecting | Ensure MetaMask is installed |
| API calls failing | Verify environment variables |
| Port in use | Kill process using port 3000 |

---

## Next Steps

1. **Deploy to Vercel** (5 minutes)
2. **Connect wallet** and test trade execution
3. **Record demo video** with production URL
4. **Submit to Devfolio** with complete documentation

---

## Resources

- **Vercel Docs**: https://vercel.com/docs
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Vite Docs**: https://vitejs.dev/guide/
- **Base Sepolia**: https://docs.base.org/tools/networks

---

## Quick Start

```bash
# Clone and setup
git clone https://github.com/Moses-main/VeilTrader.git
cd VeilTrader/ui
npm install

# Development
npm run dev

# Production build
npm run build

# Deploy to Vercel
vercel --prod
```
