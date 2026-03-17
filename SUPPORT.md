# Support & Troubleshooting

Need help with VeilTrader? You're in the right place! 🆘

## 📚 Quick Links

- [README.md](README.md) - Project overview
- [CONTRIBUTING.md](CONTRIBUTING.md) - How to contribute
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - System design
- [docs/API.md](docs/API.md) - API reference

## 🐛 Common Issues

### Installation Problems

#### `npm install` fails

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use yarn
yarn install
```

#### Node.js version issues

VeilTrader requires Node.js v18+:

```bash
# Check version
node --version

# If outdated, install via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### Configuration Issues

#### "PRIVATE_KEY not set" error

1. Copy `.env.example` to `.env`
2. Add your Base Sepolia testnet private key (NOT mainnet!)
3. Never commit `.env` to git

#### API key errors

**Bankr Gateway:**
- Verify key at https://bankr.bot
- Check key hasn't expired
- Ensure sufficient credits

**Uniswap API:**
- Get key from https://developer.uniswap.org
- Check rate limits
- Verify key is active

### Runtime Issues

#### "Insufficient funds" error

You need Base Sepolia ETH:
1. Get from https://www.base.org/faucet
2. Or https://sepolia-faucet.pk910.de/ (then bridge)
3. Check balance: `npx hardhat console --network baseSepolia`

#### Transaction failures

Common causes:
- **Gas price too low**: Increase in `.env`
- **Slippage exceeded**: Adjust `MAX_SLIPPAGE`
- **Token not approved**: First trade needs approval
- **Network congestion**: Try again later

#### Agent not starting

```bash
# Check logs
cat logs/error.log

# Verify environment
node -e "require('dotenv').config(); console.log(process.env.AGENT_ID)"

# Test connection
npx hardhat console --network baseSepolia
```

### Smart Contract Issues

#### Deployment fails

```bash
# Check network connection
npx hardhat console --network baseSepolia

# Verify private key has funds
# Get Sepolia ETH from faucet

# Try with higher gas limit
npx hardhat run scripts/deploy.js --network baseSepolia --verbose
```

#### Contract verification fails

```bash
# Ensure BASESCAN_API_KEY is set
# Wait a few minutes after deployment
# Check contract address is correct
```

## 🔍 Debugging

### Enable Debug Logging

```bash
# Set log level
export LOG_LEVEL=debug
npm start
```

### Test Individual Components

```bash
# Test portfolio analyzer
node -e "require('./src/analysis/PortfolioAnalyzer')"

# Test Bankr connection
node -e "require('./src/services/BankrGateway')"

# Test Uniswap executor
node -e "require('./src/execution/UniswapExecutor')"
```

### Check On-Chain Data

```bash
# View agent identity
# https://sepolia.basescan.org/address/YOUR_CONTRACT

# Check ERC-8004 registry
# https://sepolia.basescan.org/address/REGISTRY_ADDRESS
```

## 📞 Getting Help

### GitHub Issues

For bugs and feature requests:
1. Search existing issues first
2. Create a new issue with template
3. Include:
   - Error messages
   - Environment details
   - Steps to reproduce
   - Expected behavior

### Community

- **Twitter:** [@Techboy1999](https://x.com/Techboy1999)
- **Telegram:** [Synthesis Updates](https://nsb.dev/synthesis-updates)
- **Discord:** OpenClaw community

### Direct Contact

For urgent issues:
- Email: moses.main21@gmail.com
- Twitter DM: @Techboy1999

## 🛠️ Development Tools

### Recommended VS Code Extensions

- Solidity (Juan Blanco)
- ESLint
- Prettier
- Mermaid Preview

### Useful Commands

```bash
# Check agent status
curl http://localhost:3000/status

# View logs in real-time
tail -f logs/combined.log

# Monitor gas prices
npx hardhat gas-report

# Run specific test
npm test -- --grep "PortfolioAnalyzer"
```

## 🚨 Security Issues

**DO NOT** open public issues for security vulnerabilities.

Instead:
1. Email: moses.main21@gmail.com
2. Subject: "[SECURITY] VeilTrader Issue"
3. Include:
   - Description
   - Impact assessment
   - Steps to reproduce
   - Suggested fix (if any)

## 📝 FAQ

**Q: Can I use this on mainnet?**  
A: Not recommended without extensive testing. Use testnet first.

**Q: How much does it cost to run?**  
A: Gas costs on Base Sepolia are minimal. Bankr charges per inference.

**Q: Is my private key safe?**  
A: Yes, if you:
- Never commit it
- Use testnet only
- Store in `.env` (gitignored)

**Q: Can I modify the trading strategy?**  
A: Yes! Edit `DecisionEngine.js` and `RiskEngine.js`.

**Q: What happens if the agent loses money?**  
A: It's testnet ETH, so no real loss. Learn and iterate!

## 🎯 Still Stuck?

1. Read the [documentation](docs/)
2. Check [GitHub Discussions](https://github.com/your-username/veiltrader/discussions)
3. Ask in the Synthesis Telegram group
4. Tweet @Techboy1999

---

**Remember:** This is experimental software for a hackathon. Trade responsibly! 🚀

*Built for The Synthesis Hackathon 2026*
