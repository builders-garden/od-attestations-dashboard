import {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import SafeFactory from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";
import { Config, useConnectorClient, useChainId, useAccount } from "wagmi";
import { useMemo } from "react";
import type { Account, Chain, Client, Transport } from "viem";
import { ethers, providers } from "ethers";
import { sepolia } from "viem/chains";

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
const ApiKitContext = createContext<SafeApiKit | null>(null);

export const useProtocolKitOwner = () => useContext(ProtocolKitOwnerContext);
export const useApiKit = () => useContext(ApiKitContext);

export const SafeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const chainId = useChainId();

  const { address } = useAccount();

  const [protocolKitOwner, setProtocolKitOwner] = useState<SafeFactory | null>(
    null,
  );
  const [apiKit, setApiKit] = useState<SafeApiKit | null>(null);

  const init = async () => {
    if (!address) {
      console.error("Impossible to init SafeProvider without an address");
      return;
    }
    const protocolKitOwner = await SafeFactory.init({
      provider: window.ethereum,
      signer: address,
      safeAddress: "0x883ac919B42b9065C1Bc1Ea7560ba2924655762E",
    });
    const apiKit = new SafeApiKit({
      chainId: BigInt(sepolia.id), // set the correct chainId
    });
    setProtocolKitOwner(protocolKitOwner);
    setApiKit(apiKit);
  };

  useEffect(() => {
    init();
  }, [address]);

  return (
    <ProtocolKitOwnerContext.Provider value={protocolKitOwner}>
      <ApiKitContext.Provider value={apiKit}>{children}</ApiKitContext.Provider>
    </ProtocolKitOwnerContext.Provider>
  );
};
