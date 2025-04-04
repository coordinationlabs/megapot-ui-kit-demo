import { useTicketPrice, useTokenName, useTokenSymbol } from '@/lib/queries';
import { Loading } from '../ui/loading';

export function TicketPrice() {
    const {
        data: ticketPrice,
        isLoading: isLoadingPrice,
        error: errorPrice,
    } = useTicketPrice();
    const {
        data: tokenName,
        isLoading: isLoadingName,
        error: errorName,
    } = useTokenName();
    const {
        data: tokenSymbol,
        isLoading: isLoadingSymbol,
        error: errorSymbol,
    } = useTokenSymbol();

    const displayPrice = ticketPrice?.toLocaleString() ?? '...'; // Format potentially large numbers
    const displayName = tokenSymbol ?? 'TOKEN'; // Default name

    let content;
    if (isLoadingPrice || isLoadingName || isLoadingSymbol) {
        content = <Loading className="h-8 w-8 mx-auto" />; // Adjust size as needed
    } else if (errorPrice || errorName || errorSymbol) {
        content = <p className="text-2xl font-bold mb-4 text-red-500">Error</p>;
    } else {
        content = (
            <p className="text-2xl font-bold mb-4">
                {displayPrice} {displayName}
            </p>
        );
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
