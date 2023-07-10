const {
  Client,
  ContractFunctionParameters,
  ContractExecuteTransaction,
  PrivateKey,
  TokenId
} = require("@hashgraph/sdk");
require('dotenv').config();


const adminAcc = '0.0.4266232';
const adminPrivateKey = PrivateKey.fromString('302e020100300506032b6570042204202559fb3acb7a0f6b8ffb9be2a4c0f85cf18281ccb4042574e99910534cfb5af8');

const client = Client.forTestnet();
client.setOperator(adminAcc, adminPrivateKey);

async function main() {
  const tokenAddr = TokenId.fromString('0.0.15052216').toSolidityAddress();

  const trx = await new ContractExecuteTransaction()
    .setContractId(process.env.SWAP_CONTRACT_ID)
    .setGas(15000000)
    .setFunction(
        "associateToken",
        new ContractFunctionParameters().addAddress(tokenAddr)
    )
    .execute(client);

  const receipt = await trx.getReceipt(client);

  console.log('🚀 ~ file: grantAdminRole.js:28 ~ main ~ receipt:', receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
