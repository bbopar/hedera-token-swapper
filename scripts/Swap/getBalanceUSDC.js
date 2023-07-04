const hre = require("hardhat");
require('dotenv').config();

async function main() {
    const contractAddr = process.env.SWAP_CONTRACT_ADDRESS;

    const Swapper  = await hre.ethers.getContractFactory("Swapper");
    const swapper  = Swapper.attach(contractAddr);

    const balance = await swapper.usdcBalanceOf(contractAddr);

    console.log(`Balance in USDC of account ${contractAddr} is`, balance);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
