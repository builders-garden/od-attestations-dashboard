import { motion } from "framer-motion";
import Link from "next/link";
import BadgeClass from "@/lib/classes/BadgeClass";
import { Button } from "../button";

interface BadgeProps {
  badge: BadgeClass;
}

export default function BadgeCard({ badge }: BadgeProps) {
  const { image, title, index, unlocked } = badge.getBadgeInfo();

  return (
    <motion.div
      className="flex flex-col justify-start items-center w-full p-3 gap-2 bg-secondary rounded-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: unlocked ? 1 : 0.5, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <h1 className="text-sm text-nowrap font-black">{title}</h1>
      <img alt="badge image" src={image}></img>
      <Button className="w-full h-6">
        <Link href={`/user/badge/${index}`}>Details</Link>
      </Button>
    </motion.div>
  );
}
