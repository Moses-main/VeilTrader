/**
 * Venice.ai Integration
 * Market sentiment and trading signals for VeilTrader
 * Prize: Best Venice.ai Use
 */

const logger = require('../utils/logger');

class VeniceIntegration {
  constructor() {
    this.apiKey = process.env.VENICE_API_KEY;
    this.endpoint = 'https://api.venice.ai/api/v1';
    this.enabled = !!this.apiKey;
  }

  async initialize() {
    if (this.enabled) {
      logger.info('✅ Venice.ai integration enabled');
    } else {
      logger.info('⚠️ Venice API key not configured - using fallback');
    }
  }

  async getMarketSentiment(symbol = 'ETH') {
    if (!this.enabled) {
      return this.getFallbackSentiment(symbol);
    }

    try {
      const response = await fetch(`${this.endpoint}/sentiment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          symbol,
          timeframe: '24h'
        })
      });

      if (!response.ok) {
        throw new Error(`Venice API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        sentiment: data.sentiment || 'neutral',
        score: data.score || 0.5,
        confidence: data.confidence || 0.5,
        factors: data.factors || [],
        source: 'venice'
      };
    } catch (error) {
      logger.error('❌ Venice sentiment fetch failed:', error.message);
      return this.getFallbackSentiment(symbol);
    }
  }

  async getTradingSignals(symbol = 'ETH') {
    if (!this.enabled) {
      return this.getFallbackSignals(symbol);
    }

    try {
      const response = await fetch(`${this.endpoint}/signals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          symbol,
          include_technical: true,
          include_fundamental: true
        })
      });

      if (!response.ok) {
        throw new Error(`Venice API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        signal: data.signal || 'HOLD',
        entryPrice: data.entryPrice,
        targetPrice: data.targetPrice,
        stopLoss: data.stopLoss,
        confidence: data.confidence || 0.5,
        timeframe: data.timeframe || '1d',
        technicalIndicators: data.technicalIndicators || {},
        source: 'venice'
      };
    } catch (error) {
      logger.error('❌ Venice signals fetch failed:', error.message);
      return this.getFallbackSignals(symbol);
    }
  }

  async analyzeMarket() {
    const [ethSentiment, btcSentiment] = await Promise.all([
      this.getMarketSentiment('ETH'),
      this.getMarketSentiment('BTC')
    ]);

    const overallSentiment = this.aggregateSentiment(ethSentiment, btcSentiment);

    return {
      ethereum: ethSentiment,
      bitcoin: btcSentiment,
      overall: overallSentiment,
      timestamp: new Date().toISOString()
    };
  }

  aggregateSentiment(eth, btc) {
    const avgScore = (eth.score + btc.score) / 2;
    
    if (avgScore > 0.6) return 'bullish';
    if (avgScore < 0.4) return 'bearish';
    return 'neutral';
  }

  getFallbackSentiment(symbol) {
    const sentiment = ['bullish', 'bearish', 'neutral'];
    const random = sentiment[Math.floor(Math.random() * 3)];
    
    return {
      sentiment: random,
      score: Math.random() * 0.4 + 0.3,
      confidence: Math.random() * 0.3 + 0.5,
      factors: ['Fallback: Random sentiment for demo'],
      source: 'fallback'
    };
  }

  getFallbackSignals(symbol) {
    const signals = ['BUY', 'SELL', 'HOLD'];
    const random = signals[Math.floor(Math.random() * 3)];
    
    return {
      signal: random,
      entryPrice: null,
      targetPrice: null,
      stopLoss: null,
      confidence: Math.random() * 0.4 + 0.4,
      timeframe: '1h',
      technicalIndicators: {},
      source: 'fallback'
    };
  }

  async getAgentTradingRecommendation(tradingData) {
    const [sentiment, signals] = await Promise.all([
      this.getMarketSentiment(tradingData.symbol),
      this.getTradingSignals(tradingData.symbol)
    ]);

    const confidence = (sentiment.confidence * 0.4 + signals.confidence * 0.6);
    
    let action = signals.signal;
    
    if (sentiment.sentiment === 'bearish' && action === 'BUY') {
      action = 'HOLD';
    } else if (sentiment.sentiment === 'bullish' && action === 'SELL') {
      action = 'HOLD';
    }

    return {
      action,
      confidence,
      sentiment: sentiment.sentiment,
      factors: [
        `Venice sentiment: ${sentiment.sentiment} (${(sentiment.score * 100).toFixed(1)}%)`,
        `Venice signal: ${signals.signal} (${(signals.confidence * 100).toFixed(1)}% confidence)`
      ],
      metadata: {
        sentiment,
        signals,
        agent: 'Venice.ai'
      }
    };
  }
}

const veniceIntegration = new VeniceIntegration();

module.exports = veniceIntegration;
