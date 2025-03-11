import { getLastJackpotResults } from '@/lib/contract';
import { useEffect, useState } from 'react';
import { zeroAddress } from 'viem';
import { Card, CardContent } from '../ui/card';

interface LastJackpotEvent {
    time: number;
    winner: string;
    winningTicket: number;
    winAmount: number;
    ticketsPurchasedTotalBps: number;
}
export function LastJackpot() {
    const [lastJackpot, setLastJackpot] = useState<
        LastJackpotEvent | undefined
    >(undefined);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchLastJackpot = async () => {
            const lastJackpot = await getLastJackpotResults();
            if (lastJackpot) {
                const lastJackpotEvent = {
                    time: lastJackpot.time,
                    winner: lastJackpot.winner,
                    winningTicket: lastJackpot.winningTicket,
                    winAmount: lastJackpot.winAmount,
                    ticketsPurchasedTotalBps:
                        lastJackpot.ticketsPurchasedTotalBps,
                };
                setLastJackpot(lastJackpotEvent);
                setIsLoading(false);
            }
        };
        fetchLastJackpot();
    }, []);
    return (
        <Card>
            <CardContent>
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold">Last Jackpot</h1>
                    {lastJackpot && !isLoading ? (
                        <>
                            <div className="flex justify-between w-full">
                                <p className="text-lg text-emerald-500">
                                    Winner:
                                </p>
                                <p className="text-lg text-emerald-500">
                                    {lastJackpot.winner === zeroAddress
                                        ? 'LPs Won'
                                        : lastJackpot.winner}
                                </p>
                            </div>
                            <div className="flex justify-between w-full">
                                <p className="text-lg text-emerald-500">
                                    Win Amount:
                                </p>
                                <p className="text-lg text-emerald-500">
                                    {(lastJackpot.winAmount / 10 ** 6).toFixed(
                                        2
                                    )}{' '}
                                    USDC
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
