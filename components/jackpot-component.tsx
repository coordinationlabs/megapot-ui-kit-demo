'use client';

import { Card, CardContent } from '@/components/ui/card';
import { REFERRER_ADDRESS } from '@/lib/constants';
import { getUsersInfo } from '@/lib/contract';
import {
    JACKPOT,
    Jackpot,
    MainnetJackpotName,
} from '@coordinationlabs/megapot-ui-kit';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { base } from 'wagmi/chains';
import { ConnectButton } from './connect-button';
import { Countdown } from './jackpot-components/countdown';
import { LastJackpot } from './jackpot-components/last-jackpot';
import { TicketPrice } from './jackpot-components/ticket-price';
import { WinningOdds } from './jackpot-components/winning-odds';
import { WithdrawWinnings } from './jackpot-components/withdraw-winnings';

const mainnetContract = JACKPOT[base.id]?.[MainnetJackpotName.USDC]!;

if (!mainnetContract) {
    throw new Error('Mainnet contract not found');
}

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

            <Card className="bg-white rounded-xl shadow-sm">
                <CardContent className="p-6">
                    <div className="text-center">
                        <TicketPrice />
                        <WinningOdds />
                        <Countdown />
                        {isConnected && address ? (
                            <Jackpot
                                contract={mainnetContract}
                                referrerAddress={REFERRER_ADDRESS}
                            />
                        ) : (
                            <div className="text-center">
                                <ConnectButton />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* NOTE: Free RPC servers are not reliable for traversing old logs.  
                You will need to have a reliable RPC endpoint setup in /app/viem-client.ts */}
            <LastJackpot />
        </div>
    );
}
