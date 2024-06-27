import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import {shortenAddress} from "@/utils/adresses";
import styles from "@/styles/wallet.module.scss";

export function Account() {
    const { address } = useAccount()
    const { disconnect } = useDisconnect()
    const { data: ensName } = useEnsName({ address })
    const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

    return (
        <div className={styles.walletContainer}>
            {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
            {address && <div>{ensName ? `${ensName} (${shortenAddress(address)})` : shortenAddress(address)}</div>}
            <button onClick={() => disconnect()}>Disconnect</button>
        </div>
    )
}