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

## Example usage `swapper` on testnet

### 1. Create `USDC token` on testnet

```
node scripts/token-service/usdc/create.js
```

output:

```
🚀 Created USDC FT, tokenId: 0.0.15052216
```

### 2. Create `Barrage token` on testnet

```
node scripts/token-service/barrage/create.js
```

output:

```
🚀 Created Barrage FT, tokenId: 0.0.15052197
```

For the next step you'll need ACCOUNT_IDS of tokens which you got in the output after creation.

Setup those IDS to .env and search for the EVM address of both tokens [here](https://hashscan.io/testnet), then paste it to your .env.


### 3. Deploying the Swapper Contract

To deploy the `Swapper` contract you must setup your .env file. 

Then deploy `Swapper`:

```
node scripts/swapper/deploy.js
```

output:

```
Swapper contract address: 0x123c022C341D14ceDA9D991c65F123e9043e9B69
```

Setup the EVM address of `Swapper` to your .env.

### 4. Admin Deposit

Before the admin can deposit, there are a few changes that need to be made to the state of the ERC20 contracts.

1. **Associate the `ADMIN` account with `USDC` and `BT`:**

    If you use the `TREASURY` account as `ADMIN`, you can skip this step.

    Before associating, you should set up the .env file and change what's being loaded in the script from .env.

    ```
    node scripts/token-service/usdc/associate.js
    node scripts/token-service/barrage/associate.js
    ```

2. **Associate the `EMPLOYEE` account with `USDC` and `BT`:**

    Change the accounts being loaded into the script and run:

    ```
    node scripts/token-service/usdc/associate.js
    node scripts/token-service/barrage/associate.js
    ```

3. **Associate the `SWAPPER` account with `USDC` and `BT`:**

    ```
    node scripts/swap/associateWithUSDC.js
    node scripts/swap/associateWithBT.js
    ```

4. **Approve the `ADMIN` account for spending `USDC` and `BT`:**

    ```
    node scripts/token-service/usdc/approve.js
    node scripts/token-service/barrage/approve.js
    ```

5. **Approve the `SWAPPER` account for spending `USDC` and `BT`:**

    ```
    node scripts/swap/approve.js
    ```

Now, the admin is ready to deposit, and employees can withdraw their stablecoin if they possess BarrageToken.
