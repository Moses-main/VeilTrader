/**
 * Venice.ai Prize Demo
 * Prize: Best Venice.ai Integration
 */

const venice = require('../src/integrations/VeniceIntegration');

async function runDemo() {
  console.log('🎯 Venice.ai Integration Demo\n');

  // Get market sentiment
  console.log('📊 Market Sentiment Analysis:');
  const sentiment = await venice.getMarketSentiment('ETH');
  console.log(`   Sentiment: ${sentiment.sentiment}`);
  console.log(`   Score: ${(sentiment.score * 100).toFixed(1)}%`);
  console.log(`   Confidence: ${(sentiment.confidence * 100).toFixed(1)}%`);
  console.log(`   Source: ${sentiment.source}\n`);

  // Get trading signals
  console.log('📈 Trading Signals:');
  const signals = await venice.getTradingSignals('ETH');
  console.log(`   Signal: ${signals.signal}`);
  console.log(`   Confidence: ${(signals.confidence * 100).toFixed(1)}%`);
  console.log(`   Timeframe: ${signals.timeframe}\n`);

  // Get full market analysis
  console.log('🔍 Full Market Analysis:');
  const analysis = await venice.analyzeMarket();
  console.log(`   Ethereum: ${analysis.ethereum.sentiment}`);
  console.log(`   Bitcoin: ${analysis.bitcoin.sentiment}`);
  console.log(`   Overall: ${analysis.overall}\n`);

  // Get trading recommendation
  console.log('💡 AI Trading Recommendation:');
  const recommendation = await venice.getAgentTradingRecommendation({ symbol: 'ETH' });
  console.log(`   Action: ${recommendation.action}`);
  console.log(`   Confidence: ${(recommendation.confidence * 100).toFixed(1)}%`);
  console.log(`   Factors: ${recommendation.factors.join(', ')}\n`);

  console.log('✅ Venice.ai integration demo complete!');
}

runDemo().catch(console.error);
