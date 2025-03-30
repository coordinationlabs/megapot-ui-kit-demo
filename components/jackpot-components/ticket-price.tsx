import { useTicketPrice, useTokenName } from '@/lib/queries';
import { Loading } from '../ui/loading';

export function TicketPrice() {
    const { data: ticketPrice, isLoading: isLoadingPrice, error: errorPrice } = useTicketPrice();
    const { data: tokenName, isLoading: isLoadingName, error: errorName } = useTokenName();

    const displayPrice = ticketPrice?.toLocaleString() ?? '...'; // Format potentially large numbers
    const displayName = tokenName ?? 'TOKEN'; // Default name

    let content;
    if (isLoadingPrice || isLoadingName) {
        content = <Loading className="h-8 w-24" />; // Adjust size as needed
    } else if (errorPrice || errorName) {
        content = <p className="text-2xl font-bold mb-4 text-red-500">Error</p>;
    } else {
        content = <p className="text-2xl font-bold mb-4">{displayPrice} {displayName}</p>;
    }

    return (
        <div>
            <h2 className="text-lg font-medium text-gray-500 mb-2">
                Ticket Price
            </h2>
            {content}
        </div>
    );
}
