import { getAllAttestationsOfAKind } from "@/lib/eas";
import { Attestation } from "@/lib/eas/types";
import { useEffect, useState } from "react";
import { Config, UseAccountReturnType } from "wagmi";

export const useGetAllAttestationsOfAKind = ({
  sourceAttestation,
  account,
}: {
  sourceAttestation: Attestation | undefined;
  account: UseAccountReturnType<Config>;
}) => {
  const [allAttestationsOfAKind, setAllAttestationsOfAKind] = useState<
    Attestation[]
  >([]);

  useEffect(() => {
    const fetchAllAttestationsOfAKind = async () => {
      const attestations = await getAllAttestationsOfAKind(
        sourceAttestation?.decodedDataJson,
        account.chain?.id,
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

  return allAttestationsOfAKind;
};
