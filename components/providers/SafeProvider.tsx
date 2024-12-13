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
import { getEnvironmentChainId } from "@/lib/utils";

// Create a context to store the instances of the SafeFactory and SafeApiKit
const SafeKitContext = createContext<{
  protocolKit: SafeFactory | null;
  apiKit: SafeApiKit | null;
  ownerAddresses: string[];
  safeAddress: string | null;
  adminAddresses: string[];
  isAdmin: boolean | undefined;
}>({
  protocolKit: null,
  apiKit: null,
  ownerAddresses: [],
  safeAddress: null,
  adminAddresses: [],
  isAdmin: false,
});

// Create a hook to access the SafeFactory and SafeApiKit instances
export const useSafeContext = () => useContext(SafeKitContext);

export const SafeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const account = useAccount();
  const [protocolKit, setProtocolKit] = useState<SafeFactory | null>(null);
  const [apiKit, setApiKit] = useState<SafeApiKit | null>(null);
  const [ownerAddresses, setOwnerAddresses] = useState<string[]>([]);
  const [safeAddress, setSafeAddress] = useState<string | null>(null);
  const [adminAddresses, setAdminAddresses] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>();

  useEffect(() => {
    const init = async () => {
      if (
        !account.address ||
        !window.ethereum ||
        account.chainId !== getEnvironmentChainId()
      ) {
        return;
      }
      const safeAddress = process.env.NEXT_PUBLIC_SAFE_ADDRESS;
      if (!safeAddress) {
        console.error("Impossible to init SafeProvider without a Safe address");
        return;
      }
      const protocolKit = await SafeFactory.init({
        provider: window.ethereum,
        signer: account.address,
        safeAddress: safeAddress,
      });
      const apiKit = new SafeApiKit({
        chainId: BigInt(getEnvironmentChainId()),
      });
      const ownerAddresses = await protocolKit.getOwners();
      setProtocolKit(protocolKit);
      setApiKit(apiKit);
      setOwnerAddresses(ownerAddresses);
      setSafeAddress(safeAddress);
      setAdminAddresses([...ownerAddresses, safeAddress]);
      setIsAdmin([...ownerAddresses, safeAddress].includes(account.address));
    };

    init();
  }, [account, getEnvironmentChainId]);

  return (
    <SafeKitContext.Provider
      value={{
        protocolKit,
        apiKit,
        ownerAddresses,
        safeAddress,
        adminAddresses,
        isAdmin,
      }}
    >
      {children}
    </SafeKitContext.Provider>
  );
};
