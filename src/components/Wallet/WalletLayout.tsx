'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'
import {type State, useAccount, WagmiProvider} from 'wagmi'

import { getConfig } from '@/config'
import {Account} from "@/components/Wallet/Account";
import {WalletOptions} from "@/components/Wallet/WalletOptions";
import styles from "@/styles/dev.module.scss";
import {MintButton} from "@/components/Dev/MintButton";
import Link from "next/link";

function ConnectWallet() {
    const { isConnected } = useAccount()
    if (isConnected) return <Account />
    return <WalletOptions />
}

type Props = {
    children: ReactNode,
    initialState: State | undefined,
}

export function WalletLayout({ children, initialState }: Props) {
    const [config] = useState(() => getConfig())
    const [queryClient] = useState(() => new QueryClient())

    return (
        <WagmiProvider config={config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                <nav>
                    <div>
                        <Link href="/">Deposit</Link>
                        <Link href="/vault">Vault infos</Link>
                    </div>
                    <ConnectWallet />
                </nav>
                {children}
                <MintButton/>
            </QueryClientProvider>
        </WagmiProvider>
    )
}