"use client"

import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Avatar } from '@heroui/react';
export default function Login(){
   return (
    <div>
        <Wallet>
            <ConnectWallet>
                <Avatar className="h-6 w-6" />
            </ConnectWallet>
            <WalletDropdown>
                <div>Test</div>
                <WalletDropdownDisconnect />
            </WalletDropdown>
        </Wallet>
    </div>
   )
}