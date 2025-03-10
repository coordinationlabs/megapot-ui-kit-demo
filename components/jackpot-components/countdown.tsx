import { getTimeRemaining } from '@/lib/contract';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/card';

export function Countdown() {
    const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

    useEffect(() => {
        // Fetch time remaining
        const fetchTimeRemaining = async () => {
            const timeRemaining = await getTimeRemaining();
            if (timeRemaining) {
                setTimeRemaining(timeRemaining.toString());
            }
        };
        fetchTimeRemaining();

        // Update time remaining every second
        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (!prev) return null;

                const seconds = parseInt(prev, 10);
                if (seconds <= 0) return '0';

                return (seconds - 1).toString();
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <Card className="bg-white rounded-xl shadow-sm">
            <CardContent className="p-6">
                <div className="text-center">
                    <h2 className="text-lg font-medium text-gray-500 mb-2">
                        Time Remaining
                    </h2>
                    <p className="text-3xl font-bold">
                        {timeRemaining
                            ? formatTime(parseInt(timeRemaining, 10))
                            : '--:--:--'}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

const formatTime = (totalSeconds: number) => {
    if (totalSeconds <= 0) return '00:00:00';

    const hours = Math.floor(totalSeconds / 3600) % 24;
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
        2,
        '0'
    )}:${String(seconds).padStart(2, '0')}`;
};
