import { Button } from '@/components/ui/button'; // Use the Button component
import { Loading } from '@/components/ui/loading'; // Import Loading

interface FormButtonProps {
    action: 'approve' | 'deposit' | 'disabled';
    text: string;
    disabled: boolean;
    isLoading: boolean;
    handleDeposit: () => void;
    handleApprove: () => void;
}

export function FormButton({
    action,
    text,
    disabled,
    isLoading,
    handleDeposit,
    handleApprove,
}: FormButtonProps) {

    const handleClick = () => {
        if (action === 'approve') {
            handleApprove();
        } else if (action === 'deposit') {
            handleDeposit();
        }
        // No action if 'disabled'
    };

    // Determine button styling based on action/state
    let buttonClass = "mt-4 w-full text-white px-4 py-2 rounded-md"; // Common classes
    if (disabled || action === 'disabled') {
        buttonClass += " bg-gray-400 cursor-not-allowed";
    } else if (action === 'approve') {
        buttonClass += " bg-blue-500 hover:bg-blue-600";
    } else if (action === 'deposit') {
        buttonClass += " bg-emerald-500 hover:bg-emerald-600";
    } else {
        // Default/fallback styling if needed
        buttonClass += " bg-gray-500";
    }


    return (
        <Button
            onClick={handleClick}
            disabled={disabled || isLoading}
            className={buttonClass}
        >
            {isLoading ? <Loading className="h-5 w-5 mr-2" containerClassName="p-0 inline-flex" /> : null}
            {text}
        </Button>
    );
}
