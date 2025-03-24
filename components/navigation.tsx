'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';

// Update the component to accept an initialTab prop
export function Navigation({
    initialTab = 'history',
}: {
    initialTab?: string;
}) {
    const [activeTab, setActiveTab] = useState(initialTab);

    const tabs = [
        { id: 'jackpot', label: 'Jackpot', href: '/jackpot' },
        { id: 'liquidity', label: 'Liquidity', href: '/liquidity' },
        { id: 'history', label: 'History', href: '/history' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
            <div className="flex justify-between max-w-xl mx-auto">
                {tabs.map((tab) => (
                    <Link
                        key={tab.id}
                        href={tab.href}
                        className={cn(
                            'flex-1 py-4 px-2 text-center text-gray-500',
                            activeTab === tab.id &&
                                'text-emerald-500 border-t-2 border-emerald-500'
                        )}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
