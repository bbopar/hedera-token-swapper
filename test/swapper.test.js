const {
  AccountAllowanceApproveTransaction,
  AccountBalanceQuery,
  AccountId,
  Client,
  ContractCallQuery,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  Hbar,
  PrivateKey,
  TokenId,
} = require("@hashgraph/sdk");
const assert = require('assert');
const { expect } = require('chai');
const {
  ACCOUNTS: {
    COMPANY_ADMIN_ACCOUNT_ID,
    COMPANY_ADMIN_PRIVATE_KEY_DER,
    EMPLOYEE_ACCOUNT_ID,
    EMPLOYEE_PRIVATE_KEY_DER,
  },
  USDC,
  BARRAGE,
  CONTRACT_ID,
  CONTRACT_ADDRESS,
} = require('../setup.json');
const axios = require('axios');

let treasuryAccountID;
let treasuryPrivateKey;
let client;

describe('Swapper test', () => {

  describe('#deposit to swapper flow', () => {
    before(() => {
      treasuryAccountID = COMPANY_ADMIN_ACCOUNT_ID;
      treasuryPrivateKey = PrivateKey.fromString(COMPANY_ADMIN_PRIVATE_KEY_DER);
      
      client = Client.forTestnet();
      client.setOperator(treasuryAccountID, treasuryPrivateKey);
    });

    it('should associate `swapper` with USDC token', async () => {
      try {
        const accountData = (await axios.get(`https://testnet.mirrornode.hedera.com/api/v1/accounts/${CONTRACT_ID}/tokens`)).data;

        if (accountData?.tokens?.every((token) => token.token_id !== USDC.tokenId)) {
          const fnName = 'associateToken';
    
          let trans = await new ContractExecuteTransaction()
            .setContractId(CONTRACT_ID)
            .setGas(15000000)
            .setFunction(fnName, new ContractFunctionParameters().addAddress(USDC.evmAddress))
            .setMaxTransactionFee(new Hbar(10))
            .execute(client);
          
          const receipt = await trans.getReceipt(client);
    
          assert.equal(receipt.status.toString(), 'SUCCESS');
        } else {
          console.log('🚀 Token already associated with CONTRACT');
        }
      } catch (error) {
        console.log('#### ERROR ####', error);
      }
    }).timeout(30000);

    it('should approve allowance for SC to make transfer on behalf of sender (USDC)', async () => {
      const allowanceAmount = 10000;

      const tx = await new AccountAllowanceApproveTransaction()
        .approveTokenAllowance(USDC.tokenId, COMPANY_ADMIN_ACCOUNT_ID, CONTRACT_ID, allowanceAmount)
        .freezeWith(client)
        .sign(treasuryPrivateKey);

      let submitTx = await tx.execute(client);
  
      let receiptTx = await submitTx.getReceipt(client);
    
      console.log(`🚀 ~ Sender ${COMPANY_ADMIN_ACCOUNT_ID} approved CONTRACT_ID: ${CONTRACT_ID}`);
 
      assert.equal(receiptTx.status.toString(), 'SUCCESS');
    });

    it('should be able to deposit USDC to Swapper', async () => {
      const fnName = 'deposit';

      let trans = new ContractExecuteTransaction()
        .setContractId(CONTRACT_ID)
        .setGas(15000000)
        .setFunction(fnName, new ContractFunctionParameters().addUint256(10))
        .setMaxTransactionFee(new Hbar(0.75));
  
      const contractFunctionResult = await trans.execute(client);
    
      const receipt = await contractFunctionResult.getReceipt(client);

      assert.equal(receipt.status.toString(), 'SUCCESS');
    }).timeout(20000);

    it('should be able to query USDC balance from SC', async () => {
      const fnName = 'getBalanceUSDC';

      let trans = new ContractCallQuery()
        .setGas(15000000)
        .setContractId(CONTRACT_ID)
        .setFunction(fnName)
        .setMaxQueryPayment(new Hbar(0.005));
    
      const contractFunctionResult = await trans.execute(client);

      const balance = contractFunctionResult.getUint256(0);

      expect(balance.toNumber()).to.be.a('number');
    });

    xit('should be able to whitelist user', async () => {
      const fnName = 'whitelistAddress';
      const employeeAddr = AccountId.fromString(EMPLOYEE_ACCOUNT_ID).toSolidityAddress();

      let trans = new ContractExecuteTransaction()
        .setContractId(CONTRACT_ID)
        .setGas(15000000)
        .setFunction(fnName, new ContractFunctionParameters().addAddress(employeeAddr))
        .setMaxTransactionFee(new Hbar(10));
  
      const contractFunctionResult = await trans.execute(client);
    
      const receipt = await contractFunctionResult.getReceipt(client);

      assert.equal(receipt.status.toString(), 'SUCCESS');
    });
  });


  describe('#swap flow', () => {
    before(() => {
      treasuryAccountID = EMPLOYEE_ACCOUNT_ID;
      treasuryPrivateKey = PrivateKey.fromString(EMPLOYEE_PRIVATE_KEY_DER);
      
      client = Client.forTestnet();
      client.setOperator(treasuryAccountID, treasuryPrivateKey);
    });

    it('should be able to check balance for withdraw', async () => {
      const fnName = 'getAmountForWithdraw';

      let trans = new ContractCallQuery()
        .setGas(15000000)
        .setContractId(CONTRACT_ID)
        .setFunction(fnName)
        .setMaxQueryPayment(new Hbar(0.005));
  
      const contractFunctionResult = await trans.execute(client);
    
      const balance = contractFunctionResult.getUint256(0);
    
      expect(balance.toNumber()).to.be.a('number');
    }).timeout(20000);

    it('should approve allowance for SC to make transfer on behalf of sender (BT)', async () => {
      const allowanceAmount = 10000;

      const tx = await new AccountAllowanceApproveTransaction()
        .approveTokenAllowance(BARRAGE.tokenId, EMPLOYEE_ACCOUNT_ID, CONTRACT_ID, allowanceAmount)
        .freezeWith(client)
        .sign(treasuryPrivateKey);

      let submitTx = await tx.execute(client);
  
      let receiptTx = await submitTx.getReceipt(client);
    
      console.log(`🚀 ~ Sender ${EMPLOYEE_ACCOUNT_ID} approved CONTRACT_ID: ${CONTRACT_ID}`);
 
      assert.equal(receiptTx.status.toString(), 'SUCCESS');
    }).timeout(20000);

    it('should be able to swap BT for USDC', async () => {
      const fnName = 'swap';

      let trans = new ContractExecuteTransaction()
        .setContractId(CONTRACT_ID)
        .setGas(15000000)
        .setFunction(fnName)
        .setMaxTransactionFee(new Hbar(10));
  
      const contractFunctionResult = await trans.execute(client);
    
      const receipt = await contractFunctionResult.getReceipt(client);
    
      assert.equal(receipt.status.toString(), 'SUCCESS');
    }).timeout(20000);

    it('should get employee balance in USDC', async () => {
      const res = await new AccountBalanceQuery()
        .setAccountId(EMPLOYEE_ACCOUNT_ID)
        .execute(client);

      const hbarBalance = res.hbars.toTinybars().toNumber();

      console.log('🚀 ~ file: swapper.test.js:181 ~ it ~ hbarBalance:', hbarBalance);

      const tokenBalances = res.tokens;
      for (const [tokenId, balance] of tokenBalances) {
        console.log(`Token ${tokenId.toString()} balance:`, balance.toNumber());
      }
    });
  });
});