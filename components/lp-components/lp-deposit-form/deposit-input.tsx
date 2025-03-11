import { useEffect, useState } from 'react';

export function DepositInput({
    walletBalance,
    allowance,
    setWalletFunded,
    setAllowanceFunded,
    setDepositAmount,
}: {
    walletBalance: number;
    allowance: number;
    setWalletFunded: (funded: boolean) => void;
    setAllowanceFunded: (funded: boolean) => void;
    setDepositAmount: (amount: number) => void;
}) {
    const [tempDepositAmount, setTempDepositAmount] = useState<number>(0);
    useEffect(() => {
        setDepositAmount(tempDepositAmount);
        // Ensure wallet and allowance funding states are updated based on tempDepositAmount
        setWalletFunded(
            walletBalance >= tempDepositAmount && tempDepositAmount > 0
        );
        setAllowanceFunded(
            allowance >= tempDepositAmount && tempDepositAmount > 0
        );
    }, [tempDepositAmount, walletBalance, allowance]);

    return (
        <>
            <label className="block text-left mb-1">Add USDC Amount</label>
            <input
                type="number"
                className="mt-1 block w-full h-10 rounded-md border-2 border-gray-500 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-offset-0 sm:text-sm ps-2"
                min={0}
                value={tempDepositAmount}
                onChange={(e) => {
                    setTempDepositAmount(Number(e.target.value));
                    if (
                        walletBalance >= Number(e.target.value) &&
                        Number(e.target.value) > 0
                    ) {
                        setWalletFunded(true);
                    } else {
                        setWalletFunded(false);
                    }
                    if (
                        allowance >= Number(e.target.value) &&
                        Number(e.target.value) > 0
                    ) {
                        setAllowanceFunded(true);
                    } else {
                        setAllowanceFunded(false);
                    }
                }}
                onBlur={(e) => {
                    setDepositAmount(tempDepositAmount);
                }}
                style={{
                    appearance: 'none',
                    MozAppearance: 'textfield',
                }}
            />
        </>
    );
}
