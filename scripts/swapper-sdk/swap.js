const {
  Client,
  ContractFunctionParameters,
  ContractExecuteTransaction,
  PrivateKey,
  TokenId
} = require("@hashgraph/sdk");
require('dotenv').config();


const employeeAcc = process.env.BBB_ACCOUNT_ID;
const employeePrivateKey = PrivateKey.fromString(process.env.BBB_PRIV_KEY);

const client = Client.forTestnet();
client.setOperator(employeeAcc, employeePrivateKey);

async function main() {
  const trx = await new ContractExecuteTransaction()
    .setContractId(process.env.SWAP_CONTRACT_ID)
    .setGas(15000000)
    .setFunction(
        "swap"
    )
    .execute(client);

  console.log('🚀 ~ file: grantemployeeRole.js:29 ~ main ~ trx:', trx);

  const receipt = await trx.getReceipt(client);

  console.log('🚀 ~ file: grantemployeeRole.js:28 ~ main ~ receipt:', receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
