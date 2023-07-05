const hre = require("hardhat");
require('dotenv').config();

async function main() {
    const swapperAddress = process.env.SWAP_CONTRACT_ADDRESS;
    const Swapper  = await hre.ethers.getContractFactory("Swapper");
    const swapper  = Swapper.attach(swapperAddress);

    const usdcTokenAddress = process.env.USDC_CONTRACT_ADDRESS;
    const barrageTokenAddress = process.env.BARRAGE_CONTRACT_ADDRESS;

    // address token, 
    // address spender,
    // uint256 amount
    const associateResponse = await swapper.approveSpender(
        barrageTokenAddress,
        swapperAddress,
        100000,
        { gasLimit: 15000000 },
    );

    console.log("Associated BT token with Swapper SC, associateResponse:", associateResponse);

    const receipt = await associateResponse.wait();
    
    console.log("Associated BT token with Swapper SC, wait receipt:", receipt);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
