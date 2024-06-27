'use client'

import styles from "./page.module.scss";
import {useAccount, useReadContracts, useWaitForTransactionReceipt, useWriteContract} from "wagmi";
import {UsdcContract, VaultContract} from "@/utils/wagmiContractConfig";
import {useEffect, useState} from "react";
import {fromReadableValue, toReadableValue} from "@/utils/numbers";
import {DECIMALS_6, DECIMALS_6_MULTIPLIER} from "@/utils/constants";
import Link from "next/link";
import toast from "react-hot-toast";
import {DepositStepper} from "@/components/DepositStepper";

export default function Home() {
    const {address} = useAccount()
    const [currentStep, setCurrentStep] = useState(0);
    const [stepLoading, setStepLoading] = useState(false);
    const [inputValue, setInputValue] = useState("0");
    const [sentValue, setSentValue] = useState(0n);
    const [balance, setBalance] = useState(0n);
    const [shares, setShares] = useState(0n);
    const [allowance, setAllowance] = useState(0n);

    const setMaximumInput = () => {
        setInputValue(toReadableValue(balance, DECIMALS_6_MULTIPLIER));
    }

    // Allowance
    const {
        data: approvalHash,
        writeContract: approvalWrite
    } = useWriteContract()
    const {isLoading: isApprovalPending ,isSuccess: isApprovalSuccessful} = useWaitForTransactionReceipt({
        hash: approvalHash,
    })
    const increaseAllowance = () => {
        toast('Requesting approval', {id: "approval", icon: "➡️"});
        setSentValue(fromReadableValue(inputValue, DECIMALS_6))
        approvalWrite({
            ...UsdcContract,
            functionName: 'approve',
            args: [VaultContract.address, fromReadableValue(inputValue, DECIMALS_6)],
        })
    }
    useEffect(() => {
        if (isApprovalPending) {
            setStepLoading(true)
            toast.loading('Waiting for approval...', {id: "approval"});
        }
    }, [isApprovalPending]);
    useEffect(() => {
        if (isApprovalSuccessful) {
            toast.success('Approval succeeded !', {id: "approval"})
            setAllowance(sentValue);
            setStepLoading(false)
            setCurrentStep(currentStep + 1)
            deposit()
        }
    }, [isApprovalSuccessful]);

    // Deposit
    const {
        data: depositHash,
        writeContract: depositWrite
    } = useWriteContract()
    const {isLoading: isDepositPending ,isSuccess: isDepositSuccessful} = useWaitForTransactionReceipt({
        hash: depositHash,
    })
    const deposit = () => {
        toast('Requesting deposit', {id: "deposit", icon: "➡️"});
        depositWrite({
            ...VaultContract,
            functionName: 'deposit',
            args: [sentValue, address],
        })
    }
    useEffect(() => {
        if (isDepositPending) {
            setStepLoading(true)
            toast.loading('Waiting for deposit...', {id: "deposit"});
        }
    }, [isDepositPending]);
    useEffect(() => {
        if (isDepositSuccessful) {
            toast.success('Deposit succeeded !', {id: "deposit"})
            setBalance(balance - sentValue);
            // Note : This works because price is 1USDC for 1 share. We'd need to setup a quick math here if price was variable
            setShares(shares + sentValue);
            setAllowance(allowance - sentValue);
            setStepLoading(false)
            setCurrentStep(currentStep + 1)
            setSentValue(0n);
            setTimeout(() => {
                setCurrentStep(0)
            }, 5000)
        }
    }, [isDepositSuccessful]);

    // Data fetching
    const {data} = useReadContracts({
        contracts: [
            {
                ...UsdcContract,
                functionName: 'balanceOf',
                args: [address],
            },
            {
                ...VaultContract,
                functionName: 'balanceOf',
                args: [address]
            },
            {
                ...UsdcContract,
                functionName: 'allowance',
                args: [address, VaultContract.address]
            },
        ],
    })
    useEffect(() => {
        if (Array.isArray(data)) {
            const [_balance, _shares, _allowance] = data.map(x => x.result);
            setBalance(_balance);
            setShares(_shares);
            setAllowance(_allowance);
        }
    }, [data]);

    return (
        <main className={styles.main}>
            <div className={styles.card}>
                <h1>INTERACT WITH VAULT <Link href="/vault" className={styles.infoLink}>(Infos)</Link></h1>
                <div>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            style={{width: "100%"}}
                            disabled={!address}
                        />
                        <button onClick={setMaximumInput} disabled={!address}>MAX</button>
                    </div>
                    <p className={styles.currentBalance}>Current balance
                        : {balance ? toReadableValue(balance, DECIMALS_6_MULTIPLIER) : '0'} USDC</p>
                    <p className={styles.currentBalance}>Current shares
                        : {shares ? toReadableValue(shares, DECIMALS_6_MULTIPLIER) : '0'}</p>
                </div>

                {
                    balance >= fromReadableValue(inputValue, DECIMALS_6) ?
                    allowance < fromReadableValue(inputValue, DECIMALS_6) || fromReadableValue(inputValue, DECIMALS_6) == 0 ?
                        <button onClick={increaseAllowance}
                                disabled={fromReadableValue(inputValue, DECIMALS_6) > balance || isApprovalPending}>{isApprovalPending ? 'Confirming...' : 'Approve (1/2)'}</button> :
                        <button onClick={deposit}
                                disabled={fromReadableValue(inputValue, DECIMALS_6) > balance || isApprovalPending}>{isApprovalPending ? 'Confirming...' : 'Deposit (2/2)'}</button> :
                    <button disabled={true}>{address ? "Not enough USDC" : "Wallet not connected"}</button>
                }

                {address && <DepositStepper currentStep={currentStep} stepLoading={stepLoading}/>}
            </div>
        </main>
    );
}
