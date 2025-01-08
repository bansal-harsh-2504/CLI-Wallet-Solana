import {
  Keypair,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import yargs from "yargs";
import chalk from "chalk";
import fs from "fs";
import { hideBin } from "yargs/helpers";
import "dotenv/config";

const connection = new Connection(process.env.RPC_URL, "confirmed");

const generateKeypair = () => {
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toBase58();
  const secretKey = `[${keypair.secretKey.toString()}]`;

  fs.writeFileSync(
    "./keypair.json",
    JSON.stringify({ publicKey, secretKey }, null, 2)
  );
  console.log(chalk.green("Keypair generated and saved to keypair.json"));
  console.log(chalk.blue(`Public Key: ${publicKey}`));
};

const airdrop = async (publicKey) => {
  const pubkey = new PublicKey(publicKey);
  console.log(chalk.yellow("Requesting airdrop..."));
  const signature = await connection.requestAirdrop(
    pubkey,
    1 * LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(signature);
  console.log(chalk.green("Airdrop successful!"));
};

const sendSOL = async (fromSecretKey, toPublicKey, amount) => {
  try {
    const sender = Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(fromSecretKey))
    );
    const recipient = new PublicKey(toPublicKey);

    const lamports = amount * LAMPORTS_PER_SOL;

    console.log(
      `Preparing to send ${amount} SOL from ${sender.publicKey.toString()} to ${toPublicKey}...`
    );

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: sender.publicKey,
        toPubkey: recipient,
        lamports: lamports,
      })
    );

    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
    transaction.feePayer = sender.publicKey;

    transaction.sign(sender);

    const signature = await connection.sendTransaction(transaction, [sender]);
    await connection.confirmTransaction(signature, "confirmed");

    console.log(`Transaction successful! Signature: ${signature}`);
  } catch (error) {
    console.error("Error in sending SOL:", error.message);
  }
};

yargs(hideBin(process.argv))
  .command("generate", "Generate a new keypair", {}, generateKeypair)
  .command(
    "airdrop <publicKey>",
    "Request an airdrop of 1 SOL",
    (yargs) => {
      yargs.positional("publicKey", {
        describe: "Public Key of the wallet",
        type: "string",
      });
    },
    (argv) => {
      airdrop(argv.publicKey);
    }
  )
  .command(
    "send <fromSecretKey> <toPublicKey> <amount>",
    "Send SOL to another wallet",
    (yargs) => {
      yargs
        .positional("fromSecretKey", {
          describe: "Secret key of the sender",
          type: "string",
        })
        .positional("toPublicKey", {
          describe: "Public key of the recipient",
          type: "string",
        })
        .positional("amount", {
          describe: "Amount of SOL to send",
          type: "number",
        });
    },
    (argv) => {
      sendSOL(argv.fromSecretKey, argv.toPublicKey, argv.amount);
    }
  )
  .demandCommand()
  .help().argv;
