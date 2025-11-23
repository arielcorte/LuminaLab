# Smart Contract Integration Guide

This guide explains how the Eureka frontend integrates with the smart contracts.

## Overview

The frontend now fully integrates with the PatentFactory and Patent smart contracts deployed on Base Sepolia. Users can:

- Browse all patents from the blockchain
- View detailed patent information
- Create new patents
- Donate to patents (funds go directly to patent owners)

## Setup Instructions

### 1. Deploy Smart Contracts

First, deploy your smart contracts to Base Sepolia:

```bash
python deploy.py
```

This will output the Factory contract address. Save this address.

### 2. Configure Contract Address

Create a `.env.local` file in the `frontend` directory:

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local` and add your Factory contract address:

```env
NEXT_PUBLIC_FACTORY_ADDRESS=0xYourFactoryAddressHere
```

### 3. Install and Run Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at http://localhost:3000

## Architecture

### Contract Configuration

- **Location**: `frontend/lib/contracts.ts`
- **Purpose**: Stores contract addresses and chain configuration
- **Environment**: Uses `NEXT_PUBLIC_FACTORY_ADDRESS` from environment variables

### ABIs

- **FactoryABI**: `frontend/abi/FactoryABI.js` - Interface for PatentFactory contract
- **PatentABI**: `frontend/abi/PatentABI.js` - Interface for individual Patent contracts

### Hooks

#### Read Hooks

1. **useAllPatents** (`frontend/hooks/useAllPatents.tsx`)
   - Fetches all patent addresses from the Factory contract
   - Used in: Patents listing page

2. **usePatentDetails** (`frontend/hooks/usePatentDetails.tsx`)
   - Fetches details for a specific patent
   - Returns: owner, patentLink, patentHash, royaltiesSessionLink, royaltiesSessionHash, donorsCount
   - Used in: Patent detail page

3. **usePatentDonations** (`frontend/hooks/usePatentDonations.tsx`)
   - Fetches donation information for a patent
   - Used in: Dashboard pages

#### Write Hooks

1. **useCreatePatent** (`frontend/hooks/useCreatePatent.tsx`)
   - Creates a new patent contract via the Factory
   - Parameters: patentLink, patentHash, royaltiesSessionLink, royaltiesSessionHash
   - Returns: transaction hash and new patent address
   - Used in: Create patent form

2. **useDonateToPatent** (`frontend/hooks/useDonateToPatent.tsx`)
   - Sends a donation to a patent (funds go directly to owner)
   - Parameters: patent address, amount in ETH
   - Returns: transaction hash
   - Used in: Patent detail page

### Pages

#### `/patents` - Patents Listing
- Fetches all patent addresses from the Factory contract
- Displays them in a grid of cards
- Shows a "Create Patent" button for authenticated users

#### `/patents/[id]` - Patent Detail
- Fetches patent details using the contract address as ID
- Displays patent information (owner, links, hashes, donor count)
- Provides a donation interface with amount input
- Requires authentication to view

#### Components

1. **CreatePatentForm** (`frontend/components/patents/CreatePatent.tsx`)
   - Form for creating new patents
   - Validates inputs
   - Calls useCreatePatent hook
   - Redirects to new patent page on success

2. **OpenCreatePatentInline** (`frontend/components/patents/OpenCreatePatentInline.tsx`)
   - Toggle button to show/hide create patent form

## Wagmi Configuration

- **Location**: `frontend/lib/wagmi.ts`
- **Chain**: Base Sepolia (chainId: 84532)
- **Provider**: Public RPC endpoint via HTTP transport
- **Wallet**: Privy for authentication and wallet management

## Data Flow

### Creating a Patent

1. User fills out form with patent details
2. Form validates inputs
3. `useCreatePatent` hook calls Factory contract's `createPatent` function
4. Transaction is sent to blockchain
5. Wait for confirmation
6. Extract new patent address from transaction receipt
7. Redirect user to new patent page

### Viewing Patents

1. Page loads and calls `useAllPatents(FACTORY_ADDRESS)`
2. Hook calls Factory's `getAllPatents()` function
3. Returns array of patent contract addresses
4. For each address, `PatentCard` can optionally fetch more details

### Donating to a Patent

1. User enters donation amount in ETH
2. Clicks "Donate" button
3. `useDonateToPatent` hook calls Patent contract's `donate()` function with value
4. Transaction is sent with ETH amount
5. Funds are immediately forwarded to patent owner
6. Donation is recorded on-chain
7. Success message shows transaction hash

## Smart Contract Functions Used

### PatentFactory

- `createPatent(string patentLink, bytes32 patentHash, string royaltiesSessionLink, string royaltiesSessionHash)` - Creates new patent
- `getAllPatents()` - Returns all patent addresses

### Patent

- `owner()` - Returns patent owner address
- `patentLink()` - Returns IPFS/Filecoin link
- `patentHash()` - Returns document hash
- `royaltiesSessionLink()` - Returns royalties session link
- `royaltiesSessionHash()` - Returns royalties session hash
- `getDonorsCount()` - Returns number of unique donors
- `donate()` payable - Accepts donation and forwards to owner
- `donations(address)` - Returns donation amount from specific donor

## Testing

### Prerequisites

- MetaMask or compatible wallet
- Base Sepolia testnet configured
- Test ETH on Base Sepolia (get from faucet)

### Test Flow

1. Connect wallet using Privy
2. Browse to `/patents`
3. Click "Create New Patent"
4. Fill in test data (use IPFS links if available)
5. Submit transaction and confirm in wallet
6. Wait for confirmation
7. View new patent in list
8. Click on patent to view details
9. Try donating test ETH
10. Confirm donation transaction

## Troubleshooting

### "No patents found"
- Ensure Factory contract address is correctly set in `.env.local`
- Check that contracts are deployed to Base Sepolia
- Verify you're connected to the correct network

### Transaction Failures
- Ensure sufficient ETH for gas fees
- Check that wallet is connected to Base Sepolia
- Verify contract address is correct

### Read Operations Failing
- Check RPC endpoint is working
- Ensure ABIs match deployed contracts
- Verify contract addresses are correct

## Environment Variables

Required:
- `NEXT_PUBLIC_FACTORY_ADDRESS` - Factory contract address on Base Sepolia

Optional (from Privy):
- Privy App ID and Client ID are hardcoded in `provider.tsx`
- For production, move these to environment variables

## Network Configuration

The app is configured for Base Sepolia:
- Chain ID: 84532
- RPC: Public endpoint via Wagmi
- Explorer: https://sepolia.basescan.org

To change networks, update `frontend/lib/wagmi.ts` and `frontend/lib/contracts.ts`.

## Security Considerations

1. All transactions require user approval in wallet
2. Donations go directly to patent owners (no escrow)
3. Patent hashes allow verification of document integrity
4. Contract addresses are validated before transactions
5. Private keys never touch the frontend (managed by Privy/MetaMask)

## Future Enhancements

- Add IPFS upload directly from frontend
- Implement transfer ownership functionality
- Add update royalties session link feature
- Display donation history and amounts
- Add search and filter for patents
- Implement pagination for large patent lists
- Add ENS name resolution for addresses
- Show transaction history
- Add notifications for successful transactions
