import { useLpsInfo, useTokenDecimals } from '@/lib/queries'; // Use query hooks
import { formatUnits } from 'viem'; // Import viem util
import { Loading } from '../../ui/loading'; // Corrected import path for Loading

export function LpBalances({
    walletAddress,
}: {
    walletAddress: `0x${string}` | undefined; // Add walletAddress prop
}) {
    const { data: lpsInfo, isLoading: isLoadingInfo, error: errorInfo } = useLpsInfo(walletAddress);
    const { data: tokenDecimals, isLoading: isLoadingDecimals, error: errorDecimals } = useTokenDecimals();

    const isLoading = isLoadingInfo || isLoadingDecimals;
    const error = errorInfo || errorDecimals;

    const displayDecimals = tokenDecimals ?? 18;

    // Extract data safely, providing defaults
    const principalWei = lpsInfo?.[0] ?? 0n;
    const inRangeWei = lpsInfo?.[1] ?? 0n;
    const currentRiskPercent = lpsInfo ? Number(lpsInfo[2]) : 0; // Risk percentage is likely okay as number

    // Format values
    const formattedPrincipal = formatUnits(principalWei, displayDecimals);
    const formattedInRange = formatUnits(inRangeWei, displayDecimals);

    if (isLoading) {
        return <Loading className="h-12 w-full" containerClassName="p-1" />;
    }

    if (error || !lpsInfo) {
        return <p className="text-sm text-red-500 text-center">Error loading LP balances.</p>;
    }

    return (
        <div className="space-y-1"> {/* Added spacing */}
            <div className="flex justify-between">
                <p className="font-medium text-gray-700">Principal:</p> {/* Adjusted styling */}
                <p className="font-medium text-gray-900">
                    {parseFloat(formattedPrincipal).toLocaleString(undefined, { maximumFractionDigits: displayDecimals > 0 ? 4 : 0 })}
                </p>
            </div>
            <div className="flex justify-between">
                <p className="font-medium text-gray-700">Position In Range:</p>
                <p className="font-medium text-gray-900">
                     {parseFloat(formattedInRange).toLocaleString(undefined, { maximumFractionDigits: displayDecimals > 0 ? 4 : 0 })}
                </p>
            </div>
            <div className="flex justify-between">
                <p className="font-medium text-gray-700">Risk Percent:</p>
                <p className="font-medium text-gray-900">
                    {currentRiskPercent}%
                </p>
            </div>
        </div>
    );
}
