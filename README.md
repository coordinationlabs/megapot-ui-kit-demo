# Megapot Integration Demo

Learn more at [docs.megapot.io](https://docs.megapot.io/developers/start-here.md)

Contact us on Telegram [@megapot_io](https://t.me/megapot_io)

This is a demo of the Megapot standalone integration. It is a simple demo that shows how to integrate the Megapot contract into a Next.js application.

This can be adapted to use for any jackpot contract that uses the MEGAPOT contract.  Just update the contract address in /lib/constants.ts

This does not use the UI Kit, we are working on a demo for that soon.

## Getting Started

```bash
# Clone the repository
git clone git@github.com:coordinationlabs/megapot-integration-demo.git

# Install pnpm
npm install -g pnpm

# Install dependencies
pnpm install

# Create a .env.local file and add add your Privy app id
cp .env.example .env.local

# Run the development server
pnpm run dev
```

## App Structure

```
/app
    /layout.tsx - Layout for the app
    /page.tsx - Main page/entry point of the app
    /providers.tsx - Providers for the app (Privy, wagmi, viem, etc.)
    /viem-client.ts - Viem public client for querying the contract
    /jackpot - Jackpot page
    /liquidity - Liquidity page
    /components - Shared components
        /ui - UI components (cards, etc.)
        /jackpot-component.tsx - Main jackpot page component
        /jackpot-components
            /buy-tickets.tsx - Buy tickets from (quantity, submit button)
            /countdown.tsx - Countdown
            /current-jackpot.tsx - Current jackpot size
            /last-jackpot.tsx - Last jackpot results
            /ticket-price.tsx - Ticket cost
            /winning-odds.tsx - Winning odds
            /withdraw-winnings.tsx - Withdraw winnings
        /lp-component.tsx - Main liquidity page
        /lp-components
            /lp-deposit-form
                /deposit-input.tsx - Deposit input
                /form-button.tsx - Form button
                /min-lp-deposit.tsx - Minimum LP deposit
                /risk-percentage.tsx - Risk percentage select
            /user-lp-balance
                /adjust-risk-percentage.tsx - Adjust risk input
                /lp-balance.tsx - LP balance
            /lp-deposit-form.tsx - LP deposit form
            /lp-pool-status.tsx - LP pool status (Open/Closed)
            /user-lp-balances.tsx - User LP balances
        /lib
            /abi.ts - Contract ABI
            /constants.ts - Contract address and other constants
            /contract.ts - Contract interaction functions
```