"use client";
import UserBadges from "@/components/ui/user/UserBadges";
import UserHeader from "@/components/ui/user/UserHeader";
import {
  getUserUniqueAttestations,
  getEveryUniqueAttestations,
} from "@/lib/eas";
import { Attestation } from "@/lib/eas/types";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function UserHome() {
  const account = useAccount();
  const [userAttestations, setUserAttestations] = useState<Attestation[]>([]);
  const [allAttestations, setAllAttestations] = useState<Attestation[]>([]);

  useEffect(() => {
    const fetchUserAttestations = async () => {
      if (!account.address || !account.chain?.id) return;
      const allAttestations = await getEveryUniqueAttestations(
        [
          "0x82A29547CA8970c2aDECF4C2db7e364339f9a4B7",
          "0x4E123166e7DfDE7AbA29162Fb3a5c6Af562443D4",
          "0x23032A3D92D72a857EB4eB2D9ea417ff103A4008",
        ],
        account.chain.id,
      );
      console.log("allAttestations:", allAttestations);
      setAllAttestations(allAttestations);

      const userAttestations = await getUserUniqueAttestations(
        account.address,
        [
          "0x82A29547CA8970c2aDECF4C2db7e364339f9a4B7",
          "0x4E123166e7DfDE7AbA29162Fb3a5c6Af562443D4",
          "0x23032A3D92D72a857EB4eB2D9ea417ff103A4008",
        ],
        account.chain.id,
      );
      console.log("userAttestations: ", userAttestations);
      setUserAttestations(userAttestations);
    };

    fetchUserAttestations();
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
        <UserHeader userAttestations={userAttestations} isAdmin={true} />
        <UserBadges
          allAttestations={allAttestations}
          userAttestations={userAttestations}
        />
      </div>
    </div>
  );
}
