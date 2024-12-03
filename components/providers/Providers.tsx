"use client";
import "@rainbow-me/rainbowkit/styles.css";
import {
  Chain,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import { SafeProvider } from "./SafeProvider";

const config = getDefaultConfig({
  appName: "OD Passport App",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  chains: [sepolia] as const satisfies Chain[],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <SafeProvider>{children}</SafeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
