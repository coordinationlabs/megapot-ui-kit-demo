import { CONTRACT_ADDRESS } from '@/lib/constants';
import { useLpsInfo } from '@/lib/queries'; // Use query hook
import { useState, useEffect } from 'react';
import { parseAbi } from 'viem';
import { useWriteContract } from 'wagmi';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Loading } from '../ui/loading'; // Import Loading
import { AdjustRiskPercentage } from './user-lp-balance/adjust-risk-percentage';
import { LpBalances } from './user-lp-balance/lp-balances';

export function UserLpBalances({
    walletAddress,
}: {
    walletAddress: `0x${string}` | undefined; // Accept walletAddress
}) {
    // Fetch LP info using the hook
    const { data: lpInfo, isLoading: isLoadingInfo, error: errorInfo } = useLpsInfo(walletAddress);

    // Local state for the new risk percentage input
    const [newRiskPercent, setNewRiskPercent] = useState<number>(0); // Initialize appropriately

    // Use effect to set initial risk percentage when lpInfo loads
    useEffect(() => {
        if (lpInfo) {
            setNewRiskPercent(Number(lpInfo[2])); // Set initial state from fetched data
        }
    }, [lpInfo]); // Dependency array ensures this runs when lpInfo changes

    const { data: writeData, error: writeError, isError: isWriteError, isPending: isWritePending, writeContract } = useWriteContract();

    // Extract values safely
    const principalWei = lpInfo?.[0] ?? 0n;
    const inRangeWei = lpInfo?.[1] ?? 0n;
    const currentRiskPercent = lpInfo ? Number(lpInfo[2]) : 0;
    const isActive = lpInfo?.[3] ?? false;

    const handleAdjustRisk = async () => {
        if (newRiskPercent < 0 || newRiskPercent > 100) {
            console.error("Invalid risk percentage");
            return;
        }
        try {
            const lpAdjustRiskPercentageAbi = parseAbi([
                'function lpAdjustRiskPercentage(uint256 riskPercentage) returns (bool)',
            ]);
            writeContract?.({
                abi: lpAdjustRiskPercentageAbi,
                address: CONTRACT_ADDRESS as `0x${string}`,
                functionName: 'lpAdjustRiskPercentage',
                args: [BigInt(newRiskPercent)], // Pass as BigInt
            });
        } catch (error) {
            console.error('Error adjusting risk percentage:', error);
        }
    };

    const handleWithdraw = async () => {
         // Add check: Can only withdraw if principal > 0 and risk is 0?
         // The contract might enforce this, but UI check is good too.
         if (principalWei === 0n) {
             console.log("No principal to withdraw.");
             return;
         }
         // Optional: Check if risk is 0 based on lpInfo
         // if (currentRiskPercent !== 0) {
         //     console.log("Set risk to 0 before withdrawing.");
         //     return;
         // }

        try {
            const withdrawAbi = parseAbi(['function withdrawAllLP() returns (bool)']);
            writeContract?.({
                abi: withdrawAbi,
                address: CONTRACT_ADDRESS as `0x${string}`,
                functionName: 'withdrawAllLP',
                args: [],
            });
        } catch (error) {
            console.error('Error during withdrawal:', error);
        }
    };

     // Display write error if any
      const writeErrorDisplay = isWriteError ? (
          <p className="text-xs text-red-500 mt-1 text-center">Error: {writeError?.message || 'Transaction failed'}</p>
      ) : null;

    // Don't render if not active or no principal? Or handle within LpBalances?
    // For now, render based on isLoading/error, LpBalances handles its display.
    if (!isActive && principalWei === 0n && !isLoadingInfo) {
        return null; // Or a message indicating no active LP position
    }

    return (
        <Card className="bg-white rounded-xl shadow-sm">
            <CardContent className="p-6">
                 <h3 className="text-lg font-medium text-gray-700 mb-3 text-center">Your LP Position</h3>
                {/* Pass walletAddress to LpBalances */}
                <LpBalances walletAddress={walletAddress} />

                <div className="flex flex-col gap-3 mt-4"> {/* Increased gap */}
                    {/* AdjustRiskPercentage now only needs the controlled state and setter */}
                    <AdjustRiskPercentage
                        newRiskPercent={newRiskPercent}
                        setNewRiskPercent={setNewRiskPercent}
                    />
                    <Button
                        className="bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-gray-400"
                        onClick={handleAdjustRisk}
                        disabled={isWritePending || newRiskPercent === currentRiskPercent} // Disable if pending or no change
                    >
                        {isWritePending ? <Loading className="h-5 w-5 mr-2" containerClassName="p-0 inline-flex" /> : null}
                        Adjust Risk Percentage
                    </Button>

                    {/* Withdraw Section */}
                    {currentRiskPercent !== 0 && principalWei > 0n && (
                        <p className="text-xs text-center text-gray-500">
                            To withdraw, set Risk % to 0 and wait for the next draw.
                        </p>
                    )}
                    <Button
                        onClick={handleWithdraw}
                        disabled={isWritePending || currentRiskPercent !== 0 || principalWei === 0n} // Disable if pending, risk != 0, or no principal
                        className="bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-400"
                    >
                         {isWritePending ? <Loading className="h-5 w-5 mr-2" containerClassName="p-0 inline-flex" /> : null}
                        Withdraw All LP
                    </Button>
                     {writeErrorDisplay}
                </div>
            </CardContent>
        </Card>
    );
}
