import { Card, CardContent } from '@/components/ui/card';
import { CONTRACT_ADDRESS, ERC20_TOKEN_ADDRESS } from '@/lib/constants';
import {
    getLpsInfo,
    getMinLpDeposit,
    getTokenAllowance,
    getTokenBalance,
} from '@/lib/contract';
import { useEffect, useState } from 'react';
import { parseAbi } from 'viem';
import { useWriteContract } from 'wagmi';
import { DepositInput } from './lp-deposit-form/deposit-input';
import { FormButton } from './lp-deposit-form/form-button';
import { MinLpDeposit } from './lp-deposit-form/min-lp-deposit';
import { RiskPercentage } from './lp-deposit-form/risk-percentage';
export function LpDepositForm({ address }: { address: string }) {
    const [state, setState] = useState({
        walletAddress: undefined as `0x${string}` | undefined,
        walletBalance: 0,
        allowance: 0,
        lpPrincipal: 0,
        currentRiskPercentage: null as number | null,
        newRiskPercentage: 10,
        minLpDeposit: undefined as number | undefined,
        walletFunded: false,
        allowanceFunded: false,
        depositAmount: 250,
        tempDepositAmount: 250,
    });

    const { writeContract } = useWriteContract();

    useEffect(() => {
        setState((prev) => ({
            ...prev,
            walletAddress: address as `0x${string}`,
        }));

        const fetchMinLpDeposit = async () => {
            const minDeposit = await getMinLpDeposit();
            if (minDeposit) {
                setState((prev) => ({
                    ...prev,
                    minLpDeposit: Number(minDeposit),
                }));
            }
        };
        fetchMinLpDeposit();

        const fetchLpInfo = async () => {
            if (!state.walletAddress) return;
            const lpsInfo = await getLpsInfo(state.walletAddress);
            if (lpsInfo) {
                setState((prev) => ({
                    ...prev,
                    currentRiskPercentage: Number(lpsInfo[2]),
                    lpPrincipal: Number(lpsInfo[0]),
                }));
            }
        };
        fetchLpInfo();
    }, [address]);

    const fetchWalletAndAllowance = async () => {
        if (!state.walletAddress) return;

        try {
            const balance = await getTokenBalance(state.walletAddress);
            setState((prev) => ({
                ...prev,
                walletBalance: balance
                    ? Number((balance / 10 ** 6).toFixed(0))
                    : 0,
            }));
        } catch (error) {
            console.error('Error fetching wallet balance:', error);
        }

        try {
            const allowance = await getTokenAllowance(address as `0x${string}`);
            setState((prev) => ({
                ...prev,
                allowance: allowance ? allowance / 10 ** 6 : 0,
            }));
        } catch (error) {
            console.error('Error fetching allowance:', error);
        }
    };

    useEffect(() => {
        fetchWalletAndAllowance();
        const interval = setInterval(fetchWalletAndAllowance, 30000);
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [state.walletAddress]);

    const handleApprove = async () => {
        const depositAmount = state.minLpDeposit;
        try {
            const lpDepositAbi = [
                'function approve(address spender, uint256 amount) returns (bool)',
            ];

            writeContract?.({
                abi: parseAbi(lpDepositAbi),
                address: ERC20_TOKEN_ADDRESS as `0x${string}`,
                functionName: 'approve',
                args: [CONTRACT_ADDRESS as `0x${string}`, depositAmount],
            });
        } catch (error) {
            console.error('Error approving token:', error);
        }
    };

    const handleDeposit = async () => {
        const depositAmount = state.minLpDeposit;
        const riskPercentage = state.currentRiskPercentage;
        try {
            if (depositAmount === 0) {
                console.error('Deposit amount cannot be 0');
                return;
            }
            if (!riskPercentage || riskPercentage <= 0) {
                console.error('Risk percentage cannot be null');
                return;
            }
            const lpDepositAbi = [
                'function lpDeposit(uint256 amount, uint256 riskPercentage) returns (bool)',
            ];

            writeContract?.({
                abi: parseAbi(lpDepositAbi),
                address: CONTRACT_ADDRESS as `0x${string}`,
                functionName: 'lpDeposit',
                args: [depositAmount, riskPercentage],
            });
        } catch (error) {
            console.error('Error approving token:', error);
        }
    };

    return (
        <Card className="bg-white rounded-xl shadow-sm">
            <CardContent className="p-6">
                <div className="text-center">
                    <h2 className="text-lg font-medium text-gray-500 mb-2">
                        LP Deposit Form
                    </h2>
                    <form>
                        <DepositInput
                            walletBalance={state.walletBalance}
                            allowance={state.allowance}
                            setWalletFunded={(funded: boolean) =>
                                setState((prev) => ({
                                    ...prev,
                                    walletFunded: funded,
                                }))
                            }
                            setAllowanceFunded={(funded: boolean) =>
                                setState((prev) => ({
                                    ...prev,
                                    allowanceFunded: funded,
                                }))
                            }
                            setDepositAmount={(amount: number) =>
                                setState((prev) => ({
                                    ...prev,
                                    depositAmount: amount,
                                }))
                            }
                        />
                        {state.minLpDeposit && state.lpPrincipal === 0 && (
                            <MinLpDeposit minLpDeposit={state.minLpDeposit} />
                        )}
                        <RiskPercentage
                            newRiskPercentage={state.newRiskPercentage}
                            setNewRiskPercentage={(percentage: number) =>
                                setState((prev) => ({
                                    ...prev,
                                    newRiskPercentage: percentage,
                                }))
                            }
                        />
                    </form>
                </div>
                <div className="flex justify-center">
                    <FormButton
                        walletFunded={state.walletFunded}
                        allowanceFunded={state.allowanceFunded}
                        depositAmount={state.depositAmount}
                        tempDepositAmount={state.tempDepositAmount}
                        handleDeposit={handleDeposit}
                        handleApprove={handleApprove}
                        walletBalance={state.walletBalance}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
