const { Client, PrivateKey, TokenWipeTransaction } = require("@hashgraph/sdk");
require("dotenv").config();

const treasuryAccountID = process.env.TREASURY_ACCOUNT_ID;
const treasuryPrivateKey = PrivateKey.fromString(
  process.env.TREASURY_DER_PRIVATE_KEY
);

const client = Client.forTestnet();
client.setOperator(treasuryAccountID, treasuryPrivateKey);

async function main() {
  const accountId = '0.0.15142096';
  const tokenId = '0.0.15435072';

  const transaction = await new TokenWipeTransaction()
    .setAccountId(accountId)
    .setTokenId(tokenId)
    .setAmount(1000)
    .freezeWith(client);

  const signTx = await (await transaction.sign(treasuryPrivateKey)).sign(treasuryPrivateKey);

  const txResponse = await signTx.execute(client);

  const receipt = await txResponse.getReceipt(client);

  const transactionStatus = receipt.status;

  console.log(
    "The transaction consensus status is " + transactionStatus.toString()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
