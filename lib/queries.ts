import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem'; // Import formatUnits
import {
    getTokenName as fetchTokenName,
    getTokenDecimals as fetchTokenDecimals,
    getTicketPrice as fetchTicketPrice,
    getJackpotAmount as fetchJackpotAmount,
    getTimeRemaining as fetchTimeRemaining,
    getLpsInfo as fetchLpsInfo,
    getFeeBps as fetchFeeBps,
    getJackpotOdds as fetchJackpotOdds,
    getUsersInfo as fetchUsersInfo,
    getTicketCountForRound as fetchTicketCountForRound,
    getTokenBalance as fetchTokenBalance,
    getTokenAllowance as fetchTokenAllowance,
    getLpPoolStatus as fetchLpPoolStatus,
    getMinLpDeposit as fetchMinLpDeposit,
    getLastJackpotResults as fetchLastJackpotResults,
} from './contract'; // Import the actual fetching functions

// --- Query Keys ---
// Using arrays for query keys allows for better organization and invalidation.
const queryKeys = {
    tokenName: ['tokenName'],
    tokenDecimals: ['tokenDecimals'],
    ticketPriceInWei: ['ticketPriceInWei'], // Renamed key
    humanReadableTicketPrice: ['humanReadableTicketPrice'], // Key for the new hook
    jackpotAmount: ['jackpotAmount'],
    timeRemaining: ['timeRemaining'],
    lpsInfo: (address: `0x${string}`) => ['lpsInfo', address],
    feeBps: ['feeBps'],
    jackpotOdds: ['jackpotOdds'],
    usersInfo: (address: `0x${string}`) => ['usersInfo', address],
    ticketCountForRound: (address: `0x${string}`) => ['ticketCountForRound', address],
    tokenBalance: (address: `0x${string}`) => ['tokenBalance', address],
    tokenAllowance: (address: `0x${string}`) => ['tokenAllowance', address],
    lpPoolStatus: ['lpPoolStatus'],
    minLpDeposit: ['minLpDeposit'],
    lastJackpotResults: ['lastJackpotResults'],
};

// --- Hooks ---

export function useTokenName() {
    return useQuery({
        queryKey: queryKeys.tokenName,
        queryFn: fetchTokenName,
        staleTime: Infinity, // Token name rarely changes
        gcTime: Infinity, // Keep in cache indefinitely
    });
}

export function useTokenDecimals() {
    return useQuery({
        queryKey: queryKeys.tokenDecimals,
        queryFn: fetchTokenDecimals,
        staleTime: Infinity, // Token decimals rarely change
        gcTime: Infinity, // Keep in cache indefinitely
    });
}

// Renamed hook to fetch the raw price in wei
export function useTicketPriceInWei() {
    return useQuery({
        queryKey: queryKeys.ticketPriceInWei,
        queryFn: fetchTicketPrice,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    });
}

// New hook for human-readable ticket price
export function useTicketPrice() {
    const { data: ticketPriceInWei, isLoading: isLoadingPrice, error: errorPrice } = useTicketPriceInWei();
    const { data: decimals, isLoading: isLoadingDecimals, error: errorDecimals } = useTokenDecimals();

    // Combine loading states
    const isLoading = isLoadingPrice || isLoadingDecimals;
    // Combine errors (prioritize price error if both exist)
    const error = errorPrice || errorDecimals;

    // Calculate human-readable price if data is available
    const data = (ticketPriceInWei !== undefined && decimals !== undefined)
        ? parseFloat(formatUnits(ticketPriceInWei, decimals))
        : undefined;

    return {
        data,
        isLoading,
        error,
        // You might want to expose the underlying query results too
        // ticketPriceInWeiQuery: { data: ticketPriceInWei, isLoading: isLoadingPrice, error: errorPrice },
        // tokenDecimalsQuery: { data: decimals, isLoading: isLoadingDecimals, error: errorDecimals },
    };
}


export function useJackpotAmount() {
    return useQuery({
        queryKey: queryKeys.jackpotAmount,
        queryFn: fetchJackpotAmount,
        staleTime: 1000 * 30, // 30 seconds
        refetchInterval: 1000 * 30, // Refetch every 30 seconds
    });
}

export function useTimeRemaining() {
    return useQuery({
        queryKey: queryKeys.timeRemaining,
        queryFn: fetchTimeRemaining,
        staleTime: 1000 * 5, // 5 seconds
        refetchInterval: 1000 * 5, // Refetch every 5 seconds
    });
}

export function useLpsInfo(address: `0x${string}` | undefined) {
    return useQuery({
        queryKey: queryKeys.lpsInfo(address!), // The non-null assertion is okay due to the `enabled` check
        queryFn: () => fetchLpsInfo(address!),
        enabled: !!address, // Only run query if address is provided
        staleTime: 1000 * 60, // 1 minute
        refetchInterval: 1000 * 60, // Refetch every minute
    });
}

export function useFeeBps() {
    return useQuery({
        queryKey: queryKeys.feeBps,
        queryFn: fetchFeeBps,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

export function useJackpotOdds() {
    return useQuery({
        queryKey: queryKeys.jackpotOdds,
        queryFn: fetchJackpotOdds,
        staleTime: 1000 * 60 * 5, // 5 minutes (depends on jackpot amount, ticket price, fee)
        refetchInterval: 1000 * 60 * 5,
    });
}

export function useUsersInfo(address: `0x${string}` | undefined) {
    return useQuery({
        queryKey: queryKeys.usersInfo(address!),
        queryFn: () => fetchUsersInfo(address!),
        enabled: !!address,
        staleTime: 1000 * 30, // 30 seconds
        refetchInterval: 1000 * 30,
    });
}

export function useTicketCountForRound(address: `0x${string}` | undefined) {
    return useQuery({
        queryKey: queryKeys.ticketCountForRound(address!),
        queryFn: () => fetchTicketCountForRound(address!),
        enabled: !!address,
        staleTime: 1000 * 30, // 30 seconds
        refetchInterval: 1000 * 30,
    });
}

export function useTokenBalance(address: `0x${string}` | undefined) {
    return useQuery({
        queryKey: queryKeys.tokenBalance(address!),
        queryFn: () => fetchTokenBalance(address!),
        enabled: !!address,
        staleTime: 1000 * 15, // 15 seconds
        refetchInterval: 1000 * 15,
    });
}

export function useTokenAllowance(address: `0x${string}` | undefined) {
    return useQuery({
        queryKey: queryKeys.tokenAllowance(address!),
        queryFn: () => fetchTokenAllowance(address!),
        enabled: !!address,
        staleTime: 1000 * 60, // 1 minute
        refetchInterval: 1000 * 60,
    });
}

export function useLpPoolStatus() {
    return useQuery({
        queryKey: queryKeys.lpPoolStatus,
        queryFn: fetchLpPoolStatus,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchInterval: 1000 * 60 * 5,
    });
}

export function useMinLpDeposit() {
    return useQuery({
        queryKey: queryKeys.minLpDeposit,
        queryFn: fetchMinLpDeposit,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

export function useLastJackpotResults() {
    return useQuery({
        queryKey: queryKeys.lastJackpotResults,
        queryFn: fetchLastJackpotResults,
        staleTime: 1000 * 60 * 10, // 10 minutes (only changes after a jackpot run)
    });
}

// Consider adding mutation hooks here later if needed for write operations (e.g., buy tickets, deposit LP)
