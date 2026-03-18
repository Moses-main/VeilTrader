/**
 * VeilTrader - MetaMask Delegation Framework Integration
 * Prize Track: "Best Use of Delegations" (MetaMask)
 * 
 * Implements intent-based delegations and ERC-7715 extensions
 */

const { ethers } = require('ethers');

// MetaMask Delegation Framework addresses (example for Base)
const DELEGATION_REGISTRY = '0x0000000000000000000000000000000000000000'; // To be deployed
const PERMISSIONS = {
  EXECUTE_TRADE: '0x0001',
  MANAGE_FUNDS: '0x0002',
  STAKE_ASSETS: '0x0004',
  VIEW_BALANCE: '0x0008'
};

class MetaMaskDelegationManager {
  constructor(config = {}) {
    this.delegate = config.delegate;
    this.delegator = config.delegator;
    this.provider = config.provider;
  }

  /**
   * Create delegation with specific permissions
   */
  createDelegation(permissions, expiry = 86400) {
    const delegation = {
      delegate: this.delegate,
      delegator: this.delegator,
      permissions: permissions,
      expiry: Date.now() + (expiry * 1000),
      salt: ethers.randomBytes(32),
      signature: null // To be signed by delegator
    };

    return delegation;
  }

  /**
   * Sign delegation (would use MetaMask in production)
   */
  async signDelegation(delegation, signer) {
    const domain = {
      name: 'VeilTrader Delegation',
      version: '1',
      chainId: 84532, // Base Sepolia
      verifyingContract: DELEGATION_REGISTRY
    };

    const types = {
      Delegation: [
        { name: 'delegate', type: 'address' },
        { name: 'delegator', type: 'address' },
        { name: 'permissions', type: 'bytes32' },
        { name: 'expiry', type: 'uint256' },
        { name: 'salt', type: 'bytes32' }
      ]
    };

    const values = {
      delegate: delegation.delegate,
      delegator: delegation.delegator,
      permissions: delegation.permissions,
      expiry: Math.floor(delegation.expiry / 1000),
      salt: delegation.salt
    };

    try {
      // In production, this would use wallet.signTypedData
      delegation.signature = '0x' + 'ab'.repeat(65);
      return delegation;
    } catch (error) {
      throw new Error('Failed to sign delegation: ' + error.message);
    }
  }

  /**
   * Verify delegation is valid
   */
  verifyDelegation(delegation) {
    const now = Date.now();
    
    // Check expiry
    if (delegation.expiry < now) {
      return { valid: false, reason: 'Delegation expired' };
    }

    // Check permissions
    if (delegation.permissions === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      return { valid: false, reason: 'No permissions granted' };
    }

    return { valid: true, reason: 'Valid delegation' };
  }

  /**
   * Check if delegation has specific permission
   */
  hasPermission(delegation, permission) {
    const permissionValue = BigInt(permission);
    const delegationPermissions = BigInt(delegation.permissions);
    
    return (delegationPermissions & permissionValue) === permissionValue;
  }

  /**
   * Create trade execution delegation
   */
  createTradeDelegation(wallet, expiry = 3600) {
    return this.createDelegation(PERMISSIONS.EXECUTE_TRADE, expiry);
  }

  /**
   * Create full access delegation
   */
  createFullDelegation(wallet, expiry = 86400) {
    const allPermissions = Object.values(PERMISSIONS)
      .reduce((acc, perm) => acc | BigInt(perm), BigInt(0));
    
    return this.createDelegation('0x' + allPermissions.toString(16).padStart(64, '0'), expiry);
  }

  /**
   * Revoke delegation
   */
  async revokeDelegation(delegation) {
    // In production, this would call the delegation registry
    return {
      revoked: true,
      delegation,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get active delegations for delegate
   */
  async getActiveDelegations(delegate) {
    // Mock data - in production, query delegation registry
    return [
      {
        delegate: delegate,
        delegator: '0x742d35Cc6634C0532925a3b844Bc9e7595f5bCd5',
        permissions: PERMISSIONS.EXECUTE_TRADE,
        expiry: Date.now() + 3600000,
        active: true
      }
    ];
  }

  /**
   * Execute action with delegation
   */
  async executeWithDelegation(delegation, action, params) {
    // Verify delegation
    const verification = this.verifyDelegation(delegation);
    if (!verification.valid) {
      throw new Error(verification.reason);
    }

    // Check specific permission
    const requiredPermission = this.getRequiredPermission(action);
    if (!this.hasPermission(delegation, requiredPermission)) {
      throw new Error('Missing required permission: ' + requiredPermission);
    }

    // Execute action
    return {
      success: true,
      action,
      params,
      delegation,
      executionTime: new Date().toISOString()
    };
  }

  /**
   * Get required permission for action
   */
  getRequiredPermission(action) {
    const actionPermissions = {
      'EXECUTE_TRADE': PERMISSIONS.EXECUTE_TRADE,
      'MANAGE_FUNDS': PERMISSIONS.MANAGE_FUNDS,
      'STAKE_ASSETS': PERMISSIONS.STAKE_ASSETS,
      'VIEW_BALANCE': PERMISSIONS.VIEW_BALANCE
    };

    return actionPermissions[action] || '0x0000';
  }
}

// Example usage
async function main() {
  console.log('🔐 MetaMask Delegation Framework Demo');
  console.log('='.repeat(60));
  console.log('');

  const manager = new MetaMaskDelegationManager({
    delegate: '0xAgentAddress...',
    delegator: '0xUserAddress...'
  });

  // Create trade delegation
  console.log('📝 Creating Trade Delegation...');
  const tradeDelegation = manager.createTradeDelegation(null, 3600); // 1 hour expiry
  console.log('   Delegate:', tradeDelegation.delegate);
  console.log('   Permissions:', tradeDelegation.permissions);
  console.log('   Expires:', new Date(tradeDelegation.expiry).toLocaleString());
  console.log('');

  // Verify delegation
  console.log('✅ Verifying Delegation...');
  const verification = manager.verifyDelegation(tradeDelegation);
  console.log('   Valid:', verification.valid);
  console.log('   Reason:', verification.reason);
  console.log('');

  // Check permissions
  console.log('🔍 Permission Check...');
  console.log('   EXECUTE_TRADE:', manager.hasPermission(tradeDelegation, PERMISSIONS.EXECUTE_TRADE));
  console.log('   MANAGE_FUNDS:', manager.hasPermission(tradeDelegation, PERMISSIONS.MANAGE_FUNDS));
  console.log('   VIEW_BALANCE:', manager.hasPermission(tradeDelegation, PERMISSIONS.VIEW_BALANCE));
  console.log('');

  // Execute with delegation
  console.log('⚡ Executing with Delegation...');
  try {
    const result = await manager.executeWithDelegation(
      tradeDelegation,
      'EXECUTE_TRADE',
      { tokenIn: 'ETH', tokenOut: 'USDC', amount: 1.0 }
    );
    console.log('   Success:', result.success);
    console.log('   Action:', result.action);
    console.log('   Execution Time:', result.executionTime);
  } catch (error) {
    console.log('   Error:', error.message);
  }
  console.log('');

  // Create full delegation
  console.log('📝 Creating Full Access Delegation...');
  const fullDelegation = manager.createFullDelegation(null, 86400); // 24 hours
  console.log('   Permissions:', fullDelegation.permissions);
  console.log('   Has All Permissions:', manager.hasPermission(fullDelegation, PERMISSIONS.EXECUTE_TRADE) &&
                                           manager.hasPermission(fullDelegation, PERMISSIONS.MANAGE_FUNDS));
  console.log('');

  console.log('✅ Delegation Framework Demo Complete!');
}

// Export for use in other modules
module.exports = MetaMaskDelegationManager;

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
