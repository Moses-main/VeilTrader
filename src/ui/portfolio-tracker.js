/**
 * Portfolio Tracker Module
 * Fetches portfolio data from the blockchain
 */

const { ethers } = require('ethers');
const logger = require('../utils/logger');

// Token addresses on Base Sepolia
const TOKEN_ADDRESSES = {
  ETH: null, // Native ETH
  WETH: '0x4200000000000000000000000000000000000006',
  USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  USDbC: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
  DAI: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb'
};

// ERC20 ABI
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)'
];

// Price feed addresses (Chainlink on Base Sepolia)
const PRICE_FEEDS = {
  ETH_USD: '0x71041ddAD648e26dE8dDd4a9B8F493C564530F1e',
  WETH_USD: '0x71041ddAD648e26dE8dDd4a9B8F493C564530F1e',
  USDC_USD: '0x7e86c0F82cD548c9846C47E2734D7C62C2a5E7F6'
};

// Chainlink ABI for price feeds
const CHAINLINK_ABI = [
  'function latestAnswer() view returns (int256)',
  'function latestRoundData() view returns (uint80, int256, uint256, uint256, uint80)'
];

class PortfolioTracker {
  constructor() {
    this.provider = null;
    this.wallet = null;
  }

  async initialize() {
    try {
      const rpcUrl = process.env.RPC_URL || 'https://sepolia.base.org';
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      
      if (process.env.PRIVATE_KEY) {
        this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
        logger.info('✅ Portfolio tracker initialized');
      }
    } catch (error) {
      logger.error('❌ Failed to initialize portfolio tracker:', error.message);
    }
  }

  async getPortfolio(userAddress) {
    if (!this.provider) {
      return { totalValue: 0, assets: [] };
    }

    const address = userAddress || (this.wallet ? await this.wallet.getAddress() : null);
    if (!address) {
      return { totalValue: 0, assets: [] };
    }

    const assets = [];
    let totalValue = 0;

    try {
      // Get ETH balance
      const ethBalance = await this.provider.getBalance(address);
      const ethValue = parseFloat(ethers.formatEther(ethBalance));
      
      if (ethValue > 0) {
        const ethPrice = await this.getPrice('ETH');
        assets.push({
          symbol: 'ETH',
          balance: ethValue,
          value: ethValue * ethPrice,
          price: ethPrice
        });
        totalValue += ethValue * ethPrice;
      }

      // Get token balances
      for (const [symbol, address] of Object.entries(TOKEN_ADDRESSES)) {
        if (!address || symbol === 'ETH') continue;

        try {
          const tokenContract = new ethers.Contract(address, ERC20_ABI, this.provider);
          const balance = await tokenContract.balanceOf(address);
          const decimals = await tokenContract.decimals();
          const balanceFormatted = parseFloat(ethers.formatUnits(balance, decimals));
          
          if (balanceFormatted > 0) {
            const price = await getPrice(symbol);
            const value = balanceFormatted * price;
            
            assets.push({
              symbol,
              balance: balanceFormatted,
              value,
              price
            });
            totalValue += value;
          }
        } catch (error) {
          // Token might not exist or have balance
        }
      }

      return {
        totalValue,
        assets: assets.sort((a, b) => b.value - a.value)
      };
    } catch (error) {
      logger.error('❌ Failed to get portfolio:', error.message);
      return { totalValue: 0, assets: [] };
    }
  }

  async getPrice(symbol) {
    // Try to get price from Chainlink price feeds
    try {
      if (PRICE_FEEDS[`${symbol}_USD`]) {
        const priceFeed = new ethers.Contract(
          PRICE_FEEDS[`${symbol}_USD`],
          CHAINLINK_ABI,
          this.provider
        );
        const priceData = await priceFeed.latestRoundData();
        const price = parseFloat(ethers.formatUnits(priceData.answer, 8));
        return price;
      }
    } catch (error) {
      // Fall back to mock prices
    }

    // Mock prices for simulation
    const prices = {
      ETH: 3500,
      WETH: 3500,
      USDC: 1,
      USDbC: 1,
      DAI: 1
    };
    
    return prices[symbol] || 1;
  }
}

// Singleton instance
const portfolioTracker = new PortfolioTracker();

module.exports = portfolioTracker;
