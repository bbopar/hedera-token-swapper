require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const TREASURY_PRIVATE_KEY = process.env.DEPLOYER_HEX_PRIVATE_KEY;
// const COMPANY_ADMIN_PRIVATE_KEY = process.env.ADMIN_HEX_PRIVATE_KEY;
// const EMPLOYEE_PRIVATE_KEY = process.env.ADMIN_HEX_PRIVATE_KEY;

module.exports = {
  defaultNetwork: "testnet",
  networks: {
    testnet: {
      url: process.env.TESTNET_ENDPOINT,
      accounts: [TREASURY_PRIVATE_KEY]
    },
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources  : "./contracts",
    tests    : "./test",
    cache    : "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  }
};
