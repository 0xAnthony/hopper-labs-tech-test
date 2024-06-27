import {Abi} from "viem";

export interface Contract {
    address: string;
    abi: Abi;
    deployBlock: bigint;
}