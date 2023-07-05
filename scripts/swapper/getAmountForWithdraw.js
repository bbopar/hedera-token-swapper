const hre = require("hardhat");
require('dotenv').config();

async function main() {
    const contractAddr = process.env.SWAP_CONTRACT_ADDRESS;
    const Swapper  = await hre.ethers.getContractFactory("Swapper");
    const swapper  = Swapper.attach(contractAddr);

    const amount = await swapper.getAmountForWithdraw();

    console.log("Amount for withdraw response: ", amount);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
