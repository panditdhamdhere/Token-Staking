const hre = require("hardhat");

async function main() {
  // STAKING CONTRACT
  const tokenStaking = await hre.ethers.deployContract("TokenStaking");
  await tokenStaking.waitForDeployment();

  // TOKEN CONTRACT
  const theblockchain = await hre.ethers.deployContract("TheBlockchain");
  await theblockchain.waitForDeployment();

  // CONTRACT ADDRESS
  console.log(` STACKING: ${tokenStaking.target}`);
  console.log(` TOKEN: ${theblockchain.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
