import { motion } from "framer-motion";
import Badge from "../Badge";
import { Button } from "../button";

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
        <Badge index={1} image="/badges/badge1.png" title="First Buyer" />
        <Badge index={2} image="/badges/badge2.png" title="Onchain Sherpa" />
        <Badge index={3} image="/badges/badge3.png" title="MEV Slayer" />
        <Badge index={4} image="/badges/badge4.png" title="Spirit Guide" />
        <Badge index={5} image="/badges/badge5.png" title="Pulcino Pio" />
        <Badge index={6} image="/badges/badge6.png" title="OCCHIO BRUCIA AHIA!!" />
      </div>
    </div>
  );
}
