/**
 * VeilTrader Core Agent
 * 
 * Orchestrates the autonomous trading loop:
 * 1. Analyze portfolio
 * 2. Make risk-aware decisions
 * 3. Execute trades
 * 4. Update on-chain identity
 */

const { ethers } = require('ethers');
const PortfolioAnalyzer = require('../analysis/PortfolioAnalyzer');
const RiskEngine = require('../analysis/RiskEngine');
const DecisionEngine = require('../analysis/DecisionEngine');
const UniswapExecutor = require('../execution/UniswapExecutor');
const IdentityRegistry = require('../identity/IdentityRegistry');
const BankrGateway = require('../services/BankrGateway');
const logger = require('../utils/logger');

class VeilTrader {
  constructor(config) {
    this.config = config;
    this.provider = null;
    this.wallet = null;
    this.isRunning = false;
    
    // Components
    this.portfolioAnalyzer = null;
    this.riskEngine = null;
    this.decisionEngine = null;
    this.uniswapExecutor = null;
    this.identityRegistry = null;
    this.bankrGateway = null;
  }

  async initialize() {
    logger.info('🔧 Initializing VeilTrader components...');

    // Setup blockchain connection
    this.provider = new ethers.JsonRpcProvider(this.config.rpcUrl);
    this.wallet = new ethers.Wallet(this.config.privateKey, this.provider);
    
    const address = await this.wallet.getAddress();
    logger.info(`💼 Wallet address: ${address}`);

    // Initialize components
    this.bankrGateway = new BankrGateway({
      apiKey: this.config.bankrApiKey
    });

    this.portfolioAnalyzer = new PortfolioAnalyzer({
      provider: this.provider,
      wallet: this.wallet
    });

    this.riskEngine = new RiskEngine({
      maxSlippage: 0.005,
      minProfitThreshold: 0.01,
      riskTolerance: 'medium'
    });

    this.decisionEngine = new DecisionEngine({
      riskEngine: this.riskEngine,
      bankrGateway: this.bankrGateway
    });

    this.uniswapExecutor = new UniswapExecutor({
      apiKey: this.config.uniswapApiKey,
      wallet: this.wallet,
      provider: this.provider
    });

    this.identityRegistry = new IdentityRegistry({
      provider: this.provider,
      wallet: this.wallet,
      agentId: this.config.agentId
    });

    // Register agent on-chain
    await this.identityRegistry.register();
    
    logger.info('✅ All components initialized');
  }

  async start() {
    logger.info('🚀 Starting autonomous trading loop...');
    this.isRunning = true;

    while (this.isRunning) {
      try {
        await this.runCycle();
        
        // Wait before next cycle (5 minutes)
        logger.info('⏳ Waiting 5 minutes before next cycle...');
        await this.sleep(5 * 60 * 1000);
        
      } catch (error) {
        logger.error('❌ Error in trading cycle:', error);
        await this.sleep(60 * 1000); // Wait 1 minute on error
      }
    }
  }

  async runCycle() {
    logger.info('🔄 Starting new trading cycle...');

    // Step 1: Analyze portfolio
    logger.info('📊 Analyzing portfolio...');
    const portfolio = await this.portfolioAnalyzer.analyze();
    
    // Step 2: Get market data and LLM analysis via Bankr
    logger.info('🧠 Getting AI analysis...');
    const analysis = await this.bankrGateway.analyzePortfolio(portfolio);
    
    // Step 3: Make decision
    logger.info('🎯 Making trading decision...');
    const decision = await this.decisionEngine.decide(portfolio, analysis);
    
    if (decision.action === 'HOLD') {
      logger.info('⏸️ Decision: HOLD - No action taken');
      await this.identityRegistry.logAction('HOLD', decision.reasoning);
      return;
    }

    // Step 4: Execute trade
    logger.info(`💱 Executing ${decision.action}...`);
    const execution = await this.uniswapExecutor.execute(decision);
    
    // Step 5: Update on-chain identity
    logger.info('⛓️ Updating on-chain identity...');
    await this.identityRegistry.logAction(decision.action, {
      ...decision,
      txHash: execution.txHash,
      timestamp: Date.now()
    });

    logger.info('✅ Cycle complete');
  }

  stop() {
    logger.info('🛑 Stopping VeilTrader...');
    this.isRunning = false;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = VeilTrader;
