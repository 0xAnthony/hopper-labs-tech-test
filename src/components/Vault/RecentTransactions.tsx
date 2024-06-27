import {getConfig} from "@/config";
import {getBlock, getPublicClient} from '@wagmi/core'
import {useEffect, useState} from "react";
import {contracts} from "@/utils/wagmiContractConfig";
import {DepositTable} from "@/components/Vault/DepositTable";
import {useBlockNumber} from "wagmi";
import {CompleteLog} from "@/types/logs";

let config = getConfig()
let blockRange: bigint = 9950n;

const fetchRecentDeposits = async (contractName: string, blockNumber: bigint, logsToFetch: number = 5, currentLogs: CompleteLog[] = []): Promise<CompleteLog[]> => {
    const publicClient = getPublicClient(config);
    let logsData = await publicClient.getContractEvents({
        ...contracts[contractName].data,
        eventName: "Deposit",
        fromBlock: blockNumber - blockRange,
        toBlock: blockNumber
    });
    logsData = logsData.reverse().slice(0, logsToFetch - currentLogs.length);
    currentLogs.push(...logsData);

    const promises = currentLogs.map(async log => {
        const blockData = await getBlock(config, { blockNumber: log.blockNumber! });
        return { ...log, blockData };
    });
    const logs = await Promise.all(promises);
    if (logs.length < logsToFetch && blockNumber - blockRange > contracts[contractName].deployBlock) {
        // Make recursive call if we have less than `logsToFetch` logs and there are more blocks to check
        return fetchRecentDeposits(contractName, blockNumber - blockRange, logsToFetch, logs);
    }
    return logs;
};

export const RecentTransactions = () => {
    const {data: currentBlockNumber} = useBlockNumber()
    const [logs, setLogs] = useState<CompleteLog[]>([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                if(currentBlockNumber) {
                    // Ready to fetch more than 5 logs if we want to display a bigger history
                    let logs = await fetchRecentDeposits("Vault", currentBlockNumber, 5);
                    setLogs(logs);
                }
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