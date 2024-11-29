"use client";
import { useCountUp } from "@/components/hooks/useCountUp";
import { useCreateBadge } from "@/components/hooks/useCreateBadge";
import { useGetAllAttestationsOfAKind } from "@/components/hooks/useGetAllAttestationsOfAKind";
import CollectorRowWithInfo from "@/components/ui/collectors/CollectorRowWithInfo";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { use, useState, useMemo } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";

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

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedAttestations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return allAttestationsOfAKind.slice(startIndex, startIndex + itemsPerPage);
  }, [allAttestationsOfAKind, currentPage]);

  const totalPages = Math.ceil(allAttestationsOfAKind.length / itemsPerPage);

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
            </div>
            {paginatedAttestations.map((attestation, index) => (
              <CollectorRowWithInfo
                key={index}
                index={(currentPage - 1) * itemsPerPage + index + 1}
                collector={attestation.recipient as `0x${string}`}
                onClick={() => {
                  window.open(
                    `https://sepolia.easscan.org/attestation/view/${attestation.id}`,
                    "_blank",
                  );
                }}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="icon"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                variant="outline"
                size="icon"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
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
