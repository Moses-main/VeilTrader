/**
 * Portfolio Analyzer
 * 
 * Analyzes DeFi portfolio positions and market data
 */

const { ethers } = require('ethers');
const logger = require('../utils/logger');

// ERC20 ABI for balance checking
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)'
];

class PortfolioAnalyzer {
  constructor(config) {
    this.provider = config.provider;
    this.wallet = config.wallet;
    
    // Track tokens to monitor
    this.tokens = [
      { address: '0x4200000000000000000000000000000000000006', symbol: 'WETH' },
      { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', symbol: 'USDC' },
      { address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA', symbol: 'USDbC' },
      { address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', symbol: 'DAI' }
    ];
  }

  /**
   * Analyze current portfolio
   * @returns {Object} Portfolio analysis
   */
  async analyze() {
    logger.info('📊 Analyzing portfolio...');

    const address = await this.wallet.getAddress();
    const assets = [];
    let totalValue = 0;

    // Get ETH balance
    const ethBalance = await this.provider.getBalance(address);
    const ethValue = parseFloat(ethers.formatEther(ethBalance));
    
    assets.push({
      symbol: 'ETH',
      address: null,
      balance: ethValue,
      value: ethValue * 3000, // Approximate ETH price
      price: 3000
    });
    totalValue += ethValue * 3000;

    // Get token balances
    for (const token of this.tokens) {
      try {
        const contract = new ethers.Contract(token.address, ERC20_ABI, this.provider);
        const balance = await contract.balanceOf(address);
        const decimals = await contract.decimals();
        const formattedBalance = parseFloat(ethers.formatUnits(balance, decimals));
        
        // Get approximate price (simplified - in production use price oracle)
        const price = this.getApproximatePrice(token.symbol);
        const value = formattedBalance * price;

        if (formattedBalance > 0) {
          assets.push({
            symbol: token.symbol,
            address: token.address,
            balance: formattedBalance,
            value: value,
            price: price
          });
          totalValue += value;
        }
      } catch (error) {
        logger.warn(`⚠️ Failed to get balance for ${token.symbol}:`, error.message);
      }
    }

    // Calculate allocation
    const allocation = {};
    for (const asset of assets) {
      allocation[asset.symbol] = totalValue > 0 ? (asset.value / totalValue) : 0;
    }

    // Get gas price
    const feeData = await this.provider.getFeeData();
    const gasPrice = feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : '20';

    const portfolio = {
      address,
      totalValue,
      assets,
      allocation,
      gasPrice: parseFloat(gasPrice).toFixed(2),
      timestamp: Date.now()
    };

    logger.info(`💰 Portfolio value: $${totalValue.toFixed(2)}`);
    return portfolio;
  }

  /**
   * Get approximate token prices (simplified)
   * In production, use Chainlink or other price oracle
   */
  getApproximatePrice(symbol) {
    const prices = {
      'ETH': 3000,
      'WETH': 3000,
      'USDC': 1,
      'USDbC': 1,
      'DAI': 1
    };
    return prices[symbol] || 0;
  }

  /**
   * Get historical performance (placeholder)
   */
  async getHistoricalPerformance(days = 7) {
    // In production, fetch from subgraph or indexer
    return {
      period: `${days}d`,
      change: 0,
      trades: 0
    };
  }
}

module.exports = PortfolioAnalyzer;
