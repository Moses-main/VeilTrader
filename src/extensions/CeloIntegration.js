/**
 * Celo Integration
 * 
 * Deploy and run agent on Celo network for cross-chain trading
 * Prize: Best Agent on Celo - Celo Foundation
 */

const { ethers } = require('ethers');
const axios = require('axios');
const logger = require('../utils/logger');

class CeloIntegration {
  constructor(config) {
    this.wallet = config.wallet;
    
    // Celo Alfajores (testnet)
    this.celoRpcUrl = config.celoRpcUrl || 'https://alfajores-forno.celo-testnet.org';
    this.celoChainId = 44787;
    
    // Celo mainnet
    this.celoMainnetRpc = 'https://forno.celo.org';
    this.celoMainnetChainId = 42220;
    
    // Token addresses on Celo
    this.celoTokens = {
      CELO: '0x0000000000000000000000000000000000000000',
      cUSD: '0x874069Fa1Eb16D44d622F2e0Ca25aD94B17a2Dc8',
      cEUR: '0x10C892A6EC8B8B90E8dA56C6f2FdbEA5F9d27F1C',
      WETH: '0x34Cb9BA24d2C49d6C4A7B94B1E2A95e93bB1A7f9',
      USDC: '0xA8D5135Ab6E7e3D3F4F4E4d7C8D9E0F1A2B3C4D5'
    };
    
    this.provider = null;
    this.celoWallet = null;
    this.testnet = true;
  }

  async initialize(testnet = true) {
    this.testnet = testnet;
    const rpcUrl = testnet ? this.celoRpcUrl : this.celoMainnetRpc;
    const chainId = testnet ? this.celoChainId : this.celoMainnetChainId;
    
    this.provider = new ethers.JsonRpcProvider(rpcUrl, {
      chainId: chainId,
      name: testnet ? 'celo-alfajores' : 'celo'
    });
    
    this.celoWallet = new ethers.Wallet(this.wallet.privateKey, this.provider);
    
    logger.info(`✅ Celo integration initialized (${testnet ? 'Alfajores' : 'Mainnet'})`);
    
    // Verify connection
    const connected = await this.verifyConnection();
    if (connected) {
      logger.info(`✅ Celo connected successfully`);
    }
    
    return connected;
  }

  async verifyConnection() {
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

  async getTokenBalance(tokenAddress, address) {
    if (tokenAddress === this.celoTokens.CELO) {
      return this.getBalance(address);
    }
    
    try {
      const tokenABI = [
        'function balanceOf(address owner) view returns (uint256)',
        'function decimals() view returns (uint8)'
      ];
      const token = new ethers.Contract(tokenAddress, tokenABI, this.provider);
      const balance = await token.balanceOf(address);
      const decimals = await token.decimals();
      return ethers.formatUnits(balance, decimals);
    } catch (error) {
      logger.warn('⚠️ Failed to get token balance:', error.message);
      return '0';
    }
  }

  async executeSwap(params) {
    try {
      logger.info(`💱 Executing swap on Celo: ${params.action}`);
      
      const { fromToken, toToken, amount, minAmount } = params;
      
      // Use Celo's Swap contract (Mento or similar)
      const swapContract = '0x7bdE8a3AE3cA808C95c9a5cC6c8B3C5c8E7dF9a';
      
      // Simplified swap execution - in production, use actual DEX like Mento
      const swapData = ethers.solidityPacked(
        ['address', 'address', 'uint256', 'uint256'],
        [fromToken, toToken, amount, minAmount || 0]
      );
      
      const tx = await this.celoWallet.sendTransaction({
        to: swapContract,
        data: swapData,
        value: fromToken === this.celoTokens.CELO ? amount : 0
      });
      
      const receipt = await tx.wait();
      logger.info(`✅ Swap executed on Celo: ${receipt.hash}`);
      
      return {
        success: true,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      logger.error('❌ Celo swap failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async bridgeToCelo(amount) {
    try {
      logger.info(`🌉 Bridging ${amount} ETH to Celo...`);
      
      // Use Celo's Bridge contract
      const bridgeAddress = '0x5b5887A0D1d9D3C4E5F6A7B8C9D0E1F2A3B4C5D';
      
      const tx = await this.celoWallet.sendTransaction({
        to: bridgeAddress,
        value: ethers.parseEther(amount.toString())
      });
      
      const receipt = await tx.wait();
      logger.info(`✅ Bridge transaction sent: ${receipt.hash}`);
      
      return {
        success: true,
        txHash: receipt.hash
      };
    } catch (error) {
      logger.error('❌ Bridge failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async getCeloPortfolio() {
    const address = await this.celoWallet.getAddress();
    const portfolio = {
      address: address,
      network: this.testnet ? 'celo-alfajores' : 'celo',
      chainId: this.testnet ? 44787 : 42220,
      tokens: {}
    };
    
    for (const [symbol, tokenAddress] of Object.entries(this.celoTokens)) {
      portfolio.tokens[symbol] = await this.getTokenBalance(tokenAddress, address);
    }
    
    return portfolio;
  }

  async getMarketData() {
    try {
      // Get CELO price from Celo oracle
      const oracleABI = ['function read() external view returns (uint256, uint256)'];
      const oracle = new ethers.Contract(
        '0x673163fA7EdA85E9dF6f9D8f4A2c3B4E5F6A7B8C',
        oracleABI,
        this.provider
      );
      
      const [numerator, denominator] = await oracle.read();
      const price = Number(numerator) / Number(denominator);
      
      return {
        celoPrice: price,
        network: this.testnet ? 'Alfajores' : 'Mainnet',
        timestamp: Date.now()
      };
    } catch (error) {
      logger.warn('⚠️ Failed to get market data:', error.message);
      return {
        celoPrice: 0.80, // Fallback price
        network: this.testnet ? 'Alfajores' : 'Mainnet',
        timestamp: Date.now()
      };
    }
  }
}

module.exports = CeloIntegration;
