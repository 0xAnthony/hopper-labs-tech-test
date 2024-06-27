import {DECIMALS_6_MULTIPLIER, EXPLORER_URL} from "@/utils/constants";
import {shortenAddress} from "@/utils/adresses";
import {toReadableValue} from "@/utils/numbers";
import {CompleteLog} from "@/types/logs";

interface DepositTableProps {
    logs: CompleteLog[];
}

export const DepositTable: React.FC<DepositTableProps> = ({logs}) => {
    return (
        <>
            <table>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Block number</th>
                    <th>Tx hash</th>
                    <th>Owner</th>
                    <th>Price</th>
                    <th>Assets</th>
                    <th>Shares</th>
                </tr>
                </thead>

                <tbody>
                {logs.map((log) => (
                    <tr key={log.transactionHash}>
                        <td>
                            {log.blockData ?
                                new Date(parseInt(`${log.blockData.timestamp.toString()}000`)).toLocaleString() : "Error fetching time"}
                        </td>
                        <td>
                            {!!log.blockNumber &&
                                <a href={`${EXPLORER_URL}/block/${log.blockNumber.toString()}`} target="_blank">
                                    {log.blockNumber.toString()}
                                </a>}
                        </td>
                        <td>
                            {log.transactionHash &&
                                <a href={`${EXPLORER_URL}/tx/${log.transactionHash}`} target="_blank">
                                {shortenAddress(log.transactionHash)}
                            </a>}

                        </td>
                        <td>
                            <a href={`${EXPLORER_URL}/address/${log.args.owner}`} target="_blank">
                                {shortenAddress(log.args!.owner)}
                            </a>
                        </td>
                        <td>{(log.args.assets / log.args.shares).toString()}</td>
                        <td>{toReadableValue(log.args.shares, DECIMALS_6_MULTIPLIER)}</td>
                        <td>{toReadableValue(log.args.shares, DECIMALS_6_MULTIPLIER)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};