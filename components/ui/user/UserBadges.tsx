import { motion } from "framer-motion";
import BadgeCard from "../badge/BadgeCard";
import { userBadges } from "@/lib/constants";

export default function UserBadges() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Badges Header */}
      <motion.div
        className="flex flex-row justify-between items-end w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-black text-start text-black">Your Badges</h1>
        <div className="text-xs">Owned 3/27</div>
      </motion.div>

      {/* Badges */}
      <div className="grid grid-cols-2 justify-start items-center gap-5 w-full">
        {userBadges.map((badge) => (
          <BadgeCard key={badge.index} badge={badge} />
        ))}
      </div>
    </div>
  );
}
