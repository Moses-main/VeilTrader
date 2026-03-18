/**
 * VeilTrader - Uniswap V3 Integration
 * Prize Track: "Best Agentic Finance Integration" (Uniswap)
 * 
 * Uses real Uniswap Developer Platform API for swap quotes
 */

const { ethers } = require('ethers');

// Uniswap Developer Platform API
const UNISWAP_API_BASE = 'https://api.uniswap.org/v2';
const UNISWAP_QUOTER_API = 'https://api.uniswap.org/v3/quote';

// Token Addresses on Base Sepolia
const TOKENS = {
  WETH: '0x4200000000000000000000000000000000000006',
  USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  ETH: '0x0000000000000000000000000000000000000000'
};

// Fee Tiers
const FEE_TIERS = {
  LOW: 500,    // 0.05%
  MEDIUM: 3000, // 0.30%
  HIGH: 10000   // 1.00%
};

class UniswapIntegration {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * Get swap quote using Uniswap Developer Platform API
   */
  async getQuote(tokenIn, tokenOut, amountIn, feeTier = FEE_TIERS.MEDIUM) {
    const tokenInAddress = TOKENS[tokenIn] || tokenIn;
    const tokenOutAddress = TOKENS[tokenOut] || tokenOut;
    
    const params = new URLSearchParams({
      tokenInAddress: tokenInAddress,
      tokenInChainId: '84532', // Base Sepolia
      tokenOutAddress: tokenOutAddress,
      tokenOutChainId: '84532',
      amount: amountIn.toString(),
      type: 'EXACT_INPUT',
      slippageTolerance: '0.5',
      fee: feeTier.toString()
    });

    try {
      const response = await fetch(`${UNISWAP_QUOTER_API}?${params}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Uniswap API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        amountOut: ethers.formatEther(data.quote.amount),
        priceImpact: data.quote.priceImpact,
        gasEstimate: data.quote.gasEstimate,
        route: data.quote.route
      };
    } catch (error) {
      console.error('Failed to get quote:', error.message);
      return null;
    }
  }

  /**
   * Execute swap via Universal Router
   */
  async executeSwap(wallet, tokenIn, tokenOut, amountIn, amountOutMin) {
    const UNISWAP_ROUTER = '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD';
    
    // Router ABI (simplified)
    const routerABI = [
      'function execute(bytes calldata commands, uint256[] calldata values, bytes[] calldata inputs) external payable'
    ];

    const router = new ethers.Contract(UNISWAP_ROUTER, routerABI, wallet);

    // Build swap commands
    const commands = '0x00'; // V3_SWAP_EXACT_IN
    const values = [0];
    
    // Encode swap parameters
    const path = ethers.solidityPacked(
      ['address', 'uint24', 'address'],
      [TOKENS[tokenIn], FEE_TIERS.MEDIUM, TOKENS[tokenOut]]
    );

    const inputs = [ethers.AbiCoder.defaultAbiCoder().encode(
      ['address', 'address', 'uint24', 'address', 'address', 'uint256', 'uint256'],
      [wallet.address, wallet.address, FEE_TIERS.MEDIUM, TOKENS[tokenIn], TOKENS[tokenOut], amountIn, amountOutMin]
    )];

    try {
      const tx = await router.execute(commands, values, inputs);
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get pool price for display
   */
  async getPoolPrice(tokenIn, tokenOut) {
    const quote = await this.getQuote(tokenIn, tokenOut, ethers.parseEther('1'));
    if (quote) {
      return parseFloat(quote.amountOut).toFixed(2);
    }
    return null;
  }
}

// Example usage
async function main() {
  const apiKey = process.env.UNISWAP_API_KEY;
  
  if (!apiKey) {
    console.log('⚠️  No Uniswap API key - running in demo mode');
    console.log('   Get your API key at: https://docs.uniswap.org/concepts/introduction');
    console.log('');
    
    // Demo mode - show what would happen
    console.log('📊 Demo: ETH → USDC Quote');
    console.log('   Input: 1 ETH');
    console.log('   Expected Output: ~3,500 USDC');
    console.log('   Price Impact: 0.05%');
    console.log('   Gas Estimate: 150,000');
    console.log('');
    return;
  }

  const uniswap = new UniswapIntegration(apiKey);
  
  // Get quote
  console.log('📊 Getting quote for ETH → USDC...');
  const quote = await uniswap.getQuote('ETH', 'USDC', ethers.parseEther('1'));
  
  if (quote) {
    console.log('✅ Quote received:');
    console.log('   Output:', quote.amountOut, 'USDC');
    console.log('   Price Impact:', quote.priceImpact);
    console.log('   Gas:', quote.gasEstimate);
  }
}

// Export for use in other modules
module.exports = UniswapIntegration;

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
