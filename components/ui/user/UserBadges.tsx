import { motion } from "framer-motion";
import BadgeCard from "../badge/BadgeCard";
import { Attestation, AttestationDecodedDataType } from "@/lib/eas/types";
import { useCountUp } from "@/components/hooks/useCountUp";
import { useEffect, useState } from "react";
import BadgeClass from "@/lib/classes/BadgeClass";
import { createUniqueKey } from "@/lib/eas";

interface UserBadgesProps {
  userAttestations: Attestation[];
  allAttestations: Attestation[];
}

export default function UserBadges({
  userAttestations,
  allAttestations,
}: UserBadgesProps) {
  const userAttestationsCount = useCountUp(userAttestations.length, 2000); // 2 seconds duration
  const allAttestationsCount = useCountUp(allAttestations.length, 2000); // 2 seconds duration
  const [allBadges, setAllBadges] = useState<BadgeClass[]>([]);

  useEffect(() => {
    // Generates all the Badges
    const allBadges: BadgeClass[] = [];

    // Get the unique keys of the user's attestations
    const userAttestationsKeys = userAttestations.map((attestation) => {
      if (!attestation.decodedDataJson) return;
      const uniqueKey = createUniqueKey(
        attestation.schemaId,
        JSON.parse(attestation.decodedDataJson),
      );
      return uniqueKey;
    });
    // Remove undefined values
    const userAttestationsKeysFiltered = userAttestationsKeys.filter(
      (key) => key,
    );

    // For each attestation, create a new Badge and set the unlocked property to true if the user has the attestation
    allAttestations.forEach((attestation) => {
      if (!attestation.decodedDataJson) return;
      const attestationDecodedDataArray: AttestationDecodedDataType[] =
        JSON.parse(attestation.decodedDataJson);
      const uniqueKey = createUniqueKey(
        attestation.schemaId,
        attestationDecodedDataArray,
      );
      const unlocked = userAttestationsKeysFiltered.includes(uniqueKey);

      // Get the Badge information from the attestation
      let badgeImageCID = "";
      let badgeTitle = "";
      let badgeDescription = "";
      for (const element of attestationDecodedDataArray) {
        if (element.value.name === "BadgeTitle") {
          badgeTitle = element.value.value as string;
        } else if (element.value.name === "BadgeImageCID") {
          badgeImageCID = element.value.value as string;
        } else if (element.value.name === "BadgeDescription") {
          badgeDescription = element.value.value as string;
        }
      }
      const badge = new BadgeClass(
        allBadges.length + 1,
        badgeImageCID,
        badgeTitle,
        unlocked,
        badgeDescription,
      );
      allBadges.push(badge);
    });

    setAllBadges(allBadges);
  }, [allAttestations, userAttestations]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Badges Header */}
      <motion.div
        className="flex flex-row justify-between items-end w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-black text-start text-black">
          Your Badges
        </h1>
        <div className="text-xs">
          Owned {userAttestationsCount}/{allAttestationsCount}
        </div>
      </motion.div>

      {/* Badges */}
      <div className="grid grid-cols-2 justify-start items-center gap-5 w-full">
        {allBadges.map((badge) => (
          <BadgeCard key={badge.index} badge={badge} />
        ))}
      </div>
    </div>
  );
}
