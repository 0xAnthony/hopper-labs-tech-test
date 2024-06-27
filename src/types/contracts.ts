import {Abi} from "viem";

export interface Contract {
    address: `0x${string}`;
    abi: Abi;
}

export interface Contracts {
    [key: string]: {
        data: Contract;
        deployBlock: bigint;
    };
}