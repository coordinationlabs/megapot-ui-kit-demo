import { useJackpotAmount, useTokenName } from '@/lib/queries'; // Use query hook
import { Card, CardContent } from '../ui/card';
import { Loading } from '../ui/loading'; // Import Loading component

export function CurrentJackpot() {
    const { data: jackpotAmount, isLoading, error } = useJackpotAmount();
    // Also fetch token name to display alongside amount
    const { data: tokenName, isLoading: isLoadingName, error: errorName } = useTokenName();

    const displayName = tokenName ?? 'TOKEN'; // Default name

    let content;
    if (isLoading || isLoadingName) {
        // Use Loading component, adjust styling as needed
        content = <Loading className="h-10 w-32" containerClassName="p-0" />;
    } else if (error || errorName) {
        content = <p className="text-4xl font-bold text-red-500">Error</p>;
    } else if (jackpotAmount !== undefined) {
        // Format the amount with the token name
        content = (
            <p className="text-4xl font-bold text-emerald-500">
                {jackpotAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} {displayName}
            </p>
        );
    } else {
        // Fallback if data is undefined but not loading/error
        content = <p className="text-4xl font-bold text-gray-500">N/A</p>;
    }

    return (
        <Card className="bg-white rounded-xl shadow-sm">
            <CardContent className="p-6">
                <div className="text-center">
                    <h2 className="text-lg font-medium text-gray-500 mb-2">
                        Current Jackpot
                    </h2>
                    {content}
                </div>
            </CardContent>
        </Card>
    );
}
