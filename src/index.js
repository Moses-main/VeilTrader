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
      bankrApiKey: process.env.BANKR_API_KEY,
      uniswapApiKey: process.env.UNISWAP_API_KEY,
      privateKey: process.env.PRIVATE_KEY,
      rpcUrl: process.env.RPC_URL,
      agentId: process.env.AGENT_ID,
      teamId: process.env.TEAM_ID
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
