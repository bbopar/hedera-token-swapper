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
  const tokenId = '0.0.15435072';
  const accountId = '0.0.15142096'; // This my admin in the WALLET.

  const amount = 10000;

  const tx = await new TransferTransaction()
    .addTokenTransfer(tokenId, treasuryAccountID, -amount)
    .addTokenTransfer(tokenId, accountId, amount)
    .execute(client);

  const receiptTx = await tx.getReceipt(client);

  console.log(
    `Your Transfer: ${receiptTx.status.toString()} \n`
  );

  console.log(`To account: ${accountId} with the tokenId: ${tokenId} from account: ${treasuryAccountID}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
