/**
 * VeilTrader Smart Contract Interface
 * 
 * Interacts with the deployed VeilTrader contract on Base
 */

const { ethers } = require('ethers');
const logger = require('../utils/logger');

const VEILTRADER_ABI = [
  'function executeTrade(string memory _actionType, address _tokenIn, address _tokenOut, uint256 _amountIn, uint256 _amountOut, string memory _metadata) external returns (bytes32 actionHash)',
  'function getTrade(bytes32 _actionHash) external view returns (tuple(bytes32 actionHash, string actionType, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut, uint256 timestamp, string metadata, uint256 reputationFeedbackGiven, bytes32 proofHash))',
  'function getAllTrades() external view returns (tuple(bytes32 actionHash, string actionType, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut, uint256 timestamp, string metadata, uint256 reputationFeedbackGiven, bytes32 proofHash)[])',
  'function getTradeCount() external view returns (uint256)',
  'function registerWithERC8004(string calldata metadataURI, string calldata domain) external returns (uint256)',
  'function giveTradeReputationFeedback(uint256 tradeIdx, int128 value, uint8 decimals, string calldata tag1, string calldata tag2, string calldata detailsURI) external',
  'function setSelfId(bytes32 _selfId) external',
  'function submitProof(bytes32 proofHash, string calldata attributes) external returns (bool)',
  'function submitTradeProof(bytes32 actionHash, bytes32 proofHash, string calldata attributes) external returns (bool)',
  'function grantDelegation(address delegate, uint256 maxValuePerTx, uint256 maxTotalValue) external',
  'function revokeDelegation(address delegate) external',
  'function receiveLocusPayment(address from, uint256 amount, string calldata paymentId, string calldata memo) external',
  'function sendLocusPayment(address to, uint256 amount, string calldata paymentId, string calldata memo) external',
  'event TradeExecuted(bytes32 indexed actionHash, string actionType, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut, uint256 timestamp)',
  'event IdentityUpdated(bytes32 indexed agentId, string metadata)',
  'event ERC8004Registered(uint256 indexed tokenId, string metadataURI, string domain)'
];

class VeilTraderContract {
  constructor(config) {
    this.provider = config.provider;
    this.wallet = config.wallet;
    this.contractAddress = process.env.VEILTRADER_CONTRACT;
    this.contract = null;
  }

  async initialize() {
    if (!this.contractAddress) {
      logger.warn('⚠️ No VEILTRADER_CONTRACT address configured');
      return;
    }

    this.contract = new ethers.Contract(
      this.contractAddress,
      VEILTRADER_ABI,
      this.wallet
    );

    logger.info(`✅ VeilTrader contract initialized at ${this.contractAddress}`);
  }

  async executeTrade(actionType, tokenIn, tokenOut, amountIn, amountOut, metadata = '') {
    if (!this.contract) {
      logger.warn('⚠️ Contract not initialized, skipping on-chain trade');
      return null;
    }

    try {
      logger.info(`⛓️ Recording trade on-chain: ${actionType}`);

      const tx = await this.contract.executeTrade(
        actionType,
        tokenIn,
        tokenOut,
        amountIn,
        amountOut,
        metadata
      );

      const receipt = await tx.wait();
      logger.info(`✅ Trade recorded on-chain: ${receipt.hash}`);

      const actionHash = tx.hash;
      return {
        txHash: receipt.hash,
        actionHash: actionHash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      logger.error('❌ Failed to record trade on-chain:', error.message);
      return null;
    }
  }

  async getTradeCount() {
    if (!this.contract) return 0;
    try {
      return await this.contract.getTradeCount();
    } catch (error) {
      logger.error('❌ Failed to get trade count:', error.message);
      return 0;
    }
  }

  async getAllTrades() {
    if (!this.contract) return [];
    try {
      return await this.contract.getAllTrades();
    } catch (error) {
      logger.error('❌ Failed to get trades:', error.message);
      return [];
    }
  }

  async registerWithERC8004(metadataURI, domain) {
    if (!this.contract) {
      logger.warn('⚠️ Contract not initialized');
      return null;
    }

    try {
      logger.info('⛓️ Registering with ERC-8004...');
      const tx = await this.contract.registerWithERC8004(metadataURI, domain);
      const receipt = await tx.wait();
      logger.info(`✅ ERC-8004 registration complete: ${receipt.hash}`);
      return receipt;
    } catch (error) {
      logger.error('❌ ERC-8004 registration failed:', error.message);
      return null;
    }
  }

  async setSelfId(selfId) {
    if (!this.contract) {
      logger.warn('⚠️ Contract not initialized');
      return null;
    }

    try {
      logger.info('⛓️ Setting Self ID...');
      const tx = await this.contract.setSelfId(selfId);
      const receipt = await tx.wait();
      logger.info(`✅ Self ID set: ${receipt.hash}`);
      return receipt;
    } catch (error) {
      logger.error('❌ Failed to set Self ID:', error.message);
      return null;
    }
  }

  async submitProof(proofHash, attributes) {
    if (!this.contract) return null;

    try {
      const tx = await this.contract.submitProof(proofHash, attributes);
      const receipt = await tx.wait();
      logger.info(`✅ Proof submitted: ${receipt.hash}`);
      return receipt;
    } catch (error) {
      logger.error('❌ Failed to submit proof:', error.message);
      return null;
    }
  }

  async submitTradeProof(actionHash, proofHash, attributes) {
    if (!this.contract) return null;

    try {
      const tx = await this.contract.submitTradeProof(actionHash, proofHash, attributes);
      const receipt = await tx.wait();
      logger.info(`✅ Trade proof submitted: ${receipt.hash}`);
      return receipt;
    } catch (error) {
      logger.error('❌ Failed to submit trade proof:', error.message);
      return null;
    }
  }
}

module.exports = VeilTraderContract;
