import {Log, Block} from "viem";

export interface CompleteLog extends Log {
    blockData?: Block;
    // adding args as Wagmi Typeinfering isn't currently super stable
    args: any;
}