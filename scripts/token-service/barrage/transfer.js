const { Client, PrivateKey, TransferTransaction } = require("@hashgraph/sdk");
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
  const tokenId = process.env.BARRAGE_ACCOUNT_ID;
  // const accountId = process.env.ADMIN_ACCOUNT_ID;
  const accountId = '0.0.4066176';

  const amount = 1000;

  const tx = await new TransferTransaction()
    .addTokenTransfer(tokenId, treasuryAccountID, -amount)
    .addTokenTransfer(tokenId, accountId, amount)
    .execute(client);

  const receiptTx = await tx.getReceipt(client);

  console.log(
    `Your FT Manual Transaction: ${receiptTx.status.toString()} \n`
  );

  console.log(`Trx: ${accountId} with the tokenId: ${tokenId}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
