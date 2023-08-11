// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Web3Button {
    address public owner;
    address public lastPresser;
    uint256 public lastPressTimestamp;
    uint256 public balance;
    event ButtonPressed(address indexed lastPresser);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyLastPresser() {
        require(
            msg.sender == lastPresser,
            "Only the last presser can call this function"
        );
        _;
    }

    function press() external payable {
        require(msg.value < 0.01 ether, "You need to send at least 0.01 Matic");

        lastPresser = msg.sender;
        lastPressTimestamp = block.timestamp;
        balance += msg.value;

        emit ButtonPressed(lastPresser);
    }

    function withdraw() external onlyLastPresser {
        require(
            block.timestamp - lastPressTimestamp >= 60 seconds,
            "Timeout not reached"
        );
        require(balance > 0, "Contract balance is empty");

        uint256 amountToSend = balance;
        balance = 0;

        (bool success, ) = lastPresser.call{ value: amountToSend }("");
        require(success, "Transfer failed");
    }

    // Fallback function to reject incoming Ether
    receive() external payable {
        revert("Contract does not accept direct Ether transfers");
    }
}
