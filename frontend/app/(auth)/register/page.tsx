"use client"

import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Avatar, Name, Identity, Address, EthBalance } from "@coinbase/onchainkit/identity"
export default function Login(){
   return (
    <div>
        <Wallet>
        <ConnectWallet>
            <Avatar className="h-6 w-6" />
            <Name />
        </ConnectWallet>
        <WalletDropdown>
            <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address />
            <EthBalance />
            </Identity>
            <WalletDropdownDisconnect />
        </WalletDropdown>
        </Wallet>
    </div>
   )
}