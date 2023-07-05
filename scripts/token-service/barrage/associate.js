const { Client, PrivateKey, TokenAssociateTransaction } = require("@hashgraph/sdk");
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
  const accountId = process.env.treasuryAccountID;
  const alicePrivKey = PrivateKey.fromString(process.env.ADMIN_EVM_ADDRESS);

  const tx = await new TokenAssociateTransaction()
    .setAccountId(treasuryAccountID)
    .setTokenIds([tokenId])
    .freezeWith(client)
    .sign(treasuryPrivateKey);

  const txSubmit = await tx.execute(client);

  let receiptTx = await txSubmit.getReceipt(client);

  console.log(
    `Your FT Manual Association: ${receiptTx.status.toString()} \n`
  );

  console.log(`Associated account: ${accountId} with the tokenId: ${tokenId}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
