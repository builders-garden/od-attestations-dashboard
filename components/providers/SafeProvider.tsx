import {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import SafeFactory from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";
import { useAccount } from "wagmi";
import { sepolia } from "viem/chains";

// Create a context to store the instances of the SafeFactory and SafeApiKit
const SafeKitContext = createContext<{
  protocolKit: SafeFactory | null;
  apiKit: SafeApiKit | null;
}>({ protocolKit: null, apiKit: null });

// Create a hook to access the SafeFactory and SafeApiKit instances
export const useSafeKit = () => useContext(SafeKitContext);

export const SafeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { address } = useAccount();
  const [protocolKit, setProtocolKitOwner] = useState<SafeFactory | null>(null);
  const [apiKit, setApiKit] = useState<SafeApiKit | null>(null);

  useEffect(() => {
    const init = async () => {
      if (!address) {
        console.log("Impossible to init SafeProvider without an address");
        return;
      }
      if (!process.env.NEXT_PUBLIC_SAFE_ADDRESS) {
        console.error("Impossible to init SafeProvider without a Safe address");
        return;
      }
      const protocolKit = await SafeFactory.init({
        provider: window.ethereum,
        signer: address,
        safeAddress: process.env.NEXT_PUBLIC_SAFE_ADDRESS,
      });
      const apiKit = new SafeApiKit({
        chainId: BigInt(sepolia.id), // TODO: set the base chainId
      });
      setProtocolKitOwner(protocolKit);
      setApiKit(apiKit);
    };

    init();
  }, [address]);

  return (
    <SafeKitContext.Provider value={{ protocolKit, apiKit }}>
      {children}
    </SafeKitContext.Provider>
  );
};
