const {
    Client,
    ContractCallQuery,
    PrivateKey,
    Hbar
  } = require("@hashgraph/sdk");
  require('dotenv').config();

  // Mock account form hashpack wallet here.
  // This is the admin.
  
  const adminAcc = '0.0.4266232';
  const adminPrivateKey = PrivateKey.fromString('302e020100300506032b6570042204202559fb3acb7a0f6b8ffb9be2a4c0f85cf18281ccb4042574e99910534cfb5af8');
  
  const client = Client.forTestnet();
  client.setOperator(adminAcc, adminPrivateKey);
  
  async function main() {
    const contractQuery = new ContractCallQuery()
        .setGas(15000000)
        .setContractId(process.env.SWAP_CONTRACT_ID)
        .setFunction(
            "getBalanceUSDC",
        )
        .setQueryPayment(new Hbar(30));

    const contractFunctionResult = await contractQuery.execute(client);

    console.log('🚀 ~ file: getBalanceUSDC.js:29 ~ main ~ contractFunctionResult:', contractFunctionResult);
    
    const balance = contractFunctionResult.getUint256(0);

    console.log('🚀 ~ file: getBalanceUSDC.js:29 ~ main ~ txResponse:', balance.toNumber());
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  