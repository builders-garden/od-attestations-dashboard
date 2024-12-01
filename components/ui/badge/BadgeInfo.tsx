import BadgeClass from "@/lib/classes/BadgeClass";
import { Calendar, CircleX, Hash, IdCard, Send } from "lucide-react";
import { Button } from "../button";
import { useRouter } from "next/navigation";
import { Separator } from "../separator";
import { shorten } from "@/lib/utils";
import Link from "next/link";
import { Attestation } from "@/lib/eas/types";
import { useAccount } from "wagmi";
import { ViewCollectorsButton } from "./ViewCollectorsButton";

interface BadgeInfoProps {
  badge: BadgeClass;
  allAttestationsOfAKind: Attestation[];
}

export default function BadgeInfo({
  badge,
  allAttestationsOfAKind,
}: BadgeInfoProps) {
  const account = useAccount();
  const router = useRouter();

  // Get the index of the attestation that has the same recipient address as account.address
  const userAttestationIndex =
    allAttestationsOfAKind.findIndex(
      (attestation) => attestation.recipient === account.address,
    ) + 1;

  return (
    <>
      <h1 className="text-2xl font-black text-black">{badge.title}</h1>

      {badge.unlocked && (
        <>
          <div className="flex gap-3 items-center justify-center">
            <Link
              href={`https://sepolia.easscan.org/attestation/view/${badge.attestationUID}`} // TODO: change to Base
              className="flex justify-start items-center gap-2 px-2 h-7 bg-primary rounded-md"
              target="_blank"
            >
              <IdCard className="text-white" size={24} />
              <label className="text-white font-medium cursor-pointer">
                {shorten(badge.attestationUID)}
              </label>
            </Link>
            <div className="flex justify-start items-center gap-1 px-2 h-7 bg-primary rounded-md">
              <Hash className="text-white" size={20} />
              <label className="text-white font-medium">
                {userAttestationIndex + "/" + allAttestationsOfAKind.length}
              </label>
            </div>
          </div>
        </>
      )}

      <div className="flex gap-3 items-center justify-center">
        {badge.unlocked && (
          <div className="flex justify-start items-center gap-1 px-2 h-7 rounded-md">
            <Calendar className="text-primary" size={20} />
            <label className="text-primary font-bold">
              {new Date(badge.timeCreated * 1000).toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                },
              )}
            </label>
          </div>
        )}
      </div>

      <ViewCollectorsButton
        badge={badge}
        allAttestationsOfAKind={allAttestationsOfAKind}
      />

      <div className="flex flex-col gap-0 w-full items-center">
        <Separator />
        <div className="flex gap-4">
          <Button
            className="h-fit py-1 px-2"
            variant="destructive"
            onClick={() =>
              router.push(`/user/badge/${badge.attestationUID}/revoke`)
            }
          >
            <CircleX size={16} />
            Revoke
          </Button>
          <Button
            className="h-fit py-1 px-2"
            variant="green"
            onClick={() =>
              router.push(`/user/badge/${badge.attestationUID}/reissue`)
            }
          >
            <Send size={16} />
            Reissue
          </Button>
        </div>
        <Separator />
      </div>

      <p className="text-sm font-medium text-center text-muted-foreground mt-2">
        {badge.description}
      </p>
    </>
  );
}
