"use client";
import { useCreateBadge } from "@/components/hooks/useCreateBadge";
import { useGetAllAttestationsOfAKind } from "@/components/hooks/useGetAllAttestationsOfAKind";
import { useSafeContext } from "@/components/providers/SafeProvider";
import BadgeInfo from "@/components/ui/badge/BadgeInfo";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Wrapper } from "@/components/ui/wrapper";
import { motion } from "framer-motion";
import { ArrowLeft, CircleX, Send, Share2 } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { useAccount } from "wagmi";
import { toast } from "sonner";

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
  const { isAdmin } = useSafeContext();

  return (
    <Wrapper className="justify-between">
      <div className="flex flex-col justify-between items-center w-full gap-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center w-full h-[32px]"
        >
          <Link href="/user" className="rounded-full">
            <ArrowLeft size={24} />
          </Link>

          {badge && (
            <Button
              variant="ghost"
              className="h-[24] w-[24] p-0"
              onClick={
                //Copy to clipboard and show a toast
                () => {
                  navigator.clipboard.writeText(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/user/badge/${badge.attestationUID}`,
                  );
                  toast.success("Badge link copied to clipboard");
                }
              }
            >
              <Share2 size={24} />
            </Button>
          )}
        </motion.div>
        {badge && allAttestationsOfAKind.length > 0 ? (
          <>
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              src={badge.image || "/badges/badge_placeholder.png"}
              alt="logo"
              className="w-[270px] h-[270px] rounded-full object-cover p-[0.65rem] bg-primary"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col justify-center items-center w-full gap-2.5"
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
            <h1 className="text-2xl font-black text-black">
              Badge not found...
            </h1>
          </motion.div>
        ) : (
          <div className="flex justify-center items-center w-full h-full mt-32">
            <Icons.spinner className="mr-2 h-10 w-10 animate-spin" />
          </div>
        )}
      </div>

      {isAdmin && badge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex w-full gap-4"
        >
          <Link
            href={`/user/badge/${badge.attestationUID}/revoke`}
            className="w-full"
          >
            <Button variant="destructive" className="text-2xl px-8 py-6 w-full">
              <CircleX size={24} />
              Revoke
            </Button>
          </Link>
          <Link
            href={`/user/badge/${badge.attestationUID}/reissue`}
            className="w-full"
          >
            <Button className="text-2xl px-8 py-6 w-full">
              <Send size={24} />
              Reissue
            </Button>
          </Link>
        </motion.div>
      )}
    </Wrapper>
  );
}
