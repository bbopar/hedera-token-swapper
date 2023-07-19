const axios = require("axios");

async function getContractID(address) {
  const contractData = (await axios.get(`https://testnet.mirrornode.hedera.com/api/v1/contracts/${address}`)).data;

  console.log('getContractID', contractData);

  return contractData.contract_id;
}

module.exports = {
  getContractID,
};
