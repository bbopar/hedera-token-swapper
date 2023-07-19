const {
  AccountId,
  Client,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  PrivateKey,
} = require("@hashgraph/sdk");
require('dotenv').config();

const deployerAccountId = process.env.DEPLOYER_ACCOUNT_ID;
const deployerPrivKey = PrivateKey.fromString(process.env.DEPLOYER_DER_PRIVATE_KEY);

const client = Client.forTestnet();
client.setOperator(deployerAccountId, deployerPrivKey);

async function grantAdminRole(adminAcc, contractId) {
  const adminAddr = AccountId.fromString(adminAcc).toSolidityAddress();

  const trx = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(75000)
    .setFunction(
        "grantAdminRole",
        new ContractFunctionParameters().addAddress(adminAddr)
    )
    .execute(client);

  await trx.getReceipt(client);

  return true;
}

module.exports = {
  grantAdminRole,
};
