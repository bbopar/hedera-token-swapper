const hre = require("hardhat");

async function main() {
  const BarrageTokenSwap = await hre.ethers.getContractFactory("Swapper");
  const barrageTokenSwap = await BarrageTokenSwap
    .deploy(process.env.TS_USDC_CONTRACT_ADDRESS, process.env.TS_BARRAGE_CONTRACT_ADDRESS);

  const contractAddress = (await barrageTokenSwap.deployTransaction.wait()).contractAddress;

  console.log("BarrageTokenSwap contract deployed to:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
