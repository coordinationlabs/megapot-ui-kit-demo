// Removed Input import

interface AdjustRiskPercentageProps {
    // currentRiskPercent: number; // Can be passed if needed for display, but not for control
    newRiskPercent: number; // Controlled state from parent
    setNewRiskPercent: (value: number) => void; // Setter from parent
}

export function AdjustRiskPercentage({
    newRiskPercent,
    setNewRiskPercent,
}: AdjustRiskPercentageProps) {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(e.target.value, 10);
        // Clamp value between 0 and 100
        if (isNaN(value)) {
            value = 0; // Or handle appropriately, maybe set to ''?
        }
        value = Math.max(0, Math.min(100, value));
        setNewRiskPercent(value);
    };

    return (
        <div className="flex items-center gap-2 w-full"> {/* Wrap in div for layout */}
            <label
                htmlFor="riskPercentInput"
                className="text-sm font-medium text-gray-700 whitespace-nowrap" // Adjust label styling
            >
                Risk % (0-100)
            </label>
            <input // Reverted to standard HTML input
                id="riskPercentInput"
                type="number"
                min="0"
                max="100"
                value={newRiskPercent} // Use controlled state value
                onChange={handleChange} // Use clamped change handler
                // Removed onBlur
                className="mt-1 block w-full h-10 rounded-md border-2 border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50 sm:text-sm ps-2" // Restored previous styling
                style={{
                    appearance: 'textfield', // Restore appearance style if needed for number input
                    MozAppearance: 'textfield',
                }}
            />
        </div>
    );
}
