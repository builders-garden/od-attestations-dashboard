import BadgeClass from "@/lib/classes/BadgeClass";
import { Calendar, CircleX, Hash, IdCard, Send, Tag } from "lucide-react";
import { Button } from "../button";
import { useRouter } from "next/navigation";
import { Separator } from "../separator";
import { shorten } from "@/lib/utils";
import Link from "next/link";
import { Attestation } from "@/lib/eas/types";
import { useAccount } from "wagmi";

interface BadgeInfoProps {
  badge: BadgeClass;
  allAttestationsOfAKind: Attestation[];
}

export default function BadgeInfo({
  badge,
  allAttestationsOfAKind,
}: BadgeInfoProps) {
  const account = useAccount();
  const Router = useRouter();

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

      <Button
        className="flex justify-start items-center gap-1.5 px-2 h-fit p-0 rounded-md hover:bg-none"
        variant="ghost"
        onClick={() =>
          Router.push(`/user/badge/${badge.attestationUID}/collectors`)
        }
      >
        <div className="flex">
          {allAttestationsOfAKind[0] && (
            <div className="flex justify-center items-center rounded-full bg-pink-400 w-4 h-4 p-2.5 text-xs">
              {allAttestationsOfAKind[0].recipient.slice(2, 3).toUpperCase()}
            </div>
          )}

          {allAttestationsOfAKind[1] && (
            <div className="flex justify-center items-center rounded-full bg-yellow-400 w-4 h-4 p-2.5 -ml-2 text-xs">
              {allAttestationsOfAKind[1].recipient.slice(2, 3).toUpperCase()}
            </div>
          )}

          {allAttestationsOfAKind[2] && (
            <div className="flex justify-center items-center rounded-full bg-slate-200 w-4 h-4 p-2.5 -ml-2 text-xs">
              {allAttestationsOfAKind[2].recipient.slice(2, 3).toUpperCase()}
            </div>
          )}
        </div>

        <label className="text-black font-medium cursor-pointer">
          {allAttestationsOfAKind.length - 3 < 0
            ? "Collectors"
            : "and " + (allAttestationsOfAKind.length - 3) + " others..."}
        </label>
      </Button>

      <div className="flex flex-col gap-0 w-full items-center">
        <Separator />
        <div className="flex gap-4">
          <Button
            className="h-fit py-1 px-2"
            variant="destructive"
            onClick={() =>
              Router.push(`/user/badge/${badge.attestationUID}/revoke`)
            }
          >
            <CircleX size={16} />
            Revoke
          </Button>
          <Button
            className="h-fit py-1 px-2"
            variant="green"
            onClick={() =>
              Router.push(`/user/badge/${badge.attestationUID}/reissue`)
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
