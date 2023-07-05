const hre = require("hardhat");
require('dotenv').config();

async function main() {
    const contractAddr = process.env.SWAP_CONTRACT_ADDRESS;
    const Swapper  = await hre.ethers.getContractFactory("Swapper");
    const swapper  = Swapper.attach(contractAddr);

    const addrToRemove = process.env.ADMIN_EVM_ADDRESS;

    const removedAddr = await swapper.removeWhitelistedAddress(addrToRemove);

    console.log("removedAddr response: ", removedAddr);

    const receipt = await removedAddr.wait();
    
    console.log("removedAddr receipt: ", receipt);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
