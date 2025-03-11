export function FormButton({
    walletFunded,
    allowanceFunded,
    depositAmount,
    tempDepositAmount,
    handleDeposit,
    handleApprove,
    walletBalance,
}: {
    walletFunded: boolean;
    allowanceFunded: boolean;
    depositAmount: number;
    tempDepositAmount: number;
    handleDeposit: () => void;
    handleApprove: () => void;
    walletBalance: number;
}) {
    let buttonContent;

    if (depositAmount === 0 || tempDepositAmount === 0) {
        buttonContent = (
            <button
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
                disabled
            >
                Deposit Amount Cannot Be 0
            </button>
        );
    } else if (walletFunded && allowanceFunded && tempDepositAmount > 0) {
        buttonContent = (
            <button
                onClick={handleDeposit}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
                Deposit
            </button>
        );
    } else if (walletFunded && !allowanceFunded) {
        buttonContent = (
            <button
                onClick={handleApprove}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
                Need to Approve USDC
            </button>
        );
    } else if (!walletFunded && tempDepositAmount > walletBalance) {
        buttonContent = (
            <button
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
                disabled
            >
                Need to Fund Wallet
            </button>
        );
    } else {
        buttonContent = (
            <button
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md"
                disabled
            >
                Enter Amount
            </button>
        );
    }

    return <>{buttonContent}</>;
}
