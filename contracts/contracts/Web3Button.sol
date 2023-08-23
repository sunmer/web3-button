// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Web3Button {
    address public owner;
    address public lastPresser;
    uint256 public lastPressTimestamp;
    uint256 public potBalance;
    uint256 public claimDeadline;
    bool public isGameActive = true;

    event ButtonPressed(address indexed lastPresser);
    event GameWon(address indexed winner);

    constructor() {
      owner = msg.sender;
    }

    modifier onlyLastPresser() {
    require(msg.sender == lastPresser, "Only the last presser can call this function");
    _;
  }

    modifier onlyOwner() {
      require(msg.sender == owner, "Only the owner can call this function");
      _;
    }

    function press() external payable {
      require(msg.value >= 0.001 ether, "You need to send at least 0.001 Eth");

      // Check if the previous game was unclaimed and if it's past the claimDeadline
      if(!isGameActive && block.timestamp > claimDeadline) {
        isGameActive = true;
      }

      require(isGameActive, "Game has ended. Wait for the restart.");

      potBalance += (msg.value * 9) / 10;

      lastPresser = msg.sender;
      lastPressTimestamp = block.timestamp;

      // Set the claim deadline whenever the button is pressed
      claimDeadline = block.timestamp + 300 seconds;

      emit ButtonPressed(lastPresser);
    }

    function claimPot() external onlyLastPresser {
      require(block.timestamp - lastPressTimestamp >= 60 seconds, "Wait for the timer to expire.");
      require(block.timestamp <= claimDeadline, "Claim period has expired.");
      require(potBalance > 0, "Pot balance is empty");

      uint256 amountToSend = potBalance;
      potBalance = 0;
      isGameActive = false;
      lastPresser = address(0);
      lastPressTimestamp = 0;
      claimDeadline = 0;

      (bool success, ) = msg.sender.call{ value: amountToSend }("");
      require(success, "Transfer failed");

      emit GameWon(msg.sender);
    }

    receive() external payable {
      revert("Contract does not accept direct Ether transfers");
    }

    function withdraw() external onlyOwner {
      uint256 protocolBalance = address(this).balance - potBalance;
      payable(owner).transfer(protocolBalance);
    }

}
