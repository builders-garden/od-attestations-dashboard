"use client";
import CollectorRow from "@/components/ui/collectors/CollectorRow";
import { collectors } from "@/lib/constants";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { useAccount } from "wagmi";

export default function BadgeCollectorsPage({ params }: { params: Promise<{ index: string }> }) {
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
          className="flex justify-between items-center w-full"
        >
          <Link href={`/user/badge/${index}`} className="p-1 rounded-full">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="font-black text-lg">65 Collectors of badge # {index}</h1>
        </motion.div>

        <div className="grid grid-cols-1 justify-start items-center gap-3 mt-5 w-full">
          {collectors.map((collector, index) => (
            <CollectorRow key={index} index={index} collector={collector} />
          ))}
        </div>
      </div>
    </div>
  );
}
