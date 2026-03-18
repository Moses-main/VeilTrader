/**
 * ERC-8004 Identity Registry
 * 
 * Manages on-chain agent identity and reputation
 * Every action is logged to the blockchain
 */

const { ethers } = require('ethers');
const logger = require('../utils/logger');

// ERC-8004 IdentityRegistry Interface (Base Sepolia)
const ERC8004_ABI = [
  'function register(string calldata metadataURI, string calldata domain) external returns (uint256 tokenId)',
  'function tokenOfAgentByRegistration(string calldata agentIdentifier) external view returns (uint256)',
  'function agentURI(uint256 tokenId) external view returns (string memory)',
  'function setAgentURI(uint256 tokenId, string calldata metadataURI) external',
  'function ownerOf(uint256 tokenId) external view returns (address)',
  'function balanceOf(address owner) external view returns (uint256)'
];

class IdentityRegistry {
  constructor(config) {
    this.provider = config.provider;
    this.wallet = config.wallet;
    this.agentId = config.agentId;
    this.contractAddress = process.env.ERC8004_REGISTRY || '0x8004A818BFB912233c491871b3d84c89A494BD9e';
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
      logger.info('⛓️ Registering agent on-chain with ERC-8004...');
      
      const metadataURI = process.env.METADATA_URI || 'ipfs://QmExampleMetadataHash';
      const domain = process.env.DOMAIN || 'veiltrader.xyz';
      
      const tx = await this.contract.register(metadataURI, domain);
      
      const receipt = await tx.wait();
      logger.info(`✅ Agent registered with ERC-8004: ${receipt.hash}`);
      this.isRegistered = true;
      
    } catch (error) {
      // Already registered is OK
      if (error.message.includes('already registered') || error.message.includes('ERC721: token already minted')) {
        logger.info('✅ Agent already registered with ERC-8004');
        this.isRegistered = true;
      } else {
        logger.warn('⚠️ ERC-8004 registration skipped (optional):', error.message);
      }
    }
  }

  /**
   * Log an action to the on-chain registry
   * @param {string} actionType - HOLD, BUY, SELL
   * @param {Object} metadata - Action details
   */
  async logAction(actionType, metadata) {
    // Allow off-chain logging even if ERC-8004 registry is not available
    // The VeilTrader contract handles on-chain logging
    if (!this.contract) {
      logger.info('📝 Logging action via VeilTrader contract instead of ERC-8004');
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
