const {
  Client,
  AccountAllowanceApproveTransaction,
  PrivateKey,
} = require("@hashgraph/sdk");
require('dotenv').config();


const deployerAccountId = process.env.TREASURY_ACCOUNT_ID;
const deployerPrivKey = PrivateKey.fromString(process.env.TREASURY_DER_PRIVATE_KEY);

const client = Client.forTestnet();
client.setOperator(deployerAccountId, deployerPrivKey);

// First we want to approve COMPANY_ADMIN as spender of USDC tokens. So he can deposit to SC.
const usdcTokenId = process.env.BARRAGE_ACCOUNT_ID;
const spenderAccountId = process.env.SWAP_CONTRACT_ID;
const allowanceAmount = 10000;
const ownerAccountId = process.env.BBB_ACCOUNT_ID;
const privKey = PrivateKey.fromString(process.env.BBB_PRIV_KEY);

/**
 * I [APPROVE_SWAPPER_AS_SPENDER_ON_BEHALF_OF_COMPANY_ADMIN] .approveTokenAllowance
 * msg.sender, address(this)
 * tokenId: USDC_ACCOUNT_ID
 * ownerAccountId: BBOPAR_ACCOUNT_ID (msg.sender)
 * spenderAccountId: SWAP_CONTRACT_ID (address(this))
 * amount: 10000
 * 
 * privKey: BBOPAR_PRIV_KEY
 * 
 * II. [APPROVE_EMPLOYEE_AS_SPENDER]
 * address(this), msg.sender
 * FIRST_TRY:
 * tokenId: USDC_ACCOUNT_ID
 * ownerAccountId: SWAP_CONTRACT_ID 
 * spenderAccountId: BBB_ACCOUNT_ID address(this) 
 * amount: 10000
 * 
 * privKey: BBB_PRIV_KEY
 * 
 * THIS IS NOT GOOD!
 * 
 * SECOND TRY:
 * `For this transferFrom call to succeed, the sender must have approved the contract to transfer at least balance number of barrage tokens on their behalf.`
 * tokenId: BARRAGE_ACCOUNT_ID
 * ownerAccountId:  BBB_ACCOUNT_ID
 * spenderAccountId: SWAP_CONTRACT_ID
 * amount: 10000
 * 
 * privKey: BBB_PRIV_KEY
 */

async function main() {
  const tx = await new AccountAllowanceApproveTransaction()
    .approveTokenAllowance(usdcTokenId, ownerAccountId, spenderAccountId, allowanceAmount)
    .freezeWith(client)
    .sign(privKey);

    let submitTx = await tx.execute(client);

  let receiptTx = await submitTx.getReceipt(client);

  console.log(`🚀 ~ Spender ${spenderAccountId} approved receipt:`, receiptTx.status.toString());

  process.exit();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
