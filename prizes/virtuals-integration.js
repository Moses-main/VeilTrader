/**
 * Virtuals Protocol Prize Demo
 * Prize: Best Virtuals Protocol Integration
 */

const virtuals = require('../src/integrations/VirtualsIntegration');

async function runDemo() {
  console.log('🎯 Virtuals Protocol Integration Demo\n');

  // Get agent tokenomics
  console.log('💰 Agent Tokenomics:');
  const tokenomics = await virtuals.getAgentTokenomics();
  console.log(`   Name: ${tokenomics.name}`);
  console.log(`   Symbol: ${tokenomics.symbol}`);
  console.log(`   Total Supply: ${tokenomics.totalSupply.toLocaleString()}`);
  console.log(`   Price: $${tokenomics.price}`);
  console.log(`   Market Cap: $${tokenomics.marketCap}`);
  console.log(`   Holders: ${tokenomics.holders}\n`);

  // Get agent performance
  console.log('📊 Agent Performance:');
  const performance = await virtuals.getAgentPerformance();
  console.log(`   Total Trades: ${performance.totalTrades}`);
  console.log(`   Win Rate: ${(performance.successRate * 100).toFixed(1)}%`);
  console.log(`   Monthly Return: ${performance.monthlyReturn}%`);
  console.log(`   Sharpe Ratio: ${performance.sharpeRatio}\n`);

  // Get agent reputation
  console.log('⭐ Agent Reputation:');
  const reputation = await virtuals.getAgentReputation();
  console.log(`   Score: ${reputation.score}/100`);
  console.log(`   Average Rating: ${reputation.averageRating}/5`);
  console.log(`   Badges: ${reputation.badges.join(', ')}`);
  console.log(`   Tier: ${reputation.tier}\n`);

  // Create agent pool
  console.log('🏊 Create Agent Liquidity Pool:');
  const pool = await virtuals.createAgentPool(10);
  console.log(`   Pool ID: ${pool.id}`);
  console.log(`   Liquidity: $${pool.liquidityUSD}`);
  console.log(`   APR: ${pool.apr.toFixed(1)}%\n`);

  // Fractionalize agent
  console.log('🔄 Fractionalize Agent Token:');
  const fractional = await virtuals.fractionalizeAgent(1, 1000000);
  console.log(`   Fractional ID: ${fractional.id}`);
  console.log(`   Total Shares: ${fractional.totalSupply.toLocaleString()}`);
  console.log(`   Price Per Share: $${fractional.pricePerShare}\n`);

  console.log('✅ Virtuals Protocol integration demo complete!');
}

runDemo().catch(console.error);
