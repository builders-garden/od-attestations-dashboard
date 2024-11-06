import { motion } from "framer-motion";
import { Button } from "../button";
import BadgeCard from "../badge/BadgeCard";
import { badges } from "@/lib/constants";

export default function AdminBadges() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Badges Header */}
      <motion.div
        className="flex flex-row justify-between items-end w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-black text-start text-black">Issued Badges</h1>
        <Button className="text-xs w-20 h-5 ">New Badge</Button>
      </motion.div>

      {/* Badges */}
      <div className="grid grid-cols-2 justify-start items-center gap-5 w-full">
        {badges.map((badge) => (
          <BadgeCard key={badge.index} badge={badge} />
        ))}
      </div>
    </div>
  );
}
