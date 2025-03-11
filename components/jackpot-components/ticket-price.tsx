import { getTicketPrice } from '@/lib/contract';
import { useEffect, useState } from 'react';

export function TicketPrice() {
    const [ticketPrice, setTicketPrice] = useState<string | null>(null);

    useEffect(() => {
        const fetchTicketPrice = async () => {
            const price = await getTicketPrice();
            setTicketPrice(price?.toString() || null);
        };
        fetchTicketPrice();
    }, []);

    return (
        <div>
            <h2 className="text-lg font-medium text-gray-500 mb-2">
                Ticket Price
            </h2>
            <p className="text-2xl font-bold mb-4">{ticketPrice} USDC</p>
        </div>
    );
}
