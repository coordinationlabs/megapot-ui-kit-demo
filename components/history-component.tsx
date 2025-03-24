'use client';

import { useAccount } from 'wagmi';
import { UserPurchaseHistory } from './history-components/user-purchase-history';

export function HistoryComponent() {
    const { address, isConnected } = useAccount();
    return (
        <>
            {isConnected && address ? (
                <UserPurchaseHistory address={address} />
            ) : (
                <div className="pb-6">
                    <p className="text-lg text-center text-emerald-500">
                        Connect wallet to view your purchase history
                    </p>
                </div>
            )}
        </>
    );
}
