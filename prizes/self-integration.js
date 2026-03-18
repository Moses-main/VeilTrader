/**
 * Self.xyz Integration Prize Demo
 * Prize: Best Self.xyz Integration
 */

const self = require('../src/integrations/SelfIntegration');

async function runDemo() {
  console.log('🎯 Self.xyz Integration Demo\n');

  // Create agent identity
  console.log('🆔 Create Agent Identity:');
  const identity = await self.createAgentIdentity({
    name: 'VeilTrader',
    capabilities: ['trading', 'analysis', 'risk-management'],
    verificationLevel: 'advanced'
  });
  console.log(`   ID: ${identity.id}`);
  console.log(`   DID: ${identity.did}`);
  console.log(`   Type: ${identity.claims.type}`);
  console.log(`   Capabilities: ${identity.claims.capabilities.join(', ')}\n`);

  // Get DID document
  console.log('📄 DID Document:');
  const doc = await self.getAgentDIDDocument(identity.did);
  console.log(`   ID: ${doc.id}`);
  console.log(`   Services: ${doc.service.map(s => s.type).join(', ')}\n`);

  // Get agent trust score
  console.log('⭐ Agent Trust Score:');
  const trust = await self.getAgentTrustScore(identity.id);
  console.log(`   Overall Score: ${trust.overallScore}/100`);
  console.log('   Components:');
  console.log(`      Identity: ${trust.components.identity}`);
  console.log(`      Reputation: ${trust.components.reputation}`);
  console.log(`      Performance: ${trust.components.performance}`);
  console.log(`      Compliance: ${trust.components.compliance}`);
  console.log('   Factors:');
  trust.factors.forEach(f => console.log(`      ✓ ${f}`));
  console.log('');

  // Create agent reputation
  console.log('🏆 Agent Reputation:');
  const reputation = await self.createAgentReputation();
  console.log(`   Total Transactions: ${reputation.totalTransactions}`);
  console.log(`   Success Rate: ${(reputation.successRate * 100).toFixed(1)}%`);
  console.log(`   Average Rating: ${reputation.averageRating}/5`);
  console.log(`   Trust Level: ${reputation.trustLevel}`);
  console.log(`   Badges: ${reputation.verifiedBadges.join(', ')}\n`);

  // Issue credential
  console.log('📜 Issue Credential:');
  const credential = await self.issueAgentCredential(
    identity.did,
    'TradingAuthorization',
    {
      canTrade: true,
      maxTradeSize: 10000,
      allowedPairs: ['ETH/USDC', 'WETH/USDC'],
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    }
  );
  console.log(`   Credential ID: ${credential.id}`);
  console.log(`   Type: ${credential.type}`);
  console.log(`   Issuer: ${credential.issuer}`);
  console.log(`   Status: ${credential.status}\n`);

  // Authenticate agent
  console.log('🔐 Authenticate Agent:');
  const auth = await self.authenticateAgent(identity.did, 'challenge-123');
  console.log(`   Authenticated: ${auth.authenticated ? 'Yes' : 'No'}`);
  console.log(`   Session ID: ${auth.sessionId}`);
  console.log(`   Permissions: ${auth.permissions.join(', ')}`);
  console.log(`   Expires: ${auth.expiresAt}\n`);

  console.log('✅ Self.xyz integration demo complete!');
}

runDemo().catch(console.error);
