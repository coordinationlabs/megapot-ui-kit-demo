export function AdjustRiskPercentage({
    riskPercent,
    tempRiskPercent,
    setRiskPercent,
    setTempRiskPercent,
}: {
    riskPercent: number;
    tempRiskPercent: number;
    setRiskPercent: (riskPercent: number) => void;
    setTempRiskPercent: (riskPercent: number) => void;
}) {
    return (
        <>
            <label
                htmlFor="riskPercentInput"
                className="text-sm font-medium text-gray-700 w-1/2"
            >
                Adjust Risk %
            </label>
            <input
                id="riskPercentInput"
                type="number"
                min="0"
                max="100"
                value={tempRiskPercent}
                onChange={(e) => setTempRiskPercent(Number(e.target.value))}
                onBlur={() => {
                    setRiskPercent(tempRiskPercent);
                }}
                className="mt-1 block w-full h-10 rounded-md border-2 border-gray-500 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-offset-0 sm:text-sm ps-2"
                style={{
                    appearance: 'none',
                    MozAppearance: 'textfield',
                }}
            />
        </>
    );
}
