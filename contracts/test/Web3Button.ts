import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Web3Button", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    const ONE_GWEI = 1_000_000_000;

    const lockedAmount = ONE_GWEI;

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Web3Button = await ethers.getContractFactory("Web3Button");
    const web3Button = await Web3Button.deploy();

    return { web3Button, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should press the button", async function () {
      const { web3Button, owner, otherAccount } = await loadFixture(deployFixture);

      // Connect the otherAccount to the contract
      const web3ButtonWithOtherAccount = web3Button.connect(otherAccount);

      // Press the button and send 0.0001 ETH
      const pressTx = await web3ButtonWithOtherAccount.press({ value: ethers.parseEther("0.0001") });

      // Wait for the transaction to be mined
      await pressTx.wait();

      // Check the last presser and the contract balance
      expect(await web3Button.lastPresser()).to.equal(otherAccount.address);
      expect(await web3Button.balance()).to.equal(ethers.parseEther("0.0001"));
    });
  });

});
