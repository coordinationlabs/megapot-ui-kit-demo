import { BaseJackpotAbi } from '@/lib/abi';
import { CONTRACT_ADDRESS } from '@/lib/constants';
import { useWriteContract } from 'wagmi';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

export function WithdrawWinnings({
    winningsAvailable,
}: {
    winningsAvailable: number;
}) {
    const { writeContract } = useWriteContract();
    const handleWithdraw = async () => {
        writeContract?.({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: BaseJackpotAbi,
            functionName: 'withdrawWinnings',
            args: [],
        });
    };
    return (
        <Card className="bg-white rounded-xl shadow-sm">
            <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold">Withdraw Winnings</h1>
                    <p className="text-lg">
                        {(winningsAvailable / 10 ** 6).toFixed(2)} USDC
                    </p>
                    <Button
                        onClick={handleWithdraw}
                        className="mt-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                        Withdraw
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
