"use client";
import { useCreateBadge } from "@/components/hooks/useCreateBadge";
import { useEnsProfiles } from "@/components/hooks/useEnsProfile";
import { useGetAllAttestationsOfAKind } from "@/components/hooks/useGetAllAttestationsOfAKind";
import { useSendSafeTransaction } from "@/components/hooks/useSendSafeTransaction";
import { Button } from "@/components/ui/button";
import CollectorRow from "@/components/ui/collectors/CollectorRow";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LinkTextWithIcon } from "@/components/ui/linkTextWithIcon";
import PaginatorButtons from "@/components/ui/paginatorButtons";
import { SafeDashboardDialog } from "@/components/ui/SafeDashboardDialog";
import { Wrapper } from "@/components/ui/wrapper";
import { easMultiRevoke } from "@/lib/eas/calls";
import { EAS_CONTRACT_ADDRESSES } from "@/lib/eas/constants";
import { EnsProfileType } from "@/lib/ens";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { use, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";

export default function BadgeRevokePage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const { uid } = use(params);
  const account = useAccount();
  const { badge, sourceAttestation, notFound } = useCreateBadge(uid, account);
  const { allAttestationsOfAKind } = useGetAllAttestationsOfAKind({
    sourceAttestation,
    account,
  });
  const [input, setInput] = useState("");
  const [selectedCollectors, setSelectedCollectors] = useState<string[]>([]);
  const [openSafeDialog, setOpenSafeDialog] = useState(false);
  const [openRevokeDialog, setOpenRevokeDialog] = useState(false);
  const [safeTxHash, setSafeTxHash] = useState<`0x${string}`>();
  const { sendSafeTransaction } = useSendSafeTransaction();

  // Collectors logic
  const collectors = allAttestationsOfAKind.map(
    (attestation) => attestation.recipient,
  );
  const [collectorsEns, setCollectorsEns] = useState<Record<string, string>>(
    {},
  );
  const atLeastOneSelected = selectedCollectors.length > 0;

  const { ensProfiles } = useEnsProfiles(
    allAttestationsOfAKind.map(
      (attestation) => attestation.recipient as `0x${string}`,
    ),
  );

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const paginatedProfiles: EnsProfileType[] = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return ensProfiles.slice(startIndex, endIndex);
  }, [ensProfiles, currentPage]);

  const totalPages = Math.ceil(allAttestationsOfAKind.length / itemsPerPage);

  const handleSelect = (collector: string) => {
    setSelectedCollectors((prev) =>
      prev.includes(collector)
        ? prev.filter((c) => c !== collector)
        : [...prev, collector],
    );
  };

  const handleSelectAll = () => {
    setSelectedCollectors(collectors);
  };

  const [txLoading, setTxLoading] = useState(false);

  const handleRevokeBadges = async () => {
    try {
      if (account.chain && sourceAttestation) {
        const attestationUIDs = selectedCollectors.map(
          (collector) =>
            allAttestationsOfAKind.find((a) => a.recipient === collector)?.id,
        ) as `0x${string}`[];
        setTxLoading(true);
        const txHash = await sendSafeTransaction(
          easMultiRevoke(
            EAS_CONTRACT_ADDRESSES[
              account.chain.id as keyof typeof EAS_CONTRACT_ADDRESSES
            ],
            sourceAttestation.schema.id as `0x${string}`,
            attestationUIDs,
          ),
        );
        setTxLoading(false);
        setOpenRevokeDialog(false);
        if (txHash) {
          setSafeTxHash(txHash);
          setOpenSafeDialog(true);
        }
      }
    } catch (err) {
      setTxLoading(false);
      setOpenRevokeDialog(false);
      console.error(err);
      toast.error("An error occurred while revoking the badge.");
    }
  };

  return (
    <Wrapper className="justify-between gap-6">
      <div className="flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center w-full"
        >
          <Link href={`/user/badge/${uid}`} className="rounded-full">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="font-black text-2xl">Revoke 🚫</h1>
        </motion.div>

        {notFound ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center pt-56 items-center w-full"
          >
            <h1 className="text-2xl font-black text-black">
              Badge not found...
            </h1>
          </motion.div>
        ) : (
          <>
            <span className="w-full">
              Select one or more users to revoke the selected badge from them.
            </span>

            <div className="grid grid-cols-1 justify-start items-center gap-3 w-full">
              {badge ? (
                <div className="flex w-full justify-between">
                  <span className="font-bold">{badge.title} collectors</span>
                  <LinkTextWithIcon
                    href={`https://sepolia.easscan.org/attestation/view/${badge.attestationUID}`}
                  >
                    Easscan
                  </LinkTextWithIcon>
                </div>
              ) : (
                <div className="flex w-full justify-between items-center">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-skeleton h-6 w-48 rounded-md animate-pulse"
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-skeleton h-6 w-20 rounded-md animate-pulse"
                  />
                </div>
              )}
              <div className="flex w-fulljustify-between gap-1">
                <Input
                  placeholder="Search..."
                  className="focus-visible:ring-primary w-full"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button onClick={handleSelectAll} className="w-fit">
                  Select All
                </Button>
                <Button
                  onClick={() => setSelectedCollectors([])}
                  className={cn(
                    "w-fit transition-all duration-200 ease-in-out",
                    atLeastOneSelected && "w-fit px-4",
                    !atLeastOneSelected && "text-transparent w-0 p-0",
                  )}
                  variant="destructive"
                >
                  {atLeastOneSelected && "Reset"}
                </Button>
              </div>
              <div className="flex flex-col gap-3 w-full max-h-[50rem] overflow-y-auto">
                {paginatedProfiles
                  .filter(
                    (profile) =>
                      profile.name.includes(input) ||
                      collectorsEns[profile.name]?.includes(input),
                  )
                  .map((profile, index) => (
                    <CollectorRow
                      key={index}
                      index={index + 1}
                      profile={profile}
                      selectable
                      selected={selectedCollectors.includes(profile.address)}
                      onClick={() => handleSelect(profile.address)}
                      setCollectorsEns={setCollectorsEns}
                    />
                  ))}
                {totalPages > 1 && (
                  <PaginatorButtons
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <Dialog open={openRevokeDialog} onOpenChange={setOpenRevokeDialog}>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            className="text-2xl px-8 py-6 rounded-lg w-full transition-opacity duration-200 ease-in-out"
            disabled={!atLeastOneSelected}
          >
            Revoke
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm gap-6">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-extrabold">
              Confirm Revocation
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center">
            Are you sure you want to permanently revoke this badge from the
            selected users? This action cannot be undone.
          </DialogDescription>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleRevokeBadges}
              disabled={txLoading}
            >
              {txLoading && <Loader2 className="w-4 animate-spin" />}
              Revoke
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <SafeDashboardDialog
        hash={safeTxHash}
        open={openSafeDialog}
        onOpenChange={(open) => {
          setOpenSafeDialog(open);
          if (!open) {
            setSelectedCollectors([]);
          }
        }}
      />
    </Wrapper>
  );
}
