import { useState, useEffect } from 'react';

export function RiskPercentage({
    newRiskPercentage,
    setNewRiskPercentage,
}: {
    newRiskPercentage: number;
    setNewRiskPercentage: (percentage: number) => void;
}) {
    // State to track the select dropdown's value ('100', '50', '25', '10', 'custom')
    const [selectedValue, setSelectedValue] = useState<string>(() => {
        const predefined = ['100', '50', '25', '10'];
        return predefined.includes(String(newRiskPercentage))
            ? String(newRiskPercentage)
            : 'custom';
    });

    // State to track the value of the custom input field
    const [customInputValue, setCustomInputValue] = useState<string>(() => {
        const predefined = ['100', '50', '25', '10'];
        return predefined.includes(String(newRiskPercentage))
            ? ''
            : String(newRiskPercentage);
    });

    // Effect to sync state if the prop changes from outside
    useEffect(() => {
        const predefined = ['100', '50', '25', '10'];
        const isPredefined = predefined.includes(String(newRiskPercentage));
        setSelectedValue(isPredefined ? String(newRiskPercentage) : 'custom');
        setCustomInputValue(isPredefined ? '' : String(newRiskPercentage));
    }, [newRiskPercentage]);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedValue(value);

        if (value === 'custom') {
            // When switching to custom, set the risk percentage based on the current custom input value (if valid)
            const numValue = Number(customInputValue);
            if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
                setNewRiskPercentage(numValue);
            } else {
                // Set to 0 if invalid or empty
                setNewRiskPercentage(0);
            }
        } else {
            // If a predefined value is selected, update the risk percentage
            setNewRiskPercentage(Number(value));
        }
    };

    const handleCustomInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;
        setCustomInputValue(value);

        // Update the main risk percentage state as the user types in the custom input
        const numValue = Number(value);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
            setNewRiskPercentage(numValue);
        } else if (value === '') {
            // Handle empty input - set risk to 0
            setNewRiskPercentage(0);
        }
        // If invalid number (e.g., letters, >100), don't update setNewRiskPercentage for now
    };

    return (
        <>
            <label className="block text-left mb-1 mt-4">
                Set Risk Percentage
            </label>
            <select
                value={selectedValue} // Controlled component
                onChange={handleSelectChange}
                className="mt-1 block w-full h-10 rounded-md border-2 border-gray-500 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-offset-0 sm:text-sm ps-2"
            >
                <option value="100">100%</option>
                <option value="50">50%</option>
                <option value="25">25%</option>
                <option value="10">10%</option>
                <option value="custom">Custom</option>
            </select>
            {selectedValue === 'custom' && ( // Show input based on selectedValue state
                <input
                    type="number"
                    min={0}
                    max={100}
                    value={customInputValue} // Controlled component
                    onChange={handleCustomInputChange}
                    className="mt-2 block w-full h-10 rounded-md border-2 border-gray-500 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-offset-0 sm:text-sm ps-2" // Added mt-2 for spacing
                    placeholder="Enter % (0-100)"
                    style={{
                        appearance: 'none',
                        MozAppearance: 'textfield',
                    }}
                />
            )}
        </>
    );
}
