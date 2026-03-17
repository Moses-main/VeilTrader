# Contributing to VeilTrader

First off, thank you for considering contributing to VeilTrader! 🎉

## 🎯 Hackathon Context

This project was built for **The Synthesis Hackathon 2026**. While we welcome contributions, please note:

- The hackathon submission deadline may limit what changes can be merged
- Core architecture decisions are locked during judging
- Post-hackathon contributions are highly encouraged!

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node version, OS, etc.)

### Suggesting Features

We love new ideas! Please open an issue with:
- Feature description
- Use case
- Potential implementation approach

### Code Contributions

1. **Fork the repository**
2. **Create a branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly**: `npm test`
5. **Commit**: `git commit -m 'Add amazing feature'`
6. **Push**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

## 📝 Code Standards

### JavaScript Style

- Use ES6+ features
- Follow existing code patterns
- Add JSDoc comments for functions
- Use meaningful variable names

### Smart Contract Standards

- Follow Solidity style guide
- Include NatSpec comments
- Add tests for new functionality
- Consider gas optimization

### Commit Messages

```
type(scope): subject

body (optional)

footer (optional)
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
- `feat(agent): add support for multiple DEXs`
- `fix(executor): correct slippage calculation`
- `docs(readme): update architecture diagram`

## 🧪 Testing

Before submitting:

```bash
# Run all tests
npm test

# Run linting
npm run lint

# Check test coverage
npm run coverage
```

## 🔒 Security

- Never commit private keys or API keys
- Report security issues privately
- Follow responsible disclosure

## 📋 Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/veiltrader.git
cd veiltrader

# Install dependencies
npm install

# Copy env template
cp .env.example .env

# Edit with your test keys
# Never use mainnet keys for development!

# Run tests
npm test

# Start development mode
npm run dev
```

## 🎨 Areas for Contribution

### High Priority

- [ ] Additional DEX integrations (Curve, Balancer)
- [ ] Multi-chain support (Arbitrum, Optimism)
- [ ] Advanced risk models
- [ ] Portfolio rebalancing strategies

### Medium Priority

- [ ] Web dashboard for monitoring
- [ ] Mobile notifications
- [ ] Performance analytics
- [ ] Strategy backtesting

### Documentation

- [ ] Tutorial videos
- [ ] Strategy guides
- [ ] API documentation improvements
- [ ] Translation to other languages

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## ❓ Questions?

- Open a [Discussion](https://github.com/your-username/veiltrader/discussions)
- Check [SUPPORT.md](SUPPORT.md)
- Tag @Techboy1999 on Twitter

## 📜 Code of Conduct

This project adheres to a code of conduct:

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Respect different viewpoints

## 🙏 Thank You!

Every contribution helps make VeilTrader better. Whether it's:
- Reporting a typo
- Suggesting a feature
- Writing code
- Sharing the project

**You're awesome!** 🚀

---

*Built with ❤️ by Moses Sunday and Stealth for The Synthesis Hackathon 2026*
