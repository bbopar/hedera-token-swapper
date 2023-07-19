const {
  FileCreateTransaction,
  FileAppendTransaction,
  FileContentsQuery,
  TransactionRecordQuery,
  Hbar,
  LocalProvider,
  Wallet
} = require("@hashgraph/sdk");
require('dotenv').config();

const wallet = new Wallet(
  process.env.TREASURY_ACCOUNT_ID,
  process.env.TREASURY_DER_PRIVATE_KEY,
  new LocalProvider()
);

async function main() {
  const { bytecode } = require('../../../artifacts/contracts/Swapper.sol/Swapper.json');

  console.log(`The size of the data is ${bytecode.length}`);
  
  // Create a file on Hedera and store file
  let fileCreateTransaction = await new FileCreateTransaction()
      .setKeys([wallet.getAccountKey()]) 
      .setContents("")
      .setMaxTransactionFee(new Hbar(2))
      .freezeWithSigner(wallet);
  fileCreateTransaction = await fileCreateTransaction.signWithSigner(wallet);
  const txCreateResponse = await fileCreateTransaction.executeWithSigner(wallet);

  //Get the receipt of the transaction
  const createReceipt = await txCreateResponse.getReceiptWithSigner(wallet);

  //Grab the new file ID from the receipt
  const fileId = createReceipt.fileId;
  console.log(`Your file ID is: ${fileId}`);

  // Fees can be calculated with the fee estimator https://hedera.com/fees
  const txAppendResponse = await (
      await (
          await new FileAppendTransaction()
              .setNodeAccountIds([txCreateResponse.nodeId])
              .setFileId(fileId)
              .setContents(data)
              .setMaxTransactionFee(new Hbar(5))
              .freezeWithSigner(wallet)
      ).signWithSigner(wallet)
  ).executeWithSigner(wallet);

  const appendReceipt = await txAppendResponse.getReceiptWithSigner(wallet);

  const contents = await new FileContentsQuery()
      .setFileId(fileId)
      .executeWithSigner(wallet);

  console.log(`File content length according to \`FileInfoQuery\`: ${contents.length}`);

  // Get the fees
  const createQuery = await new TransactionRecordQuery().setTransactionId(txCreateResponse.transactionId).executeWithSigner(wallet);
  const appendQuery = await new TransactionRecordQuery().setTransactionId(txAppendResponse.transactionId).executeWithSigner(wallet);

  console.log(`Fee for create: ${createQuery.transactionFee}`);
  console.log(`Fee for append: ${appendQuery.transactionFee}`);

  // Those are in Hbar, what is the exchange rate?
  const exchangeRateCreate = createReceipt.exchangeRate.exchangeRateInCents;
  const exchangeRateAppend = appendReceipt.exchangeRate.exchangeRateInCents;

  console.log(`Exchange Rate create (USD Cents) TX ${exchangeRateCreate}, append TX ${exchangeRateAppend}`);

  process.exit();
}

main();