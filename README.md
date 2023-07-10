# Merit Money Swapper

Merit Money Swapper is a project that explores the possibilities of Hedera smart contracts. Its primary contract, `Swapper`, enables the exchange of ERC20 tokens (awarded to employees as bonuses) for the USDC stablecoin. The company admin is responsible for deploying the contract and depositing USDC into it. Once approved, employees can withdraw their bonuses in USDC.

## Technologies and Languages

This project is built on the Hedera blockchain platform and is written in Solidity and JavaScript.

## Dependencies

- `hashgraph/sdk`
- `hardhat`
- `nomiclabs/hardhat-ethers`
- `openzeppelin/contracts`

## Installation

To install the project, run:

```
npm install
```

## Build

To compile the contracts run:

```
npx hardhat compile
```

## Contract artifacts

The contract artifacts should be located in the project root under `artifacts` directory.

Loading `Swapper` abi:

```
import { abi } from '../artifacts/contracts/Swapper.sol/Swapper.json';
```

## Example usage.

### Deployer account setup

To deploy the contract on `testnet` the `Deployer` account must be setup in the .env file.

```
DEPLOYER_ACCOUNT_ID=
DEPLOYER_EVM_ADDRESS=
DEPLOYER_HEX_PRIVATE_KEY=
DEPLOYER_DER_PRIVATE_KEY=
```

### Setting up hardhat.config.js

Setup the contract deployer in `hardhat.config.js`.

The private key provided in `hardhat.config.js` must be HEX priv key.

```
const PRIVATE_KEY = process.env.DEPLOYER_HEX_PRIVATE_KEY;
```

## Setup

Under the `scripts` directory you can find `setup` script. After the `deployer` account is setup in .env file run `setup` script:

```
npm run setup-accounts
```

This script will create `setup.json` file in the root of the project which is necessary for testing `Swapper`.

In the last step of `setup` the compiled contract from `artifacts/contracts/Swapper.sol` will be deployed.

example:

```
  "barrage": {
    "name": "XTether",
    "supply": 10000,
    "tokenId": "0.0.15071227",
    "evmAddress": "0000000000000000000000000000000000e5f7fb",
    "status": "SUCCESS"
  },
  "usdc": {
    "name": "XBarrageToken",
    "supply": 10000,
    "tokenId": "0.0.15071225",
    "evmAddress": "0000000000000000000000000000000000e5f7f9",
    "status": "SUCCESS"
  },
  "COMPANY_ADMIN_ACCOUNT_ID": "0.0.15071223",
  "COMPANY_ADMIN_PRIVATE_KEY": "",
  "COMPANY_ADMIN_PRIVATE_KEY_DER": "302e020100300506032b6570042204206994617bb7cd5d3b9e508cc1255e5f84467ba333c72e598c30fa917a22e95d59",
  "EMPLOYEE_ACCOUNT_ID": "0.0.15071224",
  "EMPLOYEE_PRIVATE_KEY": "",
  "EMPLOYEE_PRIVATE_KEY_DER": "302e020100300506032b657004220420e236f59e91a7e5efe02e67fbfab3bcfe20f56944e54a2034c1f411d61878fbfb",
  "contractAddress": "0x59f13Cef084Baf9B10811d6c04eD2CbE33Dd75bb",
```

Look up for `contractAddress` in the settings.json, copy the address and search the contractID [here](https://hashscan.io/testnet).

Past the `contractId` down below `contractAddress` in `settings.json`.

The `deployer` account is the contract `ADMIN`.

Suggestion is to add admin role for `COMPANY_ADMIN_ACCOUNT_ID` to replicate the case on `mainnet` for merit-money.

## Grant Admin role

As the PRIVATE_KEY defined in `hardhat.config.js` is the contract `ADMIN` that accounts is in charge for granting role

to merit-money COMPANY_ADMIN which will be responsible for the `ADMIN` contract interaction.

The `EMPLOYEES` must be whitelisted so that they have a right to `Swap` their bonus tokens with stablecoin.

Note: this scripts for granting role uses `@hashgraph/sdk` while for deploy with don't need it at all.

Before running the script for granting admin role please setup your new `COMPANY_ADMIN` account in the script.

The script is located under: `scripts/setup/grantAdminRole`.

Running the script:

```
npm run grant-admin-role
```

From now on everything else can be done with `unit test` or `HashPack wallet`.

## Smart contract interaction - showcase: Unit tests

Before running unit tests the `setup` and `grant role to admin` must be done.

Unit tests for `Swapper` interaction are located under the `test` directory.

Make sure that your `contractId` is setup in `setup.json` file.

In the `unit` test flow you can find all required state changes before the `ADMIN` is able to deposit.

- should associate `swapper` with USDC token
- should approve allowance for SC to make transfer on behalf of sender (USDC)

For `EMPLOYEE` to swap:

- should approve allowance for SC to make transfer on behalf of sender (BT)

Running unit tests:

```
npm run test
```

## Deploy (as stand-alone)

Script for `deploy` uses `hardhat` for contract deployment.

The complied contracts should be deployed with the command:

```
node scripts/swapper/deploy.js
```

Script output:

```
Swapper contract address: 0x81c2e51a55f21b0246754C4e11C749F0f2C8d443
```
The recommendation is to off-load the deployment to backend services.

The reason is that you can't deploy such large contract with hashpack wallet.

Because of that suggestion is to read `privKey` from `vault` or `.env` file

and then deploy the contract using backend.
