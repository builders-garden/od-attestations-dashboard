import { useEnsProfile } from "@/components/hooks/useEnsProfile";
import { useSafeContext } from "@/components/providers/SafeProvider";
import { getUserUniqueAttestations } from "@/lib/eas";
import { Attestation } from "@/lib/eas/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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
  const [userAttestations, setUserAttestations] = useState<Attestation[]>();
  const { ensProfile } = useEnsProfile(collector);
  const { adminAddresses } = useSafeContext();

  useEffect(() => {
    const fetchAttestations = async () => {
      if (!collector || adminAddresses.length <= 0) return;
      const userAttestations = await getUserUniqueAttestations(
        collector,
        adminAddresses,
      );
      setUserAttestations(userAttestations);
    };

    fetchAttestations();
  }, [collector, adminAddresses]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.1 * index }}
      className={cn(
        "flex flex-row justify-center items-center w-full p-2 gap-2 bg-primary-light hover:bg-primary-light-darker rounded-full transition-all duration-200 ease-in-out",
        onClick && "cursor-pointer",
      )}
      onClick={onClick}
    >
      {userAttestations && ensProfile ? (
        <motion.div
          className="flex justify-between items-center w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-start items-center gap-2.5">
            <img
              src={
                ensProfile.avatar && ensProfile.avatar.startsWith("http")
                  ? ensProfile.avatar
                  : "/propic_placeholder.png"
              }
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />

            <label className="font-medium font-mono cursor-pointer">
              {ensProfile.displayName}
            </label>
          </div>
          <div className="flex justify-center items-center text-center font-medium px-2.5 bg-primary rounded-full text-white w-12 h-8">
            {userAttestations.length}
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="flex justify-between items-center w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-start items-center gap-2">
            <div className="w-8 h-8 rounded-full animate-pulse bg-skeleton" />
            <div className="bg-skeleton h-4 w-32 rounded-full animate-pulse" />
          </div>
          <div className="bg-skeleton h-8 w-12 rounded-full animate-pulse" />
        </motion.div>
      )}
    </motion.div>
  );
}
