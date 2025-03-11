import { getJackpotOdds } from '@/lib/contract';
import { useEffect, useState } from 'react';

export function WinningOdds() {
    const [jackpotOdds, setJackpotOdds] = useState<number | null>(null);

    useEffect(() => {
        const fetchJackpotOdds = async () => {
            const odds = await getJackpotOdds();
            setJackpotOdds(odds || null);
        };
        fetchJackpotOdds();
    }, []);

    return (
        <p className="text-sm text-gray-500 mb-4">
            Odds of winning: 1 in {Number(jackpotOdds).toFixed(2)}
        </p>
    );
}
