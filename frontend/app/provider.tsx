"use client";

import { PrivyProvider } from "@privy-io/react-auth";

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
      {children}
    </PrivyProvider>
  )
}