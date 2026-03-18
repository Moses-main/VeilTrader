/**
 * Celo Integration
 * 
 * Deploy and run agent on Celo network
 * Prize: Best Agent on Celo - Celo Foundation
 */

const { ethers } = require('ethers');
const logger = require('../utils/logger');

class CeloIntegration {
  constructor(config) {
    this.wallet = config.wallet;
    
    // Celo Alfajores (testnet)
    this.celoRpcUrl = 'https://alfajores-forno.celo-testnet.org';
    this.celoChainId = 44787;
    
    // Celo mainnet
    this.celoMainnetRpc = 'https://forno.celo.org';
    this.celoMainnetChainId = 42220;
    
    this.provider = null;
  }

  async initialize(testnet = true) {
    const rpcUrl = testnet ? this.celoRpcUrl : this.celoMainnetRpc;
    const chainId = testnet ? this.celoChainId : this.celoMainnetChainId;
    
    this.provider = new ethers.JsonRpcProvider(rpcUrl, {
      chainId: chainId,
      name: testnet ? 'celo-alfajores' : 'celo'
    });
    
    logger.info(`✅ Celo integration initialized (${testnet ? 'Alfajores' : 'Mainnet'})`);
    return true;
  }

  async deployAgentContract(bytecode, abi, args = []) {
    try {
      logger.info('🤖 Deploying agent contract to Celo...');
      
      const factory = new ethers.ContractFactory(abi, bytecode, this.wallet);
      const contract = await factory.deploy(...args);
      
      await contract.waitForDeployment();
      const address = await contract.getAddress();
      
      logger.info(`✅ Agent deployed on Celo: ${address}`);
      return { success: true, address: address };
    } catch (error) {
      logger.error('❌ Celo deployment failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async executeTradeOnCelo(contractAddress, abi, params) {
    try {
      logger.info('💱 Executing trade on Celo...');
      
      const contract = new ethers.Contract(contractAddress, abi, this.wallet);
      const tx = await contract.executeTrade(...params);
      const receipt = await tx.wait();
      
      logger.info(`✅ Trade executed on Celo: ${receipt.hash}`);
      return { success: true, txHash: receipt.hash };
    } catch (error) {
      logger.error('❌ Trade execution failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async registerWithERC8004OnCelo(contractAddress, metadataURI, domain) {
    try {
      logger.info('⛓️ Registering with ERC-8004 on Celo...');
      
      const abi = ['function register(string calldata metadataURI, string calldata domain) external returns (uint256)'];
      const contract = new ethers.Contract(contractAddress, abi, this.wallet);
      
      const tx = await contract.register(metadataURI, domain);
      const receipt = await tx.wait();
      
      logger.info(`✅ ERC-8004 registered on Celo: ${receipt.hash}`);
      return { success: true, txHash: receipt.hash };
    } catch (error) {
      logger.warn('⚠️ ERC-8004 registration failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async getBalance(address) {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      logger.warn('⚠️ Failed to get Celo balance:', error.message);
      return '0';
    }
  }

  async verifyDeployment() {
    try {
      const blockNumber = await this.provider.getBlockNumber();
      const network = await this.provider.getNetwork();
      logger.info(`✅ Celo connected - Chain: ${network.chainId}, Block: ${blockNumber}`);
      return true;
    } catch (error) {
      logger.error('❌ Celo connection failed:', error.message);
      return false;
    }
  }
}

module.exports = CeloIntegration;
