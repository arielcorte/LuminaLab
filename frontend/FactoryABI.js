// ABI de Factory.sol
export const FactoryABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "address", "name": "patentAddress", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "creator", "type": "address" }
    ],
    "name": "PatentCreated",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "patentLink", "type": "string" },
      { "internalType": "bytes32", "name": "patentHash", "type": "bytes32" },
      { "internalType": "string", "name": "royaltiesSessionLink", "type": "string" }
    ],
    "name": "createPatent",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllPatents",
    "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "allPatents",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }
];
