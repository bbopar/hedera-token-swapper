const {
  Client,
  AccountAllowanceApproveTransaction,
  PrivateKey,
} = require("@hashgraph/sdk");
require("dotenv").config();

const deployerAccountId = process.env.TREASURY_ACCOUNT_ID;
const deployerPrivKey = PrivateKey.fromString(
  process.env.TREASURY_DER_PRIVATE_KEY
);

const client = Client.forTestnet();
client.setOperator(deployerAccountId, deployerPrivKey);

const usdcTokenId = process.env.BARRAGE_ACCOUNT_ID;
const spenderAccountId = process.env.SWAP_CONTRACT_ID;
const allowanceAmount = 10000;
const ownerAccountId = process.env.BBB_ACCOUNT_ID;
const privKey = PrivateKey.fromString(process.env.BBB_PRIV_KEY);

async function main() {
  const tx = await new AccountAllowanceApproveTransaction()
    .approveTokenAllowance(
      usdcTokenId,
      ownerAccountId,
      spenderAccountId,
      allowanceAmount
    )
    .freezeWith(client)
    .sign(privKey);

  let submitTx = await tx.execute(client);

  let receiptTx = await submitTx.getReceipt(client);

  console.log(
    `🚀 ~ Spender ${spenderAccountId} approved receipt:`,
    receiptTx.status.toString()
  );

  process.exit();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
