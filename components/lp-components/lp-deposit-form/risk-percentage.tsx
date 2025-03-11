export function RiskPercentage({
    newRiskPercentage,
    setNewRiskPercentage,
}: {
    newRiskPercentage: number;
    setNewRiskPercentage: (percentage: number) => void;
}) {
    return (
        <>
            <label className="block text-left mb-1 mt-4">
                Set Risk Percentage
            </label>
            <select
                onChange={(e) => {
                    const value = e.target.value;
                    setNewRiskPercentage(
                        value === 'custom' ? 0 : Number(value)
                    );
                }}
                defaultValue={'10'}
                className="mt-1 block w-full h-10 rounded-md border-2 border-gray-500 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-offset-0 sm:text-sm ps-2"
            >
                <option value="100">100%</option>
                <option value="50">50%</option>
                <option value="25">25%</option>
                <option value="10">10%</option>
                <option value="custom">Custom</option>
            </select>
            {newRiskPercentage === 0 && (
                <input
                    type="number"
                    min={0}
                    max={100}
                    onChange={(e) => {
                        const customValue = Number(e.target.value);
                        if (!isNaN(customValue) && customValue > 0) {
                            setNewRiskPercentage(customValue);
                        }
                    }}
                    className="mt-1 block w-full h-10 rounded-md border-2 border-gray-500 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-offset-0 sm:text-sm ps-2"
                    placeholder="Enter custom risk percentage"
                    style={{
                        appearance: 'none',
                        MozAppearance: 'textfield',
                    }}
                />
            )}
        </>
    );
}
