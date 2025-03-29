'use client';

import { Button } from '@/components/ui/button';
import { ChevronDown, LogOut, User, AlertTriangle } from 'lucide-react'; // Added AlertTriangle
import { useEffect, useRef, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'; // Added useSwitchChain
import { base } from 'wagmi/chains'; // Added base chain import

export function ConnectButton() {
    const { address, isConnected, chainId } = useAccount(); // Added chainId
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const { switchChain } = useSwitchChain(); // Added switchChain
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isWrongNetwork = isConnected && chainId !== base.id;

    const handleConnect = async () => {
        // If connected but on the wrong network, switch chain
        if (isWrongNetwork) {
            switchChain?.({ chainId: base.id });
        }
        // If not connected, initiate connection
        else if (!isConnected) {
            try {
                // Request account access
                await window.ethereum.request({
                    method: 'eth_requestAccounts',
                });
                connect({ connector: connectors[0] });
                setIsOpen(true); // Keep dropdown open after connecting
            } catch (error) {
                console.error('Error connecting to wallet:', error);
            }
        }
        // If connected and on the correct network, toggle dropdown
        else {
            setIsOpen(!isOpen);
        }
    };

    const handleDisconnect = () => {
        disconnect();
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                onClick={handleConnect}
                variant={isWrongNetwork ? 'destructive' : 'outline'} // Change variant if wrong network
                className={`font-medium px-4 py-2 rounded-md ${
                    isWrongNetwork
                        ? 'bg-red-100 text-red-600 border-red-200 hover:bg-red-200 hover:text-red-700' // Destructive styling
                        : 'bg-emerald-50 text-emerald-500 border-emerald-100 hover:bg-emerald-100 hover:text-emerald-600' // Default styling
                }`}
            >
                {isWrongNetwork ? (
                    <div className="flex items-center">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        <span>Switch to Base</span>
                    </div>
                ) : isConnected && address ? (
                    <div className="flex items-center">
                        <span>
                            {address.slice(0, 6)}...
                            {address.slice(-4)}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </div>
                ) : (
                    'Connect Wallet'
                )}
            </Button>

            {/* Only show dropdown if connected AND on the correct network */}
            {isOpen && isConnected && !isWrongNetwork && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                        <button
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsOpen(false)}
                        >
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </button>
                        <button
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            onClick={handleDisconnect}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Disconnect
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
