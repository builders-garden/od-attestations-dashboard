import BadgeClass from "@/lib/classes/BadgeClass";
import { Calendar, Hash, IdCard } from "lucide-react";
import { shorten } from "@/lib/utils";
import Link from "next/link";
import { Attestation } from "@/lib/eas/types";
import { useAccount } from "wagmi";
import { ViewCollectorsButton } from "./ViewCollectorsButton";
import { Separator } from "../separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface BadgeInfoProps {
  badge: BadgeClass;
  allAttestationsOfAKind: Attestation[];
}

export default function BadgeInfo({
  badge,
  allAttestationsOfAKind,
}: BadgeInfoProps) {
  const account = useAccount();

  const isProduction = process.env.NODE_ENV === "production";

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
              href={`https://${isProduction ? "base" : "sepolia"}.easscan.org/attestation/view/${badge.attestationUID}`}
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

      <Separator />

      <p className="text-sm font-medium text-center text-muted-foreground">
        {badge.description}
      </p>

      {badge.details.length > 0 ? (
        <div className="p-4 rounded-md border-[1px] mt-8 w-72">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="collectors" className="border-none">
              <AccordionTrigger className="p-0">Badge Details</AccordionTrigger>
              <AccordionContent className="pb-1 pt-4 px-1">
                {badge.details.map((detail, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      {detail.name}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                      {detail.value}
                    </span>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ) : null}
    </>
  );
}
