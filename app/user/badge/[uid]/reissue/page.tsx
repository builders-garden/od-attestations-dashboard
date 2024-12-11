"use client";
import { useCreateBadge } from "@/components/hooks/useCreateBadge";
import { Button } from "@/components/ui/button";
import { InputCollectorList } from "@/components/ui/collectors/InputCollectorList";
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
import { LinkTextWithIcon } from "@/components/ui/linkTextWithIcon";
import {
  SchemaEncoder,
  SchemaItem,
} from "@ethereum-attestation-service/eas-sdk";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { useAccount } from "wagmi";
import { easMultiAttest } from "@/lib/eas/calls";
import { EAS_CONTRACT_ADDRESSES } from "@/lib/eas/constants";
import {
  AttestationDecodedDataType,
  AttestationDecodedDataTypeValue,
} from "@/lib/eas/types";
import { Wrapper } from "@/components/ui/wrapper";
import { SafeDashboardDialog } from "@/components/ui/SafeDashboardDialog";
import { toast } from "sonner";
import { useSendSafeTransaction } from "@/components/hooks/useSendSafeTransaction";

export default function BadgeReissuePage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const { uid } = use(params);
  const account = useAccount();
  const { badge, sourceAttestation, notFound } = useCreateBadge(uid, account);
  const [collectors, setCollectors] = useState<string[]>([]);
  const [openSafeDialog, setOpenSafeDialog] = useState(false);
  const [openReissueDialog, setOpenReissueDialog] = useState(false);
  const [safeTxHash, setSafeTxHash] = useState<`0x${string}`>();
  const { sendSafeTransaction } = useSendSafeTransaction();
  const [txLoading, setTxLoading] = useState(false);

  const isProduction = process.env.NODE_ENV === "production";

  const fixDecodedValues = (
    decodedValues: AttestationDecodedDataTypeValue[],
  ) => {
    let fixedDecodedValues = decodedValues;
    fixedDecodedValues = fixedDecodedValues.map((value) => {
      if (value.type === "uint256") {
        return {
          ...value,
          value:
            typeof value.value === "object" && "hex" in value.value
              ? Number(BigInt(value.value.hex))
              : value.value,
        };
      }
      return value;
    });
    return fixedDecodedValues as SchemaItem[];
  };

  const handleReissueBadges = async () => {
    try {
      if (account.chain && sourceAttestation) {
        const schemaEncoder = new SchemaEncoder(
          sourceAttestation?.schema.schema as string,
        );
        const decodedData: AttestationDecodedDataType[] = JSON.parse(
          sourceAttestation.decodedDataJson,
        );
        const decodedValues = decodedData.map((data) => data.value);
        const fixedDecodedValues = fixDecodedValues(decodedValues);
        const encodedData = schemaEncoder.encodeData(fixedDecodedValues);
        setTxLoading(true);
        const txHash = await sendSafeTransaction(
          easMultiAttest(
            EAS_CONTRACT_ADDRESSES[
              account.chain.id as keyof typeof EAS_CONTRACT_ADDRESSES
            ],
            sourceAttestation.schema.id as `0x${string}`,
            collectors as `0x${string}`[],
            encodedData as `0x${string}`,
            true,
          ),
        );
        setTxLoading(false);
        setOpenReissueDialog(false);
        if (txHash) {
          setSafeTxHash(txHash);
          setOpenSafeDialog(true);
        }
      }
    } catch (err) {
      setTxLoading(false);
      setOpenReissueDialog(false);
      console.error(err);
      toast.error("An error occurred while reissuing the badge.");
    }
  };

  return (
    <Wrapper className="justify-between">
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
          <h1 className="font-black text-2xl">Reissue 📤</h1>
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
              Insert one or more users to reissue the selected badge to them.
            </span>

            <div className="grid grid-cols-1 justify-start items-center gap-3 w-full">
              {badge ? (
                <div className="flex w-full justify-between">
                  <span className="font-bold">
                    New {badge.title} collectors
                  </span>
                  <LinkTextWithIcon
                    href={`https://${isProduction ? "base" : "sepolia"}.easscan.org/attestation/view/${badge.attestationUID}`}
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
              <InputCollectorList
                collectors={collectors}
                setCollectors={setCollectors}
              />
            </div>
          </>
        )}
      </div>

      <Dialog open={openReissueDialog} onOpenChange={setOpenReissueDialog}>
        <DialogTrigger asChild>
          <Button
            className="text-2xl px-8 py-6 w-full transition-opacity duration-200 ease-in-out"
            disabled={collectors.length === 0}
            variant="success"
          >
            Reissue
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm gap-6">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-extrabold">
              Confirm Reissuance
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center">
            Are you sure you want to reissue this badge to the users you
            selected?
          </DialogDescription>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="success"
              className="w-full"
              onClick={handleReissueBadges}
              disabled={txLoading}
            >
              {txLoading && <Loader2 className="w-4 animate-spin" />}
              Reissue
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
            setCollectors([]);
          }
        }}
      />
    </Wrapper>
  );
}
