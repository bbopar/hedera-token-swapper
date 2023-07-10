const {
  AccountId,
  Client,
  ContractFunctionParameters,
  ContractExecuteTransaction,
  PrivateKey,
  Hbar
} = require("@hashgraph/sdk");
require('dotenv').config();


const deployerAccountId = process.env.TREASURY_ACCOUNT_ID;
const deployerPrivKey = PrivateKey.fromString(process.env.TREASURY_DER_PRIVATE_KEY);

const client = Client.forTestnet();
client.setOperator(deployerAccountId, deployerPrivKey);

const newAdminAddr = AccountId.fromString(process.env.BBOPAR_ACCOUNT_ID).toSolidityAddress();

async function main() {
  const trx = await new ContractExecuteTransaction()
    .setContractId(process.env.SWAP_CONTRACT_ID)
    .setGas(75000)
    .setFunction(
        "grantAdminRole",
        new ContractFunctionParameters().addAddress(newAdminAddr)
    )
    .execute(client);

  const receipt = await trx.getReceipt(client);

  console.log('🚀 ~ file: grantAdminRole.js:28 ~ main ~ receipt:', receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
