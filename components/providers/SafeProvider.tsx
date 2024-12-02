import {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import SafeFactory from "@safe-global/protocol-kit";
import { Config, useConnectorClient, useChainId } from "wagmi";
import { providers } from "ethers";
import { useMemo } from "react";
import type { Account, Chain, Client, Transport } from "viem";

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

/** Hook to convert a Viem Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId });
  // @ts-ignore
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client]);
}

const ProtocolKitOwnerContext = createContext<SafeFactory | null>(null);

export const useProtocolKitOwner = () => useContext(ProtocolKitOwnerContext);

export const SafeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const chainId = useChainId();

  const signer = useEthersSigner({ chainId });

  const [protocolKitOwner, setProtocolKitOwner] = useState<SafeFactory | null>(
    null,
  );

  const init = async () => {
    const protocolKitOwner = await SafeFactory.init({
      provider: "https://1rpc.io/sepolia",
      // @ts-ignore
      signer,
      safeAddress: "0x883ac919B42b9065C1Bc1Ea7560ba2924655762E",
    });
    setProtocolKitOwner(protocolKitOwner);
  };

  useEffect(() => {
    init();
  }, [signer]);

  return (
    <ProtocolKitOwnerContext.Provider value={protocolKitOwner}>
      {children}
    </ProtocolKitOwnerContext.Provider>
  );
};
