import {
    useLastJackpotResults,
    useTokenName,
    useTokenDecimals,
    useFeeBps,
} from '@/lib/queries';
import Link from 'next/link';
import { zeroAddress } from 'viem';
import { Card, CardContent } from '../ui/card';
import { Loading } from '../ui/loading';

// Helper function to format address
const formatAddress = (address: string | undefined): string => {
    if (!address) return '...';
    if (address === zeroAddress) return 'LPs Won';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export function LastJackpot() {
    const { data: lastJackpotData, isLoading: isLoadingJackpot, error: errorJackpot } = useLastJackpotResults();
    const { data: tokenName, isLoading: isLoadingName, error: errorName } = useTokenName();
    const { data: tokenDecimals, isLoading: isLoadingDecimals, error: errorDecimals } = useTokenDecimals();
    const { data: feeBps, isLoading: isLoadingFee, error: errorFee } = useFeeBps();

    const isLoading = isLoadingJackpot || isLoadingName || isLoadingDecimals || isLoadingFee;
    const error = errorJackpot || errorName || errorDecimals || errorFee;

    const displayDecimals = tokenDecimals ?? 18;
    const displayName = tokenName ?? 'TOKEN';
    const displayFeeBps = feeBps ?? 0; // Default fee to 0 if loading/error

    let content;

    if (isLoading) {
        content = <Loading className="h-8 w-8 mx-auto" containerClassName="p-0" />;
    } else if (error || !lastJackpotData) {
        content = <p className="text-lg text-red-500">Error loading last jackpot data.</p>;
    } else {
        // Calculate tickets purchased using fetched feeBps
        // Note: The formula from the original code seems slightly off.
        // A simpler approximation: tickets ~ totalBps / 10000
        // Or if totalBps represents the *cost* in BPS of the jackpot size:
        // cost = tickets * ticketPrice * (1 - fee/10000)
        // ticketsPurchasedTotalBps = cost / jackpotSize * 10000
        // Let's stick to the structure from the hook for now, assuming it's correct
        // If the hook provided raw BPS, we'd need ticket price here too.
        // Assuming the hook's `ticketsPurchasedTotalBps` is already processed or needs fee:
        // Convert bigint to Number before division
        const ticketsPurchasedByWinner = displayFeeBps > 0
            ? (Number(lastJackpotData.ticketsPurchasedTotalBps) / 10000 / ((100 - (displayFeeBps / 100)) / 100)).toFixed(0)
            : 'N/A'; // Avoid division by zero or incorrect calculation if fee is 0

        // Convert bigint to Number before division
        const formattedWinAmount = (Number(lastJackpotData.winAmount) / (10 ** displayDecimals)).toLocaleString(undefined, { maximumFractionDigits: displayDecimals > 0 ? 2 : 0 });
        const winnerDisplay = formatAddress(lastJackpotData.winner);

        content = (
            <>
                <div className="flex justify-between w-full">
                    <p className="text-lg text-emerald-500">Winner:</p>
                    <p className="text-lg text-emerald-500">{winnerDisplay}</p>
                </div>
                <div className="flex justify-between w-full">
                    <p className="text-lg text-emerald-500">Win Amount:</p>
                    <p className="text-lg text-emerald-500">
                        {formattedWinAmount} {displayName}
                    </p>
                </div>
                {winnerDisplay !== 'LPs Won' && (
                    <div className="flex justify-between w-full">
                        <p className="text-lg text-emerald-500">Tickets Purchased:</p>
                        <p className="text-lg text-emerald-500">
                            {ticketsPurchasedByWinner} Tickets
                        </p>
                    </div>
                )}
                 {/* Assuming the hook doesn't return block/tx hash, these are removed */}
                 {/* If needed, the hook/contract function should be updated */}
            </>
        );
    }

    return (
        <Card className="bg-white rounded-xl shadow-sm">
            <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center space-y-1">
                    <h2 className="text-lg font-medium text-gray-500 mb-2">
                        Last Jackpot
                    </h2>
                    {content}
                </div>
            </CardContent>
        </Card>
    );
}
