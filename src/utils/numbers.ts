export const toReadableValue = (value: bigint, decimals: bigint): string => {
    if (value === null) {
        return "0"
    }
    const wholePart = value / decimals;
    const remainder = value % decimals;

    let formattedValue = wholePart.toString();

    if (remainder > 0) {
        const decimalPart = remainder.toString().padStart(6, '0').replace(/0+$/, '');
        formattedValue += `.${decimalPart}`;
    }

    return formattedValue;
};

export const fromReadableValue = (value: String, decimals: bigint): bigint => {
    if (value === "") {
        return 0n
    }

    const [wholePart, decimalPart = ''] = value.split('.');

    const wholeBigInt = BigInt(wholePart);
    const normalizedDecimalPart = decimalPart.padEnd(Number(decimals), '0').slice(0, Number(decimals));
    const decimalBigInt = BigInt(normalizedDecimalPart);
    const multiplier = BigInt(10) ** decimals;
    const result = wholeBigInt * multiplier + decimalBigInt;

    return result;
};