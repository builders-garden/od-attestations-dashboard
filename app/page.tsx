"use client";
import { Wrapper } from "@/components/ui/wrapper";
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
