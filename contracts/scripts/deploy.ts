import { ethers } from "hardhat";

async function main() {
  const web3Button = await ethers.deployContract("Web3Button");

  await web3Button.waitForDeployment();

  console.log(
    `Web3Button deployed to ${web3Button.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
