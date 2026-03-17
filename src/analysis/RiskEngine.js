/**
 * Risk Engine
 * 
 * Evaluates risk for trading decisions
 */

const logger = require('../utils/logger');

class RiskEngine {
  constructor(config) {
    this.maxSlippage = config.maxSlippage || 0.005; // 0.5%
    this.minProfitThreshold = config.minProfitThreshold || 0.01; // 1%
    this.riskTolerance = config.riskTolerance || 'medium';
    
    // Risk thresholds by tolerance level
    this.thresholds = {
      low: {
        maxPositionSize: 0.1, // 10% of portfolio
        minConfidence: 0.8,
        maxDailyTrades: 2
      },
      medium: {
        maxPositionSize: 0.25, // 25% of portfolio
        minConfidence: 0.6,
        maxDailyTrades: 5
      },
      high: {
        maxPositionSize: 0.5, // 50% of portfolio
        minConfidence: 0.4,
        maxDailyTrades: 10
      }
    };
  }

  /**
   * Evaluate risk for a trade
   * @param {Object} decision - Proposed trade decision
   * @param {Object} portfolio - Current portfolio
   * @returns {Object} Risk assessment
   */
  evaluate(decision, portfolio) {
    logger.info('⚖️ Evaluating risk...');

    const thresholds = this.thresholds[this.riskTolerance];
    const risks = [];
    let approved = true;

    // Check confidence level
    if (decision.confidence < thresholds.minConfidence) {
      risks.push(`Confidence too low: ${decision.confidence} < ${thresholds.minConfidence}`);
      approved = false;
    }

    // Check position size
    const positionSize = decision.amount / portfolio.totalValue;
    if (positionSize > thresholds.maxPositionSize) {
      risks.push(`Position too large: ${(positionSize * 100).toFixed(1)}% > ${(thresholds.maxPositionSize * 100).toFixed(1)}%`);
      approved = false;
    }

    // Check risk level
    if (decision.riskLevel === 'high' && this.riskTolerance !== 'high') {
      risks.push('High risk trade rejected for current tolerance level');
      approved = false;
    }

    // Check slippage (if provided)
    if (decision.expectedSlippage && decision.expectedSlippage > this.maxSlippage) {
      risks.push(`Slippage too high: ${decision.expectedSlippage} > ${this.maxSlippage}`);
      approved = false;
    }

    const assessment = {
      approved,
      risks,
      riskScore: this.calculateRiskScore(decision, portfolio),
      maxPositionSize: thresholds.maxPositionSize,
      recommendedAction: approved ? 'PROCEED' : 'REJECT'
    };

    logger.info(`⚖️ Risk assessment: ${assessment.approved ? 'APPROVED' : 'REJECTED'}`);
    return assessment;
  }

  /**
   * Calculate overall risk score (0-100)
   */
  calculateRiskScore(decision, portfolio) {
    let score = 50; // Base score

    // Adjust for confidence
    score += (decision.confidence - 0.5) * 20;

    // Adjust for position size
    const positionSize = decision.amount / portfolio.totalValue;
    score -= positionSize * 30;

    // Adjust for risk level
    const riskMultipliers = { low: 10, medium: 0, high: -20 };
    score += riskMultipliers[decision.riskLevel] || 0;

    // Clamp to 0-100
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Check if portfolio is balanced
   */
  checkBalance(portfolio) {
    const maxAllocation = Math.max(...Object.values(portfolio.allocation));
    const isBalanced = maxAllocation < 0.6; // No single asset > 60%
    
    return {
      isBalanced,
      maxAllocation,
      recommendation: isBalanced ? 'BALANCED' : 'REBALANCE_NEEDED'
    };
  }
}

module.exports = RiskEngine;
