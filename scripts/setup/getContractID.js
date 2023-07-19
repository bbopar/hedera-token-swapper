const axios = require("axios");
require('dotenv').config();

/**
 * Get contract ID from Hedera mirror node.
 */
async function getContractID(address) {
  const contractData = await axios.get(
    `https://testnet.mirrornode.hedera.com/api/v1/contracts/${address}`
  );

  console.log('getContractID', contractData);

  return contractData;
}

module.exports = {
  getContractID,
};
