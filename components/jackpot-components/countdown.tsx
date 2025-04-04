import { useTimeRemaining } from '@/lib/queries';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Loading } from '../ui/loading';

const formatTime = (totalSeconds: number): string => {
    if (totalSeconds <= 0) return '00:00:00';

    // Ensure calculations handle potential floating point results from query
    const roundedSeconds = Math.max(0, Math.floor(totalSeconds));

    const hours = Math.floor(roundedSeconds / 3600); // No modulo 24 needed if just displaying duration
    const minutes = Math.floor((roundedSeconds % 3600) / 60);
    const seconds = roundedSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
        2,
        '0'
    )}:${String(seconds).padStart(2, '0')}`;
};

export function Countdown() {
    // Fetch data using TanStack Query, which handles refetching
    const { data: initialTimeRemaining, isLoading, error } = useTimeRemaining();

    // Local state for the displayed countdown, updated every second
    const [displayTime, setDisplayTime] = useState<number | null>(null);

    useEffect(() => {
        // When new data arrives from the query, reset the local countdown state
        if (initialTimeRemaining !== undefined) {
            setDisplayTime(initialTimeRemaining);
        }
    }, [initialTimeRemaining]); // Re-run when query data changes

    useEffect(() => {
        // Effect for the 1-second interval timer
        if (displayTime === null || displayTime <= 0) {
            // Don't start interval if time is null or already zero
            return;
        }

        const timer = setInterval(() => {
            setDisplayTime((prev) => {
                if (prev === null || prev <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Cleanup interval on component unmount or when displayTime becomes 0
        return () => clearInterval(timer);
    }, [displayTime]); // Re-run when displayTime changes (to stop interval at 0)

    let content;
    if (isLoading) {
        content = (
            <Loading className="h-8 w-8 mx-auto" containerClassName="p-0" />
        );
    } else if (error) {
        content = <p className="text-3xl font-bold text-red-500">Error</p>;
    } else if (displayTime !== null) {
        content = (
            <p className="text-3xl font-bold">{formatTime(displayTime)}</p>
        );
    } else {
        // Initial state before first fetch or if fetch returns undefined
        content = <p className="text-3xl font-bold">--:--:--</p>;
    }

    return (
        <Card className="bg-white rounded-xl shadow-sm mb-2">
            <CardContent className="p-2">
                <div className="text-center">
                    <h2 className="text-lg font-medium text-gray-500 mb-2">
                        Time Remaining
                    </h2>
                    {content}
                </div>
            </CardContent>
        </Card>
    );
}
