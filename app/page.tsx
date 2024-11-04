/* eslint-disable @next/next/no-img-element */
"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";

interface ChickenTestBadgeProps {
  index: number;
}

const ChickenTestBadge = ({ index }: ChickenTestBadgeProps) => {
  return (
    <motion.div
      className="flex flex-col justify-center items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
    >
      <div className="bg-[#c1a68d] rounded-full h-41 w-41">
        <img alt="Chicken Test Badge" src="/badge.webp" className="h-40 w-40" />
      </div>
      <h2 className="font-bold text-black mt-2">Title</h2>
      <p className="text-center text-wrap text-sm">Description of this badge</p>
    </motion.div>
  );
};

export default function Home() {
  const account = useAccount();

  const badges = [
    { id: 1, title: "Badge 1", description: "Description of badge 1" },
    { id: 2, title: "Badge 2", description: "Description of badge 2" },
    { id: 3, title: "Badge 3", description: "Description of badge 3" },
    { id: 4, title: "Badge 4", description: "Description of badge 4" },
  ];

  if (!account.address) {
    return (
      <div className="flex justify-center items-center min-h-screen h-full w-full bg-background">
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-background">
      <div className="flex flex-col max-w-xl w-full min-h-screen justify-start items-center bg-white shadow-lg p-5">
        <ConnectButton />
        <div className="grid grid-cols-2 w-full gap-y-12 pt-10">
          {badges.map((badge, index) => (
            <ChickenTestBadge key={badge.id} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
