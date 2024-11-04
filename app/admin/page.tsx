/* eslint-disable @next/next/no-img-element */
"use client";
import { ADMIN_ADDRESSES } from "@/lib/constants";
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
  } else if (!ADMIN_ADDRESSES.includes(account.address)) {
    return (
      <div className="flex justify-center items-center min-h-screen h-full w-full bg-background">
        <div className="flex flex-col max-w-xl w-full min-h-screen justify-start items-center bg-white shadow-lg p-5">
          <ConnectButton />
          <div className="pt-10">You should not be here</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen h-full w-full bg-background">
      <div className="flex flex-col max-w-xl w-full min-h-screen justify-start items-center bg-white shadow-lg p-5">
        <ConnectButton />
        <div className="pt-10">Admin Page</div>
      </div>
    </div>
  );
}
