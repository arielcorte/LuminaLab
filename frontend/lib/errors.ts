// Error handling utilities for smart contract interactions

export function parseContractError(error: any): string {
  // User rejected transaction
  if (error?.message?.includes("User rejected") || error?.code === 4001) {
    return "Transaction was rejected by user";
  }

  // Insufficient funds
  if (error?.message?.includes("insufficient funds")) {
    return "Insufficient funds to complete transaction. Please add more ETH to your wallet.";
  }

  // Gas estimation failed
  if (error?.message?.includes("gas required exceeds")) {
    return "Transaction would fail. Please check your inputs and try again.";
  }

  // Contract reverted with reason
  if (error?.message?.includes("execution reverted:")) {
    const match = error.message.match(/execution reverted: (.+?)"/);
    if (match && match[1]) {
      return `Contract error: ${match[1]}`;
    }
    return "Transaction reverted by smart contract";
  }

  // Network errors
  if (error?.message?.includes("network") || error?.message?.includes("timeout")) {
    return "Network error. Please check your connection and try again.";
  }

  // Wrong network
  if (error?.message?.includes("chain mismatch")) {
    return "Please connect to Base Sepolia network";
  }

  // Generic RPC error
  if (error?.message?.includes("RPC")) {
    return "Network RPC error. Please try again later.";
  }

  // Fallback to error message or generic
  return error?.message || error?.toString() || "An unexpected error occurred";
}

export function getUserFriendlyError(error: any): {
  title: string;
  message: string;
  suggestion?: string;
} {
  const errorMessage = parseContractError(error);

  if (errorMessage.includes("rejected")) {
    return {
      title: "Transaction Cancelled",
      message: errorMessage,
    };
  }

  if (errorMessage.includes("insufficient funds")) {
    return {
      title: "Insufficient Funds",
      message: errorMessage,
      suggestion: "Get test ETH from the Base Sepolia faucet",
    };
  }

  if (errorMessage.includes("network") || errorMessage.includes("RPC")) {
    return {
      title: "Network Error",
      message: errorMessage,
      suggestion: "Try refreshing the page or checking your internet connection",
    };
  }

  if (errorMessage.includes("Base Sepolia")) {
    return {
      title: "Wrong Network",
      message: errorMessage,
      suggestion: "Switch to Base Sepolia in your wallet",
    };
  }

  return {
    title: "Transaction Failed",
    message: errorMessage,
    suggestion: "Please check your inputs and try again",
  };
}
