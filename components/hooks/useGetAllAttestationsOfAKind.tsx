import { getAllAttestationsOfAKind } from "@/lib/eas";
import { Attestation } from "@/lib/eas/types";
import { useEffect, useState } from "react";

export const useGetAllAttestationsOfAKind = ({
  sourceAttestation,
}: {
  sourceAttestation: Attestation | undefined;
}) => {
  const [allAttestationsOfAKind, setAllAttestationsOfAKind] = useState<
    Attestation[]
  >([]);

  useEffect(() => {
    const fetchAllAttestationsOfAKind = async () => {
      const attestations = await getAllAttestationsOfAKind(
        sourceAttestation?.decodedDataJson,
      );
      const collectorAddresses: string[] = [];
      attestations.forEach((attestation) => {
        if (!collectorAddresses.includes(attestation.recipient)) {
          collectorAddresses.push(attestation.recipient);
        }
      });
      setAllAttestationsOfAKind(attestations);
    };
    if (sourceAttestation) fetchAllAttestationsOfAKind();
  }, [sourceAttestation]);

  return { allAttestationsOfAKind };
};
