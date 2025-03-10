import { BaseJackpotAbi } from '@/lib/abi';
import {
    CONTRACT_ADDRESS,
    ERC20_TOKEN_ADDRESS,
    REFERRER_ADDRESS,
} from '@/lib/constants';
import { getTokenAllowance, getTokenBalance } from '@/lib/contract';
import { useEffect, useState } from 'react';
import { parseAbi } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';
import { ConnectButton } from '../connect-button';
import { Button } from '../ui/button';

export function BuyTickets({
    walletAddress,
}: {
    walletAddress: `0x${string}`;
}) {
    const { isConnected } = useAccount();
    const { data, error, isError, isPending, writeContract } =
        useWriteContract();
    const [ticketCount, setTicketCount] = useState<number>(1);
    const [walletFunded, setWalletFunded] = useState<boolean>(false);
    const [allowance, setAllowance] = useState<number>(0);

    const increment = () => setTicketCount((prev) => prev + 1);
    const decrement = () => setTicketCount((prev) => (prev > 1 ? prev - 1 : 1));

    useEffect(() => {
        // Get the balance of the wallet so we can check
        //  if it's funded
        const fetchWalletFunds = async () => {
            try {
                const balance = await getTokenBalance(walletAddress);
                if (balance) {
                    setWalletFunded(balance >= ticketCount * 10 ** 6);
                } else {
                    setWalletFunded(false);
                }
            } catch (error) {
                console.error('Error fetching wallet funded status:', error);
            }
        };

        // Fetch wallet funds every 5 seconds
        const intervalFunds = setInterval(fetchWalletFunds, 5000);
        fetchWalletFunds();

        // Get the allowance of the wallet so we can check
        //  if it's approved to buy tickets
        const fetchAllowance = async () => {
            try {
                const allowance = await getTokenAllowance(walletAddress);
                if (allowance) {
                    setAllowance(allowance);
                } else {
                    setAllowance(0);
                }
            } catch (error) {
                console.error('Error fetching allowance:', error);
            }
        };

        // Fetch allowance every 5 seconds
        const intervalAllowance = setInterval(fetchAllowance, 5000);
        fetchAllowance();

        return () => {
            clearInterval(intervalFunds);
            clearInterval(intervalAllowance);
        };
    }, [walletAddress]);

    const handleApproveToken = async () => {
        try {
            if (!walletAddress) {
                throw new Error('Wallet not connected');
            }

            const approveAbi = [
                'function approve(address spender, uint256 amount) returns (bool)',
            ];

            // Approve the token to be spent by the contract
            return writeContract?.({
                abi: parseAbi(approveAbi),
                address: ERC20_TOKEN_ADDRESS as `0x${string}`,
                functionName: 'approve',
                args: [CONTRACT_ADDRESS, walletAddress],
            });
        } catch (error) {
            console.error('Error approving token:', error);
        }
    };

    const handleBuyTicket = async () => {
        try {
            if (!walletAddress) {
                throw new Error('Wallet not connected');
            }

            const ticketCost = BigInt(ticketCount) * BigInt(10 ** 6);
            // This is YOUR wallet to collect referral fees
            const referrerAddress = REFERRER_ADDRESS;

            return writeContract?.({
                abi: BaseJackpotAbi,
                address: CONTRACT_ADDRESS as `0x${string}`,
                functionName: 'purchaseTickets',
                args: [referrerAddress, ticketCost, walletAddress],
            });
        } catch (error) {
            console.error('Error buying ticket:', error);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex items-center">
                <button
                    onClick={decrement}
                    className="bg-emerald-500 text-white px-2 hover:bg-emerald-600"
                >
                    -
                </button>
                <input
                    type="number"
                    value={ticketCount}
                    onChange={(e) =>
                        setTicketCount(Math.max(1, Number(e.target.value)))
                    }
                    className="mx-2 w-16 text-center border border-emerald-500 rounded"
                    min="1"
                    style={{ appearance: 'none', MozAppearance: 'textfield' }}
                />
                <button
                    onClick={increment}
                    className="bg-emerald-500 text-white px-2 hover:bg-emerald-600"
                >
                    +
                </button>
            </div>
            {isConnected &&
            walletFunded &&
            allowance >= ticketCount * 10 ** 6 ? (
                <Button
                    onClick={handleBuyTicket}
                    disabled={!isConnected || !walletFunded}
                    className="mt-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                    Buy Ticket
                </Button>
            ) : isConnected &&
              walletFunded &&
              allowance < ticketCount * 10 ** 6 ? (
                <Button
                    onClick={handleApproveToken}
                    disabled={!isConnected}
                    className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                    Approve USDC Token
                </Button>
            ) : isConnected && !walletFunded ? (
                <div className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white">
                    Not enough USDC in wallet
                </div>
            ) : (
                <div className="mt-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                    <ConnectButton />
                </div>
            )}
        </div>
    );
}
