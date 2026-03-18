/**
 * Status Network Extension
 * 
 * Enables gasless transactions on Status Network Sepolia
 * Prize: Go Gasless - Status Network
 */

const { ethers } = require('ethers');
const logger = require('../utils/logger');

class StatusNetwork {
  constructor(config) {
    this.provider = config.provider;
    this.wallet = config.wallet;
    
    this.statusRpcUrl = 'https://sepoliarpc.status.network';
    this.chainId = 299333333420;
    
    this.statusProvider = null;
    this.statusWallet = null;
  }

  async initialize() {
    try {
      this.statusProvider = new ethers.JsonRpcProvider(this.statusRpcUrl, {
        chainId: this.chainId,
        name: 'status-sepolia'
      });
      
      this.statusWallet = new ethers.Wallet(this.wallet.privateKey, this.statusProvider);
      logger.info('✅ Status Network extension initialized');
      return true;
    } catch (error) {
      logger.error('❌ Failed to initialize Status Network:', error.message);
      return false;
    }
  }

  async deployGaslessContract(bytecode, abi, args = []) {
    try {
      logger.info('🚀 Deploying contract gaslessly on Status Network...');
      
      const factory = new ethers.ContractFactory(abi, bytecode, this.statusWallet);
      const contract = await factory.deploy(...args, {
        gasPrice: 0,
        gasLimit: 5000000
      });
      
      await contract.waitForDeployment();
      const address = await contract.getAddress();
      
      logger.info(`✅ Contract deployed gaslessly at: ${address}`);
      
      return {
        success: true,
        address: address,
        transactionHash: contract.deploymentTransaction().hash
      };
    } catch (error) {
      logger.error('❌ Gasless deployment failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async sendGaslessTransaction(to, data = '0x', value = 0) {
    try {
      logger.info(`📤 Sending gasless transaction to ${to}...`);
      
      const tx = await this.statusWallet.sendTransaction({
        to: to,
        data: data,
        value: value,
        gasPrice: 0,
        gasLimit: 100000
      });
      
      const receipt = await tx.wait();
      
      logger.info(`✅ Gasless transaction confirmed: ${receipt.hash}`);
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      logger.error('❌ Gasless transaction failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async verifyDeployment() {
    try {
      const blockNumber = await this.statusProvider.getBlockNumber();
      logger.info(`✅ Status Network connected - Block: ${blockNumber}`);
      return true;
    } catch (error) {
      logger.error('❌ Status Network verification failed:', error.message);
      return false;
    }
  }
}

module.exports = StatusNetwork;
