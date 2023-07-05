const hre = require("hardhat");
require('dotenv').config();

async function main() {
    const contractAddr = process.env.SWAP_CONTRACT_ADDRESS;
    const Swapper  = await hre.ethers.getContractFactory("Swapper");
    const swapper  = Swapper.attach(contractAddr);

    const addrToWhitelist = process.env.ADMIN_EVM_ADDRESS;

    const whitelistedAddr = await swapper.whitelistAddress(addrToWhitelist);

    console.log("whitelistedAddr response: ", whitelistedAddr);

    const receipt = await whitelistedAddr.wait();
    
    console.log("whitelistedAddr receipt: ", receipt);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
