import { useEnsProfile } from "@/components/hooks/useEnsProfile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, CircleX } from "lucide-react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Button } from "../button";

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
  const { ensProfile } = useEnsProfile(collector);

  useEffect(() => {
    if (ensProfile && setCollectorsEns) {
      setCollectorsEns((prev) => ({
        ...prev,
        [ensProfile.address.toLowerCase()]: ensProfile.identity ?? "",
      }));
    }
  }, [ensProfile, setCollectorsEns]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.1 * index }}
      className={cn(
        "flex flex-row justify-center items-center w-full p-2 gap-2 bg-secondary rounded-lg transition-all duration-200 ease-in-out",
        selectable && "cursor-pointer hover:bg-green-200",
        selected && "bg-green-300 hover:bg-green-300",
      )}
      onClick={onClick}
    >
      {ensProfile ? (
        <motion.div
          className="flex justify-between items-center w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-start items-center gap-2">
            <img
              src={
                ensProfile.avatar && ensProfile.avatar.startsWith("http")
                  ? ensProfile.avatar
                  : "/propic_placeholder.png"
              }
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover"
            />

            <label
              className={cn(
                "font-medium font-mono",
                selectable && "cursor-pointer",
              )}
            >
              {ensProfile.displayName}
            </label>
          </div>
          {selected && (
            <Check
              size="2rem"
              className="bg-green-600 p-1 rounded-md text-white transition-all duration-200 ease-in-out"
            />
          )}
          {removable && handleRemove && (
            <Button
              variant="destructive"
              className="flex justify-center items-center h-8 w-8 rounded-md"
              onClick={(e) => {
                e.preventDefault();
                handleRemove(collector);
              }}
            >
              <CircleX />
            </Button>
          )}
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
            <div className="bg-skeleton h-4 w-56 rounded-md animate-pulse" />
          </div>
          <div className="bg-skeleton h-7 w-7 rounded-md animate-pulse" />
        </motion.div>
      )}
    </motion.div>
  );
}
