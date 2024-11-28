"use client";
import { motion } from "framer-motion";
import { Separator } from "../separator";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useDisconnect } from "wagmi";
import { Attestation } from "@/lib/eas/types";
import { useCountUp } from "@/components/hooks/useCountUp";

interface UserHeaderProps {
  isAdmin: boolean;
  userAttestationsLength: number;
}

export default function UserHeader({
  isAdmin,
  userAttestationsLength,
}: UserHeaderProps) {
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const userAttestationsCount = useCountUp(userAttestationsLength, 2000); // 2 seconds duration

  return (
    <>
      <motion.div
        className="flex flex-row justify-between items-start w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl font-black text-start text-black">
            GM Dreamer!👋
          </h1>
          <div className="text-sm text-start text-black">
            You currently hold{" "}
            <span>
              {userAttestationsCount +
                (userAttestationsCount !== 1 ? " badges" : " badge")}
            </span>
          </div>
        </div>
        {isAdmin ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Menu
                size={40}
                className="text-primary cursor-pointer hover:text-primary/70 transition-all duration-200 ease-in-out"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/user/new-schema")}
              >
                New Schema
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/user/new-badge")}
              >
                New Badge
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Proposals
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => disconnect()}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <img
            alt="Profile Picture"
            src="./propic_placeholder.png"
            className="h-14 w-14"
          />
        )}
      </motion.div>
      <Separator />
    </>
  );
}
