/**
 * Decision Engine
 * 
 * Makes trading decisions based on AI analysis and risk assessment
 */

const logger = require('../utils/logger');

class DecisionEngine {
  constructor(config) {
    this.riskEngine = config.riskEngine;
    this.bankrGateway = config.bankrGateway;
  }

  /**
   * Make trading decision
   * @param {Object} portfolio - Current portfolio
   * @param {Object} analysis - AI analysis from Bankr
   * @returns {Object} Trading decision
   */
  async decide(portfolio, analysis) {
    logger.info('🎯 Making trading decision...');

    // Default decision
    let decision = {
      action: 'HOLD',
      confidence: analysis.confidence || 0.5,
      reasoning: analysis.reasoning || 'No clear signal',
      riskLevel: analysis.riskLevel || 'medium',
      timestamp: Date.now()
    };

    // Parse AI recommendation
    if (analysis.recommendation === 'BUY' || analysis.recommendation === 'SELL') {
      decision.action = analysis.recommendation;
      decision.targetAsset = analysis.targetAsset;
      decision.targetAmount = this.calculateTradeAmount(
        analysis.targetAmount,
        portfolio,
        analysis
      );
    }

    // Evaluate risk
    const riskAssessment = this.riskEngine.evaluate(decision, portfolio);
    
    // Override if risk check fails
    if (!riskAssessment.approved) {
      logger.warn('⚠️ Risk check failed, switching to HOLD');
      decision = {
        action: 'HOLD',
        confidence: decision.confidence,
        reasoning: `Risk check failed: ${riskAssessment.risks.join(', ')}`,
        riskLevel: decision.riskLevel,
        timestamp: Date.now()
      };
    }

    logger.info(`🎯 Decision: ${decision.action} (${decision.confidence * 100}% confidence)`);
    return decision;
  }

  /**
   * Calculate trade amount based on portfolio and AI recommendation
   */
  calculateTradeAmount(recommendedAmount, portfolio, analysis) {
    // Get max position size based on risk tolerance
    const maxPositionSize = this.riskEngine.thresholds[this.riskEngine.riskTolerance].maxPositionSize;
    const maxAmount = portfolio.totalValue * maxPositionSize;

    // Parse recommended amount
    let amount = parseFloat(recommendedAmount);
    if (isNaN(amount)) {
      // Default to 5% of portfolio if not specified
      amount = portfolio.totalValue * 0.05;
    }

    // Cap at max position size
    return Math.min(amount, maxAmount);
  }

  /**
   * Get decision history (placeholder for persistence)
   */
  async getDecisionHistory() {
    // In production, fetch from database or on-chain
    return [];
  }
}

module.exports = DecisionEngine;
