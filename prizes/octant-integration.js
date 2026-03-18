/**
 * Octant Integration Prize Demo
 * Prize: Best Octant Use
 */

const octant = require('../src/integrations/OctantIntegration');

async function runDemo() {
  console.log('🎯 Octant Integration Demo\n');

  // Get current epoch
  console.log('📅 Current Epoch:');
  const epoch = await octant.getCurrentEpoch();
  console.log(`   Epoch: ${epoch.epoch}`);
  console.log(`   Status: ${epoch.status}`);
  console.log(`   Total Rewards: ${epoch.totalRewards.toLocaleString()} GLMR`);
  console.log(`   Remaining: ${epoch.remainingRewards.toLocaleString()} GLMR\n`);

  // Get grant opportunities
  console.log('🎁 Grant Opportunities:');
  const opportunities = await octant.getGrantOpportunities();
  opportunities.forEach((opp, i) => {
    console.log(`   ${i + 1}. ${opp.name}`);
    console.log(`      Amount: $${(opp.requestedAmount || 0).toLocaleString()}`);
    console.log(`      Deadline: ${new Date(opp.deadline).toLocaleDateString()}`);
    console.log(`      Match Funding: ${opp.matchFunding ? 'Yes' : 'No'}`);
  });
  console.log('');

  // Apply for grant
  console.log('📝 Apply for Grant:');
  const grant = await octant.applyForGrant({
    name: 'VeilTrader AI Agent Development',
    description: 'Privacy-first autonomous trading agent for Ethereum',
    requestedAmount: 100000,
    useOfFunds: [
      { category: 'Development', amount: 50000 },
      { category: 'Marketing', amount: 20000 },
      { category: 'Operations', amount: 30000 }
    ]
  });
  console.log(`   Application ID: ${grant.id}`);
  console.log(`   Project: ${grant.projectName}`);
  console.log(`   Requested: $${grant.requestedAmount.toLocaleString()}`);
  console.log(`   Status: ${grant.status}`);
  console.log('   Milestones:');
  grant.milestones.forEach(m => {
    console.log(`      ${m.completed ? '✓' : '○'} ${m.description}: $${m.amount.toLocaleString()}`);
  });
  console.log('');

  // Get agent funding
  console.log('💰 Agent Funding:');
  const funding = await octant.getAgentFunding();
  console.log(`   Total Received: $${funding.totalReceived.toLocaleString()}`);
  console.log(`   Total Pending: $${funding.totalPending.toLocaleString()}`);
  console.log(`   Active Proposals: ${funding.activeProposals}`);
  console.log(`   Completed Milestones: ${funding.completedMilestones}`);
  console.log(`   Upcoming Epoch Funding: $${funding.upcomingEpochFunding.toLocaleString()}`);
  console.log('   Sources:');
  funding.fundingSources.forEach(s => {
    console.log(`      ${s.source}: $${s.amount.toLocaleString()}`);
  });
  console.log('');

  // Get epoch rewards
  console.log('🏆 Epoch Rewards:');
  const rewards = await octant.getEpochRewards();
  console.log(`   Total Pool: ${rewards.totalPool.toLocaleString()} GLMR`);
  console.log(`   My Allocation: ${rewards.myAllocation.toLocaleString()} GLMR`);
  console.log(`   Claimable: ${rewards.claimable ? 'Yes' : 'No'}`);
  if (rewards.claimable) {
    console.log(`   Claimable Amount: ${rewards.claimableAmount.toLocaleString()} GLMR`);
  }
  console.log(`   Claim Deadline: ${new Date(rewards.deadline).toLocaleDateString()}\n`);

  // Get patronage history
  console.log('👥 Patronage History:');
  const patronage = await octant.getPatronageHistory('agent-123');
  console.log(`   Total Patronage: $${patronage.totalPatronage.toLocaleString()}`);
  console.log(`   Patron Count: ${patronage.patronCount}`);
  console.log(`   Average Patronage: $${patronage.averagePatronage.toLocaleString()}`);
  console.log('   Recent History:');
  patronage.patronageHistory.slice(0, 3).forEach(h => {
    console.log(`      Epoch ${h.epoch}: $${h.amount.toLocaleString()} (${h.patronCount} patrons)`);
  });
  console.log('');

  console.log('✅ Octant integration demo complete!');
}

runDemo().catch(console.error);
