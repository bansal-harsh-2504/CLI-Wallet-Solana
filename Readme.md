# Solana CLI Wallet

This is a command-line wallet application for interacting with the Solana blockchain. The wallet allows you to generate a new keypair, request an airdrop of SOL, and send SOL from one wallet to another.

## Features

- **Generate a new keypair**: Create a new Solana keypair and save it to a file.
- **Request an airdrop**: Request 1 SOL airdrop to your wallet.
- **Send SOL**: Transfer SOL from one wallet to another.

## Requirements

- **Node.js**: Ensure you have Node.js installed.
- **Solana RPC URL**: You need to set up a Solana RPC URL in your `.env` file for the application to interact with the Solana network.

## Installation

1. Install dependencies:
   npm install

2. Create a `.env` file in the root directory and add the following:
   ```bash
   RPC_URL=https://api.mainnet-beta.solana.com
   ```

## Usage

### 1. Generate a new keypair

This command generates a new Solana keypair and saves it to a file `keypair.json`.

`node wallet.js generate`

### 2. Request an airdrop

This command requests an airdrop of 1 SOL to the provided public key.

`node wallet.js airdrop <publicKey>`

Replace `<publicKey>` with your wallet's public key (the one you generated in the previous step).

### 3. Send SOL

This command sends a specified amount of SOL from one wallet to another.

`node wallet.js send <fromSecretKey> <toPublicKey> <amount>`

- `<fromSecretKey>`: The secret key of the wallet sending SOL (in JSON format).
- `<toPublicKey>`: The public key of the wallet receiving SOL.
- `<amount>`: The amount of SOL to send.

## Dependencies

- `@solana/web3.js`: Solana JavaScript SDK for interacting with the blockchain.
- `yargs`: For handling command-line arguments and commands.
- `chalk`: To style terminal output.
- `fs`: To interact with the file system.
- `dotenv`: To load environment variables from a `.env` file.
