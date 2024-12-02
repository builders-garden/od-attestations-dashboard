import { EnsProfileType } from "@/lib/ens";
import { cn, shorten } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, CircleX } from "lucide-react";
import { Dispatch, SetStateAction, useEffect } from "react";

interface CollectorRowProps {
  profile: EnsProfileType;
  index?: number;
  selectable?: boolean;
  selected?: boolean;
  removable?: boolean;
  onClick?: () => void;
  handleRemove?: (collector: string) => void;
  setCollectorsEns?: Dispatch<SetStateAction<Record<string, string>>>;
}

export default function CollectorRow({
  profile,
  index = 0,
  selectable,
  selected,
  removable,
  onClick,
  handleRemove,
  setCollectorsEns,
}: CollectorRowProps) {
  const isAddress = profile.address.startsWith("0x");
  const name = isAddress ? shorten(profile.address) : profile.name;

  useEffect(() => {
    if (profile && setCollectorsEns) {
      setCollectorsEns((prev) => ({
        ...prev,
        [profile.address]: profile.name ?? "",
      }));
    }
  }, [profile, setCollectorsEns, profile.address]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className={cn(
        "flex flex-row justify-center items-center w-full p-2 gap-2 bg-secondary rounded-lg transition-all duration-200 ease-in-out",
        selectable && "cursor-pointer hover:bg-green-200",
        selected && "bg-green-300 hover:bg-green-300",
      )}
      onClick={onClick}
    >
      {false ? (
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
              src={
                profile.avatar && profile.avatar.startsWith("http")
                  ? profile.avatar
                  : "/propic_placeholder.png"
              }
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
              {profile.name || name}
            </label>
          </div>
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
                handleRemove(profile.address);
              }}
            />
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
