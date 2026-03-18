/**
 * All Integrations Index
 * Export all third-party protocol integrations
 */

const veniceIntegration = require('./VeniceIntegration');
const virtualsIntegration = require('./VirtualsIntegration');
const litProtocolIntegration = require('./LitProtocolIntegration');
const sliceIntegration = require('./SliceIntegration');
const selfIntegration = require('./SelfIntegration');
const octantIntegration = require('./OctantIntegration');
const bondCreditIntegration = require('./BondCreditIntegration');
const superRareIntegration = require('./SuperRareIntegration');
const zyfaiIntegration = require('./ZyfaiIntegration');
const statusNetworkIntegration = require('./StatusNetworkIntegration');
const ampersendIntegration = require('./AmpersendIntegration');
const arkhaiIntegration = require('./ArkhaiIntegration');
const ensIntegration = require('./ENSIntegration');

async function initializeAll() {
  await Promise.all([
    veniceIntegration.initialize(),
    virtualsIntegration.initialize(),
    litProtocolIntegration.initialize(),
    sliceIntegration.initialize(),
    selfIntegration.initialize(),
    octantIntegration.initialize(),
    bondCreditIntegration.initialize(),
    superRareIntegration.initialize(),
    zyfaiIntegration.initialize(),
    statusNetworkIntegration.initialize(),
    ampersendIntegration.initialize(),
    arkhaiIntegration.initialize(),
    ensIntegration.initialize()
  ]);
}

module.exports = {
  venice: veniceIntegration,
  virtuals: virtualsIntegration,
  lit: litProtocolIntegration,
  slice: sliceIntegration,
  self: selfIntegration,
  octant: octantIntegration,
  bondCredit: bondCreditIntegration,
  superRare: superRareIntegration,
  zyfai: zyfaiIntegration,
  status: statusNetworkIntegration,
  ampersend: ampersendIntegration,
  arkhai: arkhaiIntegration,
  ens: ensIntegration,
  initializeAll
};
