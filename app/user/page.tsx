"use client";
import UserBadges from "@/components/ui/user/UserBadges";
import UserHeader from "@/components/ui/user/UserHeader";
import { Wrapper } from "@/components/ui/wrapper";
import { adminAddresses } from "@/lib/constants";
import {
  getUserUniqueAttestations,
  getEveryUniqueAttestation,
} from "@/lib/eas";
import { Attestation } from "@/lib/eas/types";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function UserHome() {
  const account = useAccount();
  const [userAttestations, setUserAttestations] = useState<Attestation[]>([]);
  const [allAttestations, setAllAttestations] = useState<Attestation[]>([]);
  const [loadingAttestations, setLoadingAttestations] = useState<boolean>(true);

  useEffect(() => {
    const fetchAttestations = async () => {
      if (!account.address || !account.chain?.id) return;
      const allAttestations = await getEveryUniqueAttestation(
        adminAddresses,
        account.chain.id,
      );
      setAllAttestations(allAttestations);

      const userAttestations = await getUserUniqueAttestations(
        account.address,
        adminAddresses,
        account.chain.id,
      );
      setUserAttestations(userAttestations);

      setLoadingAttestations(false);
    };

    fetchAttestations();
  }, [account.address, account.chain?.id]);

  return (
    <Wrapper>
      <UserHeader userAttestations={userAttestations} account={account} />
      {!loadingAttestations && (
        <UserBadges
          allAttestations={allAttestations}
          userAttestations={userAttestations}
        />
      )}
    </Wrapper>
  );
}
