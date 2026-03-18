/**
 * VeilTrader - Privacy-first Autonomous AI Trading Agent
 * 
 * Main entry point for the agent
 */

require('dotenv').config();
const VeilTrader = require('./execution/agent/VeilTrader');
const logger = require('./utils/logger');

async function main() {
  logger.info('🤖 Starting VeilTrader...');
  
  try {
    const agent = new VeilTrader({
      // AI APIs (Bankr primary, others free fallback)
      bankrApiKey: process.env.BANKR_API_KEY,
      geminiApiKey: process.env.GEMINI_API_KEY,
      groqApiKey: process.env.GROQ_API_KEY,
      huggingFaceApiKey: process.env.HUGGINGFACE_API_KEY,
      
      // Trading APIs
      uniswapApiKey: process.env.UNISWAP_API_KEY,
      
      // Wallet & Network
      privateKey: process.env.PRIVATE_KEY,
      rpcUrl: process.env.RPC_URL,
      chainId: process.env.CHAIN_ID || '84532',
      
      // Agent Identity
      agentId: process.env.AGENT_ID,
      teamId: process.env.TEAM_ID,
      
      // Risk Parameters
      maxSlippage: process.env.MAX_SLIPPAGE,
      minProfitThreshold: process.env.MIN_PROFIT_THRESHOLD,
      riskTolerance: process.env.RISK_TOLERANCE,
      cycleInterval: process.env.CYCLE_INTERVAL,
      
      // Extension flags
      enableStETH: process.env.ENABLE_STETH === 'true',
      enableStatusNetwork: process.env.ENABLE_STATUS_NETWORK === 'true',
      enableLidoMCP: process.env.ENABLE_LIDO_MCP === 'true',
      enableENS: process.env.ENABLE_ENS === 'true',
      enableCelo: process.env.ENABLE_CELO === 'true',
      celoTestnet: process.env.CELO_TESTNET !== 'false',
      celoAutoExecute: process.env.CELO_AUTO_EXECUTE === 'true',
      celoRpcUrl: process.env.CELO_RPC_URL,
      
      // Extension API keys
      olasApiKey: process.env.OLAS_API_KEY,
      openServApiKey: process.env.OPENSERV_API_KEY,
      filecoinApiKey: process.env.FILECOIN_API_KEY
    });

    // Initialize the agent
    await agent.initialize();
    logger.info('✅ VeilTrader initialized successfully');

    // Start the autonomous trading loop
    await agent.start();
    
  } catch (error) {
    logger.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('👋 Shutting down VeilTrader...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('👋 Shutting down VeilTrader...');
  process.exit(0);
});

main();
