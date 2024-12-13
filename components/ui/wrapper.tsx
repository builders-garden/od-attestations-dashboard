import { cn, getEnvironmentChainId } from "@/lib/utils";
import { ConnectButton, useChainModal } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { ReactNode, useEffect } from "react";
import { useAccount } from "wagmi";
import { Clouds } from "./clouds";
import { usePathname, useRouter } from "next/navigation";
import { Icons } from "./icons";
import { useSafeContext } from "../providers/SafeProvider";
import { ETHEREUM_SEPOLIA_CHAIN_ID } from "@/lib/eas/constants";
import { Button } from "./button";
import { Cuboid } from "lucide-react";

interface WrapperProps {
  children?: ReactNode;
  className?: string;
}

export const Wrapper = ({ children, className }: WrapperProps) => {
  const account = useAccount();
  const router = useRouter();
  const pathname = usePathname();

  const adminPages = ["/new-schema", "/revoke", "/reissue", "/new-badge"];
  const isAdminPage = adminPages.some((page) => pathname.includes(page));
  const { isAdmin } = useSafeContext();
  const { openChainModal } = useChainModal();

  useEffect(() => {
    if (
      account.isConnected &&
      isAdminPage &&
      isAdmin !== undefined &&
      !isAdmin
    ) {
      router.push("/user");
    }
  }, [account.isConnected, isAdminPage, isAdmin, router]);

  return (
    <div className="flex justify-center items-center h-full w-full bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "relative flex flex-col justify-start items-center sm:min-h-[calc(100vh-3rem)] min-h-screen w-full sm:max-w-md bg-background rounded-lg sm:shadow-lg p-6 sm:m-6 overflow-hidden",
          className,
        )}
      >
        {!account.isConnected ? (
          <>
            <div className="z-50 flex flex-col items-center gap-3.5 m-auto">
              <div className="flex flex-col items-center gap-1">
                <h1 className="text-3xl font-black">✨ Hello, Dreamer ✨</h1>
                <div className="text-sm text-center max-w-xs">
                  Please <b>connect</b> your Wallet to start using the Onchain
                  Dreamers Passport!
                </div>
              </div>
              <ConnectButton />
            </div>
            <Clouds />
          </>
        ) : account.isConnected &&
          account.chain?.id !== getEnvironmentChainId() ? (
          <>
            <div className="z-50 flex flex-col flex-grow justify-center items-center gap-3.5">
              <div className="flex flex-col items-center gap-1">
                <h1 className="text-3xl font-black">One more step...</h1>
                <div className="text-sm text-center max-w-xs">
                  Please <b>switch</b> the selected chain to{" "}
                  <b>
                    {getEnvironmentChainId() === ETHEREUM_SEPOLIA_CHAIN_ID
                      ? "Sepolia"
                      : "Base"}{" "}
                  </b>
                  to start using the Onchain Dreamers Passport!
                </div>
              </div>
              <Button
                className="flex items-center gap-2"
                onClick={openChainModal}
              >
                <Cuboid className="w-6 h-6" />
                <span>Switch Chain</span>
              </Button>
            </div>
            <Clouds />
          </>
        ) : isAdminPage && !isAdmin ? (
          <div className="flex justify-center items-center w-full h-full m-auto">
            <Icons.spinner className="mr-2 h-10 w-10 animate-spin" />
          </div>
        ) : (
          children
        )}
      </motion.div>
    </div>
  );
};
