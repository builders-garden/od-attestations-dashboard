import { Button } from "@/components/ui/button";
import BadgeClass from "@/lib/classes/BadgeClass";
import { Attestation } from "@/lib/eas/types";
import React from "react";
import { ViewCollectorsButtonAvatar } from "./ViewCollectorsButtonAvatar";
import Link from "next/link";
import { useEnsProfiles } from "@/components/hooks/useEnsProfile";
import { motion } from "framer-motion";

interface ViewCollectorsButtonProps {
  badge: BadgeClass;
  allAttestationsOfAKind: Attestation[];
}

export const ViewCollectorsButton: React.FC<ViewCollectorsButtonProps> = ({
  badge,
  allAttestationsOfAKind,
}) => {
  const bgColor = ["bg-pink-400", "bg-yellow-400", "bg-slate-200"];
  const { ensProfiles } = useEnsProfiles(
    allAttestationsOfAKind
      .slice(0, 3)
      .map((attestation) => attestation.recipient as `0x${string}`),
  );

  return (
    <Link href={`/user/badge/${badge.attestationUID}/collectors`}>
      <Button
        className="flex justify-start items-center gap-1.5 px-2 h-fit p-0 rounded-md hover:bg-none"
        variant="ghost"
      >
        <div className="flex -space-x-1">
          {ensProfiles &&
            ensProfiles.map(
              (profile, index) =>
                profile && (
                  <ViewCollectorsButtonAvatar
                    index={index + 1}
                    ensProfile={profile}
                    bgColor={bgColor[index % 3]}
                    key={index}
                  />
                ),
            )}
        </div>

        <motion.label
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-black font-medium cursor-pointer"
        >
          {allAttestationsOfAKind.length - 3 <= 0
            ? "Collectors"
            : "and " + (allAttestationsOfAKind.length - 3) + " others..."}
        </motion.label>
      </Button>
    </Link>
  );
};
