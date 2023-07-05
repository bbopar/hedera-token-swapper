const hre = require("hardhat");
require('dotenv').config();

async function main() {
    const contractAddr = process.env.SWAP_CONTRACT_ADDRESS;
    const Swapper  = await hre.ethers.getContractFactory("Swapper");
    const swapper  = Swapper.attach(contractAddr);

    const stopResponse = await swapper.stop();

    console.log("Stop response: ", stopResponse);

    const receipt = await stopResponse.wait();
    
    console.log("Deposit receipt: ", receipt);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
