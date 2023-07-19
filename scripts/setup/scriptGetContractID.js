const axios = require("axios");
require('dotenv').config();

async function main() {
  const address = process.env.SWAP_CONTRACT_ADDRESS;

  console.log('🚀 ~ file: scriptGetContractID.js:6 ~ main ~ address:', address);

  const contractData = (await axios.get(`https://testnet.mirrornode.hedera.com/api/v1/contracts/${address}`)).data;

  console.log('getContractID', contractData.contract_id);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
