import { cn } from '@/lib/utils'; // Assuming cn utility exists for merging classes

interface LoadingProps {
    className?: string; // Allow className prop
    containerClassName?: string; // Optional class for the container div
}

export function Loading({ className, containerClassName }: LoadingProps) {
    return (
        <div className={cn("flex justify-center items-center p-8", containerClassName)}>
            <div
                className={cn(
                    "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500",
                    className // Apply passed className here
                )}
            ></div>
        </div>
    );
}
