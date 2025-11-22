// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Patent.sol";

contract PatentFactory {
    address[] public allPatents;

    event PatentCreated(address patentAddress, address indexed creator);

    function createPatent(
        string memory patentLink,
        bytes32 patentHash
    ) external returns (address) {
        Patent patent = new Patent(msg.sender, patentLink, patentHash);
        address patentAddr = address(patent);
        allPatents.push(patentAddr);

        emit PatentCreated(patentAddr, msg.sender);
        return patentAddr;
    }

    function getAllPatents() external view returns (address[] memory) {
        return allPatents;
    }
}
