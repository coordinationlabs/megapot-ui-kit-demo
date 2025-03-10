import { parseAbi, parseAbiItem } from "viem";
import client from "../app/viem-client";
import { BaseJackpotAbi } from "./abi";
import { CONTRACT_ADDRESS, ERC20_TOKEN_ADDRESS } from "./constants";

// Function to get the ticket price
export async function getTicketPrice(): Promise<number | undefined> {
    try {
        const tickePriceWei = (await client.readContract({
            address: CONTRACT_ADDRESS,
            abi: BaseJackpotAbi,
            functionName: 'ticketPrice',
        })) as bigint;
        return Number(tickePriceWei) / 10 ** 6;
    } catch (error) {
        console.error("Error getting ticket price:", error)
        return undefined
    }
}

// Function to get the jackpot amount
export async function getJackpotAmount(): Promise<number | undefined> {
    try {
        const lpPoolTotalWei = (await client.readContract({
            address: CONTRACT_ADDRESS,
            abi: BaseJackpotAbi,
            functionName: 'lpPoolTotal',
        })) as bigint;
        const userPoolTotalWei = (await client.readContract({
            address: CONTRACT_ADDRESS,
            abi: BaseJackpotAbi,
            functionName: 'userPoolTotal',
        })) as bigint;
        const jackpotAmount =
            Number(lpPoolTotalWei) > Number(userPoolTotalWei)
                ? Number(lpPoolTotalWei) / 10 ** 6
                : Number(userPoolTotalWei) / 10 ** 6;
        return jackpotAmount;
    } catch (error) {
        console.error("Error getting jackpot amount:", error)
        return undefined
    }
}

// Function to get the time remaining until the jackpot draw
export async function getTimeRemaining(): Promise<number | undefined> {
    try {
        const lastJackpotEndTime = await client.readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: BaseJackpotAbi,
            functionName: "lastJackpotEndTime",
        })
        const roundDuration = await client.readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: BaseJackpotAbi,
            functionName: "roundDurationInSeconds",
        })
        const nextJackpotStartTime = Number(lastJackpotEndTime) + Number(roundDuration)
        const timeRemaining = nextJackpotStartTime - (Date.now() / 1000)
        return timeRemaining
    } catch (error) {
        console.error("Error getting time remaining:", error)
        return undefined
    }
}

// Get lpsInfo from contract
export async function getLpsInfo(address: `0x${string}`): Promise<[bigint, bigint, bigint, boolean] | undefined> {
    try {
        const lpsInfo = await client.readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: BaseJackpotAbi,
            functionName: "lpsInfo",
            args: [address],
        })
        return lpsInfo as [bigint, bigint, bigint, boolean]
    } catch (error) {
        console.error("Error getting lpsInfo:", error)
        return undefined
    }
}

// Function to get the feeBps
export async function getFeeBps(): Promise<number | undefined> {
    try {
        const feeBps = await client.readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: BaseJackpotAbi,
            functionName: "feeBps",
        })
        return Number(feeBps)
    } catch (error) {
        console.error("Error getting feeBps:", error)
        return undefined
    }
}

// Function to get the jackpot odds per ticket
export async function getJackpotOdds(): Promise<number | undefined> {
    try {
        const jackpotSize = await getJackpotAmount();
        const ticketPrice = await getTicketPrice();
        const feeBps = await getFeeBps();

        if (!jackpotSize || !ticketPrice || !feeBps) {
            return undefined;
        }

        const odds = jackpotSize / (ticketPrice * (1 - feeBps / 10000))
        return odds;
    } catch (error) {
        console.error("Error getting jackpot odds:", error)
        return undefined
    }
}

// Function to get users info
export async function getUsersInfo(address: `0x${string}`): Promise<{
    ticketsPurchasedTotalBps: bigint;
    winningsClaimable: bigint;
    active: boolean;
} | undefined> {
    try {
        const usersInfo = await client.readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: BaseJackpotAbi,
            functionName: "usersInfo",
            args: [address],
        })
        const [ticketsPurchasedTotalBps, winningsClaimable, active] = usersInfo as [bigint, bigint, boolean];
        return { ticketsPurchasedTotalBps, winningsClaimable, active };
    } catch (error) {
        console.error("Error getting users info:", error)
        return undefined
    }
}

// Function to get the total tickets a user has purchased this jackpot
export async function getTicketCountForRound(address: `0x${string}`): Promise<number | undefined> {
    try {
        // get the usersInfo and use their ticketsPurchasedTotalBps
        const usersInfo = await getUsersInfo(address);
        const feeBps = await getFeeBps();

        if (!usersInfo || !feeBps) {
            return undefined;
        }

        const { ticketsPurchasedTotalBps } = usersInfo;

        const ticketCount = Number(ticketsPurchasedTotalBps) / 10000 / ((100 - (Number(feeBps) / 100)) / 100);
        return ticketCount;
    } catch (error) {
        console.error("Error getting ticket count for round:", error)
        return undefined
    }
}

// Function to get the token balance of a user
export async function getTokenBalance(address: `0x${string}`): Promise<number | undefined> {
    try {

        const balanceOfAbi = [
            'function balanceOf(address account) returns (uint256)',
        ];
        const balance = await client.readContract({
            address: ERC20_TOKEN_ADDRESS as `0x${string}`,
            abi: parseAbi(balanceOfAbi),
            functionName: "balanceOf",
            args: [address],
        })
        return Number(balance);
    } catch (error) {
        console.error("Error getting token balance:", error)
        return undefined
    }
}

// Function to get the allowance of a user
export async function getTokenAllowance(address: `0x${string}`): Promise<number | undefined> {
    try {
        const allowanceAbi = [
            'function allowance(address owner, address spender) returns (uint256)',
        ];
        const allowance = await client.readContract({
            address: ERC20_TOKEN_ADDRESS as `0x${string}`,
            abi: parseAbi(allowanceAbi),
            functionName: "allowance",
            args: [address, CONTRACT_ADDRESS],
        })
        return Number(allowance);
    } catch (error) {
        console.error("Error getting token allowance:", error)
        return undefined
    }
}

// Function to get the lp pool status (open or closed)
export async function getLpPoolStatus(): Promise<boolean | undefined> {
    try {
        const lpPoolCap = await client.readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: BaseJackpotAbi,
            functionName: "lpPoolCap",
        })
        const lpPoolTotal = await client.readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: BaseJackpotAbi,
            functionName: "lpPoolTotal",
        })
        if (lpPoolCap && lpPoolTotal) {
            if (Number(lpPoolTotal) >= Number(lpPoolCap)) {
                return false;
            }
            return true;
        }
        return undefined;
    } catch (error) {
        console.error("Error getting lp pool status:", error)
        return undefined
    }
}

// Function to get the lp minimum deposit amount
export async function getMinLpDeposit(): Promise<number | undefined> {
    try {
        const minLpDeposit = await client.readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: BaseJackpotAbi,
            functionName: "minLpDeposit",
        })
        return Number(minLpDeposit);
    } catch (error) {
        console.error("Error getting lp minimum deposit amount:", error)
        return undefined
    }
}

interface LastJackpotEvent {
    time: number;
    winner: string;
    winningTicket: number;
    winAmount: number;
    ticketsPurchasedTotalBps: number;
}

// Function to get the last jackpot results
export async function getLastJackpotResults(): Promise<LastJackpotEvent | undefined> {
    try {
        const lastBlock = await client.getBlockNumber();
        // Adjust this for your RPC provider limits
        let fromBlock = lastBlock - BigInt(500);

        let lastJackpotRunEvents: any[] = [];
        while (true) {
            lastJackpotRunEvents = await client.getLogs({
                address: CONTRACT_ADDRESS as `0x${string}`,
                event: parseAbiItem('event JackpotRun(uint256 time, address winner, uint256 winningTicket, uint256 winAmount, uint256 ticketsPurchasedTotalBps)'),
                fromBlock: fromBlock,
                toBlock: lastBlock,
            })
            if (lastJackpotRunEvents.length > 0) {
                return {
                    time: Number(lastJackpotRunEvents[0].args.time),
                    winner: lastJackpotRunEvents[0].args.winner as `0x${string}`,
                    winningTicket: Number(lastJackpotRunEvents[0].args.winningTicket),
                    winAmount: Number(lastJackpotRunEvents[0].args.winAmount),
                    ticketsPurchasedTotalBps: Number(lastJackpotRunEvents[0].args.ticketsPurchasedTotalBps),
                }
            }
            // delay 5 seconds to avoid rate limiting
            // Adjust this for your RPC provider limits
            await new Promise(resolve => setTimeout(resolve, 5000));
            // Adjust this for your RPC provider limits
            fromBlock = fromBlock - BigInt(500);
        }
    } catch (error) {
        console.error("Error getting last jackpot results:", error)
        return undefined
    }
}