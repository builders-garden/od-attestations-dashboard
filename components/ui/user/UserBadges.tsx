import { motion } from "framer-motion";
import BadgeCard from "../badge/BadgeCard";
import { Attestation } from "@/lib/eas/types";
import { useCountUp } from "@/components/hooks/useCountUp";
import { useCreateBadges } from "@/components/hooks/useCreateBadges";
import { useEffect, useMemo, useState } from "react";
import { Switch } from "../switch";
import PaginatorButtons from "../paginatorButtons";
import Badge from "@/lib/classes/BadgeClass";

interface UserBadgesProps {
  userAttestations: Attestation[];
  allAttestations: Attestation[];
}

export default function UserBadges({
  userAttestations,
  allAttestations,
}: UserBadgesProps) {
  const [showAll, setShowAll] = useState<boolean>(false);
  const userAttestationsCount = useCountUp(userAttestations.length, 2000); // 2 seconds duration
  const allBadges = useCreateBadges(userAttestations, allAttestations).filter(
    (badge) => showAll || badge.unlocked,
  );

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const paginatedBadges: Badge[] = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allBadges.slice(startIndex, endIndex);
  }, [allBadges, currentPage]);

  const totalPages = Math.ceil(allBadges.length / itemsPerPage);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Badges Header */}
      <motion.div
        className="flex flex-row justify-between items-end w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-start items-center gap-3.5">
          <h1 className="text-2xl font-black text-start text-black">
            Your Badges
          </h1>
          <div className="flex justify-start items-center gap-1.5">
            <Switch
              checked={showAll}
              onCheckedChange={() => {
                setShowAll(!showAll);
                setCurrentPage(1);
              }}
            />
            <label className="text-xs" htmlFor="show-all">
              Show All
            </label>
          </div>
        </div>
        <div className="text-xs">
          Owned {userAttestationsCount}/{allAttestations.length}
        </div>
      </motion.div>

      {/* Badges */}
      <div className="grid grid-cols-2 justify-start items-center gap-5 w-full">
        {paginatedBadges.map((badge, index) => {
          return <BadgeCard key={index} index={index + 1} badge={badge} />;
        })}
      </div>
      {totalPages > 1 && (
        <PaginatorButtons
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
