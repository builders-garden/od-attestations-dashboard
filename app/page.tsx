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
  }, [account, router]);

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-background sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col justify-center items-center min-h-screen w-full sm:max-w-md bg-background rounded-lg sm:shadow-lg p-6 overflow-hidden"
      >
        {account.address ? (
          <Icons.spinner className="mr-2 h-22 w-22 animate-spin" />
        ) : (
          <div className="z-50 flex flex-col items-center gap-3.5">
            <div className="flex flex-col items-center gap-1">
              <h1 className="text-3xl font-black">✨ Hello, Dreamer ✨</h1>
              <div className="text-sm text-center max-w-xs">
                Please connect your Wallet to start using the Onchain Dreamers
                Passport!
              </div>
            </div>
            <ConnectButton />
          </div>
        )}
        {/* Bottom right cloud */}
        <motion.img
          initial={{ opacity: 0, y: 200 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.75 }}
          className="z-10 absolute -bottom-10 -right-24"
          src="/assets/cloud_1.png"
          layoutId="cloud1"
        />
        {/* Top right cloud */}
        <motion.img
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
          style={{ scale: 1.1 }}
          className="z-20 absolute top-0 left-28"
          src="/assets/cloud_2.png"
          layoutId="cloud1"
        />
        {/* Top left cloud */}
        <motion.img
          initial={{ opacity: 0, x: -225 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          style={{ scale: 1.1 }}
          className="z-30 absolute top-40 right-56"
          src="/assets/cloud_3.png"
          layoutId="cloud1"
        />
        {/* Bottom left cloud */}
        <motion.img
          initial={{ opacity: 0, x: -200 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ scale: 1.1 }}
          className="z-40 absolute bottom-52 left-7"
          src="/assets/cloud_4.png"
          layoutId="cloud1"
        />
      </motion.div>
    </div>
  );
}
