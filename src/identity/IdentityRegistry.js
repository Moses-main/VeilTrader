/**
 * ERC-8004 Identity Registry
 * 
 * Manages on-chain agent identity and reputation
 * Every action is logged to the blockchain
 */

const { ethers } = require('ethers');
const logger = require('../utils/logger');

// ERC-8004 Interface
const ERC8004_ABI = [
  // Core identity functions
  'function register(string memory name, string memory description, string memory image) external returns (bytes32 participantId)',
  'function updateReputation(bytes32 participantId, bytes32 actionHash, string memory actionType, string memory metadata) external',
  'function getReputation(bytes32 participantId) external view returns (uint256 score, uint256 actionCount)',
  'function getActions(bytes32 participantId) external view returns (bytes32[] memory)',
  
  // Events
  'event IdentityRegistered(bytes32 indexed participantId, address indexed owner, string name)',
  'event ActionLogged(bytes32 indexed participantId, bytes32 indexed actionHash, string actionType, uint256 timestamp)'
];

class IdentityRegistry {
  constructor(config) {
    this.provider = config.provider;
    this.wallet = config.wallet;
    this.agentId = config.agentId;
    this.contractAddress = process.env.ERC8004_REGISTRY;
    this.contract = null;
    this.isRegistered = false;
  }

  async initialize() {
    if (this.contractAddress) {
      this.contract = new ethers.Contract(
        this.contractAddress,
        ERC8004_ABI,
        this.wallet
      );
    }
  }

  /**
   * Register agent on-chain (ERC-8004)
   */
  async register() {
    if (!this.contract) {
      logger.warn('⚠️ No ERC-8004 registry contract configured, skipping on-chain registration');
      return;
    }

    try {
      logger.info('⛓️ Registering agent on-chain...');
      
      const tx = await this.contract.register(
        'Stealth',
        'Privacy-first autonomous AI trading agent',
        ''
      );
      
      const receipt = await tx.wait();
      logger.info(`✅ Agent registered: ${receipt.hash}`);
      this.isRegistered = true;
      
    } catch (error) {
      // Already registered is OK
      if (error.message.includes('already registered')) {
        logger.info('✅ Agent already registered');
        this.isRegistered = true;
      } else {
        logger.error('❌ Registration failed:', error.message);
      }
    }
  }

  /**
   * Log an action to the on-chain registry
   * @param {string} actionType - HOLD, BUY, SELL
   * @param {Object} metadata - Action details
   */
  async logAction(actionType, metadata) {
    if (!this.contract || !this.isRegistered) {
      logger.warn('⚠️ Cannot log action: registry not available');
      return this.logActionOffChain(actionType, metadata);
    }

    try {
      const actionHash = ethers.keccak256(
        ethers.toUtf8Bytes(JSON.stringify(metadata) + Date.now())
      );

      const tx = await this.contract.updateReputation(
        ethers.hexlify(ethers.toUtf8Bytes(this.agentId)),
        actionHash,
        actionType,
        JSON.stringify(metadata)
      );

      const receipt = await tx.wait();
      logger.info(`✅ Action logged on-chain: ${receipt.hash}`);

      return {
        txHash: receipt.hash,
        actionHash: actionHash,
        timestamp: Date.now()
      };

    } catch (error) {
      logger.error('❌ Failed to log action on-chain:', error.message);
      return this.logActionOffChain(actionType, metadata);
    }
  }

  /**
   * Off-chain action logging (fallback)
   */
  logActionOffChain(actionType, metadata) {
    const actionHash = ethers.keccak256(
      ethers.toUtf8Bytes(JSON.stringify(metadata) + Date.now())
    );

    logger.info(`📝 Action logged off-chain: ${actionType}`, {
      actionHash,
      metadata,
      timestamp: Date.now()
    });

    return {
      actionHash,
      timestamp: Date.now(),
      offChain: true
    };
  }

  /**
   * Get agent reputation score
   */
  async getReputation() {
    if (!this.contract) {
      return { score: 0, actionCount: 0 };
    }

    try {
      const [score, actionCount] = await this.contract.getReputation(
        ethers.hexlify(ethers.toUtf8Bytes(this.agentId))
      );
      
      return {
        score: score.toString(),
        actionCount: actionCount.toString()
      };
    } catch (error) {
      logger.error('❌ Failed to get reputation:', error.message);
      return { score: 0, actionCount: 0 };
    }
  }

  /**
   * Get action history
   */
  async getActions() {
    if (!this.contract) {
      return [];
    }

    try {
      const actions = await this.contract.getActions(
        ethers.hexlify(ethers.toUtf8Bytes(this.agentId))
      );
      return actions;
    } catch (error) {
      logger.error('❌ Failed to get actions:', error.message);
      return [];
    }
  }
}

module.exports = IdentityRegistry;
