import { getJackpotAmount } from '@/lib/contract';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/card';

export function CurrentJackpot() {
    const [jackpotAmount, setJackpotAmount] = useState<number | undefined>(
        undefined
    );

    useEffect(() => {
        const fetchJackpotAmount = async () => {
            const jackpotAmount = await getJackpotAmount();
            setJackpotAmount(jackpotAmount);
        };
        fetchJackpotAmount();
    }, []);

    return (
        <Card className="bg-white rounded-xl shadow-sm">
            <CardContent className="p-6">
                <div className="text-center">
                    <h2 className="text-lg font-medium text-gray-500 mb-2">
                        Current Jackpot
                    </h2>
                    <p className="text-4xl font-bold text-emerald-500">
                        {jackpotAmount
                            ? `$${jackpotAmount.toFixed(2)}`
                            : 'Loading...'}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
