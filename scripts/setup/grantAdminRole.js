const {
  AccountId,
  Client,
  ContractFunctionParameters,
  ContractExecuteTransaction,
  PrivateKey,
  ContractId,
  TransactionReceiptQuery,
} = require("@hashgraph/sdk");
require('dotenv').config();
const { COMPANY_ADMIN_ACCOUNT_ID, contractId } = require('../../setup.json');


const treasuryAccountID = process.env.COMPANY_ADMIN_ACCOUNT_ID;
const treasuryPrivateKey = PrivateKey.fromString(process.env.COMPANY_ADMIN_DER_KEY);

const client = Client.forTestnet();
client.setOperator(treasuryAccountID, treasuryPrivateKey);

async function main() {
  const admin = AccountId.fromString(COMPANY_ADMIN_ACCOUNT_ID).toSolidityAddress();

  const trx = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(75000)
    .setFunction(
        "grantAdminRole",
        new ContractFunctionParameters().addAddress(admin)
    )
    .execute(client);

  const receipt = await trx.getReceipt(client);

  console.log('🚀 ~ file: grantAdminRole.js:28 ~ main ~ receipt:', receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
