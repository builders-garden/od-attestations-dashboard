"use client";
import BadgeInfo from "@/components/ui/badge/BadgeInfo";
import { userBadges } from "@/lib/constants";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { useAccount } from "wagmi";

export default function BadgePage({
  params,
}: {
  params: Promise<{ index: string }>;
}) {
  const account = useAccount();
  const { index } = use(params);

  if (!account.address) {
    return (
      <div className="flex justify-center items-center min-h-screen h-full w-full bg-background">
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-background sm:p-6">
      <div className="flex flex-col justify-start items-center min-h-screen w-full sm:max-w-md bg-background rounded-lg sm:shadow-lg p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-start w-full"
        >
          <Link href="/user" className="p-1 rounded-full">
            <ArrowLeft size={24} />
          </Link>
          <img
            src={`/badges/badge${index}.png`}
            alt="logo"
            className="w-52 h-52 rounded-full border-8 border-primary p-3"
          />
          <Share2 size={24} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col justify-center items-center w-full mt-6 gap-2.5"
        >
          <BadgeInfo badge={userBadges[parseInt(index) - 1]} />
        </motion.div>
      </div>
    </div>
  );
}
