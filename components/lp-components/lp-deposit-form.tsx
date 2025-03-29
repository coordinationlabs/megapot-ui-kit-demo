import { Card, CardContent } from '@/components/ui/card';
import { CONTRACT_ADDRESS, ERC20_TOKEN_ADDRESS } from '@/lib/constants';
import {
    useLpsInfo,
    useMinLpDeposit,
    useTokenAllowance,
    useTokenBalance,
    useTokenDecimals, // Import hook for decimals
    useTokenName,     // Import hook for name (optional, for display)
} from '@/lib/queries'; // Use query hooks
import { useState } from 'react';
import { parseAbi, maxUint256, formatUnits, parseUnits } from 'viem'; // Import viem utils
import { useAccount, useWriteContract } from 'wagmi';
import { DepositInput } from './lp-deposit-form/deposit-input';
import { FormButton } from './lp-deposit-form/form-button';
import { MinLpDeposit } from './lp-deposit-form/min-lp-deposit';
import { RiskPercentage } from './lp-deposit-form/risk-percentage';
import { Loading } from '../ui/loading'; // Import Loading

export function LpDepositForm({ address }: { address: `0x${string}` | undefined }) {
    // Local state for user inputs
    const [depositAmountStr, setDepositAmountStr] = useState<string>(''); // Store as string to handle decimals
    const [newRiskPercentage, setNewRiskPercentage] = useState<number>(10);

    // --- Hooks ---
    const { isConnected } = useAccount(); // Use wagmi's hook
    const { data: writeData, error: writeError, isError: isWriteError, isPending: isWritePending, writeContract } = useWriteContract();

    // Data fetching hooks
    const { data: tokenDecimals, isLoading: isLoadingDecimals } = useTokenDecimals();
    const { data: tokenName, isLoading: isLoadingName } = useTokenName(); // Optional: for display
    const { data: balanceWei, isLoading: isLoadingBalance } = useTokenBalance(address);
    const { data: allowanceWei, isLoading: isLoadingAllowance } = useTokenAllowance(address);
    const { data: lpsInfo, isLoading: isLoadingLpsInfo } = useLpsInfo(address);
    const { data: minLpDepositWei, isLoading: isLoadingMinDeposit } = useMinLpDeposit();

    const isLoading = isLoadingDecimals || isLoadingBalance || isLoadingAllowance || isLoadingLpsInfo || isLoadingMinDeposit || isLoadingName;

    // --- Derived State & Calculations ---
    const displayDecimals = tokenDecimals ?? 18; // Default decimals if loading
    const displayName = tokenName ?? 'Token'; // Default name if loading

    const lpPrincipalWei = lpsInfo?.[0] ?? 0n;
    const isInitialDeposit = lpPrincipalWei === 0n;

    // Safely parse deposit amount string to bigint (wei)
    let depositAmountWei: bigint = 0n;
    let parseError: string | null = null;
    if (depositAmountStr && displayDecimals !== undefined) {
        try {
            depositAmountWei = parseUnits(depositAmountStr, displayDecimals);
        } catch (e) {
            // Handle invalid input format
            parseError = "Invalid amount format";
            // depositAmountWei remains 0n
        }
    }

    // Check funding and allowance using bigint
    const isWalletFunded = balanceWei !== undefined && balanceWei >= depositAmountWei;
    const hasEnoughAllowance = allowanceWei !== undefined && allowanceWei >= depositAmountWei;

    // Check if deposit meets minimum (only if it's the initial deposit)
    const meetsMinDeposit = minLpDepositWei !== undefined && depositAmountWei >= minLpDepositWei;
    const showMinDepositError = isInitialDeposit && depositAmountWei > 0n && !meetsMinDeposit;

    // --- Event Handlers ---
    const handleApprove = async () => {
        if (!address) return;
        try {
            const approveAbi = parseAbi([
                'function approve(address spender, uint256 amount) returns (bool)',
            ]);
            writeContract?.({
                abi: approveAbi,
                address: ERC20_TOKEN_ADDRESS as `0x${string}`,
                functionName: 'approve',
                args: [CONTRACT_ADDRESS as `0x${string}`, maxUint256], // Approve max
            });
        } catch (error) {
            console.error('Error approving token:', error);
        }
    };

    const handleDeposit = async () => {
        if (!address || depositAmountWei === 0n || parseError || (isInitialDeposit && !meetsMinDeposit)) {
            console.error('Deposit conditions not met:', { address, depositAmountWei, parseError, isInitialDeposit, meetsMinDeposit });
            return;
        }
        if (newRiskPercentage <= 0 || newRiskPercentage > 100) {
             console.error('Invalid risk percentage');
             return;
        }

        try {
            const lpDepositAbi = parseAbi([
                'function lpDeposit(uint256 amount, uint256 riskPercentage) returns (bool)',
            ]);
            writeContract?.({
                abi: lpDepositAbi,
                address: CONTRACT_ADDRESS as `0x${string}`,
                functionName: 'lpDeposit',
                args: [depositAmountWei, BigInt(newRiskPercentage)],
            });
        } catch (error) {
            console.error('Error depositing LP:', error);
        }
    };

    // --- Render Logic ---
    const formattedBalance = balanceWei !== undefined ? formatUnits(balanceWei, displayDecimals) : '0';
    const formattedAllowance = allowanceWei !== undefined ? formatUnits(allowanceWei, displayDecimals) : '0';

    // Determine button state/action
    let buttonAction: 'approve' | 'deposit' | 'disabled' = 'disabled';
    let buttonText = 'Connect Wallet';
    let buttonDisabled = true;

    if (isConnected && address) {
        if (isLoading) {
            buttonText = 'Loading...';
            buttonDisabled = true;
            buttonAction = 'disabled';
        } else if (depositAmountWei === 0n || parseError || showMinDepositError) {
             buttonText = 'Enter Valid Amount';
             buttonDisabled = true;
             buttonAction = 'disabled';
        } else if (!isWalletFunded) {
            buttonText = `Insufficient ${displayName}`;
            buttonDisabled = true;
            buttonAction = 'disabled';
        } else if (!hasEnoughAllowance) {
            buttonText = `Approve ${displayName}`;
            buttonDisabled = isWritePending;
            buttonAction = 'approve';
        } else {
            buttonText = 'Deposit LP';
            buttonDisabled = isWritePending;
            buttonAction = 'deposit';
        }
    }

     // Display write error if any
      const writeErrorDisplay = isWriteError ? (
          <p className="text-xs text-red-500 mt-1 text-center">Error: {writeError?.message || 'Transaction failed'}</p>
      ) : null;


    return (
        <Card className="bg-white rounded-xl shadow-sm">
            <CardContent className="p-6">
                <div className="text-center mb-4">
                    <h2 className="text-lg font-medium text-gray-500 mb-2">
                        LP Deposit Form
                    </h2>
                    {isLoading && <Loading className="h-6 w-6 mx-auto" containerClassName="p-0" />}
                </div>
                {!isLoading && isConnected && address && (
                    <form onSubmit={(e) => e.preventDefault()}>
                        {/* Pass necessary props, potentially including decimals */}
                        <DepositInput
                            walletBalance={balanceWei} // Pass bigint
                            allowance={allowanceWei} // Pass bigint
                            tokenDecimals={displayDecimals}
                            tokenName={displayName}
                            depositAmountStr={depositAmountStr}
                            setDepositAmountStr={setDepositAmountStr}
                            parseError={parseError}
                        />
                        {/* MinLpDeposit fetches its own data now */}
                        {isInitialDeposit && <MinLpDeposit minLpDeposit={minLpDepositWei ?? 0n} />}
                        {showMinDepositError && minLpDepositWei !== undefined && (
                             <p className="text-xs text-red-500 mt-1">
                                 Minimum deposit is {formatUnits(minLpDepositWei, displayDecimals)} {displayName}
                             </p>
                         )}
                        <RiskPercentage
                            newRiskPercentage={newRiskPercentage}
                            setNewRiskPercentage={setNewRiskPercentage}
                        />
                    </form>
                )}
                 {!isConnected && (
                     <div className="text-center text-gray-500 my-4">Please connect your wallet.</div>
                 )}
                <div className="flex justify-center mt-4">
                    {/* FormButton might need refactoring too, but pass necessary state for now */}
                    <FormButton
                        action={buttonAction}
                        text={buttonText}
                        disabled={buttonDisabled || isWritePending}
                        isLoading={isWritePending}
                        handleDeposit={handleDeposit}
                        handleApprove={handleApprove}
                    />
                </div>
                {writeErrorDisplay}
            </CardContent>
        </Card>
    );
}
