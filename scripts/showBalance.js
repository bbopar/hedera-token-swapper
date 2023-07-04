const { ethers } = require("hardhat");

async function main() {
  const wallet = (await ethers.getSigners())[0];

  const balance = (await wallet.getBalance()).toString();

  console.log(`The address ${wallet.address} has ${balance} tinybars`);

  return balance;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
