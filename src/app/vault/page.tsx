'use client'

import styles from "@/app/page.module.scss";
import {useReadContracts} from "wagmi";
import {DECIMALS_6_MULTIPLIER, EXPLORER_URL} from "@/utils/constants";
import {toReadableValue} from "@/utils/numbers";
import {RecentTransactions} from "@/components/Vault/RecentTransactions";
import {shortenAddress} from "@/utils/adresses";
import {contracts} from "@/utils/wagmiContractConfig";

export default function Page() {
    const {data} = useReadContracts({
        contracts: [
            {
                ...contracts.Vault.data,
                functionName: 'totalAssets',
            },
            {
                ...contracts.Vault.data,
                functionName: 'totalSupply',
            }
        ],
    })
    let TVL, totalSupply;
    if (Array.isArray(data)) {
        [TVL, totalSupply] = data.map(x => x.result as bigint);
    }

    return (
        <main className={styles.main}>
            <div className={styles.card}>
                <h1>
                    Vault informations
                    <a className={styles.infoLink} href={`${EXPLORER_URL}/address/${contracts.Vault.data.address}`} target="_blank">
                        ({shortenAddress(contracts.Vault.data.address)})
                    </a>
                </h1>

                <h2>General</h2>
                <div className={styles.generalInformations}>
                    {/* ERC4626 doesn't have Owner attribute. Let's just imagine an API call is made to get this information */}
                    <p><span className={styles.bold}>Owner:</span> E-Corp</p>
                    <p><span className={styles.bold}>Price per share:</span> {!!TVL && !!totalSupply && (TVL / totalSupply).toString()}</p>
                    <p><span className={styles.bold}>TVL:</span> {TVL ? toReadableValue(TVL, DECIMALS_6_MULTIPLIER) : "Loading ..."}</p>
                    <p><span className={styles.bold}>Total shares:</span> {totalSupply ? toReadableValue(totalSupply, DECIMALS_6_MULTIPLIER) : "Loading ..."}</p>
                </div>

                <RecentTransactions/>
            </div>
        </main>
    );
};