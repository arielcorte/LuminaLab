// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Patent {
    address public owner;

    string public patentLink;            // link al PDF
    string public royaltiesSessionLink;  // link a sesión de regalías
    bytes32 public patentHash;

    // Donante → total donado
    mapping(address => uint256) public donations;

    // Lista de donantes únicos
    address[] public donors;

    event Donation(address indexed donor, uint256 amount);
    event OwnershipTransferred(address indexed from, address indexed to);
    event RoyaltiesSessionLinkUpdated(string newLink);

    constructor(
        address _owner,
        string memory _patentLink,
        bytes32 _patentHash,
        string memory _royaltiesSessionLink
    ) {
        owner = _owner;
        patentLink = _patentLink;
        patentHash = _patentHash;
        royaltiesSessionLink = _royaltiesSessionLink;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // Donación: la plata NO queda en el SC, va directo al owner
    function donate() external payable {
        require(msg.value > 0, "No zero value");

        // Enviar directamente al owner
        (bool sent, ) = payable(owner).call{value: msg.value}();
        require(sent, "Transfer failed");

        // Registrar la donación
        if (donations[msg.sender] == 0) {
            donors.push(msg.sender);
        }
        donations[msg.sender] += msg.value;

        emit Donation(msg.sender, msg.value);
    }

    // Actualizar link a sesión de regalías
    function updateRoyaltiesSessionLink(string memory newLink) external onlyOwner {
        royaltiesSessionLink = newLink;
        emit RoyaltiesSessionLinkUpdated(newLink);
    }

    // Cambiar dueño
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    // Obtener cantidad total de donantes
    function getDonorsCount() external view returns (uint256) {
        return donors.length;
    }
}
