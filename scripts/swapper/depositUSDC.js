const hre = require("hardhat");
require('dotenv').config();

async function main() {
    const contractAddr = process.env.SWAP_CONTRACT_ADDRESS;
    const Swapper  = await hre.ethers.getContractFactory("Swapper");
    const swapper  = Swapper.attach(contractAddr);

    const depositResponse = await swapper.deposit(100);

    const receipt = await depositResponse.wait();
    
    console.log("Deposit receipt: ", receipt);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
