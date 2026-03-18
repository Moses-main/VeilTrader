/**
 * Lit Protocol Prize Demo
 * Prize: Best Lit Protocol Integration
 */

const lit = require('../src/integrations/LitProtocolIntegration');

async function runDemo() {
  console.log('🎯 Lit Protocol Integration Demo\n');

  // Get agent capabilities
  console.log('🔐 Agent Capabilities:');
  const caps = await lit.getAgentCapabilities();
  console.log(`   Encrypted Secrets: ${caps.encryptedSecrets ? '✅' : '❌'}`);
  console.log(`   Programmable Signing: ${caps.programmableSigning ? '✅' : '❌'}`);
  console.log(`   Cross-Chain Access: ${caps.crossChainAccess ? '✅' : '❌'}`);
  console.log(`   Conditional Access: ${caps.conditionalAccess ? '✅' : '❌'}`);
  console.log(`   Max Secrets: ${caps.maxSecrets}\n`);

  // Store agent secret
  console.log('🔒 Store Agent Secret:');
  const secret = await lit.storeAgentSecret(
    'api-key',
    'sk-abc123xyz789',
    ['0x742d35Cc6634C0532925a3b844Bc9e7595f5bCd5']
  );
  console.log(`   Secret ID: ${secret.id}`);
  console.log(`   Encrypted: ${secret.encryptedBy}`);
  console.log(`   Created: ${secret.createdAt}\n`);

  // Create trading key
  console.log('🔑 Create Trading Key:');
  const tradingKey = await lit.createTradingKey('main-trading', {
    canTrade: true,
    maxTradeSize: 5000,
    allowedTokens: ['ETH', 'USDC', 'WETH'],
    canWithdraw: false,
    canDelegate: true
  });
  console.log(`   Key ID: ${tradingKey.id}`);
  console.log(`   Permissions:`, tradingKey.permissions);

  // Create access grant
  console.log('\n📜 Create Access Grant:');
  const grant = await lit.createAccessGrant(
    '0x742d35Cc6634C0532925a3b844Bc9e7595f5bCd5',
    'trade-execution',
    ['read', 'execute']
  );
  console.log(`   Grant ID: ${grant.id}`);
  console.log(`   Grantee: ${grant.grantee}`);
  console.log(`   Permissions: ${grant.permissions.join(', ')}`);
  console.log(`   Expires: ${new Date(grant.expiresAt).toLocaleDateString()}\n`);

  // Verify agent identity
  console.log('✅ Verify Agent Identity:');
  const verified = await lit.verifyAgentIdentity('0x742d35Cc6634C0532925a3b844Bc9e7595f5bCd5');
  console.log(`   Is Human: ${verified.isHuman ? 'Yes' : 'No'}`);
  console.log(`   Is Verified: ${verified.isVerified ? 'Yes' : 'No'}`);
  console.log(`   Verification Level: ${verified.verificationLevel}\n`);

  console.log('✅ Lit Protocol integration demo complete!');
}

runDemo().catch(console.error);
