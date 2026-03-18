/**
 * Olas Marketplace Integration
 * 
 * Enables hiring and monetizing agents on Olas Marketplace
 * Prizes: Hire an Agent / Monetize Your Agent - Olas
 */

const axios = require('axios');
const logger = require('../utils/logger');

class OlasMarketplace {
  constructor(config) {
    this.apiKey = config.olasApiKey;
    this.baseUrl = 'https://api.olas.network';
    
    this.agentRegistry = '0x2A17030975b6A0d9465735dE7F6E2b3E2C8E8bE4';
    this.portfolioManager = '0x3B2706d1d6c9D8fB9a2C7E8eF3A1c5D2E9f8B7C6';
  }

  async initialize() {
    logger.info('✅ Olas Marketplace initialized');
  }

  async registerAgent(metadata) {
    try {
      logger.info('📝 Registering agent on Olas Marketplace...');
      
      const agentData = {
        name: metadata.name || 'VeilTrader',
        description: metadata.description || 'Privacy-first autonomous AI trading agent',
        capabilities: ['trading', 'defi', 'portfolio-management'],
        chain_id: 84532,
        address: metadata.address,
        metadata_uri: metadata.metadataUri
      };

      const response = await axios.post(`${this.baseUrl}/v1/agents/register`, agentData, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      logger.info(`✅ Agent registered on Olas: ${response.data.agent_id}`);
      return { success: true, agentId: response.data.agent_id };
    } catch (error) {
      logger.warn('⚠️ Olas registration failed (optional):', error.message);
      return { success: false, error: error.message };
    }
  }

  async hireAgent(agentId, jobDescription) {
    try {
      logger.info(`🤝 Hiring agent ${agentId}...`);
      
      const job = {
        agent_id: agentId,
        description: jobDescription,
        chain_id: 84532,
        payment_token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        payment_amount: 1000000
      };

      const response = await axios.post(`${this.baseUrl}/v1/jobs/create`, job, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      logger.info(`✅ Job created: ${response.data.job_id}`);
      return { success: true, jobId: response.data.job_id };
    } catch (error) {
      logger.warn('⚠️ Olas job creation failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async listAvailableAgents() {
    try {
      const response = await axios.get(`${this.baseUrl}/v1/agents`, {
        params: { chain_id: 84532 },
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      
      return response.data.agents || [];
    } catch (error) {
      logger.warn('⚠️ Failed to list Olas agents:', error.message);
      return [];
    }
  }

  async createServiceSlot(pricePerHour, description) {
    try {
      logger.info('💰 Creating service slot on Olas...');
      
      const service = {
        name: 'VeilTrader Trading Service',
        description: description || 'Autonomous DeFi trading service',
        price_per_hour: pricePerHour,
        chain_id: 84532,
        capabilities: ['swap', 'portfolio-management', 'risk-analysis']
      };

      const response = await axios.post(`${this.baseUrl}/v1/services`, service, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      logger.info(`✅ Service slot created: ${response.data.service_id}`);
      return { success: true, serviceId: response.data.service_id };
    } catch (error) {
      logger.warn('⚠️ Olas service creation failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async getAgentReputation(agentId) {
    try {
      const response = await axios.get(`${this.baseUrl}/v1/agents/${agentId}/reputation`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      
      return response.data;
    } catch (error) {
      logger.warn('⚠️ Failed to get agent reputation:', error.message);
      return null;
    }
  }
}

module.exports = OlasMarketplace;
