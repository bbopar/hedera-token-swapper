const { TokenId } = require('@hashgraph/sdk');
const hre = require("hardhat");
require('dotenv').config();

async function main() {
    const contractAddr = process.env.SWAP_CONTRACT_ADDRESS;
    const BarrageTokenSwap  = await hre.ethers.getContractFactory("Swapper");
    const barrageTokenSwap  = BarrageTokenSwap.attach(contractAddr);


    const usdcTokenAddress = TokenId.fromString(process.env.TS_USDC_ACCOUNT_ID).toSolidityAddress();

    const associateResponse = await barrageTokenSwap.tokenAllowance(
        usdcTokenAddress,
        { gasLimit: 15000000 },
    );

    console.log("Associate response: ", associateResponse);

    const receipt = await associateResponse.wait();
    
    console.log("Associate receipt: ", receipt);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
