/**
 * Trade Executor Module
 * Connects UI server to the VeilTrader smart contract
 */

const { ethers } = require('ethers');
const logger = require('../utils/logger');

// Token addresses on Base Sepolia
const TOKEN_ADDRESSES = {
  ETH: '0x0000000000000000000000000000000000000000',
  WETH: '0x4200000000000000000000000000000000000006',
  USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
};

// VeilTrader contract ABI
const VEILTRADER_ABI = [
  'function executeTrade(string memory _actionType, address _tokenIn, address _tokenOut, uint256 _amountIn, uint256 _amountOut, string memory _metadata) external returns (bytes32 actionHash)',
  'function getTradeCount() external view returns (uint256)',
  'function owner() external view returns (address)',
  'function getTradeCount() external view returns (uint256)',
  'function getAllTrades() external view returns (tuple(bytes32 actionHash, string actionType, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut, uint256 timestamp, string metadata, uint256 reputationFeedbackGiven, bytes32 proofHash)[])'
];

class TradeExecutor {
  constructor() {
    this.provider = null;
    this.wallet = null;
    this.contract = null;
    this.contractAddress = process.env.VEILTRADER_CONTRACT;
    this.uniswapApiKey = process.env.UNISWAP_API_KEY;
    this.walletAddress = null;
    this.contractOwner = null;
    this.isOwner = false;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      // Use RPC URL from environment or default to Base Sepolia
      const rpcUrl = process.env.RPC_URL || 'https://sepolia.base.org';
      
      // Create provider
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      this.provider.pollingInterval = 5000;
      
      // Test RPC connection with fallback
      try {
        const blockNumber = await this.provider.getBlockNumber();
        console.log(`✅ RPC connected: block ${blockNumber}`);
      } catch (rpcError) {
        console.log('⚠️ Primary RPC failed, trying fallback...');
        this.provider = new ethers.JsonRpcProvider('https://sepolia.base.org');
        try {
          const blockNumber = await this.provider.getBlockNumber();
          console.log(`✅ Fallback RPC connected: block ${blockNumber}`);
        } catch (fallbackError) {
          console.error('❌ All RPC connections failed');
        }
      }
      
      // If private key is available, create a wallet
      if (process.env.PRIVATE_KEY) {
        this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
        this.walletAddress = await this.wallet.getAddress();
        console.log(`✅ Wallet initialized: ${this.walletAddress}`);
      } else {
        console.warn('⚠️ No private key configured - using read-only mode');
      }

      // Initialize contract if address is available
      if (this.contractAddress) {
        try {
          this.contract = new ethers.Contract(
            this.contractAddress,
            VEILTRADER_ABI,
            this.provider
          );
          
          // Check contract owner
          try {
            this.contractOwner = await this.contract.owner();
            console.log(`📋 Contract owner: ${this.contractOwner}`);
            
            if (this.walletAddress) {
              this.isOwner = this.walletAddress.toLowerCase() === this.contractOwner.toLowerCase();
              console.log(`🔑 Is wallet the owner: ${this.isOwner}`);
            }
          } catch (ownerError) {
            console.log('📋 Could not read contract owner (may not have owner function)');
          }
          
          // If we have a wallet that is the owner, connect it for writes
          if (this.isOwner && this.wallet) {
            this.contract = this.contract.connect(this.wallet);
            console.log('✅ Connected to contract with owner wallet');
          } else if (this.wallet) {
            console.log('⚠️ Wallet is not contract owner - using read-only mode');
          }
        } catch (contractError) {
          console.error('❌ Failed to connect to contract:', contractError.message);
        }
      } else {
        console.warn('⚠️ Contract address not available');
      }

      // Log Uniswap API key status
      if (this.uniswapApiKey) {
        console.log('✅ Uniswap API key configured');
      } else {
        console.log('⚠️ No Uniswap API key - using simulation mode');
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Failed to initialize trade executor:', error.message);
    }
  }

  async executeTrade(tradeData) {
    const { action, tokenIn, tokenOut, amountIn, userAddress } = tradeData;

    // Validate inputs
    if (!action || !tokenIn || !tokenOut || !amountIn) {
      return {
        success: false,
        error: 'Missing required trade parameters'
      };
    }

    // Get real quote from Uniswap first
    const quote = await this.getUniswapQuote(tokenIn, tokenOut, amountIn);
    console.log(`💱 Quote: ${quote.amountOut} ${tokenOut} (${quote.source})`);

    // Get token addresses
    const tokenInAddress = TOKEN_ADDRESSES[tokenIn] || tokenIn;
    const tokenOutAddress = TOKEN_ADDRESSES[tokenOut] || tokenOut;

    // Convert amount to appropriate units
    let amountInWei;
    if (tokenIn === 'ETH' || tokenIn === 'WETH') {
      amountInWei = ethers.parseEther(amountIn.toString());
    } else if (tokenIn === 'USDC') {
      amountInWei = ethers.parseUnits(amountIn.toString(), 6);
    } else {
      amountInWei = ethers.parseUnits(amountIn.toString(), 18);
    }

    // Calculate expected output from quote (apply 0.5% slippage)
    let amountOutWei;
    if (tokenOut === 'ETH' || tokenOut === 'WETH') {
      amountOutWei = ethers.parseEther((quote.amountOut * 0.995).toString());
    } else if (tokenOut === 'USDC') {
      amountOutWei = ethers.parseUnits((quote.amountOut * 0.995).toString(), 6);
    } else {
      amountOutWei = ethers.parseUnits((quote.amountOut * 0.995).toString(), 18);
    }

    // Check if we can execute on-chain
    if (this.isOwner && this.contract && this.wallet) {
      try {
        console.log(`⛓️ Executing trade on-chain: ${action} ${amountIn} ${tokenIn} -> ${tokenOut}`);
        
        // Estimate gas first
        try {
          const gasEstimate = await this.contract.executeTrade.estimateGas(
            action.toUpperCase(),
            tokenInAddress,
            tokenOutAddress,
            amountInWei,
            amountOutWei,
            JSON.stringify({ user: userAddress, timestamp: Date.now(), quote: quote.source })
          );
          console.log(`⛽ Estimated gas: ${gasEstimate.toString()}`);
        } catch (estimateError) {
          console.log(`⚠️ Gas estimation failed: ${estimateError.reason || estimateError.message}`);
        }
        
        const tx = await this.contract.executeTrade(
          action.toUpperCase(),
          tokenInAddress,
          tokenOutAddress,
          amountInWei,
          amountOutWei,
          JSON.stringify({ user: userAddress, timestamp: Date.now(), quote: quote.source }),
          { gasLimit: 500000 }
        );

        console.log(`📤 Transaction sent: ${tx.hash}`);
        const receipt = await tx.wait();
        console.log(`✅ Trade executed: ${receipt.hash}`);

        return {
          success: true,
          tradeId: receipt.hash,
          txHash: receipt.hash,
          blockNumber: receipt.blockNumber,
          message: 'Trade executed successfully on-chain',
          quote: quote
        };
      } catch (error) {
        console.error('❌ Trade execution failed:', error.message);
        
        // Check for specific error types
        let errorMessage = error.message;
        if (error.code === 'TIMEOUT') {
          errorMessage = 'Transaction timeout - network may be congested';
        } else if (error.code === 'NETWORK_ERROR') {
          errorMessage = 'Network error - check RPC connection';
        } else if (error.reason) {
          errorMessage = error.reason;
        } else if (error.data) {
          errorMessage = `Contract error: ${error.data.message || error.data}`;
        }
        
        return {
          success: false,
          error: errorMessage,
          code: error.code
        };
      }
    } else {
      // Simulation mode - wallet is not the owner
      console.log(`🎮 Simulation mode: ${action} ${amountIn} ${tokenIn} -> ${tokenOut}`);
      console.log(`   Wallet: ${this.walletAddress || 'not configured'}`);
      console.log(`   Owner: ${this.contractOwner || 'unknown'}`);
      
      const tradeId = `sim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        success: true,
        tradeId: tradeId,
        message: `Trade submitted (simulation mode - wallet is not contract owner)`,
        quote: quote,
        simulation: true,
        walletAddress: this.walletAddress,
        contractOwner: this.contractOwner
      };
    }
  }

  async getTradeCount() {
    if (!this.contract) return 0;
    try {
      const count = await this.contract.getTradeCount();
      return Number(count);
    } catch (error) {
      logger.error('❌ Failed to get trade count:', error.message);
      return 0;
    }
  }

  /**
   * Get real quote from Uniswap API
   */
  async getUniswapQuote(tokenIn, tokenOut, amountIn) {
    if (!this.uniswapApiKey) {
      // Return mock quote if no API key
      return {
        amountOut: amountIn * 3500, // Mock ETH/USDC price
        priceImpact: 0.05,
        gasEstimate: 150000,
        source: 'mock'
      };
    }

    try {
      const tokenInAddress = TOKEN_ADDRESSES[tokenIn] || tokenIn;
      const tokenOutAddress = TOKEN_ADDRESSES[tokenOut] || tokenOut;
      
      // Convert amount to wei
      let amountInWei;
      if (tokenIn === 'ETH' || tokenIn === 'WETH') {
        amountInWei = ethers.parseEther(amountIn.toString());
      } else if (tokenIn === 'USDC') {
        amountInWei = ethers.parseUnits(amountIn.toString(), 6);
      } else {
        amountInWei = ethers.parseUnits(amountIn.toString(), 18);
      }

      // Call Uniswap API
      const params = new URLSearchParams({
        tokenInAddress: tokenInAddress,
        tokenInChainId: '84532',
        tokenOutAddress: tokenOutAddress,
        tokenOutChainId: '84532',
        amount: amountInWei.toString(),
        type: 'EXACT_INPUT',
        slippageTolerance: '0.5',
        fee: '3000'
      });

      const response = await fetch(`https://api.uniswap.org/v3/quote?${params}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.uniswapApiKey}`
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
        source: 'uniswap_api'
      };
    } catch (error) {
      logger.error('❌ Failed to get Uniswap quote:', error.message);
      // Fallback to mock quote
      return {
        amountOut: amountIn * 3500,
        priceImpact: 0.05,
        gasEstimate: 150000,
        source: 'fallback'
      };
    }
  }
}

// Singleton instance
const tradeExecutor = new TradeExecutor();

module.exports = tradeExecutor;
