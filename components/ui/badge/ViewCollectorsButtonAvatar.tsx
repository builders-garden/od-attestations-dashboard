import { useEnsProfile } from "@/components/hooks/useEnsProfile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const ViewCollectorsButtonAvatar: React.FC<{
  index: number;
  bgColor: string;
  collector: string;
}> = ({ bgColor, collector, index }) => {
  const { ensProfile } = useEnsProfile(collector);

  return ensProfile ? (
    ensProfile.avatar ? (
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
          "flex justify-center items-center rounded-full w-5 h-5 p-2.5 text-xs",
          bgColor,
        )}
      >
        {ensProfile.address.slice(2, 3).toUpperCase()}
      </motion.div>
    )
  ) : (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className="w-5 h-5 rounded-full bg-skeleton animate-pulse"
    />
  );
};
