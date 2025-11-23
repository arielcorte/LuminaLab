"use client";

import { http, createConfig } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { createClient, createPublicClient } from "viem";

// --- Public client (lectura) ---
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

// --- Wagmi config ---
export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});
