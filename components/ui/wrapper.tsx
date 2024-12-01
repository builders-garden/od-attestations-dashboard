import { cn } from "@/lib/utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useAccount } from "wagmi";
import { Clouds } from "./clouds";

interface WrapperProps {
  children: ReactNode;
  className?: string;
}

export const Wrapper = ({ children, className }: WrapperProps) => {
  const account = useAccount();

  return (
    <div className="flex justify-center items-center h-full w-full bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "relative flex flex-col justify-start items-center sm:min-h-[calc(100vh-3rem)] min-h-screen w-full sm:max-w-md bg-background rounded-lg sm:shadow-lg p-6 sm:m-6",
          !account.isConnected && "overflow-hidden justify-center",
          className,
        )}
      >
        {!account.isConnected ? (
          <>
            <ConnectButton />
            <Clouds />
          </>
        ) : (
          children
        )}
      </motion.div>
    </div>
  );
};
