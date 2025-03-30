import { BaseJackpotAbi } from '@/lib/abi';
import {
    CONTRACT_ADDRESS,
    ERC20_TOKEN_ADDRESS,
    REFERRER_ADDRESS,
} from '@/lib/constants';
import {
    useTokenAllowance,
    useTokenBalance,
    useTicketPriceInWei, // Use the hook for price in wei
    useTokenName,
    useTokenDecimals,
} from '@/lib/queries'; // Use query hooks
import { useState } from 'react';
import { parseAbi, maxUint256 } from 'viem'; // Corrected: Import maxUint256 for approval
import { useAccount, useWriteContract } from 'wagmi';
import { ConnectButton } from '../connect-button';
import { Button } from '../ui/button';
import { Loading } from '../ui/loading'; // Import Loading

export function BuyTickets({
    walletAddress,
}: {
    walletAddress: `0x${string}` | undefined; // Allow undefined if not connected
}) {
    const { isConnected } = useAccount();
    const { data: writeData, error: writeError, isError: isWriteError, isPending: isWritePending, writeContract } =
        useWriteContract();

    const [ticketCount, setTicketCount] = useState<number>(1);

    // Fetch data using hooks
    const { data: balanceWei, isLoading: isLoadingBalance } = useTokenBalance(walletAddress);
    const { data: allowanceWei, isLoading: isLoadingAllowance } = useTokenAllowance(walletAddress);
    const { data: ticketPriceWei, isLoading: isLoadingPrice } = useTicketPriceInWei(); // Use the correct hook
    const { data: tokenName, isLoading: isLoadingName } = useTokenName();
    const { data: tokenDecimals, isLoading: isLoadingDecimals } = useTokenDecimals();

    const isLoading = isLoadingBalance || isLoadingAllowance || isLoadingPrice || isLoadingName || isLoadingDecimals;

    const increment = () => setTicketCount((prev) => prev + 1);
    const decrement = () => setTicketCount((prev) => (prev > 1 ? prev - 1 : 1));

    // Calculate total cost in wei using bigint
    const ticketCostWei = ticketPriceWei !== undefined ? BigInt(ticketCount) * ticketPriceWei : 0n;

    // Check funding and allowance using bigint
    const isWalletFunded = balanceWei !== undefined && balanceWei >= ticketCostWei;
    const hasEnoughAllowance = allowanceWei !== undefined && allowanceWei >= ticketCostWei;
    const displayTokenName = tokenName ?? 'Token'; // Fallback token name

    const handleApproveToken = async () => {
        try {
            if (!walletAddress || ticketCostWei === 0n) { // Check ticketCostWei too
                throw new Error('Wallet not connected or ticket price unavailable');
            }

            const approveAbi = parseAbi([ // Use parseAbi directly
                'function approve(address spender, uint256 amount) returns (bool)',
            ]);

            // Approve the maximum amount for simplicity, or ticketCostWei if preferred
            const approveAmount = maxUint256; // Corrected: Use maxUint256

            writeContract?.({
                abi: approveAbi,
                address: ERC20_TOKEN_ADDRESS as `0x${string}`,
                functionName: 'approve',
                args: [CONTRACT_ADDRESS, approveAmount], // Approve contract to spend
            });
        } catch (error) {
            console.error('Error approving token:', error);
            // Add user feedback here (e.g., toast notification)
        }
    };

    const handleBuyTicket = async () => {
        try {
            if (!walletAddress || ticketCostWei === 0n) {
                throw new Error('Wallet not connected or ticket cost cannot be calculated');
            }

            // This is YOUR wallet to collect referral fees
            const referrerAddress = REFERRER_ADDRESS;

            writeContract?.({
                abi: BaseJackpotAbi,
                address: CONTRACT_ADDRESS as `0x${string}`,
                functionName: 'purchaseTickets',
                // Args should match contract: referrer, amount, recipient
                // Assuming recipient is the buyer (walletAddress)
                args: [referrerAddress, ticketCostWei, walletAddress],
            });
        } catch (error) {
            console.error('Error buying ticket:', error);
            // Add user feedback here
        }
    };

    // Determine button state
    let buttonContent;
    if (!isConnected) {
        buttonContent = <ConnectButton />;
    } else if (isLoading) {
        buttonContent = <Loading className="h-6 w-6" containerClassName="p-1" />;
    } else if (!isWalletFunded) {
        buttonContent = (
            <Button disabled className="mt-2 w-full bg-orange-500 text-white cursor-not-allowed">
                Not enough {displayTokenName}
            </Button>
        );
    } else if (!hasEnoughAllowance) {
        buttonContent = (
            <Button
                onClick={handleApproveToken}
                disabled={isWritePending}
                className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
                {isWritePending ? <Loading className="h-5 w-5 mr-2" containerClassName="p-0 inline-flex" /> : null}
                Approve {displayTokenName}
            </Button>
        );
    } else {
        buttonContent = (
            <Button
                onClick={handleBuyTicket}
                disabled={isWritePending}
                className="mt-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white"
            >
                 {isWritePending ? <Loading className="h-5 w-5 mr-2" containerClassName="p-0 inline-flex" /> : null}
                Buy Ticket{ticketCount > 1 ? 's' : ''}
            </Button>
        );
    }

    // Display write error if any
     const writeErrorDisplay = isWriteError ? (
         // Removed shortMessage as it might not exist on the error type
         <p className="text-xs text-red-500 mt-1">Error: {writeError?.message || 'Transaction failed'}</p>
     ) : null;


    return (
        <div className="flex flex-col items-center">
            <div className="flex items-center">
                <button
                    onClick={decrement}
                    disabled={isWritePending || isLoading}
                    className="bg-emerald-500 text-white px-3 py-1 rounded-l hover:bg-emerald-600 disabled:bg-gray-400"
                >
                    -
                </button>
                <input
                    type="number"
                    value={ticketCount}
                    onChange={(e) =>
                        setTicketCount(Math.max(1, Number(e.target.value) || 1)) // Ensure value is at least 1
                    }
                    className="mx-0 w-16 text-center border-t border-b border-emerald-500 py-1 focus:outline-none"
                    min="1"
                    disabled={isWritePending || isLoading}
                    style={{ appearance: 'textfield', MozAppearance: 'textfield' }}
                />
                <button
                    onClick={increment}
                     disabled={isWritePending || isLoading}
                    className="bg-emerald-500 text-white px-3 py-1 rounded-r hover:bg-emerald-600 disabled:bg-gray-400"
                >
                    +
                </button>
            </div>
            <div className="mt-2 w-full">
                {buttonContent}
                {writeErrorDisplay}
            </div>
             {/* Optionally display raw data for debugging */}
             {/* <pre className="text-xs mt-2 text-left overflow-auto">
                 isLoading: {isLoading.toString()}<br />
                 PriceWei: {ticketPriceWei?.toString() ?? 'N/A'}<br />
                 CostWei: {ticketCostWei.toString()}<br />
                 BalanceWei: {balanceWei?.toString() ?? 'N/A'}<br />
                 AllowanceWei: {allowanceWei?.toString() ?? 'N/A'}<br />
                 isFunded: {isWalletFunded.toString()}<br />
                 hasAllowance: {hasEnoughAllowance.toString()}<br />
                 isWritePending: {isWritePending.toString()}
             </pre> */}
        </div>
    );
}
