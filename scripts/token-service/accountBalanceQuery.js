const { Client, AccountBalanceQuery, PrivateKey } = require("@hashgraph/sdk");
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
    const accountId = process.env.ADMIN_ACCOUNT_ID;
    const query = new AccountBalanceQuery()
        .setAccountId(accountId);
    const tokenBalance = await query.execute(client);

    console.log('### TOKEN BALANCE ###', tokenBalance.toJSON());
}

main();
