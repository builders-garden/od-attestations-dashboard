import { motion } from "framer-motion";
import Badge from "../Badge";

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
        <Badge index={1} image="/badges/badge1.png" title="First Buyer" />
        <Badge index={2} image="/badges/badge2.png" title="Onchain Sherpa" />
        <Badge index={3} image="/badges/badge3.png" title="MEV Slayer" />
        <Badge index={4} image="/badges/badge4.png" unlocked={false} title="Spirit Guide" />
        <Badge index={5} image="/badges/badge5.png" unlocked={false} title="Pulcino Pio" />
        <Badge index={6} image="/badges/badge6.png" unlocked={false} title="OCCHIO BRUCIA AHIA!!" />
      </div>
    </div>
  );
}
