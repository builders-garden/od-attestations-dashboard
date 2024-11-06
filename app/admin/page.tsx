"use client";
import AdminBadges from "@/components/ui/admin/AdminBadges";
import AdminHeader from "@/components/ui/admin/AdminHeader";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function Home() {
  const account = useAccount();

  if (!account.address) {
    return (
      <div className="flex justify-center items-center min-h-screen h-full w-full bg-background">
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-background sm:p-6">
      <div className="flex flex-col justify-start items-center min-h-screen w-full sm:max-w-md bg-background rounded-lg sm:shadow-lg p-6">
        <AdminHeader />
        <AdminBadges />
      </div>
    </div>
  );
}
