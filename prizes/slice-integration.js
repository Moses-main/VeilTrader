/**
 * Slice Integration Prize Demo
 * Prize: Best Slice Use
 */

const slice = require('../src/integrations/SliceIntegration');

async function runDemo() {
  console.log('🎯 Slice Integration Demo\n');

  // Get yield opportunities
  console.log('📈 Yield Opportunities:');
  const opportunities = await slice.getYieldOpportunities();
  opportunities.forEach((opp, i) => {
    console.log(`   ${i + 1}. ${opp.protocol} - ${opp.token}`);
    console.log(`      APY: ${opp.apy}% | TVL: $${(opp.tvl / 1000000).toFixed(1)}M | Risk: ${opp.risk}`);
  });
  console.log('');

  // Find best yield
  console.log('🎯 Best Yield for 1000 USDC:');
  const bestYield = await slice.findBestYield('USDC', 1000);
  console.log(`   Protocol: ${bestYield.protocol}`);
  console.log(`   APY: ${bestYield.apy}%`);
  console.log(`   Estimated Yield: $${bestYield.estimatedYield.toFixed(2)}`);
  console.log(`   Daily Yield: $${bestYield.estimatedYieldDaily.toFixed(4)}\n`);

  // Get agent yield portfolio
  console.log('💼 Agent Yield Portfolio:');
  const portfolio = await slice.getAgentYieldPortfolio();
  console.log(`   Total Deposited: $${portfolio.totalDeposited}`);
  console.log(`   Current Value: $${portfolio.totalValue}`);
  console.log(`   Total Yield Earned: $${portfolio.totalYieldEarned}`);
  console.log(`   Average APY: ${portfolio.averageApy}%`);
  console.log(`   Estimated Monthly Yield: $${portfolio.estimatedMonthlyYield}\n`);

  // Get yield positions
  console.log('📊 Yield Positions:');
  for (const pos of portfolio.positions) {
    console.log(`   ${pos.protocol} - ${pos.token}`);
    console.log(`      Amount: ${pos.amount} | Value: $${pos.value.toFixed(2)}`);
    console.log(`      APY: ${pos.apy}% | Earned: $${pos.yieldEarned.toFixed(2)}`);
  }
  console.log('');

  // Get yield stats
  console.log('📈 Yield Statistics:');
  const stats = await slice.getYieldStats();
  console.log(`   Total Yield Generated: $${stats.totalYieldGenerated}`);
  console.log(`   Compounding Count: ${stats.compoundingCount}`);
  console.log(`   Average APY: ${stats.averageApy}%\n`);

  // Auto-optimize
  console.log('🚀 Auto-Optimize Yield:');
  const optimize = await slice.autoOptimizeYield(portfolio);
  console.log(`   Potential Gain: $${optimize.potentialGain.toFixed(2)}`);
  console.log(`   Risk Assessment: ${optimize.riskAssessment}`);
  if (optimize.recommendations.length > 0) {
    console.log('   Recommendations:');
    for (const rec of optimize.recommendations) {
      console.log(`      ${rec.action}: ${rec.from} → ${rec.to} (+${rec.additionalYield.toFixed(1)}% APY)`);
    }
  }
  console.log('');

  console.log('✅ Slice integration demo complete!');
}

runDemo().catch(console.error);
