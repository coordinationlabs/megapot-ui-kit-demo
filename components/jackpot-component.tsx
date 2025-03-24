'use client';

import { Card, CardContent } from '@/components/ui/card';
import { getUsersInfo } from '@/lib/contract';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { BuyTickets } from './jackpot-components/buy-tickets';
import { Countdown } from './jackpot-components/countdown';
import { CurrentJackpot } from './jackpot-components/current-jackpot';
import { LastJackpot } from './jackpot-components/last-jackpot';
import { TicketPrice } from './jackpot-components/ticket-price';
import { WinningOdds } from './jackpot-components/winning-odds';
import { WithdrawWinnings } from './jackpot-components/withdraw-winnings';

export function JackpotComponent() {
    const { address, isConnected } = useAccount();

    const [winningsAvailable, setWinningsAvailable] = useState<number>(0);

    useEffect(() => {
        if (!address) return;
        const fetchWinningsAvailable = async () => {
            const usersInfo = await getUsersInfo(address);
            if (!usersInfo) return;
            const winningsAvailable = usersInfo.winningsClaimable;
            setWinningsAvailable(Number(winningsAvailable));
        };
        fetchWinningsAvailable();
    }, [address]);
    return (
        <div className="space-y-6">
            {winningsAvailable > 0 && (
                <WithdrawWinnings winningsAvailable={winningsAvailable} />
            )}

            <CurrentJackpot />

            <Countdown />

            <Card className="bg-white rounded-xl shadow-sm">
                <CardContent className="p-6">
                    <div className="text-center">
                        <TicketPrice />
                        <WinningOdds />
                        {isConnected && address && (
                            <BuyTickets walletAddress={address} />
                        )}
                    </div>
                </CardContent>
            </Card>

            <LastJackpot />
        </div>
    );
}
