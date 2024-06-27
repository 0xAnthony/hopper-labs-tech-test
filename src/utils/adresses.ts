export function shortenAddress(address: String): String {
    if (!/^0x[0-9a-fA-F]+$/.test(address)) {
        throw new Error('Invalid hexadecimal string');
    }
    return address.slice(0, 6) + '…' + address.slice(-4);
}