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

      console.log("attestations: ", attestations);
      setAllAttestationsOfAKind(attestations);
    };
    if (sourceAttestation) fetchAllAttestationsOfAKind();
  }, [sourceAttestation]);

  return allAttestationsOfAKind;
};
