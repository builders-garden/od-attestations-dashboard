"use client";
import { useCountUp } from "@/components/hooks/useCountUp";
import { useCreateBadge } from "@/components/hooks/useCreateBadge";
import { useGetAllAttestationsOfAKind } from "@/components/hooks/useGetAllAttestationsOfAKind";
import CollectorRowWithInfo from "@/components/ui/collectors/CollectorRowWithInfo";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { useAccount } from "wagmi";
import { Wrapper } from "@/components/ui/wrapper";
import { Icons } from "@/components/ui/icons";
import PaginatorButtons from "@/components/ui/paginatorButtons";
import { usePagination } from "@/components/hooks/usePagination";

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
  const {
    currentPage,
    totalPages,
    setCurrentPage,
    paginatedItems: paginatedAttestations,
  } = usePagination(
    allAttestationsOfAKind.map((profile, index) => ({
      ...profile,
      attestationId: allAttestationsOfAKind[index].id,
    })),
    10,
  );

  const isProduction = process.env.NODE_ENV === "production";

  return (
    <Wrapper className="gap-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center w-full h-[32px]"
      >
        <Link href={`/user/badge/${uid}`} className="rounded-full">
          <ArrowLeft size={24} />
        </Link>
        {badge && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="font-black text-2xl"
          >
            {collectorsCount} Collectors 👤
          </motion.h1>
        )}
      </motion.div>

      {badge ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col justify-center items-center w-full gap-6"
        >
          <span className="w-full">
            Check the list of users who received this badge
          </span>

          <div className="grid grid-cols-1 justify-start items-center gap-3 w-full">
            <div className="flex w-full justify-between">
              <span className="font-bold">{badge!.title} badge collectors</span>
            </div>
            {paginatedAttestations.map((attestation, index) => (
              <CollectorRowWithInfo
                key={index}
                collector={attestation.recipient}
                onClick={() => {
                  window.open(
                    `https://${isProduction ? "base" : "sepolia"}.easscan.org/attestation/view/${attestation.id}`,
                    "_blank",
                  );
                }}
              />
            ))}
          </div>
          <PaginatorButtons
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </motion.div>
      ) : (
        <div className="flex justify-center items-center w-full h-full mt-32">
          <Icons.spinner className="mr-2 h-10 w-10 animate-spin" />
        </div>
      )}
    </Wrapper>
  );
}
