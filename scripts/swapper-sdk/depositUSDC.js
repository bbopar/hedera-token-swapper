const {
  Client,
  ContractFunctionParameters,
  ContractExecuteTransaction,
  PrivateKey,
  Hbar
} = require("@hashgraph/sdk");
require('dotenv').config();

// Mock account form hashpack wallet here.
// This is the admin.

const adminAcc = '0.0.4266232';
const adminPrivateKey = PrivateKey.fromString('302e020100300506032b6570042204202559fb3acb7a0f6b8ffb9be2a4c0f85cf18281ccb4042574e99910534cfb5af8');

const client = Client.forTestnet();
client.setOperator(adminAcc, adminPrivateKey);

async function main() {
  let trans = new ContractExecuteTransaction()
    .setContractId(process.env.SWAP_CONTRACT_ID)
    .setGas(15000000)
    .setFunction("deposit", new ContractFunctionParameters().addUint256(10))
    .setMaxTransactionFee(new Hbar(0.75));

  const contractFunctionResult = await trans.execute(client);

  const receipt = await contractFunctionResult.getReceipt(client);

  console.log('🚀 ~ file: receipt', receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
