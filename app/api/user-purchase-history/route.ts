import { CONTRACT_ADDRESS, CONTRACT_START_BLOCK, PURCHASE_TICKET_TOPIC } from '@/lib/constants';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const { address } = await request.json();

    const urlParams = new URLSearchParams({
        module: 'logs',
        action: 'getLogs',
        address: CONTRACT_ADDRESS,
        topic0: PURCHASE_TICKET_TOPIC,
        apikey: process.env.BASESCAN_API_KEY || '',
        fromBlock: CONTRACT_START_BLOCK.toString(),
    });

    const response = await fetch(
        `https://api.basescan.org/api?${urlParams.toString()}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    const data = await response.json();

    // filter through the data for user address
    const userPurchaseHistory = data.result.filter(
        (log: any) =>
            `0x${log.topics[1].substring(26, 66).toLowerCase()}` ===
            address.toLowerCase()
    );
    return NextResponse.json(userPurchaseHistory);
}
