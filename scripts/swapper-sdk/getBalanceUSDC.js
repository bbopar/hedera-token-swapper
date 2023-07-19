const {
  Client,
  ContractCallQuery,
  PrivateKey,
} = require("@hashgraph/sdk");
require("dotenv").config();

const adminAcc = "0.0.1397";
const adminPrivateKey = PrivateKey.fromString(
  "3030020100300706052b8104000a04220420cfbeefa3d77d7cf51e3219dfcb5a42709aef6fbca4d461e48d478c72eee7ed49"
);

const client = Client.forTestnet();
client.setOperator(adminAcc, adminPrivateKey);

async function main() {
  const contractQuery = new ContractCallQuery()
    .setGas(15000000)
    .setContractId(process.env.SWAP_CONTRACT_ID)
    .setFunction("getBalanceUSDC");

  const contractFunctionResult = await contractQuery.execute(client);

  console.log(
    "🚀 ~ file: getBalanceUSDC.js:29 ~ main ~ contractFunctionResult:",
    contractFunctionResult
  );

  const balance = contractFunctionResult.getUint256(0);

  console.log(
    "🚀 ~ file: getBalanceUSDC.js:29 ~ main ~ txResponse:",
    balance.toNumber()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
