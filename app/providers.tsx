'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { createConfig, WagmiProvider } from '@privy-io/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { http } from 'viem';
import { base } from 'wagmi/chains';

const queryClient = new QueryClient();

const config = createConfig({
    chains: [base],
    transports: {
        [base.id]: http(),
    },
});

export function Providers({ children }: { children: ReactNode }) {
    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
            config={{
                loginMethods: ['wallet', 'email'],
                appearance: {
                    theme: 'light',
                    accentColor: '#02C3A0',
                },
            }}
        >
            <QueryClientProvider client={queryClient}>
                <WagmiProvider config={config}>{children}</WagmiProvider>
            </QueryClientProvider>
        </PrivyProvider>
    );
}
