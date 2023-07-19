const { Client, PrivateKey, TokenCreateTransaction, TokenId } = require("@hashgraph/sdk");
require('dotenv').config();

const treasuryAccountID = process.env.DEPLOYER_ACCOUNT_ID;
const treasuryPrivateKey = PrivateKey.fromString(process.env.DEPLOYER_DER_PRIVATE_KEY);
const treasuryPublicKey = treasuryPrivateKey.publicKey;

const client = Client.forTestnet();
client.setOperator(treasuryAccountID, treasuryPrivateKey);

async function createTokens(usd, bt) {
  const USDC = await createToken(usd.name, usd.symbol, usd.supply);

  const BARRAGE = await createToken(bt.name, bt.symbol, bt.supply);

  return {
    BARRAGE,
    USDC,
  }
}

async function createToken(name, symbol, supply) {
  const transaction = new TokenCreateTransaction()
    .setTokenName(name)
    .setTokenSymbol(symbol)
    .setDecimals(0)
    .setInitialSupply(supply)
    .setTreasuryAccountId(treasuryAccountID)
    .setAdminKey(treasuryPublicKey)
    .setWipeKey(treasuryPublicKey)
    .setSupplyKey(treasuryPublicKey);

  const response = await transaction.execute(client);
  const receipt = await response.getReceipt(client);
  const tokenId = receipt.tokenId;

  return {
    name,
    supply,
    tokenId: tokenId.toString(),
    evmAddress: TokenId.fromString(tokenId).toSolidityAddress()
  };
}

module.exports = {
  createTokens,
};
