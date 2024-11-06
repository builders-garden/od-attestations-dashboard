"use client";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAccount } from "wagmi";

export default function Home() {
  const account = useAccount();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-1 justify-center items-center min-h-screen w-full bg-background"
    >
      <div className="flex-flex-col text-center max-w-xs pb-4">
        <h1 className="text-2xl font-black pb-2">✨Hello, Dreamer✨</h1>
        <div className="text-sm text-wrap">Please connect your Wallet to start using the Onchain Dreamers Passport!</div>
      </div>
      {!account.address ? (
        <ConnectButton />
      ) : (
        <Button className="bg-primary px-16">
          <Link href="/user">Launch App</Link>
        </Button>
      )}
    </motion.div>
  );
}
