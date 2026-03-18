/**
 * OpenServ Integration
 * 
 * Enables x402-native services and multi-agent behavior
 * Prize: Ship Something Real with OpenServ - OpenServ
 */

const axios = require('axios');
const logger = require('../utils/logger');

class OpenServIntegration {
  constructor(config) {
    this.apiKey = config.openservApiKey;
    this.baseUrl = 'https://api.openserv.ai';
    
    // x402 payment endpoint
    this.x402Endpoint = 'https://x402.openserv.ai/pay';
  }

  async initialize() {
    logger.info('✅ OpenServ integration initialized');
  }

  async createAgentService(serviceConfig) {
    try {
      logger.info('📦 Creating OpenServ agent service...');
      
      const service = {
        name: serviceConfig.name || 'VeilTrader Trading Service',
        description: serviceConfig.description || 'Privacy-first autonomous trading agent',
        capabilities: ['defi', 'trading', 'portfolio-management', 'risk-analysis'],
        pricing: {
          type: 'per_call',
          amount: 1000000, // 1 USDC per call
          token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
        },
        x402_enabled: true
      };

      const response = await axios.post(`${this.baseUrl}/v1/services`, service, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      logger.info(`✅ OpenServ service created: ${response.data.service_id}`);
      return { success: true, serviceId: response.data.service_id };
    } catch (error) {
      logger.warn('⚠️ OpenServ service creation failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async discoverAgents(filters = {}) {
    try {
      const response = await axios.get(`${this.baseUrl}/v1/agents/discover`, {
        params: filters,
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      
      return response.data.agents || [];
    } catch (error) {
      logger.warn('⚠️ Failed to discover agents:', error.message);
      return [];
    }
  }

  async hireAgent(agentId, task) {
    try {
      logger.info(`🤝 Hiring OpenServ agent ${agentId}...`);
      
      const job = {
        agent_id: agentId,
        task: task,
        payment: {
          amount: 500000,
          token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
        }
      };

      const response = await axios.post(`${this.baseUrl}/v1/jobs`, job, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      logger.info(`✅ OpenServ job created: ${response.data.job_id}`);
      return { success: true, jobId: response.data.job_id };
    } catch (error) {
      logger.warn('⚠️ OpenServ job creation failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async getx402PaymentAddress() {
    try {
      const response = await axios.get(`${this.baseUrl}/v1/x402/address`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      
      return response.data.address;
    } catch (error) {
      logger.warn('⚠️ Failed to get x402 address:', error.message);
      return null;
    }
  }

  async processx402Payment(from, amount, service) {
    try {
      logger.info(`💸 Processing x402 payment for ${service}...`);
      
      const payment = {
        from: from,
        to: this.x402Endpoint,
        amount: amount,
        service: service,
        chain_id: 84532
      };

      const response = await axios.post(`${this.baseUrl}/v1/payments/x402`, payment, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      logger.info('✅ x402 payment processed');
      return { success: true, paymentId: response.data.payment_id };
    } catch (error) {
      logger.warn('⚠️ x402 payment failed:', error.message);
      return { success: false, error: error.message };
    }
  }
}

module.exports = OpenServIntegration;
