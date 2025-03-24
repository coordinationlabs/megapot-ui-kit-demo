'use client';

import { getLpPoolStatus, getLpsInfo } from '@/lib/contract';
import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { LpDepositForm } from './lp-components/lp-deposit-form';
import { LpPoolStatus } from './lp-components/lp-pool-status';
import { UserLpBalances } from './lp-components/user-lp-balances';

interface LpState {
    lpsInfo?: [bigint, bigint, bigint, boolean];
    lpPoolStatus?: boolean;
    isLoading: boolean;
    error?: string;
}

export function LiquidityComponent() {
    const { address, isConnected } = useAccount();
    const [state, setState] = useState<LpState>({
        isLoading: true,
    });

    const fetchLpPoolStatus = useCallback(async () => {
        try {
            const status = await getLpPoolStatus();
            setState((prev) => ({ ...prev, lpPoolStatus: status }));
        } catch (error) {
            setState((prev) => ({
                ...prev,
                error: 'Failed to fetch pool status',
            }));
        } finally {
            setState((prev) => ({ ...prev, isLoading: false }));
        }
    }, []);

    const fetchLpsInfo = useCallback(async () => {
        if (!address) return;

        setState((prev) => ({ ...prev, isLoading: true }));
        try {
            const info = await getLpsInfo(address as `0x${string}`);
            setState((prev) => ({ ...prev, lpsInfo: info }));
        } catch (error) {
            setState((prev) => ({
                ...prev,
                error: 'Failed to fetch LP info',
                lpsInfo: undefined,
            }));
        } finally {
            setState((prev) => ({ ...prev, isLoading: false }));
        }
    }, [address]);

    useEffect(() => {
        fetchLpPoolStatus();
        return () => {
            setState({ isLoading: true });
        };
    }, [fetchLpPoolStatus]);

    useEffect(() => {
        if (isConnected && address) {
            fetchLpsInfo();
        }
    }, [isConnected, address, fetchLpsInfo]);

    if (state.error) {
        return <div className="text-red-500">{state.error}</div>;
    }

    return (
        <div className="space-y-6">
            {state.isLoading ? (
                <div className="animate-pulse">Loading...</div>
            ) : (
                <>
                    <LpPoolStatus poolStatus={state.lpPoolStatus ?? false} />
                    {isConnected && address && state.lpPoolStatus && (
                        <LpDepositForm address={address} />
                    )}
                    {isConnected &&
                        address &&
                        state.lpsInfo &&
                        state.lpsInfo[0] > BigInt(0) && (
                            <UserLpBalances lpInfo={state.lpsInfo} />
                        )}
                </>
            )}
        </div>
    );
}
