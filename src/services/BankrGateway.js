/**
 * Bankr Gateway
 * 
 * Privacy-preserving LLM inference via Bankr
 * Primary AI provider (requires credits for full functionality)
 * https://llm.bankr.bot
 */

const axios = require('axios');
const logger = require('../utils/logger');

class BankrGateway {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.baseUrl = 'https://llm.bankr.bot';
    this.freeGateway = config.freeGateway; // Reference to FreeAIGateway
  }

  /**
   * Analyze portfolio using privacy-preserving LLM
   * @param {Object} portfolio - Portfolio data
   * @returns {Object} AI analysis and recommendations
   */
  async analyzePortfolio(portfolio) {
    logger.info('🤖 Requesting AI analysis from Bankr Gateway...');

    const prompt = this.buildAnalysisPrompt(portfolio);

    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/chat/completions`,
        {
          model: 'claude-sonnet-4.6',
          messages: [
            {
              role: 'system',
              content: 'You are a DeFi trading analyst. Analyze the portfolio and provide trading recommendations. Respond with JSON only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1000
        },
        {
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      const analysis = this.parseAnalysis(response.data);
      logger.info('✅ AI analysis received from Bankr');
      return analysis;

    } catch (error) {
      logger.warn('⚠️ Bankr Gateway unavailable:', error.message);
      
      // Try free AI gateway if available
      if (this.freeGateway) {
        logger.info('🤖 Trying free AI gateway...');
        const freeAnalysis = await this.freeGateway.analyzePortfolio(portfolio);
        if (freeAnalysis) {
          logger.info('✅ AI analysis received from free gateway');
          return freeAnalysis;
        }
      }
      
      logger.warn('⚠️ All AI providers failed, using fallback analysis');
      return this.getFallbackAnalysis(portfolio);
    }
  }

  /**
   * Fallback analysis when Bankr is unavailable
   */
  getFallbackAnalysis(portfolio) {
    logger.info('📊 Using fallback analysis based on portfolio state');
    return {
      sentiment: 'neutral',
      recommendation: 'HOLD',
      confidence: 0.5,
      reasoning: 'Bankr Gateway unavailable - using conservative fallback',
      riskLevel: 'medium'
    };
  }

  /**
   * Build analysis prompt from portfolio data
   */
  buildAnalysisPrompt(portfolio) {
    return `
Analyze this DeFi portfolio and provide trading recommendations:

Portfolio:
- Total Value: $${portfolio.totalValue.toFixed(2)}
- Assets: ${portfolio.assets.map(a => `${a.symbol}: ${a.balance} ($${a.value})`).join(', ')}
- Current Allocation: ${JSON.stringify(portfolio.allocation)}

Market Context:
- Network: Base
- Gas Price: ${portfolio.gasPrice} gwei

Provide a JSON response with:
{
  "sentiment": "bullish|bearish|neutral",
  "recommendation": "HOLD|BUY|SELL",
  "confidence": 0.0-1.0,
  "reasoning": "detailed explanation",
  "targetAsset": "token symbol if trade recommended",
  "targetAmount": "amount to trade",
  "riskLevel": "low|medium|high"
}
`;
  }

  /**
   * Parse LLM response into structured analysis
   */
  parseAnalysis(response) {
    try {
      // Extract JSON from response
      const content = response.choices?.[0]?.message?.content || response.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback: try parsing entire content
      return JSON.parse(content);
    } catch (error) {
      logger.warn('⚠️ Could not parse AI response as JSON, using fallback');
      return {
        sentiment: 'neutral',
        recommendation: 'HOLD',
        confidence: 0.5,
        reasoning: 'Could not parse AI response',
        riskLevel: 'medium'
      };
    }
  }

  /**
   * Check Bankr wallet balance
   */
  async getBalance() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/v1/wallet/balance`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      return response.data;
    } catch (error) {
      logger.error('❌ Failed to get Bankr balance:', error.message);
      return null;
    }
  }
}

module.exports = BankrGateway;
