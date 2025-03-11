import Link from 'next/link';

export function SocialLinks() {
    return (
        <div className="flex justify-center space-x-8">
            <Link href="https://x.com/megapot_io" aria-label="X/Twitter">
                <svg
                    className="h-6 w-6 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            </Link>
            <Link href="https://t.me/megapot_io" aria-label="Telegram">
                <svg
                    className="h-6 w-6 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.296c-.146.658-.537.818-1.084.51l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.538-.196 1.006.128.832.924z" />
                </svg>
            </Link>
        </div>
    );
}
