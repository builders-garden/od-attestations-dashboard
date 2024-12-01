import { Button } from "@/components/ui/button";
import BadgeClass from "@/lib/classes/BadgeClass";
import { Attestation } from "@/lib/eas/types";
import { useRouter } from "next/navigation";
import React from "react";
import { ViewCollectorsButtonAvatar } from "./ViewCollectorsButtonAvatar";

interface ViewCollectorsButtonProps {
  badge: BadgeClass;
  allAttestationsOfAKind: Attestation[];
}

export const ViewCollectorsButton: React.FC<ViewCollectorsButtonProps> = ({
  badge,
  allAttestationsOfAKind,
}) => {
  const router = useRouter();

  const bgColor = ["bg-pink-400", "bg-yellow-400", "bg-slate-200"];

  return (
    <Button
      className="flex justify-start items-center gap-1.5 px-2 h-fit p-0 rounded-md hover:bg-none"
      variant="ghost"
      onClick={() =>
        router.push(`/user/badge/${badge.attestationUID}/collectors`)
      }
    >
      <div className="flex -space-x-1">
        {allAttestationsOfAKind
          .slice(0, 3)
          .map(
            (attestation, index) =>
              attestation && (
                <ViewCollectorsButtonAvatar
                  collector={attestation.recipient}
                  bgColor={bgColor[index % 3]}
                  key={index}
                />
              ),
          )}
      </div>

      <label className="text-black font-medium cursor-pointer">
        {allAttestationsOfAKind.length - 3 < 0
          ? "Collectors"
          : "and " + (allAttestationsOfAKind.length - 3) + " others..."}
      </label>
    </Button>
  );
};
