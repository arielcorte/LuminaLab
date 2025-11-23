"use client";

import { useState } from "react";
import { writeContract, waitForTransactionReceipt } from "wagmi/actions";
import { FactoryABI } from "@/abi/FactoryABI";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import { config } from "@/lib/wagmi";
import { parseEther } from "viem";

export interface CreatePatentParams {
  patentLink: string;
  patentHash: string;
  royaltiesSessionLink: string;
  royaltiesSessionHash: string;
}

export function useCreatePatent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patentAddress, setPatentAddress] = useState<string | null>(null);

  const createPatent = async (params: CreatePatentParams) => {
    setIsLoading(true);
    setError(null);
    setPatentAddress(null);

    try {
      // Convert hash string to bytes32 if needed
      const hashBytes32 = params.patentHash.startsWith("0x")
        ? params.patentHash
        : `0x${params.patentHash}`;

      // Call the contract
      const hash = await writeContract(config, {
        address: CONTRACT_ADDRESSES.FACTORY as `0x${string}`,
        abi: FactoryABI,
        functionName: "createPatent",
        args: [
          params.patentLink,
          hashBytes32 as `0x${string}`,
          params.royaltiesSessionLink,
          params.royaltiesSessionHash,
        ],
      });

      // Wait for transaction confirmation
      const receipt = await waitForTransactionReceipt(config, {
        hash,
      });

      // Parse the PatentCreated event to get the new patent address
      const patentCreatedEvent = receipt.logs.find(
        (log) => log.topics[0] === "0x..." // You'll need to calculate the event signature hash
      );

      if (patentCreatedEvent && patentCreatedEvent.topics[1]) {
        // The patent address is in the first indexed parameter
        const address = `0x${patentCreatedEvent.topics[1].slice(-40)}`;
        setPatentAddress(address);
      }

      return {
        success: true,
        transactionHash: hash,
        patentAddress,
      };
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to create patent";
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
    createPatent,
    isLoading,
    error,
    patentAddress,
  };
}
