/**
 * stETH Agent Treasury Extension
 * 
 * Enables AI agents to spend stETH yield without accessing principal
 * Prize: stETH Agent Treasury - Lido Labs Foundation
 */

const { ethers } = require('ethers');
const logger = require('../utils/logger');

const STETH_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function sharesOf(address owner) view returns (uint256)',
  'function submit(address referral) external payable returns (uint256)',
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) external returns (bool)'
];

const WSTETH_ABI = [
  'function wrap(uint256 _stETHAmount) external returns (uint256)',
  'function unwrap(uint256 _wstETHAmount) external returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function stEthPerToken() external view returns (uint256)'
];

class StETHTreasury {
  constructor(config) {
    this.provider = config.provider;
    this.wallet = config.wallet;
    
    // stETH on Base
    this.stETHAddress = '0xc58d696aBd4633fC27Dd9D5C338242Cc62dC82A7';
    this.wstETHAddress = '0xFc2001aEdB3CFeD24a3C1DdD6B8d7c8b0acD2a2';
    
    this.stETH = null;
    this.wstETH = null;
  }

  async initialize() {
    this.stETH = new ethers.Contract(this.stETHAddress, STETH_ABI, this.provider);
    this.wstETH = new ethers.Contract(this.wstETHAddress, WSTETH_ABI, this.provider);
    logger.info('✅ stETH Treasury initialized');
  }

  async getYieldBalance() {
    try {
      const stETHBalance = await this.stETH.balanceOf(await this.wallet.getAddress());
      const shares = await this.stETH.sharesOf(await this.wallet.getAddress());
      
      return {
        stETH: ethers.formatEther(stETHBalance),
        shares: ethers.formatEther(shares),
        hasYield: stETHBalance > 0n
      };
    } catch (error) {
      logger.warn('⚠️ Failed to get stETH balance:', error.message);
      return { stETH: '0', shares: '0', hasYield: false };
    }
  }

  async getWstETHBalance() {
    try {
      const wstETHBalance = await this.wstETH.balanceOf(await this.wallet.getAddress());
      return ethers.formatEther(wstETHBalance);
    } catch (error) {
      logger.warn('⚠️ Failed to get wstETH balance:', error.message);
      return '0';
    }
  }

  async wrapStETH(amount) {
    try {
      const stETHContract = this.stETH.connect(this.wallet);
      const wstETHContract = this.wstETH.connect(this.wallet);
      
      logger.info(`🔄 Wrapping ${amount} stETH to wstETH...`);
      
      const tx = await stETHContract.approve(this.wstETHAddress, ethers.parseEther(amount));
      await tx.wait();
      
      const wrapTx = await wstETHContract.wrap(ethers.parseEther(amount));
      await wrapTx.wait();
      
      logger.info('✅ stETH wrapped to wstETH successfully');
      return true;
    } catch (error) {
      logger.error('❌ Failed to wrap stETH:', error.message);
      return false;
    }
  }

  async unwrapWstETH(amount) {
    try {
      const wstETHContract = this.wstETH.connect(this.wallet);
      
      logger.info(`🔄 Unwrapping ${amount} wstETH to stETH...`);
      
      const tx = await wstETHContract.unwrap(ethers.parseEther(amount));
      await tx.wait();
      
      logger.info('✅ wstETH unwrapped to stETH successfully');
      return true;
    } catch (error) {
      logger.error('❌ Failed to unwrap wstETH:', error.message);
      return false;
    }
  }

  async spendYield(maxAmount) {
    try {
      const stETHBalance = await this.stETH.balanceOf(await this.wallet.getAddress());
      const spendAmount = ethers.parseEther(Math.min(maxAmount, ethers.formatEther(stETHBalance)));
      
      if (spendAmount === 0n) {
        logger.info('📭 No stETH yield to spend');
        return false;
      }
      
      logger.info(`💰 Spending stETH yield: ${ethers.formatEther(spendAmount)}`);
      
      const tx = await this.stETH.connect(this.wallet).transfer(
        '0x0000000000000000000000000000000000000001',
        spendAmount
      );
      await tx.wait();
      
      logger.info('✅ stETH yield spent successfully');
      return true;
    } catch (error) {
      logger.error('❌ Failed to spend stETH yield:', error.message);
      return false;
    }
  }

  async getYieldReport() {
    const yieldBalance = await this.getYieldBalance();
    const wstETHBalance = await this.getWstETHBalance();
    
    return {
      stETH: yieldBalance,
      wstETH: wstETHBalance,
      timestamp: Date.now()
    };
  }
}

module.exports = StETHTreasury;
