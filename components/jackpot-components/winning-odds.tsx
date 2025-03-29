import { useJackpotOdds } from '@/lib/queries'; // Use query hook

export function WinningOdds() {
    const { data: jackpotOdds, isLoading, error } = useJackpotOdds();

    let content;
    if (isLoading) {
        content = "Loading odds...";
    } else if (error || jackpotOdds === undefined || jackpotOdds === null || jackpotOdds <= 0) {
        // Handle error or invalid odds (e.g., division by zero if ticket price is 0)
        content = "Odds: N/A";
    } else {
        // Format the odds. Ensure jackpotOdds is treated as a number.
        const oddsValue = typeof jackpotOdds === 'number' ? jackpotOdds : Number(jackpotOdds);
        content = `Odds of winning: 1 in ${oddsValue.toFixed(2)}`;
    }

    return (
        <p className="text-sm text-gray-500 mb-4">
            {content}
        </p>
    );
}
