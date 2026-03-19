# VeilTrader Deployment Guide

This guide covers deploying VeilTrader to **Vercel** (frontend) and **Render** (backend).

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     VERCEL (Frontend)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │   Dashboard  │  │  Trade UI    │  │  API Routes     │   │
│  │   (HTML/CSS) │  │  (JS/Web3)   │  │  (Serverless)   │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
│                                                             │
│  URL: veiltrader.vercel.app                                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     RENDER (Backend API)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            API Server (Node.js/Express)              │  │
│  │  • Trade execution logic                             │  │
│  │  • AI analysis endpoints                             │  │
│  │  • WebSocket server                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  URL: veiltrader-api.onrender.com                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    BASE SEPOLIA (Chain)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          VeilTrader Smart Contract                   │  │
│  │  0x0c7435e863D3a3365FEbe06F34F95f4120f71114          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

1. **GitHub Account** - Repository at `Moses-main/VeilTrader`
2. **Vercel Account** - For frontend deployment
3. **Render Account** - For backend API (optional)
4. **API Keys** - From services listed below

---

## Step 1: Prepare API Keys

### Free AI APIs (Recommended for Dev)
| Service | URL | Free Tier |
|---------|-----|-----------|
| Google Gemini | [aistudio.google.com](https://aistudio.google.com/app/apikey) | 500 req/day |
| Groq | [console.groq.com](https://console.groq.com/keys) | Unlimited |
| Hugging Face | [huggingface.co](https://huggingface.co/settings/inference) | Free tier |

### Trading API (Required)
| Service | URL | Notes |
|---------|-----|-------|
| Uniswap | [developer.uniswap.org](https://developer.uniswap.org) | Free tier available |

### Optional Integration APIs
| Service | URL | Prize Track |
|---------|-----|-------------|
| Venice.ai | [venice.ai](https://venice.ai) | Private Agents |
| Virtuals | [docs.virtuals.io](https://docs.virtuals.io) | Best Virtuals Use |
| Lit Protocol | [litprotocol.com](https://developer.litprotocol.com) | Best Lit Use |
| Slice | [slicefinance.xyz](https://slicefinance.xyz/developers) | Best Slice Use |
| Self.xyz | [docs.self.xyz](https://docs.self.xyz) | Best Self Use |
| Octant | [docs.octant.app](https://docs.octant.app) | Best Octant Use |

---

## Step 2: Deploy Frontend to Vercel

### Option A: Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Add New Project**
   - Click **"Add New..."** → **"Project"**
   - Select **"Import Git Repository"**
   - Choose `Moses-main/VeilTrader`

3. **Configure Project**
   ```
   Project Name: veiltrader
   Framework Preset: Other
   Build Command: (leave empty or use: npm run build:ui)
   Output Directory: (leave empty)
   Install Command: npm install
   ```

4. **Add Environment Variables**
   Click **"Environment Variables"** and add:

   ```
   NODE_ENV=production
   RPC_URL=https://sepolia.base.org
   CHAIN_ID=84532
   VEILTRADER_CONTRACT=0x0c7435e863D3a3365FEbe06F34F95f4120f71114
   ERC8004_REGISTRY=0x8004A818BFB912233c491871b3d84c89A494BD9e
   ERC8004_REPUTATION_REGISTRY=0x8004B663056A597Dffe9eCcC1965A193B7388713
   GEMINI_API_KEY=your_gemini_api_key_here
   GROQ_API_KEY=your_groq_api_key_here
   UNISWAP_API_KEY=your_uniswap_api_key_here
   MIN_CONFIDENCE=0.5
   MAX_SLIPPAGE=0.005
   ```

5. **Deploy**
   - Click **"Deploy"**
   - Wait for deployment to complete
   - Your app will be live at `https://veiltrader.vercel.app`

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up project? Yes
# - Link to existing project? No
# - Project name: veiltrader
# - Framework: Other
```

### Option C: GitHub Integration

1. Install Vercel app on GitHub
2. Import repository from GitHub
3. Automatic deploys on every push

---

## Step 3: Deploy Backend to Render (Optional)

> **Note:** The UI server (`src/ui/server.js`) can run on Vercel alone.
> Use Render if you need a dedicated API server.

### Option A: Render Dashboard

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Sign in with GitHub

2. **Create New Web Service**
   - Click **"New"** → **"Web Service"**
   - Connect your GitHub repository

3. **Configure Service**
   ```
   Name: veiltrader-api
   Environment: Node
   Build Command: npm install
   Start Command: node src/ui/server.js
   Instance Type: Starter (Free tier)
   ```

4. **Add Environment Variables**
   Add the variables from `.env.render` through the Render dashboard UI.

5. **Deploy**
   - Click **"Create Web Service"**
   - Wait for build to complete
   - Your API will be live at `https://veiltrader-api.onrender.com`

### Option B: Render Blueprint

1. Use the `render.yaml` file in repository
2. Connect to GitHub
3. Render will automatically configure the service

---

## Environment Variables Summary

### For Vercel (Frontend)
```
# Core Settings
NODE_ENV=production
PORT=3000

# Blockchain
RPC_URL=https://sepolia.base.org
CHAIN_ID=84532
VEILTRADER_CONTRACT=0x0c7435e863D3a3365FEbe06F34F95f4120f71114
ERC8004_REGISTRY=0x8004A818BFB912233c491871b3d84c89A494BD9e
ERC8004_REPUTATION_REGISTRY=0x8004B663056A597Dffe9eCcC1965A193B7388713

# AI APIs (Free Options)
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key

# Trading API
UNISWAP_API_KEY=your_uniswap_api_key

# Risk Parameters
MIN_CONFIDENCE=0.5
MAX_SLIPPAGE=0.005
MIN_PROFIT_THRESHOLD=0.01
CYCLE_INTERVAL=15

# Optional Integrations
VENICE_API_KEY=your_venice_api_key
VIRTUALS_API_KEY=your_virtuals_api_key
SLICE_API_KEY=your_slice_api_key
SELF_API_KEY=your_self_api_key
OCTANT_API_KEY=your_octant_api_key
ENS_API_KEY=your_ens_api_key
FILECOIN_API_KEY=your_filecoin_api_key
OPENSERV_API_KEY=your_openserv_api_key
OLAS_API_KEY=your_olas_api_key
```

### For Render (Backend)
```
# Core Settings
PORT=10000
NODE_ENV=production

# Blockchain (Same as Vercel)
RPC_URL=https://sepolia.base.org
CHAIN_ID=84532
VEILTRADER_CONTRACT=0x0c7435e863D3a3365FEbe06F34F95f4120f71114
ERC8004_REGISTRY=0x8004A818BFB912233c491871b3d84c89A494BD9e
ERC8004_REPUTATION_REGISTRY=0x8004B663056A597Dffe9eCcC1965A193B7388713

# API Keys (Add via Render dashboard)
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
UNISWAP_API_KEY=your_uniswap_api_key
```

---

## Deployment Checklist

### Vercel (Frontend)
- [ ] Import repository from GitHub
- [ ] Configure framework: Other
- [ ] Add environment variables
- [ ] Deploy and test
- [ ] Enable preview deployments
- [ ] Add custom domain (optional)

### Render (Backend)
- [ ] Create new web service
- [ ] Connect GitHub repository
- [ ] Configure build/start commands
- [ ] Add environment variables via dashboard
- [ ] Deploy and test
- [ ] Verify health check endpoint

### Testing
- [ ] Open deployed URL
- [ ] Connect MetaMask to Base Sepolia
- [ ] Execute test trade
- [ ] Verify on-chain transaction
- [ ] Check all UI tabs work

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check package.json scripts |
| API calls fail | Verify API keys in environment |
| Contract not found | Check VEILTRADER_CONTRACT address |
| Web3 connection issues | Verify RPC_URL is correct |
| Charts not loading | Check internet connection for Chart.js CDN |
| WebSocket errors | Frontend handles fallback automatically |

---

## Security Notes

1. **Never commit private keys** to repository
2. Use environment variables in Vercel/Render dashboard
3. Enable 2FA on all accounts
4. Rotate API keys regularly
5. Monitor usage to avoid billing surprises

---

## Cost Estimate

| Service | Tier | Cost |
|---------|------|------|
| Vercel (Frontend) | Hobby | Free |
| Render (Backend API) | Starter | Free |
| Base Sepolia (Gas) | Testnet | Free |
| Uniswap API | Free tier | Free |
| Google Gemini | Free tier | Free |
| **Total** | | **$0/month** |

---

## Next Steps After Deployment

1. **Test the deployed app**
   - Visit your Vercel URL
   - Connect wallet
   - Execute trades

2. **Update Devfolio submission**
   - Add deployed URL to submission
   - Record demo with production URL

3. **Monitor**
   - Check Vercel analytics
   - Monitor Render logs
   - Track API usage

---

## Support

- **GitHub Issues**: https://github.com/Moses-main/VeilTrader/issues
- **Discord**: [Add if available]
- **Email**: [Your contact]

---

## References

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Base Sepolia RPC](https://docs.base.org/tools/networks#base-sepolia)
- [Synthesis Hackathon](https://synthesis.devfolio.co)
