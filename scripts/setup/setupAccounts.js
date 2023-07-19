const {
  PrivateKey,
  Client,
  AccountCreateTransaction,
  TokenAssociateTransaction,
  TransferTransaction,
} = require("@hashgraph/sdk");
require('dotenv').config();

const treasuryAccountID = process.env.DEPLOYER_ACCOUNT_ID;
const treasuryPrivateKey = PrivateKey.fromString(process.env.DEPLOYER_DER_PRIVATE_KEY);

const treasuryClient = Client.forTestnet();
treasuryClient.setOperator(treasuryAccountID, treasuryPrivateKey);

async function createAccount(n) {
    const newAccountPrivateKey = PrivateKey.generateED25519();
    const tx = await new AccountCreateTransaction()
        .setKey(newAccountPrivateKey)
        .setInitialBalance(1500)
        .execute(treasuryClient);

    const accountId = (await tx.getReceipt(treasuryClient)).accountId;
    console.log(`- Account ${n}`);
    console.log(`Private key: ${newAccountPrivateKey}`);
    console.log(`Account ID: ${accountId}\n`);

    return {
      accountId,
      newAccountPrivateKey,
    }
}


async function createAccounts() {
  let accounts = [];
  for (let i = 1; i < 3; i++) {
    accounts.push(await createAccount(i));
  }

  const COMPANY_ADMIN_PRIVATE_KEY = PrivateKey.fromString(accounts[0].newAccountPrivateKey.toStringDer());
  const EMPLOYEE_PRIVATE_KEY = PrivateKey.fromString(accounts[1].newAccountPrivateKey.toStringDer());

  return {
    COMPANY_ADMIN_ACCOUNT_ID: accounts[0].accountId.toString(),
    COMPANY_ADMIN_PRIVATE_KEY,
    COMPANY_ADMIN_PRIVATE_KEY_DER: accounts[0].newAccountPrivateKey.toStringDer(),
    EMPLOYEE_ACCOUNT_ID: accounts[1].accountId.toString(),
    EMPLOYEE_PRIVATE_KEY,
    EMPLOYEE_PRIVATE_KEY_DER: accounts[1].newAccountPrivateKey.toStringDer(),
  };
}

async function tokenAssociateAccounts(barrage, usdc, {
  COMPANY_ADMIN_ACCOUNT_ID,
  EMPLOYEE_ACCOUNT_ID,
  COMPANY_ADMIN_PRIVATE_KEY,
  EMPLOYEE_PRIVATE_KEY,
}) {
  return {
    BARRAGE: {
      ...barrage,
      status: await tokenAssociateAccount(COMPANY_ADMIN_ACCOUNT_ID, COMPANY_ADMIN_PRIVATE_KEY, usdc, barrage),
    },
    USDC: {
      ...usdc,
      status: await tokenAssociateAccount(EMPLOYEE_ACCOUNT_ID, EMPLOYEE_PRIVATE_KEY, usdc, barrage),
    }
  };
}

async function tokenAssociateAccount(accountId, privKey, usdc, barrage) {
  const tx = await new TokenAssociateTransaction()
    .setAccountId(accountId)
    .setTokenIds([usdc.tokenId.toString(), barrage.tokenId.toString()])
    .freezeWith(treasuryClient)
    .sign(privKey);

  const txSubmit = await tx.execute(treasuryClient);

  let receiptTx = await txSubmit.getReceipt(treasuryClient);

  const status = receiptTx.status.toString();

  console.log(
    `Your FT Manual Association: ${status} \n`
  );

  return status;
}

async function transferTokens(tokenId, amount, accountId) {
  const tx = await new TransferTransaction()
    .addTokenTransfer(tokenId, treasuryAccountID, -amount)
    .addTokenTransfer(tokenId, accountId, amount)
    .execute(treasuryClient);

  const receiptTx = await tx.getReceipt(treasuryClient);

  console.log(
    `Your Transfer: ${receiptTx.status.toString()} \n`
  );

  console.log(`To account: ${accountId} with the tokenId: ${tokenId} from account: ${treasuryAccountID}`);

  return receiptTx.status.toString();
}

module.exports = {
  createAccounts,
  tokenAssociateAccounts,
  transferTokens,
};
