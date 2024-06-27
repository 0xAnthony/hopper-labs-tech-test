## Introduction
I tried to make this test as library-less as possible. 

Used libraries varies a lot between projects and needs, and being able to work without them justify (in my opinion) a correct comprehension of the language/framework and a flexibility to adapt to these.

I spent approx 10 hours on this. Lost quite some times fetching events as I was getting empty array with no errors for providing "earliest" as `fromBlock` (which should work but didn't somehow 🤷️)

I made quickly sure it was **responsive** but please keep in mind this point can be improved as I focused on the desktop part for the sake of this test.

## Getting Started
### Install:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```
### Run:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Additionnal Features
#### Here are some additional stuff I did :
- Easily fetch and display more deposit (and withdrawals) events (automatically re-fetch older blocks to skip EVM limit)
- Custom stepper, possibility to easily add new steps and integrate them in the deposit flow with a simple incrementation
- `Mint USDC` button, for development propose to make it easier to test in dev env
- Human readable display and input of the values

## Notes
#### Here are some features that may be great to develop on top of this for a production version :
- For UX, estimation of received token could be interesting (after fee, calling previewDeposit)
- Even if here we limit to Metamask, it would be pretty easy thanks to Wagmi to integrate other wallets' connections