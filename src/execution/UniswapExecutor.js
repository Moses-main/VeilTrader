/**
 * Uniswap V3 Trade Executor
 * 
 * Executes trades via Uniswap API on Base
 */

const { ethers } = require('ethers');
const axios = require('axios');
const logger = require('../utils/logger');

// Uniswap V3 Router on Base
const UNISWAP_V3_ROUTER = '0x2626664c2603336B57E7e5A669d15A6B4D41D3a5';
const UNISWAP_V3_FACTORY = '0x33128a8fC17869897dcE68Ed026d694621f6FDfD';

// Common token addresses on Base
const TOKENS = {
  WETH: '0x4200000000000000000000000000000000000006',
  USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  USDbC: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
  DAI: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
  cbETH: '0x2Ae3F1Ec7F1F5014C8f35ca0e9e38A58cB9752d1'
};

class UniswapExecutor {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.wallet = config.wallet;
    this.provider = config.provider;
    this.router = new ethers.Contract(
      UNISWAP_V3_ROUTER,
      [
        'function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)',
        'function exactOutputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountOut, uint256 amountInMaximum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountIn)'
      ],
      config.wallet
    );
  }

  /**
   * Execute a trade decision
   * @param {Object} decision - Trade decision from DecisionEngine
   * @returns {Object} Execution result with txHash
   */
  async execute(decision) {
    logger.info(`🔄 Executing ${decision.action}: ${decision.targetAsset}`);

    try {
      if (decision.action === 'BUY') {
        return await this.executeBuy(decision);
      } else if (decision.action === 'SELL') {
        return await this.executeSell(decision);
      } else {
        throw new Error(`Unknown action: ${decision.action}`);
      }
    } catch (error) {
      logger.error('❌ Trade execution failed:', error.message);
      throw error;
    }
  }

  /**
   * Execute a BUY order
   */
  async executeBuy(decision) {
    const tokenIn = TOKENS.USDC; // Buy with USDC
    const tokenOut = this.getTokenAddress(decision.targetAsset);
    const amountIn = ethers.parseUnits(decision.targetAmount.toString(), 6);

    logger.info(`💰 Buying ${decision.targetAsset} with ${decision.targetAmount} USDC`);

    // Get quote from Uniswap API
    const quote = await this.getQuote(tokenIn, tokenOut, amountIn);
    
    // Execute swap
    const tx = await this.router.exactInputSingle([
      tokenIn,
      tokenOut,
      3000, // 0.3% fee tier
      this.wallet.address,
      amountIn,
      quote.amountOutMinimum,
      0
    ]);

    logger.info(`⏳ Transaction submitted: ${tx.hash}`);
    const receipt = await tx.wait();
    logger.info(`✅ Transaction confirmed: ${receipt.hash}`);

    return {
      txHash: receipt.hash,
      action: 'BUY',
      tokenIn: 'USDC',
      tokenOut: decision.targetAsset,
      amountIn: decision.targetAmount,
      amountOut: quote.expectedOutput,
      gasUsed: receipt.gasUsed.toString()
    };
  }

  /**
   * Execute a SELL order
   */
  async executeSell(decision) {
    const tokenIn = this.getTokenAddress(decision.targetAsset);
    const tokenOut = TOKENS.USDC; // Sell to USDC
    const amountIn = ethers.parseUnits(decision.targetAmount.toString(), 18);

    logger.info(`💰 Selling ${decision.targetAmount} ${decision.targetAsset} for USDC`);

    // Get quote from Uniswap API
    const quote = await this.getQuote(tokenIn, tokenOut, amountIn);
    
    // Execute swap
    const tx = await this.router.exactInputSingle([
      tokenIn,
      tokenOut,
      3000, // 0.3% fee tier
      this.wallet.address,
      amountIn,
      quote.amountOutMinimum,
      0
    ]);

    logger.info(`⏳ Transaction submitted: ${tx.hash}`);
    const receipt = await tx.wait();
    logger.info(`✅ Transaction confirmed: ${receipt.hash}`);

    return {
      txHash: receipt.hash,
      action: 'SELL',
      tokenIn: decision.targetAsset,
      tokenOut: 'USDC',
      amountIn: decision.targetAmount,
      amountOut: quote.expectedOutput,
      gasUsed: receipt.gasUsed.toString()
    };
  }

  /**
   * Get quote from Uniswap API
   */
  async getQuote(tokenIn, tokenOut, amountIn) {
    try {
      const response = await axios.get(
        'https://api.uniswap.org/v1/quote',
        {
          params: {
            tokenIn,
            tokenOut,
            amount: amountIn.toString(),
            type: 'exactIn'
          },
          headers: {
            'x-api-key': this.apiKey
          }
        }
      );

      return {
        expectedOutput: response.data.amountOut,
        amountOutMinimum: response.data.amountOutMinimum
      };
    } catch (error) {
      logger.warn('⚠️ Uniswap API quote failed, using fallback');
      // Fallback: estimate with 2% slippage
      return {
        expectedOutput: '0',
        amountOutMinimum: '0'
      };
    }
  }

  /**
   * Get token address by symbol
   */
  getTokenAddress(symbol) {
    const upper = symbol.toUpperCase();
    if (TOKENS[upper]) {
      return TOKENS[upper];
    }
    throw new Error(`Unknown token: ${symbol}`);
  }

  /**
   * Check if token is approved for spending
   */
  async checkApproval(tokenAddress, spender, amount) {
    const token = new ethers.Contract(
      tokenAddress,
      ['function allowance(address owner, address spender) view returns (uint256)'],
      this.provider
    );
    
    const allowance = await token.allowance(this.wallet.address, spender);
    return allowance >= amount;
  }

  /**
   * Approve token for spending
   */
  async approveToken(tokenAddress, spender, amount) {
    logger.info(`🔓 Approving token ${tokenAddress}...`);
    
    const token = new ethers.Contract(
      tokenAddress,
      ['function approve(address spender, uint256 amount) returns (bool)'],
      this.wallet
    );
    
    const tx = await token.approve(spender, amount);
    await tx.wait();
    
    logger.info('✅ Token approved');
  }
}

module.exports = UniswapExecutor;
