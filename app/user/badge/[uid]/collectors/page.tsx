"use client";

import CollectorRow from "@/components/ui/collectors/CollectorRow";
import { LinkTextWithIcon } from "@/components/ui/linkTextWithIcon";
import { collectors, userBadges } from "@/lib/constants";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { useAccount } from "wagmi";

export default function BadgeCollectorsPage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const account = useAccount();
  const { uid } = use(params);

  if (!account.address) {
    return (
      <div className="flex justify-center items-center min-h-screen h-full w-full bg-background">
        <ConnectButton />
      </div>
    );
  }

  const badge = userBadges[parseInt(uid) - 1];

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-background sm:p-6">
      <div className="flex flex-col gap-6 justify-start items-center min-h-screen w-full sm:max-w-md bg-background rounded-lg sm:shadow-lg p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center w-full"
        >
          <Link href={`/user/badge/${uid}`} className="rounded-full">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="font-black text-2xl">65 Collectors 👤</h1>
        </motion.div>

        <span className="w-full">
          Check the list of users who received this badge
        </span>

        <div className="grid grid-cols-1 justify-start items-center gap-3 w-full">
          <div className="flex w-full justify-between">
            <span className="font-bold">{badge.title} collectors</span>
            <LinkTextWithIcon>Easscan</LinkTextWithIcon>
          </div>
          {collectors.map((collector, index) => (
            <CollectorRow key={index} collector={collector} />
          ))}
        </div>
      </div>
    </div>
  );
}
