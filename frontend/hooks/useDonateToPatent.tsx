"use client";

import { useState } from "react";
import { writeContract, waitForTransactionReceipt } from "wagmi/actions";
import { PatentABI } from "@/abi/PatentABI";
import { config } from "@/lib/wagmi";
import { parseEther } from "viem";

export function useDonateToPatent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const donate = async (patentAddress: string, amountInEth: string) => {
    setIsLoading(true);
    setError(null);
    setTransactionHash(null);

    try {
      // Convert ETH amount to wei
      const value = parseEther(amountInEth);

      // Call the donate function
      const hash = await writeContract(config, {
        address: patentAddress as `0x${string}`,
        abi: PatentABI,
        functionName: "donate",
        value,
      });

      setTransactionHash(hash);

      // Wait for transaction confirmation
      await waitForTransactionReceipt(config, {
        hash,
      });

      return {
        success: true,
        transactionHash: hash,
      };
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to donate";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    donate,
    isLoading,
    error,
    transactionHash,
  };
}
