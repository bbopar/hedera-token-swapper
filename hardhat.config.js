require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();

const PRIVATE_KEY = process.env.HEX_PRIVATE_KEY;

module.exports = {
  defaultNetwork: "testnet",
  networks: {
    testnet: {
      url: process.env.TESTNET_ENDPOINT,
      accounts: [PRIVATE_KEY]
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
