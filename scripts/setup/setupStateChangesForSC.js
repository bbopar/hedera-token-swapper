const {
  Client,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  ContractId,
  PrivateKey,
} = require("@hashgraph/sdk");
require('dotenv').config();

const deployerAccountId = process.env.TREASURY_ACCOUNT_ID;
const deployerPrivKey = PrivateKey.fromString(process.env.TREASURY_DER_PRIVATE_KEY);

const client = Client.forTestnet();
client.setOperator(deployerAccountId, deployerPrivKey);

async function grantAdminRole(adminAcc, contractAddress) {
  console.log('🚀 ~ file: setupStateChangesForSC.js:18 ~ grantAdminRole ~ contractAddress:', contractAddress);
  const contractId = ContractId.fromEvmAddress(contractAddress);

  const trx = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(75000)
    .setFunction(
        "grantAdminRole",
        new ContractFunctionParameters().addAddress(adminAcc)
    )
    .execute(client);

  await trx.getReceipt(client);

  return true;
}

module.exports = {
  grantAdminRole,
};
