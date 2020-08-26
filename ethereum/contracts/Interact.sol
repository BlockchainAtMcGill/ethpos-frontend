// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.21 <0.7.0;

import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

contract Interact {
    mapping(address => uint256) public pendingWithdrawals;
    event txCompleted(address vendor, address customer);

    // Add money to a vendor's mapping
    function pay(address vendorAddress) public payable {
        require(msg.value > 0, "The value is required to be positive");
        require(msg.sender != vendorAddress, "Incorrect address passed in");
        // avoid overflow
        pendingWithdrawals[vendorAddress] = SafeMath.add(
            pendingWithdrawals[vendorAddress],
            msg.value
        );
        emit txCompleted(vendorAddress, msg.sender);
    }

    // Withdraw all money from mapping
    function withdraw() public {
        require(
            pendingWithdrawals[msg.sender] > 0,
            "Positive balance required to withdraw"
        );
        uint256 amount = pendingWithdrawals[msg.sender];
        // prevent re-entrancy attacks
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(amount);
    }
}
