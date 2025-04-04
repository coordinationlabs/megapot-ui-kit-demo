import { useTokenName, useTokenDecimals } from '@/lib/queries';
import { formatUnits } from 'viem';

export function MinLpDeposit({
    minLpDeposit,
}: {
    minLpDeposit: bigint | undefined;
}) {
    const {
        data: tokenName,
        isLoading: isLoadingName,
        error: errorName,
    } = useTokenName();
    const {
        data: tokenDecimals,
        isLoading: isLoadingDecimals,
        error: errorDecimals,
    } = useTokenDecimals();

    const isLoading = isLoadingName || isLoadingDecimals;
    const error = errorName || errorDecimals;

    const displayDecimals = tokenDecimals ?? 18;
    const displayName = tokenName ?? 'TOKEN';

    let formattedAmount = '...';
    if (minLpDeposit !== undefined && !isLoading && !error) {
        formattedAmount = formatUnits(minLpDeposit, displayDecimals);
    }

    if (isLoading) {
        return (
            <div>
                <p className="text-sm text-gray-500">Loading token info...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div>
                <p className="text-sm text-red-500">
                    Error loading token info.
                </p>
            </div>
        );
    }
    if (minLpDeposit === undefined) {
        return (
            <div>
                <p className="text-sm text-gray-500">
                    Loading minimum deposit...
                </p>
            </div>
        );
    }

    return (
        <div className="mt-2">
            <p className="text-sm text-emerald-500">
                Minimum Initial LP Deposit: {formattedAmount} {displayName}
            </p>
        </div>
    );
}
