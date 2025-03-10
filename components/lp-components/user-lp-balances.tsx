import { CONTRACT_ADDRESS } from '@/lib/constants';
import { useState } from 'react';
import { parseAbi } from 'viem';
import { useWriteContract } from 'wagmi';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { AdjustRiskPercentage } from './user-lp-balance/adjust-risk-percentage';
import { LpBalances } from './user-lp-balance/lp-balances';

export function UserLpBalances({
    lpInfo,
}: {
    lpInfo: [bigint, bigint, bigint, boolean];
}) {
    const principal = Number(lpInfo[0]);
    const inRange = Number(lpInfo[1]);
    const [riskPercent, setRiskPercent] = useState<number>(Number(lpInfo[2]));
    const currentRiskPercent = Number(lpInfo[2]);
    const [tempRiskPercent, setTempRiskPercent] = useState<number>(riskPercent);

    const { writeContract } = useWriteContract();

    const lpAdjustRiskPercentage = async (riskPercent: number) => {
        try {
            const lpAdjustRiskPercentageAbi = [
                'function lpAdjustRiskPercentage(uint256 riskPercentage) returns (bool)',
            ];

            writeContract?.({
                abi: parseAbi(lpAdjustRiskPercentageAbi),
                address: CONTRACT_ADDRESS as `0x${string}`,
                functionName: 'lpAdjustRiskPercentage',
                args: [riskPercent],
            });
        } catch (error) {
            console.error('Error adjusting risk percentage:', error);
        }
    };

    const withdraw = async () => {
        try {
            const withdrawAbi = ['function withdrawAllLP() returns (bool)'];

            writeContract?.({
                abi: parseAbi(withdrawAbi),
                address: CONTRACT_ADDRESS as `0x${string}`,
                functionName: 'withdrawAllLP',
                args: [],
            });
        } catch (error) {
            console.error('Error during withdrawal:', error);
        }
    };

    return (
        <Card className="bg-white rounded-xl shadow-sm">
            <CardContent className="p-6">
                <div className="text-center">
                    <LpBalances
                        principal={principal}
                        inRange={inRange}
                        currentRiskPercent={currentRiskPercent}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 w-full">
                        <AdjustRiskPercentage
                            riskPercent={riskPercent}
                            tempRiskPercent={tempRiskPercent}
                            setRiskPercent={setRiskPercent}
                            setTempRiskPercent={setTempRiskPercent}
                        />
                    </div>
                    <Button
                        className="bg-emerald-500 text-white hover:bg-emerald-600"
                        onClick={async () => {
                            await lpAdjustRiskPercentage(riskPercent);
                        }}
                    >
                        Adjust Risk Percentage
                    </Button>
                    {inRange > 0 && (
                        <p className="text-sm text-gray-500">
                            To withdraw you must first set risk % to 0 and wait
                            for current jackpot to finish
                        </p>
                    )}
                    <Button
                        onClick={async () => {
                            await withdraw();
                        }}
                        className="bg-orange-500 text-white hover:bg-orange-600"
                    >
                        Withdraw
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
