/**
 * VeilTrader Core Agent
 * 
 * Orchestrates the autonomous trading loop:
 * 1. Analyze portfolio
 * 2. Make risk-aware decisions
 * 3. Execute trades
 * 4. Update on-chain identity
 * 5. Support for extensions (Lido, OpenServ, Celo, ENS, etc.)
 */

const { ethers } = require('ethers');
const PortfolioAnalyzer = require('../../analysis/PortfolioAnalyzer');
const RiskEngine = require('../../analysis/RiskEngine');
const DecisionEngine = require('../../analysis/DecisionEngine');
const UniswapExecutor = require('../UniswapExecutor');
const VeilTraderContract = require('../VeilTraderContract');
const IdentityRegistry = require('../../identity/IdentityRegistry');
const BankrGateway = require('../../services/BankrGateway');
const logger = require('../../utils/logger');

// Extension imports
const { StETHTreasury, StatusNetwork, OlasMarketplace, LidoMCP, OpenServ, FilecoinStorage, ENSIntegration, CeloIntegration } = require('../../extensions');

class VeilTrader {
  constructor(config) {
    this.config = config;
    this.provider = null;
    this.wallet = null;
    this.isRunning = false;
    
    // Core Components
    this.portfolioAnalyzer = null;
    this.riskEngine = null;
    this.decisionEngine = null;
    this.uniswapExecutor = null;
    this.veilTraderContract = null;
    this.identityRegistry = null;
    this.bankrGateway = null;
    
    // Extension Components (optional)
    this.stETH = null;
    this.statusNetwork = null;
    this.olasMarketplace = null;
    this.lidoMCP = null;
    this.openServ = null;
    this.filecoinStorage = null;
    this.ens = null;
    this.celo = null;
  }

  async initialize() {
    logger.info('🔧 Initializing VeilTrader components...');

    // Setup blockchain connection - use Base Sepolia chain ID
    this.provider = new ethers.JsonRpcProvider(this.config.rpcUrl, {
      chainId: parseInt(this.config.chainId) || 84532,
      name: 'base-sepolia'
    });
    this.wallet = new ethers.Wallet(this.config.privateKey, this.provider);
    
    const address = await this.wallet.getAddress();
    logger.info(`💼 Wallet address: ${address}`);

    // Initialize core components
    this.bankrGateway = new BankrGateway({
      apiKey: this.config.bankrApiKey
    });

    this.portfolioAnalyzer = new PortfolioAnalyzer({
      provider: this.provider,
      wallet: this.wallet
    });

    this.riskEngine = new RiskEngine({
      maxSlippage: parseFloat(this.config.maxSlippage) || 0.005,
      minProfitThreshold: parseFloat(this.config.minProfitThreshold) || 0.01,
      riskTolerance: this.config.riskTolerance || 'medium'
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

    this.veilTraderContract = new VeilTraderContract({
      provider: this.provider,
      wallet: this.wallet
    });

    this.identityRegistry = new IdentityRegistry({
      provider: this.provider,
      wallet: this.wallet,
      agentId: this.config.agentId
    });

    // Initialize VeilTrader contract interface
    await this.veilTraderContract.initialize();

    // Initialize IdentityRegistry
    await this.identityRegistry.initialize();

    // Register agent on-chain
    await this.identityRegistry.register();
    
    // Initialize Extensions (if configured)
    await this.initializeExtensions();
    
    logger.info('✅ All components initialized');
  }

  async initializeExtensions() {
    logger.info('🔌 Initializing extensions...');
    
    // stETH Treasury (for Lido prizes)
    if (this.config.enableStETH) {
      try {
        this.stETH = new StETHTreasury({
          provider: this.provider,
          wallet: this.wallet
        });
        await this.stETH.initialize();
        logger.info('✅ stETH Treasury extension enabled');
      } catch (error) {
        logger.warn('⚠️ stETH Treasury failed to initialize:', error.message);
      }
    }

    // Status Network (for Go Gasless prize)
    if (this.config.enableStatusNetwork) {
      try {
        this.statusNetwork = new StatusNetwork({
          provider: this.provider,
          wallet: this.wallet
        });
        await this.statusNetwork.initialize();
        logger.info('✅ Status Network extension enabled');
      } catch (error) {
        logger.warn('⚠️ Status Network failed to initialize:', error.message);
      }
    }

    // Olas Marketplace (for Olas prizes)
    if (this.config.olasApiKey) {
      try {
        this.olasMarketplace = new OlasMarketplace({
          apiKey: this.config.olasApiKey
        });
        await this.olasMarketplace.initialize();
        logger.info('✅ Olas Marketplace extension enabled');
      } catch (error) {
        logger.warn('⚠️ Olas Marketplace failed to initialize:', error.message);
      }
    }

    // Lido MCP (for Lido MCP prizes)
    if (this.config.enableLidoMCP) {
      try {
        this.lidoMCP = new LidoMCP({
          provider: this.provider,
          wallet: this.wallet
        });
        await this.lidoMCP.initialize();
        logger.info('✅ Lido MCP extension enabled');
      } catch (error) {
        logger.warn('⚠️ Lido MCP failed to initialize:', error.message);
      }
    }

    // OpenServ (for OpenServ prizes)
    if (this.config.openServApiKey) {
      try {
        this.openServ = new OpenServ({
          apiKey: this.config.openServApiKey
        });
        await this.openServ.initialize();
        logger.info('✅ OpenServ extension enabled');
      } catch (error) {
        logger.warn('⚠️ OpenServ failed to initialize:', error.message);
      }
    }

    // Filecoin Storage (for Agentic Storage prizes)
    if (this.config.filecoinApiKey) {
      try {
        this.filecoinStorage = new FilecoinStorage({
          apiKey: this.config.filecoinApiKey
        });
        await this.filecoinStorage.initialize();
        logger.info('✅ Filecoin Storage extension enabled');
      } catch (error) {
        logger.warn('⚠️ Filecoin Storage failed to initialize:', error.message);
      }
    }

    // ENS Integration (for ENS prizes)
    if (this.config.enableENS) {
      try {
        this.ens = new ENSIntegration({
          provider: this.provider,
          wallet: this.wallet
        });
        await this.ens.initialize();
        logger.info('✅ ENS extension enabled');
      } catch (error) {
        logger.warn('⚠️ ENS failed to initialize:', error.message);
      }
    }

    // Celo Integration (for Celo prizes)
    if (this.config.enableCelo) {
      try {
        this.celo = new CeloIntegration({
          wallet: this.wallet
        });
        await this.celo.initialize(this.config.celoTestnet !== false);
        logger.info('✅ Celo extension enabled');
      } catch (error) {
        logger.warn('⚠️ Celo failed to initialize:', error.message);
      }
    }

    logger.info('🔌 Extensions initialization complete');
  }

  async start() {
    logger.info('🚀 Starting autonomous trading loop...');
    this.isRunning = true;

    while (this.isRunning) {
      try {
        await this.runCycle();
        
        // Wait before next cycle (configurable, default 5 minutes)
        const waitTime = (this.config.cycleInterval || 5) * 60 * 1000;
        logger.info(`⏳ Waiting ${this.config.cycleInterval || 5} minutes before next cycle...`);
        await this.sleep(waitTime);
        
      } catch (error) {
        logger.error('❌ Error in trading cycle:', error);
        await this.sleep(60 * 1000); // Wait 1 minute on error
      }
    }
  }

  async runCycle() {
    logger.info('🔄 Starting new trading cycle...');
    const cycleStart = Date.now();

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
      
      // Store to Filecoin if enabled
      await this.storeCycleData({ portfolio, analysis, decision, timestamp: cycleStart });
      return;
    }

    // Step 4: Execute trade
    logger.info(`💱 Executing ${decision.action}...`);
    const execution = await this.uniswapExecutor.execute(decision);
    
    // Step 5: Record trade on VeilTrader contract
    logger.info('⛓️ Recording trade on contract...');
    try {
      const contractResult = await this.veilTraderContract.executeTrade(
        decision.action,
        execution.tokenIn,
        execution.tokenOut,
        ethers.parseUnits(execution.amountIn.toString(), execution.tokenIn === '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' ? 6 : 18),
        ethers.parseUnits(execution.amountOut.toString(), 6),
        JSON.stringify({ decision, execution })
      );
    } catch (error) {
      logger.warn('⚠️ Contract trade recording failed:', error.message);
    }
    
    // Step 6: Update on-chain identity
    logger.info('⛓️ Updating on-chain identity...');
    await this.identityRegistry.logAction(decision.action, {
      ...decision,
      txHash: execution.txHash,
      timestamp: Date.now()
    });

    // Step 7: Run extension-specific logic
    await this.runExtensionLogic(portfolio, decision, execution);

    // Step 8: Store cycle data to Filecoin if enabled
    await this.storeCycleData({ portfolio, analysis, decision, execution, timestamp: cycleStart });

    logger.info('✅ Cycle complete');
  }

  async runExtensionLogic(portfolio, decision, execution) {
    // stETH Treasury: Check yield and potentially spend
    if (this.stETH) {
      try {
        const yieldReport = await this.stETH.getYieldReport();
        logger.info(`📈 stETH Yield Report: ${JSON.stringify(yieldReport)}`);
      } catch (error) {
        logger.warn('⚠️ stETH check failed:', error.message);
      }
    }

    // Lido MCP: Update portfolio summary
    if (this.lidoMCP) {
      try {
        const address = await this.wallet.getAddress();
        const summary = await this.lidoMCP.getPortfolioSummary(address);
        logger.info(`📊 Lido Portfolio: ${JSON.stringify(summary)}`);
      } catch (error) {
        logger.warn('⚠️ Lido MCP check failed:', error.message);
      }
    }

    // Celo: Optionally execute on Celo if configured
    if (this.celo && this.config.celoAutoExecute) {
      try {
        logger.info('🔄 Checking for Celo opportunities...');
        // Add Celo-specific trading logic here
      } catch (error) {
        logger.warn('⚠️ Celo execution failed:', error.message);
      }
    }

    // OpenServ: Log action for service discovery
    if (this.openServ) {
      try {
        logger.info('📡 Syncing with OpenServ...');
        // Add OpenServ sync logic here
      } catch (error) {
        logger.warn('⚠️ OpenServ sync failed:', error.message);
      }
    }
  }

  async storeCycleData(data) {
    if (this.filecoinStorage) {
      try {
        const trades = await this.veilTraderContract.getAllTrades();
        await this.filecoinStorage.storeTradeHistory(trades);
      } catch (error) {
        logger.warn('⚠️ Filecoin storage failed:', error.message);
      }
    }
  }

  // Public API for external agents
  async getStatus() {
    const address = await this.wallet.getAddress();
    return {
      agentId: this.config.agentId,
      address: address,
      isRunning: this.isRunning,
      extensions: {
        stETH: !!this.stETH,
        statusNetwork: !!this.statusNetwork,
        olasMarketplace: !!this.olasMarketplace,
        lidoMCP: !!this.lidoMCP,
        openServ: !!this.openServ,
        filecoinStorage: !!this.filecoinStorage,
        ens: !!this.ens,
        celo: !!this.celo
      },
      tradeCount: await this.veilTraderContract.getTradeCount()
    };
  }

  // API for external agents to trigger a trade
  async executeTradeRequest(tradeParams) {
    logger.info(`🔄 External trade request: ${JSON.stringify(tradeParams)}`);
    
    const decision = {
      action: tradeParams.action || 'BUY',
      targetAsset: tradeParams.targetAsset,
      targetAmount: tradeParams.amount,
      reasoning: 'External agent request',
      confidence: 0.9,
      riskLevel: 'low'
    };
    
    const execution = await this.uniswapExecutor.execute(decision);
    
    await this.veilTraderContract.executeTrade(
      decision.action,
      execution.tokenIn,
      execution.tokenOut,
      ethers.parseUnits(execution.amountIn.toString(), 18),
      ethers.parseUnits(execution.amountOut.toString(), 6),
      JSON.stringify({ source: 'external_api', ...tradeParams })
    );
    
    return { success: true, execution, txHash: execution.txHash };
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
