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
import { cn } from "@/lib/utils";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { easMultiAttest } from "@/lib/eas/calls";
import { EAS_CONTRACT_ADDRESSES } from "@/lib/eas/constants";
import { AttestationDecodedDataType } from "@/lib/eas/types";

export default function BadgeReissuePage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const { uid } = use(params);
  const account = useAccount();
  const { badge, sourceAttestation, notFound } = useCreateBadge(uid, account);
  const [loading, setLoading] = useState<boolean>(false);
  const [collectors, setCollectors] = useState<string[]>([]);
  const { writeContract } = useWriteContract();

  const handleReissueBadge = () => {
    setLoading(true);
    try {
      if (account.chain && sourceAttestation) {
        const schemaEncoder = new SchemaEncoder(
          sourceAttestation?.schema.schema as string,
        );
        const decodedData: AttestationDecodedDataType[] = JSON.parse(
          sourceAttestation.decodedDataJson,
        );
        const values = decodedData.map((data) => data.value);
        const encodedData = schemaEncoder.encodeData(values);
        writeContract(
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
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log("loading", loading);
  }, [loading]);

  if (!account.address) {
    return (
      <div className="flex justify-center items-center min-h-screen h-full w-full bg-background">
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col justify-between items-center min-h-screen w-full sm:max-w-md bg-background rounded-lg sm:shadow-lg p-6"
      >
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

          <span className="w-full">
            Insert one or more users to reissue the selected badge to them.
          </span>

          <div className="grid grid-cols-1 justify-start items-center gap-3 w-full">
            <div className="flex w-full justify-between">
              <span className="font-bold">New {badge?.title} collectors</span>
              <LinkTextWithIcon href="">Easscan</LinkTextWithIcon>
            </div>
            <InputCollectorList
              collectors={collectors}
              setCollectors={setCollectors}
            />
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className={cn(
                "text-2xl px-8 py-6 rounded-lg w-full transition-opacity duration-200 ease-in-out",
                collectors.length > 0 && "opacity-1",
                collectors.length === 0 && "opacity-0",
              )}
              variant="green"
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
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                variant="green"
                className="w-full"
                onClick={handleReissueBadge}
                disabled={loading}
              >
                {loading && <Loader2 className="animate-spin w-4" />}
                Reissue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
