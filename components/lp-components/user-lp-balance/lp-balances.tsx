export function LpBalances({
    principal,
    inRange,
    currentRiskPercent,
}: {
    principal: number;
    inRange: number;
    currentRiskPercent: number;
}) {
    return (
        <>
            <div className="flex justify-between">
                <p className="font-bold text-emerald-500">Principal:</p>
                <p className="font-bold text-emerald-500">
                    {(principal / 10 ** 6).toFixed(2)}
                </p>
            </div>
            <div className="flex justify-between">
                <p className="font-bold text-emerald-500">Position In Range:</p>
                <p className="font-bold text-emerald-500">
                    {(inRange / 10 ** 6).toFixed(2)}
                </p>
            </div>
            <div className="flex justify-between">
                <p className="font-bold text-emerald-500">Risk Percent:</p>
                <p className="font-bold text-emerald-500">
                    {currentRiskPercent}%
                </p>
            </div>
        </>
    );
}
