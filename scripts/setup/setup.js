const fs = require("fs");
const {
  createAccounts,
  tokenAssociateAccounts,
  transferTokens,
} = require("./setupAccounts");
const { createTokens } = require("./setupTokens");
const { deployContract } = require("./deploySetup");
const { grantAdminRole } = require("./setupStateChangesForSC");
const { getContractID } = require('./getContractID');
const { getAccountBalance } = require('./getBalance');
require('dotenv').config();

const FILE_DESCRIPTOR = "setup.json";

async function main() {
  try {
    // Try read `setup.json` file to check if we have prepared for tests.
    const data = fs.readFileSync(FILE_DESCRIPTOR);
    let accData = JSON.parse(data);
    accData = setup;
    fs.writeFileSync(FILE_DESCRIPTOR, JSON.stringify(accData, null, 2));
  } catch (error) {
    // If read file errors then prepare new `setup.json`.
    const deployerBalance = await getAccountBalance(process.env.DEPLOYER_ACCOUNT_ID);

    console.log('🚀 ~ file: setup.js:26 ~ main ~ deployerBalance:', deployerBalance);
    
    const ACCOUNTS = await createAccounts();

    const { BARRAGE, USDC } = await createTokens(
      { name: "NewBARRAGEToken", supply: 10000, symbol: "NBT" },
      { name: "NewUSDC", supply: 10000, symbol: "NUSDC" },
    );

    const result = await tokenAssociateAccounts(BARRAGE, USDC, ACCOUNTS);

    await transferTokens(USDC.tokenId, 10000, ACCOUNTS.COMPANY_ADMIN_ACCOUNT_ID);

    await transferTokens(BARRAGE.tokenId, 10, ACCOUNTS.EMPLOYEE_ACCOUNT_ID);

    const contractAddress = await deployContract(BARRAGE.evmAddress, USDC.evmAddress);

    const contractId = await getContractID(contractAddress);

    const setup = {
      ...result,
      ACCOUNTS,
      CONTRACT_ADDRESS: contractAddress,
      CONTRACT_ID: contractId,
    };

    await grantAdminRole(ACCOUNTS.COMPANY_ADMIN_ACCOUNT_ID, contractId);

    const deployerBal = await getAccountBalance(process.env.DEPLOYER_ACCOUNT_ID);

    console.log('🚀 ~ file: setup.js:56 ~ main ~ deployerBal:', deployerBal);

    fs.writeFileSync(FILE_DESCRIPTOR, JSON.stringify(setup, null, 2));
  }

  process.exit();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
