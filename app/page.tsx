"use client";
import { Icons } from "@/components/ui/icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function Home() {
  const account = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (account.address) {
      router.push("/user");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 justify-center items-center min-h-screen w-full bg-background"
    >
      {account.address ? (
        <Icons.spinner className="mr-2 h-22 w-22 animate-spin" />
      ) : (
        <>
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-2xl font-black">✨ Hello, Dreamer ✨</h1>
            <div className="text-sm text-center max-w-xs">
              Please connect your Wallet to start using the Onchain Dreamers
              Passport!
            </div>
          </div>
          <ConnectButton />
        </>
      )}
    </motion.div>
  );
}
