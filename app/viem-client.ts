import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

const client = createPublicClient({
    chain: base,
    transport: http(),
});

if (!client) {
    throw new Error('Failed to create viem client');
}

export default client;