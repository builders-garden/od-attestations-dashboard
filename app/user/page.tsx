"use client";
import UserBadges from "@/components/ui/user/UserBadges";
import UserHeader from "@/components/ui/user/UserHeader";
import { multisigSigners } from "@/lib/constants";
import {
  getUserUniqueAttestations,
  getEveryUniqueAttestation,
} from "@/lib/eas";
import { Attestation } from "@/lib/eas/types";
import { ConnectButton } from "@rainbow-me/rainbowkit";
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
        multisigSigners,
        account.chain.id,
      );
      setAllAttestations(allAttestations);

      const userAttestations = await getUserUniqueAttestations(
        account.address,
        multisigSigners,
        account.chain.id,
      );
      setUserAttestations(userAttestations);

      setLoadingAttestations(false);
    };

    fetchAttestations();
  }, [account.address, account.chain?.id]);

  if (!account.address) {
    return (
      <div className="flex justify-center items-center min-h-screen h-full w-full bg-background">
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-background sm:p-6">
      <div className="flex flex-col justify-start items-center min-h-screen w-full sm:max-w-md bg-background rounded-lg sm:shadow-lg p-6">
        <UserHeader
          userAttestationsLength={userAttestations.length}
          isAdmin={true}
        />
        {!loadingAttestations && (
          <UserBadges
            allAttestations={allAttestations}
            userAttestations={userAttestations}
          />
        )}
      </div>
    </div>
  );
}
