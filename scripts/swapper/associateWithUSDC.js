const { TokenId } = require('@hashgraph/sdk');
const hre = require("hardhat");
require('dotenv').config();

async function main() {
    const swapperAddress = process.env.SWAP_CONTRACT_ADDRESS;
    const Swapper  = await hre.ethers.getContractFactory("Swapper");
    const swapper  = Swapper.attach(swapperAddress);

    const usdcTokenAddress = TokenId.fromString(process.env.USDC_ACCOUNT_ID).toSolidityAddress();

    const associateResponse = await swapper.associateToken(
        usdcTokenAddress,
        { gasLimit: 15000000 },
    );

    console.log("Associated USDC token with Swapper SC, associateResponse:", associateResponse);

    const receipt = await associateResponse.wait();
    
    console.log("Associated USDC token with Swapper SC, wait receipt:", receipt);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
