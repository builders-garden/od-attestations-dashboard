"use client";
import { useCreateBadge } from "@/components/hooks/useCreateBadge";
import { useGetAllAttestationsOfAKind } from "@/components/hooks/useGetAllAttestationsOfAKind";
import BadgeInfo from "@/components/ui/badge/BadgeInfo";
import { Clouds } from "@/components/ui/clouds";
import { Icons } from "@/components/ui/icons";
import { Wrapper } from "@/components/ui/wrapper";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { useAccount } from "wagmi";

export default function BadgePage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const account = useAccount();
  const { uid } = use(params);
  const { badge, sourceAttestation, notFound } = useCreateBadge(uid, account);
  const { allAttestationsOfAKind } = useGetAllAttestationsOfAKind({
    sourceAttestation,
    account,
  });

  if (!account.isConnecting && !account.address) {
    return (
      <Wrapper className="justify-center overflow-hidden">
        <ConnectButton />
        <Clouds />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center w-full h-[32px]"
      >
        <Link href="/user" className="rounded-full">
          <ArrowLeft size={24} />
        </Link>

        {badge && <Share2 size={24} /> /* TODO: Add share functionality*/}
      </motion.div>
      {badge && allAttestationsOfAKind.length > 0 ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <img
              src={badge.image || "/badges/badge_placeholder.png"}
              alt="logo"
              className="w-52 h-52 rounded-full object-cover border-8 border-primary p-3"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col justify-center items-center w-full mt-6 gap-2.5"
          >
            <BadgeInfo
              badge={badge}
              allAttestationsOfAKind={allAttestationsOfAKind}
            />
          </motion.div>
        </>
      ) : notFound ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center pt-56 items-center w-full"
        >
          <h1 className="text-2xl font-black text-black">Badge not found...</h1>
        </motion.div>
      ) : (
        <div className="flex justify-center items-center w-full h-full mt-32">
          <Icons.spinner className="mr-2 h-10 w-10 animate-spin" />
        </div>
      )}
    </Wrapper>
  );
}
