interface AdjustRiskPercentageProps {
    newRiskPercent: number;
    setNewRiskPercent: (value: number) => void;
}

export function AdjustRiskPercentage({
    newRiskPercent,
    setNewRiskPercent,
}: AdjustRiskPercentageProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(e.target.value, 10);
        if (isNaN(value)) {
            value = 0;
        }
        value = Math.max(0, Math.min(100, value));
        setNewRiskPercent(value);
    };

    return (
        <div className="flex items-center gap-2 w-full">
            <label
                htmlFor="riskPercentInput"
                className="text-sm font-medium text-gray-700 whitespace-nowrap"
            >
                Risk % (0-100)
            </label>
            <input
                id="riskPercentInput"
                type="number"
                min="0"
                max="100"
                value={newRiskPercent}
                onChange={handleChange}
                className="mt-1 block w-full h-10 rounded-md border-2 border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50 sm:text-sm ps-2"
                style={{
                    appearance: 'textfield',
                    MozAppearance: 'textfield',
                }}
            />
        </div>
    );
}
