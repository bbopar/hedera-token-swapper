const { Hbar } = require("@hashgraph/sdk");
const axios = require('axios');
const BigNumber = require('bignumber.js');

async function main() {
  const accountId = '0.0.15437035';

  const balance = (await axios.get(`https://testnet.mirrornode.hedera.com/api/v1/balances?account.id=${accountId}`)).data;
  
  const hbarBalance = new BigNumber(balance.balances[0].balance).dividedBy(100_000_000).toString();

  console.log(hbarBalance.toString());

  const response = {
    defaultBalanceDenomination: 'tiniybars',
    hbarBalance,
    ...balance.balances[0],
  };

  console.log('### RES ###', response);

  return response;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


