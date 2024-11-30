import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface WrapperProps {
  children: ReactNode;
  className?: string;
}

export const Wrapper = ({ children, className }: WrapperProps) => {
  return (
    <div className="flex justify-center items-center h-full w-full bg-background sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "relative flex flex-col justify-start items-center sm:min-h-[calc(100vh-3rem)] w-full sm:max-w-md bg-background rounded-lg sm:shadow-lg p-6",
          className,
        )}
      >
        {children}
      </motion.div>
    </div>
  );
};
