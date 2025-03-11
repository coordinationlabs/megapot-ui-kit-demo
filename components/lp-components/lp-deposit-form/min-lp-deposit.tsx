export function MinLpDeposit({ minLpDeposit }: { minLpDeposit: number }) {
    return (
        <div>
            <p className="text-sm text-emerald-500">
                Minimum Initial LP Deposit: ${minLpDeposit / 10 ** 6} USDC
            </p>
        </div>
    );
}
