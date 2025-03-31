import { parseAbi, parseAbiItem } from "viem";
import client from "../app/viem-client";
import { BaseJackpotAbi } from "./abi";
import { CONTRACT_ADDRESS, ERC20_TOKEN_ADDRESS } from "./constants";

// Standard ERC20 ABI parts needed
const erc20Abi = parseAbi([
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function balanceOf(address account) view returns (uint256)',
    'function allowance(address owner, address spender) view returns (uint256)',
]);

// Function to get the ticket price in the token's smallest unit (e.g., wei)
export async function getTicketPrice(): Promise<bigint | undefined> {
    try {
        const ticketPriceWei = (await client.readContract({
            address: CONTRACT_ADDRESS,
            abi: BaseJackpotAbi,
            functionName: 'ticketPrice',
        })) as bigint;
        return ticketPriceWei; // Return the raw bigint value
    } catch (error) {
        console.error("Error getting ticket price:", error)
        return undefined
    }
}

// Function to get the jackpot amount (returns largest pool total in wei)
export async function getJackpotAmount(): Promise<bigint | undefined> { // Changed return type
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
            lpPoolTotalWei > userPoolTotalWei
                ? lpPoolTotalWei
                : userPoolTotalWei;
        return jackpotAmount;
    } catch (error) {
        console.error("Error getting jackpot amount:", error);
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
    // This function now depends on functions returning bigint or number|undefined
    // It needs careful handling of units and potential undefined values
    try {
        const jackpotAmountWei = await getJackpotAmount(); // Returns bigint | undefined
        const ticketPriceWei = await getTicketPrice(); // Returns bigint | undefined
        const feeBps = await getFeeBps(); // Returns number | undefined
        const tokenDecimals = await getTokenDecimals(); // Returns number | undefined

        // Added check for tokenDecimals being undefined or 0
        if (jackpotAmountWei === undefined || ticketPriceWei === undefined || feeBps === undefined || tokenDecimals === undefined || tokenDecimals === 0 || ticketPriceWei === 0n) {
            console.error("Missing data for odds calculation", { jackpotAmountWei, ticketPriceWei, feeBps, tokenDecimals });
            return undefined;
        }

        // Perform calculations using numbers after converting from wei if necessary
        // Note: Direct division with bigint might truncate. Convert to number for odds calculation.
        const jackpotSizeNum = Number(jackpotAmountWei) / (10 ** tokenDecimals);
        const ticketPriceNum = Number(ticketPriceWei) / (10 ** tokenDecimals);

        if (ticketPriceNum === 0) return undefined; // Avoid division by zero

        // Calculate the effective ticket price after fee
        const effectiveTicketPrice = ticketPriceNum * (1 - Number(feeBps) / 10000);
        if (effectiveTicketPrice === 0) return undefined; // Avoid division by zero

        const odds = jackpotSizeNum / effectiveTicketPrice;
        return odds;
    } catch (error) {
        console.error("Error getting jackpot odds:", error);
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

// Function to get the ERC20 token name
export async function getTokenName(): Promise<string | undefined> {
    try {
        const name = await client.readContract({
            address: ERC20_TOKEN_ADDRESS as `0x${string}`,
            abi: erc20Abi,
            functionName: "name",
        })
        return name as string;
    } catch (error) {
        console.error("Error getting token name:", error)
        return undefined
    }
}

// Function to get the ERC20 token symbol
export async function getTokenSymbol(): Promise<string | undefined> {
    try {
        const symbol = await client.readContract({
            address: ERC20_TOKEN_ADDRESS as `0x${string}`,
            abi: erc20Abi,
            functionName: "symbol",
        })
        return symbol as string;
    } catch (error) {
        console.error("Error getting token symbol:", error)
        return undefined
    }
}

// Function to get the ERC20 token decimals
export async function getTokenDecimals(): Promise<number | undefined> {
    try {
        const decimals = await client.readContract({
            address: ERC20_TOKEN_ADDRESS as `0x${string}`,
            abi: erc20Abi,
            functionName: "decimals",
        })
        return Number(decimals);
    } catch (error) {
        console.error("Error getting token decimals:", error)
        return undefined
    }
}

// Function to get the token balance of a user (returns smallest unit, e.g., wei)
export async function getTokenBalance(address: `0x${string}`): Promise<bigint | undefined> {
    try {
        const balance = await client.readContract({
            address: ERC20_TOKEN_ADDRESS as `0x${string}`,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [address],
        })
        return balance as bigint; // Return raw bigint
    } catch (error) {
        console.error("Error getting token balance:", error);
        return undefined;
    }
}

// Function to get the allowance of a user (returns smallest unit, e.g., wei)
export async function getTokenAllowance(address: `0x${string}`): Promise<bigint | undefined> {
    try {
        const allowance = await client.readContract({
            address: ERC20_TOKEN_ADDRESS as `0x${string}`,
            abi: erc20Abi,
            functionName: "allowance",
            args: [address, CONTRACT_ADDRESS],
        })
        return allowance as bigint; // Return raw bigint
    } catch (error) {
        console.error("Error getting token allowance:", error);
        return undefined
    }
}

// Function to get the lp pool status (open or closed)
export async function getLpPoolStatus(): Promise<boolean | undefined> {
    try {
        const lpPoolCap = (await client.readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: BaseJackpotAbi,
            functionName: "lpPoolCap",
        })) as bigint; // Assert type as bigint

        const lpPoolTotal = (await client.readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: BaseJackpotAbi,
            functionName: "lpPoolTotal",
        })) as bigint; // Assert type as bigint

        // Compare directly using bigint operators.
        // If lpPoolTotal >= lpPoolCap, the pool is closed (full).
        // Otherwise (including when lpPoolTotal is 0n), it's open.
        if (lpPoolTotal >= lpPoolCap) {
            return false; // Pool is closed (reached capacity)
        } else {
            return true; // Pool is open
        }

    } catch (error) {
        console.error("Error getting lp pool status:", error);
        return undefined; // Return undefined on error
    }
}

// Function to get the lp minimum deposit amount (returns smallest unit, e.g., wei)
export async function getMinLpDeposit(): Promise<bigint | undefined> {
    try {
        const minLpDeposit = await client.readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: BaseJackpotAbi,
            functionName: "minLpDeposit",
        })
        return minLpDeposit as bigint; // Return raw bigint
    } catch (error) {
        console.error("Error getting lp minimum deposit amount:", error);
        return undefined
    }
}

// Update interface to use bigint for amounts
interface LastJackpotEvent {
    time: number;
    winner: string;
    winningTicket: number; // Assuming this fits in number
    winAmount: bigint; // Changed to bigint
    ticketsPurchasedTotalBps: bigint; // Changed to bigint
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
                // Removed duplicate properties
                return {
                    time: Number(lastJackpotRunEvents[0].args.time),
                    winner: lastJackpotRunEvents[0].args.winner as `0x${string}`,
                    winningTicket: Number(lastJackpotRunEvents[0].args.winningTicket), // Assuming this fits in number
                    winAmount: lastJackpotRunEvents[0].args.winAmount as bigint, // Return bigint
                    ticketsPurchasedTotalBps: lastJackpotRunEvents[0].args.ticketsPurchasedTotalBps as bigint, // Return bigint
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
