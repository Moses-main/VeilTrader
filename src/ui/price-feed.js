/**
 * Live Price Feed Module
 * Fetches real-time prices from Uniswap V3 on Base Sepolia
 */

const { ethers } = require('ethers');
const logger = require('../utils/logger');

// Uniswap V3 Quoter ABI (for getting prices)
const QUOTER_ABI = [
  'function quoteExactInputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint160 sqrtPriceLimitX96) external returns (uint256 amountOut)'
];

// Uniswap V3 Pool ABI (for getting current price)
const POOL_ABI = [
  'function slot0() external view returns (uint160 sqrtPriceX96, uint24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
  'function token0() external view returns (address)',
  'function token1() external view returns (address)',
  'function fee() external view returns (uint24)'
];

// Token addresses on Base Sepolia
const TOKENS = {
  WETH: '0x4200000000000000000000000000000000000006',
  USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  USDbC: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
  DAI: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb'
};

// Uniswap V3 addresses on Base Sepolia
const UNISWAP = {
  QUOTER: '0x9398D2fD8fB206D03718c418A33F388C6028E885', // Quoter V2
  FACTORY: '0x420000000000000000000000000000000000001F',
  ROUTER: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD' // Universal Router
};

// Pool addresses (WETH/USDC 0.3% fee)
const POOLS = {
  'WETH-USDC-0.3%': '0xd0b5D4a041711d872711eE6d4F1C2d9115827111'
};

class PriceFeed {
  constructor() {
    this.provider = null;
    this.cache = new Map();
    this.cacheTimeout = 30000; // 30 seconds
  }

  async initialize() {
    try {
      const rpcUrl = process.env.RPC_URL || 'https://sepolia.base.org';
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      logger.info('✅ Price feed initialized');
    } catch (error) {
      logger.error('❌ Failed to initialize price feed:', error.message);
    }
  }

  async getPrice(tokenIn, tokenOut, amountIn = '1.0') {
    if (!this.provider) {
      return this.getFallbackPrice(tokenIn, tokenOut);
    }

    // Check cache first
    const cacheKey = `${tokenIn}-${tokenOut}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.price;
    }

    try {
      // Get token addresses
      const tokenInAddress = TOKENS[tokenIn];
      const tokenOutAddress = TOKENS[tokenOut];
      
      if (!tokenInAddress || !tokenOutAddress) {
        return this.getFallbackPrice(tokenIn, tokenOut);
      }

      // Try to get price from Uniswap Quoter
      const quoter = new ethers.Contract(UNISWAP.QUOTER, QUOTER_ABI, this.provider);
      
      const amountInWei = ethers.parseEther(amountIn);
      const sqrtPriceLimitX96 = 0;
      
      try {
        const amountOut = await quoter.quoteExactInputSingle(
          tokenInAddress,
          tokenOutAddress,
          3000, // 0.3% fee tier
          amountInWei,
          sqrtPriceLimitX96
        );
        
        const price = parseFloat(ethers.formatEther(amountOut)) / parseFloat(amountIn);
        
        // Cache the result
        this.cache.set(cacheKey, {
          price: price,
          timestamp: Date.now()
        });
        
        return price;
      } catch (quoteError) {
        // If quoter fails, try getting price from pool
        return await this.getPriceFromPool(tokenIn, tokenOut);
      }
    } catch (error) {
      logger.error('❌ Price fetch failed:', error.message);
      return this.getFallbackPrice(tokenIn, tokenOut);
    }
  }

  async getPriceFromPool(tokenIn, tokenOut) {
    try {
      const poolAddress = POOLS['WETH-USDC-0.3%'];
      if (!poolAddress) {
        return this.getFallbackPrice(tokenIn, tokenOut);
      }

      const pool = new ethers.Contract(poolAddress, POOL_ABI, this.provider);
      const slot0 = await pool.slot0();
      
      // Calculate price from sqrtPriceX96
      const sqrtPrice = parseFloat(ethers.formatUnits(slot0.sqrtPriceX96, 96));
      const price = sqrtPrice * sqrtPrice;
      
      return price;
    } catch (error) {
      return this.getFallbackPrice(tokenIn, tokenOut);
    }
  }

  getFallbackPrice(tokenIn, tokenOut) {
    // Mock prices for simulation
    const prices = {
      WETH: 3500,
      USDC: 1,
      USDbC: 1,
      DAI: 1
    };
    
    const priceIn = prices[tokenIn] || 1;
    const priceOut = prices[tokenOut] || 1;
    
    return priceIn / priceOut;
  }

  // Subscribe to price updates via WebSocket
  subscribe(callback, tokens, interval = 10000) {
    const prices = {};
    
    const fetchPrices = async () => {
      for (const tokenPair of tokens) {
        const [tokenIn, tokenOut] = tokenPair.split('-');
        prices[tokenPair] = await this.getPrice(tokenIn, tokenOut);
      }
      callback(prices);
    };
    
    // Initial fetch
    fetchPrices();
    
    // Set up interval
    const intervalId = setInterval(fetchPrices, interval);
    
    // Return unsubscribe function
    return () => clearInterval(intervalId);
  }
}

// Singleton instance
const priceFeed = new PriceFeed();

module.exports = priceFeed;
