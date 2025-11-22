# Eureka
A platform that facilitates patent creation, use and safekeeping in latin america.



## Contract Deployment

This project includes scripts for deploying the smart contracts using **Python**.

### Prerequisites

  * Python 3.8 or higher
  * pip (Python package manager)

### Installation

1.  Install the required dependencies:

<!-- end list -->

```bash
pip install -r requirements.txt
```

2.  Create a **`.env`** file in the project's root directory:

<!-- end list -->

```env
RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=your_private_key_without_0x
```

### Deployment

#### Option 1: Local Network

1.  Start a local development network (Ganache, Hardhat node, or any local node):

<!-- end list -->

```bash
# Example with Ganache CLI
ganache-cli

# Or with Hardhat
npx hardhat node
```

2.  In a separate terminal, execute the deployment script:

<!-- end list -->

```bash
python deploy.py
```

#### Option 2: Sepolia Testnet

1.  Configure your **`.env`** file with:

<!-- end list -->

```env
RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_private_key
```

2.  Ensure your account has test ETH on Sepolia.

3.  Execute:

<!-- end list -->

```bash
python deploy.py
```

#### Option 3: Mainnet

**WARNING**: Only deploy to Mainnet if you are completely sure and ready.

1.  Configure your **`.env`** file with the Mainnet RPC URL.
2.  Verify that you have sufficient ETH for gas fees.
3.  Execute:

<!-- end list -->

```bash
python deploy.py
```

-----

## Contract Structure

  * **PatentFactory**: A **factory contract** that creates new instances of the **Patent** contract.
  * **Patent**: An **individual contract** representing a patent, featuring:
      * Owner address
      * Link to the patent PDF file (e.g., IPFS URI)
      * SHA256 hash of the PDF file (for integrity verification)
      * Functions for depositing and withdrawing funds

-----

## Deployment Information

After each deployment, the resulting information is saved in `deployments/[network].json`, including:

  * Deployed contract address
  * Transaction hash
  * Network and Chain ID
  * Deployer account

-----

## Security Notes

  * **NEVER** share your **`.env`** file or your private key.
  * Use dedicated **test accounts** for development.
  * Always **verify contract addresses** before interacting with them.
