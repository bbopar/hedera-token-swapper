const { Client, PrivateKey, TokenCreateTransaction, Timestamp } = require("@hashgraph/sdk");
require('dotenv').config();

const treasuryAccountID = process.env.TREASURY_ACCOUNT_ID;
const treasuryPrivateKey = PrivateKey.fromString(process.env.TREASURY_DER_PRIVATE_KEY);
const treasuryPublicKey = treasuryPrivateKey.publicKey;

const client = Client.forTestnet();
client.setOperator(treasuryAccountID, treasuryPrivateKey);

const moment = require('moment');
const currentDate = moment();
const newDate = currentDate.add(5, 'minutes');
const date = new Date(newDate);

async function main() {
  const exp = Timestamp.fromDate(date);

  console.log('🚀 ~ file: createFungibleExp.js:19 ~ main ~ exp:', exp);

  const transaction = new TokenCreateTransaction()
    .setTokenName("DummyToken")
    .setTokenSymbol("DT")
    .setDecimals(0)
    .setInitialSupply(1000000)
    .setTreasuryAccountId(treasuryAccountID)
    .setAdminKey(treasuryPublicKey)
    .setWipeKey(treasuryPublicKey)
    .setExpirationTime(exp)
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

