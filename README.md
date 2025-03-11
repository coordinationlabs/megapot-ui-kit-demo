# Megapot Integration Demo

Want to run your own jackpot?  Or integrate ours into your own app and take a cut of each ticket sold?  We got you covered!

Follow our getting started guide at [docs.megapot.io](https://docs.megapot.io/developers/start-here)

Check out out the live demo: [https://megapot-ui-kit-demo.vercel.app/](https://megapot-ui-kit-demo.vercel.app/)

Contact us on Telegram [@megapot_io](https://t.me/megapot_io)

This is a demo of the Megapot integration using our UI Kit. It is a simple demo that shows how to integrate the Megapot contract into a Next.js application.

This can be adapted to use for any jackpot contract that uses a Megapot contract.  Just update the contract address in /lib/constants.ts

## Getting Started

```bash
# Clone the repository
git clone git@github.com:coordinationlabs/megapot-integration-demo.git

# Install pnpm
npm install -g pnpm

# Install dependencies
pnpm install

# Create a .env.local file and add add your Privy app id
cp env.example .env.local

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
            /buy-tickets.tsx - (NOT USED WITH UI KIT)
            /countdown.tsx - Countdown
            /current-jackpot.tsx - (NOT USED WITH UI KIT)
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