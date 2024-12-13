"use client";
import { useSafeContext } from "@/components/providers/SafeProvider";
import UserBadges from "@/components/ui/user/UserBadges";
import UserHeader from "@/components/ui/user/UserHeader";
import { Wrapper } from "@/components/ui/wrapper";
import {
  getUserUniqueAttestations,
  getEveryUniqueAttestation,
} from "@/lib/eas";
import { Attestation } from "@/lib/eas/types";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function UserHome() {
  const account = useAccount();
  const { adminAddresses } = useSafeContext();
  const [userAttestations, setUserAttestations] = useState<Attestation[]>([]);
  const [allAttestations, setAllAttestations] = useState<Attestation[]>([]);
  const [loadingAttestations, setLoadingAttestations] = useState<boolean>(true);

  useEffect(() => {
    const fetchAttestations = async () => {
      if (!account.address || adminAddresses.length <= 0) return;
      const allAttestations = await getEveryUniqueAttestation(adminAddresses);
      setAllAttestations(allAttestations);

      const userAttestations = await getUserUniqueAttestations(
        account.address,
        adminAddresses,
      );
      setUserAttestations(userAttestations);

      setLoadingAttestations(false);
    };

    fetchAttestations();
  }, [account.address, adminAddresses]);

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
