import { EnsProfileType } from "@/lib/ens";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const ViewCollectorsButtonAvatar: React.FC<{
  index: number;
  bgColor: string;
  ensProfile: EnsProfileType;
}> = ({ bgColor, ensProfile, index }) => {
  return ensProfile?.avatar ? (
    <motion.img
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      src={ensProfile.avatar}
      alt="avatar"
      className="w-5 h-5 rounded-full"
    />
  ) : (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className={cn(
        "flex justify-center items-center rounded-full w-4 h-4 p-2.5 text-xs",
        bgColor,
      )}
    >
      {ensProfile.address.slice(2, 3).toUpperCase()}
    </motion.div>
  );
};
