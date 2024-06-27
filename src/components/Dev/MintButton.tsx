import styles from "@/styles/dev.module.scss";
import {DECIMALS_6_MULTIPLIER} from "@/utils/constants";
import {useWaitForTransactionReceipt, useWriteContract} from "wagmi";
import {useEffect} from "react";
import {UsdcContract} from "@/utils/wagmiContractConfig";

export const MintButton = () => {
    const { data: hash, error, writeContract } = useWriteContract()

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

    const mintUSDC = async () => {
        console.log("MINTING 1_000_000 USDC ...")
        writeContract({
            ...UsdcContract,
            functionName: 'mint',
            args: ["0xc28c67FB2Ba206EEC354609356068a0D9CA99e0f", 1000000n * DECIMALS_6_MULTIPLIER],
        })
    }

    useEffect(() => {
        if (hash){
            console.log(`[DEV] Hash : ${hash}`)
        }
    }, [hash]);

    useEffect(() => {
        if (isConfirmed){
            console.log(`[DEV] Success : ${isConfirmed}`)
        }
    }, [isConfirmed]);

    useEffect(() => {
        if (error){
            console.log(`[DEV] ERROR :`, error)
        }
    }, [error]);

    return (<button className={styles.mintUsdc} onClick={mintUSDC}>MINT USDC (dev purpose)</button>);
};