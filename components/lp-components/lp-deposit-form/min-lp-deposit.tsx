import { useTokenName, useTokenDecimals } from '@/lib/queries'; // Use query hooks
import { formatUnits } from 'viem'; // Import viem util

// Accept bigint | undefined for minLpDeposit
export function MinLpDeposit({ minLpDeposit }: { minLpDeposit: bigint | undefined }) {
    // Still fetch name and decimals for formatting
    const { data: tokenName, isLoading: isLoadingName, error: errorName } = useTokenName();
    const { data: tokenDecimals, isLoading: isLoadingDecimals, error: errorDecimals } = useTokenDecimals();

    const isLoading = isLoadingName || isLoadingDecimals;
    const error = errorName || errorDecimals;

    const displayDecimals = tokenDecimals ?? 18;
    const displayName = tokenName ?? 'TOKEN';

    let formattedAmount = '...';
    if (minLpDeposit !== undefined && !isLoading && !error) {
        // Format the bigint using formatUnits
        formattedAmount = formatUnits(minLpDeposit, displayDecimals);
    }

    // Optionally show loading/error states for token info
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
                 <p className="text-sm text-red-500">Error loading token info.</p>
             </div>
         );
    }
    // Handle case where minLpDeposit itself is undefined (e.g., initial load in parent)
    if (minLpDeposit === undefined) {
         return (
             <div>
                 <p className="text-sm text-gray-500">Loading minimum deposit...</p>
             </div>
         );
    }


    return (
        <div className="mt-2"> {/* Added margin top */}
            <p className="text-sm text-emerald-500">
                Minimum Initial LP Deposit: {formattedAmount} {displayName}
            </p>
        </div>
    );
}
