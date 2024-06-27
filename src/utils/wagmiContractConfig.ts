import USDC_ABI from "@/ABIs/USDC.json";
import VAULT_ABI from "@/ABIs/Vault.json";
import {Contract} from "@/types/contracts";

// Merging recurrent data in single variables to be able to update it easily if needed
export const UsdcContract: Contract = {
    address: '0x81C346288aEc6AdBeD096696EDD95555E92c5AA5',
    abi: USDC_ABI,
    deployBlock: 1767076n
}

export const VaultContract: Contract = {
    address: '0x4B63602BC12F2d59d8952D55B9F697672808715f',
    abi: VAULT_ABI,
    deployBlock: 1767191n
}