"use client";

import { config } from "@/lib/wagmi";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "wagmi";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return (
    <PrivyProvider
      appId="cmiauniuh007pie0chyyg8tro"
      clientId="client-WY6TLAGRv93VzQQkKXyLnS7QmBrAHaPrQCoykuHZxXmDi"
      config={{
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets'
          }
        }
      }}
    >
      <WagmiProvider config={config}>
        {children}
      </WagmiProvider>
    </PrivyProvider>
  )
}