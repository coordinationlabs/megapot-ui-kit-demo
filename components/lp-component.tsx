'use client';

// Removed contract imports, useCallback, useEffect, useState
import { useAccount } from 'wagmi';
import { LpDepositForm } from './lp-components/lp-deposit-form';
import { LpPoolStatus } from './lp-components/lp-pool-status';
import { UserLpBalances } from './lp-components/user-lp-balances';
// Import hooks needed for conditional rendering logic
import { useLpPoolStatus, useLpsInfo } from '@/lib/queries';
import { Loading } from './ui/loading'; // Import Loading

export function LiquidityComponent() {
    const { address, isConnected } = useAccount();

    // Fetch data needed for conditional logic in *this* component
    const { data: lpPoolStatus, isLoading: isLoadingStatus, error: errorStatus } = useLpPoolStatus();
    const { data: lpsInfo, isLoading: isLoadingInfo, error: errorInfo } = useLpsInfo(address);

    const isLoading = isLoadingStatus || isLoadingInfo;
    const error = errorStatus || errorInfo;

    // Determine if user has an active LP position based on lpsInfo
    const hasActiveLp = lpsInfo?.[0] !== undefined && lpsInfo[0] > 0n; // Check principal > 0

    if (error) {
        // Handle error state for the overall component
        return <div className="text-red-500 text-center p-4">Error loading liquidity data.</div>;
    }

    return (
        <div className="space-y-6">
            {/* LpPoolStatus fetches its own data */}
            <LpPoolStatus />

            {/* Show loading indicator while initial data loads */}
            {isLoading && <Loading className="h-20 w-full" />}

            {/* Render deposit form if connected, pool is open, and not loading */}
            {!isLoading && isConnected && address && lpPoolStatus === true && (
                <LpDepositForm address={address} />
            )}

            {/* Render user balances if connected, user has LP, and not loading */}
            {/* UserLpBalances fetches its own data using the address */}
            {!isLoading && isConnected && address && hasActiveLp && (
                <UserLpBalances walletAddress={address} />
            )}

             {/* Optional: Message if pool is closed */}
             {!isLoading && lpPoolStatus === false && (
                 <p className="text-center text-orange-600 bg-orange-100 p-3 rounded-md">
                     The LP deposit pool is currently closed.
                 </p>
             )}

             {/* Optional: Message if connected but no LP */}
             {!isLoading && isConnected && !hasActiveLp && lpPoolStatus === true && (
                 <p className="text-center text-gray-500">
                     You do not have an active LP position. Use the form above to deposit.
                 </p>
             )}

             {/* Message if not connected */}
             {!isConnected && (
                 <p className="text-center text-gray-500">
                     Connect your wallet to manage liquidity.
                 </p>
             )}
        </div>
    );
}
