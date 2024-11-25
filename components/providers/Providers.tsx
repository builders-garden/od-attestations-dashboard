"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { http, WagmiProvider } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import { createConfig, SafeProvider } from "@safe-global/safe-react-hooks";

const wagmiConfig = getDefaultConfig({
  appName: "OD Passport App",
  projectId: "21fef48091f12692cad574a6f7753643",
  transports: {
    [sepolia.id]: http(
      "https://eth-sepolia.g.alchemy.com/v2/cZS5C6pUs9vGcs7yWAo6Pv9Q28vfhBcI",
    ),
  },
  chains: [sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const safeConfig = createConfig({
  chain: sepolia,
  provider: "https://endpoints.omniatech.io/v1/eth/sepolia/public",
  signer: "0x883ac919B42b9065C1Bc1Ea7560ba2924655762E",
  safeAddress: "0x883ac919B42b9065C1Bc1Ea7560ba2924655762E",
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SafeProvider config={safeConfig}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </SafeProvider>
  );
}
