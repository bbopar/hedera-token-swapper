const BigNumber = require('bignumber.js');
const axios = require('axios');

async function getAccountBalance(accountId) {
  const balance = (await axios.get(`https://testnet.mirrornode.hedera.com/api/v1/balances?account.id=${accountId}`)).data;

  const hbarBalance = new BigNumber(balance.balances[0].balance).dividedBy(100_000_000).toString();

  const response = {
    defaultBalanceDenomination: 'tiniybars',
    hbarBalance,
    ...balance.balances[0],
  };

  return response;
}

module.exports = {
  getAccountBalance,
};
