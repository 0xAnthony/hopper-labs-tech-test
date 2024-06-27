import {Log, Block} from "viem";

export type CompleteLog = Log & {
    blockData: Block
}