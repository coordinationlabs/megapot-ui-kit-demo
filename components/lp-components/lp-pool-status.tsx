import { useLpPoolStatus } from '@/lib/queries';
import { Card, CardContent } from '../ui/card';
import { Loading } from '../ui/loading';

export function LpPoolStatus() {
    const { data: poolStatus, isLoading, error } = useLpPoolStatus();

    let content;
    if (isLoading) {
        content = <Loading className="h-8 w-8 mx-auto" containerClassName="p-0" />;
    } else if (error || poolStatus === undefined) {
        content = <p className="text-4xl font-bold text-red-500">Error</p>;
    } else {
        content = (
            <p className={`text-4xl font-bold ${poolStatus ? 'text-emerald-500' : 'text-orange-500'}`}>
                {poolStatus ? 'Open' : 'Closed'}
            </p>
        );
    }

    return (
        <Card className="bg-white rounded-xl shadow-sm">
            <CardContent className="p-6">
                <div className="text-center">
                    <h2 className="text-lg font-medium text-gray-500 mb-2">
                        LP Pool Status
                    </h2>
                    {content}
                </div>
            </CardContent>
        </Card>
    );
}
