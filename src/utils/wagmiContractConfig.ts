import USDC_ABI from "@/ABIs/USDC";
import VAULT_ABI from "@/ABIs/Vault";
import {Contract, Contracts} from "@/types/contracts";

// Merging recurrent data in single variables to be able to update it easily if needed
const UsdcContract: Contract = {
    address: '0x81C346288aEc6AdBeD096696EDD95555E92c5AA5',
    abi: USDC_ABI,
}

const VaultContract: Contract = {
    address: '0x4B63602BC12F2d59d8952D55B9F697672808715f',
    abi: VAULT_ABI,
}

export const contracts: Contracts = {
    USDC: {
        data: UsdcContract,
        deployBlock: 1767076n
    },
    Vault: {
        data: VaultContract,
        deployBlock: 1767191n
    }
}