
# Eureka: Decentralized Patent Funding Platform

> Fund breakthrough innovations through transparent blockchain-based donations and micro-investments

## 🚀 Quick Start

**New here?** Check out [QUICK_START.md](./QUICK_START.md) for a 5-minute setup guide!

```sh
# 1. Deploy contracts
pip install -r requirements.txt
python deploy.py

# 2. Run frontend
cd frontend
npm install
echo "NEXT_PUBLIC_FACTORY_ADDRESS=your_factory_address" > .env.local
npm run dev
```

Visit http://localhost:3000

## ✨ What is Eureka?

Eureka is a decentralized platform that connects researchers with supporters through blockchain technology. Researchers can register patents on-chain with verifiable document hashes, while supporters can directly fund promising innovations through transparent donations.

### Key Features

🔐 **Blockchain-Verified Patents**
- Factory pattern for scalable patent creation
- IPFS/Filecoin document storage
- SHA256 hash verification for document integrity
- Immutable ownership records

💸 **Direct Donations**
- Funds go directly to patent owners (no intermediaries)
- Transparent on-chain donation tracking
- Support for multiple donors per patent
- Real-time donation statistics

🎨 **Professional UX**
- Real-time transaction status tracking
- Toast notifications for all actions
- Form validation with inline errors
- Mobile-responsive design
- One-click address copying
- Direct blockchain explorer links

🔗 **Web3 Integration**
- Privy wallet connection
- Wagmi for blockchain interactions
- Base Sepolia testnet support
- MetaMask compatibility

## 📱 User Features

### For Researchers

1. **Create Patents**
   - Upload documents to IPFS/Filecoin
   - Register patent on-chain with document hash
   - Include royalties session information
   - Get unique contract address for your patent

2. **Manage Patents**
   - Receive donations directly to wallet
   - Update royalties session links
   - Transfer patent ownership
   - Track unique donor count

### For Supporters

1. **Discover Patents**
   - Browse all registered patents
   - View patent details and documents
   - See donation statistics
   - Verify document integrity

2. **Support Innovation**
   - Donate any amount in ETH
   - Quick-select common amounts
   - Real-time transaction tracking
   - Donation history on-chain

## 🏗️ Architecture

### Smart Contracts (Base Sepolia)

**PatentFactory.sol**
- Creates new Patent contract instances
- Maintains registry of all patents
- Emits creation events

**Patent.sol**
- Stores patent metadata
- Handles donations (forwards to owner)
- Tracks donors and amounts
- Manages ownership

### Frontend (Next.js 14 + TypeScript)

- **Pages**: Next.js App Router
- **Styling**: TailwindCSS
- **Blockchain**: Wagmi v2 + Viem
- **Wallet**: Privy
- **Notifications**: Sonner (toast)
- **UI Components**: shadcn/ui

## 📖 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get started in 5 minutes
- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Complete technical integration guide
- **[UX_IMPROVEMENTS.md](./UX_IMPROVEMENTS.md)** - Detailed UX features documentation
- **[README_deploy_contract.md](./README_deploy_contract.md)** - Advanced deployment options

## 🎯 Use Cases

### Academic Research
Universities and researchers can register breakthrough discoveries and receive community funding for further development.

### Open Innovation
Independent inventors can share patents publicly while maintaining ownership and receiving support from the community.

### Transparency
All donations are recorded on-chain, providing complete transparency to donors about where their funds go.

## 🛠️ Tech Stack

**Smart Contracts**
- Solidity ^0.8.20
- Factory pattern
- Direct payment forwarding

**Frontend**
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Wagmi v2
- Viem
- Privy
- Sonner

**Blockchain**
- Base Sepolia (testnet)
- Base Mainnet (production ready)

## 📦 Project Structure

```
eureka/
├── contracts/           # Solidity smart contracts
├── frontend/
│   ├── app/            # Next.js pages
│   ├── components/     # React components
│   │   ├── blockchain/ # Blockchain UI components
│   │   └── patents/    # Patent-specific components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities and config
│   └── abi/            # Contract ABIs
├── deploy.py           # Python deployment script
└── docs/               # Documentation
```

## 🌐 Network Information

**Base Sepolia (Testnet)**
- Chain ID: 84532
- RPC: https://sepolia.base.org
- Explorer: https://sepolia.basescan.org
- Faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

**Base Mainnet (Production)**
- Chain ID: 8453
- RPC: https://mainnet.base.org
- Explorer: https://basescan.org

## 🎬 Demo

### Create a Patent
1. Connect wallet with Privy
2. Fill in patent details (IPFS link, hash, royalties info)
3. Submit transaction
4. Receive unique patent contract address

### Donate to a Patent
1. Browse patents list
2. Select a patent to view details
3. Enter donation amount or use quick buttons
4. Confirm transaction in wallet
5. See success notification

## Team

- Franco Cerino
- Ariel Corte

## License

MIT

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
