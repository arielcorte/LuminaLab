"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "viem/chains";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return (
    <OnchainKitProvider
            apiKey={process.env.ONCHAINKIT_API_KEY}
            chain={base}
            config={{
              appearance: {
                name: 'Eureka',        // Displayed in modal header
                logo: 'https://your-logo.com',// Displayed in modal header
                mode: 'auto',                 // 'light' | 'dark' | 'auto'
                theme: 'default',             // 'default' or custom theme
              },
              // configure the wallet modal below
              wallet: {
                display: 'modal',
                termsUrl: 'https://...',
                privacyUrl: 'https://...',
              },
            }}
            >
            {children}
            </OnchainKitProvider>
  )
}