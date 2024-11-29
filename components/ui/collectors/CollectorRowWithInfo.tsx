import { useEnsProfile } from "@/components/hooks/useEnsProfile";
import { multisigSigners } from "@/lib/constants";
import { getUserUniqueAttestations } from "@/lib/eas";
import { Attestation } from "@/lib/eas/types";
import { cn, shorten } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

interface CollectorRowProps {
  collector: string;
  index?: number;
  onClick?: () => void;
}

export default function CollectorRowWithInfo({
  collector,
  index = 0,
  onClick,
}: CollectorRowProps) {
  const shortedAddress = shorten(collector);
  const { ensProfile, loadingProfile } = useEnsProfile(
    collector as `0x${string}`,
  );
  const account = useAccount();
  const [userAttestations, setUserAttestations] = useState<Attestation[]>();

  useEffect(() => {
    const fetchAttestations = async () => {
      if (!account.address || !account.chain?.id) return;
      const userAttestations = await getUserUniqueAttestations(
        account.address,
        multisigSigners,
        account.chain.id,
      );
      setUserAttestations(userAttestations);
    };

    fetchAttestations();
  }, [account.address, account.chain?.id]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.15 * index }}
      className={cn(
        "flex flex-row justify-center items-center w-full p-2 gap-2 bg-secondary hover:bg-secondary-dark rounded-lg transition-all duration-200 ease-in-out",
        onClick && "cursor-pointer",
      )}
      onClick={onClick}
    >
      {loadingProfile || !userAttestations ? (
        <motion.div
          className="flex justify-between items-center w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-start items-center gap-2">
            <div className="w-8 h-8 rounded-full animate-pulse bg-skeleton" />
            <div className="bg-skeleton h-4 w-56 rounded-md animate-pulse" />
          </div>
          <div className="bg-skeleton h-7 w-7 rounded-md animate-pulse" />
        </motion.div>
      ) : (
        <motion.div
          className="flex justify-between items-center w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-start items-center gap-2.5">
            <img
              src={ensProfile?.avatar ?? "/propic_placeholder.png"}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />

            <label className="font-medium font-mono">
              {ensProfile?.name || shortedAddress}
            </label>
          </div>
          <div className="flex justify-center items-center text-center font-medium px-2.5 bg-primary rounded-lg text-white">
            {userAttestations.length}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
