import { useLpsInfo, useTokenDecimals } from '@/lib/queries';
import { formatUnits } from 'viem';
import { Loading } from '../../ui/loading';

export function LpBalances({
    walletAddress,
}: {
    walletAddress: `0x${string}` | undefined;
}) {
    const { data: lpsInfo, isLoading: isLoadingInfo, error: errorInfo } = useLpsInfo(walletAddress);
    const { data: tokenDecimals, isLoading: isLoadingDecimals, error: errorDecimals } = useTokenDecimals();

    const isLoading = isLoadingInfo || isLoadingDecimals;
    const error = errorInfo || errorDecimals;

    const displayDecimals = tokenDecimals ?? 18;

    const principalWei = lpsInfo?.[0] ?? 0n;
    const inRangeWei = lpsInfo?.[1] ?? 0n;
    const currentRiskPercent = lpsInfo ? Number(lpsInfo[2]) : 0;

    const formattedPrincipal = formatUnits(principalWei, displayDecimals);
    const formattedInRange = formatUnits(inRangeWei, displayDecimals);

    if (isLoading) {
        return <Loading className="h-12 w-full" containerClassName="p-1" />;
    }

    if (error || !lpsInfo) {
        return <p className="text-sm text-red-500 text-center">Error loading LP balances.</p>;
    }

    return (
        <div className="space-y-1">
            <div className="flex justify-between">
                <p className="font-medium text-gray-700">Principal:</p>
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
