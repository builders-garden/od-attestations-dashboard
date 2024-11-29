import { motion } from "framer-motion";
import Link from "next/link";
import BadgeClass from "@/lib/classes/BadgeClass";
import { Button } from "../button";
import { getImageFromIpfs } from "@/lib/ipfs";
import { useEffect, useState } from "react";

interface BadgeProps {
  badge: BadgeClass;
  index: number;
}

export default function BadgeCard({ badge, index }: BadgeProps) {
  const { image, title, unlocked, attestationUID } = badge.getBadgeInfo();
  const [imageURL, setImageURL] = useState<string>("");
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchImageURL = async () => {
      setImageLoading(true);
      if (image) {
        const imageURL = await getImageFromIpfs(image);
        if (imageURL) {
          setImageURL(imageURL);
        }
      }
      setImageLoading(false);
    };
    fetchImageURL();
  }, [image]);

  return (
    <Link href={`/user/badge/${attestationUID}`}>
      <motion.div
        className="flex flex-col justify-between items-center w-full h-full pt-3 pb-5 gap-2 hover:bg-secondary-dark bg-secondary rounded-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: unlocked ? 1 : 0.5, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.25 }}
      >
        <h1 className="text-sm text-wrap font-black text-center">{title}</h1>
        {imageLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-skeleton animate-pulse rounded-full w-28 h-28"
          />
        ) : imageURL ? (
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            alt="badge image"
            className="rounded-full w-28 h-28 object-cover"
            src={imageURL}
            width={100}
            height={100}
          />
        ) : (
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            alt="badge image"
            className="rounded-full w-28 h-28 object-cover"
            src={"/badges/badge_placeholder.png"}
            width={100}
            height={100}
          />
        )}
      </motion.div>
    </Link>
  );
}
