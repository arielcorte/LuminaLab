// Utility functions for formatting blockchain data

/**
 * Truncate an Ethereum address for display
 * @param address - Full Ethereum address
 * @param startChars - Number of characters to show at start (default: 6)
 * @param endChars - Number of characters to show at end (default: 4)
 */
export function truncateAddress(address: string, startChars = 6, endChars = 4): string {
  if (!address) return "";
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Truncate a hash for display
 * @param hash - Full hash string
 * @param chars - Number of characters to show at start (default: 8)
 */
export function truncateHash(hash: string, chars = 8): string {
  if (!hash) return "";
  if (hash.length <= chars + 3) return hash;
  return `${hash.slice(0, chars)}...`;
}

/**
 * Get blockchain explorer URL for an address
 * @param address - Ethereum address
 * @param chainId - Chain ID (default: 84532 for Base Sepolia)
 */
export function getExplorerAddressUrl(address: string, chainId = 84532): string {
  const explorers: Record<number, string> = {
    84532: "https://sepolia.basescan.org",
    8453: "https://basescan.org",
  };

  const baseUrl = explorers[chainId] || explorers[84532];
  return `${baseUrl}/address/${address}`;
}

/**
 * Get blockchain explorer URL for a transaction
 * @param txHash - Transaction hash
 * @param chainId - Chain ID (default: 84532 for Base Sepolia)
 */
export function getExplorerTxUrl(txHash: string, chainId = 84532): string {
  const explorers: Record<number, string> = {
    84532: "https://sepolia.basescan.org",
    8453: "https://basescan.org",
  };

  const baseUrl = explorers[chainId] || explorers[84532];
  return `${baseUrl}/tx/${txHash}`;
}

/**
 * Format ETH amount for display
 * @param amount - Amount in ETH as string or number
 * @param decimals - Number of decimal places (default: 4)
 */
export function formatEth(amount: string | number, decimals = 4): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return num.toFixed(decimals);
}

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate hex hash format (for bytes32)
 */
export function isValidHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
}
