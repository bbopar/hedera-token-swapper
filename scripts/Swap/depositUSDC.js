const { TokenId } = require('@hashgraph/sdk');
const hre = require("hardhat");
require('dotenv').config();

async function main() {
    const contractAddr = process.env.SWAP_CONTRACT_ADDRESS;
    const Swapper  = await hre.ethers.getContractFactory("Swapper");
    const swapper  = Swapper.attach(contractAddr);

    const amount = 100;
    const usdcTokenAddress = TokenId.fromString(process.env.TS_USDC_ACCOUNT_ID).toSolidityAddress();

    const depositResponse = await swapper.deposit(usdcTokenAddress, amount);

    console.log("Deposit response: ", depositResponse);

    const receipt = await depositResponse.wait();
    
    console.log("Deposit receipt: ", receipt);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
