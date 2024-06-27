import * as React from 'react'
import { useConnect } from 'wagmi'
import styles from "@/styles/wallet.module.scss";

export function WalletOptions() {
    const { connectors, connect } = useConnect()

    return <div className={styles.walletContainer}>

        {connectors.length ?
            connectors.map((connector) => (
                <button key={connector.uid} onClick={() => connect({ connector })}>
                    {connector.name}
                </button>)):
            (<button disabled>Loading ...</button>)
        }
    </div>
}