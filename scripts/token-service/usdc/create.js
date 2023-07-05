const { Client, PrivateKey, TokenCreateTransaction } = require("@hashgraph/sdk");
require('dotenv').config();

/**
 * Constants.
 */
const treasuryAccountID = process.env.TREASURY_ACCOUNT_ID;
const treasuryPrivateKey = PrivateKey.fromString(process.env.TREASURY_DER_PRIVATE_KEY);
const treasuryPublicKey = treasuryPrivateKey.publicKey;

// Create a Hedera client
const client = Client.forTestnet(); // or Client.forMainnet()
client.setOperator(treasuryAccountID, treasuryPrivateKey);

/**
 * @description Create ERC20 token method.
 */
async function main() {
  const transaction = new TokenCreateTransaction()
    .setTokenName("USDCBB")
    .setTokenSymbol("USDCBB")
    .setDecimals(0)
    .setInitialSupply(1000000)
    .setTreasuryAccountId(treasuryAccountID)
    .setAdminKey(treasuryPublicKey)
    .setWipeKey(treasuryPublicKey)
    .setSupplyKey(treasuryPublicKey);

  const response = await transaction.execute(client);
  const receipt = await response.getReceipt(client);
  const tokenId = receipt.tokenId;

  console.log('🚀 Created USDC FT, tokenId:', tokenId);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

