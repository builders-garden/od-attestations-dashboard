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

  return <Wrapper className="justify-center overflow-hidden" />;
}
