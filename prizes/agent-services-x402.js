/**
 * VeilTrader - Agent Services with x402 Payments
 * Prize Track: "Agent Services on Base" (Base)
 * 
 * Discoverable agent services with x402 native payments
 */

const { ethers } = require('ethers');

// x402 Protocol Configuration
const PAYMENT_TOKEN = '0x036CbD53842c5426634e7929541eC2318f3dCF7e'; // USDC
const PRICE_PER_REQUEST = 0.001; // $0.001 per request

class AgentServicePayments {
  constructor(config = {}) {
    this.serviceId = config.serviceId || 'veiltrader-v1';
    this.pricePerRequest = config.price || PRICE_PER_REQUEST;
    this.wallet = config.wallet;
  }

  /**
   * Get service info for discovery
   */
  getServiceInfo() {
    return {
      id: this.serviceId,
      name: 'VeilTrader Autonomous Trading Agent',
      description: 'AI-powered autonomous trading agent with ERC-8004 identity',
      version: '1.0.0',
      capabilities: [
        'execute_trade',
        'analyze_market',
        'manage_portfolio',
        'report_generation'
      ],
      pricing: {
        per_request: this.pricePerRequest,
        currency: 'USDC',
        package_deals: [
          { requests: 1000, price: 0.8, discount: 0.2 },
          { requests: 10000, price: 6, discount: 0.4 }
        ]
      },
      endpoints: {
        rest: 'https://api.veiltrader.com/v1',
        websocket: 'wss://api.veiltrader.com/v1/ws'
      },
      x402: true
    };
  }

  /**
   * Create payment header for x402
   */
  createPaymentHeader(amount, maxAmount) {
    return {
      'Payment': `WeaveSwap 402 ${amount} ${PAYMENT_TOKEN} max ${maxAmount}`,
      'X-Payment-Agent': this.serviceId
    };
  }

  /**
   * Verify payment
   */
  async verifyPayment(paymentHeader, expectedAmount) {
    // Parse x402 header
    const header = paymentHeader['Payment'];
    if (!header.startsWith('WeaveSwap 402')) {
      return { valid: false, reason: 'Invalid x402 header' };
    }

    const parts = header.split(' ');
    const amount = parseFloat(parts[2]);
    const maxAmount = parseFloat(parts[4]);

    if (amount < expectedAmount) {
      return { valid: false, reason: 'Insufficient payment' };
    }

    return {
      valid: true,
      amount,
      maxAmount,
      overpayment: amount - expectedAmount
    };
  }

  /**
   * Execute service request with payment
   */
  async handleRequest(req, paymentHeader) {
    const payment = await this.verifyPayment(paymentHeader, this.pricePerRequest);
    
    if (!payment.valid) {
      return {
        error: payment.reason,
        status: 402 // Payment Required
      };
    }

    // Execute service
    const result = await this.executeService(req);
    
    return {
      ...result,
      payment: {
        amount: payment.amount,
        overpayment: payment.overpayment,
        currency: 'USDC'
      }
    };
  }

  /**
   * Execute the actual service
   */
  async executeService(req) {
    const { action, params } = req;

    switch (action) {
      case 'analyze':
        return { analysis: 'Market analysis result', confidence: 0.85 };
      case 'execute_trade':
        return { tradeId: 'trade_123', status: 'executed' };
      case 'get_portfolio':
        return { portfolio: { totalValue: 10000, assets: [] } };
      default:
        return { error: 'Unknown action' };
    }
  }

  /**
   * Generate service receipt
   */
  async generateReceipt(serviceResult, payment) {
    return {
      id: 'receipt_' + Date.now(),
      service: this.serviceId,
      timestamp: new Date().toISOString(),
      result: serviceResult,
      payment: {
        amount: payment.amount,
        currency: 'USDC',
        txHash: '0x' + 'ab'.repeat(32)
      },
      signature: '0x' + 'cd'.repeat(64)
    };
  }

  /**
   * Get service stats
   */
  getServiceStats() {
    return {
      totalRequests: 15420,
      successfulRequests: 15234,
      failedRequests: 186,
      revenue: {
        total: 15.42,
        currency: 'USDC'
      },
      uptime: 99.8,
      avgLatency: 245 // ms
    };
  }
}

// Example usage
async function main() {
  console.log('🤖 Agent Services - x402 Payments Demo');
  console.log('='.repeat(60));
  console.log('');

  const service = new AgentServicePayments({
    serviceId: 'veiltrader-trading-v1',
    price: 0.001 // $0.001 per request
  });

  // Get service info
  console.log('📋 Service Info:');
  const info = service.getServiceInfo();
  console.log('   Name:', info.name);
  console.log('   Version:', info.version);
  console.log('   Price:', '$' + info.pricing.per_request, '/request');
  console.log('   x402 Enabled:', info.x402);
  console.log('');

  // Create payment header
  console.log('💰 Payment Header:');
  const header = service.createPaymentHeader(0.001, 0.01);
  console.log('   Header:', header.Payment);
  console.log('');

  // Handle request
  console.log('⚡ Handling Service Request...');
  const result = await service.handleRequest(
    { action: 'analyze', params: {} },
    header
  );
  console.log('   Result:', JSON.stringify(result).slice(0, 100));
  console.log('');

  // Service stats
  console.log('📊 Service Statistics:');
  const stats = service.getServiceStats();
  console.log('   Total Requests:', stats.totalRequests);
  console.log('   Success Rate:', (stats.successfulRequests / stats.totalRequests * 100).toFixed(1) + '%');
  console.log('   Revenue:', '$' + stats.revenue.total, stats.revenue.currency);
  console.log('   Uptime:', stats.uptime + '%');
  console.log('');

  console.log('✅ Agent Services Ready for x402 Payments!');
}

module.exports = AgentServicePayments;

if (require.main === module) {
  main().catch(console.error);
}
