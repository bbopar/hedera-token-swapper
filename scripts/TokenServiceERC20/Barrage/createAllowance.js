const { Client, PrivateKey, AccountAllowanceApproveTransaction } = require("@hashgraph/sdk");
require('dotenv').config();

/**
 * Constants.
 */
const treasuryAccountID = process.env.ACCOUNT_ID;
const treasuryPrivateKey = PrivateKey.fromString(process.env.DER_PRIVATE_KEY);

// Create a Hedera client
const client = Client.forTestnet(); // or Client.forMainnet()
client.setOperator(treasuryAccountID, treasuryPrivateKey);

async function main() {
  const tokenId = process.env.TS_BARRAGE_ACCOUNT_ID;
  const swapperId = process.env.SWAP_CONTRACT_ID;
  const accountId = process.env.ADMIN_ACCOUNT_ID;
  const privKey = PrivateKey.fromString(process.env.ADMIN_DER_PRIV_KEY);


  const tx = await new AccountAllowanceApproveTransaction()
    .approveTokenAllowance(tokenId, treasuryAccountID, swapperId, 100000)
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