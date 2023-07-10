const fs = require('fs');
const { createAccounts, tokenAssociateAccounts, transferTokens } = require('./setupAccounts');
const { createTokens } = require('./setupTokens');
const { deployContract } = require('./deploySetup');
const { grantAdminRole } = require('./setupStateChangesForSC');

const FILE_DESCRIPTOR = 'setup.json';

async function main() {
  const accounts = await createAccounts();

  const { barrage, usdc } = await createTokens(
    {
      name: 'XBarrageToken',
      supply: 10000,
      symbol: 'XBT',
    },
    {
      name: 'XTether',
      supply: 10000,
      symbol: 'XUSDT',
    }
  );

  const result = await tokenAssociateAccounts(barrage, usdc, accounts);
  
  await transferTokens(usdc.tokenId, 10000, accounts.COMPANY_ADMIN_ACCOUNT_ID);

  await transferTokens(barrage.tokenId, 10, accounts.EMPLOYEE_ACCOUNT_ID);

  const contractAddress = await deployContract(barrage.evmAddress, usdc.evmAddress);

  const setup = {
    ...result,
    ...accounts,
    contractAddress,
  };

  // await grantAdminRole(accounts.COMPANY_ADMIN_ACCOUNT_ID, contractAddress);
  try {
    const data = fs.readFileSync(FILE_DESCRIPTOR)
    let accData = JSON.parse(data)
    accData = setup;
    fs.writeFileSync(FILE_DESCRIPTOR, JSON.stringify(accData, null, 2))
  } catch (error) {
    fs.writeFileSync(FILE_DESCRIPTOR, JSON.stringify(setup, null, 2))
  }

  process.exit();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});