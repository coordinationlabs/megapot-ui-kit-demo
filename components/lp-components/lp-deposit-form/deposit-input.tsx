import { formatUnits } from 'viem';

interface DepositInputProps {
    walletBalance: bigint | undefined;
    allowance: bigint | undefined; // Keep allowance prop if needed for display/logic here
    tokenDecimals: number;
    tokenSymbol: string;
    depositAmountStr: string; // Controlled input value (string)
    setDepositAmountStr: (value: string) => void;
    parseError: string | null;
}

export function DepositInput({
    walletBalance,
    allowance,
    tokenDecimals,
    tokenSymbol,
    depositAmountStr,
    setDepositAmountStr,
    parseError,
}: DepositInputProps) {
    const formattedBalance =
        walletBalance !== undefined
            ? parseFloat(
                  formatUnits(walletBalance, tokenDecimals)
              ).toLocaleString(undefined, { maximumFractionDigits: 4 }) // Show more precision
            : '0';

    const handleMaxClick = () => {
        if (walletBalance !== undefined) {
            setDepositAmountStr(formatUnits(walletBalance, tokenDecimals));
        }
    };

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
                <label
                    htmlFor="deposit-amount"
                    className="block text-sm font-medium text-gray-700"
                >
                    Deposit Amount ({tokenSymbol})
                </label>
                <span className="text-xs text-gray-500">
                    Balance: {formattedBalance}
                    <button
                        type="button"
                        onClick={handleMaxClick}
                        className="ml-2 text-xs text-emerald-600 hover:text-emerald-800 font-medium disabled:text-gray-400"
                        disabled={
                            walletBalance === undefined || walletBalance === 0n
                        }
                    >
                        MAX
                    </button>
                </span>
            </div>
            <input
                id="deposit-amount"
                type="text" // Use text to allow decimal input matching token decimals
                inputMode="decimal" // Hint for mobile keyboards
                placeholder="0.0"
                className={`mt-1 block w-full h-10 rounded-md border-2 ${
                    parseError ? 'border-red-500' : 'border-gray-300'
                } shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50 sm:text-sm px-3`}
                value={depositAmountStr}
                onChange={(e) =>
                    setDepositAmountStr(e.target.value.replace(/[^0-9.]/g, ''))
                } // Basic input filtering
                // No min/max needed for text input, validation done in parent
            />
            {parseError && (
                <p className="text-xs text-red-500 mt-1">{parseError}</p>
            )}
            {/* Removed allowance display, can be added back if needed */}
        </div>
    );
}
