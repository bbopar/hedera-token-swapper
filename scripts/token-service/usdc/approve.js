const { Client, PrivateKey, AccountAllowanceApproveTransaction } = require("@hashgraph/sdk");
require('dotenv').config();

/**
 * Constants.
 */
const treasuryAccountID = process.env.TREASURY_ACCOUNT_ID;
const treasuryPrivateKey = PrivateKey.fromString(process.env.TREASURY_DER_PRIVATE_KEY);

// Create a Hedera client
const client = Client.forTestnet(); // or Client.forMainnet()
client.setOperator(treasuryAccountID, treasuryPrivateKey);

async function main() {
  const tokenId = process.env.USDC_ACCOUNT_ID;
  const swapperId = process.env.SWAP_CONTRACT_ID;

  const accountId = process.env.TREASURY_ACCOUNT_ID;
  const privKey = PrivateKey.fromString(process.env.TREASURY_DER_PRIVATE_KEY);

  // const accountId = process.env.ADMIN_ACCOUNT_ID;
  // const privKey = PrivateKey.fromString(process.env.ADMIN_EVM_ADDRESS);

  const tx = await new AccountAllowanceApproveTransaction()
    .approveTokenAllowance(tokenId, accountId, swapperId, 100000)
    .freezeWith(client)
    .sign(privKey);

  let submitTx = await tx.execute(client);

  let receiptTx = await submitTx.getReceipt(client);

  console.log(
    `Your FT Manual Association: ${receiptTx.status.toString()} \n`
  );

  console.log(`Associated account: ${accountId} with the tokenId: ${tokenId}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});