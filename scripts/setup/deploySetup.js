const hre = require("hardhat");

async function deployContract(barrageAddr, usdcAddr) {
  const BarrageTokenSwap = await hre.ethers.getContractFactory("Swapper");
  const barrageTokenSwap = await BarrageTokenSwap
    .deploy(usdcAddr, barrageAddr);


  const res = await barrageTokenSwap.deployTransaction.wait();

  console.log('🚀 ~ file: deploySetup.js:11 ~ deployContract ~ res:', res);

  const contractAddress = res.contractAddress;

  console.log("Swapper contract address:", contractAddress);

  return contractAddress;
}

module.exports = {
  deployContract,
};