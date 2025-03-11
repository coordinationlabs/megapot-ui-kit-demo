import { ConnectButton } from '@/components/connect-button';
import { Navigation } from '@/components/navigation';
import { SocialLinks } from '@/components/social-links';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import type React from 'react';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'MEGAPOT - Integration Demo',
    description: "World's Largest Jackpot",
    authors: [
        { name: 'MEGAPOT', url: 'https://megapot.io' },
        { name: 'mikeyb', url: 'https://github.com/mikeyb' },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <main className="flex min-h-screen flex-col items-center bg-gray-50">
                        <div className="w-full max-w-md mx-auto px-4 pb-4">
                            <header className="flex justify-between items-center py-6">
                                <div className="logo">
                                    <Image
                                        src="/logo.svg"
                                        alt="MEGAPOT INTEGRATION DEMO ICON"
                                        width={150}
                                        height={40}
                                        priority
                                    />
                                </div>
                                <ConnectButton />
                            </header>
                            <h1 className="text-3xl font-bold text-center my-8">
                                JACKPOT DEMO
                            </h1>
                            {children}
                            <div className="mt-4">
                                <SocialLinks />
                            </div>
                        </div>

                        <Navigation initialTab="jackpot" />
                    </main>
                </Providers>
            </body>
        </html>
    );
}
