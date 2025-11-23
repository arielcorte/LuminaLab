// Contract addresses configuration
// Update these addresses after deploying your contracts

export const CONTRACT_ADDRESSES = {
  // PatentFactory contract address on Base Sepolia
  // Deploy the contract and update this address
  FACTORY: process.env.NEXT_PUBLIC_FACTORY_ADDRESS || "0x0000000000000000000000000000000000000000",
} as const;

// Chain configuration
export const CHAIN_CONFIG = {
  chainId: 84532, // Base Sepolia
  name: "Base Sepolia",
  explorerUrl: "https://sepolia.basescan.org",
} as const;
