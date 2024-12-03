import { cn, isAdmin } from "@/lib/utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { ReactNode, useEffect } from "react";
import { useAccount } from "wagmi";
import { Clouds } from "./clouds";
import { usePathname, useRouter } from "next/navigation";
import { Icons } from "./icons";

interface WrapperProps {
  children: ReactNode;
  className?: string;
}

export const Wrapper = ({ children, className }: WrapperProps) => {
  const account = useAccount();
  const router = useRouter();
  const pathname = usePathname();

  const adminPages = ["/new-schema", "/revoke", "/reissue", "/new-badge"];
  const isAdminPage = adminPages.some((page) => pathname.includes(page));
  const userIsAdmin = isAdmin(account);

  useEffect(() => {
    if (account.isConnected && isAdminPage && !userIsAdmin) {
      router.push("/user");
    }
  }, [account.isConnected, isAdminPage, userIsAdmin, router]);

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
            <div className="flex m-auto">
              <ConnectButton />
            </div>
            <Clouds />
          </>
        ) : isAdminPage && !userIsAdmin ? (
          <div className="flex justify-center items-center w-full h-full mt-32">
            <Icons.spinner className="mr-2 h-10 w-10 animate-spin" />
          </div>
        ) : (
          children
        )}
      </motion.div>
    </div>
  );
};
