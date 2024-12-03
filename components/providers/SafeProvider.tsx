import {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import SafeFactory from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";
import { Config, useConnectorClient, useChainId } from "wagmi";
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

export function clientToProvider(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  return provider;
}

/** Hook to convert a Viem Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId });
  // @ts-ignore
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client]);
}

export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId });
  // @ts-ignore
  return useMemo(() => (client ? clientToProvider(client) : undefined), [client]);
}

const ProtocolKitOwnerContext = createContext<SafeFactory | null>(null);
const ApiKitContext = createContext<SafeApiKit | null>(null);

export const useProtocolKitOwner = () => useContext(ProtocolKitOwnerContext);
export const useApiKit = () => useContext(ApiKitContext);

export const SafeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const chainId = useChainId();

  const signer = useEthersSigner({ chainId });
  const provider = useEthersProvider({ chainId });

  const [protocolKitOwner, setProtocolKitOwner] = useState<SafeFactory | null>(
    null,
  );

  const [apiKit, setApiKit] = useState<SafeApiKit | null>(null);

  const init = async () => {
    const protocolKitOwner = await SafeFactory.init({
      provider: window.ethereum,
      signer: await signer?.getAddress(),
      safeAddress: "0x883ac919B42b9065C1Bc1Ea7560ba2924655762E",
    });
    const apiKit = new SafeApiKit({
      chainId: BigInt(sepolia.id), // set the correct chainId
      // txServiceUrl: "https://safe-transaction-sepolia.safe.global",
    });
    setProtocolKitOwner(protocolKitOwner);
    setApiKit(apiKit);
  };

  useEffect(() => {
    init();
  }, [signer]);

  return (
    <ProtocolKitOwnerContext.Provider value={protocolKitOwner}>
      <ApiKitContext.Provider value={apiKit}>{children}</ApiKitContext.Provider>
    </ProtocolKitOwnerContext.Provider>
  );
};
