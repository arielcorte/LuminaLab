// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Patent {
    address public owner;
    string public patentLink;        // URL al PDF (por ejemplo Supabase)
    bytes32 public patentHash;       // Hash SHA256 del PDF
    uint256 public balance;

    event Deposit(address indexed from, uint256 amount);
    event Withdraw(address indexed to, uint256 amount);
    event OwnershipTransferred(address indexed from, address indexed to);

    constructor(
        address _owner,
        string memory _patentLink,
        bytes32 _patentHash
    ) {
        owner = _owner;
        patentLink = _patentLink;
        patentHash = _patentHash;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // Cualquiera puede depositar fondos en beneficio del propietario
    function deposit() external payable {
        require(msg.value > 0, "No zero value");
        balance += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    // El propietario retira todo
    function withdraw() external onlyOwner {
        uint256 amount = balance;
        balance = 0;
        payable(owner).transfer(amount);
        emit Withdraw(owner, amount);
    }

    // Cambio de propietario
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
