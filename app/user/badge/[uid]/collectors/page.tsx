"use client";

import { useCountUp } from "@/components/hooks/useCountUp";
import { useCreateBadge } from "@/components/hooks/useCreateBadge";
import { useGetAllAttestationsOfAKind } from "@/components/hooks/useGetAllAttestationsOfAKind";
import CollectorRow from "@/components/ui/collectors/CollectorRow";
import CollectorRowWithInfo from "@/components/ui/collectors/CollectorRowWithInfo";
import { LinkTextWithIcon } from "@/components/ui/linkTextWithIcon";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
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
  const { sourceAttestation, badge } = useCreateBadge(uid, account);
  const { allAttestationsOfAKind } = useGetAllAttestationsOfAKind({
    sourceAttestation,
    account,
  });
  const collectorsCount = useCountUp(allAttestationsOfAKind.length, 2000); // 2 seconds duration

  if (!account.address) {
    return (
      <div className="flex justify-center items-center min-h-screen h-full w-full bg-background">
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-background sm:p-6">
      {badge ? (
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
            <h1 className="font-black text-2xl">
              {collectorsCount} Collectors 👤
            </h1>
          </motion.div>

          <span className="w-full">
            Check the list of users who received this badge
          </span>

          <div className="grid grid-cols-1 justify-start items-center gap-3 w-full">
            <div className="flex w-full justify-between">
              <span className="font-bold">{badge!.title} badge collectors</span>
              <LinkTextWithIcon
                href={`https://sepolia.easscan.org/attestation/view/${badge.attestationUID}`}
              >
                Easscan
              </LinkTextWithIcon>
              {/* TODO: change to Base*/}
            </div>
            {allAttestationsOfAKind.map((attestation, index) => (
              <CollectorRowWithInfo
                key={index}
                index={index}
                collector={attestation.recipient as `0x${string}`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 justify-start items-center min-h-screen w-full sm:max-w-md bg-background rounded-lg sm:shadow-lg p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-start items-center w-full h-[32px]"
          >
            <Link href={`/user/badge/${uid}`} className="rounded-full">
              <ArrowLeft size={24} />
            </Link>
          </motion.div>
          <Loader2 className="animate-spin w-4" />
        </div>
      )}
    </div>
  );
}
