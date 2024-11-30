"use client";
import { Clouds } from "@/components/ui/clouds";
import { Icons } from "@/components/ui/icons";
import { Wrapper } from "@/components/ui/wrapper";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function Home() {
  const account = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (account.address) {
      router.push("/user");
    }
  }, [account, router]);

  return (
    <Wrapper className="justify-center overflow-hidden">
      {account.address ? (
        <Icons.spinner className="mr-2 h-10 w-10 animate-spin" />
      ) : (
        <div className="z-50 flex flex-col items-center gap-3.5">
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-3xl font-black">✨ Hello, Dreamer ✨</h1>
            <div className="text-sm text-center max-w-xs">
              Please connect your Wallet to start using the Onchain Dreamers
              Passport!
            </div>
          </div>
          <ConnectButton />
        </div>
      )}
      <Clouds />
    </Wrapper>
  );
}
