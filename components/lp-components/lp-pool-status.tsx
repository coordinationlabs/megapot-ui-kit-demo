import { Card, CardContent } from '../ui/card';
export function LpPoolStatus({
    poolStatus,
}: {
    poolStatus: boolean | undefined;
}) {
    return (
        <Card className="bg-white rounded-xl shadow-sm">
            <CardContent className="p-6">
                <div className="text-center">
                    <h2 className="text-lg font-medium text-gray-500 mb-2">
                        LP Pool Status
                    </h2>
                    <p className="text-4xl font-bold text-emerald-500">
                        {poolStatus ? 'Open' : 'Closed'}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
