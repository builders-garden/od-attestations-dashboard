import { useEffect, useState } from "react";
import { Attestation, AttestationDecodedDataType } from "@/lib/eas/types";
import BadgeClass from "@/lib/classes/BadgeClass";
import { createUniqueKey } from "@/lib/eas";

export const useCreateBadges = (
  userAttestations: Attestation[],
  allAttestations: Attestation[],
) => {
  const [allBadges, setAllBadges] = useState<BadgeClass[]>([]);

  useEffect(() => {
    const allBadges: BadgeClass[] = [];
    const userAttestationsKeys: string[] = [];

    // Reorder the user attestations by the time of registration
    userAttestations.sort((a, b) => {
      return a.timeCreated - b.timeCreated;
    });

    // Generate the user badges
    userAttestations.forEach((attestation) => {
      if (!attestation.decodedDataJson) return;
      const attestationDecodedDataArray: AttestationDecodedDataType[] =
        JSON.parse(attestation.decodedDataJson);

      // Generate the unique key for the user attestation and add it to the userAttestationsKeys array
      const uniqueKey = createUniqueKey(
        attestation.schemaId,
        attestationDecodedDataArray,
      );
      if (uniqueKey) userAttestationsKeys.push(uniqueKey);

      // Get the Badge information from the attestation
      let badgeImageCID = "";
      let badgeTitle = "";
      let badgeDescription = "";
      const details: { name: string; value: string }[] = [];
      for (const element of attestationDecodedDataArray) {
        if (element.value.name === "BadgeTitle") {
          badgeTitle = element.value.value as string;
        } else if (element.value.name === "BadgeImageCID") {
          badgeImageCID = element.value.value as string;
        } else if (element.value.name === "BadgeDescription") {
          badgeDescription = element.value.value as string;
        } else if (element.value.name === "ODPassport") {
          continue;
        } else {
          if (
            (
              element.value.value as {
                type: string;
              }
            ).type === "BigNumber"
          ) {
            details.push({
              name: element.value.name,
              value: parseInt(
                (
                  element.value.value as {
                    hex: string;
                  }
                ).hex,
                16,
              ).toString(),
            });
          } else {
            details.push({
              name: element.value.name,
              value: String(element.value.value),
            });
          }
        }
      }

      const badge = new BadgeClass(
        badgeImageCID,
        badgeTitle,
        true,
        badgeDescription,
        attestation.id,
        attestation.timeCreated,
        details,
      );
      allBadges.push(badge);
    });

    // Generate the remaining badges avoiding duplicates
    allAttestations.forEach((attestation) => {
      if (!attestation.decodedDataJson) return;
      const attestationDecodedDataArray: AttestationDecodedDataType[] =
        JSON.parse(attestation.decodedDataJson);

      const uniqueKey = createUniqueKey(
        attestation.schemaId,
        attestationDecodedDataArray,
      );

      // Check if the badge is already owned by the user
      if (!uniqueKey || userAttestationsKeys.includes(uniqueKey)) return;

      // Get the Badge information from the attestation
      let badgeImageCID = "";
      let badgeTitle = "";
      let badgeDescription = "";
      const details: { name: string; value: string }[] = [];
      for (const element of attestationDecodedDataArray) {
        if (element.value.name === "BadgeTitle") {
          badgeTitle = element.value.value as string;
        } else if (element.value.name === "BadgeImageCID") {
          badgeImageCID = element.value.value as string;
        } else if (element.value.name === "BadgeDescription") {
          badgeDescription = element.value.value as string;
        } else {
          if (
            (
              element.value.value as {
                type: string;
              }
            ).type === "BigNumber"
          ) {
            details.push({
              name: element.value.name,
              value: parseInt(
                (
                  element.value.value as {
                    hex: string;
                  }
                ).hex,
                16,
              ).toString(),
            });
          } else {
            details.push({
              name: element.value.name,
              value: String(element.value.value),
            });
          }
        }
      }

      const badge = new BadgeClass(
        badgeImageCID,
        badgeTitle,
        false,
        badgeDescription,
        attestation.id,
        attestation.timeCreated,
        details,
      );
      allBadges.push(badge);
    });

    setAllBadges(allBadges);
  }, [allAttestations, userAttestations]);

  return allBadges;
};
