
# Eureka: Decentralized Patents for Latin America

> ETHGlobal Hackathon Submission

## Demo
[Live Demo](https://your-demo-url)
<!-- ![Screenshot](./screenshot.png) -->

## What is Eureka?
Eureka lets researchers create, fund, and manage patents on-chain, with decentralized storage and transparent donations.

## Quick Start

```sh
# 1. Install dependencies
pip install -r requirements.txt

# 2. Deploy contracts to Sepolia
python deploy.py

# 3. Run frontend
cd frontend
npm install
npm run dev
```

## Features
- Patent creation and management
- Filecoin/IPFS storage for documents
- Transparent donations to researchers
- Factory contract for scalable deployments

## How it works
- Users upload patent PDFs to Filecoin/IPFS
- CIDs and hashes are stored on-chain
- Donors send ETH directly to patent owners

## Contract Addresses
- PatentFactory (Sepolia): `0x...`
- Patent (example): `0x...`

## How to Interact
- Use ABIs in `frontend/PatentABI.js` and `frontend/FactoryABI.js`
- Example: Create a patent via frontend or script

## Team
- Franco Cerino, Ariel Corte, [others]
- Contact: [email/discord]

## License
MIT



ganache-cli

## Contract Deployment

This project includes scripts for deploying the smart contracts using **Python**.

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Node.js (for Solidity compilation)
- Test ETH on Sepolia

### Installation

1. Install dependencies:
  ```bash
  pip install -r requirements.txt
  ```

2. Create a `.env` file:
  ```env
  RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
  PRIVATE_KEY=your_private_key_without_0x
  ```

### Deployment

Run:
```bash
python deploy.py
```
See [README_deploy_contract.md](./README_deploy_contract.md) for advanced options and troubleshooting.

## Frontend Integration

- Use the ABIs in `frontend/PatentABI.js` and `frontend/FactoryABI.js`.
- Example: Connect to the Factory contract and create a new patent.

## Team & Contact

- Project lead: [your name or team]
- Contact: [email or Discord]

-----


## Contract Structure

- **PatentFactory**: Factory contract that creates new instances of the **Patent** contract.
- **Patent**: Individual contract representing a patent, featuring:
  - Owner address
  - Link to the patent PDF file (e.g., IPFS URI)
  - SHA256 hash of the PDF file (for integrity verification)
  - Functions for donations and ownership transfer

-----


## Deployment Information

After each deployment, the resulting information is saved in `deployments/[network].json`, including:

- Deployed contract address
- Transaction hash
- Network and Chain ID
- Deployer account

-----


## Security Notes

- **NEVER** share your **`.env`** file or your private key.
- Use dedicated **test accounts** for development.
- Always **verify contract addresses** before interacting with them.
