/**
 * ENS Integration
 * 
 * ENS identity and communication for agents
 * Prize: ENS Identity / ENS Communication - ENS
 */

const { ethers } = require('ethers');
const logger = require('../utils/logger');

const ENS_ABI = [
  'function resolver(bytes32 node) external view returns (address)',
  'function setAddr(bytes32 node, address addr) external',
  'function addr(bytes32 node) external view returns (address)',
  'function setText(bytes32 node, string calldata key, string calldata value) external',
  'function text(bytes32 node, string calldata key) external view returns (string memory)',
  'function name(bytes32 node) external view returns (string memory)'
];

const REGISTRAR_ABI = [
  'function ownerOf(uint256 tokenId) external view returns (address)',
  'function available(uint256 tokenId) external view returns (bool)'
];

class ENSIntegration {
  constructor(config) {
    this.provider = config.provider;
    this.wallet = config.wallet;
    
    // ENS Registry on Base (if deployed)
    this.ensRegistry = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
    
    // Base names registrar
    this.baseRegistrar = '0x4eCb287B7A2C4f20f0AaCa27b1C5eB0c0b12d1f';
    
    this.registry = null;
    this.registrar = null;
  }

  async initialize() {
    this.registry = new ethers.Contract(this.ENSRegistry || this.ensRegistry, ENS_ABI, this.provider);
    this.registrar = new ethers.Contract(this.baseRegistrar, REGISTRAR_ABI, this.provider);
    logger.info('✅ ENS integration initialized');
  }

  async getENSName(address) {
    try {
      const reverseRegistrar = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
      const reverseABI = ['function node(address addr) external pure returns (bytes32)'];
      const reverse = new ethers.Contract(reverseRegistrar, reverseABI, this.provider);
      
      const node = await reverse.node(address);
      const name = await this.registry.name(node);
      
      return name || null;
    } catch (error) {
      logger.warn('⚠️ Failed to get ENS name:', error.message);
      return null;
    }
  }

  async setENSName(name) {
    try {
      logger.info(`📝 Setting ENS name: ${name}...`);
      
      const reverseRegistrar = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
      const reverseSetABI = ['function setName(string calldata name) external returns (bytes32)'];
      const reverseSet = new ethers.Contract(reverseRegistrar, reverseSetABI, this.wallet);
      
      const tx = await reverseSet.setName(name);
      await tx.wait();
      
      logger.info(`✅ ENS name set: ${name}`);
      return { success: true, name: name };
    } catch (error) {
      logger.warn('⚠️ Failed to set ENS name:', error.message);
      return { success: false, error: error.message };
    }
  }

  async getAgentProfile(node) {
    try {
      const profile = {
        name: await this.registry.text(node, 'name'),
        description: await this.registry.text(node, 'description'),
        url: await this.registry.text(node, 'url'),
        avatar: await this.registry.text(node, 'avatar'),
        email: await this.registry.text(node, 'email'),
        location: await this.registry.text(node, 'location'),
        twitter: await this.registry.text(node, 'com.twitter'),
        github: await this.registry.text(node, 'com.github')
      };
      
      return profile;
    } catch (error) {
      logger.warn('⚠️ Failed to get ENS profile:', error.message);
      return null;
    }
  }

  async setAgentProfile(node, profile) {
    try {
      logger.info('📝 Setting ENS agent profile...');
      
      const tx = await this.registry.connect(this.wallet).setText(node, 'name', profile.name || 'VeilTrader');
      await tx.wait();
      
      if (profile.description) {
        await this.registry.connect(this.wallet).setText(node, 'description', profile.description);
      }
      
      if (profile.url) {
        await this.registry.connect(this.wallet).setText(node, 'url', profile.url);
      }
      
      if (profile.avatar) {
        await this.registry.connect(this.wallet).setText(node, 'avatar', profile.avatar);
      }
      
      logger.info('✅ ENS profile updated');
      return { success: true };
    } catch (error) {
      logger.warn('⚠️ Failed to set ENS profile:', error.message);
      return { success: false, error: error.message };
    }
  }

  async resolveAddress(name) {
    try {
      const resolver = await this.provider.getResolver(name);
      if (resolver) {
        const address = await resolver.getAddress();
        return address;
      }
      return null;
    } catch (error) {
      logger.warn('⚠️ Failed to resolve address:', error.message);
      return null;
    }
  }

  async checkDomainAvailability(name) {
    try {
      const nameHash = ethers.namehash(name);
      const available = await this.registrar.available(ethers.toBigInt(nameHash));
      return !available;
    } catch (error) {
      logger.warn('⚠️ Failed to check availability:', error.message);
      return null;
    }
  }
}

module.exports = ENSIntegration;
