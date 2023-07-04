const { Client, PrivateKey, TokenGrantKycTransaction } =  require("@hashgraph/sdk");
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
  const tokenId = process.env.TS_USDC_ACCOUNT_ID;
  const accountId = process.env.ADMIN_ACCOUNT_ID;
  const privKey = PrivateKey.fromString(process.env.ADMIN_DER_PRIV_KEY);

  let kycEnableTx = await new TokenGrantKycTransaction()
    .setAccountId(accountId)
    .setTokenId(tokenId)
    .freezeWith(client)
    .sign(privKey);

  await kycEnableTx.execute(client);

  console.log(`Associated account: ${accountId} with the tokenId: ${tokenId}`);

  process.exit();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});