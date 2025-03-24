import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/card';

type UserPurchaseHistory = {
    userAddress: string;
    ticketsPurchased: number;
    blockNumber: number;
    transactionHash: string;
};
export function UserPurchaseHistory({ address }: { address: string }) {
    const [userPurchaseHistory, setUserPurchaseHistory] = useState<
        UserPurchaseHistory[] | []
    >([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserPurchaseHistory = async () => {
            const response = await fetch('/api/user-purchase-history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    address: address,
                }),
            });
            const data = await response.json();

            // Reset the user purchase history
            setUserPurchaseHistory([]);

            data.forEach((event: any) => {
                const userAddress = `0x${event.topics[1].substring(26, 66)}`;
                const ticketsPurchased =
                    parseInt(event.data, 16) / 10000 / ((100 - 30) / 100);
                const blockNumber = parseInt(event.blockNumber, 16);
                const transactionHash = event.transactionHash;

                setUserPurchaseHistory((prev) => [
                    ...prev,
                    {
                        userAddress,
                        ticketsPurchased,
                        blockNumber,
                        transactionHash,
                    },
                ]);
            });
            setIsLoading(false);
        };
        fetchUserPurchaseHistory();
    }, [address]);

    return (
        <Card className="bg-white rounded-xl shadow-sm">
            <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center">
                    <h2 className="text-lg font-medium text-gray-500 mb-2">
                        Purchase History
                    </h2>
                    {userPurchaseHistory.length > 0 && !isLoading ? (
                        <>
                            {userPurchaseHistory.map((purchase) => (
                                <div
                                    key={purchase.transactionHash}
                                    className="flex flex-col w-full border-b border-gray-200"
                                >
                                    <div className="flex justify-between w-full">
                                        <p className="text-lg text-emerald-500">
                                            Tickets Purchased:
                                        </p>
                                        <p className="text-lg text-emerald-500">
                                            {purchase.ticketsPurchased}
                                        </p>
                                    </div>
                                    <div className="flex justify-between w-full">
                                        <p className="text-lg text-emerald-500">
                                            Block:
                                        </p>
                                        <p className="text-lg text-emerald-500">
                                            {purchase.blockNumber}
                                        </p>
                                    </div>
                                    <div className="flex justify-between w-full">
                                        <p className="text-lg text-emerald-500">
                                            Tx Hash:
                                        </p>
                                        <p className="text-lg text-blue-500">
                                            <Link
                                                target="_blank"
                                                href={`https://basescan.org/tx/${purchase.transactionHash}`}
                                            >
                                                BaseScan Tx
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : userPurchaseHistory.length === 0 && !isLoading ? (
                        <p className="text-lg">No purchase history found</p>
                    ) : (
                        <p className="text-lg">Loading...</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
