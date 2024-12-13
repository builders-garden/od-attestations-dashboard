import { useEffect, useState } from "react";
import { Attestation, AttestationDecodedDataType } from "@/lib/eas/types";
import BadgeClass from "@/lib/classes/BadgeClass";
import { UseAccountReturnType } from "wagmi";
import { getAttestationFromUID } from "@/lib/eas";
import { getIpfsImageUrl } from "@/lib/ipfs";

export const useCreateBadge = (uid: string, account: UseAccountReturnType) => {
  const [badge, setBadge] = useState<BadgeClass>();
  const [sourceAttestation, setSourceAttestation] = useState<Attestation>();
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    const createBadge = async () => {
      if (!account.address) {
        return;
      }

      // Fetch the attestation from the UID
      const attestation = await getAttestationFromUID(uid);

      // Get the decoded data from the attestation
      if (!attestation || !attestation.decodedDataJson) {
        setNotFound(true);
        return;
      }
      const attestationDecodedDataArray: AttestationDecodedDataType[] =
        JSON.parse(attestation.decodedDataJson);

      // Get the Badge information from the attestation
      let badgeImageURL = "";
      let badgeTitle = "";
      let badgeDescription = "";
      const details: { name: string; value: string }[] = [];
      for (const element of attestationDecodedDataArray) {
        if (element.value.name === "BadgeTitle") {
          badgeTitle = element.value.value as string;
        } else if (element.value.name === "BadgeImageCID") {
          badgeImageURL = getIpfsImageUrl(element.value.value as string);
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
        badgeImageURL,
        badgeTitle,
        account.address === attestation.recipient,
        badgeDescription,
        attestation.id,
        attestation.timeCreated,
        details,
      );
      setBadge(badge);
      setSourceAttestation(attestation);
    };

    createBadge();
  }, [account.address, uid]);

  return { badge, sourceAttestation, notFound };
};
