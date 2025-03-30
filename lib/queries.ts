import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import {
    getTokenName,
    getTokenDecimals,
    getTicketPrice,
    getJackpotAmount,
    getTimeRemaining,
    getLpsInfo,
    getFeeBps,
    getJackpotOdds,
    getUsersInfo,
    getTicketCountForRound,
    getTokenBalance,
    getTokenAllowance,
    getLpPoolStatus,
    getMinLpDeposit,
    getLastJackpotResults,
} from './contract';

const queryKeys = {
    tokenName: ['tokenName'],
    tokenDecimals: ['tokenDecimals'],
    ticketPriceInWei: ['ticketPriceInWei'],
    humanReadableTicketPrice: ['humanReadableTicketPrice'],
    jackpotAmountInWei: ['jackpotAmountInWei'],
    jackpotAmount: ['jackpotAmount'], // Keep this for the derived hook
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

export function useTokenName() {
    return useQuery({
        queryKey: queryKeys.tokenName,
        queryFn: getTokenName,
        staleTime: Infinity,
        gcTime: Infinity,
    });
}

export function useTokenDecimals() {
    return useQuery({
        queryKey: queryKeys.tokenDecimals,
        queryFn: getTokenDecimals,
        staleTime: Infinity,
        gcTime: Infinity,
    });
}

export function useTicketPriceInWei() {
    return useQuery({
        queryKey: queryKeys.ticketPriceInWei,
        queryFn: getTicketPrice,
        staleTime: 1000 * 15,
        refetchInterval: 1000 * 15,
    });
}

export function useTicketPrice() {
    const { data: ticketPriceInWei, isLoading: isLoadingPrice, error: errorPrice } = useTicketPriceInWei();
    const { data: decimals, isLoading: isLoadingDecimals, error: errorDecimals } = useTokenDecimals();

    const isLoading = isLoadingPrice || isLoadingDecimals;
    const error = errorPrice || errorDecimals;

    const data = (ticketPriceInWei !== undefined && decimals !== undefined)
        ? parseFloat(formatUnits(ticketPriceInWei, decimals))
        : undefined;

    return {
        data,
        isLoading,
        error,
    };
}

// Renamed original hook to fetch the raw value
export function useJackpotAmountInWei() {
    return useQuery({
        queryKey: queryKeys.jackpotAmountInWei,
        queryFn: getJackpotAmount,
        staleTime: 1000 * 10,
        refetchInterval: 1000 * 10,
    });
}

// New hook to provide the formatted value
export function useJackpotAmount() {
    const { data: jackpotAmountInWei, isLoading: isLoadingAmount, error: errorAmount } = useJackpotAmountInWei();
    const { data: decimals, isLoading: isLoadingDecimals, error: errorDecimals } = useTokenDecimals();

    const isLoading = isLoadingAmount || isLoadingDecimals;
    const error = errorAmount || errorDecimals;

    const data = (jackpotAmountInWei !== undefined && decimals !== undefined)
        ? parseFloat(formatUnits(jackpotAmountInWei, decimals))
        : undefined;

    return {
        data,
        isLoading,
        error,
    };
}


export function useTimeRemaining() {
    return useQuery({
        queryKey: queryKeys.timeRemaining,
        queryFn: getTimeRemaining,
        staleTime: 1000 * 1,
        refetchInterval: 1000 * 1,
    });
}

export function useLpsInfo(address: `0x${string}` | undefined) {
    return useQuery({
        queryKey: queryKeys.lpsInfo(address!),
        queryFn: () => getLpsInfo(address!),
        enabled: !!address,
        staleTime: 1000 * 15,
        refetchInterval: 1000 * 15,
    });
}

export function useFeeBps() {
    return useQuery({
        queryKey: queryKeys.feeBps,
        queryFn: getFeeBps,
        staleTime: 1000 * 60 * 5,
    });
}

export function useJackpotOdds() {
    return useQuery({
        queryKey: queryKeys.jackpotOdds,
        queryFn: getJackpotOdds,
        staleTime: 1000 * 30,
        refetchInterval: 1000 * 30,
    });
}

export function useUsersInfo(address: `0x${string}` | undefined) {
    return useQuery({
        queryKey: queryKeys.usersInfo(address!),
        queryFn: () => getUsersInfo(address!),
        enabled: !!address,
        staleTime: 1000 * 10,
        refetchInterval: 1000 * 10,
    });
}

export function useTicketCountForRound(address: `0x${string}` | undefined) {
    return useQuery({
        queryKey: queryKeys.ticketCountForRound(address!),
        queryFn: () => getTicketCountForRound(address!),
        enabled: !!address,
        staleTime: 1000 * 10,
        refetchInterval: 1000 * 10,
    });
}

export function useTokenBalance(address: `0x${string}` | undefined) {
    return useQuery({
        queryKey: queryKeys.tokenBalance(address!),
        queryFn: () => getTokenBalance(address!),
        enabled: !!address,
        staleTime: 1000 * 5,
        refetchInterval: 1000 * 5,
    });
}

export function useTokenAllowance(address: `0x${string}` | undefined) {
    return useQuery({
        queryKey: queryKeys.tokenAllowance(address!),
        queryFn: () => getTokenAllowance(address!),
        enabled: !!address,
        staleTime: 1000 * 30,
        refetchInterval: 1000 * 30,
    });
}

export function useLpPoolStatus() {
    return useQuery({
        queryKey: queryKeys.lpPoolStatus,
        queryFn: getLpPoolStatus,
        staleTime: 1000 * 15,
        refetchInterval: 1000 * 15,
    });
}

export function useMinLpDeposit() {
    return useQuery({
        queryKey: queryKeys.minLpDeposit,
        queryFn: getMinLpDeposit,
        staleTime: 1000 * 60 * 5,
    });
}

export function useLastJackpotResults() {
    return useQuery({
        queryKey: queryKeys.lastJackpotResults,
        queryFn: getLastJackpotResults,
        staleTime: 1000 * 60 * 1,
    });
}
