# Eureka - Quick Start Guide

Get your decentralized patent platform up and running in minutes!

## Prerequisites

- Python 3.8+
- Node.js 16+
- MetaMask or compatible wallet
- Base Sepolia testnet ETH ([Get from faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet))

## 1. Deploy Smart Contracts

```bash
# Install Python dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOL
RPC_URL=https://sepolia.base.org
PRIVATE_KEY=your_private_key_without_0x
EOL

# Deploy contracts
python deploy.py
```

**Important**: Save the Factory contract address from the output!

## 2. Configure Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cat > .env.local << EOL
NEXT_PUBLIC_FACTORY_ADDRESS=YOUR_FACTORY_ADDRESS_HERE
EOL
```

Replace `YOUR_FACTORY_ADDRESS_HERE` with the address from step 1.

## 3. Run the App

```bash
# Start development server
npm run dev
```

Visit http://localhost:3000

## 4. Test the Features

### Create a Patent

1. Click "Explore Patents"
2. Connect your wallet with Privy
3. Click "Create New Patent"
4. Fill in the form:
   - **Patent Link**: `ipfs://QmTest...` or any URL
   - **Patent Hash**: `0x` followed by 64 hex characters
   - **Royalties Links**: Any valid URLs/hashes
5. Submit and confirm in wallet
6. Watch the transaction status
7. Get redirected to your new patent

### Donate to a Patent

1. Browse patents list
2. Click on any patent
3. Enter donation amount or click quick button
4. Click "Donate Now"
5. Confirm in wallet
6. See success notification

## Common Issues

### "No patents found"
- Make sure `NEXT_PUBLIC_FACTORY_ADDRESS` is set correctly
- Verify you deployed contracts successfully
- Check you're on Base Sepolia network

### "Insufficient funds"
- Get test ETH from [Base Sepolia faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
- Need 0.01+ ETH for gas fees

### "Wrong network"
- Switch to Base Sepolia in your wallet
- Network ID: 84532

### Transaction fails
- Check you have enough ETH
- Verify input formats (especially hash format)
- Look at error message suggestions

## Features Overview

### Smart Contracts
- ✅ Factory pattern for creating patents
- ✅ Individual patent contracts
- ✅ Direct donations to owners
- ✅ Donation tracking
- ✅ Document hash verification

### Frontend
- ✅ Wallet connection (Privy)
- ✅ Create patents on-chain
- ✅ Browse all patents
- ✅ View patent details
- ✅ Donate to patents
- ✅ Real-time transaction status
- ✅ Toast notifications
- ✅ Form validation
- ✅ Error handling
- ✅ Mobile responsive

## Architecture

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
└────────┬────────┘
         │
    ┌────▼─────┐
    │  Wagmi   │  ← Blockchain interaction
    │  Privy   │  ← Wallet management
    └────┬─────┘
         │
┌────────▼───────────┐
│  Base Sepolia      │
│  ┌──────────────┐  │
│  │ Factory      │  │  ← Creates patents
│  └──────┬───────┘  │
│         │          │
│    ┌────▼────┐     │
│    │ Patent  │     │  ← Individual patents
│    │ Patent  │     │
│    │ Patent  │     │
│    └─────────┘     │
└────────────────────┘
```

## File Structure

```
eureka/
├── contracts/                # Smart contracts
│   ├── Factory.sol          # Patent factory
│   └── Patent.sol           # Patent template
├── frontend/
│   ├── app/                 # Pages
│   │   ├── layout.tsx       # Root layout with toasts
│   │   ├── page.tsx         # Home page
│   │   └── (public)/patents/
│   │       ├── page.tsx     # Patents list
│   │       └── [id]/page.tsx # Patent details
│   ├── components/
│   │   ├── blockchain/      # Blockchain UI components
│   │   │   ├── AddressDisplay.tsx
│   │   │   └── TransactionStatus.tsx
│   │   └── patents/         # Patent components
│   │       └── CreatePatent.tsx
│   ├── hooks/               # React hooks
│   │   ├── useAllPatents.tsx
│   │   ├── usePatentDetails.tsx
│   │   ├── useCreatePatent.tsx
│   │   └── useDonateToPatent.tsx
│   ├── lib/                 # Utilities
│   │   ├── wagmi.ts        # Blockchain config
│   │   ├── contracts.ts    # Contract addresses
│   │   ├── format.ts       # Formatting utilities
│   │   └── errors.ts       # Error handling
│   └── abi/                 # Contract ABIs
│       ├── FactoryABI.js
│       └── PatentABI.js
├── deploy.py                # Deployment script
└── README.md
```

## Network Info

**Base Sepolia**
- Chain ID: 84532
- RPC: https://sepolia.base.org
- Explorer: https://sepolia.basescan.org
- Faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

## Next Steps

1. **Deploy to Production**
   - Use Base Mainnet (Chain ID: 8453)
   - Update RPC URLs
   - Use production private key securely

2. **Add IPFS Integration**
   - Upload PDFs directly from frontend
   - Calculate hashes automatically
   - Use services like Pinata or web3.storage

3. **Enhance Features**
   - Add patent search/filter
   - Show donation history
   - Implement ownership transfers
   - Add royalty distributions

4. **Improve Security**
   - Add rate limiting
   - Implement access controls
   - Add IPFS content verification
   - Audit smart contracts

## Support

- **Documentation**: See `INTEGRATION_GUIDE.md` for detailed integration docs
- **UX Details**: See `UX_IMPROVEMENTS.md` for UX features
- **Issues**: Check console for error messages
- **Blockchain Explorer**: View transactions on [BaseScan](https://sepolia.basescan.org)

## Environment Variables Reference

### Backend (.env)
```bash
RPC_URL=https://sepolia.base.org
PRIVATE_KEY=your_private_key
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_FACTORY_ADDRESS=0xYourFactoryAddress
```

## Testing Checklist

- [ ] Deploy contracts successfully
- [ ] Frontend connects to correct network
- [ ] Can browse patents list
- [ ] Can view patent details
- [ ] Can create new patent
- [ ] Transaction status shows correctly
- [ ] Toast notifications appear
- [ ] Can donate to patent
- [ ] Addresses have copy/explorer links
- [ ] Form validation works
- [ ] Error messages are helpful
- [ ] Mobile layout works

## Development Tips

1. **Use test data**: Create patents with placeholder IPFS links for testing
2. **Check browser console**: All blockchain interactions log to console
3. **Monitor wallet**: Keep MetaMask open to see transaction requests
4. **Use small amounts**: Test donations with 0.001 ETH
5. **Clear cache**: If issues persist, clear browser cache and reload

## Production Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel

# Add environment variable in Vercel dashboard
# NEXT_PUBLIC_FACTORY_ADDRESS=0x...
```

### Other Options
- Netlify
- AWS Amplify
- Railway
- Render

## Success!

You now have a fully functional decentralized patent platform with:
- ✅ On-chain patent creation
- ✅ Transparent donations
- ✅ Real-time transaction tracking
- ✅ Professional UX
- ✅ Error handling
- ✅ Mobile support

Start creating and funding breakthrough innovations!
