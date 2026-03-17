/**
 * Deploy VeilTrader Contract
 */

const { ethers } = require('hardhat');

async function main() {
  const agentId = process.env.AGENT_ID;
  
  if (!agentId) {
    throw new Error('AGENT_ID not set in environment');
  }

  console.log('🚀 Deploying VeilTrader contract...');
  console.log(`📝 Agent ID: ${agentId}`);

  const VeilTrader = await ethers.getContractFactory('VeilTrader');
  const veilTrader = await VeilTrader.deploy(ethers.hexlify(ethers.toUtf8Bytes(agentId)));

  await veilTrader.waitForDeployment();

  const address = await veilTrader.getAddress();
  console.log(`✅ VeilTrader deployed to: ${address}`);
  console.log(`📝 Update .env with: VEILTRADER_CONTRACT=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
