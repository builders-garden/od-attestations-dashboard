"use client";
import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { createConfig, http, WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import {
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [walletConnectWallet, safeWallet],
    },
  ],
  {
    appName: "OD Passport App",
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  },
);

const config = createConfig({
  connectors,
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(
      "https://eth-sepolia.g.alchemy.com/v2/cZS5C6pUs9vGcs7yWAo6Pv9Q28vfhBcI", // TODO: change it to OD Alchemy key from .env
    ),
  },
  ssr: true, // If your dApp uses server side rendering (SSR)
});

// const config = getDefaultConfig({
//   appName: "OD Passport App",
//   projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
//   chains: [sepolia],
//   transports: {
//     [sepolia.id]: http(
//       "https://eth-sepolia.g.alchemy.com/v2/cZS5C6pUs9vGcs7yWAo6Pv9Q28vfhBcI", // TODO: change it to OD Alchemy key from .env
//     ),
//   },
//   ssr: true, // If your dApp uses server side rendering (SSR)
// });

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
