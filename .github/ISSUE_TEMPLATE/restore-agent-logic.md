---
name: Restore Agent Logic
about: Restore the actual VeilTrader agent trading logic in src/
title: "Restore VeilTrader agent logic with Bankr LLM and Uniswap V3"
labels: enhancement, agent, trading
assignees: ''
---

## Description

Restore the actual VeilTrader agent trading logic that was removed or replaced with dummy data. Implement the full autonomous trading agent that:

1. Reads portfolio data from wallets/exchanges
2. Uses Bankr LLM Gateway for market analysis and trading decisions
3. Executes trades via Uniswap V3 on Base network
4. Integrates with the deployed smart contract for trade recording and reputation
5. Manages gas payments and agent economics
6. Implements the 5-minute trading loop

This is core to the "Let the Agent Cook — No Humans Required" ($4,000) and "Agentic Finance (Uniswap)" ($2,500) tracks.

## Features to Implement

- Restore src/agent/VeilTrader.js as the main orchestrator
- Implement PortfolioAnalyzer.js for reading DeFi positions
- Implement DecisionEngine.js using Bankr LLM Gateway
- Implement UniswapExecutor.js for Uniswap V3 trades
- Add proper error handling and retry logic
- Implement gas management and fee optimization
- Add logging and monitoring capabilities
- Connect to deployed smart contract at 0x44A8c4cabaE932445eBD1607238b0FEe6f480ff3
- Implement the 5-minute autonomous trading loop
- Add configuration for testnet/mainnet switching

## Benefits

- Fully autonomous trading agent
- Integrates all components: analysis, decision, execution, recording
- Ready for production deployment on Base Sepolia
- Demonstrates true agentic finance capabilities
- Wins multiple hackathon tracks

## References

- Bankr Gateway: https://bankr.ai/
- Uniswap V3 SDK: https://github.com/Uniswap/uniswap-v3-sdk
- Ethers.js: https://docs.ethers.io/v5/
- Base Network Docs: https://docs.base.org/