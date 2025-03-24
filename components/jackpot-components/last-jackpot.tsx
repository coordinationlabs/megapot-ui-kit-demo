import Link from 'next/link';
import { useEffect, useState } from 'react';
import { zeroAddress } from 'viem';
import { Card, CardContent } from '../ui/card';

type JackpotRunEvent = {
    winner: string;
    winAmount: string;
    ticketsPurchasedByWinner: string;
    blockNumber: number;
    transactionHash: string;
};
export function LastJackpot() {
    const [pastJackpots, setPastJackpots] = useState<
        JackpotRunEvent | undefined
    >(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPastJackpots = async () => {
            const response = await fetch('/api/past-jackpots', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            const winner = data[0].data.substring(66, 130);
            const winnerAddress =
                parseInt(winner, 16) === 0
                    ? 'LPs Won'
                    : `${winner.substring(0, 6)}...${winner.substring(
                          winner.length - 4
                      )}`;
            const winAmount = Number(
                parseInt(data[0].data.substring(194, 258), 16) / 10 ** 6
            ).toFixed(0);

            const ticketsPurchasedByWinner = Number(
                parseInt(data[0].data.substring(258, 322), 16) /
                    10000 /
                    ((100 - 30) / 100)
            ).toFixed(0);

            const blockNumber = parseInt(data[0].blockNumber, 16);
            const transactionHash = data[0].transactionHash;

            setPastJackpots({
                winner: winnerAddress,
                winAmount,
                ticketsPurchasedByWinner,
                blockNumber,
                transactionHash,
            });
            setIsLoading(false);
        };
        fetchPastJackpots();
    }, []);

    return (
        <Card className="bg-white rounded-xl shadow-sm">
            <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center">
                    <h2 className="text-lg font-medium text-gray-500 mb-2">
                        Last Jackpot
                    </h2>
                    {pastJackpots && !isLoading ? (
                        <>
                            <div className="flex justify-between w-full">
                                <p className="text-lg text-emerald-500">
                                    Winner:
                                </p>
                                <p className="text-lg text-emerald-500">
                                    {pastJackpots.winner === zeroAddress
                                        ? 'LPs Won'
                                        : pastJackpots.winner}
                                </p>
                            </div>
                            <div className="flex justify-between w-full">
                                <p className="text-lg text-emerald-500">
                                    Win Amount:
                                </p>
                                <p className="text-lg text-emerald-500">
                                    $
                                    {new Intl.NumberFormat().format(
                                        Number(pastJackpots.winAmount)
                                    )}{' '}
                                    USDC
                                </p>
                            </div>
                            {pastJackpots.winner !== 'LPs Won' ? (
                                <div className="flex justify-between w-full">
                                    <p className="text-lg text-emerald-500">
                                        Tickets Purchased:
                                    </p>
                                    <p className="text-lg text-emerald-500">
                                        {pastJackpots.ticketsPurchasedByWinner}{' '}
                                        Tickets
                                    </p>
                                </div>
                            ) : (
                                <></>
                            )}
                            <div className="flex justify-between w-full">
                                <p className="text-lg text-emerald-500">
                                    Block:
                                </p>
                                <p className="text-lg text-emerald-500">
                                    {pastJackpots.blockNumber}
                                </p>
                            </div>
                            <div className="flex justify-between w-full">
                                <p className="text-lg text-emerald-500">
                                    Tx Hash:
                                </p>
                                <p className="text-lg text-blue-500">
                                    <Link
                                        target="_blank"
                                        href={`https://basescan.org/tx/${pastJackpots.transactionHash}`}
                                    >
                                        BaseScan Tx
                                    </Link>
                                </p>
                            </div>
                        </>
                    ) : (
                        <p className="text-lg">Loading...</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
