import { http, createConfig, createStorage, cookieStorage } from 'wagmi'
import {holesky} from "wagmi/chains";

export function getConfig() {
    return createConfig({
        ssr: true,
        storage: createStorage({
            storage: cookieStorage,
        }),
        chains: [holesky],
        connectors: [],
        transports: {
            [holesky.id]: http(),
        },
    })
}