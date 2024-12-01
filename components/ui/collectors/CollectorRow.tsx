import { useEnsProfile } from "@/components/hooks/useEnsProfile";
import { adminAddresses } from "@/lib/constants";
import { getUserUniqueAttestations } from "@/lib/eas";
import { Attestation } from "@/lib/eas/types";
import { cn, shorten } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, CircleX } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAccount } from "wagmi";

interface CollectorRowProps {
  collector: string;
  index?: number;
  selectable?: boolean;
  selected?: boolean;
  removable?: boolean;
  onClick?: () => void;
  handleRemove?: (collector: string) => void;
  setCollectorsEns?: Dispatch<SetStateAction<Record<string, string>>>;
}

export default function CollectorRow({
  collector,
  index = 0,
  selectable,
  selected,
  removable,
  onClick,
  handleRemove,
  setCollectorsEns,
}: CollectorRowProps) {
  const isAddress = collector.startsWith("0x");
  const name = isAddress ? shorten(collector) : collector;
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
        adminAddresses,
        account.chain.id,
      );
      setUserAttestations(userAttestations);
    };

    fetchAttestations();
  }, [account.address, account.chain?.id]);

  const isFetching = loadingProfile || !userAttestations;

  useEffect(() => {
    if (ensProfile && setCollectorsEns) {
      setCollectorsEns((prev) => ({
        ...prev,
        [collector]: ensProfile.name ?? "",
      }));
    }
  }, [ensProfile, setCollectorsEns, collector]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 * index }}
      className={cn(
        "flex flex-row justify-center items-center w-full p-2 gap-2 bg-secondary rounded-lg transition-all duration-200 ease-in-out",
        !isFetching && selectable && "cursor-pointer hover:bg-green-200",
        !isFetching && selected && "bg-green-300 hover:bg-green-300",
      )}
      onClick={onClick}
    >
      {isFetching ? (
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
          <div className="flex justify-start items-center gap-2">
            <img
              src={ensProfile?.avatar ?? "/propic_placeholder.png"}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover"
            />

            <label
              className={cn(
                "font-medium",
                selectable && "cursor-pointer",
                isAddress && "font-mono",
              )}
            >
              {ensProfile?.name || name}
            </label>
          </div>
          {!(selectable || selected || removable) && (
            <div className="flex justify-center items-center text-center font-medium px-2.5 bg-primary rounded-lg text-white">
              {userAttestations.length}
            </div>
          )}
          {selected && (
            <Check
              size="2rem"
              className="bg-green-600 p-1 rounded-md text-white transition-all duration-200 ease-in-out"
            />
          )}
          {removable && handleRemove && (
            <CircleX
              size="2rem"
              className="bg-destructive p-1 rounded-md text-white transition-all duration-200 ease-in-out cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(collector);
              }}
            />
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
