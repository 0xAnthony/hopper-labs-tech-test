import {getConfig} from "@/config";
import {getBlock, getPublicClient} from '@wagmi/core'
import {useEffect, useState} from "react";
import {VaultContract} from "@/utils/wagmiContractConfig";
import {DepositTable} from "@/components/Vault/DepositTable";
import {useBlockNumber} from "wagmi";
import {CompleteLog} from "@/types/logs";

let config = getConfig()

const fetchRecentDeposits = async (vaultContract, blockNumber: BigInt, logsToFetch = 5, currentLogs = []): Promise<CompleteLog[]> => {
    const publicClient = getPublicClient(config);
    let logsData = await publicClient.getContractEvents({
        ...vaultContract,
        eventName: "Deposit",
        fromBlock: blockNumber - 9950n,
        toBlock: blockNumber
    });
    logsData = logsData.reverse().slice(0, logsToFetch - currentLogs.length);
    currentLogs.push(...logsData);

    const promises = currentLogs.map(async log => {
        const blockData = await getBlock(config, { blockNumber: log.blockNumber });
        return { ...log, blockData };
    });
    const logs = await Promise.all(promises);
    if (logs.length < logsToFetch && blockNumber - 9950n > vaultContract.deployBlock) {
        // Make recursive call if we have less than `logsToFetch` logs and there are more blocks to check
        return fetchRecentDeposits(vaultContract, blockNumber - 9950n, logsToFetch, logs);
    }
    return logs;
};

export const RecentTransactions = () => {
    const {data: currentBlockNumber} = useBlockNumber()
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                // Ready to fetch more than 5 logs if we want to display a bigger history
                let logs = await fetchRecentDeposits(VaultContract, currentBlockNumber, 5);
                setLogs(logs);
            } catch (error) {
                console.error("Error fetching logs:", error);
            }
        };

        if(currentBlockNumber) {
            fetchLogs();
        }
    }, [currentBlockNumber]);

    return (
        <>
            <h2>Recent deposits</h2>
            <DepositTable logs={logs}/>

            <h2>Recent withdrawals</h2>
            <DepositTable logs={logs}/>
        </>
    );
};